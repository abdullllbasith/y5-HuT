import React from 'react';
import { useStore } from '../../context/StoreContext';
import { X, Heart, Trash2, ShoppingBag } from 'lucide-react';
import { ProductImage } from '../common/ProductImage';
import { Price } from '../ui/Price';
import { Dot } from '../ui/Dot';
import { getDefaultVariant } from '../../lib/variants';

export const WishlistDrawer: React.FC = () => {
  const {
    isWishlistOpen,
    setIsWishlistOpen,
    wishlist,
    storefrontProducts: products,
    toggleWishlist,
    addToCart,
    setSelectedProductForDetail,
    currency,
  } = useStore();

  if (!isWishlistOpen) return null;

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Saved Tags Drawer"
      className="fixed inset-0 z-50 overflow-hidden bg-ink/70 backdrop-blur-xs flex justify-end"
      onClick={() => setIsWishlistOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-paper h-full shadow-hard flex flex-col border-l border-line text-left relative"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-line flex items-center justify-between bg-card shrink-0">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red fill-current" />
            <div>
              <h3 className="font-display font-bold text-lg text-ink">
                Saved Tags ({wishlist.length})
              </h3>
              <p className="font-data text-[10px] text-ink-soft uppercase tracking-wider">
                Wishlist Counter Slip
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsWishlistOpen(false)}
            className="w-9 h-9 rounded-full flex items-center justify-center text-ink-soft hover:text-ink hover:bg-paper-sunk transition-colors cursor-pointer min-w-[44px] min-h-[44px]"
            aria-label="Close saved tags"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {wishlistProducts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-ink-soft space-y-3">
              <div className="w-16 h-16 rounded-full bg-paper-sunk border border-line flex items-center justify-center">
                <Heart className="w-8 h-8 text-ink-soft" />
              </div>
              <h4 className="font-display font-bold text-base text-ink">No tags pinned yet</h4>
              <p className="font-ui text-xs text-ink-soft max-w-xs">
                Tap the heart on any hanging tag across the shop to save it here for later inspection.
              </p>
              <button
                type="button"
                onClick={() => setIsWishlistOpen(false)}
                className="px-6 py-2.5 rounded-full bg-ink text-paper font-ui text-xs font-bold hover:bg-red hover:shadow-hard-sm transition-all cursor-pointer min-h-[44px]"
              >
                Browse Shop
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {wishlistProducts.map((p) => {
                const def = getDefaultVariant(p);
                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      setSelectedProductForDetail(p);
                      setIsWishlistOpen(false);
                    }}
                    className="p-3.5 bg-card border border-line rounded-2xl flex items-center gap-3.5 shadow-2xs hover:border-ink hover:shadow-hard-sm transition-all cursor-pointer group"
                  >
                    <div className="w-16 h-16 rounded-xl bg-paper-sunk border border-line p-1 flex items-center justify-center shrink-0">
                      <ProductImage
                        product={p}
                        className="max-h-14 object-contain group-hover:scale-105 transition-transform"
                      />
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-data text-[9px] uppercase font-bold text-ink-soft bg-paper-sunk px-1.5 py-0.2 rounded border border-line">
                          {p.brand}
                        </span>
                        <span className="font-data text-[10px] text-ink-soft truncate">
                          {p.category}
                        </span>
                      </div>

                      <h4 className="font-ui font-bold text-xs sm:text-sm text-ink truncate group-hover:text-red transition-colors">
                        {p.name}
                      </h4>

                      <Price
                        amountLKR={p.priceLKR}
                        amountUSD={p.priceUSD}
                        originalLKR={p.originalPriceLKR}
                        originalUSD={p.originalPriceUSD}
                        currency={currency}
                        size="sm"
                        showInstallments={false}
                        showDiscountPill={false}
                      />
                    </div>

                    <div
                      className="flex flex-col items-end gap-2 shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => toggleWishlist(p.id)}
                        className="p-1.5 text-ink-soft hover:text-red transition-colors cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
                        title="Remove tag"
                        aria-label={`Remove ${p.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          addToCart(p, 1, def?.color, def?.storage);
                          toggleWishlist(p.id);
                        }}
                        className="px-3 py-1.5 rounded-full bg-ink text-paper hover:bg-red font-ui text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer min-h-[36px]"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Move to Bag</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-card border-t border-line text-center pb-safe shrink-0">
          <button
            type="button"
            onClick={() => setIsWishlistOpen(false)}
            className="w-full py-3 text-xs font-bold font-ui text-ink bg-paper border border-line rounded-full hover:bg-paper-sunk hover:border-ink transition-colors cursor-pointer min-h-[44px]"
          >
            Back to Counter
          </button>
        </div>
      </div>
    </div>
  );
};
