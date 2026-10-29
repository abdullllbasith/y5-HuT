import React from 'react';
import { useStore } from '../../context/StoreContext';
import { X, Heart, Trash2, ShoppingBag } from 'lucide-react';
import { DeviceGraphic } from '../common/DeviceGraphic';

export const WishlistDrawer: React.FC = () => {
  const {
    isWishlistOpen,
    setIsWishlistOpen,
    wishlist,
    products,
    toggleWishlist,
    addToCart,
    formatPrice,
  } = useStore();

  if (!isWishlistOpen) return null;

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/40 backdrop-blur-xs">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-[#E11D48] fill-current" />
              <h3 className="text-base font-bold text-slate-900">
                My Saved Wishlist ({wishlist.length})
              </h3>
            </div>
            <button
              onClick={() => setIsWishlistOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {wishlistProducts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <Heart className="w-12 h-12 text-slate-300 stroke-1 mb-2" />
                <p className="text-sm font-semibold text-slate-700">Your wishlist is empty</p>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">
                  Save your favorite smartphones, Apple gear, and accessories by clicking the heart icon on any card.
                </p>
              </div>
            ) : (
              wishlistProducts.map((p) => (
                <div
                  key={p.id}
                  className="p-4 border border-slate-200 rounded-lg flex items-center gap-4 hover:border-slate-300 transition-colors"
                >
                  <div className="w-16 h-16 bg-slate-50 rounded-md p-1 flex items-center justify-center shrink-0 border border-slate-100">
                    <DeviceGraphic
                      deviceType={p.deviceType}
                      colorHex={p.colorOptions[0]?.hex}
                      className="max-h-14"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] uppercase font-bold text-[#E11D48]">
                      {p.brand}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {p.name}
                    </h4>
                    <div className="text-xs font-mono font-bold text-slate-900 mt-1">
                      {formatPrice(p.priceLKR, p.priceUSD)}
                    </div>

                    <div className="flex items-center gap-3 mt-2">
                      <button
                        onClick={() => addToCart(p, 1)}
                        className="px-2.5 py-1 text-[11px] font-bold bg-[#E11D48] text-white hover:bg-[#BE123C] rounded flex items-center gap-1 cursor-pointer"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Add to Cart</span>
                      </button>
                      <button
                        onClick={() => toggleWishlist(p.id)}
                        className="text-[11px] text-slate-400 hover:text-rose-600 flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 text-center">
            <button
              onClick={() => setIsWishlistOpen(false)}
              className="w-full py-2.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
