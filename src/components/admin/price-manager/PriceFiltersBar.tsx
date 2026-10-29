import React from 'react';
import { Search } from 'lucide-react';
import { EMPTY_FILTERS, PriceFilters, PriceRow } from '../../../lib/priceRows';

interface Props {
  rows: PriceRow[];
  filters: PriceFilters;
  onChange: (f: PriceFilters) => void;
}

const unique = <T,>(xs: T[]) => Array.from(new Set(xs));

/** Filters only narrow what is listed. They never edit any price. */
export const PriceFiltersBar: React.FC<Props> = ({ rows, filters, onChange }) => {
  const brands = unique(rows.map((r) => r.brand)).sort();
  const categories = unique(rows.map((r) => r.category)).sort();
  const models = unique(rows.filter((r) => filters.brand === 'all' || r.brand === filters.brand).map((r) => r.name)).sort();
  const set = (patch: Partial<PriceFilters>) => onChange({ ...filters, ...patch });
  const active =
    filters.search || filters.brand !== 'all' || filters.category !== 'all' || filters.model !== 'all' ||
    filters.inStockOnly || filters.changedOnly;

  const chip = (selected: boolean) =>
    `px-3 py-1 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
      selected ? 'bg-[#E11D48] text-white border-[#E11D48]' : 'bg-white text-slate-600 border-slate-200 hover:border-[#E11D48]'
    }`;
  const select = 'px-2 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700';

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-3 space-y-3 shadow-xs">
      <div className="flex flex-col md:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={filters.search}
            onChange={(e) => set({ search: e.target.value })}
            placeholder="Search name or SKU…"
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#E11D48]/30"
          />
        </div>
        <select
          aria-label="Model"
          value={filters.model}
          onChange={(e) => set({ model: e.target.value })}
          className={select}
        >
          <option value="all">All models</option>
          {models.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <select
          aria-label="Category"
          value={filters.category}
          onChange={(e) => set({ category: e.target.value as PriceFilters['category'] })}
          className={select}
        >
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button className={chip(filters.brand === 'all')} onClick={() => set({ brand: 'all', model: 'all' })}>
          All brands
        </button>
        {brands.map((b) => (
          <button key={b} className={chip(filters.brand === b)} onClick={() => set({ brand: b, model: 'all' })}>
            {b}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input type="checkbox" checked={filters.inStockOnly} onChange={(e) => set({ inStockOnly: e.target.checked })} />
          In stock only
        </label>
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input type="checkbox" checked={filters.changedOnly} onChange={(e) => set({ changedOnly: e.target.checked })} />
          Only rows with unsaved edits
        </label>
        {active && (
          <button className="font-bold text-[#E11D48] hover:underline cursor-pointer" onClick={() => onChange(EMPTY_FILTERS)}>
            Clear filters
          </button>
        )}
        <span className="text-slate-400">Filtering never changes prices.</span>
      </div>
    </div>
  );
};
