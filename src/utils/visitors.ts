import { supabase } from '../lib/supabase';

/**
 * Lifetime Visitor Counter Utility
 * Synchronizes with Supabase PostgreSQL database ('site_stats' table)
 * so visitors are globally tracked across all devices, browsers, and countries.
 */

const BASE_VISITORS = 1;
const STORAGE_KEY = 'ryperdeck_real_visitors_v3';
const SESSION_KEY = 'ryperdeck_session_recorded_v3';

let isSyncing = false;

export function getLifetimeVisitors(): number {
  try {
    // Check v3 or migrate from v2
    const v3 = localStorage.getItem(STORAGE_KEY);
    const v2 = localStorage.getItem('ryperdeck_real_visitors_v2');
    let count = parseInt(v3 || v2 || '0', 10);

    if (!count || count < BASE_VISITORS) {
      count = BASE_VISITORS;
      localStorage.setItem(STORAGE_KEY, String(count));
    }

    // Trigger asynchronous database synchronization
    if (!isSyncing && typeof window !== 'undefined') {
      isSyncing = true;
      syncWithSupabase();
    }

    return count;
  } catch {
    return BASE_VISITORS;
  }
}

/**
 * Connects directly to Supabase to fetch or atomically increment the global visitor count
 */
export async function syncWithSupabase(): Promise<number> {
  const isNewSession = !sessionStorage.getItem(SESSION_KEY);
  let currentCount = parseInt(localStorage.getItem(STORAGE_KEY) || '1', 10);

  if (supabase) {
    try {
      if (isNewSession) {
        sessionStorage.setItem(SESSION_KEY, 'true');

        // 1. Try atomic PostgreSQL RPC function (safest for concurrent visitors)
        const { data: rpcCount, error: rpcError } = await supabase.rpc('increment_site_visitors');
        if (!rpcError && typeof rpcCount === 'number' && rpcCount > 0) {
          publishCount(rpcCount);
          return rpcCount;
        }

        // 2. Fallback to direct table read and increment
        const { data: row, error: selectError } = await supabase
          .from('site_stats')
          .select('value')
          .eq('id', 'visitors')
          .single();

        if (!selectError && row) {
          const nextCount = (Number(row.value) || 0) + 1;
          await supabase
            .from('site_stats')
            .update({ value: nextCount, updated_at: new Date().toISOString() })
            .eq('id', 'visitors');
          publishCount(nextCount);
          return nextCount;
        }
      } else {
        // Returning session: just retrieve current global database count
        const { data: row, error } = await supabase
          .from('site_stats')
          .select('value')
          .eq('id', 'visitors')
          .single();

        if (!error && row && typeof row.value === 'number') {
          publishCount(row.value);
          return row.value;
        }
      }
    } catch (err) {
      console.warn('Visitor database sync error:', err);
    }
  }

  // Local fallback if Supabase table is not yet created
  if (isNewSession) {
    sessionStorage.setItem(SESSION_KEY, 'true');
    currentCount += 1;
    publishCount(currentCount);
  }

  return currentCount;
}

function publishCount(count: number) {
  try {
    localStorage.setItem(STORAGE_KEY, String(count));
  } catch {}
  window.dispatchEvent(new CustomEvent('ryperdeck_visitor_updated', { detail: count }));
}

export function subscribeVisitorUpdates(callback: (count: number) => void): () => void {
  const handler = (e: any) => {
    if (typeof e.detail === 'number') {
      callback(e.detail);
    }
  };
  window.addEventListener('ryperdeck_visitor_updated', handler);
  return () => window.removeEventListener('ryperdeck_visitor_updated', handler);
}
