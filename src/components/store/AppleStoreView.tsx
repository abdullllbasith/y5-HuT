import React from 'react';
import { motion } from 'motion/react';
import { useStore } from '../../context/StoreContext';
import { ProductImage } from '../common/ProductImage';
import { CatalogView } from './CatalogView';
import { Dot } from '../ui/Dot';
import { Price } from '../ui/Price';
import { ArrowRight, Sparkles, Shield, Cpu, Zap, Camera } from 'lucide-react';

export const AppleStoreView: React.FC = () => {
  const { storefrontProducts, setSelectedProductForDetail, currency } = useStore();

  const heroAppleProduct =
    storefrontProducts.find((p) => p.id === 'prod-iphone16promax' && !p.archived) ||
    storefrontProducts.find((p) => p.category === 'apple-store' && !p.archived);

  return (
    <div className="w-full bg-night text-paper selection:bg-red selection:text-white">
      {/* 1. Night Chapter Hero: One device per viewport on pale disc */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-14 pb-12 sm:pb-20">
        <div className="relative rounded-3xl bg-night-card border border-paper/10 p-6 sm:p-12 overflow-hidden shadow-2xl">
          
          {/* Pale disc behind device */}
          <div
            className="absolute right-4 sm:right-16 top-1/2 -translate-y-1/2 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-paper/5 blur-xl pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-red/10 blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Left: Editorial Copy */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-left">
              <div className="flex items-center gap-2">
                <Dot tone="red" size="sm" pulse />
                <span className="font-data text-[10px] sm:text-[11px] uppercase font-bold tracking-widest text-red">
                  AppleHuT Chapter · Authentic Flagship Demo
                </span>
              </div>

              <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-paper leading-tight">
                Designed for <br />
                <span className="italic font-serif text-red">Pro Expression.</span>
              </h1>

              <p className="font-ui text-xs sm:text-sm text-paper/70 max-w-md leading-relaxed">
                Titanium enclosure. Camera Control. 48MP Fusion system with A18 Pro. Genuine verified counter inventory.
              </p>

              {/* Price Row */}
              {heroAppleProduct && (
                <div className="pt-2 space-y-2">
                  <div className="flex items-baseline gap-3">
                    <Price
                      amountLKR={heroAppleProduct.priceLKR}
                      amountUSD={heroAppleProduct.priceUSD}
                      originalLKR={heroAppleProduct.originalPriceLKR}
                      originalUSD={heroAppleProduct.originalPriceUSD}
                      currency={currency}
                      size="xl"
                      showDiscountPill={true}
                    />
                  </div>
                  <div className="font-data text-xs text-paper/60">
                    Includes 1-Year Apple Care Demo Warranty · Islandwide Insured Dispatch
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => heroAppleProduct && setSelectedProductForDetail(heroAppleProduct)}
                  className="px-6 py-3.5 bg-red text-white hover:bg-red-ink font-ui text-xs sm:text-sm font-bold rounded-full transition-all flex items-center gap-2 shadow-hard cursor-pointer min-h-[48px]"
                >
                  <span>Inspect Pro Specs</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-2 font-data text-xs text-go px-3 py-1 rounded-full bg-go/10 border border-go/20">
                  <Dot tone="go" size="xs" />
                  <span>Verified Stock Ready</span>
                </div>
              </div>

            </div>

            {/* Right: Device on pale disc with gentle floating animation */}
            <div className="lg:col-span-5 flex items-center justify-center p-4">
              {heroAppleProduct && (
                <div
                  onClick={() => setSelectedProductForDetail(heroAppleProduct)}
                  className="relative group cursor-pointer"
                >
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                  >
                    <ProductImage
                      product={heroAppleProduct}
                      className="max-h-64 sm:max-h-80 md:max-h-96 object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-300"
                    />
                  </motion.div>
                  <motion.div
                    animate={{ scale: [1, 0.9, 1], opacity: [0.5, 0.35, 0.5] }}
                    transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                    className="w-48 h-4 bg-black/60 rounded-full blur-md mx-auto mt-4"
                  />
                </div>
              )}
            </div>

          </div>

          {/* Large Spec Numerals Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 mt-8 border-t border-paper/10 text-left">
            <div>
              <div className="flex items-center gap-1.5 text-paper/60 text-xs mb-1">
                <Cpu className="w-3.5 h-3.5 text-red" />
                <span className="font-data text-[10px] uppercase font-bold">Silicon</span>
              </div>
              <span className="font-display text-2xl sm:text-3xl font-bold text-paper">A18 Pro</span>
              <span className="font-data text-[10px] text-paper/50 block mt-0.5">3nm Generation</span>
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-paper/60 text-xs mb-1">
                <Camera className="w-3.5 h-3.5 text-red" />
                <span className="font-data text-[10px] uppercase font-bold">Fusion Sensor</span>
              </div>
              <span className="font-display text-2xl sm:text-3xl font-bold text-paper">48MP</span>
              <span className="font-data text-[10px] text-paper/50 block mt-0.5">4K120 Dolby Vision</span>
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-paper/60 text-xs mb-1">
                <Zap className="w-3.5 h-3.5 text-red" />
                <span className="font-data text-[10px] uppercase font-bold">Fast Charge</span>
              </div>
              <span className="font-display text-2xl sm:text-3xl font-bold text-paper">50%</span>
              <span className="font-data text-[10px] text-paper/50 block mt-0.5">In ~30 minutes</span>
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-paper/60 text-xs mb-1">
                <Shield className="w-3.5 h-3.5 text-red" />
                <span className="font-data text-[10px] uppercase font-bold">Shield</span>
              </div>
              <span className="font-display text-2xl sm:text-3xl font-bold text-paper">Grade 5</span>
              <span className="font-data text-[10px] text-paper/50 block mt-0.5">Aerospace Titanium</span>
            </div>
          </div>

        </div>
      </div>

      {/* 2. Apple Catalog on Paper Background */}
      <div className="bg-paper text-ink py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CatalogView
            initialCategory="apple-store"
            title="The AppleHuT Counter"
            subtitle="Explore authentic iPhones, Apple Watches, AirPods &amp; MagSafe charging accessories."
          />
        </div>
      </div>
    </div>
  );
};

