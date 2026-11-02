import React from 'react';
import { motion } from 'motion/react';
import { Search, Shield, Store } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Logo } from '../ui/Logo';

interface HeaderMobileProps {
  onOpenSearch: () => void;
}

export const HeaderMobile: React.FC<HeaderMobileProps> = ({ onOpenSearch }) => {
  const { activeView, setActiveView, cartTotalCount, setIsCartOpen, currency, setCurrency } = useStore();

  return (
    <header className="md:hidden bg-surface/95 backdrop-blur-md border-b border-line px-3.5 h-14 flex items-center justify-between gap-2 select-none sticky top-0 z-40 transition-all">
      {/* Left: Authentic SVG Logo */}
      <motion.button
        type="button"
        whileTap={{ scale: 0.95 }}
        onClick={() => setActiveView('store')}
        className="flex items-center text-left focus:outline-none cursor-pointer shrink-0"
        aria-label="y5Hut Home"
      >
        <Logo size="sm" showWordmark showTagline={false} />
      </motion.button>

      {/* Right: Currency Toggle, Search Trigger, Owner Console & Shopping Bag */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Compact Currency Switcher */}
        <motion.button
          type="button"
          whileTap={{ scale: 0.9 }}
          onClick={() => setCurrency(currency === 'LKR' ? 'USD' : 'LKR')}
          className="px-2 py-1 rounded-lg bg-soft-surface border border-line font-data text-[10px] font-semibold text-ink uppercase tracking-wider cursor-pointer shadow-xs min-h-[34px]"
          aria-label={`Toggle currency, currently ${currency}`}
        >
          {currency}
        </motion.button>

        {/* Search Command Trigger */}
        <motion.button
          type="button"
          whileTap={{ scale: 0.9 }}
          onClick={onOpenSearch}
          className="w-9 h-9 rounded-lg border border-line bg-surface flex items-center justify-center text-ink hover:bg-soft-surface hover:border-ink/40 transition-colors cursor-pointer shadow-xs min-w-[36px] min-h-[36px]"
          aria-label="Search catalog"
        >
          <Search className="w-4 h-4 text-body" />
        </motion.button>

        {/* Direct Admin Console Trigger on Mobile */}
        <motion.button
          type="button"
          whileTap={{ scale: 0.92 }}
          onClick={() => setActiveView(activeView === 'admin' ? 'store' : 'admin')}
          className={`px-2.5 py-1.5 rounded-lg border font-ui text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs min-h-[36px] ${
            activeView === 'admin'
              ? 'bg-red text-white border-red'
              : 'bg-surface text-ink border-line hover:bg-soft-surface'
          }`}
          aria-label="Toggle Owner Console"
          title="Toggle Admin Console / Storefront"
        >
          {activeView === 'admin' ? (
            <>
              <Store className="w-3.5 h-3.5" />
              <span>Store</span>
            </>
          ) : (
            <>
              <Shield className="w-3.5 h-3.5 text-red" />
              <span>Admin</span>
            </>
          )}
        </motion.button>

        {/* Bag Mini-Tag with Count */}
        <motion.button
          type="button"
          whileTap={{ scale: 0.92 }}
          onClick={() => setIsCartOpen(true)}
          className="relative inline-flex items-center gap-1.5 bg-surface border border-line rounded-lg px-2.5 py-1 min-h-[36px] shadow-xs cursor-pointer hover:bg-soft-surface transition-all"
          aria-label={`Shopping Bag (${cartTotalCount} items)`}
        >
          <span className="font-ui text-xs font-semibold text-ink">Bag</span>
          <motion.span
            key={cartTotalCount}
            initial={{ scale: 1.4 }}
            animate={{ scale: 1 }}
            className="min-w-[16px] h-[16px] px-1 rounded-full bg-red text-white font-data text-[9px] font-extrabold flex items-center justify-center leading-none"
          >
            {cartTotalCount}
          </motion.span>
        </motion.button>
      </div>
    </header>
  );
};

