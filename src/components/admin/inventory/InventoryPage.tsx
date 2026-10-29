import React, { useMemo, useState } from 'react';
import { AlertTriangle, Search } from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { CATEGORY_LABELS } from '../../../lib/productForm';
import { stockLevel } from '../../../lib/stock';
import { ProductCategory } from '../../../types';
import { InventoryRow, buildInventoryRows } from './inventoryRows';
import { StockDialog } from './StockDialog';
import { StockLog } from './StockLog';

type LevelFilter = 'all' | 'low' | 'out';

const BADGE = {
  out: ['Out of stock', 'bg-rose-100 text-rose-800'],
  low: ['Low stock', 'bg-amber-100 text-amber-800'],
  ok: ['In stock', 'bg-emerald-100 text-emerald-800'],
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

  const select = 'px-2 py-2 rounded-lg border border-slate-200 bg-white text-xs text-slate-700';

  return (
    <>
      <div className="rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-xs text-slate-700">
        Demo: stock changes are saved in this browser and update the storefront immediately. The role selector is a
        <strong> simulation</strong>, not real security{!canAdjust && <>; the simulated <strong>{currentUser.role.replace('_', ' ')}</strong> role is view-only here</>}.
      </div>

      {(outCount > 0 || lowCount > 0) && (
        <div role="status" className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-xl border border-amber-300 bg-amber-50 px-4 py-2.5 text-xs text-amber-900">
          <AlertTriangle className="w-4 h-4" />
          {outCount > 0 && <button className="font-bold underline cursor-pointer" onClick={() => setLevel('out')}>{outCount} out of stock</button>}
          {lowCount > 0 && <button className="font-bold underline cursor-pointer" onClick={() => setLevel('low')}>{lowCount} low on stock</button>}
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 p-3 space-y-2 shadow-xs">
        <div className="flex flex-col md:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, SKU or variant…" className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#E11D48]/30" />
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
        <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
          <input type="checkbox" checked={showArchived} onChange={(e) => setShowArchived(e.target.checked)} /> Include archived products
        </label>
      </div>

      <div className="text-[11px] text-slate-500">Showing {visible.length} of {rows.length} stock lines</div>

      {visible.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-slate-300 p-10 text-center text-xs text-slate-500">No stock lines match your filters.</div>
      ) : (
        <ul className="space-y-2">
          {visible.map((r) => {
            const l = stockLevel(r.stock, r.threshold);
            return (
              <li key={r.key} className={`bg-white rounded-xl border border-slate-200 p-3 shadow-xs flex flex-col sm:flex-row sm:items-center gap-3 ${r.archived ? 'opacity-70' : ''}`}>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold text-slate-900">{r.name}{r.archived && <span className="ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">Archived</span>}</div>
                  <div className="text-[11px] text-slate-500">{[r.brand, r.label].filter(Boolean).join(' · ')} <span className="font-mono text-slate-400">{r.sku}</span></div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono tabular-nums text-lg font-black text-slate-900 w-12 text-right">{r.stock}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${BADGE[l][1]}`}>{BADGE[l][0]}</span>
                  <button
                    onClick={() => setAdjusting(r.key)}
                    disabled={!canAdjust}
                    title={canAdjust ? 'Set or change stock' : 'View only for this simulated role'}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-[#E11D48] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
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
    </>
  );
};
