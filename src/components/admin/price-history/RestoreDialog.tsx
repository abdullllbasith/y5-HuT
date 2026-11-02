import React, { useEffect, useRef } from 'react';
import { PriceHistoryEntry } from '../../../types';
import { formatLKR } from '../../../lib/priceValidation';
import { Button } from '../../ui/Button';

interface Props {
  entry: PriceHistoryEntry;
  currentPrice: number;
  onCancel: () => void;
  onConfirm: () => void;
}

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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-ink/70 backdrop-blur-xs text-left font-ui">
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="restore-title"
        className="bg-paper rounded-t-3xl sm:rounded-3xl shadow-hard max-w-md w-full border border-line p-5 sm:p-6 space-y-4"
      >
        <div>
          <h3 id="restore-title" className="font-display text-lg font-bold text-ink">
            Restore Previous Counter Price?
          </h3>
          <p className="font-ui text-xs text-ink-soft mt-1">
            <strong>{entry.productName}</strong>{entry.label && ` · ${entry.label}`}{' '}
            <span className="font-data text-ink-soft font-semibold">{entry.sku}</span>
          </p>
        </div>

        <div className="bg-card p-4 rounded-2xl border border-line flex items-center justify-between text-xs">
          <span className="font-ui font-semibold text-ink-soft">Price Transition:</span>
          <span className="font-data tabular-nums text-sm font-bold">
            <span className="text-red line-through mr-1.5">{formatLKR(currentPrice)}</span> &rarr;{' '}
            <span className="text-ink font-extrabold">{formatLKR(entry.oldPriceLKR)}</span>
          </span>
        </div>

        {drifted && (
          <p role="alert" className="text-xs rounded-2xl border border-line bg-highlighter/30 text-ink p-3.5 leading-relaxed font-ui">
            The price has drifted since this entry was logged (it was set to {formatLKR(entry.newPriceLKR)}). Restoring will overwrite today's active counter price {formatLKR(currentPrice)}.
          </p>
        )}

        <p className="font-data text-[11px] text-ink-soft leading-normal">
          Only this specific variant will revert. The price restoration is immediately logged in the audit timeline as a new historical event.
        </p>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 pt-2">
          <Button
            ref={cancelRef}
            variant="ghost"
            type="button"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            type="button"
            onClick={onConfirm}
          >
            Confirm &amp; Restore Tag
          </Button>
        </div>
      </div>
    </div>
  );
};
