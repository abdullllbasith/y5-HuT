import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Star, CheckCircle, MessageSquare } from 'lucide-react';
import { Dot } from '../ui/Dot';
import { Chip } from '../ui/Chip';

export const ReviewsView: React.FC = () => {
  const { storefrontProducts: products, setSelectedProductForDetail } = useStore();
  const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all');

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

  // Rating histogram distribution
  const ratingDistribution = [
    { stars: 5, percent: 88, count: 396 },
    { stars: 4, percent: 9, count: 41 },
    { stars: 3, percent: 2, count: 9 },
    { stars: 2, percent: 1, count: 4 },
    { stars: 1, percent: 0, count: 0 },
  ];

  return (
    <section className="py-8 space-y-8 text-left font-ui">
      {/* Header with Histogram */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-line">
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-data text-[10px] font-bold uppercase tracking-wider text-red">
            <Dot tone="red" size="xs" />
            <span>Verified Customer Reviews</span>
          </div>
          <h1 className="font-display text-2xl sm:text-4xl font-bold text-ink tracking-tight">
            Customer Feedback &amp; Hardware Reviews
          </h1>
          <p className="font-ui text-xs text-ink-soft max-w-xl">
            Sample customer feedback representing Sri Lankan tech consumers, enterprise procurement managers, and audio enthusiasts.
          </p>
        </div>

        {/* 5-Row Dot Histogram Card */}
        <div className="bg-card p-5 rounded-2xl border border-line shadow-hard-sm flex flex-col sm:flex-row items-center gap-6 shrink-0 w-full lg:w-auto">
          <div className="text-center sm:text-left">
            <div className="font-display text-4xl sm:text-5xl font-extrabold text-ink tabular-nums">
              {averageStoreRating}
            </div>
            <div className="flex text-highlighter my-1 justify-center sm:justify-start" aria-label="4.9 stars">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current text-ink" />
              ))}
            </div>
            <span className="font-data text-[10px] text-ink-soft uppercase tracking-wider block">
              450+ Verified Slips
            </span>
          </div>

          {/* 5-row bar */}
          <div className="space-y-1.5 w-full sm:w-44">
            {ratingDistribution.map((row) => (
              <div key={row.stars} className="flex items-center gap-2 text-[10px] font-data text-ink-soft">
                <span className="w-4 font-bold">{row.stars}★</span>
                <div className="flex-1 h-2 bg-paper-sunk rounded-full overflow-hidden border border-line">
                  <div
                    className="bg-ink h-full rounded-full"
                    style={{ width: `${row.percent}%` }}
                  />
                </div>
                <span className="w-7 text-right text-ink font-bold">{row.percent}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-data text-xs text-ink-soft font-bold mr-1">Filter by:</span>
        <Chip
          label="All Reviews"
          active={ratingFilter === 'all'}
          onClick={() => setRatingFilter('all')}
          count={allReviewsWithProduct.length}
        />
        <Chip
          label="5 Stars Only"
          active={ratingFilter === 5}
          onClick={() => setRatingFilter(5)}
        />
        <Chip
          label="4 Stars Only"
          active={ratingFilter === 4}
          onClick={() => setRatingFilter(4)}
        />
      </div>

      {/* Reviews Grid: Slips rotated slightly */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {filteredReviews.map((rev, idx) => (
          <div
            key={rev.id}
            className="bg-card p-5 sm:p-6 rounded-2xl border border-line flex flex-col justify-between hover:border-ink hover:shadow-hard-sm transition-all shadow-2xs relative"
            style={{
              transform: idx % 3 === 1 ? 'rotate(-0.4deg)' : idx % 3 === 2 ? 'rotate(0.4deg)' : 'none',
            }}
          >
            <div>
              <div className="flex items-center justify-between text-xs text-ink-soft mb-3 pb-2 border-b border-line/60">
                <button
                  type="button"
                  onClick={() => setSelectedProductForDetail(rev.productObj)}
                  className="font-ui font-bold text-xs text-ink hover:text-red transition-colors truncate max-w-xs cursor-pointer text-left"
                >
                  {rev.productName}
                </button>
                <span className="font-data text-[10px] text-ink-soft">{rev.date}</span>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <div className="flex text-highlighter" aria-label={`${rev.rating} stars`}>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < rev.rating ? 'fill-current text-ink' : 'text-line'
                      }`}
                    />
                  ))}
                </div>
                {rev.isVerifiedPurchase && (
                  <span className="font-data text-[10px] font-bold text-go flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>Verified Counter Buyer</span>
                  </span>
                )}
              </div>

              <h4 className="font-ui font-bold text-sm text-ink mt-1">{rev.title}</h4>
              <p className="font-ui text-xs text-ink-soft mt-1.5 leading-relaxed italic">
                &ldquo;{rev.comment}&rdquo;
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-line/60 flex items-center justify-between text-xs text-ink-soft">
              <span className="font-ui font-bold text-ink">
                {rev.authorName}
                {rev.authorCompany && (
                  <span className="font-normal text-ink-soft"> · {rev.authorCompany}</span>
                )}
              </span>

              <button
                type="button"
                onClick={() => setSelectedProductForDetail(rev.productObj)}
                className="font-data text-xs text-red font-bold hover:underline cursor-pointer"
              >
                Inspect Tag &rarr;
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
