import React, { useState } from 'react';
import { Product } from '../../../types';
import { Star } from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { Button } from '../../ui/Button';

interface ProductSpecSheetProps {
  product: Product;
}

export const ProductSpecSheet: React.FC<ProductSpecSheetProps> = ({ product }) => {
  const { addProductReview, currentUser } = useStore();
  const [activeTab, setActiveTab] = useState<'specs' | 'reviews' | 'write'>('specs');

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewTitle.trim() || !reviewComment.trim()) return;

    addProductReview(product.id, {
      authorName: currentUser.name || 'Store Customer',
      authorCompany: currentUser.company || 'Verified Buyer',
      rating: reviewRating,
      title: reviewTitle,
      comment: reviewComment,
      isVerifiedPurchase: true,
    });

    setReviewSuccess(true);
    setTimeout(() => {
      setReviewSuccess(false);
      setActiveTab('reviews');
      setReviewTitle('');
      setReviewComment('');
    }, 1200);
  };

  return (
    <div className="border-t border-line pt-6 text-left">
      {/* Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-line pb-3 mb-4 overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab('specs')}
          className={`px-4 py-2 text-xs font-bold rounded-full transition-colors cursor-pointer min-h-[40px] ${
            activeTab === 'specs'
              ? 'bg-ink text-paper shadow-hard-sm'
              : 'text-ink-soft hover:bg-paper-sunk hover:text-ink'
          }`}
        >
          Specifications
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('reviews')}
          className={`px-4 py-2 text-xs font-bold rounded-full transition-colors cursor-pointer min-h-[40px] ${
            activeTab === 'reviews'
              ? 'bg-ink text-paper shadow-hard-sm'
              : 'text-ink-soft hover:bg-paper-sunk hover:text-ink'
          }`}
        >
          Customer Reviews ({product.reviews?.length || 0})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('write')}
          className={`px-4 py-2 text-xs font-bold rounded-full transition-colors cursor-pointer min-h-[40px] ${
            activeTab === 'write'
              ? 'bg-ink text-paper shadow-hard-sm'
              : 'text-ink-soft hover:bg-paper-sunk hover:text-ink'
          }`}
        >
          Write Review
        </button>
      </div>

      {/* Specifications Tab: Mono Table */}
      {activeTab === 'specs' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {Object.entries(product.specs || {}).map(([key, value]) => (
            <div
              key={key}
              className="p-3 bg-card rounded-xl border border-line flex items-center justify-between gap-3"
            >
              <span className="font-data text-[11px] uppercase text-ink-soft">{key}</span>
              <span className="font-ui font-semibold text-ink text-right">{value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Reviews Tab */}
      {activeTab === 'reviews' && (
        <div className="space-y-3">
          {product.reviews && product.reviews.length > 0 ? (
            product.reviews.map((r) => (
              <div
                key={r.id}
                className="p-4 bg-card rounded-xl border border-line space-y-1.5 text-xs text-left"
              >
                <div className="flex items-center justify-between">
                  <span className="font-ui font-bold text-ink">{r.authorName}</span>
                  <span className="font-data text-[10px] text-ink-soft">{r.date}</span>
                </div>
                <div className="flex text-ink" aria-label={`${r.rating} stars`}>
                  {[...Array(r.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current text-highlighter" />
                  ))}
                </div>
                <h5 className="font-ui font-semibold text-ink">{r.title}</h5>
                <p className="font-ui text-ink-soft leading-relaxed">{r.comment}</p>
              </div>
            ))
          ) : (
            <div className="py-6 text-center text-xs text-ink-soft bg-card rounded-xl border border-line">
              No reviews registered yet on this demo item.
            </div>
          )}
        </div>
      )}

      {/* Write Review Tab */}
      {activeTab === 'write' && (
        <form onSubmit={handleReviewSubmit} className="space-y-4 max-w-lg text-xs">
          {reviewSuccess && (
            <div className="p-3 bg-go/10 text-go font-bold rounded-xl border border-go/20">
              Review published to local demo storage!
            </div>
          )}
          <div>
            <label className="block font-bold text-ink mb-1.5">Rating Score</label>
            <select
              value={reviewRating}
              onChange={(e) => setReviewRating(Number(e.target.value))}
              className="w-full p-2.5 bg-card border border-line rounded-xl font-ui text-xs"
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>{n} Stars</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-bold text-ink mb-1.5">Headline</label>
            <input
              type="text"
              required
              placeholder="e.g. Authentic device & great battery life"
              value={reviewTitle}
              onChange={(e) => setReviewTitle(e.target.value)}
              className="w-full p-2.5 bg-card border border-line rounded-xl font-ui text-xs focus:outline-none focus:border-ink"
            />
          </div>
          <div>
            <label className="block font-bold text-ink mb-1.5">Detailed Feedback</label>
            <textarea
              required
              rows={3}
              placeholder="Share your thoughts on build quality, packaging, and performance..."
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              className="w-full p-2.5 bg-card border border-line rounded-xl font-ui text-xs focus:outline-none focus:border-ink"
            />
          </div>
          <Button type="submit" variant="primary">
            Publish Review Slip
          </Button>
        </form>
      )}
    </div>
  );
};
