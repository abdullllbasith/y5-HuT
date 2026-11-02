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
import { Dot } from '../ui/Dot';

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
      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer text-left w-full min-h-[44px] ${
        active
          ? 'bg-paper text-ink shadow-hard-sm'
          : 'text-paper/70 hover:bg-night-card hover:text-paper'
      } ${collapsed ? 'justify-center px-2' : ''}`}
    >
      <div className="relative shrink-0 flex items-center justify-center">
        <Icon className={`w-4 h-4 ${active ? 'text-red' : 'text-paper/60'}`} />
        {active && (
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red ring-2 ring-night" />
        )}
      </div>
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
    <div className="py-4 lg:py-6 space-y-4 pb-28 lg:pb-8 text-left font-ui">
      {/* 1. DEMO CONTEXT BANNER */}
      <div
        role="note"
        className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-highlighter/30 px-4 py-2.5 text-xs text-ink shadow-hard-sm"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <FlaskConical className="w-4 h-4 text-red shrink-0" />
          <p className="truncate">
            <strong className="font-bold">COUNTER CONSOLE DEMO:</strong>{' '}
            <span className="text-ink-soft">
              Changes reflect live on the customer counter storefront without an external server.
            </span>
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-2">
          <ResetDemoButton />
        </div>
      </div>

      {/* 2. TOP ACTION BAR */}
      <header className="bg-card rounded-2xl border border-line px-4 py-3 sm:px-6 sm:py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-hard-sm">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:flex p-2 text-ink-soft hover:text-ink hover:bg-paper-sunk rounded-xl transition-colors cursor-pointer min-w-[40px] min-h-[40px] items-center justify-center"
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label="Toggle sidebar"
          >
            {sidebarCollapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Dot tone="red" size="xs" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-red font-data">
                The Back of the Shop
              </span>
              {lastPublish && (
                <span className="hidden md:inline-flex items-center gap-1 text-[10px] text-go bg-paper-sunk px-2 py-0.5 rounded-full border border-line font-data">
                  <CheckCircle className="w-3 h-3 text-go" />
                  Synced {new Date(lastPublish.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </div>
            <h1 className="font-display text-xl sm:text-2xl font-bold text-ink tracking-tight truncate mt-0.5">
              {current?.label ?? 'Owner Overview'}
            </h1>
          </div>
        </div>

        {/* Top Right: Role Pill & Storefront Switcher */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-ink bg-paper-sunk px-3 py-1.5 rounded-full border border-line"
            title="Simulated User Role"
          >
            <Dot tone="go" size="xs" />
            <span className="font-data">Owner · {currentUser.name.split(' ')[0]}</span>
          </div>

          <button
            type="button"
            onClick={() => setIsNotificationOpen(true)}
            className="w-10 h-10 rounded-full border border-line bg-paper flex items-center justify-center text-ink-soft hover:text-ink hover:border-ink transition-colors relative cursor-pointer min-w-[44px] min-h-[44px]"
            title="Alerts & Notifications"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-red rounded-full" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveView('store')}
            className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-full bg-ink hover:bg-red text-paper shadow-hard-sm transition-all cursor-pointer min-h-[44px]"
          >
            <Store className="w-4 h-4" />
            <span>Counter Storefront</span>
          </button>
        </div>
      </header>

      {/* 3. MAIN WORKSPACE WITH INK SIDEBAR */}
      <div className="flex flex-col lg:flex-row gap-5 items-start">
        {/* Desktop Collapsible Ink Navigation (240px -> 64px) */}
        <nav
          aria-label="Admin navigation"
          className={`hidden lg:block shrink-0 bg-ink text-paper rounded-2xl border border-line p-3 shadow-hard transition-all duration-200 ${
            sidebarCollapsed ? 'w-16' : 'w-60'
          }`}
        >
          {/* Quick Nav Search when expanded */}
          {!sidebarCollapsed && (
            <div className="relative mb-3">
              <Search className="w-3.5 h-3.5 text-paper/40 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Jump to..."
                value={navSearch}
                onChange={(e) => setNavSearch(e.target.value)}
                className="w-full font-ui text-xs pl-8 pr-2.5 py-1.5 bg-night-card border border-paper/10 text-paper rounded-xl focus:outline-none focus:border-red"
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

          {/* Secondary Modules Divider */}
          <div className="mt-4 pt-3 border-t border-paper/10">
            {!sidebarCollapsed && (
              <div className="px-3 pb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-paper/40 font-data">
                  Counter Modules
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
