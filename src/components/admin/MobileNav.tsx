import React, { useEffect, useRef, useState } from 'react';
import { Home, MoreHorizontal, Smartphone, Store, Tags, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { AdminTab } from '../../types';
import { PRIMARY_NAV, SECONDARY_NAV } from './adminNav';
import { ResetDemoButton } from './ResetDemoButton';

export const BOTTOM_NAV_HEIGHT = '3.75rem';

const MAIN_TABS: { id: AdminTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'overview', label: 'Today', icon: Home },
  { id: 'price-manager', label: 'Prices', icon: Tags },
  { id: 'products', label: 'Products', icon: Smartphone },
];
const MAIN_IDS = MAIN_TABS.map((t) => t.id);
const MORE_ITEMS = [...PRIMARY_NAV.filter((n) => !MAIN_IDS.includes(n.id)), ...SECONDARY_NAV];

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
    `flex-1 flex flex-col items-center justify-center gap-1 font-ui text-[11px] font-bold cursor-pointer transition-colors min-h-[44px] ${
      active ? 'text-red' : 'text-ink-soft hover:text-ink'
    }`;

  return (
    <>
      <nav
        aria-label="Admin navigation"
        className="lg:hidden fixed inset-x-0 bottom-0 z-40 flex border-t border-line bg-paper/95 backdrop-blur pb-[env(safe-area-inset-bottom)] shadow-hard"
        style={{ minHeight: BOTTOM_NAV_HEIGHT }}
      >
        {MAIN_TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveAdminTab(id)}
            aria-current={activeAdminTab === id ? 'page' : undefined}
            className={tab(activeAdminTab === id)}
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </button>
        ))}
        <button
          onClick={() => setMoreOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={moreOpen}
          className={tab(moreActive)}
        >
          <MoreHorizontal className="w-5 h-5" />
          <span>More</span>
        </button>
      </nav>

      {moreOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 flex items-end bg-ink/70 backdrop-blur-xs"
          onClick={() => setMoreOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="More admin pages"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-h-[85vh] overflow-y-auto rounded-t-3xl bg-paper p-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))] space-y-4 shadow-hard text-left"
          >
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <h2 className="font-display text-lg font-bold text-ink">More Console Tools</h2>
              <button
                ref={closeRef}
                onClick={() => setMoreOpen(false)}
                aria-label="Close menu"
                className="w-10 h-10 rounded-full flex items-center justify-center text-ink-soft hover:text-ink cursor-pointer min-w-[44px] min-h-[44px]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <ul className="grid grid-cols-1 gap-1.5">
              {MORE_ITEMS.map((item, i) => {
                const Icon = item.icon;
                const active = activeAdminTab === item.id;
                const firstDemo = item.id === SECONDARY_NAV[0].id;
                return (
                  <li key={item.id}>
                    {firstDemo && (
                      <div className="pt-3 pb-1.5 px-2 font-data text-[10px] font-bold uppercase tracking-wider text-ink-soft">
                        Simulated Counter Modules
                      </div>
                    )}
                    <button
                      onClick={() => {
                        setActiveAdminTab(item.id);
                        setMoreOpen(false);
                      }}
                      aria-current={active ? 'page' : undefined}
                      className={`w-full min-h-[48px] flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left font-ui text-xs font-bold cursor-pointer transition-colors ${
                        active
                          ? 'bg-ink text-paper shadow-hard-sm'
                          : 'bg-card text-ink border border-line hover:border-ink'
                      }`}
                      data-index={i}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-red' : 'text-ink-soft'}`} />
                      <span className="flex-1">{item.label}</span>
                      <span className={`font-data text-[10px] ${active ? 'text-red' : 'text-ink-soft'}`}>
                        {item.description}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-line">
              <button
                onClick={() => {
                  setMoreOpen(false);
                  setActiveView('store');
                }}
                className="min-h-[44px] inline-flex items-center gap-2 px-4 rounded-full border border-line bg-card font-ui text-xs font-bold text-ink hover:border-ink transition-colors cursor-pointer"
              >
                <Store className="w-4 h-4 text-red" />
                <span>View storefront</span>
              </button>
              <ResetDemoButton />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
