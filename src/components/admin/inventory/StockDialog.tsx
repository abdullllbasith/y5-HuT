import React, { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { AdjustStockInput, useStore } from '../../../context/StoreContext';
import { STOCK_REASONS, StockMode, computeStock, stockLevel } from '../../../lib/stock';
import { StockReason } from '../../../types';
import { InventoryRow } from './inventoryRows';

interface Props {
  row: InventoryRow;
  onClose: () => void;
}

/** Set an exact count, or add/remove units, with a reason. Shows the storefront result before saving. */
export const StockDialog: React.FC<Props> = ({ row, onClose }) => {
  const { adjustStock } = useStore();
  const [mode, setMode] = useState<StockMode>('delta');
  const [value, setValue] = useState('');
  const [reason, setReason] = useState<StockReason | ''>('');
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => inputRef.current?.focus(), []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const check = value.trim() === '' ? null : computeStock(row.stock, mode, value);
  const after = check?.ok ? check.after : null;
  const level = after === null ? null : stockLevel(after, row.threshold);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) return setError('Choose a reason');
    const input: AdjustStockInput = { productId: row.productId, variantId: row.variantId, mode, value, reason, note };
    const result = adjustStock(input);
    if (!result.ok) return setError(result.error);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/60 backdrop-blur-xs">
      <form
        onSubmit={submit}
        role="dialog"
        aria-modal="true"
        aria-labelledby="stock-dialog-title"
        className="bg-white rounded-t-[24px] sm:rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 p-5 sm:p-6 space-y-3.5 max-h-[92vh] overflow-y-auto text-left"
      >
        <div className="flex items-start justify-between">
          <div>
            <h3 id="stock-dialog-title" className="text-base font-bold text-slate-900 font-sans">Adjust Stock</h3>
            <p className="text-xs text-slate-600 mt-0.5">{row.name}{row.label && ` · ${row.label}`}</p>
            <p className="text-[11px] font-mono text-slate-400 mt-0.5">{row.sku}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-bold" role="tablist">
          {([['delta', 'Add / Remove'], ['set', 'Set Exact Stock']] as [StockMode, string][]).map(([m, label]) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={mode === m}
              onClick={() => { setMode(m); setError(null); }}
              className={`flex-1 py-2 rounded-lg cursor-pointer transition-all text-xs font-semibold ${
                mode === m ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Quick adjustment buttons for fast mobile adjustments */}
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block mb-1.5 font-bold">
            Quick Adjustments
          </span>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
            {[
              { label: '+1', m: 'delta' as StockMode, v: '+1', r: 'received-shipment' as StockReason },
              { label: '+5', m: 'delta' as StockMode, v: '+5', r: 'received-shipment' as StockReason },
              { label: '+10', m: 'delta' as StockMode, v: '+10', r: 'received-shipment' as StockReason },
              { label: '−1', m: 'delta' as StockMode, v: '-1', r: 'store-sale' as StockReason },
              { label: '−5', m: 'delta' as StockMode, v: '-5', r: 'store-sale' as StockReason },
              { label: 'Set 0', m: 'set' as StockMode, v: '0', r: 'damaged' as StockReason },
            ].map((q) => (
              <button
                key={q.label}
                type="button"
                onClick={() => {
                  setMode(q.m);
                  setValue(q.v);
                  if (!reason) setReason(q.r);
                  setError(null);
                }}
                className={`py-2 px-1 rounded-xl border text-xs font-mono font-bold transition-all min-h-[38px] flex items-center justify-center cursor-pointer ${
                  mode === q.m && value === q.v
                    ? 'border-[#E11D48] bg-rose-50 text-[#E11D48]'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                {q.label}
              </button>
            ))}
          </div>
        </div>

        <label className="block text-xs font-bold text-slate-700 space-y-1">
          <span>{mode === 'delta' ? 'Units to add (use minus to remove, e.g. -2)' : 'New stock count'}</span>
          <input
            ref={inputRef}
            inputMode="numeric"
            value={value}
            onChange={(e) => { setValue(e.target.value); setError(null); }}
            placeholder={mode === 'delta' ? '+10 or -2' : 'e.g. 0'}
            aria-invalid={check?.ok === false}
            className={`w-full px-3 py-2.5 rounded-xl border text-sm font-mono min-h-[42px] focus:outline-none focus:ring-2 focus:ring-[#E11D48]/30 ${
              check?.ok === false ? 'border-rose-400 bg-rose-50' : 'border-slate-200 bg-white'
            }`}
          />
        </label>

        {/* Real-time stock change preview */}
        <div aria-live="polite" className="rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] p-3 text-xs space-y-1">
          {check === null ? (
            <span className="text-slate-500">Current stock: <strong className="text-slate-900 font-mono">{row.stock} units</strong></span>
          ) : check.ok ? (
            <>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 font-medium">Stock Preview:</span>
                <span className="font-mono text-xs font-bold text-slate-900">
                  {row.stock} → <span className="text-[#E11D48]">{check.after} units</span>
                </span>
              </div>
              <div className={`text-xs font-bold ${level === 'out' ? 'text-rose-600' : level === 'low' ? 'text-amber-700' : 'text-emerald-700'}`}>
                Storefront shows: {level === 'out' ? '● Out of Stock' : level === 'low' ? `⚠ Low Stock (${check.after} left)` : '✓ In Stock'}
              </div>
            </>
          ) : (
            <span className="text-rose-600 font-bold">{check.error}</span>
          )}
        </div>

        <label className="block text-xs font-bold text-slate-700 space-y-1">
          <span>Reason *</span>
          <select
            value={reason}
            onChange={(e) => { setReason(e.target.value as StockReason); setError(null); }}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white min-h-[42px] focus:outline-none focus:ring-2 focus:ring-[#E11D48]/30"
          >
            <option value="">Choose an adjustment reason…</option>
            {STOCK_REASONS.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
          </select>
        </label>

        <label className="block text-xs font-bold text-slate-700 space-y-1">
          <span>Note (optional)</span>
          <input
            value={note}
            maxLength={120}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Received weekly container"
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm min-h-[42px] focus:outline-none focus:ring-2 focus:ring-[#E11D48]/30"
          />
        </label>

        {error && <p role="alert" className="text-xs font-bold text-rose-600 bg-rose-50 p-2 rounded-lg border border-rose-200">{error}</p>}

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer min-h-[44px] flex items-center justify-center transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!check?.ok}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#E11D48] text-white text-xs font-bold hover:bg-[#BE123C] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer min-h-[44px] flex items-center justify-center transition-colors shadow-xs"
          >
            Save Stock
          </button>
        </div>
      </form>
    </div>
  );
};
