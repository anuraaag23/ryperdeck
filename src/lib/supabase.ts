import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('placeholder'));
};

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

// ── Types ─────────────────────────────────────────────────────────────
export interface DbSubscriber {
  id?: string;
  email: string;
  created_at?: string;
}

export interface DbBugReport {
  id?: string;
  what: string;
  email?: string;
  file_name?: string;
  drive_url?: string;
  created_at?: string;
}

export interface DbFeatureRequest {
  id?: string;
  title: string;
  description: string;
  name?: string;
  email?: string;
  votes: number;
  status: 'requested' | 'planned' | 'building' | 'done';
  created_at?: string;
}

export interface DbSupporter {
  id?: string;
  name: string;
  amount: number;
  cups: number;
  rating: number;
  message?: string;
  payment_id?: string;
  verified?: boolean;
  created_at?: string;
}

// ── Fallback LocalStorage Helpers (used when Supabase keys not set yet) ─
const LS_KEYS = {
  emails: 'ryperdeck_notify_emails',
  bugs: 'ryperdeck_bugs',
  features: 'ryperdeck_features',
  supporters: 'ryperdeck_supporters_leaderboard',
};

// ── Subscribers ───────────────────────────────────────────────────────
export async function submitSubscriberEmail(email: string): Promise<{ success: boolean; error?: string }> {
  const trimmed = email.trim();
  if (!trimmed) return { success: false, error: 'Email is required' };

  if (supabase) {
    try {
      const { error } = await supabase.from('subscribers').insert([{ email: trimmed }]);
      if (error) {
        // If unique constraint error, consider it a success
        if (error.code === '23505') return { success: true };
        console.error('Supabase subscriber error:', error);
      } else {
        return { success: true };
      }
    } catch (err: any) {
      console.error('Failed to submit email to Supabase:', err);
    }
  }

  // Local fallback
  try {
    const list: string[] = JSON.parse(localStorage.getItem(LS_KEYS.emails) || '[]');
    if (!list.includes(trimmed)) {
      list.unshift(trimmed);
      localStorage.setItem(LS_KEYS.emails, JSON.stringify(list));
    }
    return { success: true };
  } catch {
    return { success: false, error: 'Storage error' };
  }
}

export async function fetchSubscribers(): Promise<DbSubscriber[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('subscribers')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) return data;
      console.error('Error fetching subscribers from Supabase:', error);
    } catch (err) {
      console.error(err);
    }
  }

  // Local fallback
  try {
    const list: string[] = JSON.parse(localStorage.getItem(LS_KEYS.emails) || '[]');
    return list.map((e, idx) => ({ id: `local-${idx}`, email: e, created_at: new Date().toISOString() }));
  } catch {
    return [];
  }
}

// ── Bug Reports ───────────────────────────────────────────────────────
export async function submitBugReport(bug: {
  what: string;
  email?: string;
  fileName?: string;
  driveUrl?: string;
}): Promise<{ success: boolean; error?: string }> {
  if (supabase) {
    try {
      const { error } = await supabase.from('bug_reports').insert([
        {
          what: bug.what.trim(),
          email: bug.email?.trim() || null,
          file_name: bug.fileName || null,
          drive_url: bug.driveUrl || null,
        },
      ]);
      if (!error) return { success: true };
      console.error('Supabase bug report error:', error);
    } catch (err: any) {
      console.error('Failed to submit bug report to Supabase:', err);
    }
  }

  // Local fallback
  try {
    const list = JSON.parse(localStorage.getItem(LS_KEYS.bugs) || '[]');
    list.unshift({
      what: bug.what,
      email: bug.email,
      fileName: bug.fileName,
      driveUrl: bug.driveUrl,
      date: new Date().toISOString(),
    });
    localStorage.setItem(LS_KEYS.bugs, JSON.stringify(list));
    return { success: true };
  } catch {
    return { success: false, error: 'Storage error' };
  }
}

