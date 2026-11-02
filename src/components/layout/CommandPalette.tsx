import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, X, ArrowRight, CornerDownLeft } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Dot } from '../ui/Dot';
import { Price } from '../ui/Price';
import { Product } from '../../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const { products, executeSearch, setSelectedProductForDetail, currency } = useStore();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Global keyboard shortcut to open palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return products.slice(0, 6);
    }
    return products
      .filter((p) => {
        if (p.archived) return false;
        const nameMatch = p.name.toLowerCase().includes(q);
        const brandMatch = p.brand.toLowerCase().includes(q);
        const skuMatch = p.variants?.some((v) => v.sku.toLowerCase().includes(q));
        const categoryMatch = p.category.toLowerCase().includes(q);
        return nameMatch || brandMatch || skuMatch || categoryMatch;
      })
      .slice(0, 8);
  }, [products, query]);

  const handleSelectProduct = (product: Product) => {
    setSelectedProductForDetail(product);
    onClose();
  };

  const handleSearchAll = () => {
    executeSearch(query);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, matches.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + matches.length) % Math.max(1, matches.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (matches[selectedIndex]) {
        handleSelectProduct(matches[selectedIndex]);
      } else if (query.trim()) {
        handleSearchAll();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-ink/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-card border-[1.5px] border-ink rounded-2xl shadow-sheet overflow-hidden flex flex-col text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-line bg-paper">
          <Search className="w-5 h-5 text-ink-soft shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search phones, AirPods, AppleHuT, chargers, SKUs..."
            className="flex-1 bg-transparent font-ui text-sm sm:text-base text-ink placeholder:text-ink-soft/70 focus:outline-none"
            aria-label="Search catalog"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-ink-soft hover:text-ink hover:bg-paper-sunk transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <span className="font-data text-[10px] uppercase font-bold text-ink-soft border border-line px-1.5 py-0.5 rounded bg-card">
              ESC
            </span>
          )}
        </div>

        {/* Search Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2 divide-y divide-line/40">
          <div className="px-3 py-1.5 text-[10px] font-data uppercase tracking-wider text-ink-soft font-bold">
            {query.trim() ? `Matching Products (${matches.length})` : 'Popular Suggestions'}
          </div>

          {matches.length === 0 ? (
            <div className="py-10 text-center space-y-2">
              <p className="font-ui text-sm text-ink-soft">
                No products match &ldquo;<strong>{query}</strong>&rdquo;
              </p>
              <button
                type="button"
                onClick={handleSearchAll}
                className="font-data text-xs text-red hover:underline font-bold"
              >
                Search all catalog records →
              </button>
            </div>
          ) : (
            matches.map((product, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={product.id}
                  onClick={() => handleSelectProduct(product)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`
                    p-3 rounded-xl flex items-center justify-between gap-3 cursor-pointer transition-colors
                    ${isSelected ? 'bg-paper-sunk border border-line' : 'hover:bg-paper/60'}
                  `}
                >
                  <div className="min-w-0 flex items-center gap-3">
                    <Dot
                      tone={product.stock > 0 ? (product.stock <= product.lowStockThreshold ? 'low' : 'go') : 'ink'}
                      size="xs"
                    />
                    <div className="min-w-0">
                      <div className="font-ui font-semibold text-sm text-ink truncate">
                        {product.name}
                      </div>
                      <div className="font-data text-[11px] text-ink-soft truncate">
                        {product.brand} · {product.category}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <Price
                      amountLKR={product.priceLKR}
                      amountUSD={product.priceUSD}
                      currency={currency}
                      size="sm"
                      showDiscountPill={false}
                    />
                    <ArrowRight
                      className={`w-4 h-4 transition-transform ${
                        isSelected ? 'text-red translate-x-1' : 'text-line'
                      }`}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Palette Footer */}
        <div className="px-4 py-2.5 bg-paper-sunk/60 border-t border-line flex items-center justify-between text-[11px] font-data text-ink-soft">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <kbd className="px-1 py-0.5 rounded bg-card border border-line text-[10px]">↑↓</kbd> to navigate
            </span>
            <span className="inline-flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-card border border-line text-[10px]">
                <CornerDownLeft className="w-2.5 h-2.5 inline" />
              </kbd> to select
            </span>
          </div>

          {query.trim() && (
            <button
              type="button"
              onClick={handleSearchAll}
              className="text-red font-bold hover:underline"
            >
              View in catalog →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
