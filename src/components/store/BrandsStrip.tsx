import React from 'react';
import { useStore } from '../../context/StoreContext';

export const BrandsStrip: React.FC = () => {
  const { executeSearch } = useStore();

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
    <section className="py-6 sm:py-8 bg-white rounded-[18px] border border-[#E5E7EB] p-4 sm:p-6 shadow-2xs">
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-1">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
            Demo Brand Directory
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            Curated Sample Inventory
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-3">
          {topBrands.map((b, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                executeSearch(b.name);
              }}
              className="p-3 bg-[#F7F8FA] hover:bg-slate-100 rounded-xl border border-[#E5E7EB] hover:border-slate-300 transition-all flex flex-col items-center justify-center text-center group cursor-pointer shadow-2xs min-h-[56px]"
            >
              <span className="font-bold text-xs sm:text-sm text-[#111827] group-hover:text-[#E11D48] transition-colors font-sans">
                {b.name}
              </span>
              <span className="text-[9px] font-mono text-slate-400 uppercase tracking-tight mt-0.5 truncate w-full">
                {b.tag}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
