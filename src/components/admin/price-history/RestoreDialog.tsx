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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/60 backdrop-blur-xs">
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="restore-title"
        className="bg-white rounded-t-[24px] sm:rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 p-5 sm:p-6 space-y-3.5 text-left"
      >
        <h3 id="restore-title" className="text-base font-bold text-slate-900 font-sans">
          Restore Previous Price?
        </h3>
        <p className="text-xs text-slate-600">
          <strong>{entry.productName}</strong>{entry.label && ` · ${entry.label}`}{' '}
          <span className="font-mono text-slate-500 font-semibold">{entry.sku}</span>
        </p>

        <div className="bg-[#F7F8FA] p-3.5 rounded-xl border border-[#E5E7EB] flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">Price Transition:</span>
          <span className="font-mono tabular-nums text-sm font-bold">
            <span className="text-slate-400 line-through mr-1">{formatLKR(currentPrice)}</span> →{' '}
            <span className="text-[#E11D48]">{formatLKR(entry.oldPriceLKR)}</span>
          </span>
        </div>

        {drifted && (
          <p role="alert" className="text-xs rounded-xl border border-amber-300 bg-amber-50 text-amber-900 p-3 leading-relaxed">
            The price has changed since this entry was created (it was set to {formatLKR(entry.newPriceLKR)}). Restoring will replace today's active price {formatLKR(currentPrice)}.
          </p>
        )}

        <p className="text-[11px] text-slate-500 leading-normal">
          Only this specific variant will change. The price restoration is immediately appended to the audit history as a new logged event.
        </p>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2">
          <button
            ref={cancelRef}
            onClick={onCancel}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer min-h-[44px] flex items-center justify-center transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#E11D48] text-white text-xs font-bold hover:bg-[#BE123C] cursor-pointer min-h-[44px] flex items-center justify-center transition-colors shadow-xs"
          >
            Restore Price
          </button>
        </div>
      </div>
    </div>
  );
};
