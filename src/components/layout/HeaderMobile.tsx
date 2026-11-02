import React from 'react';
import { motion } from 'motion/react';
import { Search } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Logo } from '../ui/Logo';

interface HeaderMobileProps {
  onOpenSearch: () => void;
}

export const HeaderMobile: React.FC<HeaderMobileProps> = ({ onOpenSearch }) => {
  const { setActiveView, cartTotalCount, setIsCartOpen, currency, setCurrency } = useStore();

  return (
    <header className="md:hidden bg-paper/95 backdrop-blur-md border-b border-line px-3.5 h-14 flex items-center justify-between gap-3 select-none sticky top-0 z-40 transition-all">
      {/* Left: Authentic SVG Logo */}
      <motion.button
        type="button"
        whileTap={{ scale: 0.95 }}
        onClick={() => setActiveView('store')}
        className="flex items-center text-left focus:outline-none cursor-pointer"
        aria-label="y5Hut Home"
      >
        <Logo size="sm" showWordmark showTagline={false} />
      </motion.button>

      {/* Right: Currency Toggle, Search Trigger & Shopping Bag */}
      <div className="flex items-center gap-2">
        {/* Compact Currency Switcher */}
        <motion.button
          type="button"
          whileTap={{ scale: 0.9 }}
          onClick={() => setCurrency(currency === 'LKR' ? 'USD' : 'LKR')}
          className="px-2 py-1 rounded-md bg-card border border-line font-data text-[10px] font-bold text-ink uppercase tracking-wider cursor-pointer shadow-xs"
          aria-label={`Toggle currency, currently ${currency}`}
        >
          {currency}
        </motion.button>

        {/* Search Command Trigger */}
        <motion.button
          type="button"
          whileTap={{ scale: 0.9 }}
          onClick={onOpenSearch}
          className="w-9 h-9 rounded-full border border-line bg-card flex items-center justify-center text-ink hover:bg-paper-sunk hover:border-ink transition-colors cursor-pointer shadow-xs"
          aria-label="Search catalog"
        >
          <Search className="w-4 h-4" />
        </motion.button>

        {/* Bag Mini-Tag with Count */}
        <motion.button
          type="button"
          whileTap={{ scale: 0.92 }}
          onClick={() => setIsCartOpen(true)}
          className="relative inline-flex items-center gap-1.5 bg-card border-[1.5px] border-ink rounded-xl px-2.5 py-1.5 min-h-[38px] shadow-xs cursor-pointer hover:shadow-hard-sm transition-all"
          aria-label={`Shopping Bag (${cartTotalCount} items)`}
        >
          <span className="font-data text-xs font-bold text-ink uppercase">Bag</span>
          <motion.span
            key={cartTotalCount}
            initial={{ scale: 1.4 }}
            animate={{ scale: 1 }}
            className="min-w-[18px] h-[18px] px-1 rounded-full bg-red text-white font-data text-[9px] font-extrabold flex items-center justify-center leading-none"
          >
            {cartTotalCount}
          </motion.span>
        </motion.button>
      </div>
    </header>
  );
};

