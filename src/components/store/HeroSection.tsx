import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { DeviceGraphic } from '../common/DeviceGraphic';
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
  Tag,
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { storefrontProducts: products, setSelectedProductForDetail, setActiveView, formatPrice } = useStore();
  const [activeSlide, setActiveSlide] = useState(0);

  const heroSlides = [
    {
      title: 'Apple iPhone 16 Pro Max',
      badge: 'APPLEHUT · OFFICIAL SRI LANKA',
      subtitle: 'Grade 5 Titanium with Camera Control & A18 Pro chip. Genuine Genxt Warranty with TRCSL Approval.',
      priceLKR: 425000,
      priceUSD: 1199,
      kokoInstallment: 'or 3 installments of Rs. 141,666 with Koko',
      bgGradient: 'from-slate-900 via-slate-800 to-rose-950',
      deviceType: 'phone' as const,
      colorHex: '#CDB19B',
      brand: 'Apple',
      productId: 'prod-iphone16promax',
    },
    {
      title: 'Anker Prime & 140W GaN Power',
      badge: 'FAST CHARGING ECOSYSTEM',
      subtitle: 'Charge laptops, smartphones, and smartwatches simultaneously. 18 Months Official Anker Warranty.',
      priceLKR: 42900,
      priceUSD: 129,
      kokoInstallment: 'or 3 installments of Rs. 14,300 with Mintpay',
      bgGradient: 'from-slate-950 via-zinc-900 to-slate-900',
      deviceType: 'powerbank' as const,
      colorHex: '#1E293B',
      brand: 'Anker',
      productId: 'prod-anker-prime-20k',
    },
    {
      title: 'Soundpeats Capsule3 Pro+ Hi-Res',
      badge: 'MEMS ACOUSTIC TRANSDUCERS',
      subtitle: 'Pure studio fidelity with -45dB Hybrid ANC, LDAC lossless codec, and 43 hours battery life.',
      priceLKR: 19990,
      priceUSD: 69,
      kokoInstallment: 'Pay 3 x Rs. 6,663 with Koko',
      bgGradient: 'from-neutral-900 via-rose-950 to-slate-950',
      deviceType: 'earbuds' as const,
      colorHex: '#111827',
      brand: 'Soundpeats',
      productId: 'prod-soundpeats-capsule3',
    },
  ];

  // Auto carousel slide every 5.5s
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const currentHero = heroSlides[activeSlide];

  const quickCategories = [
    { name: 'AppleHuT', icon: Smartphone, category: 'apple-store' as const },
    { name: 'Mobile Phones', icon: Smartphone, category: 'smartphones' as const },
    { name: 'Smartwatches', icon: Watch, category: 'smartwatches' as const },
    { name: 'Earphones & ANC', icon: Headphones, category: 'audio' as const },
    { name: 'Power Banks', icon: BatteryCharging, category: 'power-banks' as const },
    { name: 'Fast Chargers', icon: Zap, category: 'charging' as const },
    { name: 'Impact Cases', icon: Layers, category: 'cases-protection' as const },
  ];

  return (
    <section className="bg-slate-50 pt-4 pb-8 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Top Hero Layout: Main Banner Carousel + 2 Side Promo Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* Main Carousel Banner (8 cols) */}
          <div className="lg:col-span-8 relative rounded-2xl overflow-hidden shadow-md min-h-[380px] sm:min-h-[420px] flex items-center">
            <div
              className={`absolute inset-0 bg-gradient-to-r ${currentHero.bgGradient} transition-all duration-700`}
            />

            {/* Carousel Inner Content */}
            <div className="relative z-10 w-full p-6 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-white">
              <div className="space-y-4 max-w-md text-left">
                <span className="inline-block bg-[#E11D48] text-white text-[10px] font-black uppercase px-2.5 py-1 rounded tracking-wider shadow-xs">
                  {currentHero.badge}
                </span>

                <h2 className="text-2xl sm:text-4xl font-extrabold font-sans tracking-tight text-white leading-tight">
                  {currentHero.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {currentHero.subtitle}
                </p>

                <div className="space-y-1 pt-1">
                  <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
                    {formatPrice(currentHero.priceLKR, currentHero.priceUSD)}
                  </div>
                  <div className="text-[11px] text-amber-300 font-medium">
                    ⚡ {currentHero.kokoInstallment}
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      const p = products.find((prod) => prod.id === currentHero.productId);
                      if (p) setSelectedProductForDetail(p);
                    }}
                    className="px-5 py-2.5 bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <span>Shop Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      const el = document.getElementById('catalog-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer backdrop-blur-xs"
                  >
                    View Collection
                  </button>
                </div>
              </div>

              {/* Graphic Display in Carousel */}
              <div className="w-48 sm:w-64 h-56 flex items-center justify-center shrink-0">
                <DeviceGraphic
                  deviceType={currentHero.deviceType}
                  colorHex={currentHero.colorHex}
                  brand={currentHero.brand}
                  className="max-h-56"
                />
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={() =>
                setActiveSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1))
              }
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center z-20 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveSlide((prev) => (prev + 1) % heroSlides.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center z-20 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
              {heroSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                    activeSlide === idx ? 'bg-[#E11D48] w-6' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* 2 Side Promo Cards (4 cols on desktop) */}
          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4">
            
            {/* Promo Card 1: Apple Watch Series 10 */}
            <div
              onClick={() => {
                const watchProd = products.find((p) => p.id === 'prod-applewatch-s10');
                if (watchProd) setSelectedProductForDetail(watchProd);
              }}
              className="flex-1 bg-white p-5 rounded-2xl border border-slate-200/90 hover:border-slate-300 transition-all shadow-xs flex items-center justify-between group cursor-pointer hover:shadow-md"
            >
              <div className="space-y-1.5 max-w-[60%]">
                <span className="text-[10px] font-black tracking-wider uppercase text-[#E11D48] bg-rose-50 px-2 py-0.5 rounded">
                  NEW ARRIVAL
                </span>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#E11D48] transition-colors leading-snug">
                  Apple Watch Series 10 (46mm)
                </h4>
                <p className="text-xs font-mono font-bold text-slate-950">
                  {formatPrice(145000, 429)}
                </p>
                <span className="text-[10px] text-slate-500 block">
                  3 payments of Rs. 48,333
                </span>
              </div>
              <div className="w-20 h-20 shrink-0">
                <DeviceGraphic deviceType="smartwatch" colorHex="#0A0A0A" />
              </div>
            </div>

            {/* Promo Card 2: Installments with Koko & Mintpay */}
            <div className="flex-1 bg-gradient-to-br from-slate-900 to-slate-950 text-white p-5 rounded-2xl border border-slate-800 shadow-xs flex items-center justify-between">
              <div className="space-y-1.5 max-w-[65%]">
                <span className="text-[10px] font-black uppercase text-amber-400 flex items-center gap-1">
                  <CreditCard className="w-3 h-3" />
                  <span>0% INTEREST BNPL</span>
                </span>
                <h4 className="text-sm font-bold text-white leading-snug">
                  Split in 3 with Koko &amp; Mintpay
                </h4>
                <p className="text-[11px] text-slate-300 leading-tight">
                  Use your Commercial, Sampath, HNB or debit card with zero extra fees.
                </p>
              </div>
              <div className="w-16 h-16 bg-white/10 rounded-xl flex flex-col items-center justify-center p-2 text-center shrink-0 border border-white/10">
                <span className="text-[10px] font-bold text-emerald-400 font-mono">0% APR</span>
                <span className="text-[9px] text-slate-300">3 Months</span>
              </div>
            </div>

          </div>
        </div>

        {/* 4 Trust Badges Strip (y5Hut.lk signature) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-lg bg-red-50 text-[#E11D48] flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-slate-900">Islandwide Delivery</h5>
              <p className="text-[11px] text-slate-500">2-5 Days to Doorstep</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-lg bg-red-50 text-[#E11D48] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-slate-900">100% Genuine Tech</h5>
              <p className="text-[11px] text-slate-500">Official Local Warranty</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-lg bg-red-50 text-[#E11D48] flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-slate-900">Koko &amp; Mintpay</h5>
              <p className="text-[11px] text-slate-500">3 Interest-Free Installments</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-lg bg-red-50 text-[#E11D48] flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-slate-900">Dedicated Support</h5>
              <p className="text-[11px] text-slate-500">+94 117 555 888 / WhatsApp</p>
            </div>
          </div>
        </div>

        {/* Quick Category Circles Icon Strip */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Top Categories
            </span>
            <span className="text-[11px] text-[#E11D48] font-bold cursor-pointer hover:underline">
              View All Categories →
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3">
            {quickCategories.map((c, i) => {
              const IconComp = c.icon;
              return (
                <button
                  key={i}
                  onClick={() => {
                    const el = document.getElementById('catalog-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="flex flex-col items-center gap-2 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-full bg-slate-100 group-hover:bg-[#E11D48] text-slate-700 group-hover:text-white flex items-center justify-center transition-colors shadow-xs">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-800 text-center line-clamp-1">
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
