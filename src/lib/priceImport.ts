import { parseCsv, toCsv } from './csv';
import { PriceRow } from './priceRows';
import { isLargeChange, parsePriceInput, percentChange } from './priceValidation';

/**
 * Price-list CSV schema (one row per variant, matched by SKU):
 *   sku, product_name, brand, variant, current_price_lkr, new_price_lkr, stock
 * Only `sku` and `new_price_lkr` are read on import. The other columns are for the owner's
 * reference; `stock` is never imported (a price-only import cannot change stock).
 */
export const CSV_HEADERS = ['sku', 'product_name', 'brand', 'variant', 'current_price_lkr', 'new_price_lkr', 'stock'];

export const variantLabel = (r: PriceRow) => [r.storage, r.color].filter(Boolean).join(' / ');

/** blankNew: template (empty new price) vs export (new price pre-filled with the current price). */
export const buildPriceListCsv = (rows: PriceRow[], blankNew: boolean): string =>
  toCsv([
    CSV_HEADERS,
    ...rows.map((r) => [r.sku, r.name, r.brand, variantLabel(r), r.priceLKR, blankNew ? '' : r.priceLKR, r.stock]),
  ]);

export type ImportStatus = 'change' | 'unchanged' | 'invalid' | 'unknown-sku' | 'duplicate-sku' | 'duplicate-row';

export interface ImportRow {
  line: number; // 1-based line number in the file (header = 1)
  sku: string;
  fileName: string;
  rawPrice: string;
  status: ImportStatus;
  message?: string;
  warnings: string[];
  target?: PriceRow;
  newPrice?: number;
  pct?: number;
  large?: boolean;
}

export interface ImportRawRow {
  line: number;
  sku: string;
  name: string;
  rawPrice: string;
}

export interface ReadResult {
  rows: ImportRawRow[];
  fatal?: string;
}

const norm = (s: string) => s.trim().toLowerCase();

/** Turn file text into raw rows. Fatal problems (not a CSV, missing columns) come back as `fatal`. */
export const readPriceCsv = (text: string): ReadResult => {
  if (text.includes('\u0000')) return { rows: [], fatal: 'This does not look like a CSV text file. Excel .xlsx files are not supported; use Save As → CSV.' };
  const parsed = parseCsv(text);
  if (parsed.error) return { rows: [], fatal: parsed.error };
  if (parsed.rows.length === 0) return { rows: [], fatal: 'The file is empty.' };

  const header = parsed.rows[0].map(norm);
  const col = (name: string) => header.indexOf(name);
  const iSku = col('sku');
  const iNew = col('new_price_lkr');
  const iName = col('product_name');
  if (iSku < 0 || iNew < 0) {
    return {
      rows: [],
      fatal: `Missing required column${iSku < 0 && iNew < 0 ? 's' : ''}: ${[iSku < 0 && 'sku', iNew < 0 && 'new_price_lkr'].filter(Boolean).join(', ')}. Use "Download CSV Template".`,
    };
  }
  const rows: ImportRawRow[] = [];
  parsed.rows.slice(1).forEach((cells, i) => {
    if (cells.every((c) => c === '')) return; // ignore blank lines
    rows.push({ line: i + 2, sku: cells[iSku] ?? '', name: iName >= 0 ? cells[iName] ?? '' : '', rawPrice: cells[iNew] ?? '' });
  });
  return { rows, fatal: rows.length === 0 ? 'The file has a header but no data rows.' : undefined };
};

/**
 * Classify every row against the current catalogue. `overrides` holds prices the owner corrected
 * in the preview (keyed by line number). Pure: nothing is changed in the catalogue.
 */
