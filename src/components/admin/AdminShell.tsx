import React, { useState } from 'react';
import {
  FlaskConical,
  Store,
  PanelLeftClose,
  PanelLeft,
  Search,
  Bell,
  CheckCircle,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { AdminTab } from '../../types';
import { ResetDemoButton } from './ResetDemoButton';
import { MobileNav } from './MobileNav';
import { ALL_NAV, AdminNavItem, PRIMARY_NAV, SECONDARY_NAV } from './adminNav';

interface NavButtonProps {
  item: AdminNavItem;
  active: boolean;
  collapsed: boolean;
  onSelect: (id: AdminTab) => void;
}

const NavButton: React.FC<NavButtonProps> = ({ item, active, collapsed, onSelect }) => {
  const Icon = item.icon;
  return (
    <button
      onClick={() => onSelect(item.id)}
      aria-current={active ? 'page' : undefined}
      title={collapsed ? item.label : undefined}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer text-left ${
        active
          ? 'bg-[#111827] text-white shadow-xs'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      } ${collapsed ? 'justify-center px-2' : ''}`}
    >
      <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-[#E11D48]' : 'text-slate-500'}`} />
      {!collapsed && <span className="truncate">{item.label}</span>}
    </button>
  );
};

export const AdminShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    activeAdminTab,
    setActiveAdminTab,
    setActiveView,
    currentUser,
    unreadNotificationCount,
    setIsNotificationOpen,
    lastPublish,
  } = useStore();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [navSearch, setNavSearch] = useState('');

  const current = ALL_NAV.find((n) => n.id === activeAdminTab);

  const filteredPrimary = PRIMARY_NAV.filter((n) =>
    n.label.toLowerCase().includes(navSearch.toLowerCase())
  );
  const filteredSecondary = SECONDARY_NAV.filter((n) =>
    n.label.toLowerCase().includes(navSearch.toLowerCase())
  );

  return (
    <div className="py-4 lg:py-6 space-y-4 pb-24 lg:pb-8">
      {/* 1. DEMO CONTEXT BANNER */}
      <div
        role="note"
        className="flex items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50/90 px-4 py-2.5 text-xs text-amber-900 shadow-2xs"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <FlaskConical className="w-4 h-4 text-amber-600 shrink-0" />
          <p className="truncate">
            <strong className="font-bold">DEMO ENVIRONMENT:</strong>{' '}
            <span className="text-amber-800">
              Data is saved in this browser. Changes apply live to the storefront without a backend.
            </span>
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-2">
          <span className="hidden sm:inline-block font-mono text-[10px] uppercase font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded">
            Standalone Demo
          </span>
          <ResetDemoButton />
        </div>
      </div>

      {/* 2. SHOPIFY-STYLE CHASSIS: TOP ACTION BAR */}
      <header className="bg-white rounded-xl border border-[#E5E7EB] px-4 py-3 sm:px-6 sm:py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:flex p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label="Toggle sidebar width"
          >
            {sidebarCollapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#E11D48] font-mono">
                Merchant Console
              </span>
              {lastPublish && (
                <span className="hidden md:inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-mono">
                  <CheckCircle className="w-3 h-3 text-emerald-600" />
                  Synced {new Date(lastPublish.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-[#111827] tracking-tight truncate font-sans">
              {current?.label ?? 'Admin Dashboard'}
            </h1>
          </div>
        </div>

        {/* Top Right: Page Action & Storefront Switcher */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div
            className="hidden sm:flex items-center gap-1.5 text-[11px] font-medium text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-[#E5E7EB]"
            title="Simulated User Role"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="capitalize">{currentUser.role.replace('_', ' ')}</span>
          </div>

          <button
            type="button"
            onClick={() => setIsNotificationOpen(true)}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg relative cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center transition-colors"
            title="Alerts & Notifications"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#E11D48] rounded-full ring-2 ring-white" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveView('store')}
            className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-lg bg-[#E11D48] hover:bg-[#BE123C] text-white shadow-xs transition-colors cursor-pointer"
          >
            <Store className="w-3.5 h-3.5" />
            <span>View Storefront</span>
          </button>
        </div>
      </header>

      {/* 3. MAIN WORKSPACE WITH COLLAPSIBLE SIDEBAR */}
      <div className="flex flex-col lg:flex-row gap-5 items-start">
        {/* Desktop Collapsible Left Navigation */}
        <nav
          aria-label="Admin navigation"
          className={`hidden lg:block shrink-0 bg-white rounded-xl border border-[#E5E7EB] p-3 shadow-2xs transition-all duration-200 ${
            sidebarCollapsed ? 'w-16' : 'w-60'
          }`}
        >
          {/* Quick Nav Search when expanded */}
          {!sidebarCollapsed && (
            <div className="relative mb-3">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Jump to section..."
                value={navSearch}
                onChange={(e) => setNavSearch(e.target.value)}
                className="w-full text-xs pl-8 pr-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:border-[#E11D48]"
                aria-label="Filter navigation"
              />
            </div>
          )}

          {/* Primary Owner Tools */}
          <div className="flex flex-col gap-1">
            {filteredPrimary.map((item) => (
              <NavButton
                key={item.id}
                item={item}
                active={activeAdminTab === item.id}
                collapsed={sidebarCollapsed}
                onSelect={setActiveAdminTab}
              />
            ))}
          </div>

          {/* Demo Modules Divider */}
          <div className="mt-4 pt-3 border-t border-slate-100">
            {!sidebarCollapsed && (
              <div className="px-2 pb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Demo Modules
                </span>
              </div>
            )}
            <div className="flex flex-col gap-1">
              {filteredSecondary.map((item) => (
                <NavButton
                  key={item.id}
                  item={item}
                  active={activeAdminTab === item.id}
                  collapsed={sidebarCollapsed}
                  onSelect={setActiveAdminTab}
                />
              ))}
            </div>
          </div>
        </nav>

        {/* Page Content Viewport */}
        <section className="flex-1 min-w-0 w-full space-y-4">{children}</section>
      </div>

      {/* Mobile/Tablet Dock Navigation */}
      <MobileNav />
    </div>
  );
};
