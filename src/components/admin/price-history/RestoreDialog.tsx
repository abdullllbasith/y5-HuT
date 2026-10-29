import React, { useEffect, useRef } from 'react';
import { PriceHistoryEntry } from '../../../types';
import { formatLKR } from '../../../lib/priceValidation';

interface Props {
  entry: PriceHistoryEntry;
  currentPrice: number;
  onCancel: () => void;
  onConfirm: () => void;
}

/** Restoring changes exactly one variant, as a new logged edit. Older history is never rewritten. */
export const RestoreDialog: React.FC<Props> = ({ entry, currentPrice, onCancel, onConfirm }) => {
  const cancelRef = useRef<HTMLButtonElement>(null);
  useEffect(() => cancelRef.current?.focus(), []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onCancel();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onCancel]);
  const drifted = currentPrice !== entry.newPriceLKR;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
      <div role="alertdialog" aria-modal="true" aria-labelledby="restore-title" className="bg-white rounded-xl shadow-xl max-w-md w-full border border-slate-200 p-5 space-y-3">
        <h3 id="restore-title" className="text-base font-bold text-slate-900">Restore previous price?</h3>
        <p className="text-xs text-slate-600">
          <strong>{entry.productName}</strong>{entry.label && ` · ${entry.label}`} <span className="font-mono text-slate-400">{entry.sku}</span>
        </p>
        <p className="text-sm font-mono tabular-nums">
          {formatLKR(currentPrice)} → <strong>{formatLKR(entry.oldPriceLKR)}</strong>
        </p>
        {drifted && (
          <p role="alert" className="text-[11px] rounded-lg border border-amber-300 bg-amber-50 text-amber-900 px-3 py-2">
            The price has changed since this entry (it was set to {formatLKR(entry.newPriceLKR)}). Restoring will replace today's price {formatLKR(currentPrice)}.
          </p>
        )}
        <p className="text-[11px] text-slate-500">Only this one variant changes. The restore is added to the history as a new entry.</p>
        <div className="flex justify-end gap-2">
          <button ref={cancelRef} onClick={onCancel} className="px-4 py-2 text-xs font-bold text-slate-600 cursor-pointer">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-lg bg-[#E11D48] text-white text-xs font-bold hover:bg-[#BE123C] cursor-pointer">Restore price</button>
        </div>
      </div>
    </div>
  );
};
