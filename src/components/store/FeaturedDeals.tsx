import React, { useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { DeviceGraphic } from '../common/DeviceGraphic';
import { Flame, ArrowRight, ShoppingBag, Sparkles, Tag, ChevronRight } from 'lucide-react';

export const FeaturedDeals: React.FC = () => {
  const {
    storefrontProducts: products,
    setSelectedProductForDetail,
    addToCart,
    formatPrice,
    currency,
  } = useStore();

  // Derive eligible products from actual demo state (unarchived, featured or discounted)
  const promoProducts = useMemo(() => {
    const featured = products.filter(
      (p) => !p.archived && (p.isFeaturedPromo || (p.originalPriceLKR && p.originalPriceLKR > p.priceLKR))
    );
    if (featured.length >= 4) return featured.slice(0, 4);
    // If fewer than 4 explicitly flagged, pad with other active products
    const otherActive = products.filter((p) => !p.archived && !featured.some((f) => f.id === p.id));
    return [...featured, ...otherActive].slice(0, 4);
  }, [products]);

  const heroDeal = promoProducts[0];
  const sideDeals = promoProducts.slice(1, 4);

  if (!heroDeal) return null;

  const heroDiscount =
    heroDeal.originalPriceLKR && heroDeal.originalPriceLKR > heroDeal.priceLKR
      ? Math.round(((heroDeal.originalPriceLKR - heroDeal.priceLKR) / heroDeal.originalPriceLKR) * 100)
      : heroDeal.promoDiscountPercent;

  return (
    <section className="py-6 sm:py-8 space-y-4 sm:space-y-6">
      
      {/* Header: Editorial Ink Surface with Restrained Red Accent */}
      <div className="bg-white rounded-[18px] border border-[#E5E7EB] p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center shrink-0 text-[#E11D48] border border-rose-100">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 bg-[#F7F8FA] px-2 py-0.5 rounded border border-[#E5E7EB]">
                Curated Deals
              </span>
              <span className="text-[11px] font-mono text-emerald-700 font-semibold">
                Live Storefront Prices
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#111827] font-sans mt-0.5">
              Featured Tech &amp; Flagship Offers
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#6B7280]">
          <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
          <span>Transparent demo pricing updated directly from merchant dashboard</span>
        </div>
      </div>

      {/* Bento Grid: 2x2 Hero Spotlight Tile on Left, Stacked Companion Tiles on Right */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
        
        {/* Hero Tile (spanning 7 cols on desktop) */}
        <article className="md:col-span-7 bg-white rounded-[18px] border border-[#E5E7EB] p-6 sm:p-8 flex flex-col justify-between shadow-2xs hover:border-slate-300 transition-all">
          <div>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {heroDiscount && heroDiscount > 0 ? (
                  <span className="text-[10px] font-mono font-bold uppercase bg-[#E11D48] text-white px-2.5 py-1 rounded-full shadow-2xs">
                    Save {heroDiscount}%
                  </span>
                ) : (
                  <span className="text-[10px] font-mono font-bold uppercase bg-[#111827] text-white px-2.5 py-1 rounded-full">
                    Spotlight Deal
                  </span>
                )}
                <span className="text-[11px] font-mono text-slate-500 uppercase">{heroDeal.brand}</span>
              </div>
              <span className="text-[11px] font-mono text-slate-500">
                Stock: <strong className="text-[#111827]">{heroDeal.stock}</strong>
              </span>
            </div>

            <div className="mt-4 space-y-1 text-left">
              <h3 className="text-xl sm:text-2xl font-bold text-[#111827] tracking-tight font-sans">
                {heroDeal.name}
              </h3>
              <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed">
                {heroDeal.tagline || heroDeal.description}
              </p>
            </div>
          </div>

          {/* Centered Render with generous whitespace */}
          <div className="py-8 sm:py-12 flex items-center justify-center">
            <button
              type="button"
              onClick={() => setSelectedProductForDetail(heroDeal)}
              className="group focus:outline-none cursor-pointer"
              aria-label={`View deal for ${heroDeal.name}`}
            >
              <DeviceGraphic
                deviceType={heroDeal.deviceType}
                colorHex={heroDeal.colorOptions[0]?.hex}
                brand={heroDeal.brand}
                className="max-h-48 sm:max-h-56 group-hover:scale-105 transition-transform duration-300 drop-shadow-sm"
              />
            </button>
          </div>

          {/* Price & Action Bar */}
          <div className="pt-4 border-t border-[#E5E7EB] flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-xs text-[#6B7280] font-mono">LKR</span>
                <span className="text-2xl sm:text-3xl font-bold text-[#111827] font-sans tabular-nums tracking-tight">
                  {heroDeal.priceLKR.toLocaleString('en-LK')}
                </span>
                {heroDeal.originalPriceLKR && heroDeal.originalPriceLKR > heroDeal.priceLKR && (
                  <span className="text-xs text-[#6B7280] line-through font-mono">
                    {heroDeal.originalPriceLKR.toLocaleString('en-LK')}
                  </span>
                )}
              </div>
              <div className="text-[11px] text-emerald-700 font-medium">
                {heroDeal.stock > 0 ? (
                  <>⚡ 3x {Math.round(heroDeal.priceLKR / 3).toLocaleString('en-LK')} with Koko</>
                ) : (
                  <span className="text-rose-600 font-bold">Currently Sold Out</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedProductForDetail(heroDeal)}
                className="px-4 py-2 text-xs font-semibold text-[#111827] bg-[#F7F8FA] hover:bg-slate-100 border border-[#E5E7EB] rounded-lg transition-colors cursor-pointer min-h-[40px]"
              >
                Inspect
              </button>
              <button
                type="button"
                disabled={heroDeal.stock === 0}
                onClick={() => addToCart(heroDeal, 1)}
                className="px-4 py-2 bg-[#E11D48] hover:bg-[#BE123C] disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs min-h-[40px]"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Bag</span>
              </button>
            </div>
          </div>
        </article>

        {/* 3 Companion Tiles (spanning 5 cols on desktop) */}
        <div className="md:col-span-5 flex flex-col gap-4">
          {sideDeals.map((deal) => {
            const discount =
              deal.originalPriceLKR && deal.originalPriceLKR > deal.priceLKR
                ? Math.round(((deal.originalPriceLKR - deal.priceLKR) / deal.originalPriceLKR) * 100)
                : deal.promoDiscountPercent;

            return (
              <article
                key={deal.id}
                className="flex-1 bg-white rounded-[18px] border border-[#E5E7EB] p-4 sm:p-5 flex items-center justify-between gap-4 shadow-2xs hover:border-slate-300 transition-all group"
              >
                <div className="space-y-1.5 flex-1 min-w-0 text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-500 uppercase">{deal.brand}</span>
                    {discount && discount > 0 ? (
                      <span className="text-[9px] font-mono font-bold uppercase bg-rose-50 text-[#E11D48] px-2 py-0.5 rounded-full border border-rose-100">
                        -{discount}%
                      </span>
                    ) : null}
                  </div>

                  <h4 className="text-sm sm:text-base font-bold text-[#111827] tracking-tight truncate font-sans">
                    {deal.name}
                  </h4>

                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[10px] text-[#6B7280] font-mono">LKR</span>
                    <span className="text-base sm:text-lg font-bold text-[#111827] tabular-nums font-sans">
                      {deal.priceLKR.toLocaleString('en-LK')}
                    </span>
                  </div>

                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => setSelectedProductForDetail(deal)}
                      className="text-xs font-semibold text-[#E11D48] hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>View Specifications</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="w-24 sm:w-28 shrink-0 flex items-center justify-center p-2">
                  <button
                    type="button"
                    onClick={() => setSelectedProductForDetail(deal)}
                    className="focus:outline-none cursor-pointer"
                    aria-label={`View ${deal.name}`}
                  >
                    <DeviceGraphic
                      deviceType={deal.deviceType}
                      colorHex={deal.colorOptions[0]?.hex}
                      brand={deal.brand}
                      className="max-h-24 sm:max-h-28 group-hover:scale-105 transition-transform duration-300 drop-shadow-sm"
                    />
                  </button>
                </div>
              </article>
            );
          })}
        </div>

      </div>
    </section>
  );
};
