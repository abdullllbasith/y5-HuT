import { useCallback, useMemo, useState } from 'react';
import { useStore } from '../../../context/StoreContext';
import { PriceRow, buildPriceRows } from '../../../lib/priceRows';
import { isLargeChange, parsePriceInput, percentChange } from '../../../lib/priceValidation';

export interface DraftEntry {
  row: PriceRow;
  raw: string;
  error?: string; // set when the typed value is not a valid price
  newPrice?: number; // set when valid and different from the current price
  pct?: number;
  large?: boolean;
}

/**
 * Draft price edits, kept apart from published product state. Nothing here touches
 * the catalogue until publish() is called with a reviewed set of changes.
 */
export const usePriceDraft = () => {
  const { products, publishPriceChanges } = useStore();
  const rows = useMemo(() => buildPriceRows(products), [products]);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  // Rows whose draft came from a reviewed bulk action (so history can say "bulk").
  const [bulkKeys, setBulkKeys] = useState<Set<string>>(new Set());
  // Explicit selection of rows for bulk actions. Filters never add to it by themselves.
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggleSelected = useCallback((key: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);
  const selectMany = useCallback((keys: string[]) => setSelected((prev) => new Set([...prev, ...keys])), []);
  const clearSelection = useCallback(() => setSelected(new Set()), []);
  const selectedRows = useMemo(() => rows.filter((r) => selected.has(r.key)), [rows, selected]);

  // Stage already-reviewed bulk results as ordinary drafts (still unpublished).
  const stageMany = useCallback((prices: Record<string, number>) => {
    setDrafts((prev) => {
      const next = { ...prev };
      Object.entries(prices).forEach(([k, v]) => (next[k] = String(v)));
      return next;
    });
    setBulkKeys((prev) => new Set([...prev, ...Object.keys(prices)]));
  }, []);

  const setDraft = useCallback((key: string, raw: string) => {
    setDrafts((prev) => ({ ...prev, [key]: raw }));
    setBulkKeys((prev) => {
      if (!prev.has(key)) return prev;
      const next = new Set(prev); // a hand edit on top of a bulk draft is a quick edit
      next.delete(key);
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setDrafts({});
    setBulkKeys(new Set());
  }, []);

  const entries = useMemo<DraftEntry[]>(() => {
    const byKey = new Map(rows.map((r) => [r.key, r]));
    const out: DraftEntry[] = [];
    Object.entries(drafts).forEach(([key, raw]) => {
      const row = byKey.get(key);
      if (!row) return;
      if (raw.trim() === '') return; // an emptied box is simply "no edit"
      const parsed = parsePriceInput(raw);
      if (!parsed.ok) {
        out.push({ row, raw, error: parsed.error });
      } else if (parsed.value !== row.priceLKR) {
        out.push({
          row,
          raw,
          newPrice: parsed.value,
          pct: percentChange(row.priceLKR, parsed.value),
          large: isLargeChange(row.priceLKR, parsed.value),
        });
      } // equal to the current price: not a change
    });
    return out;
  }, [drafts, rows]);

  const entryByKey = useMemo(() => new Map(entries.map((e) => [e.row.key, e])), [entries]);
  const changes = entries.filter((e) => e.newPrice !== undefined);
  const invalid = entries.filter((e) => e.error);

  const publish = useCallback(() => {
    const result = publishPriceChanges(
      changes.map((e) => ({
        productId: e.row.productId,
        variantId: e.row.variantId,
        newPriceLKR: e.newPrice!,
        source: bulkKeys.has(e.row.key) ? ('bulk' as const) : ('quick-edit' as const),
      }))
    );
    setDrafts({});
    setBulkKeys(new Set());
    return result;
  }, [changes, bulkKeys, publishPriceChanges]);

  return { rows, drafts, setDraft, clear, selected, selectedRows, toggleSelected, selectMany, clearSelection, stageMany, entries, entryByKey, changes, invalid, publish };
};

export type PriceDraft = ReturnType<typeof usePriceDraft>;
