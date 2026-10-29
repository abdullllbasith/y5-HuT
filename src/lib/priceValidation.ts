export const MAX_PRICE_LKR = 100_000_000;
/** A change at or above this percentage needs an explicit confirmation before publishing. */
export const LARGE_CHANGE_PERCENT = 25;

export type ParsedPrice = { ok: true; value: number } | { ok: false; error: string };

/**
 * Parse a typed LKR amount. Accepts "245000", "245,000", "Rs. 245,000", "245000.50".
 * Rejects empty, NaN, zero/negative, more than 2 decimals, and absurdly large numbers.
 */
export const parsePriceInput = (raw: string): ParsedPrice => {
  const cleaned = raw.replace(/rs\.?/i, '').replace(/[,\s]/g, '');
  if (cleaned === '') return { ok: false, error: 'Enter a price' };
  if (cleaned.startsWith('-')) return { ok: false, error: 'Price must be greater than zero' };
  if (!/^\d+(\.\d+)?$/.test(cleaned)) return { ok: false, error: 'Numbers only (e.g. 245000)' };
  if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) return { ok: false, error: 'At most 2 decimal places' };
  const value = Number(cleaned);
  if (!Number.isFinite(value) || value <= 0) return { ok: false, error: 'Price must be greater than zero' };
  if (value > MAX_PRICE_LKR) return { ok: false, error: 'Price is unrealistically large' };
  return { ok: true, value };
};

export const percentChange = (oldPrice: number, newPrice: number): number =>
  oldPrice === 0 ? 0 : ((newPrice - oldPrice) / oldPrice) * 100;

export const isLargeChange = (oldPrice: number, newPrice: number): boolean =>
  Math.abs(percentChange(oldPrice, newPrice)) >= LARGE_CHANGE_PERCENT;

export const formatLKR = (n: number): string =>
  `Rs. ${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

export const formatPercent = (p: number): string => `${p > 0 ? '+' : ''}${p.toFixed(1)}%`;
