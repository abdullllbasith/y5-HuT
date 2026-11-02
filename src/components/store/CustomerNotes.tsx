import React from 'react';
import { TESTIMONIALS } from '../../data/mockData';
import { Star, MessageSquare } from 'lucide-react';
import { Dot } from '../ui/Dot';

export const CustomerNotes: React.FC = () => {
  return (
    <section id="customer-reviews" className="py-8 sm:py-12 border-t border-line text-left space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 font-data text-[10px] font-bold uppercase tracking-wider text-red">
            <Dot tone="red" size="xs" />
            <span>Customer Dispatches · Sample Reviews</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight mt-1">
            Notes from the Counter
          </h2>
          <p className="font-ui text-xs text-ink-soft mt-0.5">
            Illustrative customer feedback demonstrating verified shop transactions and rating slips.
          </p>
        </div>

        <div className="font-data text-xs bg-paper-sunk border border-line px-3 py-1.5 rounded-full text-ink-soft shrink-0">
          Average Rating: <strong className="text-ink">4.9 / 5.0</strong>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {TESTIMONIALS.map((t, idx) => (
          <article
            key={idx}
            className="bg-card p-5 sm:p-6 rounded-2xl border border-line shadow-hard-sm flex flex-col justify-between hover:border-ink transition-all relative"
            style={{
              transform: idx === 1 ? 'rotate(-0.5deg)' : idx === 2 ? 'rotate(0.5deg)' : 'none',
            }}
          >
            <div>
              {/* Header: Stars + Chat icon */}
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-line/60">
                <div className="flex items-center gap-1 text-highlighter" aria-label="5 out of 5 stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current text-ink" />
                  ))}
                </div>
                <div className="flex items-center gap-1 font-data text-[10px] text-ink-soft">
                  <MessageSquare className="w-3 h-3 text-red" />
                  <span>Verified Buyer</span>
                </div>
              </div>

              {/* Speech bubble / Quote body */}
              <p className="font-ui text-xs sm:text-sm text-ink leading-relaxed italic">
                &ldquo;{t.quote}&rdquo;
              </p>
            </div>

            {/* Author Footer */}
            <div className="pt-4 mt-4 border-t border-line/60 flex items-center justify-between">
              <div>
                <span className="font-ui font-bold text-xs text-ink block">{t.author}</span>
                <span className="font-data text-[10px] text-ink-soft block">
                  {t.role} · {t.company}
                </span>
              </div>
              <div className="text-right font-data text-[9px] text-ink-soft/80">
                <span className="block">{t.location}</span>
                <span className="block text-red font-medium">{t.verifiedUnits}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