export async function fetchBugReports(): Promise<DbBugReport[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('bug_reports')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) return data;
      console.error('Error fetching bug reports from Supabase:', error);
    } catch (err) {
      console.error(err);
    }
  }

  // Local fallback
  try {
    const list = JSON.parse(localStorage.getItem(LS_KEYS.bugs) || '[]');
    return list.map((b: any, idx: number) => ({
      id: `local-bug-${idx}`,
      what: b.what,
      email: b.email,
      file_name: b.fileName,
      drive_url: b.driveUrl,
      created_at: b.date || new Date().toISOString(),
    }));
  } catch {
    return [];
  }
}

// ── Feature Requests ──────────────────────────────────────────────────
export async function submitFeatureRequest(f: {
  title: string;
  description: string;
  name?: string;
  email?: string;
}): Promise<{ success: boolean; data?: DbFeatureRequest; error?: string }> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('feature_requests')
        .insert([
          {
            title: f.title.trim().slice(0, 100),
            description: f.description.trim(),
            name: f.name?.trim() || null,
            email: f.email?.trim() || null,
            votes: 1,
            status: 'requested',
          },
        ])
        .select()
        .single();
      if (!error && data) return { success: true, data };
      console.error('Supabase feature request error:', error);
    } catch (err: any) {
      console.error('Failed to submit feature to Supabase:', err);
    }
  }

  // Local fallback
  try {
    const list = JSON.parse(localStorage.getItem(LS_KEYS.features) || '[]');
    const newF = {
      id: `f_${Date.now()}`,
      title: f.title.trim().slice(0, 100),
      description: f.description.trim(),
      name: f.name?.trim() || undefined,
      email: f.email?.trim() || undefined,
      votes: 1,
      status: 'requested' as const,
      created_at: new Date().toISOString(),
    };
    list.unshift(newF);
    localStorage.setItem(LS_KEYS.features, JSON.stringify(list));
    return { success: true, data: newF };
  } catch {
    return { success: false, error: 'Storage error' };
  }
}

export async function fetchFeatureRequests(): Promise<DbFeatureRequest[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('feature_requests')
        .select('*')
        .order('votes', { ascending: false });
      if (!error && data) return data;
      console.error('Error fetching feature requests from Supabase:', error);
    } catch (err) {
      console.error(err);
    }
  }

  // Local fallback
  try {
    return JSON.parse(localStorage.getItem(LS_KEYS.features) || '[]');
  } catch {
    return [];
  }
}

export async function upvoteFeatureRequest(id: string): Promise<boolean> {
  if (supabase) {
    try {
      // Fetch current votes then increment
      const { data } = await supabase.from('feature_requests').select('votes').eq('id', id).single();
      if (data) {
        await supabase
          .from('feature_requests')
          .update({ votes: (data.votes || 0) + 1 })
          .eq('id', id);
        return true;
      }
    } catch (err) {
      console.error(err);
    }
  }

  // Local fallback
  try {
    const list = JSON.parse(localStorage.getItem(LS_KEYS.features) || '[]');
    const updated = list.map((f: any) => (f.id === id ? { ...f, votes: (f.votes || 0) + 1 } : f));
    localStorage.setItem(LS_KEYS.features, JSON.stringify(updated));
    return true;
  } catch {
    return false;
  }
}

export async function setFeatureStatus(id: string, status: string): Promise<boolean> {
  if (supabase) {
    try {
      const { error } = await supabase.from('feature_requests').update({ status }).eq('id', id);
      return !error;
    } catch {
      return false;
    }
  }

  try {
    const list = JSON.parse(localStorage.getItem(LS_KEYS.features) || '[]');
    const updated = list.map((f: any) => (f.id === id ? { ...f, status } : f));
    localStorage.setItem(LS_KEYS.features, JSON.stringify(updated));
    return true;
  } catch {
    return false;
  }
}

export async function updateFeatureRequest(
  id: string,
  updates: {
    title?: string;
    description?: string;
    status?: string;
    votes?: number;
    name?: string;
  }
): Promise<boolean> {
  if (supabase) {
    try {
      const { error } = await supabase.from('feature_requests').update(updates).eq('id', id);
      if (!error) return true;
      console.error('Supabase feature update error:', error);
    } catch (err) {
      console.error(err);
    }
  }

  try {
    const list = JSON.parse(localStorage.getItem(LS_KEYS.features) || '[]');
    const updated = list.map((f: any) => (f.id === id ? { ...f, ...updates } : f));
    localStorage.setItem(LS_KEYS.features, JSON.stringify(updated));
    return true;
  } catch {
    return false;
  }
}

