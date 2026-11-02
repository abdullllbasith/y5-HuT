import React from 'react';
import { Product } from '../../types';
import { ProductImage } from '../common/ProductImage';
import { useStore } from '../../context/StoreContext';
import { hasPriceRange } from '../../lib/variants';
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
    <article className="group bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col justify-between transition-all duration-200 hover:border-slate-300 hover:shadow-md relative">
      
      {/* Top Image Stage & Quick Actions */}
      <div className="relative bg-slate-50/80 aspect-[4/3] flex items-center justify-center p-3 sm:p-4 border-b border-slate-100 overflow-hidden">
        
        {/* Promotional / Status Badge */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {product.badge ? (
            <span
              className={`text-[9px] font-black uppercase px-2 py-0.5 rounded shadow-2xs tracking-wider ${
                product.badge === 'HOT' || product.badge === 'SALE'
                  ? 'bg-[#E11D48] text-white'
                  : product.badge === 'NEW'
                  ? 'bg-blue-600 text-white'
                  : 'bg-emerald-600 text-white'
              }`}
            >
              {product.badge}
            </span>
          ) : product.promoDiscountPercent ? (
            <span className="text-[9px] font-bold bg-amber-400 text-slate-900 px-1.5 py-0.5 rounded shadow-2xs">
              Save {product.promoDiscountPercent}%
            </span>
          ) : null}
        </div>

        {/* Wishlist Heart Icon (Independent interactive button) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2 right-2 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-colors z-10 shadow-2xs cursor-pointer min-w-[32px] min-h-[32px] ${
            wishlisted
              ? 'bg-rose-50 text-[#E11D48]'
              : 'bg-white/90 text-slate-400 hover:text-[#E11D48] hover:bg-white'
          }`}
          title={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${wishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Device Image / Graphic Trigger */}
        <button
          type="button"
          onClick={() => setSelectedProductForDetail(product)}
          className="w-full h-full flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E11D48] cursor-pointer"
          aria-label={`View details for ${product.name}`}
        >
          <ProductImage
            product={product}
            colorHex={product.colorOptions[0]?.hex || '#1E293B'}
            className="max-h-36 sm:max-h-44 group-hover:scale-105 transition-transform duration-300"
          />
        </button>

        {/* Quick View Button on Desktop Hover */}
        <div className="absolute inset-x-3 bottom-2.5 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex items-center gap-2 z-10 pointer-events-none group-hover:pointer-events-auto">
          <button
            type="button"
            onClick={() => setSelectedProductForDetail(product)}
            className="flex-1 py-1.5 bg-slate-900/90 hover:bg-slate-900 text-white text-[11px] font-bold rounded shadow-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-2.5">
        
        {/* Brand, Stock, & Title */}
        <div className="space-y-1">
          
          <div className="flex items-center justify-between text-[10px] sm:text-[11px]">
            <span className="font-bold text-[#E11D48] uppercase tracking-wider">
              {product.brand}
            </span>
            {isOutOfStock ? (
              <span className="text-rose-600 font-semibold">Sold Out</span>
            ) : isLowStock ? (
              <span className="text-amber-600 font-bold">Only {product.stock} left</span>
            ) : (
              <span className="text-emerald-700 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>In Stock</span>
              </span>
            )}
          </div>

          {/* Product Name Clickable Header */}
          <button
            type="button"
            onClick={() => setSelectedProductForDetail(product)}
            className="text-left w-full focus:outline-none focus-visible:ring-1 focus-visible:ring-[#E11D48] cursor-pointer"
          >
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#E11D48] transition-colors line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </button>

          {/* Rating */}
          <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-slate-500 pt-0.5">
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

        {/* Pricing, Installment, & Add to Cart */}
        <div className="pt-2 border-t border-slate-100 space-y-1.5">
          
          <div className="flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
            <span className="text-sm sm:text-base font-black font-mono text-slate-950 tabular-nums">
              {hasPriceRange(product) && <span className="text-[10px] font-normal text-slate-500 mr-1">From</span>}
              {formatPrice(product.priceLKR, product.priceUSD)}
            </span>
            {(product.originalPriceLKR || product.originalPriceUSD) && (
              <span className="text-[11px] text-slate-400 line-through font-mono tabular-nums">
                {formatPrice(
                  product.originalPriceLKR || 0,
                  product.originalPriceUSD || 0
                )}
              </span>
            )}
          </div>

          {/* Clean Installment Note */}
          {product.kokoEligible && (
            <div className="text-[10px] text-slate-500 truncate">
              or 3x <span className="font-semibold text-slate-700 font-mono">{currency === 'LKR' ? `Rs. ${installmentThird.toLocaleString()}` : `$${installmentThird}`}</span> with Koko
            </div>
          )}

          {/* Add to Cart Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (!isOutOfStock) addToCart(product, 1);
            }}
            disabled={isOutOfStock}
            className="w-full mt-1.5 py-2 px-3 bg-slate-900 hover:bg-[#E11D48] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer min-h-[36px]"
            aria-label={isOutOfStock ? `${product.name} is sold out` : `Add ${product.name} to cart`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{isOutOfStock ? 'Sold Out' : 'Add to Cart'}</span>
          </button>
        </div>

      </div>
    </article>
  );
};
