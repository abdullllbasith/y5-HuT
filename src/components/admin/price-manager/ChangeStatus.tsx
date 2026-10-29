import React from 'react';
import { DraftEntry } from './usePriceDraft';
import { formatLKR, formatPercent } from '../../../lib/priceValidation';

export const ChangeStatus: React.FC<{ entry?: DraftEntry; current: number }> = ({ entry, current }) => {
  if (!entry) return <span className="text-[11px] text-slate-400">No change</span>;
  if (entry.error) return <span className="text-[11px] font-bold text-rose-600">Invalid</span>;
  return (
    <div className="text-[11px] leading-snug">
      <span className="font-bold text-amber-700">Unsaved</span>
      <div className="font-mono tabular-nums text-slate-600">
        {formatLKR(current)} → <strong className="text-slate-900">{formatLKR(entry.newPrice!)}</strong>
      </div>
      <span className={entry.large ? 'font-bold text-rose-600' : 'text-slate-500'}>
        {formatPercent(entry.pct!)}
        {entry.large && ' · large change'}
      </span>
    </div>
  );
};

export const formatUpdated = (iso?: string) => (iso ? new Date(iso).toLocaleString() : '—');