export async function createFeatureRequestByAdmin(item: {
  title: string;
  description: string;
  status: string;
  votes: number;
  name?: string;
}): Promise<boolean> {
  if (supabase) {
    try {
      const { error } = await supabase.from('feature_requests').insert([
        {
          title: item.title.trim().slice(0, 100),
          description: item.description.trim(),
          name: item.name?.trim() || 'Admin / Community',
          status: item.status || 'planned',
          votes: item.votes || 1,
        },
      ]);
      if (!error) return true;
      console.error('Supabase feature insert error:', error);
    } catch (err) {
      console.error(err);
    }
  }

  try {
    const list = JSON.parse(localStorage.getItem(LS_KEYS.features) || '[]');
    list.unshift({
      id: `f_${Date.now()}`,
      title: item.title.trim().slice(0, 100),
      description: item.description.trim(),
      name: item.name?.trim() || 'Admin / Community',
      status: item.status || 'planned',
      votes: item.votes || 1,
      created_at: new Date().toISOString(),
    });
    localStorage.setItem(LS_KEYS.features, JSON.stringify(list));
    return true;
  } catch {
    return false;
  }
}

// ── Supporters ────────────────────────────────────────────────────────
// ── Supporters ────────────────────────────────────────────────────────
export async function isPaymentIdAlreadyUsed(paymentId: string): Promise<boolean> {
  const trimmed = paymentId.trim();
  if (!trimmed) return false;
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('supporters')
        .select('id')
        .eq('payment_id', trimmed)
        .limit(1);
      if (!error && data && data.length > 0) return true;
    } catch (err) {
      console.error('Error checking payment ID:', err);
    }
  }
  try {
    const list = JSON.parse(localStorage.getItem(LS_KEYS.supporters) || '[]');
    return list.some((s: any) => (s.payment_id || s.paymentRef) === trimmed);
  } catch {
    return false;
  }
}

