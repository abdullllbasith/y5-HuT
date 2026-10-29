import React from 'react';
import { TESTIMONIALS } from '../../data/mockData';
import { Quote, Star } from 'lucide-react';

export const Testimonials: React.FC = () => {
  return (
    <section className="py-10 border-t border-slate-200">
      <div className="max-w-3xl mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-[#E11D48]">
          Client Feedback &amp; Enterprise Procurement
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-sans mt-1">
          Why Sri Lanka Chooses y5Hut.lk
        </h2>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
          Trusted by top enterprise corporate IT fleets, creative agencies, and over 50,000 satisfied tech lovers across the island.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TESTIMONIALS.map((t, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all hover:shadow-md"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <Quote className="w-6 h-6 text-[#E11D48] opacity-80" />
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed italic">
                "{t.quote}"
              </p>
            </div>

            <div className="pt-4 mt-6 border-t border-slate-100">
              <div className="font-bold text-xs text-slate-900">
                {t.author}
              </div>
              <div className="text-[11px] text-slate-600">
                {t.role} · {t.company}
              </div>
              <div className="text-[10px] text-slate-400 mt-1 font-mono">
                {t.location} · {t.verifiedUnits}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
