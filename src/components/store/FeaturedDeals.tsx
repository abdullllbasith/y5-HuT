import React from 'react';
import { useStore } from '../../context/StoreContext';
import { DeviceGraphic } from '../common/DeviceGraphic';
import { Flame, ArrowRight, ShoppingBag, Sparkles } from 'lucide-react';

export const FeaturedDeals: React.FC = () => {
  const { storefrontProducts: products, setSelectedProductForDetail, addToCart, formatPrice, currency } = useStore();

  const promoProducts = products.filter((p) => p.isFeaturedPromo).slice(0, 4);

  return (
    <section className="py-4 sm:py-6 space-y-4 sm:space-y-6">
      
      {/* Featured Deals Header Strip (Clean, Authentic, No False Urgency) */}
      <div className="bg-gradient-to-r from-[#E11D48] to-[#9F1239] text-white p-4 sm:p-6 rounded-2xl shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <Flame className="w-6 h-6 sm:w-7 sm:h-7 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider bg-black/30 px-2 py-0.5 rounded">
                DEMO SHOWCASE
              </span>
              <span className="text-[11px] sm:text-xs font-semibold text-rose-100">
                Sample Promotional Highlights
              </span>
            </div>
            <h3 className="text-lg sm:text-2xl font-black tracking-tight font-sans mt-0.5 text-white">
              y5Hut Featured Offers
            </h3>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 text-xs text-rose-100 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-xs self-stretch sm:self-auto justify-center sm:justify-start">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Illustrative demo prices &amp; stock</span>
        </div>
      </div>

      {/* Responsive Deal Cards: 1 col on 320px, 2 col on >=360px, 4 col lg */}
      <div className="grid grid-cols-1 min-[360px]:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {promoProducts.map((p) => {
          const installmentThird =
            currency === 'LKR'
              ? Math.round(p.priceLKR / 3)
              : Math.round(p.priceUSD / 3);

          return (
            <article
              key={p.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col justify-between hover:border-slate-300 hover:shadow-md transition-all group"
            >
              {/* Image & Discount */}
              <div className="relative bg-slate-50 p-3 sm:p-4 aspect-[4/3] flex items-center justify-center border-b border-slate-100">
                <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                  {p.promoDiscountPercent && (
                    <span className="text-[9px] font-black uppercase bg-[#E11D48] text-white px-2 py-0.5 rounded shadow-2xs">
                      SAVE {p.promoDiscountPercent}%
                    </span>
                  )}
                  <span className="text-[9px] font-bold bg-amber-400 text-slate-900 px-1.5 py-0.5 rounded">
                    FEATURED
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedProductForDetail(p)}
                  className="w-full h-full flex items-center justify-center focus:outline-none focus-visible:ring-1 focus-visible:ring-[#E11D48] cursor-pointer"
                  aria-label={`View deal for ${p.name}`}
                >
                  <DeviceGraphic
                    deviceType={p.deviceType}
                    colorHex={p.colorOptions[0]?.hex}
                    brand={p.brand}
                    className="max-h-36 sm:max-h-40 group-hover:scale-105 transition-transform duration-300"
                  />
                </button>
              </div>

              {/* Info */}
              <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-2.5">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#E11D48]">
                    {p.brand}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedProductForDetail(p)}
                    className="text-left w-full focus:outline-none cursor-pointer"
                  >
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 mt-0.5 group-hover:text-[#E11D48] transition-colors leading-snug">
                      {p.name}
                    </h4>
                  </button>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                    {p.tagline}
                  </p>
                </div>

                {/* Stock Tag */}
                <div className="flex justify-between items-center text-[11px] text-slate-500">
                  <span>Stock: <strong className="text-slate-800">{p.stock} units</strong></span>
                  <span className="text-emerald-700 font-medium">In Stock</span>
                </div>

                {/* Pricing & CTA */}
                <div className="pt-2 border-t border-slate-100 space-y-1.5">
                  <div className="flex items-baseline gap-1.5 flex-wrap">
                    <span className="text-sm sm:text-base font-black font-mono text-slate-950 tabular-nums">
                      {formatPrice(p.priceLKR, p.priceUSD)}
                    </span>
                    {(p.originalPriceLKR || p.originalPriceUSD) && (
                      <span className="text-[11px] text-slate-400 line-through font-mono tabular-nums">
                        {formatPrice(p.originalPriceLKR || 0, p.originalPriceUSD || 0)}
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">
                    or 3x <strong className="text-slate-700 font-mono">{currency === 'LKR' ? `Rs. ${installmentThird.toLocaleString()}` : `$${installmentThird}`}</strong> with Koko
                  </div>

                  <button
                    type="button"
                    onClick={() => addToCart(p, 1)}
                    className="w-full mt-2 py-2 px-3 bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer min-h-[36px]"
                    aria-label={`Claim deal for ${p.name}`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Claim Deal</span>
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Promotional Double Banners - Responsive */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 pt-2">
        {/* Banner 1: AppleHuT Showcase */}
        <div className="bg-slate-950 text-white rounded-2xl p-5 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-800 relative overflow-hidden">
          <div className="space-y-1.5 sm:space-y-2 text-center sm:text-left z-10">
            <span className="text-[9px] sm:text-[10px] font-black uppercase text-amber-400 tracking-wider">
              DEMO SAMPLE · APPLEHUT
            </span>
            <h4 className="text-base sm:text-xl font-bold font-sans">
              AppleHuT Sample Showcase
            </h4>
            <p className="text-xs text-slate-300 max-w-sm">
              Explore sample iPhones, Apple Watches, AirPods, and accessories configured for this preview.
            </p>
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('catalog-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="mt-1 text-xs font-bold text-white hover:text-amber-400 inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Explore AppleHuT</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0">
            <DeviceGraphic deviceType="phone" colorHex="#CDB19B" />
          </div>
        </div>

        {/* Banner 2: Fast Charging & Ecosystem */}
        <div className="bg-gradient-to-br from-slate-900 to-rose-950 text-white rounded-2xl p-5 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-800 relative overflow-hidden">
          <div className="space-y-1.5 sm:space-y-2 text-center sm:text-left z-10">
            <span className="text-[9px] sm:text-[10px] font-black uppercase text-rose-300 tracking-wider">
              POWER &amp; AUDIO
            </span>
            <h4 className="text-base sm:text-xl font-bold font-sans">
              Anker, Soundpeats &amp; UGREEN
            </h4>
            <p className="text-xs text-slate-300 max-w-sm">
              GaN fast chargers, high-capacity laptop power banks, and Hi-Res wireless audio gear.
            </p>
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('catalog-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="mt-1 text-xs font-bold text-white hover:text-rose-300 inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Shop Accessories</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0">
            <DeviceGraphic deviceType="powerbank" colorHex="#1E293B" />
          </div>
        </div>
      </div>

    </section>
  );
};
