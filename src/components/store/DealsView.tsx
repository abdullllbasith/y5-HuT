import React, { useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from './ProductCard';
import { FeaturedDeals } from './FeaturedDeals';
import { Flame, TrendingDown, Sparkles } from 'lucide-react';
import { Dot } from '../ui/Dot';

export const DealsView: React.FC = () => {
  const { storefrontProducts } = useStore();

  // Products sorted by biggest price drop (LKR difference)
  const discountedProducts = useMemo(() => {
    return storefrontProducts
      .filter((p) => !p.archived)
      .map((p) => {
        const drop = p.originalPriceLKR && p.originalPriceLKR > p.priceLKR ? p.originalPriceLKR - p.priceLKR : 0;
        return {
          ...p,
          priceDropLKR: drop,
        };
      })
      .sort((a, b) => b.priceDropLKR - a.priceDropLKR);
  }, [storefrontProducts]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 text-left">
      {/* 1. Deals Hero / Price Wall Banner */}
      <div className="bg-card border border-line rounded-3xl p-6 sm:p-10 shadow-hard relative overflow-hidden">
        <div
          className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-red/10 blur-2xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="flex items-center gap-2">
            <Dot tone="red" size="sm" pulse />
            <span className="font-data text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-red">
              Live Counter Price Wall
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-bold text-ink tracking-tight">
            The y5HuT <span className="italic font-serif text-red">Price Wall</span>
          </h1>

          <p className="font-ui text-xs sm:text-sm text-ink-soft leading-relaxed">
            Real-time shop discounts and markdown tags. All price changes made by the shop owner in the console reflect here immediately.
          </p>

          <div className="flex items-center gap-3 pt-2">
            <span className="inline-flex items-center gap-1 font-data text-xs font-bold bg-highlighter text-ink px-2.5 py-1 rounded-full">
              <TrendingDown className="w-3.5 h-3.5 text-red-ink" />
              <span>Ranked by Largest Savings</span>
            </span>
            <span className="font-data text-xs text-ink-soft">
              {discountedProducts.filter((p) => p.priceDropLKR > 0).length} Marked-down Tags
            </span>
          </div>
        </div>
      </div>

      {/* 2. Today's Hanging Deal Spotlight */}
      <FeaturedDeals />

      {/* 3. The Price Wall Grid: All Products ranked by price drop */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-line pb-3">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-red" />
            <h2 className="font-display text-xl sm:text-2xl font-bold text-ink">
              Every Deal on the Wall
            </h2>
          </div>
          <span className="font-data text-xs text-ink-soft">
            Showing all {discountedProducts.length} active models
          </span>
        </div>

        <div className="grid grid-cols-1 min-[360px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {discountedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
};
