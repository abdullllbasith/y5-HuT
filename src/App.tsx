import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/store/HeroSection';
import { PriceTicker } from './components/store/PriceTicker';
import { CategoryBento } from './components/store/CategoryBento';
import { CatalogView } from './components/store/CatalogView';
import { FeaturedDeals } from './components/store/FeaturedDeals';
import { BrandsStrip } from './components/store/BrandsStrip';
import { PromiseBand } from './components/store/PromiseBand';
import { CustomerNotes } from './components/store/CustomerNotes';
import { AppleStoreView } from './components/store/AppleStoreView';
import { DealsView } from './components/store/DealsView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ReviewsView } from './components/store/ReviewsView';
import { ProductDetailModal } from './components/store/ProductDetailModal';
import { CartDrawer } from './components/store/CartDrawer';
import { WishlistDrawer } from './components/store/WishlistDrawer';
import { NotificationDrawer } from './components/notifications/NotificationDrawer';
import { DemoNotice } from './components/common/DemoNotice';
import { Flame, LayoutGrid, Tag as TagIcon, Star } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeView } = useStore();

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-paper text-ink selection:bg-red selection:text-white font-ui">
      {activeView !== 'admin' && (
        <div className="bg-highlighter/30 border-b border-line px-4 py-2">
          <DemoNotice compact className="max-w-7xl mx-auto border-0 bg-transparent p-0 font-data text-xs text-ink">
            Concept preview. Products, prices, stock, promotions, warranty, delivery and contact details are sample content. Checkout, notifications and analytics are simulated. Data is stored only in this browser.
          </DemoNotice>
        </div>
      )}

      {/* y5Hut.lk Header with Top Announcement Bar & Navigation */}
      <Navbar />

      {/* Live Counter Price Ticker Strip */}
      {activeView !== 'admin' && <PriceTicker />}

      {/* Main View Router */}
      <div className="flex-1">
        {activeView === 'store' && (
          <div>
            <HeroSection />

            {/* In-Page Quick Jump Rail to make all sections immediately visible & accessible */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3">
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
                <span className="font-data text-[10px] uppercase font-bold text-ink-soft tracking-wider mr-1 shrink-0">
                  Quick Jump:
                </span>
                <a
                  href="#deals"
                  onClick={(e) => handleSmoothScroll(e, 'deals')}
                  className="px-3 py-1 rounded-full bg-card hover:bg-paper-sunk border border-line hover:border-ink font-ui font-semibold text-ink text-xs transition-colors shrink-0 flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Flame className="w-3.5 h-3.5 text-red" />
                  <span>Today's Deals</span>
                </a>
                <a
                  href="#departments"
                  onClick={(e) => handleSmoothScroll(e, 'departments')}
                  className="px-3 py-1 rounded-full bg-card hover:bg-paper-sunk border border-line hover:border-ink font-ui font-semibold text-ink text-xs transition-colors shrink-0 flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <LayoutGrid className="w-3.5 h-3.5 text-ink-soft" />
                  <span>Departments</span>
                </a>
                <a
                  href="#catalog"
                  onClick={(e) => handleSmoothScroll(e, 'catalog')}
                  className="px-3 py-1 rounded-full bg-card hover:bg-paper-sunk border border-line hover:border-ink font-ui font-semibold text-ink text-xs transition-colors shrink-0 flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <TagIcon className="w-3.5 h-3.5 text-ink-soft" />
                  <span>Product Catalog</span>
                </a>
                <a
                  href="#customer-reviews"
                  onClick={(e) => handleSmoothScroll(e, 'customer-reviews')}
                  className="px-3 py-1 rounded-full bg-card hover:bg-paper-sunk border border-line hover:border-ink font-ui font-semibold text-ink text-xs transition-colors shrink-0 flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Star className="w-3.5 h-3.5 text-low" />
                  <span>Customer Reviews</span>
                </a>
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12 py-4 sm:py-6">
              <CategoryBento />
              <FeaturedDeals />
              <BrandsStrip />
              <div id="catalog-section">
                <CatalogView />
              </div>
              <PromiseBand />
              <CustomerNotes />
            </div>
          </div>
        )}

        {activeView === 'apple-store' && <AppleStoreView />}

        {activeView === 'deals' && <DealsView />}

        {activeView === 'reviews' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            <ReviewsView />
            <CustomerNotes />
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
