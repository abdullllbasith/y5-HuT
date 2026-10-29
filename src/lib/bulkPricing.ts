import { PriceRow } from './priceRows';
import { LARGE_CHANGE_PERCENT, MAX_PRICE_LKR, isLargeChange, percentChange } from './priceValidation';

/**
 * Bulk price maths. Rounding policy: every resulting price is rounded to a whole rupee
 * (Math.round, halves round up). Nothing here touches the catalogue; it only computes a preview.
 */
export type BulkMode = 'set' | 'increase-amount' | 'decrease-amount' | 'increase-percent' | 'decrease-percent';

export const BULK_MODE_LABELS: Record<BulkMode, string> = {
  set: 'Set fixed price (Rs.)',
  'increase-amount': 'Increase by Rs.',
  'decrease-amount': 'Decrease by Rs.',
  'increase-percent': 'Increase by %',
  'decrease-percent': 'Decrease by %',
};

export const isPercentMode = (m: BulkMode) => m === 'increase-percent' || m === 'decrease-percent';

export type ParsedValue = { ok: true; value: number } | { ok: false; error: string };

/** The number typed into the bulk box. Positive, at most 2 decimals; percent decreases must be below 100. */
export const parseBulkValue = (mode: BulkMode, raw: string): ParsedValue => {
  const cleaned = raw.replace(/rs\.?/i, '').replace(/[,\s%]/g, '');
  if (cleaned === '') return { ok: false, error: 'Enter a value' };
  if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) return { ok: false, error: 'Use a positive number (max 2 decimals)' };
  const value = Number(cleaned);
  if (!Number.isFinite(value) || value <= 0) return { ok: false, error: 'Value must be greater than zero' };
  if (mode === 'decrease-percent' && value >= 100) return { ok: false, error: 'A decrease must be below 100%' };
  if (mode === 'increase-percent' && value > 500) return { ok: false, error: 'Increase above 500% is not allowed' };
  if (value > MAX_PRICE_LKR) return { ok: false, error: 'Value is unrealistically large' };
  return { ok: true, value };
};

export const applyBulk = (oldPrice: number, mode: BulkMode, value: number): number => {
  switch (mode) {
    case 'set':
      return Math.round(value);
    case 'increase-amount':
      return Math.round(oldPrice + value);
    case 'decrease-amount':
      return Math.round(oldPrice - value);
    case 'increase-percent':
      return Math.round(oldPrice * (1 + value / 100));
    case 'decrease-percent':
      return Math.round(oldPrice * (1 - value / 100));
  }
};

export type BulkStatus = 'change' | 'unchanged' | 'invalid';

export interface BulkPreviewRow {
  row: PriceRow;
  status: BulkStatus;
  newPrice?: number;
  diff?: number;
  pct?: number;
  large?: boolean;
  reason?: string;
}

export interface BulkPreview {
  rows: BulkPreviewRow[];
  changes: BulkPreviewRow[];
  unchanged: BulkPreviewRow[];
  invalid: BulkPreviewRow[];
  warnings: string[];
}

/** Preview the effect on exactly the given (explicitly selected) rows. */
export const previewBulk = (selected: PriceRow[], mode: BulkMode, value: number, hiddenSelected = 0): BulkPreview => {
  const rows = selected.map<BulkPreviewRow>((row) => {
    const next = applyBulk(row.priceLKR, mode, value);
    if (!Number.isFinite(next)) return { row, status: 'invalid', reason: 'Result is not a number' };
    if (next <= 0) return { row, status: 'invalid', reason: 'Result would be zero or negative' };
    if (next > MAX_PRICE_LKR) return { row, status: 'invalid', reason: 'Result is unrealistically large' };
    if (next === row.priceLKR) return { row, status: 'unchanged', newPrice: next, diff: 0, pct: 0 };
    return {
      row,
      status: 'change',
      newPrice: next,
      diff: next - row.priceLKR,
      pct: percentChange(row.priceLKR, next),
      large: isLargeChange(row.priceLKR, next),
    };
  });

  const changes = rows.filter((r) => r.status === 'change');
  const warnings: string[] = [];
  const largeCount = changes.filter((c) => c.large).length;
  if (largeCount > 0) warnings.push(`${largeCount} change${largeCount === 1 ? ' is' : 's are'} ${LARGE_CHANGE_PERCENT}% or more.`);
  if (mode === 'set' && new Set(selected.map((r) => r.priceLKR)).size > 1) {
    warnings.push(`One fixed price will be applied to ${selected.length} variants that currently have different prices.`);
  }
  if (mode === 'set' && new Set(selected.map((r) => r.productId)).size > 1) {
    warnings.push('The selection spans several different products.');
  }
  if (hiddenSelected > 0) {
    warnings.push(`${hiddenSelected} selected variant${hiddenSelected === 1 ? ' is' : 's are'} currently hidden by your filters.`);
  }
  return {
    rows,
    changes,
    unchanged: rows.filter((r) => r.status === 'unchanged'),
    invalid: rows.filter((r) => r.status === 'invalid'),
    warnings,
  };
};
