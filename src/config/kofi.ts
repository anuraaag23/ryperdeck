import { fetchSupporters, DbSupporter } from '../lib/supabase';

export interface SupporterReview {
  id: string;
  name: string;
  amount: number;
  cups: number;
  rating: number; // 1 to 5 stars
  message?: string;
  timestamp: number;
  badge?: string;
  paymentRef?: string;
  verified?: boolean;
}

export interface CoffeeStats {
  totalCups: number;
  totalAmountInr: number;
  supporterCount: number;
  lastUpdated: number;
}

// ── Security & Anti-Spam: Link Detection & Removal ───────────────────────────
// Matches URLs (http, https, ftp), www. prefixes, IP addresses, and common domain extensions (.com, .io, .gg, etc.)
export const LINK_REGEX = /(?:https?:\/\/|ftp:\/\/|www\.)[^\s/$.?#].[^\s]*|\b(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+(?:com|org|net|edu|gov|mil|io|co|in|ai|me|xyz|app|dev|gg|link|info|biz|site|online|tech|store|cc|to|is|ru|cn|tv|top)\b(?:\/[^\s]*)?/gi;

export const containsLink = (text: string): boolean => {
  if (!text) return false;
  return LINK_REGEX.test(text);
};

export const sanitizeReviewMessage = (text: string, maxLen = 350): string => {
  if (!text) return '';
  // 1. Strip HTML tags and script delimiters
  let cleaned = text.replace(/<[^>]*>/g, '').replace(/[<>"'`]/g, '');
  // 2. Strip any URLs, web domains, and links completely
  cleaned = cleaned.replace(LINK_REGEX, '');
  // 3. Normalize multiple whitespace and trim
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  return cleaned.slice(0, maxLen);
};

// Sanitize user input: strip HTML/script tags, strip links, and limit length
export const sanitizeInput = (str: string, maxLen = 200): string => {
  if (!str) return '';
  return sanitizeReviewMessage(str, maxLen);
};

// Initial leaderboard baseline (starts empty for real supporters)
export const INITIAL_SUPPORTERS: SupporterReview[] = [];

// Official Ko-fi creator config
export const KOFI_CONFIG = {
  url: 'https://ko-fi.com/ryper',
  handle: '@ryper',
  creatorName: 'ryper',
  companyName: 'RyperDeck',
  description: 'Support RyperDeck Windows Controller Development',
  currency: 'INR',
  cupPriceInr: 50,
};

// Backward compatibility alias for any remaining references
export const RAZORPAY_CONFIG = {
  paymentUrl: KOFI_CONFIG.url,
  handle: KOFI_CONFIG.handle,
  companyName: KOFI_CONFIG.companyName,
  description: KOFI_CONFIG.description,
  currency: KOFI_CONFIG.currency,
  themeColor: '#00F0FF',
};

// Get stored supporters leaderboard from localStorage cache
export const getStoredSupporters = (): SupporterReview[] => {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem('ryperdeck_supporters_leaderboard');
    if (data) {
      const parsed: SupporterReview[] = JSON.parse(data);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error('Failed to read supporters from localStorage', err);
  }
  return [];
};

// Calculate stats dynamically from supporters list (STRICT: only verified === true)
export const calculateStats = (supporters: SupporterReview[]): CoffeeStats => {
  // Only calculate stats from genuinely verified supporters
  const verifiedList = supporters.filter((s) => s.verified === true);
  const totalAmountInr = verifiedList.reduce((acc, s) => acc + (Number(s.amount) || 0), 0);
  const totalCups = verifiedList.reduce((acc, s) => acc + (Number(s.cups) || 0), 0);
  return {
    totalCups,
    totalAmountInr,
    supporterCount: verifiedList.length,
    lastUpdated: Date.now(),
  };
};

// Export getStoredCoffeeStats for quick stats readout
export const getStoredCoffeeStats = (): CoffeeStats => {
  return calculateStats(getStoredSupporters());
};

// Sync live supporters from database (Supabase) and update local cache & global listeners
export const syncSupportersFromSupabase = async (): Promise<SupporterReview[]> => {
  try {
    const dbSupporters: DbSupporter[] = await fetchSupporters();
    if (Array.isArray(dbSupporters)) {
      const reviews: SupporterReview[] = dbSupporters.map((db, idx) => ({
        id: db.id || `sup-${idx}`,
        name: sanitizeInput(db.name || 'Anonymous Supporter', 80),
        amount: Number(db.amount) || 50,
        cups: Number(db.cups) || Math.max(1, Math.round((Number(db.amount) || 50) / 50)),
        rating: Math.min(5, Math.max(1, Number(db.rating) || 5)),
        message: db.message ? sanitizeReviewMessage(db.message, 350) : undefined,
        timestamp: db.created_at ? new Date(db.created_at).getTime() : Date.now(),
        paymentRef: db.payment_id || undefined,
        // STRICT: Only explicitly verified records are verified. Unverified records remain false.
        verified: db.verified === true,
      }));

      // Cache to localStorage
      try {
        localStorage.setItem('ryperdeck_supporters_leaderboard', JSON.stringify(reviews));
        const stats = calculateStats(reviews);
        localStorage.setItem('ryperdeck_coffee_stats', JSON.stringify(stats));

        // Global notification
        window.dispatchEvent(new CustomEvent('ryperdeck_coffee_updated', { detail: stats }));
        window.dispatchEvent(new CustomEvent('ryperdeck_supporters_updated', { detail: reviews }));
      } catch {}

      return reviews;
    }
  } catch (err) {
    console.error('Failed to sync supporters from database:', err);
  }
  return getStoredSupporters();
};

// Clear local storage cache (used to remove old fake or stale test entries)
export const clearLocalSupporters = (): void => {
  try {
    localStorage.removeItem('ryperdeck_supporters_leaderboard');
    localStorage.removeItem('ryperdeck_coffee_stats');
    const emptyStats = calculateStats([]);
    window.dispatchEvent(new CustomEvent('ryperdeck_coffee_updated', { detail: emptyStats }));
    window.dispatchEvent(new CustomEvent('ryperdeck_supporters_updated', { detail: [] }));
  } catch {}
};

// Add new supporter review and broadcast update (default: verified = false for public submission)
export const addSupporter = (
  name: string,
  amount: number,
  cups: number,
  rating: number,
  message?: string,
  paymentRef?: string,
  verified = false
): { supporter: SupporterReview; stats: CoffeeStats } => {
  const sanitizedName = sanitizeInput(name, 80) || 'Anonymous Supporter';
  const sanitizedMessage = message ? sanitizeReviewMessage(message, 350) : undefined;
  const sanitizedRef = paymentRef ? sanitizeInput(paymentRef, 80) : undefined;
  const current = getStoredSupporters();
  const newSupporter: SupporterReview = {
    id: `sup-${Date.now()}`,
    name: sanitizedName,
    amount: Math.max(1, Math.min(100000, Number(amount) || 50)),
    cups: Math.max(1, Math.min(2000, Number(cups) || 1)),
    rating: Math.min(5, Math.max(1, Math.round(Number(rating)) || 5)),
    message: sanitizedMessage || undefined,
    paymentRef: sanitizedRef || undefined,
    verified: verified === true,
    timestamp: Date.now(),
  };

  const updated = [newSupporter, ...current];

  try {
    localStorage.setItem('ryperdeck_supporters_leaderboard', JSON.stringify(updated));
    const stats = calculateStats(updated);
    localStorage.setItem('ryperdeck_coffee_stats', JSON.stringify(stats));

    // Dispatch global events for live real-time sync across the entire app
    window.dispatchEvent(new CustomEvent('ryperdeck_coffee_updated', { detail: stats }));
    window.dispatchEvent(new CustomEvent('ryperdeck_supporters_updated', { detail: updated }));

    return { supporter: newSupporter, stats };
  } catch (err) {
    console.error('Failed to save supporter', err);
    return { supporter: newSupporter, stats: calculateStats(updated) };
  }
};

export const getTopSupporters = (limit = 4): SupporterReview[] => {
  const all = getStoredSupporters();
  return [...all]
    .filter((s) => s.verified === true)
    .sort((a, b) => b.amount - a.amount)
    .slice(0, limit);
};
