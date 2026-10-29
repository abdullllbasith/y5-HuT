import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Phone, Mail, MapPin, CheckCircle, Send } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveView } = useStore();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterSubscribed(true);
    setTimeout(() => {
      setNewsletterSubscribed(false);
      setNewsletterEmail('');
    }, 2500);
  };

  return (
    <footer className="bg-slate-900 text-white border-t border-slate-800">
      
      {/* Newsletter Strip (y5Hut.lk Signature) */}
      <div className="border-b border-slate-800 py-8 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left space-y-1">
            <h4 className="text-base sm:text-lg font-bold text-white font-sans">
              Subscribe to the y5Hut.lk Tech Newsletter
            </h4>
            <p className="text-xs text-slate-400">
              Get notified of flash discounts, new flagship releases, and app-exclusive coupon codes.
            </p>
          </div>

          <form onSubmit={handleNewsletterSubmit} className="flex items-center w-full md:w-96">
            <input
              type="email"
              required
              placeholder="Enter your email address..."
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="w-full text-xs px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-l-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-[#E11D48]"
            />
            <button
              type="submit"
              className="bg-[#E11D48] hover:bg-[#BE123C] text-white px-5 py-2.5 text-xs font-bold rounded-r-lg transition-colors cursor-pointer shrink-0 flex items-center gap-1.5"
            >
              <span>{newsletterSubscribed ? 'Subscribed!' : 'Subscribe'}</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* 4 Main Footer Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 sm:gap-10">
          
          {/* Column 1: y5Hut.lk Brand & Contact Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <img
                src="/assets/aistudio/image_f443f98e.jpeg"
                alt="y5Hut Logo"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-[#E11D48]/30"
              />
              <span className="text-2xl font-black tracking-tight text-white font-sans">
                y5<span className="text-[#E11D48]">Hut</span>
                <span className="text-xs font-normal text-slate-400 ml-1">.lk</span>
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              y5Hut.lk is Sri Lanka's leading online tech store and genuine gadget destination featuring AppleHuT. This is a concept demo: warranty, delivery and installment details are sample content.
            </p>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#E11D48] shrink-0 mt-0.5" />
                <span>No. 45/2, Galle Road, Colombo 04, Sri Lanka</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#E11D48] shrink-0" />
                <a href="tel:+94110000000" className="hover:text-white font-semibold">
                  +94 11 000 0000 (sample) (Hotline)
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#E11D48] shrink-0" />
                <a href="mailto:support@y5hut.lk" className="hover:text-white">
                  support@y5hut.lk
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Popular Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Shop Categories
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => {
                    setActiveView('apple-store');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  AppleHuT (sample)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveView('store');
                    const el = document.getElementById('catalog-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Mobile Phones &amp; Flagships
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveView('store');
                    const el = document.getElementById('catalog-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Smartwatches &amp; Wearables
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveView('store');
                    const el = document.getElementById('catalog-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Earphones &amp; ANC Audio
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveView('store');
                    const el = document.getElementById('catalog-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Anker &amp; UGREEN Fast Power Banks
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveView('store');
                    const el = document.getElementById('catalog-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Cases &amp; Tempered Glass Shields
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care & Services */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Customer Service
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => setActiveView('admin')} className="hover:text-white transition-colors">
                  Track Your Delivery Waybill
                </button>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Warranty Claim Procedures
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Returns &amp; Replacement Policy
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Koko &amp; Mintpay 0% Installment Guide
                </span>
              </li>
              <li>
                <button onClick={() => setActiveView('admin')} className="hover:text-white transition-colors">
                  Corporate B2B Procurement Desk
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Guarantees & Sri Lanka Compliance */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Trust &amp; Compliance
            </h4>
            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <CheckCircle className="w-4 h-4" />
                <span>Sample device listings</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                All mobile smartphones imported into Sri Lanka are legally registered with the Telecommunications Regulatory Commission.
              </p>
            </div>

            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 text-rose-400 font-bold">
                <CheckCircle className="w-4 h-4" />
                <span>Sample warranty info (demo)</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                Illustrative text only. No real service or authorization is claimed.
              </p>
            </div>
          </div>

        </div>

        {/* Payment Partners & Badges Strip */}
        <div className="border-t border-slate-800 mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start text-xs font-bold">
            <span className="text-slate-400 mr-2 text-[11px]">Accepted Payment Methods:</span>
            <span className="bg-slate-800 px-2 py-1 rounded text-white border border-slate-700">Koko (3x)</span>
            <span className="bg-slate-800 px-2 py-1 rounded text-white border border-slate-700">Mintpay</span>
            <span className="bg-slate-800 px-2 py-1 rounded text-white border border-slate-700">Visa</span>
            <span className="bg-slate-800 px-2 py-1 rounded text-white border border-slate-700">Mastercard</span>
            <span className="bg-slate-800 px-2 py-1 rounded text-white border border-slate-700">Amex</span>
            <span className="bg-slate-800 px-2 py-1 rounded text-emerald-400 border border-slate-700">Cash on Delivery</span>
          </div>

          <p className="text-[11px] text-slate-500 text-center sm:text-right">
            © {new Date().getFullYear()} y5Hut.lk Sri Lanka. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
};
