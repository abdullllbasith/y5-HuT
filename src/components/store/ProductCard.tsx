import React, { useState } from 'react';
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

  const [activeColorIdx, setActiveColorIdx] = useState(0);

  const isLowStock = product.stock > 0 && product.stock <= product.lowStockThreshold;
  const isOutOfStock = product.stock === 0;
  const wishlisted = isInWishlist(product.id);

  const activeColorHex = product.colorOptions[activeColorIdx]?.hex || product.colorOptions[0]?.hex || '#1E293B';

  const installmentThird =
    currency === 'LKR'
      ? Math.round(product.priceLKR / 3)
      : Math.round(product.priceUSD / 3);

  return (
    <article className="group bg-white rounded-[18px] border border-[#E5E7EB] overflow-hidden flex flex-col justify-between transition-all duration-200 hover:border-slate-300 hover:shadow-subtle relative">
      
      {/* Top Image Stage: Apple-style negative space */}
      <div className="relative bg-[#F7F8FA] aspect-[4/3] flex items-center justify-center p-4 border-b border-[#E5E7EB] overflow-hidden">
        
        {/* Promotional / Status Badge */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {product.badge ? (
            <span
              className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full tracking-wider ${
                product.badge === 'HOT' || product.badge === 'SALE'
                  ? 'bg-[#E11D48] text-white'
                  : product.badge === 'NEW'
                  ? 'bg-[#111827] text-white'
                  : 'bg-emerald-600 text-white'
              }`}
            >
              {product.badge}
            </span>
          ) : product.promoDiscountPercent ? (
            <span className="text-[9px] font-mono font-bold bg-[#E11D48] text-white px-2 py-0.5 rounded-full">
              Save {product.promoDiscountPercent}%
            </span>
          ) : null}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-colors z-10 cursor-pointer min-w-[32px] min-h-[32px] ${
            wishlisted
              ? 'bg-rose-50 text-[#E11D48] border border-rose-200'
              : 'bg-white/90 text-slate-400 hover:text-[#E11D48] hover:bg-white border border-[#E5E7EB]'
          }`}
          title={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
        >
          <Heart className={`w-3.5 h-3.5 ${wishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Device Image Click Trigger */}
        <button
          type="button"
          onClick={() => setSelectedProductForDetail(product)}
          className="w-full h-full flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E11D48] cursor-pointer"
          aria-label={`View details for ${product.name}`}
        >
          <ProductImage
            product={product}
            colorHex={activeColorHex}
            className="max-h-36 sm:max-h-40 group-hover:scale-105 transition-transform duration-300 drop-shadow-2xs"
          />
        </button>

        {/* Quick View Button on Desktop Hover */}
        <div className="absolute inset-x-3 bottom-2.5 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex items-center gap-2 z-10 pointer-events-none group-hover:pointer-events-auto">
          <button
            type="button"
            onClick={() => setSelectedProductForDetail(product)}
            className="flex-1 py-1.5 bg-[#111827]/90 hover:bg-[#111827] text-white text-[11px] font-semibold rounded-lg shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        
        {/* Brand, Stock, Swatches & Title */}
        <div className="space-y-1.5 text-left">
          
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-mono text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
              {product.brand}
            </span>
            {isOutOfStock ? (
              <span className="text-[10px] font-mono font-bold text-[#DC2626] bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                Sold Out
              </span>
            ) : isLowStock ? (
              <span className="text-[10px] font-mono font-bold text-[#D97706] bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                Low: {product.stock}
              </span>
            ) : (
              <span className="text-[10px] font-mono font-medium text-[#16A34A] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                <span>In Stock</span>
              </span>
            )}
          </div>

          {/* Product Name */}
          <button
            type="button"
            onClick={() => setSelectedProductForDetail(product)}
            className="text-left w-full focus:outline-none focus-visible:ring-1 focus-visible:ring-[#E11D48] cursor-pointer"
          >
            <h3 className="text-sm font-bold text-[#111827] group-hover:text-[#E11D48] transition-colors line-clamp-2 leading-snug font-sans">
              {product.name}
            </h3>
          </button>

          {/* Color Swatches and Storage Badges */}
          <div className="flex items-center justify-between gap-2 pt-0.5">
            {/* Color Swatches */}
            {product.colorOptions && product.colorOptions.length > 0 ? (
              <div className="flex items-center gap-1">
                {product.colorOptions.slice(0, 4).map((c, i) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveColorIdx(i);
                    }}
                    title={c.name}
                    className={`w-3.5 h-3.5 rounded-full border transition-all cursor-pointer ${
                      activeColorIdx === i ? 'ring-2 ring-[#111827] ring-offset-1 scale-110' : 'border-slate-300'
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
                {product.colorOptions.length > 4 && (
                  <span className="text-[9px] font-mono text-slate-400">+{product.colorOptions.length - 4}</span>
                )}
              </div>
            ) : <div />}

            {/* Storage Badges */}
            {product.storageOptions && product.storageOptions.length > 0 && (
              <span className="text-[10px] font-mono text-slate-500 bg-[#F7F8FA] px-1.5 py-0.5 rounded border border-[#E5E7EB]">
                {product.storageOptions.join(' · ')}
              </span>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 text-[11px] text-slate-500 pt-0.5">
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
            <span className="font-bold text-[#111827] tabular-nums font-mono text-[10px]">
              {product.rating}
            </span>
            <span className="text-slate-400 text-[10px]">({product.reviewCount})</span>
          </div>
        </div>

        {/* Pricing & Add to Cart */}
        <div className="pt-3 border-t border-[#E5E7EB] space-y-2">
          
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-xs text-[#6B7280] font-mono">LKR</span>
            <span className="text-base sm:text-lg font-bold font-sans text-[#111827] tabular-nums">
              {product.priceLKR.toLocaleString('en-LK')}
            </span>
            {(product.originalPriceLKR || product.originalPriceUSD) && (
              <span className="text-xs text-[#6B7280] line-through font-mono tabular-nums">
                {(product.originalPriceLKR || 0).toLocaleString('en-LK')}
              </span>
            )}
            {hasPriceRange(product) && (
              <span className="text-[10px] font-mono text-slate-400">From</span>
            )}
          </div>

          {/* Clean Installment Note */}
          {product.kokoEligible && (
            <div className="text-[10px] text-slate-500 truncate font-mono">
              3x <span className="font-semibold text-slate-800">Rs. {installmentThird.toLocaleString()}</span> Koko
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
            className="w-full py-2 px-3 bg-[#111827] hover:bg-[#E11D48] text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer min-h-[38px]"
            aria-label={isOutOfStock ? `${product.name} is sold out` : `Add ${product.name} to cart`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{isOutOfStock ? 'Sold Out' : 'Add to Bag'}</span>
          </button>
        </div>

      </div>
    </article>
  );
};
