import React, { useState, useMemo, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from './ProductCard';
import { ProductCategory, BrandName } from '../../types';
import { Search, Flame, X, Filter } from 'lucide-react';

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
          const matchVariants = p.variants?.some((v) =>
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
    setSelectedBrand('all');
    setInStockOnly(false);
    setSortBy('featured');
  };

  return (
    <section className="py-6 sm:py-8 space-y-4 sm:space-y-6">
      
      {/* Section Title Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#E11D48]">
            <Flame className="w-3.5 h-3.5" />
            <span>Featured Collection</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight font-sans mt-0.5">
            {title}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {subtitle}
          </p>
        </div>

        {/* Search Bar - Shared End-to-End with Header */}
        <div className="relative w-full sm:w-72 shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search within catalog..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#E11D48] transition-colors"
            aria-label="Filter catalog by keyword"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 p-0.5"
              aria-label="Clear search query"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Chips (Horizontal swipe with smooth mobile overflow) */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1.5 scrollbar-none snap-x">
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setSelectedCategory(c.id)}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer snap-start ${
              selectedCategory === c.id
                ? 'bg-[#E11D48] text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Brand Filters & Sort Toolbar */}
      <div className="space-y-3 bg-white p-3 sm:p-3.5 rounded-xl border border-slate-200 shadow-2xs">
        
        {/* Brand Chips */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none sm:flex-wrap">
          <span className="font-bold text-slate-900 text-xs shrink-0 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3 text-slate-400" />
            <span>Brand:</span>
          </span>
          {brands.map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => setSelectedBrand(b)}
              className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer shrink-0 ${
                selectedBrand === b
                  ? 'bg-slate-900 text-white font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {b === 'all' ? 'All Brands' : b}
            </button>
          ))}
        </div>

        {/* Results Count & Secondary Controls (In-stock, Sort) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2 border-t border-slate-100 text-xs">
          
          {/* Result Count and Active Filter Tag */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-slate-700">
              Showing <strong className="text-slate-900">{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'product' : 'products'}
              {searchQuery.trim() ? (
                <> for &ldquo;<span className="text-[#E11D48] font-bold">{searchQuery}</span>&rdquo;</>
              ) : null}
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-[11px] text-[#E11D48] hover:underline font-bold inline-flex items-center gap-1 cursor-pointer ml-1"
              >
                <span>Reset all filters</span>
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* In-Stock Toggle & Sort Dropdown */}
          <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 select-none text-xs">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded text-[#E11D48] focus:ring-[#E11D48] cursor-pointer"
              />
              <span className="font-medium">In Stock Only</span>
            </label>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium text-xs">Sort:</span>
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-[#E11D48] cursor-pointer"
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

      {/* Responsive Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-12 sm:py-16 text-center bg-white border border-dashed border-slate-200 rounded-xl px-4">
          <p className="text-sm font-bold text-slate-800">No tech items match your criteria</p>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {searchQuery
              ? `No results found for "${searchQuery}". Check your spelling or clear filters.`
              : 'No products currently match the selected category, brand, or stock filters.'}
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="mt-4 px-4 py-2 text-xs font-bold text-white bg-[#E11D48] rounded-md hover:bg-[#BE123C] cursor-pointer transition-colors shadow-xs"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 min-[360px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {filteredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
};
