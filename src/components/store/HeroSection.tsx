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
        badge: 'APPLEHUT · PRO FLAGSHIP',
        subtitle: 'Grade 5 Titanium with Camera Control & A18 Pro chip. Concept demo preview.',
        deviceType: 'phone' as const,
        colorHex: '#CDB19B',
        brand: 'Apple',
        productId: 'prod-iphone16promax',
        category: 'apple-store' as ProductCategory,
        ctaText: 'Explore iPhone',
      },
      {
        title: 'Anker Prime 200W GaN Ecosystem',
        badge: 'HIGH-OUTPUT CHARGING',
        subtitle: 'Simultaneous rapid power delivery for laptops, smartphones, and wearables.',
        deviceType: 'powerbank' as const,
        colorHex: '#1E293B',
        brand: 'Anker',
        productId: 'prod-anker-prime-20k',
        category: 'power-banks' as ProductCategory,
        ctaText: 'Explore Power',
      },
      {
        title: 'Soundpeats Capsule3 Pro+ Hi-Res',
        badge: 'LOSSLESS AUDIO · ANC',
        subtitle: 'Studio fidelity with -45dB Hybrid ANC, LDAC codec, and 43h extended battery life.',
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
    const list = heroSlideTemplates
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
          deviceType: live.deviceType || template.deviceType,
          priceLKR: live.priceLKR,
          priceUSD: live.priceUSD,
          stock: live.stock,
        };
      })
      .filter(Boolean);

    return list.length > 0 ? (list as NonNullable<(typeof list)[number]>[]) : [];
  }, [products, heroSlideTemplates]);

  // Secondary side tile product
  const sideProduct = useMemo(() => {
    return (
      products.find((p) => p.id === 'prod-applewatch-s10' && !p.archived) ||
      products.find((p) => p.category === 'smartwatches' && !p.archived) ||
      products[0]
    );
  }, [products]);

  // Auto carousel slide every 7s
  useEffect(() => {
    if (resolvedSlides.length <= 1) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % resolvedSlides.length);
    }, 7000);
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

  if (!currentHero) return null;

  return (
    <section className="bg-[#F7F8FA] pt-4 sm:pt-6 pb-8 sm:pb-12 border-b border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        
        {/* Apple & Nothing Inspired Hero Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-stretch">
          
          {/* Main Hero Stage (8 cols desktop) - Spacious white card with 1px hairline border */}
          <div className="lg:col-span-8 bg-white rounded-[18px] border border-[#E5E7EB] p-6 sm:p-10 md:p-12 relative flex flex-col justify-between overflow-hidden shadow-2xs min-h-[340px] sm:min-h-[420px]">
            
            {/* Top Bar inside Stage: Model/Series technical pill + Slide dots */}
            <div className="flex items-center justify-between gap-3 relative z-10">
              <span className="inline-flex items-center gap-1.5 bg-[#F7F8FA] text-[#111827] border border-[#E5E7EB] text-[10px] sm:text-[11px] font-mono font-medium uppercase px-3 py-1 rounded-full tracking-wider">
                <Sparkles className="w-3 h-3 text-[#E11D48]" />
                <span>{currentHero.badge}</span>
              </span>

              {/* Minimal Dot Indicators */}
              <div className="flex items-center gap-1.5" role="tablist" aria-label="Hero slides">
                {resolvedSlides.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveSlide(idx)}
                    role="tab"
                    aria-selected={activeSlide === idx}
                    aria-label={`Show slide ${idx + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                      activeSlide === idx ? 'w-6 bg-[#111827]' : 'w-1.5 bg-[#E5E7EB] hover:bg-slate-400'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Middle Section: Editorial Text + Negative Space Centered Render */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center my-6 sm:my-8 relative z-10">
              
              {/* Left Column: Headlines & Pricing (7 cols) */}
              <div className="md:col-span-7 space-y-3 sm:space-y-4 text-left">
                <div className="text-[11px] font-bold uppercase tracking-widest text-slate-500 font-mono">
                  {currentHero.brand} Sri Lanka Demo
                </div>

                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-bold text-[#111827] tracking-tight leading-[1.1] font-sans">
                  {currentHero.title}
                </h1>

                <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed max-w-sm">
                  {currentHero.subtitle}
                </p>

                {/* Live Dynamic Price with caption LKR */}
                {currentHero.liveProduct && (
                  <div className="pt-2 space-y-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs text-[#6B7280] uppercase font-mono font-medium">LKR</span>
                      <span className="text-2xl sm:text-3xl md:text-4xl font-bold font-sans text-[#111827] tabular-nums tracking-tight">
                        {currentHero.liveProduct.priceLKR.toLocaleString('en-LK')}
                      </span>
                      {hasPriceRange(currentHero.liveProduct) && (
                        <span className="text-[11px] text-[#6B7280] font-normal">Starting price</span>
                      )}
                    </div>

                    <div className="text-[11px] font-medium text-slate-600">
                      {currentHero.liveProduct.stock > 0 ? (
                        <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 inline-block font-mono text-[10px]">
                          In Stock · Koko 3x {Math.round(currentHero.liveProduct.priceLKR / 3).toLocaleString('en-LK')}
                        </span>
                      ) : (
                        <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200 inline-block font-mono text-[10px]">
                          Currently Sold Out
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Generous Negative Space & Product Visual (5 cols) */}
              <div className="md:col-span-5 flex items-center justify-center p-4">
                <button
                  type="button"
                  onClick={() => {
                    if (currentHero.liveProduct) {
                      setSelectedProductForDetail(currentHero.liveProduct);
                    }
                  }}
                  className="group relative flex items-center justify-center focus:outline-none cursor-pointer"
                  aria-label={`View ${currentHero.title}`}
                >
                  <DeviceGraphic
                    deviceType={currentHero.deviceType}
                    colorHex={currentHero.colorHex}
                    brand={currentHero.brand}
                    className="max-h-44 sm:max-h-56 md:max-h-64 drop-shadow-sm group-hover:scale-105 transition-transform duration-300"
                  />
                </button>
              </div>

            </div>

            {/* Bottom Actions Row */}
            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[#E5E7EB] relative z-10">
              <button
                type="button"
                onClick={() => {
                  if (currentHero.liveProduct) {
                    setSelectedProductForDetail(currentHero.liveProduct);
                  }
                }}
                className="px-5 py-2.5 bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-xs min-h-[42px]"
              >
                <span>{currentHero.ctaText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => {
                  executeSearch('', currentHero.category);
                }}
                className="px-4 py-2.5 bg-[#F7F8FA] hover:bg-slate-200/80 text-[#111827] text-xs font-semibold rounded-lg border border-[#E5E7EB] transition-colors cursor-pointer min-h-[42px]"
              >
                View Category
              </button>

              <div className="ml-auto hidden sm:flex items-center gap-1.5 text-slate-400">
                <button
                  type="button"
                  onClick={() =>
                    setActiveSlide((prev) => (prev - 1 + resolvedSlides.length) % resolvedSlides.length)
                  }
                  className="p-1.5 rounded-lg border border-[#E5E7EB] hover:bg-slate-50 hover:text-slate-700 transition-colors cursor-pointer"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSlide((prev) => (prev + 1) % resolvedSlides.length)}
                  className="p-1.5 rounded-lg border border-[#E5E7EB] hover:bg-slate-50 hover:text-slate-700 transition-colors cursor-pointer"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

          {/* Subordinate Companion Spotlight (4 cols desktop) - Bento Tile */}
          <div className="lg:col-span-4 bg-white rounded-[18px] border border-[#E5E7EB] p-6 sm:p-7 flex flex-col justify-between shadow-2xs min-h-[280px]">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono uppercase font-semibold text-slate-500 bg-[#F7F8FA] px-2.5 py-0.5 rounded-full border border-[#E5E7EB]">
                  Spotlight Deal
                </span>
                <span className="text-[10px] font-mono text-emerald-700 font-bold">
                  Demo Sample
                </span>
              </div>

              <h2 className="text-lg font-bold text-[#111827] tracking-tight">
                {sideProduct ? sideProduct.name : 'Wearable Companion'}
              </h2>
              <p className="text-xs text-[#6B7280] mt-1 line-clamp-2">
                {sideProduct ? sideProduct.tagline : 'Advanced biometric health tracking & retina OLED display.'}
              </p>
            </div>

            <div className="my-4 flex items-center justify-center p-2">
              <button
                type="button"
                onClick={() => sideProduct && setSelectedProductForDetail(sideProduct)}
                className="group focus:outline-none cursor-pointer"
                aria-label={sideProduct ? `View ${sideProduct.name}` : 'View spotlight item'}
              >
                <DeviceGraphic
                  deviceType={sideProduct?.deviceType || 'smartwatch'}
                  colorHex={sideProduct?.colorOptions[0]?.hex || '#0F172A'}
                  brand={sideProduct?.brand || 'Apple'}
                  className="max-h-36 sm:max-h-40 group-hover:scale-105 transition-transform duration-300 drop-shadow-sm"
                />
              </button>
            </div>

            <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 block">Starting at</span>
                <span className="text-base font-bold font-sans text-[#111827] tabular-nums">
                  {sideProduct ? formatPrice(sideProduct.priceLKR, sideProduct.priceUSD) : '—'}
                </span>
              </div>

              <button
                type="button"
                onClick={() => sideProduct && setSelectedProductForDetail(sideProduct)}
                className="px-3 py-1.5 text-xs font-semibold text-[#111827] bg-[#F7F8FA] hover:bg-slate-200/70 border border-[#E5E7EB] rounded-lg transition-colors cursor-pointer"
              >
                Details
              </button>
            </div>
          </div>

        </div>

        {/* Category Discovery Strip: Pill Chips with 4px grid and smooth horizontal scroll */}
        <div className="pt-2">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 mb-2.5 font-medium">
            Explore Categories
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none snap-x">
            {quickCategories.map((cat) => {
              const IconComponent = cat.icon;
              return (
                <button
                  key={cat.category}
                  type="button"
                  onClick={() => executeSearch('', cat.category)}
                  className="px-4 py-2.5 bg-white hover:bg-[#F7F8FA] border border-[#E5E7EB] rounded-full text-xs font-semibold text-[#111827] transition-all duration-150 flex items-center gap-2 shrink-0 cursor-pointer snap-start min-h-[44px] shadow-2xs hover:border-slate-300"
                >
                  <IconComponent className="w-3.5 h-3.5 text-[#E11D48]" />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Restrained Trust & Services Bar: 1px hairline border, subtle typography */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          <div className="bg-white p-3.5 rounded-xl border border-[#E5E7EB] flex items-center gap-3">
            <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
            <div className="text-left min-w-0">
              <span className="block text-xs font-semibold text-[#111827] truncate">Islandwide Delivery</span>
              <span className="block text-[10px] text-[#6B7280]">2-5 working days (demo)</span>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-[#E5E7EB] flex items-center gap-3">
            <ShieldCheck className="w-4 h-4 text-[#111827] shrink-0" />
            <div className="text-left min-w-0">
              <span className="block text-xs font-semibold text-[#111827] truncate">Genuine Devices</span>
              <span className="block text-[10px] text-[#6B7280]">Sample concept listings</span>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-[#E5E7EB] flex items-center gap-3">
            <CreditCard className="w-4 h-4 text-[#E11D48] shrink-0" />
            <div className="text-left min-w-0">
              <span className="block text-xs font-semibold text-[#111827] truncate">Flexible Installments</span>
              <span className="block text-[10px] text-[#6B7280]">Koko &amp; Mintpay simulated</span>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-[#E5E7EB] flex items-center gap-3">
            <Headphones className="w-4 h-4 text-slate-700 shrink-0" />
            <div className="text-left min-w-0">
              <span className="block text-xs font-semibold text-[#111827] truncate">Merchant Support</span>
              <span className="block text-[10px] text-[#6B7280]">Direct hotline prototype</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
