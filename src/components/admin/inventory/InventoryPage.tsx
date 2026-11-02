import React, { useMemo, useState } from 'react';
import { AlertTriangle, Search } from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { CATEGORY_LABELS } from '../../../lib/productForm';
import { stockLevel } from '../../../lib/stock';
import { ProductCategory } from '../../../types';
import { InventoryRow, buildInventoryRows } from './inventoryRows';
import { StockDialog } from './StockDialog';
import { StockLog } from './StockLog';
import { Dot, DotTone } from '../../ui/Dot';

type LevelFilter = 'all' | 'low' | 'out';

const BADGE: Record<'out' | 'low' | 'ok', readonly [string, string, DotTone]> = {
  out: ['Out of stock', 'bg-rose-100 text-rose-800 border-rose-200', 'red'],
  low: ['Low stock', 'bg-amber-100 text-amber-800 border-amber-200', 'low'],
  ok: ['In stock', 'bg-emerald-100 text-emerald-800 border-emerald-200', 'go'],
} as const;

export const InventoryPage: React.FC = () => {
  const { products, currentUser } = useStore();
  const [search, setSearch] = useState('');
  const [brand, setBrand] = useState('all');
  const [category, setCategory] = useState<ProductCategory | 'all'>('all');
  const [level, setLevel] = useState<LevelFilter>('all');
  const [showArchived, setShowArchived] = useState(false);
  const [adjusting, setAdjusting] = useState<string | null>(null);
  const canAdjust = currentUser.role === 'super_admin' || currentUser.role === 'inventory_manager';

  const rows = useMemo(() => buildInventoryRows(products), [products]);
  const brands = useMemo(() => Array.from(new Set(products.map((p) => p.brand))).sort(), [products]);
  const categories = useMemo(() => Array.from(new Set(products.map((p) => p.category))).sort(), [products]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (r.archived && !showArchived) return false;
      if (brand !== 'all' && r.brand !== brand) return false;
      if (category !== 'all' && r.category !== category) return false;
      const l = stockLevel(r.stock, r.threshold);
      if (level === 'low' && l !== 'low') return false;
      if (level === 'out' && l !== 'out') return false;
      if (q && !(r.name.toLowerCase().includes(q) || r.sku.toLowerCase().includes(q) || r.label.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [rows, search, brand, category, level, showArchived]);

  const live = rows.filter((r) => !r.archived);
  const outCount = live.filter((r) => stockLevel(r.stock, r.threshold) === 'out').length;
  const lowCount = live.filter((r) => stockLevel(r.stock, r.threshold) === 'low').length;
  const target: InventoryRow | undefined = rows.find((r) => r.key === adjusting);

  const select =
    'px-3 py-2 rounded-xl border border-ink/15 bg-paper text-xs text-ink min-h-[40px] focus:outline-none focus:border-red';

  return (
    <div className="space-y-4 text-left">
      <div className="rounded-xl border border-ink/10 bg-paper-sunk px-4 py-2.5 text-xs text-ink-muted">
        Demo: stock changes are saved in this browser and update the storefront immediately. The role selector is a
        <strong className="text-ink"> simulation</strong>, not real security{!canAdjust && <>; the simulated <strong className="text-ink">{currentUser.role.replace('_', ' ')}</strong> role is view-only here</>}.
      </div>

      {(outCount > 0 || lowCount > 0) && (
        <div role="status" className="flex flex-wrap items-center gap-x-4 gap-y-1.5 rounded-xl border border-amber-300 bg-amber-50 px-4 py-2.5 text-xs text-amber-900 shadow-xs">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          {outCount > 0 && <button className="font-bold underline cursor-pointer hover:text-amber-950" onClick={() => setLevel('out')}>{outCount} out of stock</button>}
          {lowCount > 0 && <button className="font-bold underline cursor-pointer hover:text-amber-950" onClick={() => setLevel('low')}>{lowCount} low on stock</button>}
        </div>
      )}

      <div className="bg-paper-card rounded-2xl border border-ink/10 p-3.5 space-y-3 shadow-paper text-left">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          <div className="relative sm:col-span-2 lg:col-span-1">
            <Search className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, SKU or variant…"
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-ink/15 bg-paper text-xs text-ink focus:outline-none focus:border-red min-h-[40px]"
            />
          </div>
          <select aria-label="Brand" value={brand} onChange={(e) => setBrand(e.target.value)} className={select}>
            <option value="all">All brands</option>
            {brands.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
          <select aria-label="Category" value={category} onChange={(e) => setCategory(e.target.value as ProductCategory | 'all')} className={select}>
            <option value="all">All categories</option>
            {categories.map((c) => <option key={c} value={c}>{CATEGORY_LABELS[c] ?? c}</option>)}
          </select>
          <select aria-label="Stock level" value={level} onChange={(e) => setLevel(e.target.value as LevelFilter)} className={select}>
            <option value="all">All stock levels</option>
            <option value="low">Low stock</option>
            <option value="out">Out of stock</option>
          </select>
        </div>
        <label className="flex items-center gap-2 text-xs text-ink-muted cursor-pointer pt-0.5">
          <input type="checkbox" checked={showArchived} onChange={(e) => setShowArchived(e.target.checked)} className="w-4 h-4 accent-red rounded" />
          <span>Include archived products</span>
        </label>
      </div>

      <div className="text-[11px] text-ink-muted font-medium">Showing {visible.length} of {rows.length} stock lines</div>

      {visible.length === 0 ? (
        <div className="bg-paper-card rounded-2xl border border-dashed border-ink/20 p-10 text-center text-xs text-ink-muted">
          No stock lines match your filters.
        </div>
      ) : (
        <ul className="space-y-2.5">
          {visible.map((r) => {
            const l = stockLevel(r.stock, r.threshold);
            return (
              <li
                key={r.key}
                className={`bg-paper-card rounded-2xl border border-ink/10 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left transition-colors ${
                  r.archived ? 'opacity-70 bg-paper-sunk/50' : 'hover:border-ink/25'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold text-ink">
                    {r.name}
                    {r.archived && <span className="ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-paper-sunk text-ink-muted border border-ink/10">Archived</span>}
                  </div>
                  <div className="text-[11px] text-ink-muted mt-0.5">
                    {[r.brand, r.label].filter(Boolean).join(' · ')} <span className="font-mono text-ink-muted/80">{r.sku}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t border-ink/5 sm:border-t-0">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="font-data tabular-nums text-lg font-black text-ink">{r.stock}</span>
                    <span className="text-[11px] text-ink-muted font-sans">units</span>
                    <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full border whitespace-nowrap ml-1 ${BADGE[l][1]}`}>
                      <Dot tone={BADGE[l][2]} size="xs" />
                      {BADGE[l][0]}
                    </span>
                  </div>
                  <button
                    onClick={() => setAdjusting(r.key)}
                    disabled={!canAdjust}
                    title={canAdjust ? 'Set or change stock' : 'View only for this simulated role'}
                    className="px-4 py-2 rounded-xl bg-ink text-paper text-xs font-bold hover:bg-red disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer min-h-[38px] transition-colors"
                  >
                    Adjust
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <StockLog />

      {target && <StockDialog row={target} onClose={() => setAdjusting(null)} />}
    </div>
  );
};
