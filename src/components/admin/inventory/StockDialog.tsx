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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/50 backdrop-blur-xs">
      <form
        onSubmit={submit}
        role="dialog"
        aria-modal="true"
        aria-labelledby="stock-dialog-title"
        className="bg-white rounded-t-xl sm:rounded-xl shadow-xl max-w-md w-full border border-slate-200 p-5 space-y-3"
      >
        <div className="flex items-start justify-between">
          <div>
            <h3 id="stock-dialog-title" className="text-base font-bold text-slate-900">Adjust stock</h3>
            <p className="text-xs text-slate-500">{row.name}{row.label && ` · ${row.label}`}</p>
            <p className="text-[10px] font-mono text-slate-400">{row.sku}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="text-slate-400 hover:text-slate-700 cursor-pointer"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex rounded-lg bg-slate-100 p-1 text-xs font-bold" role="tablist">
          {([['delta', 'Add / remove'], ['set', 'Set exact stock']] as [StockMode, string][]).map(([m, label]) => (
            <button key={m} type="button" role="tab" aria-selected={mode === m} onClick={() => { setMode(m); setError(null); }}
              className={`flex-1 py-1.5 rounded-md cursor-pointer ${mode === m ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}>
              {label}
            </button>
          ))}
        </div>

        <label className="block text-xs font-bold text-slate-700">
          {mode === 'delta' ? 'Units to add (use a minus to remove, e.g. -2)' : 'New stock count'}
          <input ref={inputRef} inputMode="numeric" value={value} onChange={(e) => { setValue(e.target.value); setError(null); }}
            placeholder={mode === 'delta' ? '+10 or -2' : 'e.g. 0'} aria-invalid={check?.ok === false}
            className={`mt-1 w-full px-3 py-2 rounded-lg border text-sm font-mono ${check?.ok === false ? 'border-rose-400 bg-rose-50' : 'border-slate-200'}`} />
        </label>

        <div aria-live="polite" className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 text-xs">
          {check === null ? (
            <span className="text-slate-500">Current stock: <strong>{row.stock}</strong></span>
          ) : check.ok ? (
            <>
              Stock <strong className="font-mono">{row.stock} → {check.after}</strong>
              <div className={level === 'out' ? 'text-rose-600 font-bold' : level === 'low' ? 'text-amber-700 font-bold' : 'text-emerald-700'}>
                Storefront will show: {level === 'out' ? 'Out of Stock' : level === 'low' ? `Only ${check.after} left` : 'In Stock'}
              </div>
            </>
          ) : (
            <span className="text-rose-600 font-bold">{check.error}</span>
          )}
        </div>

        <label className="block text-xs font-bold text-slate-700">
          Reason *
          <select value={reason} onChange={(e) => { setReason(e.target.value as StockReason); setError(null); }} className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white">
            <option value="">Choose a reason…</option>
            {STOCK_REASONS.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
          </select>
        </label>
        <label className="block text-xs font-bold text-slate-700">
          Note (optional)
          <input value={note} maxLength={120} onChange={(e) => setNote(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" />
        </label>

        {error && <p role="alert" className="text-xs font-bold text-rose-600">{error}</p>}

        <div className="flex justify-end gap-2 pt-1">
          <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-bold text-slate-600 cursor-pointer">Cancel</button>
          <button type="submit" disabled={!check?.ok} className="px-4 py-2 rounded-lg bg-[#E11D48] text-white text-xs font-bold hover:bg-[#BE123C] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
            Save stock
          </button>
        </div>
      </form>
    </div>
  );
};
