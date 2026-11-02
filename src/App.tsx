import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/store/HeroSection';
import { CatalogView } from './components/store/CatalogView';
import { FeaturedDeals } from './components/store/FeaturedDeals';
import { BrandsStrip } from './components/store/BrandsStrip';
import { Testimonials } from './components/store/Testimonials';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ReviewsView } from './components/store/ReviewsView';
import { ProductDetailModal } from './components/store/ProductDetailModal';
import { CartDrawer } from './components/store/CartDrawer';
import { WishlistDrawer } from './components/store/WishlistDrawer';
import { NotificationDrawer } from './components/notifications/NotificationDrawer';
import { DemoNotice } from './components/common/DemoNotice';

const MainContent: React.FC = () => {
  const { activeView } = useStore();

  return (
    <main className="min-h-screen flex flex-col bg-[#F7F8FA] text-[#111827] selection:bg-[#E11D48] selection:text-white font-sans">
      {activeView !== 'admin' && (
        <div className="bg-amber-50/90 border-b border-amber-200/80 px-4 py-2">
          <DemoNotice compact className="max-w-7xl mx-auto border-0 bg-transparent p-0">
            Concept preview. Products, prices, stock, promotions, warranty, delivery and contact details are sample content. Checkout, notifications and analytics are simulated. Data is stored only in this browser.
          </DemoNotice>
        </div>
      )}

      {/* y5Hut.lk Header with Top Announcement Bar & Navigation */}
      <Navbar />

      {/* Main View Router */}
      <div className="flex-1">
        {activeView === 'store' && (
          <div>
            <HeroSection />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
              <FeaturedDeals />
              <BrandsStrip />
              <div id="catalog-section">
                <CatalogView />
              </div>
              <Testimonials />
            </div>
          </div>
        )}

        {activeView === 'apple-store' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            <div className="bg-[#111827] text-white p-6 sm:p-8 rounded-[18px] border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xs">
              <div className="space-y-2 max-w-xl text-center sm:text-left">
                <span className="text-[10px] font-mono font-bold uppercase text-amber-400 tracking-wider">
                  APPLE DEMO SAMPLE · Y5HUT.LK
                </span>
                <h1 className="text-2xl sm:text-4xl font-bold font-sans tracking-tight">
                  The AppleHuT Showcase
                </h1>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Concept demo: genuine flagship designs, accessories, and audio devices configured with live mock pricing.
                </p>
              </div>
              <div className="bg-white/10 px-5 py-3.5 rounded-xl text-center shrink-0 border border-white/10">
                <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase">Sample Warranty</div>
                <div className="text-base font-bold font-mono mt-0.5">Demo Prototype</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Concept listing only</div>
              </div>
            </div>

            <CatalogView
              initialCategory="apple-store"
              title="AppleHuT Curated Collection"
              subtitle="iPhones, Apple Watches, AirPods Pro, and MagSafe accessories for this demonstration."
            />
          </div>
        )}

        {activeView === 'deals' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            <FeaturedDeals />
            <CatalogView
              title="Flash Sale Deals &amp; Promotional Inventory"
              subtitle="Flagship mobile phones, high-speed power banks, and ANC earbuds derived from live store data."
            />
          </div>
        )}

        {activeView === 'reviews' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            <ReviewsView />
            <Testimonials />
          </div>
        )}

        {activeView === 'admin' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AdminDashboard />
          </div>
        )}
      </div>

      {/* y5Hut.lk Official Footer */}
      {activeView !== 'admin' && <Footer />}

      {/* Global Modals & Slide-out Drawers */}
      <ProductDetailModal />
      <CartDrawer />
      <WishlistDrawer />
      <NotificationDrawer />
    </main>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainContent />
    </StoreProvider>
  );
}
