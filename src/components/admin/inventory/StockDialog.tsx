import React, { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { AdjustStockInput, useStore } from '../../../context/StoreContext';
import { STOCK_REASONS, StockMode, computeStock, stockLevel } from '../../../lib/stock';
import { StockReason } from '../../../types';
import { InventoryRow } from './inventoryRows';
import { Button } from '../../ui/Button';
import { Dot } from '../../ui/Dot';

interface Props {
  row: InventoryRow;
  onClose: () => void;
}

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
    if (!reason) return setError('Choose an adjustment reason');
    const input: AdjustStockInput = { productId: row.productId, variantId: row.variantId, mode, value, reason, note };
    const result = adjustStock(input);
    if (!result.ok) return setError(result.error);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-ink/70 backdrop-blur-xs font-ui text-left">
      <form
        onSubmit={submit}
        role="dialog"
        aria-modal="true"
        aria-labelledby="stock-dialog-title"
        className="bg-paper rounded-t-3xl sm:rounded-3xl shadow-hard max-w-md w-full border border-line p-5 sm:p-6 space-y-4 max-h-[92vh] overflow-y-auto"
      >
        <div className="flex items-start justify-between border-b border-line pb-3">
          <div>
            <div className="flex items-center gap-1.5 font-data text-[10px] font-bold uppercase tracking-wider text-red">
              <Dot tone="red" size="xs" />
              <span>Counter Stock Adjustment</span>
            </div>
            <h3 id="stock-dialog-title" className="font-display text-lg font-bold text-ink mt-0.5">
              {row.name}
            </h3>
            <p className="font-data text-xs text-ink-soft">
              {row.label ? `${row.label} · ` : ''}{row.sku}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 flex items-center justify-center rounded-full text-ink-soft hover:text-ink hover:bg-paper-sunk cursor-pointer transition-colors min-w-[36px] min-h-[36px]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex rounded-xl bg-card border border-line p-1 text-xs font-bold" role="tablist">
          {([['delta', 'Add / Remove Units'], ['set', 'Set Exact Count']] as [StockMode, string][]).map(([m, label]) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={mode === m}
              onClick={() => { setMode(m); setError(null); }}
              className={`flex-1 py-2 rounded-lg cursor-pointer transition-all text-xs font-semibold ${
                mode === m ? 'bg-ink text-paper shadow-hard-sm' : 'text-ink-soft hover:text-ink'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Quick adjustment buttons for fast mobile adjustments */}
        <div>
          <span className="font-data text-[10px] uppercase tracking-wider text-ink-soft block mb-1.5 font-bold">
            Quick Counter Adjustments
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
                className={`py-2 px-1 rounded-xl border text-xs font-data font-bold transition-all min-h-[38px] flex items-center justify-center cursor-pointer ${
                  mode === q.m && value === q.v
                    ? 'border-ink bg-highlighter text-ink shadow-hard-sm'
                    : 'border-line bg-card text-ink hover:border-ink'
                }`}
              >
                {q.label}
              </button>
            ))}
          </div>
        </div>

        <label className="block text-xs font-bold text-ink space-y-1">
          <span>{mode === 'delta' ? 'Units to add (use minus to deduct, e.g. -2)' : 'New target stock count'}</span>
          <input
            ref={inputRef}
            inputMode="numeric"
            value={value}
            onChange={(e) => { setValue(e.target.value); setError(null); }}
            placeholder={mode === 'delta' ? '+10 or -2' : 'e.g. 0'}
            aria-invalid={check?.ok === false}
            className={`w-full px-3.5 py-2.5 rounded-xl border font-data text-sm min-h-[42px] focus:outline-none focus:border-ink ${
              check?.ok === false ? 'border-red bg-red-wash text-red' : 'border-line bg-card text-ink'
            }`}
          />
        </label>

        {/* Real-time stock change preview */}
        <div aria-live="polite" className="rounded-2xl bg-card border border-line p-3.5 text-xs space-y-1.5 shadow-2xs">
          {check === null ? (
            <span className="font-data text-ink-soft">
              Current inventory: <strong className="text-ink">{row.stock} units</strong>
            </span>
          ) : check.ok ? (
            <>
              <div className="flex items-center justify-between">
                <span className="font-ui font-semibold text-ink-soft">Stock Transition:</span>
                <span className="font-data text-xs font-bold text-ink">
                  {row.stock} &rarr; <span className="text-red font-extrabold">{check.after} units</span>
                </span>
              </div>
              <div className={`font-data text-xs font-bold flex items-center gap-1.5 ${level === 'out' ? 'text-ink line-through' : level === 'low' ? 'text-low' : 'text-go'}`}>
                <Dot tone={level === 'out' ? 'ink' : level === 'low' ? 'low' : 'go'} size="xs" />
                <span>Storefront displays: {level === 'out' ? 'Sold Out' : level === 'low' ? `Low Stock (${check.after} left)` : 'In Stock'}</span>
              </div>
            </>
          ) : (
            <span className="text-red font-bold font-data">{check.error}</span>
          )}
        </div>

        <label className="block text-xs font-bold text-ink space-y-1">
          <span>Audit Reason *</span>
          <select
            value={reason}
            onChange={(e) => { setReason(e.target.value as StockReason); setError(null); }}
            className="w-full px-3.5 py-2.5 rounded-xl border border-line text-xs font-ui bg-card text-ink min-h-[42px] cursor-pointer"
          >
            <option value="">Choose an adjustment reason…</option>
            {STOCK_REASONS.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
          </select>
        </label>

        <label className="block text-xs font-bold text-ink space-y-1">
          <span>Log Note (optional)</span>
          <input
            value={note}
            maxLength={120}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Received weekly shipment from supplier"
            className="w-full px-3.5 py-2.5 rounded-xl border border-line text-xs font-ui bg-card text-ink min-h-[42px] focus:outline-none focus:border-ink"
          />
        </label>

        {error && <p role="alert" className="text-xs font-bold text-red bg-red-wash p-2.5 rounded-xl border border-red/30">{error}</p>}

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 pt-2">
          <Button
            variant="ghost"
            type="button"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={!check?.ok}
          >
            Save Stock
          </Button>
        </div>
      </form>
    </div>
  );
};
