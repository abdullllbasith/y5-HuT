import React from 'react';
import { ProductCategory, BrandName } from '../../types';
import { Filter, Check } from 'lucide-react';
import { Chip } from '../ui/Chip';

interface CatalogFilterRailProps {
  categories: { id: ProductCategory | 'all'; label: string }[];
  categoryCounts: Record<string, number>;
  selectedCategory: ProductCategory | 'all';
  onSelectCategory: (cat: ProductCategory | 'all') => void;
  brands: (BrandName | 'all')[];
  brandCounts: Record<string, number>;
  selectedBrand: BrandName | 'all';
  onSelectBrand: (brand: BrandName | 'all') => void;
  inStockOnly: boolean;
  onToggleInStock: (val: boolean) => void;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating';
  onSelectSort: (sort: 'featured' | 'price-asc' | 'price-desc' | 'rating') => void;
  onReset: () => void;
  hasActiveFilters: boolean;
}

export const CatalogFilterRail: React.FC<CatalogFilterRailProps> = ({
  categories,
  categoryCounts,
  selectedCategory,
  onSelectCategory,
  brands,
  brandCounts,
  selectedBrand,
  onSelectBrand,
  inStockOnly,
  onToggleInStock,
  sortBy,
  onSelectSort,
  onReset,
  hasActiveFilters,
}) => {
  return (
    <aside className="w-64 shrink-0 hidden lg:block space-y-6 text-left">
      {/* Header with clear action */}
      <div className="flex items-center justify-between pb-3 border-b border-line">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-red" />
          <h3 className="font-display text-base font-bold text-ink">Shelf Filters</h3>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="font-data text-xs text-red hover:underline cursor-pointer"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Categories: Vertical Shelf List */}
      <div className="space-y-2">
        <span className="font-data text-[10px] uppercase font-bold tracking-wider text-ink-soft block">
          Departments
        </span>
        <div className="space-y-1">
          {categories.map((c) => {
            const count = categoryCounts[c.id] ?? 0;
            const isZero = count === 0 && c.id !== 'all' && selectedCategory !== c.id;
            const isSelected = selectedCategory === c.id;

            return (
              <button
                key={c.id}
                type="button"
                disabled={isZero}
                onClick={() => onSelectCategory(c.id)}
                className={`w-full px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors text-left cursor-pointer min-h-[38px] ${
                  isSelected
                    ? 'bg-ink text-paper shadow-hard-sm'
                    : isZero
                    ? 'text-ink-soft/40 cursor-not-allowed'
                    : 'text-ink hover:bg-paper-sunk hover:text-red'
                }`}
              >
                <span className="truncate">{c.label}</span>
                <span className={`font-data text-[10px] ml-2 ${isSelected ? 'text-red' : 'text-ink-soft'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Availability / In-stock */}
      <div className="pt-4 border-t border-line space-y-2">
        <span className="font-data text-[10px] uppercase font-bold tracking-wider text-ink-soft block">
          Availability
        </span>
        <label className="flex items-center gap-2.5 p-2 rounded-lg bg-card border border-line cursor-pointer select-none hover:bg-paper-sunk transition-colors">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => onToggleInStock(e.target.checked)}
            className="w-4 h-4 rounded text-red accent-red cursor-pointer"
          />
          <span className="font-ui text-xs font-semibold text-ink">In Stock Only</span>
        </label>
      </div>

      {/* Brands: Shelf Labels */}
      <div className="pt-4 border-t border-line space-y-2">
        <span className="font-data text-[10px] uppercase font-bold tracking-wider text-ink-soft block">
          Brands
        </span>
        <div className="flex flex-wrap gap-1.5 max-h-56 overflow-y-auto pr-1">
          {brands.map((b) => {
            const count = brandCounts[b] ?? 0;
            const isZero = count === 0 && b !== 'all' && selectedBrand !== b;
            const isSelected = selectedBrand === b;

            return (
              <Chip
                key={b}
                label={b === 'all' ? 'All' : b}
                count={count}
                active={isSelected}
                disabled={isZero}
                size="sm"
                onClick={() => onSelectBrand(b)}
              />
            );
          })}
        </div>
      </div>

      {/* Sort By Order */}
      <div className="pt-4 border-t border-line space-y-2">
        <span className="font-data text-[10px] uppercase font-bold tracking-wider text-ink-soft block">
          Sorting
        </span>
        <div className="space-y-1">
          {[
            { id: 'featured', label: 'Featured First' },
            { id: 'price-asc', label: 'Price: Low to High' },
            { id: 'price-desc', label: 'Price: High to Low' },
            { id: 'rating', label: 'Highest Rated' },
          ].map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => onSelectSort(s.id as any)}
              className={`w-full px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between text-left transition-colors cursor-pointer min-h-[36px] ${
                sortBy === s.id
                  ? 'bg-ink text-paper'
                  : 'text-ink-soft hover:bg-paper-sunk hover:text-ink'
              }`}
            >
              <span>{s.label}</span>
              {sortBy === s.id && <Check className="w-3.5 h-3.5 text-red" />}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};

