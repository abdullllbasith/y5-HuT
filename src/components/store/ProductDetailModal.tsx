import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductImage } from '../common/ProductImage';
import {
  hasVariants,
  getSelectedVariant,
  getDefaultVariant,
  getVariantColors,
  getVariantStorages,
} from '../../lib/variants';
import {
  X,
  Star,
  ShieldCheck,
  Check,
  Truck,
  Heart,
  CreditCard,
  RotateCcw,
} from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProductForDetail,
    products,
    setSelectedProductForDetail,
    addToCart,
    addProductReview,
    formatPrice,
    currency,
    currentUser,
    toggleWishlist,
    isInWishlist,
  } = useStore();

  // Resolve the live catalogue entry so price/stock are never stale after an edit.
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
  const [reviewTab, setReviewTab] = useState<'specs' | 'reviews' | 'write'>('specs');

  // Review state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewAuthor, setReviewAuthor] = useState(currentUser.name);
  const [reviewCompany, setReviewCompany] = useState(currentUser.company || '');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const productId = product?.id;
  useEffect(() => {
    // Reset selection when a different product is opened (the modal stays mounted).
    const p = products.find((x) => x.id === productId);
    if (!p) return;
    const dv = getDefaultVariant(p);
    setSelectedColor(dv?.color || p.colorOptions[0]?.name || '');
    setSelectedStorage(dv?.storage || p.storageOptions?.[0] || '');
    setQuantity(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  if (!product) return null;

  const activeColorObj =
    product.colorOptions.find((c) => c.name === selectedColor) ||
    product.colorOptions[0];

  const variant = hasVariants(product) ? getSelectedVariant(product, selectedColor, selectedStorage) : undefined;
  const unitPriceLKR = variant ? variant.priceLKR : product.priceLKR;
  const unitPriceUSD = variant?.priceUSD ?? product.priceUSD;
  const unitStock = variant ? variant.stock : product.stock;
  const colorNames = hasVariants(product) ? getVariantColors(product) : product.colorOptions.map((c) => c.name);
  const storageNames = hasVariants(product) ? getVariantStorages(product) : product.storageOptions ?? [];
  const isLowStock = unitStock > 0 && unitStock <= product.lowStockThreshold;
  const isOutOfStock = unitStock === 0;
  const variantCombinationMissing = hasVariants(product) && !variant;
  const isWishlisted = isInWishlist(product.id);

  const installmentThird =
    currency === 'LKR'
      ? Math.round(unitPriceLKR / 3)
      : Math.round(unitPriceUSD / 3);

  const handleAddToCart = () => {
    if (isOutOfStock || variantCombinationMissing) return;
    addToCart(product, quantity, selectedColor, selectedStorage);
    setSelectedProductForDetail(null);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewTitle.trim() || !reviewComment.trim()) return;

    addProductReview(product.id, {
      authorName: reviewAuthor,
      authorCompany: reviewCompany,
      rating: reviewRating,
      title: reviewTitle,
      comment: reviewComment,
      isVerifiedPurchase: true,
    });

    setReviewSuccess(true);
    setTimeout(() => {
      setReviewSuccess(false);
      setReviewTab('reviews');
      setReviewTitle('');
      setReviewComment('');
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span className="font-bold text-[#E11D48] uppercase tracking-wider">
              {product.brand}
            </span>
            <span>·</span>
            <span>SKU: {product.id}</span>
            <span>·</span>
            <span className="text-emerald-700 font-semibold">Sample warranty info (demo)</span>
          </div>

          <button
            onClick={() => setSelectedProductForDetail(null)}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-md cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Left: Device Graphic Stage */}
          <div className="flex flex-col">
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 flex items-center justify-center relative min-h-[300px]">
              <ProductImage product={product} colorHex={activeColorObj?.hex} className="max-h-72" />
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center shadow-xs cursor-pointer ${
                  isWishlisted ? 'bg-rose-50 text-[#E11D48]' : 'bg-white text-slate-400 hover:text-[#E11D48]'
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* y5Hut.lk Guarantees */}
            <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] text-slate-600">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#E11D48]" />
                <span>Islandwide Delivery (2-5 Days)</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Sample warranty (demo content)</span>
              </div>
            </div>
          </div>

          {/* Right: Purchase & Options */}
          <div className="flex flex-col justify-between space-y-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                {product.name}
              </h2>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-2 text-xs text-slate-600">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.floor(product.rating) ? 'fill-current' : 'text-slate-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-bold text-slate-900">{product.rating}</span>
                <span className="text-slate-400">({product.reviewCount} reviews)</span>
              </div>

              {/* Price & Savings */}
              <div className="mt-3 flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-black font-mono text-slate-950">
                  {formatPrice(unitPriceLKR, unitPriceUSD)}
                </span>
                {(product.originalPriceLKR || product.originalPriceUSD) && (
                  <span className="text-sm text-slate-400 line-through font-mono">
                    {formatPrice(
                      product.originalPriceLKR || 0,
                      product.originalPriceUSD || 0
                    )}
                  </span>
                )}
              </div>

              {/* Installment Widget (y5Hut.lk Signature) */}
              <div className="mt-3 p-3 bg-rose-50/70 border border-rose-200 rounded-lg space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                  <span className="flex items-center gap-1.5 text-[#E11D48]">
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>0% Interest Installments Available</span>
                  </span>
                  <span className="text-[11px] bg-white px-1.5 py-0.5 rounded border border-rose-200 text-slate-700 font-mono">
                    Koko · Mintpay
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Split your payment into 3 monthly installments of{' '}
                  <strong className="text-slate-950 font-mono font-bold">
                    {currency === 'LKR' ? `Rs. ${installmentThird.toLocaleString()}` : `$${installmentThird}`}
                  </strong>{' '}
                  with zero interest.
                </p>
              </div>

              {/* Description */}
              <p className="mt-3 text-xs text-slate-600 leading-relaxed">
                {product.description}
              </p>

              {/* Color Finish */}
              <div className="mt-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Finish: <span className="font-normal text-slate-500">{selectedColor}</span>
                </label>
                <div className="flex items-center gap-2">
                  {product.colorOptions.filter((c) => colorNames.includes(c.name)).map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
                        selectedColor === c.name
                          ? 'ring-2 ring-[#E11D48] ring-offset-2 scale-105'
                          : 'border-slate-300 hover:scale-105'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    >
                      {selectedColor === c.name && (
                        <Check className="w-3.5 h-3.5 text-white drop-shadow" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Storage */}
              {storageNames.length > 0 && (
                <div className="mt-4">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Storage Capacity
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {storageNames.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedStorage(s)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                          selectedStorage === s
                            ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Stock & Quantity */}
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  {isOutOfStock ? (
                    <span className="text-xs font-bold text-rose-600">Currently Sold Out</span>
                  ) : isLowStock ? (
                    <span className="text-xs font-bold text-[#E11D48]">
                      Only {unitStock} units remaining in stock
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>In Stock ({unitStock} units)</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center border border-slate-200 rounded-md">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1 || isOutOfStock}
                    className="px-3 py-1 text-xs hover:bg-slate-100 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs font-mono font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(unitStock, quantity + 1))}
                    disabled={quantity >= unitStock || isOutOfStock}
                    className="px-3 py-1 text-xs hover:bg-slate-100 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-2 space-y-2">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock || variantCombinationMissing}
                className="w-full py-3 px-4 rounded-xl bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-md disabled:opacity-50 cursor-pointer"
              >
                {variantCombinationMissing ? 'Combination unavailable' : isOutOfStock ? 'Sold Out' : `Add to Cart · ${formatPrice(unitPriceLKR * quantity, unitPriceUSD * quantity)}`}
              </button>
              <p className="text-[10px] text-slate-400 text-center">
                Sample/demo prices.{currency === 'USD' ? ' USD is illustrative and not exchange-rate synced.' : ''}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs: Specifications & Customer Reviews */}
        <div className="border-t border-slate-200 bg-slate-50 p-6 sm:p-8">
          <div className="flex items-center gap-4 border-b border-slate-200 pb-2 mb-4">
            <button
              onClick={() => setReviewTab('specs')}
              className={`text-xs font-bold uppercase pb-1 border-b-2 transition-colors cursor-pointer ${
                reviewTab === 'specs'
                  ? 'border-[#E11D48] text-[#E11D48]'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Hardware Specifications
            </button>
            <button
              onClick={() => setReviewTab('reviews')}
              className={`text-xs font-bold uppercase pb-1 border-b-2 transition-colors cursor-pointer ${
                reviewTab === 'reviews'
                  ? 'border-[#E11D48] text-[#E11D48]'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Verified Customer Reviews ({product.reviews.length})
            </button>
            <button
              onClick={() => setReviewTab('write')}
              className={`text-xs font-bold uppercase pb-1 border-b-2 transition-colors cursor-pointer ${
                reviewTab === 'write'
                  ? 'border-[#E11D48] text-[#E11D48]'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              + Write a Review
            </button>
          </div>

          {reviewTab === 'specs' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-xs">
              {product.specs.display && (
                <div className="flex justify-between py-1.5 border-b border-slate-200">
                  <span className="text-slate-500">Display:</span>
                  <span className="font-semibold text-slate-800 text-right">{product.specs.display}</span>
                </div>
              )}
              {product.specs.processor && (
                <div className="flex justify-between py-1.5 border-b border-slate-200">
                  <span className="text-slate-500">Processor:</span>
                  <span className="font-semibold text-slate-800 text-right">{product.specs.processor}</span>
                </div>
              )}
              {product.specs.battery && (
                <div className="flex justify-between py-1.5 border-b border-slate-200">
                  <span className="text-slate-500">Battery:</span>
                  <span className="font-semibold text-slate-800 text-right">{product.specs.battery}</span>
                </div>
              )}
              {product.specs.camera && (
                <div className="flex justify-between py-1.5 border-b border-slate-200">
                  <span className="text-slate-500">Camera:</span>
                  <span className="font-semibold text-slate-800 text-right">{product.specs.camera}</span>
                </div>
              )}
              <div className="flex justify-between py-1.5 border-b border-slate-200">
                <span className="text-slate-500">Warranty:</span>
                <span className="font-bold text-[#E11D48] text-right">{product.specs.warranty}</span>
              </div>
            </div>
          )}

          {reviewTab === 'reviews' && (
            <div className="space-y-3">
              {product.reviews.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-2">
                  No reviews submitted yet for this product. Be the first to leave verified feedback!
                </p>
              ) : (
                product.reviews.map((r) => (
                  <div key={r.id} className="bg-white p-3.5 rounded-lg border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{r.authorName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{r.date}</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < r.rating ? 'fill-current' : 'text-slate-200'}`} />
                      ))}
                      {r.isVerifiedPurchase && (
                        <span className="text-[10px] text-emerald-700 font-semibold ml-2">
                          ✓ Verified Buyer
                        </span>
                      )}
                    </div>
                    <h5 className="font-bold text-slate-800">{r.title}</h5>
                    <p className="text-slate-600">{r.comment}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {reviewTab === 'write' && (
            <form onSubmit={handleReviewSubmit} className="space-y-3 max-w-lg">
              {reviewSuccess && (
                <div className="p-2.5 bg-emerald-50 text-emerald-800 text-xs rounded border border-emerald-200">
                  Thank you! Your verified review has been logged.
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={reviewAuthor}
                  onChange={(e) => setReviewAuthor(e.target.value)}
                  className="text-xs p-2 border border-slate-300 rounded bg-white"
                />
                <input
                  type="text"
                  placeholder="Company / City"
                  value={reviewCompany}
                  onChange={(e) => setReviewCompany(e.target.value)}
                  className="text-xs p-2 border border-slate-300 rounded bg-white"
                />
              </div>
              <input
                type="text"
                required
                placeholder="Review Title"
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
                className="w-full text-xs p-2 border border-slate-300 rounded bg-white"
              />
              <textarea
                required
                rows={2}
                placeholder="Share your experience with this device..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="w-full text-xs p-2 border border-slate-300 rounded bg-white"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#E11D48] text-white text-xs font-bold rounded hover:bg-[#BE123C] cursor-pointer"
              >
                Submit Review
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
