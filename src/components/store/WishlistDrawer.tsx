import React from 'react';
import { useStore } from '../../context/StoreContext';
import { X, Heart, Trash2, ShoppingBag } from 'lucide-react';
import { DeviceGraphic } from '../common/DeviceGraphic';

export const WishlistDrawer: React.FC = () => {
  const {
    isWishlistOpen,
    setIsWishlistOpen,
    wishlist,
    storefrontProducts: products,
    toggleWishlist,
    addToCart,
    formatPrice,
  } = useStore();

  if (!isWishlistOpen) return null;

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Wishlist Drawer"
      className="fixed inset-0 z-50 overflow-hidden bg-slate-950/50 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-2 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="px-4 sm:px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-[#E11D48] fill-current" />
              <h3 className="text-base font-bold text-slate-900">
                My Saved Wishlist ({wishlist.length})
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsWishlistOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center transition-colors"
              aria-label="Close wishlist"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
            {wishlistProducts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                  <Heart className="w-7 h-7 text-slate-300 stroke-1" />
                </div>
                <p className="text-sm font-semibold text-slate-700">Your wishlist is empty</p>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">
                  Save your favorite smartphones, Apple gear, and accessories by clicking the heart icon on any card.
                </p>
              </div>
            ) : (
              wishlistProducts.map((p) => (
                <div
                  key={p.id}
                  className="p-3 border border-slate-200 rounded-xl flex items-center gap-3 hover:border-slate-300 transition-colors bg-white shadow-2xs"
                >
                  <div className="w-14 h-14 bg-slate-50 rounded-lg p-1 flex items-center justify-center shrink-0 border border-slate-100">
                    <DeviceGraphic
                      deviceType={p.deviceType}
                      colorHex={p.colorOptions[0]?.hex}
                      className="max-h-12"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] uppercase font-bold text-[#E11D48]">
                      {p.brand}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {p.name}
                    </h4>
                    <div className="text-xs font-mono font-bold text-slate-900 mt-0.5">
                      {formatPrice(p.priceLKR, p.priceUSD)}
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => addToCart(p, 1)}
                        className="px-2.5 py-1 text-[11px] font-bold bg-[#E11D48] text-white hover:bg-[#BE123C] rounded-md flex items-center gap-1 cursor-pointer min-h-[30px]"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Add to Cart</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleWishlist(p.id)}
                        className="text-[11px] text-slate-400 hover:text-rose-600 flex items-center gap-1 cursor-pointer p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 text-center pb-safe shrink-0">
            <button
              type="button"
              onClick={() => setIsWishlistOpen(false)}
              className="w-full py-2.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 cursor-pointer min-h-[40px]"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
