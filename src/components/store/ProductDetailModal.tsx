import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  hasVariants,
  getSelectedVariant,
  getDefaultVariant,
  getVariantColors,
  getVariantStorages,
} from '../../lib/variants';
import {
  getDemoWhatsAppNumber,
  buildWhatsAppEnquiryText,
  buildWhatsAppUrl,
} from '../../lib/whatsapp';
import {
  X,
  Star,
  ShoppingBag,
  MessageCircle,
} from 'lucide-react';
import { ProductStage } from './product-detail/ProductStage';
import { ProductSpecSheet } from './product-detail/ProductSpecSheet';
import { ProductWhatsAppDialog } from './product-detail/ProductWhatsAppDialog';
import { Price } from '../ui/Price';
import { Dot } from '../ui/Dot';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProductForDetail,
    products,
    setSelectedProductForDetail,
    addToCart,
    currency,
  } = useStore();

  const product =
    (selectedProductForDetail && products.find((p) => p.id === selectedProductForDetail.id)) ||
    selectedProductForDetail;

  const initialVariant = product ? getDefaultVariant(product) : undefined;
  const [selectedColor, setSelectedColor] = useState<string>(
    initialVariant?.color || product?.colorOptions[0]?.name || ''
  );
  const [selectedStorage, setSelectedStorage] = useState<string>(
    initialVariant?.storage || product?.storageOptions?.[0] || ''
  );
  const [quantity, setQuantity] = useState(1);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);

  const productId = product?.id;
  useEffect(() => {
    const p = products.find((x) => x.id === productId);
    if (!p) return;
    const dv = getDefaultVariant(p);
    setSelectedColor(dv?.color || p.colorOptions[0]?.name || '');
    setSelectedStorage(dv?.storage || p.storageOptions?.[0] || '');
    setQuantity(1);
  }, [productId, products]);

  // Sync hash state with browser back button
  useEffect(() => {
    if (product) {
      window.location.hash = `tag-${product.id}`;
      const onHashChange = () => {
        if (!window.location.hash.startsWith('#tag-')) {
          setSelectedProductForDetail(null);
        }
      };
      window.addEventListener('hashchange', onHashChange);
      return () => {
        window.removeEventListener('hashchange', onHashChange);
        if (window.location.hash.startsWith('#tag-')) {
          history.replaceState(null, '', window.location.pathname + window.location.search);
        }
      };
    }
  }, [product, setSelectedProductForDetail]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isWhatsAppOpen) setIsWhatsAppOpen(false);
        else setSelectedProductForDetail(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setSelectedProductForDetail, isWhatsAppOpen]);

  if (!product) return null;

  const activeColorObj =
    product.colorOptions.find((c) => c.name === selectedColor) || product.colorOptions[0];

  const variant = hasVariants(product)
    ? getSelectedVariant(product, selectedColor, selectedStorage)
    : undefined;
  const unitPriceLKR = variant ? variant.priceLKR : product.priceLKR;
  const unitPriceUSD = variant?.priceUSD ?? product.priceUSD;
  const unitStock = variant ? variant.stock : product.stock;
  const colorNames = hasVariants(product)
    ? getVariantColors(product)
    : product.colorOptions.map((c) => c.name);
  const storageNames = hasVariants(product)
    ? getVariantStorages(product)
    : product.storageOptions ?? [];
  const isLowStock = unitStock > 0 && unitStock <= product.lowStockThreshold;
  const isOutOfStock = unitStock === 0;
  const variantMissing = hasVariants(product) && !variant;

  const whatsappMessage = buildWhatsAppEnquiryText({
    productName: product.name,
    brand: product.brand,
    sku: variant?.sku || product.id,
    variantColor: selectedColor,
    variantStorage: selectedStorage,
    priceLKR: unitPriceLKR,
    priceUSD: unitPriceUSD,
    currency,
    stock: unitStock,
  });

  const handleWhatsAppAction = () => {
    const num = getDemoWhatsAppNumber();
    if (num) {
      window.open(buildWhatsAppUrl(num, whatsappMessage), '_blank', 'noopener,noreferrer');
    } else {
      setIsWhatsAppOpen(true);
    }
  };

  const handleAddToCart = () => {
    if (isOutOfStock || variantMissing) return;
    addToCart(product, quantity, selectedColor, selectedStorage);
    setSelectedProductForDetail(null);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-ink/70 backdrop-blur-xs"
    >
      <div className="bg-paper w-full h-[96vh] sm:h-auto sm:max-h-[92vh] sm:max-w-4xl rounded-t-3xl sm:rounded-3xl shadow-hard border border-line overflow-hidden flex flex-col relative text-left">
        
        {/* Top Header Bar */}
        <div className="px-5 py-3.5 border-b border-line flex items-center justify-between bg-card shrink-0">
          <div className="flex items-center gap-2 text-xs font-data text-ink-soft">
            <span className="font-bold text-ink uppercase tracking-wider">{product.brand}</span>
            <span>·</span>
            <span>SKU: {variant?.sku || product.id}</span>
          </div>

          <button
            type="button"
            onClick={() => setSelectedProductForDetail(null)}
            className="w-9 h-9 rounded-full flex items-center justify-center text-ink-soft hover:text-ink hover:bg-paper-sunk transition-colors cursor-pointer min-w-[44px] min-h-[44px]"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Container */}
        <div className="overflow-y-auto flex-1 p-5 sm:p-8 space-y-8 pb-32 sm:pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            
            {/* Left: Product Visual Stage & Guarantees */}
            <ProductStage product={product} activeColorHex={activeColorObj?.hex} />

            {/* Right: Purchase Controls & Specs */}
            <div className="space-y-5 text-left">
              <div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink leading-tight">
                  {product.name}
                </h2>

                {/* Rating */}
                <div className="flex items-center gap-2 mt-2 text-xs text-ink-soft">
                  <div className="flex text-highlighter" aria-label={`${product.rating} stars`}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current text-ink" />
                    ))}
                  </div>
                  <span className="font-data font-bold text-ink">{product.rating}</span>
                  <span className="font-data text-[11px]">({product.reviewCount} customer tags)</span>
                </div>

                {/* Price */}
                <div className="mt-4">
                  <Price
                    amountLKR={unitPriceLKR}
                    amountUSD={unitPriceUSD}
                    originalLKR={product.originalPriceLKR}
                    originalUSD={product.originalPriceUSD}
                    currency={currency}
                    size="xl"
                    showDiscountPill={true}
                  />
                </div>

                <p className="mt-3 text-xs sm:text-sm font-ui text-ink-soft leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Color Finish Picker */}
              <div>
                <label className="block font-data text-[11px] uppercase font-bold text-ink-soft mb-2">
                  Finish: <span className="text-ink font-bold">{selectedColor || 'Default'}</span>
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {product.colorOptions.filter((c) => colorNames.includes(c.name)).map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setSelectedColor(c.name)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 border transition-all cursor-pointer min-h-[38px] ${
                        selectedColor === c.name
                          ? 'bg-ink text-paper border-ink shadow-hard-sm'
                          : 'bg-card text-ink border-line hover:border-ink'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full border border-black/20" style={{ backgroundColor: c.hex }} />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Storage Capacity Picker */}
              {storageNames.length > 0 && (
                <div>
                  <label className="block font-data text-[11px] uppercase font-bold text-ink-soft mb-2">
                    Storage Capacity
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {storageNames.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSelectedStorage(s)}
                        className={`px-4 py-2 text-xs font-bold rounded-full border transition-all cursor-pointer min-h-[40px] ${
                          selectedStorage === s
                            ? 'bg-ink text-paper border-ink shadow-hard-sm'
                            : 'bg-card text-ink border-line hover:border-ink'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Stock Status & Quantity Controls */}
              <div className="pt-4 border-t border-line flex items-center justify-between">
                <div>
                  {variantMissing ? (
                    <span className="font-data text-xs text-low font-bold">Combination unavailable</span>
                  ) : isOutOfStock ? (
                    <span className="font-data text-xs text-ink line-through font-bold">Sold Out</span>
                  ) : isLowStock ? (
                    <span className="font-data text-xs text-low font-bold flex items-center gap-1.5">
                      <Dot tone="low" size="xs" pulse />
                      <span>Only {unitStock} left on counter</span>
                    </span>
                  ) : (
                    <span className="font-data text-xs text-go font-bold flex items-center gap-1.5">
                      <Dot tone="go" size="xs" />
                      <span>In Stock ({unitStock} units)</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center border border-line rounded-full bg-card overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1 || isOutOfStock || variantMissing}
                    className="w-10 h-10 text-xs font-bold hover:bg-paper-sunk cursor-pointer disabled:opacity-30 flex items-center justify-center min-w-[40px]"
                    aria-label="Decrease"
                  >
                    -
                  </button>
                  <span className="w-10 h-10 font-data text-xs font-bold flex items-center justify-center border-x border-line">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(unitStock, quantity + 1))}
                    disabled={quantity >= unitStock || isOutOfStock || variantMissing}
                    className="w-10 h-10 text-xs font-bold hover:bg-paper-sunk cursor-pointer disabled:opacity-30 flex items-center justify-center min-w-[40px]"
                    aria-label="Increase"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Desktop Actions */}
              <div className="pt-2 space-y-2.5 hidden sm:block">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || variantMissing}
                  className="w-full py-3.5 px-6 rounded-full bg-ink text-paper hover:bg-red hover:text-white font-ui text-xs font-bold uppercase tracking-wider transition-all shadow-hard cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-h-[48px]"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>
                    {variantMissing ? 'Option Unavailable' : isOutOfStock ? 'Sold Out' : `Add to Bag · Rs. ${(unitPriceLKR * quantity).toLocaleString('en-LK')}`}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppAction}
                  className="w-full py-3 px-6 rounded-full bg-card hover:bg-paper-sunk border border-line text-ink font-ui text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 min-h-[44px]"
                >
                  <MessageCircle className="w-4 h-4 text-go" />
                  <span>Ask on WhatsApp (Sample Enquiry)</span>
                </button>
              </div>
            </div>

          </div>

          {/* Specs Sheet & Reviews Tab */}
          <ProductSpecSheet product={product} />
        </div>

        {/* Mobile Sticky Bottom Bar */}
        <div className="sm:hidden fixed bottom-0 inset-x-0 bg-paper/95 backdrop-blur-md border-t border-line p-3 pb-safe z-30 flex items-center justify-between gap-3 shadow-hard">
          <div className="flex flex-col min-w-[80px]">
            <span className="font-data text-[10px] text-ink-soft uppercase">Total</span>
            <span className="font-data text-sm font-bold text-ink tabular-nums">
              Rs. {(unitPriceLKR * quantity).toLocaleString('en-LK')}
            </span>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock || variantMissing}
            className="flex-1 py-3 px-4 rounded-full bg-ink text-paper font-ui text-xs font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 min-h-[44px]"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{variantMissing ? 'Unavailable' : isOutOfStock ? 'Sold Out' : 'Add to Bag'}</span>
          </button>

          <button
            type="button"
            onClick={handleWhatsAppAction}
            className="w-11 h-11 rounded-full bg-card border border-line text-go flex items-center justify-center cursor-pointer min-w-[44px] min-h-[44px]"
            aria-label="WhatsApp"
          >
            <MessageCircle className="w-5 h-5" />
          </button>
        </div>

        {/* WhatsApp Preview Dialog */}
        <ProductWhatsAppDialog
          open={isWhatsAppOpen}
          onClose={() => setIsWhatsAppOpen(false)}
          messageText={whatsappMessage}
        />

      </div>
    </div>
  );
};
