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
  getDemoWhatsAppNumber,
  buildWhatsAppEnquiryText,
  buildWhatsAppUrl,
} from '../../lib/whatsapp';
import {
  X,
  Star,
  ShieldCheck,
  Check,
  Truck,
  Heart,
  CreditCard,
  ShoppingBag,
  MessageCircle,
  Copy,
  ExternalLink,
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

  // WhatsApp enquiry state
  const [isWhatsAppPreviewOpen, setIsWhatsAppPreviewOpen] = useState(false);
  const [copiedEnquiry, setCopiedEnquiry] = useState(false);

  // Review state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewAuthor, setReviewAuthor] = useState(currentUser.name);
  const [reviewCompany, setReviewCompany] = useState(currentUser.company || '');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const productId = product?.id;
  useEffect(() => {
    const p = products.find((x) => x.id === productId);
    if (!p) return;
    const dv = getDefaultVariant(p);
    setSelectedColor(dv?.color || p.colorOptions[0]?.name || '');
    setSelectedStorage(dv?.storage || p.storageOptions?.[0] || '');
    setQuantity(1);
    setIsWhatsAppPreviewOpen(false);
    setCopiedEnquiry(false);
  }, [productId, products]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isWhatsAppPreviewOpen) {
          setIsWhatsAppPreviewOpen(false);
        } else {
          setSelectedProductForDetail(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setSelectedProductForDetail, isWhatsAppPreviewOpen]);

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

  const whatsappNumber = getDemoWhatsAppNumber();
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
    if (whatsappNumber) {
      const url = buildWhatsAppUrl(whatsappNumber, whatsappMessage);
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      setIsWhatsAppPreviewOpen(true);
    }
  };

  const handleCopyEnquiry = async () => {
    try {
      await navigator.clipboard.writeText(whatsappMessage);
      setCopiedEnquiry(true);
      setTimeout(() => setCopiedEnquiry(false), 2000);
    } catch {
      setCopiedEnquiry(false);
    }
  };

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

  const buttonText = variantCombinationMissing
    ? 'Combination Unavailable'
    : isOutOfStock
    ? 'Sold Out'
    : `Add to Bag · LKR ${(unitPriceLKR * quantity).toLocaleString('en-LK')}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-detail-modal-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-slate-950/60 backdrop-blur-xs"
    >
      <div className="bg-white w-full h-[95vh] sm:h-auto sm:max-h-[92vh] sm:max-w-4xl rounded-t-[24px] sm:rounded-[20px] shadow-floating border border-[#E5E7EB] overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-2 sm:zoom-in-95 duration-150 relative">
        
        {/* Header */}
        <div className="px-4 sm:px-6 py-3 border-b border-[#E5E7EB] flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2 text-xs text-[#6B7280] truncate mr-2">
            <span className="font-mono font-bold text-[#111827] uppercase tracking-wider shrink-0">
              {product.brand}
            </span>
            <span>·</span>
            <span className="truncate font-mono text-[11px]">SKU: {variant?.sku || product.id}</span>
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline text-emerald-700 font-mono text-[11px] font-medium">Verified Sample</span>
          </div>

          <button
            type="button"
            onClick={() => setSelectedProductForDetail(null)}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full cursor-pointer transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center shrink-0"
            aria-label="Close product details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 md:p-8 space-y-6 pb-28 sm:pb-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start">
            
            {/* Left: Apple-Style Negative Space Render */}
            <div className="flex flex-col space-y-3">
              <div className="bg-[#F7F8FA] rounded-[18px] p-6 sm:p-8 border border-[#E5E7EB] flex items-center justify-center relative min-h-[240px] sm:min-h-[320px]">
                <ProductImage product={product} colorHex={activeColorObj?.hex} className="max-h-56 sm:max-h-72 drop-shadow-sm" />
                <button
                  type="button"
                  onClick={() => toggleWishlist(product.id)}
                  className={`absolute top-3 right-3 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center border transition-colors cursor-pointer ${
                    isWishlisted ? 'bg-rose-50 text-[#E11D48] border-rose-200' : 'bg-white text-slate-400 hover:text-[#E11D48] border-[#E5E7EB]'
                  }`}
                  aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-[#6B7280]">
                <div className="p-2.5 bg-[#F7F8FA] rounded-xl border border-[#E5E7EB] flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">Islandwide Courier (Demo)</span>
                </div>
                <div className="p-2.5 bg-[#F7F8FA] rounded-xl border border-[#E5E7EB] flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#111827] shrink-0" />
                  <span className="truncate">Sample Warranty Spec</span>
                </div>
              </div>
            </div>

            {/* Right: Purchase & Options */}
            <div className="flex flex-col justify-between space-y-4 text-left">
              <div>
                <h2 id="product-detail-modal-title" className="text-xl sm:text-2xl font-bold text-[#111827] leading-tight font-sans">
                  {product.name}
                </h2>

                {/* Rating */}
                <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500">
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
                  <span className="font-bold text-[#111827] font-mono text-[11px]">{product.rating}</span>
                  <span className="text-slate-400">({product.reviewCount} reviews)</span>
                </div>

                {/* Live Variant Price with LKR Caption */}
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-xs text-[#6B7280] font-mono uppercase font-medium">LKR</span>
                  <span className="text-2xl sm:text-3xl font-bold font-sans text-[#111827] tabular-nums tracking-tight">
                    {unitPriceLKR.toLocaleString('en-LK')}
                  </span>
                  {(product.originalPriceLKR || product.originalPriceUSD) && (
                    <span className="text-xs text-[#6B7280] line-through font-mono tabular-nums">
                      {(product.originalPriceLKR || 0).toLocaleString('en-LK')}
                    </span>
                  )}
                </div>

                {/* Installment Widget */}
                {product.kokoEligible && (
                  <div className="mt-2.5 p-3 bg-[#F7F8FA] border border-[#E5E7EB] rounded-xl space-y-0.5">
                    <div className="flex items-center justify-between text-xs font-semibold text-[#111827]">
                      <span className="flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-[#E11D48]" />
                        <span>Koko &amp; Mintpay 3-Month Plan</span>
                      </span>
                      <span className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-[#E5E7EB] font-mono">
                        Demo
                      </span>
                    </div>
                    <p className="text-[11px] text-[#6B7280]">
                      3 monthly installments of{' '}
                      <strong className="text-[#111827] font-mono font-bold">
                        Rs. {installmentThird.toLocaleString()}
                      </strong>{' '}
                      (simulated).
                    </p>
                  </div>
                )}

                {/* Description */}
                <p className="mt-3 text-xs text-[#6B7280] leading-relaxed">
                  {product.description}
                </p>

                {/* Color Finish Picker (Apple & Nothing Pill Chips) */}
                <div className="mt-4">
                  <label className="block text-xs font-mono uppercase font-semibold text-slate-500 mb-2">
                    Finish: <span className="text-[#111827] font-sans font-bold">{selectedColor || 'Default'}</span>
                  </label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {product.colorOptions.filter((c) => colorNames.includes(c.name)).map((c) => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => setSelectedColor(c.name)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 border transition-all cursor-pointer ${
                          selectedColor === c.name
                            ? 'bg-[#111827] text-white border-[#111827]'
                            : 'bg-white text-slate-700 border-[#E5E7EB] hover:border-slate-300'
                        }`}
                        title={c.name}
                        aria-label={`Select finish ${c.name}`}
                      >
                        <span className="w-2.5 h-2.5 rounded-full border border-black/20" style={{ backgroundColor: c.hex }} />
                        <span>{c.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Storage Options Picker (Pill Chips with Ink Selected State) */}
                {storageNames.length > 0 && (
                  <div className="mt-4">
                    <label className="block text-xs font-mono uppercase font-semibold text-slate-500 mb-2">
                      Storage Capacity
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {storageNames.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setSelectedStorage(s)}
                          className={`px-3.5 py-1.5 text-xs font-semibold rounded-full border transition-colors cursor-pointer min-h-[36px] ${
                            selectedStorage === s
                              ? 'bg-[#111827] text-white border-[#111827]'
                              : 'bg-white text-slate-700 border-[#E5E7EB] hover:border-slate-300'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stock & Quantity */}
                <div className="mt-4 pt-3 border-t border-[#E5E7EB] flex items-center justify-between">
                  <div>
                    {variantCombinationMissing ? (
                      <span className="text-xs font-mono font-bold text-[#D97706]">Combination unavailable</span>
                    ) : isOutOfStock ? (
                      <span className="text-xs font-mono font-bold text-[#DC2626]">Currently Sold Out</span>
                    ) : isLowStock ? (
                      <span className="text-xs font-mono font-bold text-[#D97706]">
                        Only {unitStock} remaining
                      </span>
                    ) : (
                      <span className="text-xs font-mono font-medium text-[#16A34A] flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
                        <span>In Stock ({unitStock} units)</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center border border-[#E5E7EB] rounded-lg bg-white overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1 || isOutOfStock || variantCombinationMissing}
                      className="w-10 h-10 text-xs hover:bg-slate-100 cursor-pointer disabled:opacity-30 flex items-center justify-center"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="w-10 h-10 text-xs font-mono font-bold flex items-center justify-center border-x border-[#E5E7EB]">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.min(unitStock, quantity + 1))}
                      disabled={quantity >= unitStock || isOutOfStock || variantCombinationMissing}
                      className="w-10 h-10 text-xs hover:bg-slate-100 cursor-pointer disabled:opacity-30 flex items-center justify-center"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Desktop CTAs: Distinct Add to Bag vs WhatsApp Enquiry */}
              <div className="pt-2 space-y-2.5 hidden sm:block">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || variantCombinationMissing}
                  className="w-full py-3 px-4 rounded-xl bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 min-h-[44px]"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{buttonText}</span>
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppAction}
                  className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-2 min-h-[44px]"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>Ask on WhatsApp (Demo Enquiry)</span>
                </button>
              </div>
            </div>

          </div>

          {/* Specifications & Reviews Tabs */}
          <div className="border-t border-[#E5E7EB] pt-4">
            <div className="flex items-center gap-3 border-b border-[#E5E7EB] pb-2 mb-4 overflow-x-auto scrollbar-none">
              <button
                type="button"
                onClick={() => setReviewTab('specs')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  reviewTab === 'specs' ? 'bg-[#111827] text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Specifications
              </button>
              <button
                type="button"
                onClick={() => setReviewTab('reviews')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  reviewTab === 'reviews' ? 'bg-[#111827] text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Verified Reviews ({product.reviews?.length || 0})
              </button>
              <button
                type="button"
                onClick={() => setReviewTab('write')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  reviewTab === 'write' ? 'bg-[#111827] text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Write a Review
              </button>
            </div>

            {/* Specifications Tab */}
            {reviewTab === 'specs' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {Object.entries(product.specs || {}).map(([k, v]) => (
                    <div key={k} className="p-3 bg-[#F7F8FA] rounded-xl border border-[#E5E7EB] flex justify-between gap-3">
                      <span className="font-mono text-slate-500 capitalize">{k}</span>
                      <span className="font-semibold text-[#111827] text-right">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {reviewTab === 'reviews' && (
              <div className="space-y-3">
                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map((r) => (
                    <div key={r.id} className="p-3.5 bg-[#F7F8FA] rounded-xl border border-[#E5E7EB] space-y-1 text-xs text-left">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#111827]">{r.authorName}</span>
                        <span className="font-mono text-[10px] text-slate-400">{r.date}</span>
                      </div>
                      <div className="flex text-amber-400">
                        {[...Array(r.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-current" />
                        ))}
                      </div>
                      <p className="text-slate-600 pt-1 leading-relaxed">{r.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 py-4 text-center">No reviews submitted yet for this demo product.</p>
                )}
              </div>
            )}

            {/* Write Review Tab */}
            {reviewTab === 'write' && (
              <form onSubmit={handleReviewSubmit} className="space-y-3 text-xs max-w-md text-left">
                {reviewSuccess && (
                  <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200">
                    Review submitted successfully!
                  </div>
                )}
                <div>
                  <label className="block font-semibold mb-1">Rating</label>
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                    className="w-full p-2 bg-[#F7F8FA] border border-[#E5E7EB] rounded-lg"
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>{n} Stars</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Headline</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Excellent battery life"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    className="w-full p-2 bg-[#F7F8FA] border border-[#E5E7EB] rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Feedback</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Write your honest comments..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full p-2 bg-[#F7F8FA] border border-[#E5E7EB] rounded-lg"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#111827] text-white rounded-lg font-bold cursor-pointer hover:bg-slate-800"
                >
                  Submit Review
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Mobile Sticky Bottom Action Bar with safe-area spacing */}
        <div className="sm:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-[#E5E7EB] p-3 pb-safe z-30 shadow-floating flex items-center justify-between gap-2.5">
          <div className="flex flex-col min-w-[70px] text-left">
            <span className="text-[10px] text-slate-500 font-mono">Total</span>
            <span className="text-sm font-bold font-sans text-[#111827] tabular-nums truncate">
              LKR {(unitPriceLKR * quantity).toLocaleString('en-LK')}
            </span>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock || variantCombinationMissing}
            className="flex-1 py-2.5 px-3 rounded-xl bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-1.5 min-h-[44px]"
          >
            <ShoppingBag className="w-4 h-4 shrink-0" />
            <span className="truncate">
              {variantCombinationMissing ? 'Unavailable' : isOutOfStock ? 'Sold Out' : 'Add to Bag'}
            </span>
          </button>

          <button
            type="button"
            onClick={handleWhatsAppAction}
            className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 transition-colors cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center shrink-0"
            title="Ask on WhatsApp"
            aria-label="Ask on WhatsApp about this device"
          >
            <MessageCircle className="w-5 h-5 text-emerald-600" />
          </button>
        </div>

        {/* WhatsApp Preview Sheet */}
        {isWhatsAppPreviewOpen && (
          <div className="absolute inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
            <div className="bg-white rounded-[20px] shadow-floating max-w-lg w-full border border-[#E5E7EB] overflow-hidden flex flex-col max-h-[85vh]">
              
              <div className="px-5 py-3.5 border-b border-[#E5E7EB] flex items-center justify-between bg-emerald-50/70">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-sm font-bold text-[#111827] font-sans">
                    WhatsApp Enquiry Preview
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsWhatsAppPreviewOpen(false)}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                  aria-label="Close preview"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 sm:p-5 space-y-3.5 overflow-y-auto text-xs text-left">
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 space-y-1">
                  <p className="font-bold">
                    Demo Showcase — No WhatsApp recipient configured
                  </p>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    In a production store, clicking this launches WhatsApp with the pre-filled enquiry. To test direct launching, set <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-[10px]">VITE_DEMO_WHATSAPP_NUMBER</code>.
                  </p>
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Pre-composed Message Preview
                  </label>
                  <div className="bg-[#F7F8FA] border border-[#E5E7EB] rounded-xl p-3 font-mono text-[11px] text-[#111827] whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                    {whatsappMessage}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleCopyEnquiry}
                    className="flex-1 py-2 px-3 bg-[#111827] hover:bg-slate-800 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 min-h-[44px] cursor-pointer"
                  >
                    {copiedEnquiry ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedEnquiry ? 'Copied!' : 'Copy Enquiry Text'}</span>
                  </button>

                  {whatsappNumber && (
                    <button
                      type="button"
                      onClick={() => {
                        const url = buildWhatsAppUrl(whatsappNumber, whatsappMessage);
                        window.open(url, '_blank', 'noopener,noreferrer');
                      }}
                      className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 min-h-[44px] cursor-pointer"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Open wa.me</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setIsWhatsAppPreviewOpen(false)}
                    className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors min-h-[44px] cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
