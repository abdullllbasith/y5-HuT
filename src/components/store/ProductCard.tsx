import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Product } from '../../types';
import { ProductImage } from '../common/ProductImage';
import { useStore } from '../../context/StoreContext';
import { hasPriceRange, getDefaultVariant } from '../../lib/variants';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { Tag, TagPerforation } from '../ui/Tag';
import { Sticker, StickerType } from '../ui/Sticker';
import { Dot } from '../ui/Dot';
import { Price } from '../ui/Price';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    setSelectedProductForDetail,
    addToCart,
    currency,
    toggleWishlist,
    isInWishlist,
  } = useStore();

  const [activeColorIdx, setActiveColorIdx] = useState(0);

  const isLowStock = product.stock > 0 && product.stock <= product.lowStockThreshold;
  const isOutOfStock = product.stock === 0;
  const wishlisted = isInWishlist(product.id);

  const activeColorHex = product.colorOptions[activeColorIdx]?.hex || product.colorOptions[0]?.hex || '#1E293B';
  const hasRange = hasPriceRange(product);
  const defaultVar = getDefaultVariant(product);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, defaultVar ? 1 : 1, defaultVar?.color, defaultVar?.storage);
  };

  // Map product badge to authentic Sticker type
  const stickerType: StickerType | null =
    product.badge === 'HOT'
      ? 'HOT'
      : product.badge === 'SALE'
      ? 'SALE'
      : product.badge === 'NEW'
      ? 'NEW'
      : product.badge === 'BESTSELLER'
      ? 'BESTSELLER'
      : product.badge === 'GENUINE'
      ? 'GENUINE'
      : product.isFeaturedPromo
      ? 'FEATURED'
      : null;

  return (
    <Tag
      elevation="raised"
      className="h-full flex flex-col justify-between text-left select-none transition-shadow hover:shadow-hard-hover"
    >
      {/* 1. Hanging Upper Stage - Compact Padding on Mobile */}
      <div className="relative pt-0.5 px-2.5 sm:px-3.5 pb-2 sm:pb-2.5 flex flex-col">
        {/* Top Floating Controls: Sticker left, Heart right */}
        <div className="flex items-center justify-between w-full h-6 sm:h-7 relative z-20">
          <div className="shrink-0">
            {stickerType ? (
              <Sticker type={stickerType} size="sm" />
            ) : product.promoDiscountPercent ? (
              <Sticker type="SALE" text={`-${product.promoDiscountPercent}%`} size="sm" />
            ) : (
              <span className="font-data text-[8px] sm:text-[9px] uppercase tracking-wider text-ink-soft bg-paper-sunk px-1.5 sm:px-2 py-0.5 rounded border border-line">
                {product.brand}
              </span>
            )}
          </div>

          <motion.button
            type="button"
            whileTap={{ scale: 0.8 }}
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center transition-colors cursor-pointer min-w-[32px] min-h-[32px] sm:min-w-[36px] sm:min-h-[36px] ${
              wishlisted
                ? 'bg-red-wash border-red text-red'
                : 'bg-card border-line text-ink-soft hover:text-red hover:border-ink hover:bg-paper'
            }`}
            title={wishlisted ? 'Remove from saved' : 'Save to wishlist'}
            aria-label={wishlisted ? `Remove ${product.name} from saved tags` : `Save ${product.name}`}
          >
            <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${wishlisted ? 'fill-current' : ''}`} />
          </motion.button>
        </div>

        {/* Central Stage: Compact aspect ratio on mobile, soft background tint */}
        <div
          onClick={() => setSelectedProductForDetail(product)}
          className="relative w-full aspect-[4/3] sm:aspect-square my-1.5 sm:my-2 rounded-xl sm:rounded-2xl flex items-center justify-center p-2 sm:p-3 overflow-hidden cursor-pointer group/stage"
          style={{
            backgroundColor: `${activeColorHex}14`, // 12% opacity tint of chosen device color
          }}
        >
          {/* Small red disc background accent (The atom of y5HuT) */}
          <div
            className="absolute w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-red/10 blur-xs group-hover/stage:scale-115 transition-transform duration-300"
            aria-hidden="true"
          />

          {/* Product Device Visual (Photorealistic / Clean) */}
          <ProductImage
            product={product}
            colorHex={activeColorHex}
            className="max-h-24 sm:max-h-36 object-contain relative z-10 transition-transform duration-300 group-hover/stage:scale-105 drop-shadow-sm"
          />

          {/* Quick Peek Button Overlay (Desktop / Tablet) */}
          <div className="absolute inset-x-2 bottom-2 opacity-0 group-hover/stage:opacity-100 transition-opacity hidden sm:flex items-center justify-center z-20">
            <span className="px-2.5 py-1 rounded-full bg-ink/90 text-paper font-ui text-[10px] font-bold shadow-hard flex items-center gap-1.5">
              <Eye className="w-3 h-3 text-red" />
              <span>Inspect Tag</span>
            </span>
          </div>
        </div>

        {/* Brand label & Product Title */}
        <div className="space-y-0.5 sm:space-y-1">
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-data uppercase tracking-wider text-ink-soft">
            <span className="font-bold">{product.brand}</span>
            {product.category && (
              <span className="opacity-75 hidden sm:inline">{product.category}</span>
            )}
          </div>

          <h3
            onClick={() => setSelectedProductForDetail(product)}
            className="font-ui font-semibold text-xs sm:text-sm text-ink line-clamp-1 sm:line-clamp-2 leading-tight hover:text-red transition-colors cursor-pointer"
          >
            {product.name}
          </h3>
        </div>

        {/* Variant Swatches: Colors as dots & Storage chips */}
        <div className="mt-1.5 sm:mt-2 pt-1.5 border-t border-line/60 flex items-center justify-between gap-1.5">
          {/* Color Dots */}
          <div className="flex items-center gap-1" role="group" aria-label="Available colors">
            {product.colorOptions.slice(0, 4).map((c, i) => (
              <button
                key={c.name}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveColorIdx(i);
                }}
                className={`w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full border transition-transform cursor-pointer ${
                  activeColorIdx === i
                    ? 'ring-1.5 ring-ink scale-125 border-card'
                    : 'border-ink/30 hover:scale-110'
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
                aria-label={`Color ${c.name}`}
              />
            ))}
            {product.colorOptions.length > 4 && (
              <span className="font-data text-[9px] sm:text-[10px] text-ink-soft">
                +{product.colorOptions.length - 4}
              </span>
            )}
          </div>

          {/* Storage Chips (if present) */}
          {product.storageOptions && product.storageOptions.length > 0 && (
            <div className="flex items-center gap-1">
              {product.storageOptions.slice(0, 2).map((s) => (
                <span
                  key={s}
                  className="font-data text-[9px] sm:text-[10px] px-1 sm:px-1.5 py-0.2 rounded bg-paper-sunk border border-line text-ink-soft"
                >
                  {s}
                </span>
              ))}
              {product.storageOptions.length > 2 && (
                <span className="font-data text-[9px] sm:text-[10px] text-ink-soft">
                  +{product.storageOptions.length - 2}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 2. Dashed Perforation Tear Line */}
      <TagPerforation />

      {/* 3. Lower Price Stub - Clean & Compact */}
      <div className="p-2.5 sm:p-3.5 pt-1 sm:pt-2 bg-card space-y-1.5 sm:space-y-2.5">
        {/* Price & Stock availability */}
        <div className="flex items-end justify-between gap-1.5">
          <div className="min-w-0">
            {hasRange && (
              <span className="font-data text-[9px] sm:text-[10px] uppercase font-bold text-ink-soft block leading-none mb-0.5">
                From
              </span>
            )}
            <Price
              amountLKR={product.priceLKR}
              amountUSD={product.priceUSD}
              originalLKR={product.originalPriceLKR}
              originalUSD={product.originalPriceUSD}
              currency={currency}
              size="sm"
              showInstallments={false}
              showDiscountPill={false}
            />
          </div>

          {/* Stock Status Dot */}
          <div className="text-right shrink-0">
            {isOutOfStock ? (
              <span className="inline-flex items-center gap-1 font-data text-[10px] sm:text-[11px] text-ink line-through font-bold">
                <Dot tone="ink" size="xs" />
                <span>Out</span>
              </span>
            ) : isLowStock ? (
              <span className="inline-flex items-center gap-1 font-data text-[10px] sm:text-[11px] text-low font-bold">
                <Dot tone="low" size="xs" pulse />
                <span>{product.stock} left</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 font-data text-[10px] sm:text-[11px] text-go font-semibold">
                <Dot tone="go" size="xs" />
                <span>In Stock</span>
              </span>
            )}
          </div>
        </div>

        {/* 1/3 Installment line */}
        {currency === 'LKR' && product.priceLKR > 10000 && !isOutOfStock && (
          <div className="font-data text-[9px] sm:text-[10px] text-ink-soft flex items-center justify-between pt-1 border-t border-line/40">
            <span>Koko 3×:</span>
            <span className="font-bold text-ink truncate ml-1">
              Rs. {Math.round(product.priceLKR / 3).toLocaleString('en-LK')}/mo
            </span>
          </div>
        )}

        {/* Full-width "Add to Bag" Ink Outline Button with Spring Press Animation */}
        <motion.button
          type="button"
          whileTap={isOutOfStock ? undefined : { scale: 0.94 }}
          disabled={isOutOfStock}
          onClick={handleAdd}
          className={`
            w-full py-1.5 sm:py-2 px-3 rounded-xl sm:rounded-full font-ui text-[11px] sm:text-xs font-bold border-[1.5px] border-ink transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer min-h-[36px] sm:min-h-[42px]
            ${
              isOutOfStock
                ? 'bg-paper-sunk text-ink-soft border-line/50 cursor-not-allowed opacity-60'
                : 'bg-transparent text-ink hover:bg-red hover:text-white hover:border-ink hover:shadow-hard active:translate-x-0.5 active:translate-y-0.5'
            }
          `}
          aria-label={isOutOfStock ? `${product.name} is sold out` : `Add ${product.name} to bag`}
        >
          <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
          <span>{isOutOfStock ? 'Sold Out' : 'Add to Bag'}</span>
        </motion.button>
      </div>
    </Tag>
  );
};