export async function submitSupporter(supporter: {
  name: string;
  amount: number;
  cups: number;
  rating: number;
  message?: string;
  paymentId?: string;
  verified?: boolean;
}): Promise<boolean> {
  // Clean inputs: strip all links, scripts, and format cleanly
  const cleanName = supporter.name.replace(/<[^>]*>/g, '').replace(/[<>"'`]/g, '').trim().slice(0, 80) || 'Anonymous Supporter';
  const cleanMessage = supporter.message ? supporter.message.replace(/<[^>]*>/g, '').replace(/[<>"'`]/g, '').trim().slice(0, 350) : null;
  const cleanPaymentId = supporter.paymentId ? supporter.paymentId.trim().slice(0, 80) : null;
  const isVerified = supporter.verified === true; // Default: strictly FALSE unless explicitly confirmed

  if (supabase) {
    try {
      const { error } = await supabase.from('supporters').insert([
        {
          name: cleanName,
          amount: supporter.amount,
          cups: supporter.cups,
          rating: supporter.rating,
          message: cleanMessage,
          payment_id: cleanPaymentId,
          verified: isVerified,
        },
      ]);
      if (!error) return true;
      console.error('Supabase supporter error:', error);
    } catch (err) {
      console.error(err);
    }
  }

  // Local fallback
  try {
    const list = JSON.parse(localStorage.getItem(LS_KEYS.supporters) || '[]');
    list.unshift({
      id: `sup_${Date.now()}`,
      name: cleanName,
      amount: supporter.amount,
      cups: supporter.cups,
      rating: supporter.rating,
      message: cleanMessage || undefined,
      payment_id: cleanPaymentId || undefined,
      verified: isVerified,
      created_at: new Date().toISOString(),
    });
    localStorage.setItem(LS_KEYS.supporters, JSON.stringify(list));
  } catch {}

  return true;
}

export async function createSupporterByAdmin(supporter: {
  name: string;
  amount: number;
  cups: number;
  rating: number;
  message?: string;
  payment_id?: string;
  verified?: boolean;
}): Promise<boolean> {
  const finalName = supporter.name.trim() || 'Anonymous Supporter';
  const finalAmount = Number(supporter.amount) || 50;
  const finalCups = Number(supporter.cups) || Math.max(1, Math.round(finalAmount / 50));
  const finalRating = Math.min(5, Math.max(1, Number(supporter.rating) || 5));
  const finalVerified = supporter.verified ?? true;

  if (supabase) {
    try {
      const { error } = await supabase.from('supporters').insert([
        {
          name: finalName,
          amount: finalAmount,
          cups: finalCups,
          rating: finalRating,
          message: supporter.message?.trim() || null,
          payment_id: supporter.payment_id?.trim() || null,
          verified: finalVerified,
        },
      ]);
      if (!error) return true;
      console.error('Supabase create supporter error:', error);
    } catch (err) {
      console.error(err);
    }
  }

  try {
    const list = JSON.parse(localStorage.getItem(LS_KEYS.supporters) || '[]');
    list.unshift({
      id: `sup_${Date.now()}`,
      name: finalName,
      amount: finalAmount,
      cups: finalCups,
      rating: finalRating,
      message: supporter.message?.trim() || undefined,
      payment_id: supporter.payment_id?.trim() || undefined,
      verified: finalVerified,
      created_at: new Date().toISOString(),
    });
    localStorage.setItem(LS_KEYS.supporters, JSON.stringify(list));
    return true;
  } catch {
    return false;
  }
}

export async function updateSupporter(
  id: string,
  updates: {
    name?: string;
    amount?: number;
    cups?: number;
    rating?: number;
    message?: string;
    payment_id?: string;
    verified?: boolean;
  }
): Promise<boolean> {
  if (supabase) {
    try {
      const { error } = await supabase.from('supporters').update(updates).eq('id', id);
      if (!error) return true;
      console.error('Supabase supporter update error:', error);
    } catch (err) {
      console.error(err);
    }
  }

  try {
    const list = JSON.parse(localStorage.getItem(LS_KEYS.supporters) || '[]');
    const updated = list.map((s: any) => (s.id === id ? { ...s, ...updates } : s));
    localStorage.setItem(LS_KEYS.supporters, JSON.stringify(updated));
    return true;
  } catch {
    return false;
  }
}

export async function setSupporterVerified(id: string, verified: boolean): Promise<boolean> {
  return updateSupporter(id, { verified });
}

export interface AutoVerifyResult {
  verified: boolean;
  supporter?: DbSupporter;
}

/**
 * Checks Supabase for a newly verified payment received around or after the payment initiation timestamp.
 * This powers automatic background payment verification without requiring the user to type a transaction ID.
 */
export async function checkForAutoVerifiedPayment(
  initiatedAt: number,
  expectedName?: string,
  expectedAmount?: number
): Promise<AutoVerifyResult> {
  if (supabase) {
    try {
      // 45 seconds buffer prior to initiation to account for clock skew
      const bufferTime = new Date(initiatedAt - 45000).toISOString();
      const { data, error } = await supabase
        .from('supporters')
        .select('*')
        .eq('verified', true)
        .gte('created_at', bufferTime)
        .order('created_at', { ascending: false })
        .limit(5);

      if (!error && data && data.length > 0) {
        // If an expected name is provided, match by name
        if (expectedName && expectedName.trim()) {
          const cleanExpected = expectedName.trim().toLowerCase();
          const match = data.find(
            (s) =>
              s.name.toLowerCase().includes(cleanExpected) ||
              cleanExpected.includes(s.name.toLowerCase())
          );
          if (match) {
            return { verified: true, supporter: match };
          }
        }
        // Match by amount
        if (expectedAmount && expectedAmount > 0) {
          const amountMatch = data.find((s) => Number(s.amount) === Number(expectedAmount));
          if (amountMatch) {
            return { verified: true, supporter: amountMatch };
          }
        }
        // Fallback: any verified payment in this recent time window
        return { verified: true, supporter: data[0] };
      }
    } catch (err) {
      console.error('Error polling for auto-verified payment:', err);
    }
  }

  // Also check local cache fallback
  try {
    const list = JSON.parse(localStorage.getItem(LS_KEYS.supporters) || '[]');
    const match = list.find(
      (s: any) =>
        s.verified === true &&
        new Date(s.created_at || s.timestamp || 0).getTime() >= initiatedAt - 45000
    );
    if (match) return { verified: true, supporter: match };
  } catch {}

  return { verified: false };
}

export async function fetchSupporters(): Promise<DbSupporter[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('supporters')
        .select('*')
        .order('amount', { ascending: false });
      if (!error && data) return data;
      console.error('Error fetching supporters from Supabase:', error);
    } catch (err) {
      console.error(err);
    }
  }

  try {
    return JSON.parse(localStorage.getItem(LS_KEYS.supporters) || '[]');
  } catch {
    return [];
  }
}

// ── Delete Records (Admin) ────────────────────────────────────────────
export async function deleteRecord(
  table: 'subscribers' | 'bug_reports' | 'feature_requests' | 'supporters',
  id: string
): Promise<boolean> {
  if (supabase) {
    try {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) console.error(`Error deleting from ${table}:`, error);
    } catch (err) {
      console.error(err);
    }
  }

  try {
    const key =
      table === 'supporters'
        ? LS_KEYS.supporters
        : table === 'bug_reports'
        ? LS_KEYS.bugs
        : table === 'feature_requests'
        ? LS_KEYS.features
        : LS_KEYS.emails;
    if (key) {
      const list = JSON.parse(localStorage.getItem(key) || '[]');
      const filtered = list.filter((item: any) => (item.id ? item.id !== id : item !== id));
      localStorage.setItem(key, JSON.stringify(filtered));
    }
  } catch {}

  return true;
}

// ── Global Site Visitor Counter (Supabase) ───────────────────────────
export const SITE_STATS_SQL = `-- 1. Create table for global site stats
create table if not exists site_stats (
  id text primary key,
  value bigint not null default 0,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Enable Row Level Security (RLS)
alter table site_stats enable row level security;

-- 3. Allow public select, insert and update
create policy "Allow public read site_stats" on site_stats for select using (true);
create policy "Allow public insert site_stats" on site_stats for insert with check (true);
create policy "Allow public update site_stats" on site_stats for update using (true);

-- 4. Insert initial visitors row
insert into site_stats (id, value)
values ('visitors', 1)
on conflict (id) do nothing;

-- 5. Safe atomic increment function
create or replace function increment_site_visitors()
returns bigint
language plpgsql
security definer
as $$
declare
  new_count bigint;
begin
  insert into site_stats (id, value)
  values ('visitors', 1)
  on conflict (id) do update
  set value = site_stats.value + 1,
      updated_at = timezone('utc'::text, now())
  returning value into new_count;
  return new_count;
end;
$$;`;

export async function fetchGlobalVisitorsFromDb(): Promise<{ count: number; isDb: boolean }> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('site_stats')
        .select('value')
        .eq('id', 'visitors')
        .single();
      if (!error && data && typeof data.value === 'number') {
        return { count: data.value, isDb: true };
      }
    } catch {}
  }
  const local = parseInt(localStorage.getItem('ryperdeck_real_visitors_v3') || '1', 10);
  return { count: local > 0 ? local : 1, isDb: false };
}

export async function updateGlobalVisitorsInDb(count: number): Promise<boolean> {
  try {
    localStorage.setItem('ryperdeck_real_visitors_v3', String(count));
    window.dispatchEvent(new CustomEvent('ryperdeck_visitor_updated', { detail: count }));
  } catch {}

  if (supabase) {
    try {
      const { error } = await supabase
        .from('site_stats')
        .upsert({ id: 'visitors', value: count, updated_at: new Date().toISOString() });
      if (!error) return true;
    } catch (err) {
      console.error('Error updating site_stats in Supabase:', err);
    }
  }
  return false;
}

