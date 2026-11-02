import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from './ProductCard';
import { ProductCategory, BrandName } from '../../types';
import { Search, Flame, X, Filter, SlidersHorizontal, ArrowUpDown, Check } from 'lucide-react';

interface CatalogViewProps {
  initialCategory?: ProductCategory | 'all';
  title?: string;
  subtitle?: string;
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  initialCategory,
  title = 'Trending Tech & Gadgets in Sri Lanka',
  subtitle = 'Sample catalogue for the demo. Prices, stock, warranty and delivery details are illustrative.',
}) => {
  const {
    storefrontProducts: products,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    clearSearch,
  } = useStore();

  // If a view passes a specific initialCategory (e.g. apple-store), initialize it
  useEffect(() => {
    if (initialCategory && initialCategory !== 'all') {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory, setSelectedCategory]);

  const [selectedBrand, setSelectedBrand] = useState<BrandName | 'all'>('all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  // Preserve scroll position
  const catalogRef = useRef<HTMLDivElement>(null);

  const categories: { id: ProductCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All Products' },
    { id: 'apple-store', label: 'AppleHuT' },
    { id: 'smartphones', label: 'Mobile Phones' },
    { id: 'smartwatches', label: 'Smartwatches' },
    { id: 'audio', label: 'Earphones & Audio' },
    { id: 'power-banks', label: 'Power Banks' },
    { id: 'charging', label: 'Fast Chargers' },
    { id: 'cases-protection', label: 'Cases & Protection' },
  ];

  // Derived from the products actually on sale
  const brands: (BrandName | 'all')[] = useMemo(
    () => ['all', ...Array.from(new Set(products.map((p) => p.brand))).sort()],
    [products]
  );

  // Live Counts per Category (Baymard Guideline)
  const categoryCounts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const map: Record<string, number> = {};

    categories.forEach((c) => {
      const cnt = products.filter((p) => {
        if (c.id !== 'all' && p.category !== c.id) return false;
        if (selectedBrand !== 'all' && p.brand !== selectedBrand) return false;
        if (inStockOnly && p.stock === 0) return false;
        if (q) {
          const match =
            p.name.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            p.tagline.toLowerCase().includes(q);
          if (!match) return false;
        }
        return true;
      }).length;
      map[c.id] = cnt;
    });

    return map;
  }, [products, selectedBrand, inStockOnly, searchQuery]);

  // Live Counts per Brand (Baymard Guideline)
  const brandCounts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const map: Record<string, number> = {};

    brands.forEach((b) => {
      const cnt = products.filter((p) => {
        if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
        if (b !== 'all' && p.brand !== b) return false;
        if (inStockOnly && p.stock === 0) return false;
        if (q) {
          const match =
            p.name.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            p.tagline.toLowerCase().includes(q);
          if (!match) return false;
        }
        return true;
      }).length;
      map[b] = cnt;
    });

    return map;
  }, [products, selectedCategory, inStockOnly, searchQuery, brands]);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return products
      .filter((p) => {
        // Category match
        if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;

        // Brand match
        if (selectedBrand !== 'all' && p.brand !== selectedBrand) return false;

        // In-stock match
        if (inStockOnly && p.stock === 0) return false;

        // Keyword query match (Name, Brand, Tagline, Category, ID, SKU, Variant options)
        if (q) {
          const matchName = p.name.toLowerCase().includes(q);
          const matchBrand = p.brand.toLowerCase().includes(q);
          const matchTagline = p.tagline.toLowerCase().includes(q);
          const matchId = p.id.toLowerCase().includes(q);
          const matchCategory = p.category.toLowerCase().includes(q);
          const matchVariants = p.variants?.some(
            (v) =>
              v.sku.toLowerCase().includes(q) ||
              (v.storage && v.storage.toLowerCase().includes(q)) ||
              (v.color && v.color.toLowerCase().includes(q))
          );

          if (!matchName && !matchBrand && !matchTagline && !matchId && !matchCategory && !matchVariants) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.priceLKR - b.priceLKR;
        if (sortBy === 'price-desc') return b.priceLKR - a.priceLKR;
        if (sortBy === 'rating') return b.rating - a.rating;
        return (b.isFeaturedPromo ? 1 : 0) - (a.isFeaturedPromo ? 1 : 0);
      });
  }, [products, selectedCategory, selectedBrand, inStockOnly, searchQuery, sortBy]);

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedBrand !== 'all' ||
    inStockOnly ||
    searchQuery.trim().length > 0;

  const handleResetFilters = () => {
    clearSearch();
    setSelectedCategory('all');
    setSelectedBrand('all');
    setInStockOnly(false);
    setSortBy('featured');
  };

  return (
    <section ref={catalogRef} id="catalog" className="py-6 sm:py-8 space-y-4 sm:space-y-6">
      
      {/* 1. Header Toolbar with Title & Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-[#E5E7EB]">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-mono font-semibold uppercase tracking-wider text-[#E11D48]">
            <Flame className="w-3.5 h-3.5" />
            <span>Storefront Catalog</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#111827] tracking-tight font-sans mt-0.5">
            {title}
          </h2>
          <p className="text-xs text-[#6B7280] mt-1">
            {subtitle}
          </p>
        </div>

        {/* Global Catalog Search Box */}
        <div className="relative w-full sm:w-72 shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by model, brand, SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-8 py-2 bg-white border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#E11D48] transition-colors shadow-2xs"
            aria-label="Filter catalog by keyword"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
              aria-label="Clear search query"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Baymard Filter Toolbar: Horizontal Category Chips + Mobile Sheet Trigger */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none snap-x">
        <div className="flex items-center gap-2">
          {categories.map((c) => {
            const count = categoryCounts[c.id] ?? 0;
            const isZero = count === 0 && c.id !== 'all' && selectedCategory !== c.id;
            const isSelected = selectedCategory === c.id;

            return (
              <button
                key={c.id}
                type="button"
                disabled={isZero}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-full transition-all whitespace-nowrap shrink-0 cursor-pointer snap-start min-h-[40px] flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#111827] text-white shadow-xs'
                    : isZero
                    ? 'bg-slate-100 text-slate-300 border border-transparent cursor-not-allowed opacity-50'
                    : 'bg-white text-slate-700 border border-[#E5E7EB] hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span>{c.label}</span>
                <span className={`text-[10px] font-mono ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                  ({count})
                </span>
              </button>
            );
          })}
        </div>

        {/* Mobile "All Filters" Bottom Sheet Trigger */}
        <button
          type="button"
          onClick={() => setIsFilterSheetOpen(true)}
          className="lg:hidden px-3.5 py-2 bg-white text-slate-800 border border-[#E5E7EB] rounded-full text-xs font-semibold flex items-center gap-1.5 shrink-0 shadow-2xs cursor-pointer min-h-[40px]"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#E11D48]" />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-[#E11D48]" />
          )}
        </button>
      </div>

      {/* 3. Secondary Filter & Sort Toolbar (Desktop & Tablet) */}
      <div className="bg-white p-3 sm:p-4 rounded-[18px] border border-[#E5E7EB] shadow-2xs space-y-3">
        
        {/* Brand Filter Row */}
        <div className="hidden lg:flex items-center gap-2 flex-wrap">
          <span className="font-mono text-[10px] uppercase font-bold text-slate-500 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3 text-slate-400" />
            <span>Brand:</span>
          </span>
          {brands.map((b) => {
            const count = brandCounts[b] ?? 0;
            const isZero = count === 0 && b !== 'all' && selectedBrand !== b;
            const isSelected = selectedBrand === b;

            return (
              <button
                key={b}
                type="button"
                disabled={isZero}
                onClick={() => setSelectedBrand(b)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer shrink-0 flex items-center gap-1 ${
                  isSelected
                    ? 'bg-[#111827] text-white'
                    : isZero
                    ? 'bg-slate-100 text-slate-300 cursor-not-allowed opacity-50'
                    : 'bg-[#F7F8FA] text-slate-700 hover:bg-slate-200/60 border border-[#E5E7EB]'
                }`}
              >
                <span>{b === 'all' ? 'All Brands' : b}</span>
                <span className={`text-[10px] font-mono ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                  ({count})
                </span>
              </button>
            );
          })}
        </div>

        {/* Results Count & Secondary Controls (In-stock, Sort) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 lg:border-t border-[#E5E7EB] text-xs">
          
          {/* Result Count */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-[#111827]">
              Showing <strong className="font-bold font-mono">{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'model' : 'models'}
              {searchQuery.trim() ? (
                <> for &ldquo;<span className="text-[#E11D48] font-semibold">{searchQuery}</span>&rdquo;</>
              ) : null}
            </span>
          </div>

          {/* In-Stock Toggle & Sort Dropdown */}
          <div className="flex items-center justify-between sm:justify-end gap-4">
            <label className="flex items-center gap-2 cursor-pointer text-slate-700 select-none text-xs">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded text-[#E11D48] focus:ring-[#E11D48] accent-[#E11D48] cursor-pointer"
              />
              <span className="font-semibold text-[#111827]">In Stock Only</span>
            </label>

            <div className="flex items-center gap-1.5">
              <span className="text-[#6B7280] font-medium text-xs">Sort:</span>
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="text-xs bg-[#F7F8FA] border border-[#E5E7EB] rounded-lg px-2.5 py-1.5 text-slate-800 font-semibold focus:outline-none focus:border-[#E11D48] cursor-pointer"
                aria-label="Sort products by"
              >
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Baymard Applied Filters Summary Strip */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap pt-1" aria-label="Active filters">
          <span className="text-[11px] font-mono uppercase text-slate-500 font-semibold">
            Applied:
          </span>

          {selectedCategory !== 'all' && (
            <span className="inline-flex items-center gap-1 text-xs bg-white text-slate-800 px-3 py-1 rounded-full border border-[#E5E7EB] shadow-2xs">
              <span>Category: <strong>{categories.find((c) => c.id === selectedCategory)?.label}</strong></span>
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className="hover:text-[#E11D48] p-0.5 cursor-pointer"
                aria-label="Remove category filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedBrand !== 'all' && (
            <span className="inline-flex items-center gap-1 text-xs bg-white text-slate-800 px-3 py-1 rounded-full border border-[#E5E7EB] shadow-2xs">
              <span>Brand: <strong>{selectedBrand}</strong></span>
              <button
                type="button"
                onClick={() => setSelectedBrand('all')}
                className="hover:text-[#E11D48] p-0.5 cursor-pointer"
                aria-label="Remove brand filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {inStockOnly && (
            <span className="inline-flex items-center gap-1 text-xs bg-white text-slate-800 px-3 py-1 rounded-full border border-[#E5E7EB] shadow-2xs">
              <span>In Stock Only</span>
              <button
                type="button"
                onClick={() => setInStockOnly(false)}
                className="hover:text-[#E11D48] p-0.5 cursor-pointer"
                aria-label="Remove in-stock filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {searchQuery.trim() && (
            <span className="inline-flex items-center gap-1 text-xs bg-white text-slate-800 px-3 py-1 rounded-full border border-[#E5E7EB] shadow-2xs">
              <span>Keyword: <strong>&ldquo;{searchQuery}&rdquo;</strong></span>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="hover:text-[#E11D48] p-0.5 cursor-pointer"
                aria-label="Remove keyword search"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            type="button"
            onClick={handleResetFilters}
            className="text-xs font-semibold text-[#E11D48] hover:underline cursor-pointer ml-1"
          >
            Clear all
          </button>
        </div>
      )}

      {/* 5. Product Grid or Empty State */}
      {filteredProducts.length === 0 ? (
        <div className="py-14 sm:py-20 text-center bg-white border border-dashed border-[#E5E7EB] rounded-[18px] px-4 space-y-3">
          <p className="text-base font-bold text-[#111827]">No devices match your criteria</p>
          <p className="text-xs text-[#6B7280] max-w-sm mx-auto leading-relaxed">
            {searchQuery
              ? `No catalog items matched "${searchQuery}". Verify your search terms or reset the filters below.`
              : 'No items are available for the selected brand or stock criteria.'}
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-[#E11D48] hover:bg-[#BE123C] rounded-lg transition-colors shadow-xs cursor-pointer min-h-[40px]"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 min-[360px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      {/* 6. Baymard Mobile "All Filters" Bottom Sheet */}
      {isFilterSheetOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end bg-slate-950/50 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setIsFilterSheetOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Filter Products"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-h-[85vh] bg-white rounded-t-[24px] p-5 pb-safe space-y-5 overflow-y-auto border-t border-[#E5E7EB] shadow-floating"
          >
            {/* Sheet Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
              <div>
                <h3 className="text-base font-bold text-[#111827]">Filters &amp; Sorting</h3>
                <p className="text-xs text-[#6B7280]">Refine product catalog</p>
              </div>
              <button
                type="button"
                onClick={() => setIsFilterSheetOpen(false)}
                className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 cursor-pointer"
                aria-label="Close filters"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* In-Stock Toggle */}
            <div className="flex items-center justify-between p-3 bg-[#F7F8FA] rounded-xl border border-[#E5E7EB]">
              <span className="text-xs font-semibold text-[#111827]">In Stock Only</span>
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-5 h-5 rounded text-[#E11D48] accent-[#E11D48] cursor-pointer"
              />
            </div>

            {/* Brand Section */}
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase font-bold text-slate-500">Brands</span>
              <div className="grid grid-cols-2 gap-2">
                {brands.map((b) => {
                  const count = brandCounts[b] ?? 0;
                  const isZero = count === 0 && b !== 'all' && selectedBrand !== b;
                  const isSelected = selectedBrand === b;

                  return (
                    <button
                      key={b}
                      type="button"
                      disabled={isZero}
                      onClick={() => setSelectedBrand(b)}
                      className={`p-2.5 rounded-xl text-xs font-semibold text-left flex items-center justify-between transition-colors ${
                        isSelected
                          ? 'bg-[#111827] text-white'
                          : isZero
                          ? 'bg-slate-100 text-slate-300 opacity-50 cursor-not-allowed'
                          : 'bg-[#F7F8FA] text-slate-800 border border-[#E5E7EB]'
                      }`}
                    >
                      <span className="truncate">{b === 'all' ? 'All Brands' : b}</span>
                      <span className={`text-[10px] font-mono ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                        ({count})
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sort Order Section */}
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase font-bold text-slate-500">Sort By</span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'featured', label: 'Featured First' },
                  { id: 'price-asc', label: 'Price: Low to High' },
                  { id: 'price-desc', label: 'Price: High to Low' },
                  { id: 'rating', label: 'Highest Rated' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSortBy(s.id as any)}
                    className={`p-2.5 rounded-xl text-xs font-semibold text-left flex items-center justify-between transition-colors ${
                      sortBy === s.id
                        ? 'bg-[#111827] text-white'
                        : 'bg-[#F7F8FA] text-slate-800 border border-[#E5E7EB]'
                    }`}
                  >
                    <span>{s.label}</span>
                    {sortBy === s.id && <Check className="w-3.5 h-3.5 text-white" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Sticky Action Footer */}
            <div className="pt-3 border-t border-[#E5E7EB] flex items-center gap-3">
              <button
                type="button"
                onClick={handleResetFilters}
                className="flex-1 py-3 bg-[#F7F8FA] hover:bg-slate-100 text-[#111827] text-xs font-semibold rounded-xl border border-[#E5E7EB] transition-colors cursor-pointer"
              >
                Reset All
              </button>
              <button
                type="button"
                onClick={() => setIsFilterSheetOpen(false)}
                className="flex-1 py-3 bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-bold rounded-xl transition-colors shadow-xs cursor-pointer"
              >
                Show {filteredProducts.length} Results
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
