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
        className={className ?? 'inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border border-rose-200 text-[#E11D48] hover:bg-rose-50 cursor-pointer'}
      >
        <RotateCcw className="w-3.5 h-3.5" /> {label}
      </button>
      {done && !open && <span role="status" className="text-[11px] font-semibold text-emerald-700">Demo data reset.</span>}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
          <div role="alertdialog" aria-modal="true" aria-labelledby="reset-title" aria-describedby="reset-desc" className="bg-white rounded-xl shadow-xl max-w-md w-full border border-slate-200 p-5 space-y-3">
            <div className="flex items-start justify-between">
              <h3 id="reset-title" className="text-base font-bold text-slate-900">Reset all demo data?</h3>
              <button onClick={() => setOpen(false)} aria-label="Close" className="text-slate-400 hover:text-slate-700 cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <div id="reset-desc" className="text-xs text-slate-600 space-y-2">
              <p>This returns <strong>this browser's</strong> demo to the original sample data:</p>
              <ul className="list-disc pl-5">
                <li>Products, prices, variants and stock (including products you added)</li>
                <li>Sample orders, clients, the price history and the stock log</li>
                <li>The shopping cart</li>
              </ul>
              <p>Nothing outside this browser is affected, and nothing can be recovered afterwards. Other devices and other browsers have their own separate demo data.</p>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button ref={cancelRef} onClick={() => setOpen(false)} className="px-4 py-2 text-xs font-bold text-slate-600 cursor-pointer">Cancel</button>
              <button
                onClick={() => {
                  resetDemoData();
                  setOpen(false);
                  setDone(true);
                }}
                className="px-4 py-2 rounded-lg bg-[#E11D48] text-white text-xs font-bold hover:bg-[#BE123C] cursor-pointer"
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
