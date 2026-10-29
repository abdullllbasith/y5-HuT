import { hasPriceRange } from '../../lib/variants';
import React from 'react';
import { Product } from '../../types';
import { DeviceGraphic } from '../common/DeviceGraphic';
import { useStore } from '../../context/StoreContext';
import { Star, Heart, ShoppingBag, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    setSelectedProductForDetail,
    addToCart,
    formatPrice,
    currency,
    toggleWishlist,
    isInWishlist,
  } = useStore();

  const isLowStock = product.stock > 0 && product.stock <= product.lowStockThreshold;
  const isOutOfStock = product.stock === 0;
  const wishlisted = isInWishlist(product.id);

  const installmentThird =
    currency === 'LKR'
      ? Math.round(product.priceLKR / 3)
      : Math.round(product.priceUSD / 3);

  return (
    <div
      onClick={() => setSelectedProductForDetail(product)}
      className="group bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col justify-between transition-all duration-200 hover:border-slate-300 hover:shadow-lg cursor-pointer relative"
    >
      {/* Top Image Box */}
      <div className="relative bg-slate-50/70 aspect-[4/3] flex items-center justify-center p-3 border-b border-slate-100 overflow-hidden">
        
        {/* Promotional / Status Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.badge && (
            <span
              className={`text-[9px] font-black uppercase px-2 py-0.5 rounded shadow-xs tracking-wider ${
                product.badge === 'HOT' || product.badge === 'SALE'
                  ? 'bg-[#E11D48] text-white'
                  : product.badge === 'NEW'
                  ? 'bg-blue-600 text-white'
                  : 'bg-emerald-600 text-white'
              }`}
            >
              {product.badge}
            </span>
          )}
          {product.promoDiscountPercent && (
            <span className="text-[9px] font-bold bg-amber-400 text-slate-900 px-1.5 py-0.5 rounded shadow-xs">
              Save {product.promoDiscountPercent}%
            </span>
          )}
        </div>

        {/* Wishlist Heart Icon */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center transition-colors z-10 shadow-xs cursor-pointer ${
            wishlisted
              ? 'bg-rose-50 text-[#E11D48]'
              : 'bg-white/90 text-slate-400 hover:text-[#E11D48] hover:bg-white'
          }`}
          title={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Device Vector Illustration */}
        <div className="w-full h-full flex items-center justify-center">
          <DeviceGraphic
            deviceType={product.deviceType}
            colorHex={product.colorOptions[0]?.hex || '#1E293B'}
            brand={product.brand}
            className="max-h-44"
          />
        </div>

        {/* Quick View Button on Hover */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProductForDetail(product);
            }}
            className="flex-1 py-1.5 bg-slate-900/90 hover:bg-slate-900 text-white text-[11px] font-bold rounded shadow-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Brand & Stock Status */}
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="font-bold text-[#E11D48] uppercase tracking-wider">
              {product.brand}
            </span>
            {isOutOfStock ? (
              <span className="text-slate-400 font-medium">Out of Stock</span>
            ) : isLowStock ? (
              <span className="text-[#E11D48] font-bold">Only {product.stock} left</span>
            ) : (
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>In Stock</span>
              </span>
            )}
          </div>

          {/* Product Name (2 Lines Max) */}
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#E11D48] transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>

          {/* Star Rating */}
          <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1.5">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(product.rating) ? 'fill-current' : 'text-slate-200'
                  }`}
                />
              ))}
            </div>
            <span className="font-bold text-slate-800 tabular-nums">
              {product.rating}
            </span>
            <span className="text-slate-400">({product.reviewCount})</span>
          </div>
        </div>

        {/* Pricing & Installment Row */}
        <div className="pt-2 border-t border-slate-100 space-y-1.5">
          <div className="flex items-baseline gap-2">
            <span className="text-base sm:text-lg font-black font-mono text-slate-950 tabular-nums">
              {hasPriceRange(product) && <span className="text-[10px] font-bold text-slate-500 mr-1">From</span>}
              {formatPrice(product.priceLKR, product.priceUSD)}
            </span>
            {(product.originalPriceLKR || product.originalPriceUSD) && (
              <span className="text-xs text-slate-400 line-through font-mono tabular-nums">
                {formatPrice(
                  product.originalPriceLKR || 0,
                  product.originalPriceUSD || 0
                )}
              </span>
            )}
          </div>

          {/* Koko / Mintpay Installment Tag (y5Hut.lk Signature) */}
          {product.kokoEligible && (
            <div className="bg-slate-50 text-slate-600 text-[10px] py-1 px-2 rounded border border-slate-200 flex items-center justify-between">
              <span>Pay 3 installments of</span>
              <strong className="text-slate-900 font-mono">
                {currency === 'LKR' ? `Rs. ${installmentThird.toLocaleString()}` : `$${installmentThird}`}
              </strong>
            </div>
          )}

          {/* Add to Cart Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!isOutOfStock) addToCart(product, 1);
            }}
            disabled={isOutOfStock}
            className="w-full mt-2 py-2 px-3 bg-slate-900 hover:bg-[#E11D48] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-50 cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};
