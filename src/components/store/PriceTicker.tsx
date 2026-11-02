import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Dot } from '../ui/Dot';
import { TrendingDown, Pause, Play } from 'lucide-react';

export const PriceTicker: React.FC = () => {
  const { priceHistory, storefrontProducts, setSelectedProductForDetail } = useStore();
  const [isPaused, setIsPaused] = useState(false);

  // Derive price drops: either from priceHistory where new < old, or products with discounts
  const items = React.useMemo(() => {
    const fromHistory = priceHistory
      .filter((h) => h.newPriceLKR < h.oldPriceLKR)
      .slice(0, 8)
      .map((h) => {
        const prod = storefrontProducts.find((p) => p.id === h.productId);
        return {
          id: h.id,
          name: h.productName,
          oldPrice: h.oldPriceLKR,
          newPrice: h.newPriceLKR,
          diff: h.oldPriceLKR - h.newPriceLKR,
          product: prod,
        };
      });

    if (fromHistory.length >= 3) return fromHistory;

    // Fallback to active catalog discounts
    const fromCatalog = storefrontProducts
      .filter((p) => !p.archived && p.originalPriceLKR && p.originalPriceLKR > p.priceLKR)
      .slice(0, 8)
      .map((p) => ({
        id: p.id,
        name: p.name,
        oldPrice: p.originalPriceLKR!,
        newPrice: p.priceLKR,
        diff: p.originalPriceLKR! - p.priceLKR,
        product: p,
      }));

    return [...fromHistory, ...fromCatalog];
  }, [priceHistory, storefrontProducts]);

  if (items.length === 0) return null;

  return (
    <div
      className="w-full bg-ink text-paper py-2 px-3 border-y border-line overflow-hidden flex items-center relative select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Live Indicator Tag on Left */}
      <div className="shrink-0 flex items-center gap-2 pr-3 border-r border-paper/20 z-10 bg-ink">
        <Dot tone="red" size="sm" pulse />
        <span className="font-data text-[10px] uppercase font-bold tracking-wider text-paper">
          Live Counter Drops
        </span>
        <button
          type="button"
          onClick={() => setIsPaused(!isPaused)}
          className="text-paper/60 hover:text-paper p-0.5 cursor-pointer"
          aria-label={isPaused ? 'Resume ticker' : 'Pause ticker'}
        >
          {isPaused ? <Play className="w-2.5 h-2.5" /> : <Pause className="w-2.5 h-2.5" />}
        </button>
      </div>

      {/* Marquee Track */}
      <div className="flex-1 overflow-hidden relative">
        <div
          className={`flex items-center gap-8 whitespace-nowrap ${
            isPaused ? '' : 'animate-marquee'
          }`}
          style={{
            animationPlayState: isPaused ? 'paused' : 'running',
          }}
        >
          {/* Double list for smooth seamless loop */}
          {[...items, ...items].map((item, idx) => (
            <button
              key={`${item.id}-${idx}`}
              type="button"
              onClick={() => item.product && setSelectedProductForDetail(item.product)}
              className="inline-flex items-center gap-2 text-xs hover:text-red transition-colors cursor-pointer group"
            >
              <span className="font-ui font-medium text-paper/90 group-hover:underline">
                {item.name}
              </span>
              <span className="font-data text-paper/50 line-through text-[11px]">
                Rs. {item.oldPrice.toLocaleString('en-LK')}
              </span>
              <span className="font-data font-bold text-paper text-xs">
                Rs. {item.newPrice.toLocaleString('en-LK')}
              </span>
              <span className="inline-flex items-center gap-0.5 font-data text-[10px] font-bold bg-highlighter text-ink px-1.5 py-0.2 rounded">
                <TrendingDown className="w-3 h-3 text-red-ink" />
                <span>Down Rs. {item.diff.toLocaleString('en-LK')}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

