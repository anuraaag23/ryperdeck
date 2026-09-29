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

// ── Supporters ────────────────────────────────────────────────────────
export async function submitSupporter(supporter: {
  name: string;
  amount: number;
  cups: number;
  rating: number;
  message?: string;
  paymentId?: string;
}): Promise<boolean> {
  if (supabase) {
    try {
      const { error } = await supabase.from('supporters').insert([
        {
          name: supporter.name,
          amount: supporter.amount,
          cups: supporter.cups,
          rating: supporter.rating,
          message: supporter.message || null,
          payment_id: supporter.paymentId || null,
          verified: true,
        },
      ]);
      if (!error) return true;
      console.error('Supabase supporter error:', error);
    } catch (err) {
      console.error(err);
    }
  }

  return true;
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
export async function deleteRecord(table: 'subscribers' | 'bug_reports' | 'feature_requests' | 'supporters', id: string): Promise<boolean> {
  if (supabase) {
    try {
      const { error } = await supabase.from(table).delete().eq('id', id);
      return !error;
    } catch {
      return false;
    }
  }
  return true;
}
