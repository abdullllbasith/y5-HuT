import { StockReason } from '../types';

export const MAX_STOCK = 1_000_000;

export const STOCK_REASONS: { id: StockReason; label: string }[] = [
  { id: 'received-shipment', label: 'Received shipment' },
  { id: 'store-sale', label: 'Store sale' },
  { id: 'damaged', label: 'Damaged / lost' },
  { id: 'correction', label: 'Stock count correction' },
  { id: 'customer-return', label: 'Customer return' },
  { id: 'other', label: 'Other' },
];

export const reasonLabel = (r: StockReason) => STOCK_REASONS.find((x) => x.id === r)?.label ?? r;

export type StockMode = 'set' | 'delta';

export type StockCheck = { ok: true; after: number } | { ok: false; error: string };

/** Pure stock arithmetic shared by the dialog preview and the context. Negative stock is never allowed. */
export const computeStock = (before: number, mode: StockMode, raw: string): StockCheck => {
  const text = raw.trim();
  if (text === '') return { ok: false, error: 'Enter a quantity' };
  if (!/^[+-]?\d+$/.test(text)) return { ok: false, error: 'Whole numbers only' };
  const n = Number(text);
  if (!Number.isSafeInteger(n)) return { ok: false, error: 'Number is too large' };
  if (mode === 'set' && n < 0) return { ok: false, error: 'Stock cannot be negative' };
  const after = mode === 'set' ? n : before + n;
  if (after < 0) return { ok: false, error: `Stock cannot go below 0 (currently ${before})` };
  if (after > MAX_STOCK) return { ok: false, error: 'Quantity is unrealistically large' };
  return { ok: true, after };
};

export type StockLevel = 'out' | 'low' | 'ok';
export const stockLevel = (stock: number, threshold: number): StockLevel =>
  stock <= 0 ? 'out' : stock <= threshold ? 'low' : 'ok';
