import React from 'react';
import { Search, X } from 'lucide-react';
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
    `shrink-0 min-h-10 px-4 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
      selected ? 'bg-[#E11D48] text-white border-[#E11D48]' : 'bg-white text-slate-600 border-slate-300 hover:border-[#E11D48]'
    }`;
  const select = 'w-full h-11 md:h-auto px-2 md:py-1.5 rounded-lg border border-slate-300 bg-white text-sm md:text-xs text-slate-700';

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-3 space-y-3 shadow-xs">
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="search"
          enterKeyHint="search"
          value={filters.search}
          onChange={(e) => set({ search: e.target.value })}
          placeholder="Search name or SKU…"
          aria-label="Search by name or SKU"
          className="w-full h-11 md:h-auto pl-9 pr-9 md:py-2 rounded-lg border border-slate-300 text-base md:text-xs focus:outline-none focus:ring-2 focus:ring-[#E11D48]/30"
        />
        {filters.search && (
          <button onClick={() => set({ search: '' })} aria-label="Clear search" className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-slate-400 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Brand chips scroll sideways inside this strip only; the page itself never scrolls sideways */}
      <div role="group" aria-label="Brand" className="-mx-3 px-3 flex gap-2 overflow-x-auto pb-1 md:flex-wrap md:overflow-visible">
        <button className={chip(filters.brand === 'all')} aria-pressed={filters.brand === 'all'} onClick={() => set({ brand: 'all', model: 'all' })}>
          All brands
        </button>
        {brands.map((b) => (
          <button key={b} className={chip(filters.brand === b)} aria-pressed={filters.brand === b} onClick={() => set({ brand: b, model: 'all' })}>
            {b}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <select aria-label="Model" value={filters.model} onChange={(e) => set({ model: e.target.value })} className={select}>
          <option value="all">{filters.brand === 'all' ? 'All models' : `All ${filters.brand} models`}</option>
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

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
        <label className="flex items-center gap-2 min-h-9 cursor-pointer">
          <input type="checkbox" className="w-4 h-4 accent-[#E11D48]" checked={filters.inStockOnly} onChange={(e) => set({ inStockOnly: e.target.checked })} />
          In stock only
        </label>
        <label className="flex items-center gap-2 min-h-9 cursor-pointer">
          <input type="checkbox" className="w-4 h-4 accent-[#E11D48]" checked={filters.changedOnly} onChange={(e) => set({ changedOnly: e.target.checked })} />
          Only unsaved edits
        </label>
        {active && (
          <button className="min-h-9 font-bold text-[#E11D48] hover:underline cursor-pointer" onClick={() => onChange(EMPTY_FILTERS)}>
            Clear filters
          </button>
        )}
        <span className="hidden md:inline text-slate-400">Filtering never changes prices.</span>
      </div>
    </div>
  );
};
