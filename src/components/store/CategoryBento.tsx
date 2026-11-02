import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { useStore } from '../../context/StoreContext';
import { ArrowUpRight } from 'lucide-react';
import { Dot } from '../ui/Dot';
import { ProductCategory } from '../../types';

export const CategoryBento: React.FC = () => {
  const { storefrontProducts: products, executeSearch, setActiveView } = useStore();

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    products.forEach((p) => {
      if (!p.archived) {
        map[p.category] = (map[p.category] || 0) + 1;
      }
    });
    return map;
  }, [products]);

  const handleNavigate = (cat: ProductCategory | 'apple-store') => {
    if (cat === 'apple-store') {
      setActiveView('apple-store');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      executeSearch('', cat);
      const el = document.getElementById('catalog');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-6 sm:py-8 space-y-4 text-left">
      {/* Section Header */}
      <div className="flex items-end justify-between border-b border-line pb-3">
        <div>
          <div className="flex items-center gap-1.5 font-data text-[10px] font-bold uppercase tracking-wider text-red">
            <span className="w-2 h-2 rounded-full bg-red inline-block" />
            <span>Departments</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight">
            Shop the Shelves
          </h2>
        </div>
        <span className="font-data text-xs text-ink-soft hidden sm:inline">
          {products.filter((p) => !p.archived).length} Counter Items
        </span>
      </div>

      {/* Bento Grid: 4 cols desktop / 2 cols mobile */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 auto-rows-[140px] sm:auto-rows-[160px]">
        
        {/* 1. AppleHuT Tile (2x2, Night Theme) */}
        <motion.div
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleNavigate('apple-store')}
          className="col-span-2 row-span-2 rounded-2xl bg-night text-paper p-6 sm:p-8 flex flex-col justify-between border border-night-card hover:border-red transition-all duration-200 cursor-pointer group shadow-hard relative overflow-hidden"
        >
          {/* Background Red Disc Accent */}
          <div
            className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-red/15 blur-xl group-hover:scale-125 transition-transform duration-500 pointer-events-none"
            aria-hidden="true"
          />

          <div className="flex items-start justify-between relative z-10">
            <div className="flex items-center gap-2">
              <Dot tone="red" size="sm" pulse />
              <span className="font-data text-[10px] uppercase font-bold tracking-widest text-paper/70">
                Flagship Showcase
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-night-card border border-paper/10 flex items-center justify-center text-paper group-hover:bg-red group-hover:text-white transition-colors">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>

          <div className="relative z-10 space-y-1">
            <span className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight block">
              Apple<span className="italic font-serif text-red">HuT</span>
            </span>
            <p className="font-ui text-xs text-paper/70 line-clamp-2 max-w-sm">
              Genuine iPhones, Apple Watches, AirPods Pro &amp; MagSafe accessories with verified store pricing.
            </p>
            <div className="pt-2 font-data text-xs text-red font-semibold flex items-center gap-2">
              <span>{counts['apple-store'] || 4} Devices on counter</span>
              <span>&rarr;</span>
            </div>
          </div>
        </motion.div>

        {/* 2. Smartphones (2x1, Paper-sunk) */}
        <motion.div
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleNavigate('smartphones')}
          className="col-span-2 row-span-1 rounded-2xl bg-paper-sunk border border-line p-4 sm:p-5 flex flex-col justify-between hover:border-ink hover:shadow-hard-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="font-data text-[10px] uppercase font-bold tracking-wider text-ink-soft">
              01 · Flagships
            </span>
            <span className="font-data text-xs font-bold bg-card border border-line px-2 py-0.5 rounded-full text-ink">
              {counts['smartphones'] || 0} Models
            </span>
          </div>
          <div>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-ink group-hover:text-red transition-colors">
              Mobile Phones
            </h3>
            <p className="font-ui text-xs text-ink-soft truncate">
              Apple, Samsung Galaxy, Xiaomi &amp; Pixel with factory warranties.
            </p>
          </div>
        </motion.div>

        {/* 3. Smartwatches (1x1, Highlighter Wash) */}
        <motion.div
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleNavigate('smartwatches')}
          className="col-span-1 row-span-1 rounded-2xl bg-highlighter/20 border border-line p-4 flex flex-col justify-between hover:border-ink hover:shadow-hard-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="font-data text-[10px] uppercase font-bold text-ink-soft">02 · Wear</span>
            <span className="font-data text-[11px] font-bold text-ink">
              {counts['smartwatches'] || 0}
            </span>
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-ink group-hover:text-red transition-colors">
              Watches
            </h3>
            <span className="font-data text-[10px] text-ink-soft block mt-0.5">Retina AMOLED</span>
          </div>
        </motion.div>

        {/* 4. Audio (1x1, Red Wash) */}
        <motion.div
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleNavigate('audio')}
          className="col-span-1 row-span-1 rounded-2xl bg-red-wash/40 border border-line p-4 flex flex-col justify-between hover:border-ink hover:shadow-hard-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="font-data text-[10px] uppercase font-bold text-ink-soft">03 · Hi-Res</span>
            <span className="font-data text-[11px] font-bold text-ink">
              {counts['audio'] || 0}
            </span>
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-ink group-hover:text-red transition-colors">
              Audio
            </h3>
            <span className="font-data text-[10px] text-red-ink font-semibold block mt-0.5">ANC &amp; LDAC</span>
          </div>
        </motion.div>

        {/* 5. Power Banks (1x2 on Desktop, 2x1 on Mobile, with Giant 20,000 mAh Numeral) */}
        <motion.div
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleNavigate('power-banks')}
          className="col-span-1 sm:col-span-1 md:row-span-2 rounded-2xl bg-card border border-line p-4 sm:p-5 flex flex-col justify-between hover:border-ink hover:shadow-hard-sm transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="flex items-center justify-between relative z-10">
            <span className="font-data text-[10px] uppercase font-bold text-ink-soft">04 · Energy</span>
            <span className="font-data text-xs font-bold text-ink">
              {counts['power-banks'] || 0}
            </span>
          </div>

          <div className="my-2 relative z-10">
            <span className="font-data text-3xl sm:text-4xl font-extrabold text-ink tracking-tighter block leading-none">
              20k
            </span>
            <span className="font-data text-[10px] uppercase font-bold text-ink-soft tracking-widest block mt-1">
              mAh &amp; 140W
            </span>
          </div>

          <div className="relative z-10">
            <h3 className="font-display text-base font-bold text-ink group-hover:text-red transition-colors">
              Power Banks
            </h3>
            <p className="font-ui text-[11px] text-ink-soft mt-0.5 line-clamp-1">
              Anker, Baseus, UGREEN
            </p>
          </div>
        </motion.div>

        {/* 6. Fast Chargers (1x1, with 65W GaN Badge) */}
        <motion.div
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleNavigate('charging')}
          className="col-span-1 row-span-1 rounded-2xl bg-card border border-line p-4 flex flex-col justify-between hover:border-ink hover:shadow-hard-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="font-data text-[10px] uppercase font-bold text-ink-soft">05 · GaN</span>
            <span className="font-data text-[10px] font-bold bg-highlighter text-ink px-1.5 py-0.2 rounded">
              65W-200W
            </span>
          </div>
          <div>
            <h3 className="font-display text-base font-bold text-ink group-hover:text-red transition-colors">
              Fast Chargers
            </h3>
            <span className="font-data text-[10px] text-ink-soft block mt-0.5">
              {counts['charging'] || 0} Models
            </span>
          </div>
        </motion.div>

        {/* 7. Cases & Protection (2x1 on mobile, 2x1 on desktop) */}
        <motion.div
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleNavigate('cases-protection')}
          className="col-span-2 row-span-1 rounded-2xl bg-paper-sunk border border-line p-4 sm:p-5 flex items-center justify-between hover:border-ink hover:shadow-hard-sm transition-all cursor-pointer group"
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="font-data text-[10px] uppercase font-bold text-ink-soft">06 · Armor</span>
              <span className="font-data text-xs text-ink font-semibold">
                {counts['cases-protection'] || 0} Options
              </span>
            </div>
            <h3 className="font-display text-lg sm:text-xl font-bold text-ink group-hover:text-red transition-colors mt-1">
              Cases &amp; Tempered Glass
            </h3>
            <p className="font-ui text-xs text-ink-soft">
              Military-drop protection, MagSafe magnetic rings &amp; camera lens protectors.
            </p>
          </div>

          <div className="w-9 h-9 rounded-full bg-card border border-line flex items-center justify-center shrink-0 group-hover:bg-red group-hover:text-white transition-colors">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </motion.div>

      </div>
    </section>
  );
};

