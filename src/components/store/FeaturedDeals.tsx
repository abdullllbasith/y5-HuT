import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { DeviceGraphic } from '../common/DeviceGraphic';
import { Flame, Clock, ArrowRight, ShoppingBag } from 'lucide-react';

export const FeaturedDeals: React.FC = () => {
  const { storefrontProducts: products, setSelectedProductForDetail, addToCart, formatPrice, currency } = useStore();

  // Flash sale countdown timer simulation
  const [timeLeft, setTimeLeft] = useState({
    hours: 11,
    minutes: 42,
    seconds: 18,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const promoProducts = products.filter((p) => p.isFeaturedPromo).slice(0, 4);

  return (
    <section className="py-8 space-y-6">
      
      {/* Flash Sale Header with Live Countdown Timer (y5Hut.lk Signature) */}
      <div className="bg-gradient-to-r from-[#E11D48] to-[#9F1239] text-white p-5 sm:p-6 rounded-2xl shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-center md:text-left">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <Flame className="w-7 h-7 text-amber-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-black/30 px-2 py-0.5 rounded">
                FLASH SALE
              </span>
              <span className="text-xs font-semibold text-rose-200">
                Limited Stock in Colombo
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight font-sans mt-0.5">
              y5Hut Deals of the Day
            </h3>
          </div>
        </div>

        {/* Live Countdown Timer */}
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-rose-200" />
          <span className="text-xs font-bold uppercase tracking-wider text-rose-100 mr-2">
            Ends In:
          </span>
          <div className="flex items-center gap-1.5 font-mono font-black text-sm">
            <div className="bg-black/40 px-2.5 py-1.5 rounded-lg border border-white/10">
              {String(timeLeft.hours).padStart(2, '0')}h
            </div>
            <span>:</span>
            <div className="bg-black/40 px-2.5 py-1.5 rounded-lg border border-white/10">
              {String(timeLeft.minutes).padStart(2, '0')}m
            </div>
            <span>:</span>
            <div className="bg-black/40 px-2.5 py-1.5 rounded-lg border border-white/10 text-amber-300">
              {String(timeLeft.seconds).padStart(2, '0')}s
            </div>
          </div>
        </div>
      </div>

      {/* 4 Flash Deal Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {promoProducts.map((p) => {
          const installmentThird =
            currency === 'LKR'
              ? Math.round(p.priceLKR / 3)
              : Math.round(p.priceUSD / 3);

          return (
            <div
              key={p.id}
              onClick={() => setSelectedProductForDetail(p)}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col justify-between hover:border-slate-300 hover:shadow-lg transition-all group cursor-pointer"
            >
              {/* Image & Discount */}
              <div className="relative bg-slate-50 p-4 aspect-[4/3] flex items-center justify-center border-b border-slate-100">
                <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1">
                  <span className="text-[9px] font-black uppercase bg-[#E11D48] text-white px-2 py-0.5 rounded shadow-xs">
                    SAVE {p.promoDiscountPercent}%
                  </span>
                  <span className="text-[9px] font-bold bg-amber-400 text-slate-900 px-1.5 py-0.5 rounded">
                    HOT DEAL
                  </span>
                </div>

                <div className="w-full h-full flex items-center justify-center">
                  <DeviceGraphic
                    deviceType={p.deviceType}
                    colorHex={p.colorOptions[0]?.hex}
                    brand={p.brand}
                    className="max-h-40"
                  />
                </div>
              </div>

              {/* Info */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#E11D48]">
                    {p.brand}
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 mt-0.5 group-hover:text-[#E11D48] transition-colors leading-snug">
                    {p.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                    {p.tagline}
                  </p>
                </div>

                {/* Stock Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                    <span>Available: <strong>{p.stock}</strong></span>
                    <span className="text-[#E11D48] font-bold">Fast Selling</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#E11D48] h-full rounded-full"
                      style={{ width: `${Math.max(25, 100 - p.stock * 3)}%` }}
                    />
                  </div>
                </div>

                {/* Pricing & Installment */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="flex items-baseline gap-2">
                    <span className="text-base sm:text-lg font-black font-mono text-slate-950">
                      {formatPrice(p.priceLKR, p.priceUSD)}
                    </span>
                    {(p.originalPriceLKR || p.originalPriceUSD) && (
                      <span className="text-xs text-slate-400 line-through font-mono">
                        {formatPrice(p.originalPriceLKR || 0, p.originalPriceUSD || 0)}
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-600 mt-0.5">
                    Pay 3 x{' '}
                    <strong className="text-slate-900 font-mono">
                      {currency === 'LKR' ? `Rs. ${installmentThird.toLocaleString()}` : `$${installmentThird}`}
                    </strong>{' '}
                    via Koko
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(p, 1);
                    }}
                    className="w-full mt-2.5 py-2 px-3 bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Claim Deal</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Promotional Double Banners (y5Hut.lk Signature) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        {/* Banner 1: Apple Authorized */}
        <div className="bg-slate-950 text-white rounded-2xl p-6 sm:p-8 flex items-center justify-between gap-4 border border-slate-800 relative overflow-hidden">
          <div className="space-y-2 max-w-[70%] z-10">
            <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
              DEMO SAMPLE · APPLEHUT
            </span>
            <h4 className="text-lg sm:text-xl font-bold font-sans">
              AppleHuT Sample Apple Lineup
            </h4>
            <p className="text-xs text-slate-300">
              Sample listing only. Approval and warranty details shown in this demo are illustrative.
            </p>
            <button
              onClick={() => {
                const el = document.getElementById('catalog-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="mt-2 text-xs font-bold text-white hover:text-amber-400 flex items-center gap-1 cursor-pointer"
            >
              <span>Explore AppleHuT</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="w-24 h-24 shrink-0">
            <DeviceGraphic deviceType="phone" colorHex="#CDB19B" />
          </div>
        </div>

        {/* Banner 2: Fast Charging & Anker Ecosystem */}
        <div className="bg-gradient-to-br from-slate-900 to-rose-950 text-white rounded-2xl p-6 sm:p-8 flex items-center justify-between gap-4 border border-slate-800 relative overflow-hidden">
          <div className="space-y-2 max-w-[70%] z-10">
            <span className="text-[10px] font-black uppercase text-rose-300 tracking-wider">
              POWER &amp; AUDIO
            </span>
            <h4 className="text-lg sm:text-xl font-bold font-sans">
              Anker, Soundpeats &amp; UGREEN
            </h4>
            <p className="text-xs text-slate-300">
              GaN high-speed chargers, 200W laptop power banks, and Hi-Res wireless audio from Rs. 4,800.
            </p>
            <button
              onClick={() => {
                const el = document.getElementById('catalog-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="mt-2 text-xs font-bold text-white hover:text-rose-300 flex items-center gap-1 cursor-pointer"
            >
              <span>Shop Accessories</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="w-24 h-24 shrink-0">
            <DeviceGraphic deviceType="powerbank" colorHex="#1E293B" />
          </div>
        </div>
      </div>

    </section>
  );
};
