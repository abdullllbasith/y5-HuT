import React from 'react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { ProductImage } from '../common/ProductImage';
import { Price } from '../ui/Price';
import { Dot } from '../ui/Dot';
import { getDefaultVariant, hasPriceRange } from '../../lib/variants';
import { ShoppingBag, Heart } from 'lucide-react';

interface CatalogListViewProps {
  products: Product[];
}

export const CatalogListView: React.FC<CatalogListViewProps> = ({ products }) => {
  const {
    setSelectedProductForDetail,
    addToCart,
    currency,
    toggleWishlist,
    isInWishlist,
  } = useStore();

  return (
    <div className="space-y-3 w-full">
      {products.map((product) => {
        const isLowStock = product.stock > 0 && product.stock <= product.lowStockThreshold;
        const isOutOfStock = product.stock === 0;
        const wishlisted = isInWishlist(product.id);
        const hasRange = hasPriceRange(product);
        const defaultVar = getDefaultVariant(product);

        const handleAdd = (e: React.MouseEvent) => {
          e.stopPropagation();
          if (isOutOfStock) return;
          addToCart(product, 1, defaultVar?.color, defaultVar?.storage);
        };

        return (
          <div
            key={product.id}
            onClick={() => setSelectedProductForDetail(product)}
            className="group p-3 sm:p-4 rounded-xl bg-card border border-line hover:border-ink hover:shadow-hard-sm transition-all duration-150 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer text-left"
          >
            {/* Visual + Title + Specs */}
            <div className="flex items-center gap-3.5 min-w-0 flex-1">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-paper-sunk border border-line shrink-0 p-1 flex items-center justify-center relative overflow-hidden">
                <ProductImage
                  product={product}
                  className="max-h-14 sm:max-h-16 object-contain relative z-10 group-hover:scale-105 transition-transform"
                />
              </div>

              <div className="min-w-0 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-data text-[10px] uppercase tracking-wider text-ink-soft bg-paper-sunk px-2 py-0.5 rounded border border-line">
                    {product.brand}
                  </span>
                  <span className="font-data text-[10px] text-ink-soft">
                    {product.category}
                  </span>
                </div>

                <h3 className="font-ui font-bold text-sm sm:text-base text-ink group-hover:text-red transition-colors truncate">
                  {product.name}
                </h3>

                <p className="font-ui text-xs text-ink-soft line-clamp-1">
                  {product.tagline || product.description}
                </p>

                {/* Storage and Color options */}
                <div className="flex items-center gap-2 pt-0.5">
                  {product.storageOptions?.map((s) => (
                    <span
                      key={s}
                      className="font-data text-[10px] text-ink-soft bg-paper px-1.5 py-0.5 rounded border border-line/60"
                    >
                      {s}
                    </span>
                  ))}
                  {product.colorOptions?.slice(0, 3).map((c) => (
                    <span
                      key={c.name}
                      className="w-2.5 h-2.5 rounded-full border border-line"
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Price + Stock + Action Buttons */}
            <div
              className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-line/50"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Stock status indicator */}
              <div className="text-right">
                {isOutOfStock ? (
                  <span className="inline-flex items-center gap-1 font-data text-xs text-ink line-through">
                    <Dot tone="ink" size="xs" />
                    <span>Out of stock</span>
                  </span>
                ) : isLowStock ? (
                  <span className="inline-flex items-center gap-1 font-data text-xs text-low">
                    <Dot tone="low" size="xs" pulse />
                    <span>{product.stock} left</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 font-data text-xs text-go">
                    <Dot tone="go" size="xs" />
                    <span>In stock</span>
                  </span>
                )}
                {hasRange && (
                  <span className="font-data text-[10px] text-ink-soft block uppercase">From</span>
                )}
              </div>

              {/* Price display */}
              <div className="text-right">
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

              {/* Wishlist & Add to Bag */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleWishlist(product.id)}
                  className={`w-9 h-9 rounded-full border flex items-center justify-center transition-colors min-w-[44px] min-h-[44px] cursor-pointer ${
                    wishlisted
                      ? 'bg-red-wash border-red text-red'
                      : 'bg-paper border-line text-ink-soft hover:text-red hover:border-ink'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
                </button>

                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={handleAdd}
                  className={`px-3 py-2 rounded-full font-ui text-xs font-bold border border-ink flex items-center gap-1.5 transition-all min-h-[44px] cursor-pointer ${
                    isOutOfStock
                      ? 'bg-paper-sunk text-ink-soft border-line cursor-not-allowed opacity-50'
                      : 'bg-ink text-paper hover:bg-red hover:border-ink hover:shadow-hard-sm'
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span className="hidden min-[400px]:inline">
                    {isOutOfStock ? 'Sold Out' : 'Add'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
