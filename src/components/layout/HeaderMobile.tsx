import React from 'react';
import { Search } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Logo } from '../ui/Logo';

interface HeaderMobileProps {
  onOpenSearch: () => void;
}

export const HeaderMobile: React.FC<HeaderMobileProps> = ({ onOpenSearch }) => {
  const { setActiveView, cartTotalCount, setIsCartOpen, currency, setCurrency } = useStore();

  return (
    <header className="md:hidden bg-paper border-b border-line px-3.5 h-14 flex items-center justify-between gap-3 select-none sticky top-0 z-40">
      {/* Left: Authentic SVG Logo */}
      <button
        type="button"
        onClick={() => setActiveView('store')}
        className="flex items-center text-left focus:outline-none cursor-pointer"
        aria-label="y5Hut Home"
      >
        <Logo size="sm" showWordmark showTagline={false} />
      </button>

      {/* Right: Currency Toggle, Search Trigger & Shopping Bag */}
      <div className="flex items-center gap-2">
        {/* Compact Currency Switcher */}
        <button
          type="button"
          onClick={() => setCurrency(currency === 'LKR' ? 'USD' : 'LKR')}
          className="px-2 py-1 rounded bg-card border border-line font-data text-[10px] font-bold text-ink uppercase tracking-wider"
          aria-label={`Toggle currency, currently ${currency}`}
        >
          {currency}
        </button>

        {/* Search Command Trigger */}
        <button
          type="button"
          onClick={onOpenSearch}
          className="w-10 h-10 rounded-full border border-line bg-card flex items-center justify-center text-ink hover:bg-paper-sunk hover:border-ink transition-colors cursor-pointer"
          aria-label="Search catalog"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Bag Mini-Tag with Count */}
        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          className="relative inline-flex items-center gap-1.5 bg-card border-[1.5px] border-ink rounded-lg px-2.5 py-1.5 min-h-[40px] shadow-2xs cursor-pointer"
          aria-label={`Shopping Bag (${cartTotalCount} items)`}
        >
          <span className="font-data text-xs font-bold text-ink uppercase">Bag</span>
          <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-red text-white font-data text-[9px] font-extrabold flex items-center justify-center leading-none">
            {cartTotalCount}
          </span>
        </button>
      </div>
    </header>
  );
};
