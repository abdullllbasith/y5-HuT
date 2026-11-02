import React, { useEffect, useRef, useState } from 'react';
import { RotateCcw, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

/** Reset button with an accessible confirmation. Affects only this browser's demo data. */
export const ResetDemoButton: React.FC<{ className?: string; label?: string }> = ({ className, label = 'Reset demo data' }) => {
  const { resetDemoData } = useStore();
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    cancelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <button
        onClick={() => {
          setDone(false);
          setOpen(true);
        }}
        className={className ?? 'inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border border-red/30 text-red hover:bg-red/5 cursor-pointer transition-colors'}
      >
        <RotateCcw className="w-3.5 h-3.5" /> {label}
      </button>
      {done && !open && <span role="status" className="text-[11px] font-semibold text-emerald-700">Demo data reset.</span>}

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-ink/60 backdrop-blur-xs">
          <div role="alertdialog" aria-modal="true" aria-labelledby="reset-title" aria-describedby="reset-desc" className="bg-paper-card rounded-t-3xl sm:rounded-2xl shadow-paper max-w-md w-full border border-ink/15 p-5 sm:p-6 space-y-3.5 text-left">
            <div className="flex items-start justify-between">
              <h3 id="reset-title" className="text-base font-bold text-ink font-display">Reset all demo data?</h3>
              <button onClick={() => setOpen(false)} aria-label="Close" className="w-8 h-8 flex items-center justify-center rounded-xl text-ink-muted hover:text-ink hover:bg-paper-sunk cursor-pointer transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div id="reset-desc" className="text-xs text-ink-muted space-y-2">
              <p>This returns <strong className="text-ink">this browser's</strong> demo to the original sample data:</p>
              <ul className="list-disc pl-5 space-y-0.5">
                <li>Products, prices, variants and stock (including products you added)</li>
                <li>Sample orders, clients, the price history and the stock log</li>
                <li>The shopping cart</li>
              </ul>
              <p className="text-[11px] text-ink-muted/70 font-mono">Nothing outside this browser is affected, and nothing can be recovered afterwards. Other devices and browsers maintain their own independent demo state.</p>
            </div>
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2">
              <button ref={cancelRef} onClick={() => setOpen(false)} className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-ink/15 bg-paper-card text-xs font-bold text-ink hover:bg-paper-sunk cursor-pointer min-h-[44px] flex items-center justify-center transition-colors">Cancel</button>
              <button
                onClick={() => {
                  resetDemoData();
                  setOpen(false);
                  setDone(true);
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-red text-paper text-xs font-bold hover:bg-red/90 cursor-pointer min-h-[44px] flex items-center justify-center transition-colors shadow-sm"
              >
                Yes, reset demo data
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