export const analyzeImport = (
  raw: ImportRawRow[],
  catalogue: PriceRow[],
  overrides: Record<number, string> = {}
): ImportRow[] => {
  const bySku = new Map(catalogue.map((r) => [norm(r.sku), r]));
  const skuCount = new Map<string, number>();
  raw.forEach((r) => skuCount.set(norm(r.sku), (skuCount.get(norm(r.sku)) ?? 0) + 1));

  // The first row of a repeated SKU "owns" it when the repeats are exact copies of it.
  const firstSeen = new Map<string, ImportRawRow>();

  return raw.map<ImportRow>((r) => {
    const priceText = overrides[r.line] ?? r.rawPrice;
    const base = { line: r.line, sku: r.sku, fileName: r.name, rawPrice: priceText, warnings: [] as string[] };
    const key = norm(r.sku);

    if (key === '') return { ...base, status: 'invalid', message: 'Missing SKU' };

    if ((skuCount.get(key) ?? 0) > 1) {
      const first = firstSeen.get(key);
      if (!first) {
        firstSeen.set(key, r);
      } else if (norm(first.rawPrice) === norm(r.rawPrice)) {
        return { ...base, status: 'duplicate-row', message: `Exact repeat of line ${first.line}; ignored` };
      }
      const group = raw.filter((x) => norm(x.sku) === key);
      const allSame = group.every((x) => norm(x.rawPrice) === norm(group[0].rawPrice));
      if (!allSame) {
        return { ...base, status: 'duplicate-sku', message: 'This SKU appears more than once with different prices; fix the file or exclude' };
      }
    }

    const target = bySku.get(key);
    if (!target) return { ...base, status: 'unknown-sku', message: 'SKU is not in the catalogue' };

    const warnings: string[] = [];
    if (r.name && norm(r.name) !== norm(target.name)) warnings.push(`Name in file ("${r.name}") differs from catalogue ("${target.name}"); matched by SKU`);

    if (priceText.trim() === '') return { ...base, target, warnings, status: 'unchanged', message: 'No new price given' };
    const parsed = parsePriceInput(priceText);
    if (!parsed.ok) return { ...base, target, warnings, status: 'invalid', message: parsed.error };
    if (parsed.value === target.priceLKR) return { ...base, target, warnings, status: 'unchanged', message: 'Same as current price', newPrice: parsed.value };

    const large = isLargeChange(target.priceLKR, parsed.value);
    if (large) warnings.push('Large change (25% or more)');
    return { ...base, target, warnings, status: 'change', newPrice: parsed.value, pct: percentChange(target.priceLKR, parsed.value), large };
  });
};

export interface ImportSummary {
  total: number;
  matched: number;
  changed: number;
  unchanged: number;
  invalid: number;
  unknown: number;
  duplicateSku: number;
  duplicateRow: number;
}

export const summarizeImport = (rows: ImportRow[]): ImportSummary => ({
  total: rows.length,
  matched: rows.filter((r) => r.target).length,
  changed: rows.filter((r) => r.status === 'change').length,
  unchanged: rows.filter((r) => r.status === 'unchanged').length,
  invalid: rows.filter((r) => r.status === 'invalid').length,
  unknown: rows.filter((r) => r.status === 'unknown-sku').length,
  duplicateSku: rows.filter((r) => r.status === 'duplicate-sku').length,
  duplicateRow: rows.filter((r) => r.status === 'duplicate-row').length,
});

export const STATUS_LABEL: Record<ImportStatus, string> = {
  change: 'Will change',
  unchanged: 'Unchanged',
  invalid: 'Invalid',
  'unknown-sku': 'Unknown SKU',
  'duplicate-sku': 'Duplicate SKU',
  'duplicate-row': 'Duplicate row',
};

/** Lightweight error report: every row that will NOT be applied, with the reason. */
export const buildErrorReportCsv = (rows: ImportRow[]): string =>
  toCsv([
    ['line', 'sku', 'new_price_lkr', 'status', 'reason'],
    ...rows
      .filter((r) => r.status !== 'change' && r.status !== 'unchanged')
      .map((r) => [r.line, r.sku, r.rawPrice, STATUS_LABEL[r.status], r.message ?? '']),
  ]);
