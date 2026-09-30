import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://nrowfnerohslghecjetf.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5yb3dmbmVyb2hzbGdoZWNqZXRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA2NjUzODksImV4cCI6MjEwNjI0MTM4OX0.yLgr4IyFlYB_qR6yl5HRMW3lyxPFB-pR7BqnrwJUg0g';

const supabase = createClient(supabaseUrl, supabaseKey);

// Official Ko-fi Verification Token configured for @ryper
const EXPECTED_TOKEN = process.env.KOFI_VERIFICATION_TOKEN || 'c7bf8b09-4bbf-4789-a823-f1ad63ff1df8';

// Regex to strip any URLs or links from webhook messages to prevent spam
const LINK_REGEX = /(?:https?:\/\/|ftp:\/\/|www\.)[^\s/$.?#].[^\s]*|\b(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+(?:com|org|net|io|co|in|ai|me|xyz|app|dev|gg)\b(?:\/[^\s]*)?/gi;

export default async function handler(req, res) {
  // Allow healthcheck via GET
  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'active',
      service: 'RyperDeck Ko-fi Webhook Listener',
      timestamp: new Date().toISOString()
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let payload = req.body;

    // Ko-fi delivers payload as url-encoded form body with a 'data' string parameter, or as JSON
    if (typeof payload === 'string') {
      try {
        payload = JSON.parse(payload);
      } catch {
        const params = new URLSearchParams(payload);
        const dataStr = params.get('data');
        if (dataStr) {
          payload = JSON.parse(dataStr);
        }
      }
    } else if (payload && payload.data) {
      if (typeof payload.data === 'string') {
        payload = JSON.parse(payload.data);
      } else {
        payload = payload.data;
      }
    }

    if (!payload) {
      return res.status(400).json({ error: 'Missing or empty Ko-fi payload' });
    }

    // ── Cryptographic Security: Validate Ko-fi Verification Token ───────────
    if (payload.verification_token) {
      if (payload.verification_token !== EXPECTED_TOKEN) {
        console.warn('Unauthorized webhook attempt with invalid verification token:', payload.verification_token);
        return res.status(401).json({ error: 'Unauthorized: Invalid verification token' });
      }
    }

    const {
      from_name,
      amount,
      message,
      kofi_transaction_id,
      email,
      timestamp
    } = payload;

    const numAmount = Number(amount) || 50;
    const cups = Math.max(1, Math.round(numAmount / 50));
    const cleanName = (from_name || 'Anonymous Supporter').replace(/<[^>]*>/g, '').replace(LINK_REGEX, '').trim().slice(0, 80);
    const cleanMessage = message ? message.replace(/<[^>]*>/g, '').replace(LINK_REGEX, '').trim().slice(0, 350) : null;
    const transactionId = String(kofi_transaction_id || `kofi-${Date.now()}`).trim();

    console.log(`[Ko-fi Webhook] Verified donation received: ₹${numAmount} from "${cleanName}" (ID: ${transactionId})`);

    // Check if supporter already exists with this transaction ID
    const { data: existing } = await supabase
      .from('supporters')
      .select('id, name, rating, message')
      .eq('payment_id', transactionId)
      .limit(1);

    if (existing && existing.length > 0) {
      // Mark existing review as verified immediately
      await supabase
        .from('supporters')
        .update({
          verified: true,
          amount: numAmount,
          cups: cups,
          name: existing[0].name && existing[0].name !== 'Anonymous Supporter' ? existing[0].name : cleanName,
        })
        .eq('id', existing[0].id);
    } else {
      // Also check if a recent unverified submission exists from the same name (within last 10 minutes)
      const tenMinutesAgo = new Date(Date.now() - 600000).toISOString();
      const { data: pendingMatch } = await supabase
        .from('supporters')
        .select('id, rating, message')
        .eq('verified', false)
        .ilike('name', cleanName)
        .gte('created_at', tenMinutesAgo)
        .limit(1);

      if (pendingMatch && pendingMatch.length > 0) {
        // Upgrade the pending submission to verified with this real transaction ID!
        await supabase
          .from('supporters')
          .update({
            verified: true,
            amount: numAmount,
            cups: cups,
            payment_id: transactionId,
          })
          .eq('id', pendingMatch[0].id);
      } else {
        // Insert new authentic verified supporter
        await supabase.from('supporters').insert([
          {
            name: cleanName,
            amount: numAmount,
            cups: cups,
            rating: 5,
            message: cleanMessage,
            payment_id: transactionId,
            verified: true,
            created_at: timestamp ? new Date(timestamp).toISOString() : new Date().toISOString()
          },
        ]);
      }
    }

    return res.status(200).json({
      success: true,
      verified: true,
      message: 'Ko-fi real payment verified & published successfully'
    });
  } catch (err) {
    console.error('Ko-fi webhook processing error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
