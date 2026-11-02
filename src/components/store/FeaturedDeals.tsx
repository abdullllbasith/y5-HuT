import React, { useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductImage } from '../common/ProductImage';
import { Flame, ArrowRight, ShoppingBag } from 'lucide-react';
import { Tag, TagPerforation } from '../ui/Tag';
import { Sticker } from '../ui/Sticker';
import { Price } from '../ui/Price';
import { Dot } from '../ui/Dot';
import { getDefaultVariant } from '../../lib/variants';

export const FeaturedDeals: React.FC = () => {
  const {
    storefrontProducts: products,
    setSelectedProductForDetail,
    addToCart,
    currency,
  } = useStore();

  const promoProducts = useMemo(() => {
    const featured = products.filter(
      (p) => !p.archived && (p.isFeaturedPromo || (p.originalPriceLKR && p.originalPriceLKR > p.priceLKR))
    );
    if (featured.length >= 4) return featured.slice(0, 4);
    const otherActive = products.filter((p) => !p.archived && !featured.some((f) => f.id === p.id));
    return [...featured, ...otherActive].slice(0, 4);
  }, [products]);

  const spotlightDeal = promoProducts[0];
  const otherDeals = promoProducts.slice(1, 4);

  if (!spotlightDeal) return null;

  const spotlightDiscount =
    spotlightDeal.originalPriceLKR && spotlightDeal.originalPriceLKR > spotlightDeal.priceLKR
      ? Math.round(((spotlightDeal.originalPriceLKR - spotlightDeal.priceLKR) / spotlightDeal.originalPriceLKR) * 100)
      : spotlightDeal.promoDiscountPercent;

  const handleQuickAdd = (product: typeof spotlightDeal, e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.stock === 0) return;
    const def = getDefaultVariant(product);
    addToCart(product, 1, def?.color, def?.storage);
  };

  return (
    <section className="py-6 sm:py-8 space-y-4 sm:space-y-6 text-left">
      {/* Header: Today's Tags */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-line pb-3">
        <div>
          <div className="flex items-center gap-1.5 font-data text-[10px] font-bold uppercase tracking-wider text-red">
            <Flame className="w-3.5 h-3.5" />
            <span>Today&apos;s Special Tags</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight mt-1">
            Hanging Deals &amp; Price Drops
          </h2>
        </div>
        <p className="font-ui text-xs text-ink-soft">
          Limited quantity shop inventory with verified real-time drops.
        </p>
      </div>

      {/* Hanging Wire String line visual */}
      <div className="relative w-full h-1 bg-ink/20 my-2 rounded-full hidden sm:block">
        <div className="absolute left-1/4 -top-1.5 w-3 h-3 rounded-full bg-ink/40" />
        <div className="absolute left-1/2 -top-1.5 w-3 h-3 rounded-full bg-ink/40" />
        <div className="absolute left-3/4 -top-1.5 w-3 h-3 rounded-full bg-ink/40" />
      </div>

      {/* 2-Column Bento: Double-Size Spotlight Left + Stacked Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-stretch">
        
        {/* Left: Spotlight Deal (Double size, 7 cols) */}
        <article
          onClick={() => setSelectedProductForDetail(spotlightDeal)}
          className="lg:col-span-7 bg-card border border-line rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-hard hover:border-ink transition-all cursor-pointer relative overflow-hidden group"
        >
          {/* Top Bar with Sticker & Live Dot */}
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2">
              {spotlightDiscount ? (
                <Sticker type="SALE" text={`SAVE ${spotlightDiscount}%`} size="md" />
              ) : (
                <Sticker type="HOT" size="md" />
              )}
              <span className="font-data text-[11px] uppercase tracking-wider text-ink-soft bg-paper-sunk px-2.5 py-0.5 rounded border border-line">
                {spotlightDeal.brand}
              </span>
            </div>

            <div className="flex items-center gap-1.5 font-data text-xs text-go font-semibold">
              <Dot tone="go" size="xs" />
              <span>{spotlightDeal.stock} Left on Counter</span>
            </div>
          </div>

          {/* Product Centerpiece */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center my-6 relative z-10">
            <div className="space-y-2">
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-ink leading-tight group-hover:text-red transition-colors">
                {spotlightDeal.name}
              </h3>
              <p className="font-ui text-xs sm:text-sm text-ink-soft line-clamp-2">
                {spotlightDeal.tagline || spotlightDeal.description}
              </p>

              <div className="pt-3">
                <Price
                  amountLKR={spotlightDeal.priceLKR}
                  amountUSD={spotlightDeal.priceUSD}
                  originalLKR={spotlightDeal.originalPriceLKR}
                  originalUSD={spotlightDeal.originalPriceUSD}
                  currency={currency}
                  size="lg"
                  showDiscountPill={false}
                />
              </div>
            </div>

            {/* Visual with background disc */}
            <div className="relative aspect-square flex items-center justify-center p-4">
              <div
                className="absolute w-36 h-36 rounded-full bg-red/10 blur-md group-hover:scale-110 transition-transform duration-300"
                aria-hidden="true"
              />
              <ProductImage
                product={spotlightDeal}
                className="max-h-44 sm:max-h-52 object-contain relative z-10 group-hover:scale-105 transition-transform drop-shadow-md"
              />
            </div>
          </div>

          {/* Bottom Action Footer */}
          <div
            className="pt-4 border-t border-line flex items-center justify-between relative z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="font-data text-xs text-ink-soft">
              SKU: <span className="font-bold text-ink">{spotlightDeal.variants?.[0]?.sku || spotlightDeal.id}</span>
            </div>

            <button
              type="button"
              onClick={(e) => handleQuickAdd(spotlightDeal, e)}
              className="px-5 py-2.5 bg-ink text-paper hover:bg-red hover:text-white rounded-full font-ui text-xs font-bold border border-ink flex items-center gap-2 transition-all cursor-pointer shadow-hard-sm min-h-[44px]"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Claim Tag</span>
            </button>
          </div>
        </article>

        {/* Right: Companion Hanging Tags (5 cols) - Scroll snap on mobile */}
        <div className="lg:col-span-5 flex flex-col gap-3 sm:gap-4">
          {otherDeals.map((deal) => {
            const discount =
              deal.originalPriceLKR && deal.originalPriceLKR > deal.priceLKR
                ? Math.round(((deal.originalPriceLKR - deal.priceLKR) / deal.originalPriceLKR) * 100)
                : deal.promoDiscountPercent;

            return (
              <div
                key={deal.id}
                onClick={() => setSelectedProductForDetail(deal)}
                className="bg-card border border-line rounded-2xl p-4 flex items-center justify-between gap-4 hover:border-ink hover:shadow-hard-sm transition-all cursor-pointer group"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-paper-sunk border border-line p-1 flex items-center justify-center shrink-0">
                  <ProductImage
                    product={deal}
                    className="max-h-14 sm:max-h-16 object-contain group-hover:scale-105 transition-transform"
                  />
                </div>

                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    {discount ? (
                      <span className="font-data text-[9px] font-bold uppercase bg-red text-white px-1.5 py-0.2 rounded">
                        -{discount}%
                      </span>
                    ) : (
                      <span className="font-data text-[9px] font-bold uppercase bg-paper-sunk text-ink-soft px-1.5 py-0.2 rounded border border-line">
                        {deal.brand}
                      </span>
                    )}
                    <span className="font-data text-[10px] text-ink-soft truncate">
                      {deal.category}
                    </span>
                  </div>

                  <h4 className="font-ui font-bold text-xs sm:text-sm text-ink group-hover:text-red transition-colors truncate">
                    {deal.name}
                  </h4>

                  <Price
                    amountLKR={deal.priceLKR}
                    amountUSD={deal.priceUSD}
                    originalLKR={deal.originalPriceLKR}
                    originalUSD={deal.originalPriceUSD}
                    currency={currency}
                    size="sm"
                    showInstallments={false}
                    showDiscountPill={false}
                  />
                </div>

                <div
                  className="shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={(e) => handleQuickAdd(deal, e)}
                    className="w-10 h-10 rounded-full border border-line bg-paper hover:bg-ink hover:text-paper hover:border-ink flex items-center justify-center transition-colors cursor-pointer min-w-[44px] min-h-[44px]"
                    aria-label={`Add ${deal.name}`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
