import React from 'react';
import { FlaskConical, Store } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { AdminTab } from '../../types';
import { ResetDemoButton } from './ResetDemoButton';
import { MobileNav } from './MobileNav';
import { ALL_NAV, AdminNavItem, PRIMARY_NAV, SECONDARY_NAV } from './adminNav';

interface NavButtonProps {
  item: AdminNavItem;
  active: boolean;
  onSelect: (id: AdminTab) => void;
}

const NavButton: React.FC<NavButtonProps> = ({ item, active, onSelect }) => {
  const Icon = item.icon;
  return (
    <button
      onClick={() => onSelect(item.id)}
      aria-current={active ? 'page' : undefined}
      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer text-left ${
        active
          ? 'bg-[#E11D48] text-white shadow-xs'
          : 'text-slate-600 hover:bg-rose-50 hover:text-[#E11D48]'
      }`}
    >
      <Icon className="w-4 h-4 shrink-0" />
      <span>{item.label}</span>
    </button>
  );
};

export const AdminShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { activeAdminTab, setActiveAdminTab, setActiveView, currentUser } = useStore();
  const current = ALL_NAV.find((n) => n.id === activeAdminTab);

  return (
    <div className="py-4 lg:py-6 space-y-3 lg:space-y-4 pb-24 lg:pb-6">
      {/* Demo Mode banner */}
      <div
        role="note"
        className="flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 px-3 sm:px-4 py-2.5 sm:py-3 text-amber-900"
      >
        <FlaskConical className="w-5 h-5 shrink-0 mt-0.5" />
        <p className="text-xs leading-relaxed min-w-0">
          <strong className="font-black tracking-wide">DEMO MODE — data is stored only in this browser.</strong>{' '}
          <span className="hidden sm:inline">
            Changes you make here are saved in this browser's local storage, are not sent to any server, and
            will not appear on other devices. No real orders, payments or messages are involved.
          </span>
          <span className="sm:hidden">Nothing is sent to a server. Not on other devices.</span>
        </p>
        <div className="ml-auto shrink-0 hidden lg:block">
          <ResetDemoButton />
        </div>
      </div>

      {/* Top bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#E11D48]">
            y5Hut Owner Console
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-950 font-sans">{current?.label ?? 'Admin'}</h1>
          {current && <p className="text-xs text-slate-500">{current.description}</p>}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 max-w-full truncate"
            title="Roles are a simulation for this demo. There is no real login."
          >
            Simulated role: <span className="capitalize text-[#E11D48]">{currentUser.role.replace('_', ' ')}</span>
            {' '}· {currentUser.name}
          </span>
          <button
            onClick={() => setActiveView('store')}
            className="hidden lg:flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:text-[#E11D48] hover:border-[#E11D48] transition-colors cursor-pointer"
          >
            <Store className="w-3.5 h-3.5" />
            View storefront
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Sidebar (desktop). Phones and tablets use the bottom navigation instead. */}
        <nav
          aria-label="Admin navigation"
          className="hidden lg:block w-60 shrink-0 bg-white rounded-xl border border-slate-200 p-3 shadow-xs"
        >
          <div className="flex flex-col gap-1">
            {PRIMARY_NAV.map((item) => (
              <NavButton
                key={item.id}
                item={item}
                active={activeAdminTab === item.id}
                onSelect={setActiveAdminTab}
              />
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="px-3 pb-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
              Demo / Existing Modules
            </div>
            <p className="px-3 pb-2 text-[10px] text-slate-400 leading-snug">
              Sample screens on mock data, not production features.
            </p>
          </div>
          <div className="flex flex-col gap-1">
            {SECONDARY_NAV.map((item) => (
              <NavButton
                key={item.id}
                item={item}
                active={activeAdminTab === item.id}
                onSelect={setActiveAdminTab}
              />
            ))}
          </div>
        </nav>

        <section className="flex-1 min-w-0 w-full space-y-4 lg:space-y-6">{children}</section>
      </div>
      <MobileNav />
    </div>
  );
};
