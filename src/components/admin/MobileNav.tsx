import React, { useEffect, useRef, useState } from 'react';
import { Home, MoreHorizontal, Smartphone, Store, Tags, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { AdminTab } from '../../types';
import { PRIMARY_NAV, SECONDARY_NAV } from './adminNav';
import { ResetDemoButton } from './ResetDemoButton';

/** Height of the bottom bar. Fixed action docks sit above it using this same value. */
export const BOTTOM_NAV_HEIGHT = '3.5rem';

const MAIN_TABS: { id: AdminTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'overview', label: 'Home', icon: Home },
  { id: 'price-manager', label: 'Prices', icon: Tags },
  { id: 'products', label: 'Products', icon: Smartphone },
];
const MAIN_IDS = MAIN_TABS.map((t) => t.id);
const MORE_ITEMS = [...PRIMARY_NAV.filter((n) => !MAIN_IDS.includes(n.id)), ...SECONDARY_NAV];

/** Phone/tablet navigation: Home, Prices, Products and a More sheet. The desktop sidebar is unchanged. */
export const MobileNav: React.FC = () => {
  const { activeAdminTab, setActiveAdminTab, setActiveView } = useStore();
  const [moreOpen, setMoreOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const moreActive = !MAIN_IDS.includes(activeAdminTab);

  useEffect(() => {
    if (!moreOpen) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMoreOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [moreOpen]);

  const tab = (active: boolean) =>
    `flex-1 flex flex-col items-center justify-center gap-0.5 text-[11px] font-bold cursor-pointer transition-colors ${
      active ? 'text-[#E11D48]' : 'text-slate-500 active:text-[#E11D48]'
    }`;

  return (
    <>
      <nav
        aria-label="Admin navigation"
        className="lg:hidden fixed inset-x-0 bottom-0 z-40 flex border-t border-slate-200 bg-white/95 backdrop-blur pb-[env(safe-area-inset-bottom)]"
        style={{ minHeight: BOTTOM_NAV_HEIGHT }}
      >
        {MAIN_TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActiveAdminTab(id)} aria-current={activeAdminTab === id ? 'page' : undefined} className={tab(activeAdminTab === id)}>
            <Icon className="w-5 h-5" />
            {label}
          </button>
        ))}
        <button onClick={() => setMoreOpen(true)} aria-haspopup="dialog" aria-expanded={moreOpen} className={tab(moreActive)}>
          <MoreHorizontal className="w-5 h-5" />
          More
        </button>
      </nav>

      {moreOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex items-end bg-slate-950/50" onClick={() => setMoreOpen(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label="More admin pages"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">More</h2>
              <button ref={closeRef} onClick={() => setMoreOpen(false)} aria-label="Close menu" className="w-11 h-11 -mr-2 flex items-center justify-center text-slate-500 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <ul className="grid grid-cols-1 gap-1">
              {MORE_ITEMS.map((item, i) => {
                const Icon = item.icon;
                const active = activeAdminTab === item.id;
                const firstDemo = item.id === SECONDARY_NAV[0].id;
                return (
                  <li key={item.id}>
                    {firstDemo && (
                      <div className="pt-2 pb-1 px-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
                        Demo / Existing Modules <span className="normal-case font-semibold">(sample data)</span>
                      </div>
                    )}
                    <button
                      onClick={() => {
                        setActiveAdminTab(item.id);
                        setMoreOpen(false);
                      }}
                      aria-current={active ? 'page' : undefined}
                      className={`w-full min-h-12 flex items-center gap-3 px-3 rounded-xl text-left text-sm font-semibold cursor-pointer ${active ? 'bg-[#E11D48] text-white' : 'text-slate-700 hover:bg-rose-50'}`}
                      data-index={i}
                    >
                      <Icon className="w-5 h-5 shrink-0" />
                      <span className="flex-1">{item.label}</span>
                      <span className={`text-[11px] font-normal ${active ? 'text-rose-100' : 'text-slate-400'}`}>{item.description}</span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => {
                  setMoreOpen(false);
                  setActiveView('store');
                }}
                className="min-h-11 inline-flex items-center gap-1.5 px-4 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 cursor-pointer"
              >
                <Store className="w-4 h-4" /> View storefront
              </button>
              <ResetDemoButton className="min-h-11 inline-flex items-center gap-1.5 px-4 rounded-xl border border-rose-200 text-sm font-bold text-[#E11D48] cursor-pointer" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
