import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Star, CheckCircle } from 'lucide-react';

export const ReviewsView: React.FC = () => {
  const { storefrontProducts: products, setSelectedProductForDetail } = useStore();
  const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all');

  // Collect all reviews from all products
  const allReviewsWithProduct = products.flatMap((p) =>
    p.reviews.map((r) => ({
      ...r,
      productName: p.name,
      productBrand: p.brand,
      productObj: p,
    }))
  );

  const filteredReviews = allReviewsWithProduct.filter((r) =>
    ratingFilter === 'all' ? true : r.rating === ratingFilter
  );

  const averageStoreRating = 4.9;

  return (
    <section className="py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#E11D48]">
            Verified Customer Reviews
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 font-sans mt-0.5">
            Customer Feedback &amp; Hardware Reviews
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Genuine experiences from tech buyers, enterprise procurement teams, and gadget enthusiasts across Sri Lanka.
          </p>
        </div>

        {/* Rating Score Badge */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center gap-4 shadow-xs">
          <div className="text-3xl font-black font-mono text-slate-950 tabular-nums">
            {averageStoreRating}
          </div>
          <div>
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <div className="text-xs text-slate-600 mt-0.5 font-bold">
              Based on 450+ Sri Lankan Verified Reviews
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-500 font-bold">Filter by:</span>
        {(['all', 5, 4] as const).map((star) => (
          <button
            key={String(star)}
            onClick={() => setRatingFilter(star)}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              ratingFilter === star
                ? 'bg-[#E11D48] text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {star === 'all' ? 'All Reviews' : `${star} Stars Only`}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredReviews.map((rev) => (
          <div
            key={rev.id}
            className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col justify-between hover:border-slate-300 transition-colors shadow-xs"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-3 pb-2 border-b border-slate-100">
                <button
                  onClick={() => setSelectedProductForDetail(rev.productObj)}
                  className="font-bold text-slate-900 hover:text-[#E11D48] transition-colors truncate max-w-xs cursor-pointer text-left"
                >
                  {rev.productName}
                </button>
                <span className="font-mono text-[11px] text-slate-400">{rev.date}</span>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < rev.rating ? 'fill-current' : 'text-slate-200'
                      }`}
                    />
                  ))}
                </div>
                {rev.isVerifiedPurchase && (
                  <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>Verified Buyer (Sri Lanka)</span>
                  </span>
                )}
              </div>

              <h4 className="text-sm font-bold text-slate-900 mt-1">{rev.title}</h4>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                "{rev.comment}"
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="font-bold text-slate-800">
                {rev.authorName}
                {rev.authorCompany && (
                  <span className="font-normal text-slate-500"> · {rev.authorCompany}</span>
                )}
              </span>
              <button
                onClick={() => setSelectedProductForDetail(rev.productObj)}
                className="text-[#E11D48] hover:underline font-bold cursor-pointer"
              >
                View Product Details →
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
