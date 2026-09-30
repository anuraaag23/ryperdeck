import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://nrowfnerohslghecjetf.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5yb3dmbmVyb2hzbGdoZWNqZXRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA2NjUzODksImV4cCI6MjEwNjI0MTM4OX0.yLgr4IyFlYB_qR6yl5HRMW3lyxPFB-pR7BqnrwJUg0g';

const supabase = createClient(supabaseUrl, supabaseKey);

// Regex to strip any URLs or links from webhook messages
const LINK_REGEX = /(?:https?:\/\/|ftp:\/\/|www\.)[^\s/$.?#].[^\s]*|\b(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+(?:com|org|net|io|co|in|ai|me|xyz|app|dev|gg)\b(?:\/[^\s]*)?/gi;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let payload = req.body;

    // Ko-fi can send data as x-www-form-urlencoded with a 'data' field containing JSON string
    if (typeof payload === 'string') {
      try {
        payload = JSON.parse(payload);
      } catch {
        const params = new URLSearchParams(payload);
        const dataStr = params.get('data');
        if (dataStr) payload = JSON.parse(dataStr);
      }
    } else if (payload && payload.data) {
      if (typeof payload.data === 'string') {
        payload = JSON.parse(payload.data);
      } else {
        payload = payload.data;
      }
    }

    if (!payload || !payload.kofi_transaction_id) {
      return res.status(400).json({ error: 'Missing or invalid Ko-fi transaction payload' });
    }

    const {
      from_name,
      amount,
      message,
      kofi_transaction_id,
      email
    } = payload;

    const numAmount = Number(amount) || 50;
    const cups = Math.max(1, Math.round(numAmount / 50));
    const cleanName = (from_name || 'Anonymous Supporter').replace(/<[^>]*>/g, '').replace(LINK_REGEX, '').trim().slice(0, 80);
    const cleanMessage = message ? message.replace(/<[^>]*>/g, '').replace(LINK_REGEX, '').trim().slice(0, 350) : null;
    const transactionId = String(kofi_transaction_id).trim();

    // Check if supporter already exists with this transaction ID
    const { data: existing } = await supabase
      .from('supporters')
      .select('id')
      .eq('payment_id', transactionId)
      .limit(1);

    if (existing && existing.length > 0) {
      // Mark existing review as verified immediately!
      await supabase
        .from('supporters')
        .update({ verified: true })
        .eq('id', existing[0].id);
    } else {
      // Insert new verified supporter
      await supabase.from('supporters').insert([
        {
          name: cleanName,
          amount: numAmount,
          cups: cups,
          rating: 5,
          message: cleanMessage,
          payment_id: transactionId,
          verified: true,
        },
      ]);
    }

    return res.status(200).json({ success: true, message: 'Ko-fi donation verified & published successfully' });
  } catch (err) {
    console.error('Ko-fi webhook error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
