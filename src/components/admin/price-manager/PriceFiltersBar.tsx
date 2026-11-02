import React from 'react';
import { Search, X } from 'lucide-react';
import { EMPTY_FILTERS, PriceFilters, PriceRow } from '../../../lib/priceRows';
import { Chip } from '../../ui/Chip';

interface Props {
  rows: PriceRow[];
  filters: PriceFilters;
  onChange: (f: PriceFilters) => void;
}

const unique = <T,>(xs: T[]) => Array.from(new Set(xs));

export const PriceFiltersBar: React.FC<Props> = ({ rows, filters, onChange }) => {
  const brands = unique(rows.map((r) => r.brand)).sort();
  const categories = unique(rows.map((r) => r.category)).sort();
  const models = unique(rows.filter((r) => filters.brand === 'all' || r.brand === filters.brand).map((r) => r.name)).sort();
  const set = (patch: Partial<PriceFilters>) => onChange({ ...filters, ...patch });
  const active =
    filters.search || filters.brand !== 'all' || filters.category !== 'all' || filters.model !== 'all' ||
    filters.inStockOnly || filters.changedOnly;

  const select = 'w-full h-11 md:h-10 px-3 rounded-xl border border-line bg-paper text-xs text-ink font-semibold cursor-pointer';

  return (
    <div className="bg-card rounded-2xl border border-line p-4 space-y-3 shadow-hard-sm text-left font-ui">
      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-ink-soft absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="search"
          enterKeyHint="search"
          value={filters.search}
          onChange={(e) => set({ search: e.target.value })}
          placeholder="Search by device model or variant SKU…"
          aria-label="Search by name or SKU"
          className="w-full h-11 md:h-10 pl-9 pr-9 rounded-xl border border-line bg-paper text-xs font-ui text-ink focus:outline-none focus:border-ink"
        />
        {filters.search && (
          <button
            onClick={() => set({ search: '' })}
            aria-label="Clear search"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-ink-soft hover:text-ink cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Brand Chips */}
      <div role="group" aria-label="Brand" className="-mx-4 px-4 flex gap-1.5 overflow-x-auto pb-1 md:flex-wrap md:overflow-visible scrollbar-none">
        <Chip
          label="All Brands"
          active={filters.brand === 'all'}
          onClick={() => set({ brand: 'all', model: 'all' })}
          size="sm"
        />
        {brands.map((b) => (
          <Chip
            key={b}
            label={b}
            active={filters.brand === b}
            onClick={() => set({ brand: b, model: 'all' })}
            size="sm"
          />
        ))}
      </div>

      {/* Dropdown Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <select aria-label="Model" value={filters.model} onChange={(e) => set({ model: e.target.value })} className={select}>
          <option value="all">{filters.brand === 'all' ? 'All device models' : `All ${filters.brand} models`}</option>
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

      {/* Filter Checkboxes and Clear */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-ink-soft pt-1">
        <label className="flex items-center gap-2 min-h-[36px] cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 accent-red rounded cursor-pointer"
            checked={filters.inStockOnly}
            onChange={(e) => set({ inStockOnly: e.target.checked })}
          />
          <span className="font-ui font-semibold text-ink">In stock only</span>
        </label>
        <label className="flex items-center gap-2 min-h-[36px] cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 accent-red rounded cursor-pointer"
            checked={filters.changedOnly}
            onChange={(e) => set({ changedOnly: e.target.checked })}
          />
          <span className="font-ui font-semibold text-ink">Only unsaved drafted edits</span>
        </label>
        {active && (
          <button
            className="min-h-[36px] font-bold font-data text-red hover:underline cursor-pointer"
            onClick={() => onChange(EMPTY_FILTERS)}
          >
            Clear all filters
          </button>
        )}
      </div>
    </div>
  );
};
