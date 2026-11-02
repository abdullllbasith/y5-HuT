import React, { useState, useEffect, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
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
    <section className="relative overflow-hidden bg-paper pt-6 pb-12 sm:pb-16 border-b border-line">
      {/* Background Ambience */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Hero Container: 2-column editorial on paper */}
        <div className="relative rounded-3xl bg-card border border-line p-6 sm:p-10 md:p-14 overflow-hidden shadow-hard">
          
          {/* THE RED SUN DISC: Centered behind device on right, bleeding across background */}
          <div
            className="absolute -right-20 sm:-right-10 -bottom-20 sm:-bottom-10 w-[300px] h-[300px] sm:w-[480px] sm:h-[480px] md:w-[560px] md:h-[560px] rounded-full bg-red/15 blur-2xl pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute right-4 sm:right-12 top-1/2 -translate-y-1/2 w-[240px] h-[240px] sm:w-[380px] sm:h-[380px] md:w-[460px] md:h-[460px] rounded-full bg-red pointer-events-none opacity-90 transition-transform duration-700"
            aria-hidden="true"
          />

          {/* Top Bar inside Card: Model/Series technical pill + Slide dots */}
          <div className="flex items-center justify-between gap-3 relative z-20 pb-4">
            <span className="inline-flex items-center gap-1.5 bg-paper text-ink border border-line text-[10px] sm:text-[11px] font-data font-bold uppercase px-3 py-1 rounded-full tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-red" />
              <span>{currentHero.badge}</span>
            </span>

            {/* Slide Dots / Progress */}
            <div className="flex items-center gap-2" role="tablist" aria-label="Hero slides">
              {resolvedSlides.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveSlide(idx)}
                  role="tab"
                  aria-selected={activeSlide === idx}
                  aria-label={`Show slide ${idx + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer min-w-[24px] min-h-[24px] flex items-center justify-center ${
                    activeSlide === idx ? 'w-8 bg-ink' : 'w-2 bg-line hover:bg-ink-soft'
                  }`}
                >
                  <span className="sr-only">Slide {idx + 1}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content Grid: Left Column Text & Actions, Right Column Device on Red Sun */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10 my-4 sm:my-8">
            
            {/* Left Content (7 cols desktop) */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-left">
              <div className="flex items-center gap-2 text-xs font-data uppercase tracking-widest text-ink-soft">
                <Dot tone="red" size="xs" />
                <span>{currentHero.brand} Sri Lanka Verified Pricing</span>
              </div>

              <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-bold text-ink tracking-tight leading-[1.05]">
                {currentHero.title.replace(currentHero.accentWord, '')}
                <span className="italic font-serif text-red block sm:inline">
                  {currentHero.accentWord}
                </span>
              </h1>

              <p className="font-ui text-xs sm:text-sm md:text-base text-ink-soft leading-relaxed max-w-lg">
                {currentHero.subtitle}
              </p>

              {/* Price Row in Fraunces / JetBrains Mono */}
              {currentHero.liveProduct && (
                <div className="pt-2 space-y-2">
                  <div className="flex items-baseline gap-3">
                    <Price
                      amountLKR={currentHero.priceLKR}
                      amountUSD={currentHero.priceUSD}
                      originalLKR={currentHero.originalLKR}
                      originalUSD={currentHero.originalUSD}
                      currency={currency}
                      size="xl"
                      showDiscountPill={true}
                    />
                    {hasPriceRange(currentHero.liveProduct) && (
                      <span className="font-data text-xs text-ink-soft uppercase font-bold">
                        From Base Storage
                      </span>
                    )}
                  </div>

                  {/* Koko installment line */}
                  {currency === 'LKR' && currentHero.priceLKR > 10000 && (
                    <div className="font-data text-xs text-ink-soft flex items-center gap-2">
                      <span className="bg-paper-sunk px-2 py-0.5 rounded border border-line">
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
              <div className="flex flex-wrap items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    if (currentHero.liveProduct) {
                      setSelectedProductForDetail(currentHero.liveProduct);
                    }
                  }}
                  className="px-6 py-3.5 bg-red text-white hover:bg-red-ink font-ui text-xs sm:text-sm font-bold rounded-full transition-all duration-150 flex items-center gap-2 shadow-hard hover:shadow-hard-hover cursor-pointer min-h-[48px]"
                >
                  <span>{currentHero.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    executeSearch('', currentHero.category);
                    const el = document.getElementById('catalog');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-5 py-3.5 bg-paper hover:bg-paper-sunk text-ink font-ui text-xs sm:text-sm font-bold rounded-full border border-ink transition-colors cursor-pointer min-h-[48px]"
                >
                  View Category Shelf
                </button>
              </div>
            </div>

            {/* Right Product Visual Stage (5 cols desktop) - Device with Spring Swap & Floor Shadow */}
            <div className="lg:col-span-5 flex items-center justify-center p-4 relative min-h-[260px] sm:min-h-[340px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentHero.productId}
                  initial={{ opacity: 0, scale: 0.9, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -15 }}
                  transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                  onClick={() => {
                    if (currentHero.liveProduct) {
                      setSelectedProductForDetail(currentHero.liveProduct);
                    }
                  }}
                  className="relative z-10 flex flex-col items-center justify-center cursor-pointer group"
                >
                  {/* Device Render */}
                  <div className="relative transform transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-1">
                    <ProductImage
                      product={currentHero.liveProduct}
                      colorHex={currentHero.colorHex}
                      className="max-h-56 sm:max-h-72 md:max-h-80 object-contain drop-shadow-2xl"
                    />
                  </div>

                  {/* Soft Floor Shadow */}
                  <div
                    className="w-40 sm:w-56 h-4 bg-ink/25 rounded-full blur-md mt-2 transition-transform duration-300 group-hover:scale-90"
                    aria-hidden="true"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Prev / Next Slide Floating Controls on desktop */}
              <div className="absolute inset-x-0 bottom-0 hidden sm:flex items-center justify-between px-2 text-ink-soft pointer-events-none">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveSlide((prev) => (prev - 1 + resolvedSlides.length) % resolvedSlides.length);
                  }}
                  className="p-2 rounded-full bg-paper/90 border border-line text-ink hover:text-red hover:border-ink transition-colors cursor-pointer pointer-events-auto min-w-[44px] min-h-[44px] flex items-center justify-center shadow-hard-sm"
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
                  className="p-2 rounded-full bg-paper/90 border border-line text-ink hover:text-red hover:border-ink transition-colors cursor-pointer pointer-events-auto min-w-[44px] min-h-[44px] flex items-center justify-center shadow-hard-sm"
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
