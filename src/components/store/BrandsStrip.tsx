import React from 'react';

export const BrandsStrip: React.FC = () => {
  const topBrands = [
    { name: 'Apple', tag: 'Sample listing' },
    { name: 'Samsung', tag: 'Sample listing' },
    { name: 'Anker', tag: 'Soundcore & GaN' },
    { name: 'Soundpeats', tag: 'Hi-Res Audio' },
    { name: 'UGREEN', tag: 'Nexode Power' },
    { name: 'Xiaomi', tag: 'Smart Lifestyle' },
    { name: 'Baseus', tag: 'Fast Chargers' },
    { name: 'Sony', tag: 'Noise Cancelling' },
  ];

  return (
    <section className="py-8 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Brands in this demo
          </span>
          <span className="text-xs font-semibold text-slate-400">
            Sample content, not a real offer
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {topBrands.map((b, idx) => (
            <div
              key={idx}
              className="p-3 bg-slate-50 hover:bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-all flex flex-col items-center justify-center text-center shadow-2xs group cursor-pointer"
            >
              <span className="font-extrabold text-sm text-slate-800 group-hover:text-[#E11D48] transition-colors font-sans">
                {b.name}
              </span>
              <span className="text-[9px] text-slate-400 uppercase tracking-tight mt-0.5">
                {b.tag}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
