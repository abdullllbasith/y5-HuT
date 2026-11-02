import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Pause, Play } from 'lucide-react';

export const BrandsStrip: React.FC = () => {
  const { executeSearch } = useStore();
  const [isPaused, setIsPaused] = useState(false);

  const topBrands = [
    { name: 'Apple', tag: 'Cupertino' },
    { name: 'Samsung', tag: 'Galaxy Series' },
    { name: 'Anker', tag: 'Soundcore & GaN' },
    { name: 'Soundpeats', tag: 'Hi-Res Audio' },
    { name: 'UGREEN', tag: 'Nexode Power' },
    { name: 'Xiaomi', tag: 'Smart Living' },
    { name: 'Baseus', tag: 'Flash Charge' },
    { name: 'Sony', tag: 'ANC Tech' },
  ];

  return (
    <section className="py-6 sm:py-8 bg-card rounded-2xl border border-line shadow-hard-sm overflow-hidden text-left space-y-4">
      <div className="flex items-center justify-between px-4 sm:px-6 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="font-data text-[10px] font-bold uppercase tracking-wider text-red">
            Verified Brands
          </span>
          <span className="font-data text-[10px] text-ink-soft">
            · Tap brand to inspect shelf
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsPaused(!isPaused)}
          className="font-data text-[10px] text-ink-soft hover:text-ink flex items-center gap-1 cursor-pointer"
          aria-label={isPaused ? 'Resume marquee' : 'Pause marquee'}
        >
          {isPaused ? <Play className="w-3 h-3 text-red" /> : <Pause className="w-3 h-3 text-ink-soft" />}
          <span>{isPaused ? 'Play' : 'Pause'}</span>
        </button>
      </div>

      {/* Marquee Container */}
      <div
        className="w-full overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          className={`flex items-center gap-4 sm:gap-6 whitespace-nowrap ${
            isPaused ? '' : 'animate-marquee'
          }`}
          style={{
            animationPlayState: isPaused ? 'paused' : 'running',
          }}
        >
          {/* Double list for smooth seamless loop */}
          {[...topBrands, ...topBrands].map((b, idx) => (
            <button
              key={`${b.name}-${idx}`}
              type="button"
              onClick={() => {
                executeSearch(b.name);
                const el = document.getElementById('catalog');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3.5 bg-paper hover:bg-paper-sunk rounded-xl border border-line hover:border-ink transition-all flex flex-col items-center justify-center text-center shrink-0 group cursor-pointer min-h-[60px]"
            >
              <span className="font-display text-base sm:text-lg font-bold text-ink group-hover:text-red transition-colors">
                {b.name}
              </span>
              <span className="font-data text-[9px] text-ink-soft uppercase tracking-wider mt-0.5">
                {b.tag}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
