import React, { useState } from 'react';
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
      className="h-full flex flex-col justify-between text-left select-none"
    >
      {/* 1. Hanging Upper Stage */}
      <div className="relative pt-1 px-4 pb-3 flex flex-col">
        {/* Top Floating Controls: Sticker left, Heart right */}
        <div className="flex items-center justify-between w-full h-8 relative z-20">
          <div className="shrink-0">
            {stickerType ? (
              <Sticker type={stickerType} size="sm" />
            ) : product.promoDiscountPercent ? (
              <Sticker type="SALE" text={`-${product.promoDiscountPercent}%`} size="sm" />
            ) : (
              <span className="font-data text-[9px] uppercase tracking-wider text-ink-soft bg-paper-sunk px-2 py-0.5 rounded border border-line">
                {product.brand}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className={`w-9 h-9 rounded-full border flex items-center justify-center transition-colors cursor-pointer min-w-[44px] min-h-[44px] ${
              wishlisted
                ? 'bg-red-wash border-red text-red'
                : 'bg-card border-line text-ink-soft hover:text-red hover:border-ink hover:bg-paper'
            }`}
            title={wishlisted ? 'Remove from saved' : 'Save to wishlist'}
            aria-label={wishlisted ? `Remove ${product.name} from saved tags` : `Save ${product.name}`}
          >
            <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Central Stage: Color-tinted stage at 12% with device on red disc */}
        <div
          onClick={() => setSelectedProductForDetail(product)}
          className="relative w-full aspect-square my-2 rounded-2xl flex items-center justify-center p-3 overflow-hidden cursor-pointer group/stage"
          style={{
            backgroundColor: `${activeColorHex}16`, // 12% opacity tint of chosen device color
          }}
        >
          {/* Small red disc background accent (The atom of y5HuT) */}
          <div
            className="absolute w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-red/10 blur-xs group-hover/stage:scale-110 transition-transform duration-300"
            aria-hidden="true"
          />

          {/* Product Device Visual */}
          <ProductImage
            product={product}
            colorHex={activeColorHex}
            className="max-h-36 sm:max-h-44 object-contain relative z-10 transition-transform duration-300 group-hover/stage:scale-105 drop-shadow-sm"
          />

          {/* Quick Peek Button Overlay */}
          <div className="absolute inset-x-3 bottom-2.5 opacity-0 group-hover/stage:opacity-100 transition-opacity hidden sm:flex items-center justify-center z-20">
            <span className="px-3 py-1.5 rounded-full bg-ink/90 text-paper font-ui text-[11px] font-bold shadow-hard flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-red" />
              <span>Inspect Tag</span>
            </span>
          </div>
        </div>

        {/* Brand label & Product Title */}
        <div className="mt-1 space-y-1">
          <div className="flex items-center justify-between text-[11px] font-data uppercase tracking-wider text-ink-soft">
            <span>{product.brand}</span>
            {product.category && (
              <span className="opacity-75">{product.category}</span>
            )}
          </div>

          <h3
            onClick={() => setSelectedProductForDetail(product)}
            className="font-ui font-semibold text-sm sm:text-base text-ink line-clamp-2 leading-snug hover:text-red transition-colors cursor-pointer"
          >
            {product.name}
          </h3>
        </div>

        {/* Variant Swatches: Colors as dots & Storage chips */}
        <div className="mt-2.5 pt-2 border-t border-line/60 flex items-center justify-between gap-2">
          {/* Color Dots */}
          <div className="flex items-center gap-1.5" role="group" aria-label="Available colors">
            {product.colorOptions.slice(0, 4).map((c, i) => (
              <button
                key={c.name}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveColorIdx(i);
                }}
                className={`w-3.5 h-3.5 rounded-full border transition-transform cursor-pointer ${
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
              <span className="font-data text-[10px] text-ink-soft">
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
                  className="font-data text-[10px] px-1.5 py-0.5 rounded bg-paper-sunk border border-line text-ink-soft"
                >
                  {s}
                </span>
              ))}
              {product.storageOptions.length > 2 && (
                <span className="font-data text-[10px] text-ink-soft">
                  +{product.storageOptions.length - 2}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 2. Dashed Perforation Tear Line */}
      <TagPerforation />

      {/* 3. Lower Price Stub */}
      <div className="p-4 pt-2 bg-card space-y-3">
        {/* Price & Stock availability */}
        <div className="flex items-end justify-between gap-2">
          <div>
            {hasRange && (
              <span className="font-data text-[10px] uppercase font-bold text-ink-soft block leading-none mb-0.5">
                From
              </span>
            )}
            <Price
              amountLKR={product.priceLKR}
              amountUSD={product.priceUSD}
              originalLKR={product.originalPriceLKR}
              originalUSD={product.originalPriceUSD}
              currency={currency}
              size="md"
              showInstallments={false}
              showDiscountPill={false}
            />
          </div>

          {/* Stock Status Dot */}
          <div className="text-right shrink-0">
            {isOutOfStock ? (
              <span className="inline-flex items-center gap-1 font-data text-[11px] text-ink line-through font-bold">
                <Dot tone="ink" size="xs" />
                <span>Sold Out</span>
              </span>
            ) : isLowStock ? (
              <span className="inline-flex items-center gap-1 font-data text-[11px] text-low font-bold">
                <Dot tone="low" size="xs" pulse />
                <span>Only {product.stock} left</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 font-data text-[11px] text-go font-semibold">
                <Dot tone="go" size="xs" />
                <span>In Stock</span>
              </span>
            )}
          </div>
        </div>

        {/* 1/3 Installment line */}
        {currency === 'LKR' && product.priceLKR > 10000 && !isOutOfStock && (
          <div className="font-data text-[10px] text-ink-soft flex items-center justify-between pt-1 border-t border-line/40">
            <span>Koko 3× Plan</span>
            <span className="font-bold text-ink">
              Rs. {Math.round(product.priceLKR / 3).toLocaleString('en-LK')}/mo
            </span>
          </div>
        )}

        {/* Full-width "Add to Bag" Ink Outline Button (fills red on hover) */}
        <button
          type="button"
          disabled={isOutOfStock}
          onClick={handleAdd}
          className={`
            w-full py-2.5 px-4 rounded-full font-ui text-xs font-bold border-[1.5px] border-ink transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer min-h-[44px]
            ${
              isOutOfStock
                ? 'bg-paper-sunk text-ink-soft border-line/50 cursor-not-allowed opacity-60'
                : 'bg-transparent text-ink hover:bg-red hover:text-white hover:border-ink hover:shadow-hard'
            }
          `}
          aria-label={isOutOfStock ? `${product.name} is sold out` : `Add ${product.name} to bag`}
        >
          <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
          <span>{isOutOfStock ? 'Sold Out' : 'Add to Bag'}</span>
        </button>
      </div>
    </Tag>
  );
};
