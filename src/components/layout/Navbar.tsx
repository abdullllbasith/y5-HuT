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
  Star,
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
    searchQuery,
    executeSearch,
    setSelectedCategory,
  } = useStore();

  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobileSearchVisible, setIsMobileSearchVisible] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [headerSearchQuery, setHeaderSearchQuery] = useState(searchQuery);
  const [selectedHeaderCategory, setSelectedHeaderCategory] = useState<string>('all');

  // Keep local header search input in sync if cleared externally
  React.useEffect(() => {
    setHeaderSearchQuery(searchQuery);
  }, [searchQuery]);

  const categoriesList: { id: ProductCategory; label: string; icon: any }[] = [
    { id: 'apple-store', label: 'AppleHuT (Apple Showcase)', icon: Smartphone },
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

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    executeSearch(headerSearchQuery, selectedHeaderCategory as any);
    setMobileMenuOpen(false);
    setIsMobileSearchVisible(false);
  };

  return (
    <header className="w-full bg-white text-slate-900 border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      
      {/* 1. TOP ANNOUNCEMENT & UTILITY BAR */}
      <div className="bg-[#111827] text-white text-[11px] py-1 px-3 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Left: Hotline & Islandwide Delivery */}
          <div className="flex items-center gap-3 sm:gap-6 text-slate-300 min-w-0">
            <a
              href="tel:+94110000000"
              className="flex items-center gap-1.5 hover:text-white transition-colors truncate"
              title="Customer Support Hotline"
            >
              <Phone className="w-3 h-3 text-[#E11D48] shrink-0" />
              <span className="font-semibold text-white truncate text-[11px]">
                Hotline: +94 11 000 0000 <span className="hidden sm:inline text-slate-400 font-normal">(sample)</span>
              </span>
            </a>
            <div className="hidden md:flex items-center gap-1.5 text-slate-400 shrink-0">
              <Truck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Safe Islandwide Delivery (2-5 Days)</span>
            </div>
          </div>

          {/* Right: Currency Toggle, Role Selector, Installment Teaser */}
          <div className="flex items-center gap-2 sm:gap-4 text-slate-300 shrink-0">
            <span className="hidden xl:inline text-amber-400 font-medium">
              ⚡ 0% Installment Demo Preview (Koko &amp; Mintpay)
            </span>

            {/* Currency Selector */}
            <div className="flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
              <Globe className="w-3 h-3 text-slate-400" />
              <button
                type="button"
                onClick={() => setCurrency('LKR')}
                className={`px-1 font-bold text-[10px] sm:text-[11px] transition-colors cursor-pointer ${
                  currency === 'LKR' ? 'text-white underline' : 'text-slate-400 hover:text-white'
                }`}
                aria-label="Set currency to LKR"
              >
                LKR
              </button>
              <span className="text-slate-600 text-[10px]">|</span>
              <button
                type="button"
                onClick={() => setCurrency('USD')}
                className={`px-1 font-bold text-[10px] sm:text-[11px] transition-colors cursor-pointer ${
                  currency === 'USD' ? 'text-white underline' : 'text-slate-400 hover:text-white'
                }`}
                aria-label="Set currency to USD"
              >
                USD
              </button>
            </div>

            {/* Interactive Role Switcher - compact on small screens */}
            <button
              type="button"
              onClick={() => setIsRoleModalOpen(true)}
              className="flex items-center gap-1 sm:gap-1.5 bg-slate-800 hover:bg-slate-700 px-2 sm:px-2.5 py-0.5 rounded border border-slate-700 text-slate-200 transition-colors cursor-pointer"
              title="Click to switch simulated user role"
              aria-label={`Current Role: ${currentUser.role}. Click to switch.`}
            >
              <Shield className="w-3 h-3 text-[#E11D48] shrink-0" />
              <span className="text-[10px] sm:text-[11px] hidden xs:inline">Role:</span>
              <strong className="text-white capitalize text-[10px] sm:text-[11px] max-w-[80px] sm:max-w-none truncate">
                {currentUser.role.replace('_', ' ')}
              </strong>
              <ChevronDown className="w-2.5 h-2.5 text-slate-400 shrink-0" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER: Logo, Search Bar, Action Icons */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 flex items-center justify-between gap-2 sm:gap-4 lg:gap-8">
        
        {/* Brand Logo: y5Hut.lk */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setActiveView('store')}
            className="flex items-center gap-2 text-left focus:outline-none cursor-pointer group"
            aria-label="y5Hut Home"
          >
            <img
              src="/assets/aistudio/image_f443f98e.jpeg"
              alt="y5Hut Logo"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover shadow-xs ring-2 ring-[#E11D48]/30 group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-950 font-sans leading-none">
                y5<span className="text-[#E11D48]">Hut</span>
                <span className="text-[11px] sm:text-xs font-semibold text-slate-400 ml-0.5">.lk</span>
              </span>
              <span className="text-[8px] sm:text-[9px] tracking-wider text-slate-500 uppercase font-bold mt-0.5">
                Sri Lanka's Tech Store
              </span>
            </div>
          </button>
        </div>

        {/* Central Search Bar (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-xl lg:max-w-2xl items-center relative">
          <form onSubmit={handleSearchSubmit} className="w-full flex items-center border-2 border-slate-200 hover:border-[#E11D48] focus-within:border-[#E11D48] rounded-lg overflow-hidden transition-colors bg-white">
            <select
              value={selectedHeaderCategory}
              onChange={(e) => setSelectedHeaderCategory(e.target.value)}
              className="text-xs bg-slate-50 border-r border-slate-200 text-slate-700 px-3 py-2.5 focus:outline-none cursor-pointer hidden lg:block"
              aria-label="Filter search by category"
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
              placeholder="Search genuine gadgets, iPhone, AppleHuT, audio..."
              value={headerSearchQuery}
              onChange={(e) => setHeaderSearchQuery(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 focus:outline-none text-slate-800 placeholder:text-slate-400"
              aria-label="Search tech store catalogue"
            />

            <button
              type="submit"
              className="bg-[#E11D48] hover:bg-[#BE123C] text-white px-4 lg:px-5 py-2.5 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Search</span>
            </button>
          </form>
        </div>

        {/* Header Action Icons */}
        <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
          
          {/* Mobile Search Toggle Button */}
          <button
            type="button"
            onClick={() => setIsMobileSearchVisible(!isMobileSearchVisible)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
            title="Search Store"
            aria-label="Toggle mobile search bar"
            aria-expanded={isMobileSearchVisible}
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Hotline Call Widget (XL Desktop Only) */}
          <div className="hidden xl:flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-[#E11D48]">
              <Phone className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[9px] uppercase font-bold text-slate-400">Call Us Anytime</span>
              <a href="tel:+94110000000" className="text-xs font-bold text-slate-900 hover:text-[#E11D48]">
                +94 11 000 0000
              </a>
            </div>
          </div>

          {/* Real-time Notifications Bell */}
          <button
            type="button"
            onClick={() => setIsNotificationOpen(true)}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg relative cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
            title="Milestone Notifications & Alerts"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#E11D48] rounded-full ring-2 ring-white" />
            )}
          </button>

          {/* Wishlist Icon */}
          <button
            type="button"
            onClick={() => setIsWishlistOpen(true)}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg relative cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
            title="Saved Wishlist"
            aria-label={`Wishlist with ${wishlist.length} saved items`}
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute top-1 right-1 bg-slate-900 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart Bag Icon with Live Subtotal */}
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 p-2 sm:px-3 sm:py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer min-w-[44px] min-h-[44px]"
            aria-label={`Shopping Cart with ${cartTotalCount} items`}
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 text-[#E11D48]" />
              {cartTotalCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#E11D48] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartTotalCount}
                </span>
              )}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-[9px] uppercase font-bold text-slate-400">My Cart</span>
              <span className="text-xs font-bold font-mono text-slate-900 tabular-nums leading-tight">
                {formatPrice(cartSubtotalLKR, cartSubtotalUSD)}
              </span>
            </div>
          </button>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Expandable Search Bar */}
      {isMobileSearchVisible && (
        <div className="md:hidden px-3 py-2 bg-slate-50 border-t border-slate-200 animate-in fade-in slide-in-from-top-1 duration-150">
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                autoFocus
                placeholder="Search iPhone, Apple, gadgets, audio..."
                value={headerSearchQuery}
                onChange={(e) => setHeaderSearchQuery(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#E11D48]"
                aria-label="Search products"
              />
            </div>
            <button
              type="submit"
              className="bg-[#E11D48] text-white px-3.5 py-2 text-xs font-bold rounded-lg shrink-0"
            >
              Search
            </button>
          </form>
        </div>
      )}

      {/* 3. NAVIGATION BAR & MEGA MENU STRIP (Desktop) */}
      <div className="hidden md:block bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          <div className="flex items-center gap-6">
            {/* "SHOP BY CATEGORY" Dropdown Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                className="bg-[#E11D48] hover:bg-[#BE123C] text-white px-5 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-3 transition-colors cursor-pointer"
                aria-expanded={isCategoryMenuOpen}
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
                        type="button"
                        onClick={() => {
                          setIsCategoryMenuOpen(false);
                          setSelectedHeaderCategory(cat.id);
                          executeSearch('', cat.id);
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
                type="button"
                onClick={() => setActiveView('store')}
                className={`py-3 hover:text-[#E11D48] transition-colors cursor-pointer ${
                  activeView === 'store' ? 'text-[#E11D48] border-b-2 border-[#E11D48]' : ''
                }`}
              >
                Home
              </button>

              <button
                type="button"
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
                type="button"
                onClick={() => setActiveView('deals')}
                className={`py-3 hover:text-[#E11D48] transition-colors cursor-pointer flex items-center gap-1 ${
                  activeView === 'deals' ? 'text-[#E11D48] border-b-2 border-[#E11D48]' : ''
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-[#E11D48]" />
                <span>Hot Deals</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveView('reviews')}
                className={`py-3 hover:text-[#E11D48] transition-colors cursor-pointer ${
                  activeView === 'reviews' ? 'text-[#E11D48] border-b-2 border-[#E11D48]' : ''
                }`}
              >
                Customer Reviews
              </button>

              <button
                type="button"
                onClick={() => setActiveView('admin')}
                className={`py-3 hover:text-[#E11D48] transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeView === 'admin' ? 'text-[#E11D48] border-b-2 border-[#E11D48]' : 'text-slate-700'
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-[#E11D48]" />
                <span>Owner Console</span>
                <span className="text-[9px] bg-[#E11D48] text-white px-1.5 py-0.5 rounded font-mono font-bold tracking-tight">
                  MANAGE PRICES
                </span>
              </button>
            </nav>
          </div>

          {/* Right Highlight: Track Order & Delivery */}
          <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
            <button
              type="button"
              onClick={() => setActiveView('admin')}
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

      {/* 4. MOBILE MENU DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white max-h-[85vh] overflow-y-auto p-4 space-y-4 shadow-xl animate-in fade-in duration-150">
          
          {/* Quick Search inside Drawer */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search gadgets, iPhone, AppleHuT..."
              value={headerSearchQuery}
              onChange={(e) => setHeaderSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:border-[#E11D48]"
            />
          </form>

          {/* Navigation Links */}
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => {
                setActiveView('store');
                setMobileMenuOpen(false);
              }}
              className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm font-bold transition-colors ${
                activeView === 'store' ? 'bg-rose-50 text-[#E11D48]' : 'text-slate-800 hover:bg-slate-50'
              }`}
            >
              <span>Home Storefront</span>
              <span className="text-xs text-slate-400">→</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveView('apple-store');
                setMobileMenuOpen(false);
              }}
              className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm font-bold transition-colors ${
                activeView === 'apple-store' ? 'bg-rose-50 text-[#E11D48]' : 'text-slate-800 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-slate-500" />
                <span>AppleHuT Showcase</span>
              </div>
              <span className="text-[10px] bg-slate-900 text-white px-2 py-0.5 rounded font-mono">DEMO</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveView('deals');
                setMobileMenuOpen(false);
              }}
              className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm font-bold transition-colors ${
                activeView === 'deals' ? 'bg-rose-50 text-[#E11D48]' : 'text-slate-800 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#E11D48]" />
                <span>Hot Deals &amp; Discounts</span>
              </div>
              <span className="text-xs text-[#E11D48] font-semibold">Special</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveView('reviews');
                setMobileMenuOpen(false);
              }}
              className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm font-bold transition-colors ${
                activeView === 'reviews' ? 'bg-rose-50 text-[#E11D48]' : 'text-slate-800 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500" />
                <span>Customer Reviews</span>
              </div>
              <span className="text-xs text-slate-400">→</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveView('admin');
                setMobileMenuOpen(false);
              }}
              className={`flex items-center justify-between w-full px-3.5 py-3 rounded-xl text-sm font-bold transition-colors ${
                activeView === 'admin'
                  ? 'bg-rose-50 text-[#E11D48] border border-rose-200'
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Shield className="w-4 h-4 text-[#E11D48]" />
                <div className="text-left">
                  <div className="text-xs font-bold leading-tight">Owner Console</div>
                  <div className="text-[10px] text-slate-300 font-normal">Manage prices in seconds</div>
                </div>
              </div>
              <span className="text-[10px] bg-[#E11D48] text-white px-2 py-0.5 rounded-full font-bold">LIVE DEMO</span>
            </button>
          </div>

          {/* Quick Categories Bar in Mobile Menu */}
          <div className="pt-2 border-t border-slate-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1 mb-2 block">
              Browse Categories
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {categoriesList.map((cat) => {
                const IconComponent = cat.icon;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setSelectedHeaderCategory(cat.id);
                      executeSearch('', cat.id);
                    }}
                    className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-left text-xs font-semibold text-slate-700 flex items-center gap-2 transition-colors"
                  >
                    <IconComponent className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{cat.label.split('(')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Currency & Role Tools in Mobile Drawer */}
          <div className="pt-3 border-t border-slate-100 space-y-2.5 text-xs">
            <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="font-semibold text-slate-600">Store Currency:</span>
              <div className="flex items-center gap-1 font-bold">
                <button
                  type="button"
                  onClick={() => setCurrency('LKR')}
                  className={`px-2 py-1 rounded text-xs transition-colors ${
                    currency === 'LKR' ? 'bg-[#E11D48] text-white' : 'bg-white text-slate-700 border border-slate-200'
                  }`}
                >
                  LKR (Rs.)
                </button>
                <button
                  type="button"
                  onClick={() => setCurrency('USD')}
                  className={`px-2 py-1 rounded text-xs transition-colors ${
                    currency === 'USD' ? 'bg-[#E11D48] text-white' : 'bg-white text-slate-700 border border-slate-200'
                  }`}
                >
                  USD ($)
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <div>
                <span className="font-semibold text-slate-600 block">Simulated User Role:</span>
                <span className="text-[11px] text-[#E11D48] font-bold capitalize">
                  {currentUser.role.replace('_', ' ')}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsRoleModalOpen(true);
                }}
                className="px-2.5 py-1 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-100"
              >
                Change Role
              </button>
            </div>
          </div>

          {/* Hotline & Delivery Banner */}
          <div className="pt-2 text-center text-xs text-slate-500 space-y-1">
            <p>Hotline: <a href="tel:+94110000000" className="font-bold text-slate-800 hover:text-[#E11D48]">+94 11 000 0000</a></p>
            <p className="text-[11px] text-emerald-700 font-semibold">✓ Islandwide Delivery · 0% Installments</p>
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
                type="button"
                onClick={() => setIsRoleModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-md"
                aria-label="Close role modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-3 max-h-[60vh] overflow-y-auto">
              {rolesList.map((r) => {
                const isSelected = currentUser.role === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
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
                type="button"
                onClick={() => setIsRoleModalOpen(false)}
                className="font-medium text-slate-800 hover:text-slate-950 cursor-pointer"
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
