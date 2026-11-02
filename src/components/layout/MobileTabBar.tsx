import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Store,
  Flame,
  Search,
  ShoppingBag,
  Menu,
  Shield,
  Heart,
  Star,
  Smartphone,
  RotateCcw,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Sheet } from '../ui/Sheet';
import { Dot } from '../ui/Dot';
import { ProductCategory } from '../../types';

interface MobileTabBarProps {
  onOpenSearch: () => void;
}

export const MobileTabBar: React.FC<MobileTabBarProps> = ({ onOpenSearch }) => {
  const {
    activeView,
    setActiveView,
    cartTotalCount,
    setIsCartOpen,
    wishlist,
    setIsWishlistOpen,
    resetDemoData,
    executeSearch,
  } = useStore();

  const [menuOpen, setMenuOpen] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  const categories: { id: ProductCategory; label: string }[] = [
    { id: 'apple-store', label: 'AppleHuT Showcase' },
    { id: 'smartphones', label: 'Phones & Flagships' },
    { id: 'smartwatches', label: 'Smartwatches' },
    { id: 'audio', label: 'Audio & ANC Earbuds' },
    { id: 'power-banks', label: 'Power Banks' },
    { id: 'charging', label: 'Chargers & Docks' },
    { id: 'cases-protection', label: 'Cases & Shield' },
  ];

  type TabId = 'shop' | 'deals' | 'search' | 'bag' | 'menu';

  const currentTab: TabId =
    activeView === 'store'
      ? 'shop'
      : activeView === 'deals'
      ? 'deals'
      : activeView === 'apple-store'
      ? 'shop'
      : 'menu';

  return (
    <>
      <nav
        aria-label="Mobile Bottom Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md border-t border-line pb-safe shadow-sheet select-none"
      >
        <div className="grid grid-cols-5 h-14 relative px-1">
          {/* 1. Shop */}
          <button
            type="button"
            onClick={() => setActiveView('store')}
            className="relative flex flex-col items-center justify-center min-h-[44px] cursor-pointer"
            aria-label="Shop Catalog"
          >
            {currentTab === 'shop' && (
              <motion.span
                layoutId="mobileNavPill"
                className="absolute inset-x-1.5 inset-y-1 bg-soft-surface rounded-xl -z-10"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.3 }}
              />
            )}
            <Store className={`w-5 h-5 ${currentTab === 'shop' ? 'text-red' : 'text-ink-soft'}`} />
            <span
              className={`font-data text-[10px] mt-0.5 ${
                currentTab === 'shop' ? 'font-bold text-ink' : 'text-ink-soft'
              }`}
            >
              Shop
            </span>
          </button>

          {/* 2. Deals */}
          <button
            type="button"
            onClick={() => setActiveView('deals')}
            className="relative flex flex-col items-center justify-center min-h-[44px] cursor-pointer"
            aria-label="Hot Deals"
          >
            {currentTab === 'deals' && (
              <motion.span
                layoutId="mobileNavPill"
                className="absolute inset-x-1.5 inset-y-1 bg-ink/10 rounded-xl -z-10"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.3 }}
              />
            )}
            <Flame className={`w-5 h-5 ${currentTab === 'deals' ? 'text-red' : 'text-ink-soft'}`} />
            <span
              className={`font-data text-[10px] mt-0.5 ${
                currentTab === 'deals' ? 'font-bold text-ink' : 'text-ink-soft'
              }`}
            >
              Deals
            </span>
          </button>

          {/* 3. Search */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="relative flex flex-col items-center justify-center min-h-[44px] cursor-pointer"
            aria-label="Search"
          >
            <Search className="w-5 h-5 text-ink-soft hover:text-red transition-colors" />
            <span className="font-data text-[10px] text-ink-soft mt-0.5">Search</span>
          </button>

          {/* 4. Bag */}
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="relative flex flex-col items-center justify-center min-h-[44px] cursor-pointer"
            aria-label={`Shopping Bag with ${cartTotalCount} items`}
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 text-ink-soft" />
              {cartTotalCount > 0 && (
                <span className="absolute -top-1 -right-2 min-w-[16px] h-[16px] px-1 rounded-full bg-red text-white font-data text-[8px] font-extrabold flex items-center justify-center">
                  {cartTotalCount}
                </span>
              )}
            </div>
            <span className="font-data text-[10px] text-ink-soft mt-0.5">Bag</span>
          </button>

          {/* 5. Menu / More */}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="relative flex flex-col items-center justify-center min-h-[44px] cursor-pointer"
            aria-label="Menu and account"
          >
            {activeView === 'admin' && (
              <motion.span
                layoutId="mobileNavPill"
                className="absolute inset-x-1.5 inset-y-1 bg-ink/10 rounded-xl -z-10"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.3 }}
              />
            )}
            <Menu className={`w-5 h-5 ${activeView === 'admin' ? 'text-red' : 'text-ink-soft'}`} />
            <span
              className={`font-data text-[10px] mt-0.5 ${
                activeView === 'admin' ? 'font-bold text-ink' : 'text-ink-soft'
              }`}
            >
              Menu
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer Sheet */}
      <Sheet
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        title="Store Menu"
        subtitle="y5Hut.lk Navigation & Counter Controls"
        mode="bottom"
      >
        <div className="space-y-4 pb-4 text-left">
          {/* Owner Console Primary Callout */}
          <button
            type="button"
            onClick={() => {
              setActiveView('admin');
              setMenuOpen(false);
            }}
            className="w-full p-4 rounded-xl bg-ink text-paper border-[1.5px] border-ink shadow-hard flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-red flex items-center justify-center text-white shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <div className="font-ui font-bold text-sm text-paper flex items-center gap-2">
                  <span>Owner Console</span>
                  <Dot tone="red" size="xs" />
                </div>
                <div className="font-data text-[11px] text-paper-sunk opacity-80">
                  Manage prices, inventory &amp; CSV
                </div>
              </div>
            </div>
            <span className="font-data text-xs font-bold text-red bg-paper px-2 py-0.5 rounded">
              OPEN →
            </span>
          </button>

          {/* Quick Views */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setActiveView('apple-store');
                setMenuOpen(false);
              }}
              className="p-3 bg-paper rounded-xl border border-line text-left flex items-center gap-2.5 cursor-pointer hover:border-ink"
            >
              <Smartphone className="w-4 h-4 text-ink-soft" />
              <div>
                <div className="font-ui font-bold text-xs text-ink">AppleHuT</div>
                <div className="font-data text-[10px] text-ink-soft">Night showcase</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsWishlistOpen(true);
                setMenuOpen(false);
              }}
              className="p-3 bg-paper rounded-xl border border-line text-left flex items-center gap-2.5 cursor-pointer hover:border-ink"
            >
              <Heart className="w-4 h-4 text-red" />
              <div>
                <div className="font-ui font-bold text-xs text-ink">Saved Tags</div>
                <div className="font-data text-[10px] text-ink-soft">{wishlist.length} items</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveView('reviews');
                setMenuOpen(false);
              }}
              className="p-3 bg-paper rounded-xl border border-line text-left flex items-center gap-2.5 cursor-pointer hover:border-ink"
            >
              <Star className="w-4 h-4 text-low" />
              <div>
                <div className="font-ui font-bold text-xs text-ink">Reviews</div>
                <div className="font-data text-[10px] text-ink-soft">Customer notes</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setResetConfirmOpen(true);
                setMenuOpen(false);
              }}
              className="p-3 bg-red-wash/40 rounded-xl border border-red/20 text-left flex items-center gap-2.5 cursor-pointer hover:border-red"
            >
              <RotateCcw className="w-4 h-4 text-red" />
              <div>
                <div className="font-ui font-bold text-xs text-red-ink">Reset Demo</div>
                <div className="font-data text-[10px] text-ink-soft">Clean sample state</div>
              </div>
            </button>
          </div>

          {/* Categories List */}
          <div className="pt-2 border-t border-line">
            <span className="font-data text-[11px] font-bold uppercase tracking-wider text-ink-soft block mb-2">
              Browse Categories
            </span>
            <div className="divide-y divide-line/40 border border-line rounded-xl overflow-hidden bg-paper">
              {categories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    if (c.id === 'apple-store') {
                      setActiveView('apple-store');
                    } else {
                      setActiveView('store');
                      executeSearch('', c.id);
                    }
                  }}
                  className="w-full text-left p-3 text-xs font-ui font-semibold text-ink hover:bg-paper-sunk flex items-center justify-between cursor-pointer"
                >
                  <span>{c.label}</span>
                  <span className="font-data text-ink-soft">→</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </Sheet>

      {/* Reset Confirmation Dialog */}
      {resetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-xs">
          <div className="bg-card text-ink border-[1.5px] border-ink rounded-2xl shadow-hard max-w-sm w-full p-5 space-y-3.5 text-left">
            <h3 className="font-display font-bold text-lg text-ink">Reset Demo Data?</h3>
            <p className="font-ui text-xs text-ink-soft leading-relaxed">
              This resets all catalog prices, stock adjustments, orders, and price history in <strong>this browser</strong> back to the initial sample data.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setResetConfirmOpen(false)}
                className="px-3.5 py-2 rounded-full border border-line bg-paper text-ink font-ui text-xs font-bold hover:bg-paper-sunk cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  resetDemoData();
                  setResetConfirmOpen(false);
                }}
                className="px-4 py-2 rounded-full bg-red text-white border-[1.5px] border-ink font-ui text-xs font-bold hover:bg-red-ink shadow-hard cursor-pointer"
              >
                Yes, Reset Data
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

