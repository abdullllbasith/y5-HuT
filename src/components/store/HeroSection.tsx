import React, { useState, useEffect, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { DeviceGraphic } from '../common/DeviceGraphic';
import { hasPriceRange } from '../../lib/variants';
import {
  ArrowRight,
  Truck,
  ShieldCheck,
  CreditCard,
  Headphones,
  ChevronLeft,
  ChevronRight,
  Smartphone,
  Watch,
  BatteryCharging,
  Zap,
  Layers,
  Sparkles,
} from 'lucide-react';
import { ProductCategory } from '../../types';

export const HeroSection: React.FC = () => {
  const {
    storefrontProducts: products,
    setSelectedProductForDetail,
    formatPrice,
    executeSearch,
  } = useStore();

  const [activeSlide, setActiveSlide] = useState(0);

  const heroSlideTemplates = useMemo(
    () => [
      {
        title: 'Apple iPhone 16 Pro Max',
        badge: 'APPLEHUT · FLAGSHIP SHOWCASE',
        subtitle: 'Grade 5 Titanium with Camera Control & A18 Pro chip. Concept demo preview.',
        bgGradient: 'from-slate-900 via-slate-800 to-rose-950',
        deviceType: 'phone' as const,
        colorHex: '#CDB19B',
        brand: 'Apple',
        productId: 'prod-iphone16promax',
        category: 'apple-store' as ProductCategory,
        ctaText: 'Explore Flagship',
      },
      {
        title: 'Anker Prime 200W GaN Ecosystem',
        badge: 'FAST CHARGING ECOSYSTEM',
        subtitle: 'Simultaneous high-speed power delivery for laptops, smartphones, and wearables.',
        bgGradient: 'from-slate-950 via-zinc-900 to-slate-900',
        deviceType: 'powerbank' as const,
        colorHex: '#1E293B',
        brand: 'Anker',
        productId: 'prod-anker-prime-20k',
        category: 'power-banks' as ProductCategory,
        ctaText: 'Explore Charging',
      },
      {
        title: 'Soundpeats Capsule3 Pro+ Hi-Res',
        badge: 'MEMS ACOUSTIC TRANSDUCERS',
        subtitle: 'Pure studio fidelity with -45dB Hybrid ANC, LDAC lossless codec, and 43h playback.',
        bgGradient: 'from-neutral-900 via-rose-950 to-slate-950',
        deviceType: 'earbuds' as const,
        colorHex: '#111827',
        brand: 'Soundpeats',
        productId: 'prod-soundpeats-capsule3',
        category: 'audio' as ProductCategory,
        ctaText: 'Explore Audio',
      },
    ],
    []
  );

  // Dynamically resolve live products from storefrontProducts to ensure prices, stock, and status are never stale
  const resolvedSlides = useMemo(() => {
    const list = heroSlideTemplates.map((template) => {
      // Find matching active product or fallback to a category-matched active item
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
        deviceType: live.deviceType || template.deviceType,
        priceLKR: live.priceLKR,
        priceUSD: live.priceUSD,
        stock: live.stock,
      };
    }).filter(Boolean);

    return list.length > 0 ? (list as NonNullable<(typeof list)[number]>[]) : [];
  }, [products, heroSlideTemplates]);

  // Dynamic promo watch product
  const watchProd = useMemo(() => {
    return (
      products.find((p) => p.id === 'prod-applewatch-s10' && !p.archived) ||
      products.find((p) => p.category === 'smartwatches' && !p.archived) ||
      products[0]
    );
  }, [products]);

  // Auto carousel slide every 6s
  useEffect(() => {
    if (resolvedSlides.length <= 1) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % resolvedSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [resolvedSlides.length]);

  const currentHero = resolvedSlides[activeSlide] || resolvedSlides[0];

  const quickCategories = [
    { name: 'AppleHuT', icon: Smartphone, category: 'apple-store' as const },
    { name: 'Phones', icon: Smartphone, category: 'smartphones' as const },
    { name: 'Watches', icon: Watch, category: 'smartwatches' as const },
    { name: 'Audio', icon: Headphones, category: 'audio' as const },
    { name: 'Power', icon: BatteryCharging, category: 'power-banks' as const },
    { name: 'Chargers', icon: Zap, category: 'charging' as const },
    { name: 'Cases', icon: Layers, category: 'cases-protection' as const },
  ];

  if (!currentHero) {
    return null;
  }

  return (
    <section className="bg-slate-50 pt-3 sm:pt-4 pb-6 sm:pb-8 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">
        
        {/* Top Hero Layout: Main Banner Carousel + Subordinate Promo Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4">
          
          {/* Main Carousel Banner (8 cols desktop) - Dynamic Live Data */}
          <div className="lg:col-span-8 relative rounded-2xl overflow-hidden shadow-md flex items-center min-h-[300px] sm:min-h-[360px] md:min-h-[390px]">
            <div
              className={`absolute inset-0 bg-gradient-to-r ${currentHero.bgGradient} transition-all duration-700`}
            />

            {/* Carousel Inner Content */}
            <div className="relative z-10 w-full p-4 sm:p-7 md:p-9 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 text-white">
              
              <div className="space-y-2.5 sm:space-y-3.5 max-w-md text-center sm:text-left">
                <span className="inline-flex items-center gap-1 bg-[#E11D48] text-white text-[9px] sm:text-[10px] font-black uppercase px-2.5 py-1 rounded tracking-wider shadow-xs">
                  <Sparkles className="w-3 h-3" />
                  <span>{currentHero.badge}</span>
                </span>

                <h1 className="text-xl sm:text-3xl md:text-4xl font-extrabold font-sans tracking-tight text-white leading-tight">
                  {currentHero.title}
                </h1>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-2 sm:line-clamp-none">
                  {currentHero.subtitle}
                </p>

                {/* Dynamic Live Price & Stock Display */}
                {currentHero.liveProduct && (
                  <div className="space-y-0.5 pt-0.5 sm:pt-1">
                    <div className="text-xl sm:text-2xl md:text-3xl font-black font-mono text-white tabular-nums">
                      {hasPriceRange(currentHero.liveProduct) && (
                        <span className="text-xs sm:text-sm font-normal text-slate-300 mr-1.5">From</span>
                      )}
                      {formatPrice(currentHero.liveProduct.priceLKR, currentHero.liveProduct.priceUSD)}
                    </div>
                    <div className="text-[10px] sm:text-[11px] text-amber-300 font-medium">
                      {currentHero.liveProduct.stock > 0 ? (
                        <>⚡ 3x {formatPrice(Math.round(currentHero.liveProduct.priceLKR / 3), Math.round(currentHero.liveProduct.priceUSD / 3))} with Koko (Demo)</>
                      ) : (
                        <span className="text-rose-300 font-bold">Currently Sold Out</span>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-center sm:justify-start gap-2.5 pt-1 sm:pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (currentHero.liveProduct) {
                        setSelectedProductForDetail(currentHero.liveProduct);
                      }
                    }}
                    className="px-4 sm:px-5 py-2 sm:py-2.5 bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-md min-h-[38px]"
                  >
                    <span>{currentHero.ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      executeSearch('', currentHero.category);
                    }}
                    className="px-3.5 sm:px-4 py-2 sm:py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer backdrop-blur-xs min-h-[38px]"
                  >
                    View All
                  </button>
                </div>
              </div>

              {/* Restrained Graphic Display */}
              <div className="w-32 sm:w-48 md:w-56 h-32 sm:h-48 md:h-56 flex items-center justify-center shrink-0">
                <DeviceGraphic
                  deviceType={currentHero.deviceType}
                  colorHex={currentHero.colorHex}
                  brand={currentHero.brand}
                  className="max-h-32 sm:max-h-48 md:max-h-56"
                />
              </div>
            </div>

            {/* Navigation Arrows */}
            {resolvedSlides.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setActiveSlide((prev) => (prev === 0 ? resolvedSlides.length - 1 : prev - 1))
                  }
                  className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-7 sm:w-8 h-7 sm:h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center z-20 transition-colors cursor-pointer"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSlide((prev) => (prev + 1) % resolvedSlides.length)}
                  className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-7 sm:w-8 h-7 sm:h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center z-20 transition-colors cursor-pointer"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Dots */}
                <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
                  {resolvedSlides.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveSlide(idx)}
                      className={`h-1.5 sm:h-2 rounded-full transition-all cursor-pointer ${
                        activeSlide === idx ? 'bg-[#E11D48] w-5 sm:w-6' : 'bg-white/50 w-1.5 sm:w-2'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Subordinate Side Promo Cards (4 cols desktop, stacked/side-by-side on mobile) */}
          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4">
            
            {/* Promo Card 1: Dynamic Smartwatch Card */}
            {watchProd && (
              <div
                onClick={() => setSelectedProductForDetail(watchProd)}
                className="bg-white p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200/90 hover:border-slate-300 transition-all shadow-2xs flex items-center justify-between group cursor-pointer hover:shadow-xs"
              >
                <div className="space-y-1 max-w-[62%]">
                  <span className="text-[9px] font-black tracking-wider uppercase text-[#E11D48] bg-rose-50 px-2 py-0.5 rounded">
                    FEATURED WEARABLE
                  </span>
                  <h2 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#E11D48] transition-colors leading-snug">
                    {watchProd.name}
                  </h2>
                  <p className="text-xs font-mono font-bold text-slate-950 tabular-nums">
                    {formatPrice(watchProd.priceLKR, watchProd.priceUSD)}
                  </p>
                  <span className="text-[10px] font-semibold text-[#E11D48] inline-flex items-center gap-1 mt-0.5">
                    {watchProd.stock > 0 ? 'View specs & stock →' : 'Sold Out'}
                  </span>
                </div>
                <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0">
                  <DeviceGraphic deviceType={watchProd.deviceType} colorHex="#0A0A0A" />
                </div>
              </div>
            )}

            {/* Promo Card 2: Installments info (Transparent Demo Plan) */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-800 shadow-2xs flex items-center justify-between">
              <div className="space-y-1 max-w-[65%]">
                <span className="text-[9px] font-black uppercase text-amber-400 flex items-center gap-1">
                  <CreditCard className="w-3 h-3" />
                  <span>DEMO BNPL PREVIEW</span>
                </span>
                <h2 className="text-xs sm:text-sm font-bold text-white leading-snug">
                  0% Installment Simulator
                </h2>
                <p className="text-[10px] sm:text-[11px] text-slate-300 leading-tight">
                  Simulated 3-month split payment breakdown for demo products.
                </p>
              </div>
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/10 rounded-xl flex flex-col items-center justify-center p-1.5 text-center shrink-0 border border-white/10">
                <span className="text-[10px] font-bold text-emerald-400 font-mono">0% APR</span>
                <span className="text-[9px] text-slate-300">3 Months</span>
              </div>
            </div>

          </div>
        </div>

        {/* 4 Trust Badges Strip (y5Hut.lk signature) - Compact on Mobile */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 bg-white p-2.5 sm:p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-red-50 text-[#E11D48] flex items-center justify-center shrink-0">
              <Truck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-[11px] sm:text-xs font-bold text-slate-900 truncate">Islandwide Delivery</h2>
              <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">2-5 Days to Doorstep</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-red-50 text-[#E11D48] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-[11px] sm:text-xs font-bold text-slate-900 truncate">Demo Showcase</h2>
              <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">Sample Tech Catalogue</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-red-50 text-[#E11D48] flex items-center justify-center shrink-0">
              <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-[11px] sm:text-xs font-bold text-slate-900 truncate">Installment Plans</h2>
              <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">3-Month Preview</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-red-50 text-[#E11D48] flex items-center justify-center shrink-0">
              <Headphones className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-[11px] sm:text-xs font-bold text-slate-900 truncate">Dedicated Hotline</h2>
              <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">+94 11 000 0000</p>
            </div>
          </div>
        </div>

        {/* Quick Category Icons Strip - Mobile Scrollable Snap & Connected to Filter */}
        <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-2.5 px-1">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-900">
              Top Categories
            </span>
            <button
              type="button"
              onClick={() => {
                executeSearch('', 'all');
              }}
              className="text-[11px] text-[#E11D48] font-bold cursor-pointer hover:underline"
            >
              View All →
            </button>
          </div>

          <div className="flex overflow-x-auto gap-2 sm:gap-3 pb-1 scrollbar-none snap-x">
            {quickCategories.map((c, i) => {
              const IconComp = c.icon;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    executeSearch('', c.category);
                  }}
                  className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-slate-50 transition-colors group cursor-pointer shrink-0 w-20 sm:w-24 snap-start"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-100 group-hover:bg-[#E11D48] text-slate-700 group-hover:text-white flex items-center justify-center transition-colors shadow-2xs">
                    <IconComp className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 text-center truncate w-full">
                    {c.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
