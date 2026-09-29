/**
 * Lifetime visitor counter utility
 * Starts with a realistic verified baseline (e.g. 2,480) and increments per new visitor session.
 * Stores in localStorage so it's persistent across refreshes and notifies all listeners in real-time.
 */

const BASE_VISITORS = 1;
const STORAGE_KEY = 'ryperdeck_real_visitors_v2';
const SESSION_KEY = 'ryperdeck_session_recorded_v2';

export function getLifetimeVisitors(): number {
  try {
    // Clear old legacy dummy key if present
    if (localStorage.getItem('ryperdeck_lifetime_visitors')) {
      localStorage.removeItem('ryperdeck_lifetime_visitors');
    }

    let count = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);
    if (!count || count < BASE_VISITORS) {
      count = BASE_VISITORS;
      localStorage.setItem(STORAGE_KEY, String(count));
    }

    // If new session, increment count
    if (!sessionStorage.getItem(SESSION_KEY)) {
      sessionStorage.setItem(SESSION_KEY, 'true');
      count += 1;
      localStorage.setItem(STORAGE_KEY, String(count));
      // Dispatch custom event so all mounted components update instantly
      window.dispatchEvent(new CustomEvent('ryperdeck_visitor_updated', { detail: count }));
    }

    return count;
  } catch {
    return BASE_VISITORS;
  }
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
