import React, { useState } from 'react';
import { Shield, RotateCcw, X, ChevronDown, Check } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Dot } from '../ui/Dot';
import { UserRole } from '../../types';

export const HeaderTopStrip: React.FC = () => {
  const { currentUser, switchUserRole, resetDemoData } = useStore();
  const [dismissed, setDismissed] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

  if (dismissed) return null;

  const roles: { id: UserRole; label: string; desc: string }[] = [
    { id: 'super_admin', label: 'Super Admin', desc: 'Full store owner and pricing access' },
    { id: 'inventory_manager', label: 'Inventory Manager', desc: 'Stock audit and warehouse adjustments' },
    { id: 'sales_rep', label: 'Sales Rep', desc: 'Client CRM and corporate orders' },
    { id: 'customer', label: 'Shopper', desc: 'Public customer storefront view' },
  ];

  return (
    <>
      <div className="bg-ink text-white text-[11px] py-1.5 px-3 sm:px-6 border-b border-line/20 select-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Left: Live status Dot + Honest Demo Notice */}
          <div className="flex items-center gap-2 min-w-0">
            <Dot tone="go" pulse size="xs" />
            <p className="truncate text-white/80 font-data">
              <strong className="text-white uppercase tracking-wider">DEMO PREVIEW:</strong>{' '}
              Data is stored locally in this browser. Simulated checkout, inventory &amp; roles.
            </p>
          </div>

          {/* Right: Demo Tools Menu & Dismiss */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Demo Tools Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setDemoMenuOpen(!demoMenuOpen)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/15 text-white text-[10px] font-data font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                aria-expanded={demoMenuOpen}
                aria-label="Demo simulation settings"
              >
                <Shield className="w-3 h-3 text-red" />
                <span className="hidden sm:inline text-white/70">Role:</span>
                <span className="text-white capitalize truncate max-w-[90px]">
                  {currentUser.role.replace('_', ' ')}
                </span>
                <ChevronDown className="w-2.5 h-2.5 text-white/60" />
              </button>

              {demoMenuOpen && (
                <div
                  className="absolute right-0 top-full mt-1.5 w-64 bg-surface text-ink border border-line rounded-xl shadow-lg p-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                  role="menu"
                >
                  <div className="px-2 py-1.5 border-b border-line mb-1">
                    <span className="font-data text-[10px] uppercase font-bold text-ink-soft block">
                      Simulated Staff Roles
                    </span>
                    <span className="text-[10px] text-ink-soft">
                      Demo aid only; no authentication enforced.
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    {roles.map((r) => {
                      const active = currentUser.role === r.id;
                      return (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => {
                            switchUserRole(r.id);
                            setDemoMenuOpen(false);
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                            active
                              ? 'bg-ink text-white font-semibold'
                              : 'text-ink hover:bg-soft-surface'
                          }`}
                        >
                          <div>
                            <div className="font-ui font-medium">{r.label}</div>
                            <div className={`text-[10px] ${active ? 'text-white/70' : 'text-ink-soft'}`}>
                              {r.desc}
                            </div>
                          </div>
                          {active && <Check className="w-3.5 h-3.5 text-red shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-2 mt-2 border-t border-line">
                    <button
                      type="button"
                      onClick={() => {
                        setDemoMenuOpen(false);
                        setConfirmResetOpen(true);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-data font-semibold text-red hover:bg-red-wash transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset Demo Data to Original</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Dismiss strip for this session */}
            <button
              type="button"
              onClick={() => setDismissed(true)}
              className="p-1 rounded text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Dismiss demo banner"
              title="Dismiss top notice"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      {confirmResetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-xs">
          <div className="bg-surface text-ink border border-line rounded-2xl shadow-sheet max-w-sm w-full p-5 space-y-3.5 text-left">
            <h3 className="font-display font-bold text-lg text-ink">Reset Demo Data?</h3>
            <p className="font-ui text-xs text-ink-soft leading-relaxed">
              This resets all catalog prices, stock adjustments, orders, and price history in <strong>this browser</strong> back to the initial sample data.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmResetOpen(false)}
                className="px-3.5 py-2 rounded-xl border border-line bg-surface text-ink font-ui text-xs font-semibold hover:bg-soft-surface cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  resetDemoData();
                  setConfirmResetOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-red text-white font-ui text-xs font-semibold hover:bg-red-ink shadow-sm cursor-pointer"
              >
                Yes, Reset Data
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

