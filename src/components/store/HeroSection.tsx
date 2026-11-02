import React, { useState, useEffect, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { DeviceGraphic } from '../common/DeviceGraphic';
import { ProductImage } from '../common/ProductImage';
import { hasPriceRange } from '../../lib/variants';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { ProductCategory } from '../../types';
import { Dot } from '../ui/Dot';
import { Price } from '../ui/Price';
import { motion, AnimatePresence } from 'motion/react';

export const HeroSection: React.FC = () => {
  const {
    storefrontProducts: products,
    setSelectedProductForDetail,
    executeSearch,
    currency,
  } = useStore();

  const [activeSlide, setActiveSlide] = useState(0);

  const heroSlideTemplates = useMemo(
    () => [
      {
        title: 'Apple iPhone 16 Pro Max',
        badge: 'APPLEHUT · PRO FLAGSHIP',
        accentWord: 'Pro Max',
        subtitle: 'Grade 5 Titanium with Camera Control & A18 Pro chip. Concept demo preview.',
        deviceType: 'phone' as const,
        colorHex: '#CDB19B',
        brand: 'Apple',
        productId: 'prod-iphone16promax',
        category: 'apple-store' as ProductCategory,
        ctaText: 'Inspect Pro Tag',
      },
      {
        title: 'Anker Prime 200W GaN Ecosystem',
        badge: 'HIGH-OUTPUT CHARGING',
        accentWord: 'GaN Power',
        subtitle: 'Simultaneous rapid power delivery for laptops, smartphones, and wearables.',
        deviceType: 'powerbank' as const,
        colorHex: '#1E293B',
        brand: 'Anker',
        productId: 'prod-anker-prime-20k',
        category: 'power-banks' as ProductCategory,
        ctaText: 'Inspect Power Tag',
      },
      {
        title: 'Soundpeats Capsule3 Pro+ Hi-Res',
        badge: 'LOSSLESS AUDIO · ANC',
        accentWord: 'Hi-Res Audio',
        subtitle: 'Studio fidelity with -45dB Hybrid ANC, LDAC codec, and 43h extended battery life.',
        deviceType: 'earbuds' as const,
        colorHex: '#111827',
        brand: 'Soundpeats',
        productId: 'prod-soundpeats-capsule3',
        category: 'audio' as ProductCategory,
        ctaText: 'Inspect Audio Tag',
      },
    ],
    []
  );

  const resolvedSlides = useMemo(() => {
    return heroSlideTemplates
      .map((template) => {
        const live =
          products.find((p) => p.id === template.productId && !p.archived) ||
          products.find((p) => p.category === template.category && !p.archived) ||
          products.find((p) => !p.archived);

        if (!live) return null;

        return {
          ...template,
          liveProduct: live,
          title: live.name,
          subtitle: live.tagline || template.subtitle,
          brand: live.brand,
          colorHex: live.colorOptions[0]?.hex || template.colorHex,
          priceLKR: live.priceLKR,
          priceUSD: live.priceUSD,
          originalLKR: live.originalPriceLKR,
          originalUSD: live.originalPriceUSD,
          stock: live.stock,
        };
      })
      .filter(Boolean) as any[];
  }, [products, heroSlideTemplates]);

  // Auto carousel slide every 8s
  useEffect(() => {
    if (resolvedSlides.length <= 1) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % resolvedSlides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [resolvedSlides.length]);

  const currentHero = resolvedSlides[activeSlide] || resolvedSlides[0];

  if (!currentHero) return null;

  return (
    <section className="relative overflow-hidden bg-paper pt-2 sm:pt-3 pb-4 sm:pb-6 border-b border-line">
      {/* Background Ambience */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Hero Container: Sleek, compact 2-column editorial on paper */}
        <div className="relative rounded-2xl sm:rounded-3xl bg-card border border-line p-4 sm:p-6 md:p-8 overflow-hidden shadow-hard">
          
          {/* THE RED SUN DISC: Sized proportionally so it accentuates the device without filling the screen */}
          <motion.div
            animate={{ scale: [1, 1.06, 1], opacity: [0.12, 0.2, 0.12] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            className="absolute -right-12 -bottom-12 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 rounded-full bg-red/15 blur-2xl pointer-events-none"
            aria-hidden="true"
          />
          <motion.div
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            className="absolute right-4 sm:right-12 top-1/2 -translate-y-1/2 w-40 h-40 sm:w-56 sm:h-56 md:w-68 md:h-68 rounded-full bg-red pointer-events-none opacity-90 transition-transform duration-700"
            aria-hidden="true"
          />

          {/* Top Bar inside Card: Model/Series technical pill + Slide dots */}
          <div className="flex items-center justify-between gap-3 relative z-20 pb-2">
            <span className="inline-flex items-center gap-1.5 bg-paper text-ink border border-line text-[10px] sm:text-[11px] font-data font-bold uppercase px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full tracking-wider">
              <Sparkles className="w-3 h-3 text-red" />
              <span>{currentHero.badge}</span>
            </span>

            {/* Slide Dots / Progress */}
            <div className="flex items-center gap-1.5" role="tablist" aria-label="Hero slides">
              {resolvedSlides.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveSlide(idx)}
                  role="tab"
                  aria-selected={activeSlide === idx}
                  aria-label={`Show slide ${idx + 1}`}
                  className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 cursor-pointer min-w-[20px] min-h-[20px] flex items-center justify-center ${
                    activeSlide === idx ? 'w-6 sm:w-7 bg-ink' : 'w-2 bg-line hover:bg-ink-soft'
                  }`}
                >
                  <span className="sr-only">Slide {idx + 1}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content Grid: Left Column Text & Actions, Right Column Device on Red Sun */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10 my-2 sm:my-3">
            
            {/* Left Content (7 cols desktop) */}
            <div className="lg:col-span-7 space-y-2.5 sm:space-y-4 text-left">
              <div className="flex items-center gap-2 text-[10px] sm:text-xs font-data uppercase tracking-widest text-ink-soft">
                <Dot tone="red" size="xs" />
                <span>{currentHero.brand} Sri Lanka Verified Pricing</span>
              </div>

              {/* Clean Title Rendering with zero concatenation glitches */}
              <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-ink tracking-tight leading-[1.12]">
                {currentHero.title}
              </h1>

              <p className="font-ui text-xs sm:text-sm text-ink-soft leading-relaxed max-w-lg line-clamp-2 sm:line-clamp-none">
                {currentHero.subtitle}
              </p>

              {/* Price Row in Fraunces / JetBrains Mono */}
              {currentHero.liveProduct && (
                <div className="pt-1 space-y-1.5">
                  <div className="flex items-baseline gap-3">
                    <Price
                      amountLKR={currentHero.priceLKR}
                      amountUSD={currentHero.priceUSD}
                      originalLKR={currentHero.originalLKR}
                      originalUSD={currentHero.originalUSD}
                      currency={currency}
                      size="lg"
                      showDiscountPill={true}
                    />
                    {hasPriceRange(currentHero.liveProduct) && (
                      <span className="font-data text-[11px] text-ink-soft uppercase font-bold">
                        From Base Storage
                      </span>
                    )}
                  </div>

                  {/* Koko installment line */}
                  {currency === 'LKR' && currentHero.priceLKR > 10000 && (
                    <div className="font-data text-[11px] text-ink-soft flex items-center gap-2">
                      <span className="bg-paper-sunk px-1.5 py-0.2 rounded border border-line text-[10px]">
                        Koko 3× Split:
                      </span>
                      <strong className="text-ink font-bold">
                        Rs. {Math.round(currentHero.priceLKR / 3).toLocaleString('en-LK')}/mo
                      </strong>
                      <span className="text-[10px] text-go font-semibold">0% Interest</span>
                    </div>
                  )}
                </div>
              )}

              {/* CTA Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (currentHero.liveProduct) {
                      setSelectedProductForDetail(currentHero.liveProduct);
                    }
                  }}
                  className="px-5 py-2.5 bg-red text-white hover:bg-red-ink font-ui text-xs sm:text-sm font-bold rounded-full transition-all duration-150 flex items-center gap-2 shadow-hard hover:shadow-hard-hover cursor-pointer min-h-[42px]"
                >
                  <span>{currentHero.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    executeSearch('', currentHero.category);
                    const el = document.getElementById('catalog');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-4 py-2.5 bg-paper hover:bg-paper-sunk text-ink font-ui text-xs sm:text-sm font-bold rounded-full border border-ink transition-colors cursor-pointer min-h-[42px]"
                >
                  View Category Shelf
                </button>
              </div>
            </div>

            {/* Right Product Visual Stage (5 cols desktop) - Device with Spring Swap & Floor Shadow */}
            <div className="lg:col-span-5 flex items-center justify-center p-2 sm:p-4 relative min-h-[160px] sm:min-h-[200px] md:min-h-[220px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentHero.productId}
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -10 }}
                  transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                  onClick={() => {
                    if (currentHero.liveProduct) {
                      setSelectedProductForDetail(currentHero.liveProduct);
                    }
                  }}
                  className="relative z-10 flex flex-col items-center justify-center cursor-pointer group"
                >
                  {/* Floating Device Render: Sharp, authentic vector SVG or transparent photo */}
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
                    className="relative transform transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-1"
                  >
                    <DeviceGraphic
                      deviceType={currentHero.deviceType}
                      colorHex={currentHero.colorHex}
                      brand={currentHero.brand}
                      className="max-h-44 sm:max-h-52 md:max-h-56 drop-shadow-2xl"
                    />
                  </motion.div>

                  {/* Soft Floor Shadow Breathing with the float */}
                  <motion.div
                    animate={{ scale: [1, 0.9, 1], opacity: [0.25, 0.15, 0.25] }}
                    transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
                    className="w-36 sm:w-48 h-3.5 bg-ink rounded-full blur-md mt-1 transition-transform duration-300"
                    aria-hidden="true"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Prev / Next Slide Floating Controls on desktop */}
              <div className="absolute inset-x-0 bottom-0 hidden sm:flex items-center justify-between px-1 text-ink-soft pointer-events-none">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveSlide((prev) => (prev - 1 + resolvedSlides.length) % resolvedSlides.length);
                  }}
                  className="p-1.5 rounded-full bg-paper/90 border border-line text-ink hover:text-red hover:border-ink transition-colors cursor-pointer pointer-events-auto min-w-[36px] min-h-[36px] flex items-center justify-center shadow-hard-sm"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveSlide((prev) => (prev + 1) % resolvedSlides.length);
                  }}
                  className="p-1.5 rounded-full bg-paper/90 border border-line text-ink hover:text-red hover:border-ink transition-colors cursor-pointer pointer-events-auto min-w-[36px] min-h-[36px] flex items-center justify-center shadow-hard-sm"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
