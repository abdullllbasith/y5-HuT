import React from 'react';
import { TESTIMONIALS } from '../../data/mockData';
import { Quote, Star } from 'lucide-react';

export const Testimonials: React.FC = () => {
  return (
    <section className="py-8 sm:py-12 border-t border-[#E5E7EB]">
      <div className="max-w-2xl mb-6 sm:mb-8 text-left">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 bg-[#F7F8FA] px-2.5 py-0.5 rounded-full border border-[#E5E7EB]">
          Demo · Sample Experience
        </span>
        <h2 className="text-xl sm:text-2xl font-bold text-[#111827] font-sans mt-2 tracking-tight">
          Client Feedback Demonstrations
        </h2>
        <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">
          Illustrative reviews showing verified purchase layouts and merchant satisfaction scores.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {TESTIMONIALS.map((t, idx) => (
          <article
            key={idx}
            className="bg-white p-5 sm:p-6 rounded-[18px] border border-[#E5E7EB] shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-all text-left"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <Quote className="w-5 h-5 text-[#E11D48] opacity-80" />
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
              </div>

              <p className="text-xs text-[#111827] leading-relaxed italic">
                &ldquo;{t.quote}&rdquo;
              </p>
            </div>

            <div className="pt-4 mt-5 border-t border-[#E5E7EB]">
              <div className="font-bold text-xs text-[#111827]">
                {t.author}
              </div>
              <div className="text-[11px] text-[#6B7280]">
                {t.role} · {t.company}
              </div>
              <div className="text-[10px] text-slate-400 mt-1 font-mono">
                {t.location} · {t.verifiedUnits}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
