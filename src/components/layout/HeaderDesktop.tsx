import React from 'react';
import { Search, Heart, Shield } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Logo } from '../ui/Logo';
import { Dot } from '../ui/Dot';
import { SegmentedControl } from '../ui/Chip';
import { ProductCategory } from '../../types';

interface HeaderDesktopProps {
  onOpenSearch: () => void;
}

export const HeaderDesktop: React.FC<HeaderDesktopProps> = ({ onOpenSearch }) => {
  const {
    activeView,
    setActiveView,
    currency,
    setCurrency,
    wishlist,
    setIsWishlistOpen,
    cartTotalCount,
    setIsCartOpen,
    storefrontProducts,
    selectedCategory,
    executeSearch,
  } = useStore();

  const categories: { id: ProductCategory; label: string }[] = [
    { id: 'apple-store', label: 'AppleHuT' },
    { id: 'smartphones', label: 'Phones' },
    { id: 'smartwatches', label: 'Watches' },
    { id: 'audio', label: 'Audio' },
    { id: 'power-banks', label: 'Power Banks' },
    { id: 'charging', label: 'Chargers' },
    { id: 'cases-protection', label: 'Cases & Shield' },
  ];

  // Derive live counts per category from current unarchived storefrontProducts
  const counts = React.useMemo(() => {
    const map: Record<string, number> = {};
    storefrontProducts.forEach((p) => {
      map[p.category] = (map[p.category] || 0) + 1;
    });
    return map;
  }, [storefrontProducts]);

  return (
    <header className="hidden md:block bg-paper border-b border-line select-none">
      {/* 1. Main Header Row (64px) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* Left: Authentic SVG Logo */}
        <button
          type="button"
          onClick={() => setActiveView('store')}
          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink rounded-lg cursor-pointer"
          aria-label="y5Hut Home"
        >
          <Logo size="md" showWordmark showTagline />
        </button>

        {/* Center: Search Pill (Command Palette Trigger) */}
        <button
          type="button"
          onClick={onOpenSearch}
          className="flex-1 max-w-md bg-card hover:bg-paper-sunk border border-line hover:border-ink rounded-full px-4 py-2 flex items-center justify-between text-xs text-ink-soft transition-all cursor-pointer shadow-2xs group"
          aria-label="Open search command palette"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-4 h-4 text-ink-soft group-hover:text-red transition-colors shrink-0" />
            <span className="font-ui text-ink/80 group-hover:text-ink">
              Search phones, models, AirPods, chargers...
            </span>
          </div>
          <kbd className="hidden lg:inline-flex items-center gap-0.5 px-2 py-0.5 rounded font-data text-[10px] uppercase font-bold text-ink-soft bg-paper border border-line">
            ⌘K
          </kbd>
        </button>

        {/* Right Controls: LKR|USD, Wishlist, Bag Tag, Owner Console */}
        <div className="flex items-center gap-3 lg:gap-4 shrink-0">
          {/* LKR / USD Switcher */}
          <SegmentedControl
            size="sm"
            value={currency}
            onChange={(c) => setCurrency(c as 'LKR' | 'USD')}
            options={[
              { value: 'LKR', label: 'LKR' },
              { value: 'USD', label: 'USD' },
            ]}
          />

          {/* Wishlist Icon Button */}
          <button
            type="button"
            onClick={() => setIsWishlistOpen(true)}
            className="relative w-10 h-10 rounded-full border border-line bg-card hover:bg-paper-sunk hover:border-ink flex items-center justify-center text-ink transition-colors cursor-pointer"
            aria-label={`Wishlist (${wishlist.length} saved)`}
            title="Saved Tags (Wishlist)"
          >
            <Heart className="w-4 h-4" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-ink text-paper font-data text-[9px] font-bold flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Shopping Bag drawn as a mini Hang-Tag with count on red Dot */}
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="group relative inline-flex items-center gap-2 bg-card hover:bg-paper-sunk border-[1.5px] border-ink rounded-lg px-3 py-1.5 min-h-[40px] shadow-2xs hover:shadow-hard transition-all cursor-pointer"
            aria-label={`Shopping Bag (${cartTotalCount} items)`}
          >
            {/* Tag notch on left edge */}
            <span className="w-2 h-2 rounded-full border border-ink bg-paper -ml-1 shrink-0" />
            <span className="font-data text-xs font-bold text-ink uppercase tracking-wide">
              Bag
            </span>
            <span className="relative flex items-center justify-center">
              <span className="min-w-[20px] h-[20px] px-1.5 rounded-full bg-red text-white font-data text-[10px] font-extrabold flex items-center justify-center leading-none">
                {cartTotalCount}
              </span>
            </span>
          </button>

          {/* Owner Console Link */}
          <button
            type="button"
            onClick={() => setActiveView('admin')}
            className={`
              inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full font-ui text-xs font-bold transition-all cursor-pointer border-[1.5px]
              ${
                activeView === 'admin'
                  ? 'bg-ink text-paper border-ink shadow-hard'
                  : 'bg-card text-ink border-ink hover:bg-paper-sunk'
              }
            `}
            title="Open merchant pricing and stock dashboard"
          >
            <Shield className="w-3.5 h-3.5 text-red" />
            <span>Owner Console</span>
          </button>
        </div>
      </div>

      {/* 2. Desktop Shelf-Label Category Rail */}
      <div className="border-t border-line bg-paper/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between overflow-x-auto scrollbar-none">
          <nav className="flex items-center gap-1 py-1.5" aria-label="Product categories rail">
            {/* All Products Tab */}
            <button
              type="button"
              onClick={() => {
                setActiveView('store');
                executeSearch('', 'all');
              }}
              className={`
                px-3 py-1.5 rounded-md font-data text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer
                ${
                  activeView === 'store' && selectedCategory === 'all'
                    ? 'bg-ink text-paper font-bold shadow-2xs'
                    : 'text-ink-soft hover:text-ink hover:bg-paper-sunk font-medium'
                }
              `}
            >
              {activeView === 'store' && selectedCategory === 'all' && <Dot tone="red" size="xs" />}
              <span>All Products</span>
              <span className="text-[10px] opacity-70">({storefrontProducts.length})</span>
            </button>

            {/* Category Shelf-Labels */}
            {categories.map((cat) => {
              const count = counts[cat.id] || 0;
              const isActive = (activeView === 'store' || activeView === 'apple-store') && selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    if (cat.id === 'apple-store') {
                      setActiveView('apple-store');
                    } else {
                      setActiveView('store');
                    }
                    executeSearch('', cat.id);
                  }}
                  className={`
                    px-3 py-1.5 rounded-md font-data text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer
                    ${
                      isActive
                        ? 'bg-ink text-paper font-bold shadow-2xs'
                        : 'text-ink-soft hover:text-ink hover:bg-paper-sunk font-medium'
                    }
                  `}
                >
                  {isActive && <Dot tone="red" size="xs" />}
                  <span>{cat.label}</span>
                  <span className="text-[10px] opacity-70">({count})</span>
                </button>
              );
            })}
          </nav>

          {/* Right link: Hot Deals shortcut */}
          <button
            type="button"
            onClick={() => setActiveView('deals')}
            className={`
              shrink-0 font-data text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors cursor-pointer
              ${
                activeView === 'deals'
                  ? 'bg-red text-white'
                  : 'text-red hover:bg-red-wash/40'
              }
            `}
          >
            <span>Today's Deals</span>
            <span className="w-1.5 h-1.5 rounded-full bg-red animate-pulse" />
          </button>
        </div>
      </div>
    </header>
  );
};
