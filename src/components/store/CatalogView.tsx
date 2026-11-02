import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from './ProductCard';
import { CatalogListView } from './CatalogListView';
import { CatalogFilterRail } from './CatalogFilterRail';
import { CatalogFilterSheet } from './CatalogFilterSheet';
import { ProductCategory, BrandName } from '../../types';
import { Search, X, SlidersHorizontal, LayoutGrid, List } from 'lucide-react';

interface CatalogViewProps {
  initialCategory?: ProductCategory | 'all';
  title?: string;
  subtitle?: string;
}

const CATEGORIES: { id: ProductCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All Inventory' },
  { id: 'apple-store', label: 'AppleHuT' },
  { id: 'smartphones', label: 'Smartphones' },
  { id: 'smartwatches', label: 'Watches' },
  { id: 'audio', label: 'Earphones & Audio' },
  { id: 'power-banks', label: 'Power Banks' },
  { id: 'charging', label: 'Fast Chargers' },
  { id: 'cases-protection', label: 'Cases & Protection' },
];

export const CatalogView: React.FC<CatalogViewProps> = ({
  initialCategory,
  title = 'Browse Counter Shelf',
  subtitle = 'Live inventory & real-time counter tags. All prices in Sri Lankan Rupees (LKR).',
}) => {
  const {
    storefrontProducts: products,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    clearSearch,
  } = useStore();

  useEffect(() => {
    if (initialCategory && initialCategory !== 'all') {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory, setSelectedCategory]);

  const [selectedBrand, setSelectedBrand] = useState<BrandName | 'all'>('all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  const catalogRef = useRef<HTMLDivElement>(null);

  const brands: (BrandName | 'all')[] = useMemo(
    () => ['all', ...Array.from(new Set(products.map((p) => p.brand))).sort()],
    [products]
  );

  const categoryCounts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const map: Record<string, number> = {};
    CATEGORIES.forEach((c) => {
      map[c.id] = products.filter((p) => {
        if (c.id !== 'all' && p.category !== c.id) return false;
        if (selectedBrand !== 'all' && p.brand !== selectedBrand) return false;
        if (inStockOnly && p.stock === 0) return false;
        if (q && !p.name.toLowerCase().includes(q) && !p.brand.toLowerCase().includes(q) && !p.tagline.toLowerCase().includes(q)) return false;
        return true;
      }).length;
    });
    return map;
  }, [products, selectedBrand, inStockOnly, searchQuery]);

  const brandCounts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const map: Record<string, number> = {};
    brands.forEach((b) => {
      map[b] = products.filter((p) => {
        if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
        if (b !== 'all' && p.brand !== b) return false;
        if (inStockOnly && p.stock === 0) return false;
        if (q && !p.name.toLowerCase().includes(q) && !p.brand.toLowerCase().includes(q) && !p.tagline.toLowerCase().includes(q)) return false;
        return true;
      }).length;
    });
    return map;
  }, [products, selectedCategory, inStockOnly, searchQuery, brands]);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return products
      .filter((p) => {
        if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
        if (selectedBrand !== 'all' && p.brand !== selectedBrand) return false;
        if (inStockOnly && p.stock === 0) return false;
        if (q) {
          const matchName = p.name.toLowerCase().includes(q);
          const matchBrand = p.brand.toLowerCase().includes(q);
          const matchTag = p.tagline.toLowerCase().includes(q);
          const matchId = p.id.toLowerCase().includes(q);
          const matchVar = p.variants?.some((v) => v.sku.toLowerCase().includes(q) || v.storage?.toLowerCase().includes(q) || v.color?.toLowerCase().includes(q));
          if (!matchName && !matchBrand && !matchTag && !matchId && !matchVar) return false;
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

  const hasActiveFilters = selectedCategory !== 'all' || selectedBrand !== 'all' || inStockOnly || searchQuery.trim().length > 0;

  const handleResetFilters = () => {
    clearSearch();
    setSelectedCategory('all');
    setSelectedBrand('all');
    setInStockOnly(false);
    setSortBy('featured');
  };

  return (
    <section ref={catalogRef} id="catalog" className="py-6 sm:py-8 space-y-6">
      {/* 1. Header & Search Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 pb-4 border-b border-line">
        <div className="text-left space-y-1">
          <div className="flex items-center gap-1.5 font-data text-[10px] font-bold uppercase tracking-wider text-red">
            <span className="w-2 h-2 rounded-full bg-red inline-block" />
            <span>Shelf Catalog</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight">
            {title}
          </h2>
          <p className="font-ui text-xs text-ink-soft">
            {subtitle}
          </p>
        </div>

        {/* Search input & View toggles */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 text-ink-soft absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search model, SKU, spec..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full font-ui text-xs pl-9 pr-8 py-2.5 bg-card border border-line rounded-full focus:outline-none focus:border-ink transition-colors shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-ink-soft hover:text-ink cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Grid / List View Toggle */}
          <div className="hidden sm:flex items-center bg-card border border-line rounded-full p-0.5">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-ink text-paper' : 'text-ink-soft hover:text-ink'
              }`}
              aria-label="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                viewMode === 'list' ? 'bg-ink text-paper' : 'text-ink-soft hover:text-ink'
              }`}
              aria-label="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Filter Button */}
          <button
            type="button"
            onClick={() => setIsFilterSheetOpen(true)}
            className="lg:hidden px-3.5 py-2.5 bg-card text-ink border border-line rounded-full text-xs font-bold flex items-center gap-1.5 shrink-0 shadow-2xs cursor-pointer min-h-[44px]"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-red" />
            <span>Filter</span>
            {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-red" />}
          </button>
        </div>
      </div>

      {/* 2. Main Two-Column Layout (Rail Left + Catalog Right) */}
      <div className="flex items-start gap-8">
        <CatalogFilterRail
          categories={CATEGORIES}
          categoryCounts={categoryCounts}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          brands={brands}
          brandCounts={brandCounts}
          selectedBrand={selectedBrand}
          onSelectBrand={setSelectedBrand}
          inStockOnly={inStockOnly}
          onToggleInStock={setInStockOnly}
          sortBy={sortBy}
          onSelectSort={setSortBy}
          onReset={handleResetFilters}
          hasActiveFilters={hasActiveFilters}
        />

        <div className="flex-1 min-w-0 space-y-4">
          {/* Top Status Bar: Count in mono + Applied chips */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="font-data text-xs text-ink-soft">
              Showing <span className="font-bold text-ink font-mono">{filteredProducts.length}</span> tags
              {searchQuery && <> for &ldquo;<span className="text-red font-semibold">{searchQuery}</span>&rdquo;</>}
            </div>

            {hasActiveFilters && (
              <div className="flex items-center gap-1.5 flex-wrap">
                {selectedCategory !== 'all' && (
                  <span className="font-data text-[11px] bg-paper-sunk px-2.5 py-0.5 rounded-full border border-line text-ink flex items-center gap-1">
                    {CATEGORIES.find((c) => c.id === selectedCategory)?.label}
                    <button type="button" onClick={() => setSelectedCategory('all')} className="hover:text-red">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedBrand !== 'all' && (
                  <span className="font-data text-[11px] bg-paper-sunk px-2.5 py-0.5 rounded-full border border-line text-ink flex items-center gap-1">
                    {selectedBrand}
                    <button type="button" onClick={() => setSelectedBrand('all')} className="hover:text-red">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {inStockOnly && (
                  <span className="font-data text-[11px] bg-paper-sunk px-2.5 py-0.5 rounded-full border border-line text-ink flex items-center gap-1">
                    In Stock
                    <button type="button" onClick={() => setInStockOnly(false)} className="hover:text-red">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                <button type="button" onClick={handleResetFilters} className="font-data text-[11px] text-red underline ml-1 cursor-pointer">
                  Clear
                </button>
              </div>
            )}
          </div>

          {/* Product Items or Empty State */}
          {filteredProducts.length === 0 ? (
            <div className="py-16 text-center bg-card border border-dashed border-line rounded-2xl px-4 space-y-3">
              <p className="font-display text-lg font-bold text-ink">No tags found on this shelf</p>
              <p className="font-ui text-xs text-ink-soft max-w-sm mx-auto">
                No inventory matched your filter or search criteria. Try clearing tags or selecting another brand.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-5 py-2.5 text-xs font-bold text-paper bg-ink hover:bg-red rounded-full transition-colors cursor-pointer min-h-[44px]"
              >
                Reset All Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 min-[360px]:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <CatalogListView products={filteredProducts} />
          )}
        </div>
      </div>

      {/* Mobile Filter Sheet */}
      <CatalogFilterSheet
        open={isFilterSheetOpen}
        onClose={() => setIsFilterSheetOpen(false)}
        categories={CATEGORIES}
        categoryCounts={categoryCounts}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        brands={brands}
        brandCounts={brandCounts}
        selectedBrand={selectedBrand}
        onSelectBrand={setSelectedBrand}
        inStockOnly={inStockOnly}
        onToggleInStock={setInStockOnly}
        sortBy={sortBy}
        onSelectSort={setSortBy}
        onReset={handleResetFilters}
        totalResults={filteredProducts.length}
      />
    </section>
  );
};
