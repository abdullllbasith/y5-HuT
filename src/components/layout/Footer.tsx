import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { MessageCircle, MapPin, Phone, Shield, ArrowUpRight, Copy, Check, X } from 'lucide-react';
import { getDemoWhatsAppNumber, buildWhatsAppEnquiryText, buildWhatsAppUrl } from '../../lib/whatsapp';
import { Button } from '../ui/Button';

export const Footer: React.FC = () => {
  const { setActiveView } = useStore();
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const whatsappNumber = getDemoWhatsAppNumber();
  const sampleEnquiry = buildWhatsAppEnquiryText({
    productName: 'y5Hut General Counter Enquiry',
    brand: 'Colombo Storefront',
    priceLKR: 0,
    priceUSD: 0,
    currency: 'LKR',
    stock: 1,
  });

  const handleWhatsAppClick = () => {
    if (whatsappNumber) {
      window.open(buildWhatsAppUrl(whatsappNumber, sampleEnquiry), '_blank', 'noopener,noreferrer');
    } else {
      setShowWhatsAppModal(true);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(sampleEnquiry);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer className="bg-night text-paper border-t-[1.5px] border-ink overflow-hidden pb-safe relative select-none">
      {/* 1. Counter Concierge WhatsApp Strip (Replaces Newsletter) */}
      <div className="border-b border-line/20 py-8 sm:py-10 bg-night-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left space-y-1.5 max-w-xl">
            <span className="font-data text-[10px] uppercase font-bold text-red tracking-widest block">
              Direct Counter Support
            </span>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-paper">
              Need Instant Price Confirmation or Availability?
            </h3>
            <p className="font-ui text-xs text-paper-sunk/80 leading-relaxed">
              Skip forms. Chat directly with the Colombo retail counter for daily price verifications, storage availability, and trade-in estimates.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button
              variant="primary"
              size="md"
              onClick={handleWhatsAppClick}
              leftIcon={<MessageCircle className="w-4 h-4 fill-white text-transparent" />}
            >
              Ask on WhatsApp (Demo)
            </Button>
            <button
              type="button"
              onClick={() => setActiveView('admin')}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full border border-line text-xs font-data text-paper-sunk hover:text-paper hover:border-paper transition-colors cursor-pointer min-h-[44px]"
            >
              <Shield className="w-3.5 h-3.5 text-red" />
              <span>Owner Console</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Link Columns & Shop Data */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
          {/* Col 1: Shop & Counter Data */}
          <div className="space-y-3.5">
            <div className="font-display font-bold text-2xl tracking-tight text-paper">
              y5<span className="text-red">HuT</span>
              <span className="text-xs font-data font-normal text-paper-sunk ml-1">.lk</span>
            </div>
            <p className="font-ui text-xs text-paper-sunk/80 leading-relaxed">
              Sri Lanka's flagship gadget counter and showcase store. High-performance smartphones, genuine audio gear, and smart accessories.
            </p>
            <div className="space-y-2 font-data text-xs text-paper-sunk/90 pt-1">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-red shrink-0 mt-0.5" />
                <span>No. 45/2, Galle Road, Colombo 04, Sri Lanka</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-red shrink-0" />
                <span>Hotline: +94 11 000 0000 (Sample)</span>
              </div>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div className="space-y-3 font-data">
            <h4 className="text-xs font-bold uppercase tracking-wider text-paper">
              Catalog Chapters
            </h4>
            <ul className="space-y-2 text-xs text-paper-sunk/80">
              <li>
                <button
                  type="button"
                  onClick={() => setActiveView('apple-store')}
                  className="hover:text-red transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>AppleHuT Showcase</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveView('deals')}
                  className="hover:text-red transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>Today's Price Drops</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveView('store')}
                  className="hover:text-paper transition-colors cursor-pointer"
                >
                  Smartphones &amp; Flagships
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveView('store')}
                  className="hover:text-paper transition-colors cursor-pointer"
                >
                  Fast GaN Charging Ecosystem
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveView('store')}
                  className="hover:text-paper transition-colors cursor-pointer"
                >
                  High-Capacity Power Banks
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care & Policies */}
          <div className="space-y-3 font-data">
            <h4 className="text-xs font-bold uppercase tracking-wider text-paper">
              Counter Policies
            </h4>
            <ul className="space-y-2 text-xs text-paper-sunk/80">
              <li>
                <span className="hover:text-paper transition-colors cursor-pointer">
                  1-Year Sample Warranty Notes
                </span>
              </li>
              <li>
                <span className="hover:text-paper transition-colors cursor-pointer">
                  Koko 3-Month 0% Calculator
                </span>
              </li>
              <li>
                <span className="hover:text-paper transition-colors cursor-pointer">
                  Islandwide Courier Guidelines
                </span>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveView('reviews')}
                  className="hover:text-paper transition-colors cursor-pointer"
                >
                  Customer Testimonials
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Demo Disclosures */}
          <div className="space-y-3">
            <h4 className="font-data text-xs font-bold uppercase tracking-wider text-paper">
              Demo Environment
            </h4>
            <div className="p-3.5 rounded-xl bg-night-card border border-line text-xs font-ui space-y-2">
              <span className="font-data text-[10px] font-bold uppercase text-red block">
                Concept Demonstration
              </span>
              <p className="text-paper-sunk/80 leading-relaxed text-[11px]">
                Built for pitch presentation. Prices, variants, and stock changes persist in this local browser session.
              </p>
            </div>
          </div>
        </div>

        {/* Payment Marks Strip */}
        <div className="border-t border-line/20 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-data text-xs text-paper-sunk/70">
          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
            <span className="text-[10px] uppercase font-bold text-paper-sunk mr-1">
              Simulated Payment Methods:
            </span>
            {['Koko (3×)', 'Mintpay', 'Visa', 'Mastercard', 'Cash on Delivery'].map((m) => (
              <span
                key={m}
                className="px-2 py-0.5 rounded bg-night-card border border-line text-[10px] text-paper-sunk"
              >
                {m}
              </span>
            ))}
          </div>

          <p className="text-[10px] uppercase tracking-wider text-center sm:text-right">
            © {new Date().getFullYear()} y5Hut.lk · Colombo Retail Prototype
          </p>
        </div>
      </div>

      {/* 3. Giant Cropped Red Wordmark Bleeding off the Bottom Edge */}
      <div
        className="overflow-hidden select-none pointer-events-none -mb-6 sm:-mb-12 md:-mb-16 opacity-85"
        aria-hidden="true"
      >
        <div className="font-display font-extrabold text-[19vw] leading-none text-red tracking-tighter text-center whitespace-nowrap">
          y5HuT.lk
        </div>
      </div>

      {/* WhatsApp Enquiry Preview Modal */}
      {showWhatsAppModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs text-ink">
          <div className="bg-card border-[1.5px] border-ink rounded-2xl shadow-sheet max-w-md w-full p-5 space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-go" />
                <h3 className="font-display font-bold text-base text-ink">WhatsApp Enquiry Preview</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowWhatsAppModal(false)}
                className="w-8 h-8 rounded-full border border-line flex items-center justify-center text-ink-soft hover:text-ink cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-paper p-3.5 rounded-xl border border-line font-data text-xs text-ink space-y-2 whitespace-pre-line select-text max-h-56 overflow-y-auto">
              {sampleEnquiry}
            </div>

            <div className="bg-highlighter/30 border border-ink/20 p-2.5 rounded-lg text-[11px] font-ui text-ink-soft">
              <strong>Demo Notice:</strong> No WhatsApp recipient configured for live sending. In production, setting <code className="font-data">VITE_DEMO_WHATSAPP_NUMBER</code> opens WhatsApp directly.
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={handleCopy}
                className="px-4 py-2 rounded-full border border-ink bg-card text-xs font-bold font-ui text-ink hover:bg-paper-sunk flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-go" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied Message!' : 'Copy Enquiry Text'}</span>
              </button>
              <button
                type="button"
                onClick={() => setShowWhatsAppModal(false)}
                className="px-4 py-2 rounded-full bg-ink text-paper text-xs font-bold font-ui hover:bg-ink/80 cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
