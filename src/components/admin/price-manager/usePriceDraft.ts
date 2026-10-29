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

  const setDraft = useCallback((key: string, raw: string) => {
    setDrafts((prev) => ({ ...prev, [key]: raw }));
  }, []);

  const clear = useCallback(() => setDrafts({}), []);

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
      changes.map((e) => ({ productId: e.row.productId, variantId: e.row.variantId, newPriceLKR: e.newPrice! }))
    );
    setDrafts({});
    return result;
  }, [changes, publishPriceChanges]);

  return { rows, drafts, setDraft, clear, entries, entryByKey, changes, invalid, publish };
};

export type PriceDraft = ReturnType<typeof usePriceDraft>;
