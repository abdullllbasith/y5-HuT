import React from 'react';
import { ProductCategory, BrandName } from '../../types';
import { Sheet } from '../ui/Sheet';
import { Button } from '../ui/Button';
import { Chip } from '../ui/Chip';
import { Check } from 'lucide-react';

interface CatalogFilterSheetProps {
  open: boolean;
  onClose: () => void;
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
  totalResults: number;
}

export const CatalogFilterSheet: React.FC<CatalogFilterSheetProps> = ({
  open,
  onClose,
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
  totalResults,
}) => {
  return (
    <Sheet
      isOpen={open}
      onClose={onClose}
      title="Filter Shelf"
      subtitle="Refine inventory tags by department, brand & sort"
      mode="bottom"
    >
      <div className="space-y-6 text-left pb-4">
        {/* Availability / In Stock */}
        <div className="flex items-center justify-between p-3.5 bg-paper-sunk rounded-xl border border-line">
          <div>
            <span className="font-ui text-xs font-bold text-ink block">In Stock Only</span>
            <span className="font-data text-[10px] text-ink-soft">Hide out of stock items</span>
          </div>
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => onToggleInStock(e.target.checked)}
            className="w-5 h-5 rounded text-red accent-red cursor-pointer"
          />
        </div>

        {/* Categories */}
        <div className="space-y-2">
          <span className="font-data text-[10px] uppercase font-bold tracking-wider text-ink-soft block">
            Departments
          </span>
          <div className="grid grid-cols-2 gap-2">
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
                  className={`p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors min-h-[44px] cursor-pointer ${
                    isSelected
                      ? 'bg-ink text-paper shadow-hard-sm'
                      : isZero
                      ? 'bg-paper-sunk/50 text-ink-soft/40 border border-transparent cursor-not-allowed'
                      : 'bg-card text-ink border border-line hover:border-ink'
                  }`}
                >
                  <span className="truncate">{c.label}</span>
                  <span className={`font-data text-[10px] ml-1 ${isSelected ? 'text-red' : 'text-ink-soft'}`}>
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Brands */}
        <div className="space-y-2">
          <span className="font-data text-[10px] uppercase font-bold tracking-wider text-ink-soft block">
            Brands
          </span>
          <div className="flex flex-wrap gap-1.5">
            {brands.map((b) => {
              const count = brandCounts[b] ?? 0;
              const isZero = count === 0 && b !== 'all' && selectedBrand !== b;
              const isSelected = selectedBrand === b;

              return (
                <Chip
                  key={b}
                  label={b === 'all' ? 'All Brands' : b}
                  count={count}
                  active={isSelected}
                  disabled={isZero}
                  size="md"
                  onClick={() => onSelectBrand(b)}
                />
              );
            })}
          </div>
        </div>

        {/* Sort Order */}
        <div className="space-y-2">
          <span className="font-data text-[10px] uppercase font-bold tracking-wider text-ink-soft block">
            Sort By
          </span>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'featured', label: 'Featured' },
              { id: 'price-asc', label: 'Price: Low-High' },
              { id: 'price-desc', label: 'Price: High-Low' },
              { id: 'rating', label: 'Top Rated' },
            ].map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => onSelectSort(s.id as any)}
                className={`p-3 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors min-h-[44px] cursor-pointer ${
                  sortBy === s.id
                    ? 'bg-ink text-paper'
                    : 'bg-card text-ink border border-line'
                }`}
              >
                <span>{s.label}</span>
                {sortBy === s.id && <Check className="w-4 h-4 text-red" />}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-4 border-t border-line">
          <Button
            variant="ghost"
            onClick={onReset}
            className="flex-1 min-h-[44px]"
          >
            Reset
          </Button>
          <Button
            variant="primary"
            onClick={onClose}
            className="flex-1 min-h-[44px]"
          >
            Show {totalResults} Tags
          </Button>
        </div>
      </div>
    </Sheet>
  );
};
