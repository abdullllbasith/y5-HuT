import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from './ProductCard';
import { ProductCategory, BrandName } from '../../types';
import { Search, SlidersHorizontal, Flame } from 'lucide-react';

interface CatalogViewProps {
  initialCategory?: ProductCategory | 'all';
  title?: string;
  subtitle?: string;
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  initialCategory = 'all',
  title = 'Trending Tech & Gadgets in Sri Lanka',
  subtitle = '100% Genuine electronics with manufacturer warranty & islandwide delivery.',
}) => {
  const { storefrontProducts: products } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>(initialCategory);
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

  // Derived from the products actually on sale, so new brands appear without code changes.
  const brands: (BrandName | 'all')[] = useMemo(
    () => ['all', ...Array.from(new Set(products.map((p) => p.brand))).sort()],
    [products]
  );

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
        if (selectedBrand !== 'all' && p.brand !== selectedBrand) return false;
        if (inStockOnly && p.stock === 0) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchBrand = p.brand.toLowerCase().includes(q);
          const matchTagline = p.tagline.toLowerCase().includes(q);
          if (!matchName && !matchBrand && !matchTagline) return false;
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

  return (
    <section className="py-8 space-y-6">
      
      {/* Section Title Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#E11D48]">
            <Flame className="w-3.5 h-3.5" />
            <span>Featured Collection</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-sans mt-0.5">
            {title}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {subtitle}
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search within catalog..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#E11D48] transition-colors"
          />
        </div>
      </div>

      {/* Category Filter Tabs (y5Hut.lk horizontal bar) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
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
      <div className="flex items-center justify-between flex-wrap gap-4 text-xs text-slate-600 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
        {/* Brand Chips */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-slate-900 text-xs">Brand:</span>
          {brands.map((b) => (
            <button
              key={b}
              onClick={() => setSelectedBrand(b)}
              className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                selectedBrand === b
                  ? 'bg-slate-900 text-white font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {b === 'all' ? 'All Brands' : b}
            </button>
          ))}
        </div>

        {/* In-Stock & Sort Controls */}
        <div className="flex items-center gap-4 ml-auto">
          <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 select-none">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="rounded text-[#E11D48] focus:ring-[#E11D48]"
            />
            <span className="font-semibold">In Stock Only</span>
          </label>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-[#E11D48]"
            >
              <option value="featured">Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4-Column Product Grid (y5Hut.lk Standard Desktop Layout) */}
      {filteredProducts.length === 0 ? (
        <div className="py-16 text-center bg-white border border-dashed border-slate-200 rounded-xl">
          <p className="text-sm font-bold text-slate-700">No tech items match your criteria</p>
          <p className="text-xs text-slate-500 mt-1">Try resetting the category or brand filters.</p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedBrand('all');
              setSearchQuery('');
              setInStockOnly(false);
            }}
            className="mt-4 px-4 py-2 text-xs font-bold text-white bg-[#E11D48] rounded-md hover:bg-[#BE123C] cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
};
