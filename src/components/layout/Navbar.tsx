import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Search,
  ShoppingBag,
  Heart,
  Phone,
  ChevronDown,
  Menu,
  X,
  Shield,
  User,
  Bell,
  Truck,
  Flame,
  Smartphone,
  Watch,
  Headphones,
  BatteryCharging,
  Zap,
  Layers,
  Globe,
} from 'lucide-react';
import { ProductCategory, UserRole } from '../../types';

export const Navbar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    cartTotalCount,
    cartSubtotalLKR,
    cartSubtotalUSD,
    currency,
    setCurrency,
    formatPrice,
    setIsCartOpen,
    wishlist,
    setIsWishlistOpen,
    unreadNotificationCount,
    setIsNotificationOpen,
    currentUser,
    switchUserRole,
  } = useStore();

  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [headerSearchQuery, setHeaderSearchQuery] = useState('');
  const [selectedHeaderCategory, setSelectedHeaderCategory] = useState<string>('all');

  const categoriesList: { id: ProductCategory; label: string; icon: any }[] = [
    { id: 'apple-store', label: 'AppleHuT (Official Apple)', icon: Smartphone },
    { id: 'smartphones', label: 'Mobile Phones & Flagships', icon: Smartphone },
    { id: 'smartwatches', label: 'Smartwatches & Wearables', icon: Watch },
    { id: 'audio', label: 'Earphones & Headphones (ANC)', icon: Headphones },
    { id: 'power-banks', label: 'High-Capacity Power Banks', icon: BatteryCharging },
    { id: 'charging', label: 'Fast GaN Chargers & Docks', icon: Zap },
    { id: 'cases-protection', label: 'Cases & Screen Protectors', icon: Layers },
  ];

  const rolesList: { id: UserRole; name: string; desc: string }[] = [
    {
      id: 'super_admin',
      name: 'Super Admin',
      desc: 'Full access: Analytics, Orders, Stock, Client CRM, Security',
    },
    {
      id: 'inventory_manager',
      name: 'Inventory Manager',
      desc: 'Warehouse stock audits, reorder thresholds, and dispatch logs',
    },
    {
      id: 'sales_rep',
      name: 'Sales & Corporate Rep',
      desc: 'Client accounts, Net-30 invoicing, corporate quotes',
    },
    {
      id: 'customer',
      name: 'Verified Customer / Buyer',
      desc: 'Catalog, shopping bag, Koko installments, and milestone tracking',
    },
  ];

  return (
    <header className="w-full bg-white text-slate-900 border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      
      {/* 1. TOP ANNOUNCEMENT & UTILITY BAR (y5Hut.lk Signature Style) */}
      <div className="bg-[#111827] text-white text-[11px] py-1.5 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Left: Hotline & Islandwide Delivery */}
          <div className="flex items-center gap-4 sm:gap-6 text-slate-300">
            <a
              href="tel:+94110000000"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#E11D48]" />
              <span className="font-semibold text-white">Hotline: +94 11 000 0000 (sample)</span>
            </a>
            <div className="hidden md:flex items-center gap-1.5 text-slate-400">
              <Truck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Safe Islandwide Delivery (2-5 Days)</span>
            </div>
          </div>

          {/* Right: Currency Toggle, Role Selector, App Discount */}
          <div className="flex items-center gap-3 sm:gap-4 text-slate-300">
            <span className="hidden lg:inline text-amber-400 font-medium">
              🔥 0% Interest Installments with Koko &amp; Mintpay
            </span>

            {/* Currency Selector */}
            <div className="flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
              <Globe className="w-3 h-3 text-slate-400" />
              <button
                onClick={() => setCurrency('LKR')}
                className={`px-1 font-bold transition-colors cursor-pointer ${
                  currency === 'LKR' ? 'text-white underline' : 'text-slate-400 hover:text-white'
                }`}
              >
                LKR (Rs.)
              </button>
              <span className="text-slate-600">|</span>
              <button
                onClick={() => setCurrency('USD')}
                className={`px-1 font-bold transition-colors cursor-pointer ${
                  currency === 'USD' ? 'text-white underline' : 'text-slate-400 hover:text-white'
                }`}
              >
                USD ($)
              </button>
            </div>

            {/* Prominent Interactive Role Switcher */}
            <button
              onClick={() => setIsRoleModalOpen(true)}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 px-2.5 py-0.5 rounded border border-slate-700 text-slate-200 transition-colors cursor-pointer"
              title="Click to switch simulated user role"
            >
              <Shield className="w-3 h-3 text-[#E11D48]" />
              <span className="text-[11px]">Role: <strong className="text-white capitalize">{currentUser.role.replace('_', ' ')}</strong></span>
              <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER: Logo, Search Bar, Contact, Wishlist, Cart */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4 lg:gap-8">
        
        {/* Brand Logo: y5Hut.lk (using circular logo badge) */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveView('store')}
            className="flex items-center gap-2.5 text-left focus:outline-none cursor-pointer group"
          >
            <img
              src="/assets/aistudio/image_f443f98e.jpeg"
              alt="y5Hut Logo"
              className="w-10 h-10 rounded-full object-cover shadow-xs ring-2 ring-[#E11D48]/30 group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-slate-950 font-sans leading-none">
                y5<span className="text-[#E11D48]">Hut</span>
                <span className="text-xs font-semibold text-slate-400 ml-0.5">.lk</span>
              </span>
              <span className="text-[9px] tracking-widest text-slate-500 uppercase font-bold mt-0.5">
                Sri Lanka's Tech Store
              </span>
            </div>
          </button>
        </div>

        {/* Central Search Bar with Category Filter Dropdown */}
        <div className="hidden md:flex flex-1 max-w-2xl items-center relative">
          <div className="w-full flex items-center border-2 border-slate-200 hover:border-[#E11D48] focus-within:border-[#E11D48] rounded-lg overflow-hidden transition-colors bg-white">
            <select
              value={selectedHeaderCategory}
              onChange={(e) => setSelectedHeaderCategory(e.target.value)}
              className="text-xs bg-slate-50 border-r border-slate-200 text-slate-700 px-3 py-2.5 focus:outline-none cursor-pointer hidden lg:block"
            >
              <option value="all">All Categories</option>
              <option value="apple-store">AppleHuT</option>
              <option value="smartphones">Mobile Phones</option>
              <option value="smartwatches">Smartwatches</option>
              <option value="audio">Earphones &amp; Audio</option>
              <option value="power-banks">Power Banks</option>
              <option value="charging">Fast Chargers</option>
            </select>

            <input
              type="text"
              placeholder="Search genuine gadgets, iPhone, AppleHuT, smartwatches, power banks..."
              value={headerSearchQuery}
              onChange={(e) => setHeaderSearchQuery(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 focus:outline-none text-slate-800 placeholder:text-slate-400"
            />

            <button
              onClick={() => {
                const catalogEl = document.getElementById('catalog-section');
                catalogEl?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-[#E11D48] hover:bg-[#BE123C] text-white px-5 py-2.5 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>
        </div>

        {/* Header Action Icons */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          
          {/* Hotline Quick Call Widget */}
          <div className="hidden xl:flex items-center gap-2.5 pl-2 border-l border-slate-200">
            <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center text-[#E11D48]">
              <Phone className="w-4 h-4" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[10px] uppercase font-bold text-slate-400">Call Us Anytime</span>
              <a href="tel:+94110000000" className="text-xs font-bold text-slate-900 hover:text-[#E11D48]">
                +94 11 000 0000 (sample)
              </a>
            </div>
          </div>

          {/* Real-time Notifications Bell */}
          <button
            onClick={() => setIsNotificationOpen(true)}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg relative cursor-pointer"
            title="Milestone Notifications & Alerts"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#E11D48] rounded-full ring-2 ring-white" />
            )}
          </button>

          {/* Wishlist Icon */}
          <button
            onClick={() => setIsWishlistOpen(true)}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg relative cursor-pointer"
            title="Saved Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-slate-900 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart Bag Icon with Live Subtotal */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2.5 p-2 sm:px-3 sm:py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 text-[#E11D48]" />
              <span className="absolute -top-2 -right-2 bg-[#E11D48] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartTotalCount}
              </span>
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-[10px] uppercase font-bold text-slate-400">My Cart</span>
              <span className="text-xs font-bold font-mono text-slate-900 tabular-nums">
                {formatPrice(cartSubtotalLKR, cartSubtotalUSD)}
              </span>
            </div>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* 3. NAVIGATION BAR & MEGA MENU STRIP (y5Hut.lk Signature Bar) */}
      <div className="hidden md:block bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          <div className="flex items-center gap-6">
            {/* "SHOP BY CATEGORY" Dropdown Button */}
            <div className="relative">
              <button
                onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                className="bg-[#E11D48] hover:bg-[#BE123C] text-white px-5 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-3 transition-colors cursor-pointer"
              >
                <Menu className="w-4 h-4" />
                <span>Shop by Category</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {/* Category Dropdown Menu */}
              {isCategoryMenuOpen && (
                <div className="absolute top-full left-0 w-64 bg-white border border-slate-200 shadow-xl rounded-b-lg py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  {categoriesList.map((cat) => {
                    const IconComponent = cat.icon;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setActiveView('store');
                          setIsCategoryMenuOpen(false);
                          const el = document.getElementById('catalog-section');
                          el?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="w-full text-left px-4 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-[#E11D48] flex items-center gap-3 transition-colors cursor-pointer"
                      >
                        <IconComponent className="w-4 h-4 text-slate-400 group-hover:text-[#E11D48]" />
                        <span>{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Horizontal Nav Links */}
            <nav className="flex items-center gap-6 text-xs font-bold text-slate-700 uppercase tracking-wide">
              <button
                onClick={() => setActiveView('store')}
                className={`py-3 hover:text-[#E11D48] transition-colors cursor-pointer ${
                  activeView === 'store' ? 'text-[#E11D48] border-b-2 border-[#E11D48]' : ''
                }`}
              >
                Home
              </button>

              <button
                onClick={() => setActiveView('apple-store')}
                className={`py-3 hover:text-[#E11D48] transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeView === 'apple-store' ? 'text-[#E11D48] border-b-2 border-[#E11D48]' : ''
                }`}
              >
                <span>AppleHuT</span>
                <span className="text-[9px] bg-slate-900 text-white px-1.5 py-0.5 rounded font-mono font-semibold">
                  DEMO
                </span>
              </button>

              <button
                onClick={() => setActiveView('deals')}
                className={`py-3 hover:text-[#E11D48] transition-colors cursor-pointer flex items-center gap-1 ${
                  activeView === 'deals' ? 'text-[#E11D48] border-b-2 border-[#E11D48]' : ''
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-[#E11D48]" />
                <span>Hot Deals</span>
              </button>

              <button
                onClick={() => setActiveView('reviews')}
                className={`py-3 hover:text-[#E11D48] transition-colors cursor-pointer ${
                  activeView === 'reviews' ? 'text-[#E11D48] border-b-2 border-[#E11D48]' : ''
                }`}
              >
                Customer Reviews
              </button>

              <button
                onClick={() => setActiveView('admin')}
                className={`py-3 hover:text-[#E11D48] transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeView === 'admin' ? 'text-[#E11D48] border-b-2 border-[#E11D48]' : 'text-slate-500'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin Suite &amp; CRM</span>
              </button>
            </nav>
          </div>

          {/* Right Highlight: Track Order & Hotline */}
          <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
            <button
              onClick={() => {
                setActiveView('admin');
              }}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Track Order
            </button>
            <span className="text-slate-300">|</span>
            <span className="text-emerald-700 font-semibold">
              Islandwide COD Available
            </span>
          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white p-4 space-y-3">
          <div className="relative mb-3">
            <input
              type="text"
              placeholder="Search gadgets, iPhone, AppleHuT, audio..."
              value={headerSearchQuery}
              onChange={(e) => setHeaderSearchQuery(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
            />
          </div>

          <button
            onClick={() => {
              setActiveView('store');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm font-semibold text-slate-900"
          >
            Home
          </button>
          <button
            onClick={() => {
              setActiveView('apple-store');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm font-semibold text-[#E11D48] flex items-center justify-between"
          >
            <span>AppleHuT</span>
            <span className="text-[10px] bg-slate-900 text-white px-2 py-0.5 rounded">GENUINE</span>
          </button>
          <button
            onClick={() => {
              setActiveView('deals');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm font-semibold text-[#E11D48]"
          >
            Hot Deals &amp; Discounts
          </button>
          <button
            onClick={() => {
              setActiveView('reviews');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm font-semibold text-slate-900"
          >
            Customer Reviews
          </button>
          <button
            onClick={() => {
              setActiveView('admin');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm font-semibold text-[#E11D48]"
          >
            Admin Management Portal
          </button>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>Currency: <strong>{currency}</strong></span>
            <button
              onClick={() => setCurrency(currency === 'LKR' ? 'USD' : 'LKR')}
              className="text-[#E11D48] font-bold"
            >
              Switch to {currency === 'LKR' ? 'USD ($)' : 'LKR (Rs.)'}
            </button>
          </div>
        </div>
      )}

      {/* Role-Based Access Control Modal */}
      {isRoleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-sans">
                  User Role &amp; Permission Switcher
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select team role to inspect role-specific views and permission boundaries.
                </p>
              </div>
              <button
                onClick={() => setIsRoleModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-3">
              {rolesList.map((r) => {
                const isSelected = currentUser.role === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => {
                      switchUserRole(r.id);
                      setIsRoleModalOpen(false);
                    }}
                    className={`w-full text-left p-3.5 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#E11D48] bg-rose-50/40 ring-1 ring-[#E11D48]'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-900">
                        {r.name}
                      </span>
                      {isSelected && (
                        <span className="text-xs font-semibold text-[#E11D48]">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {r.desc}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
              <span>Security Level: Corporate Multi-Tier</span>
              <button
                onClick={() => setIsRoleModalOpen(false)}
                className="font-medium text-slate-800 hover:text-slate-950"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
