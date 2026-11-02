import React from 'react';
import { DraftEntry } from './usePriceDraft';
import { formatLKR, formatPercent } from '../../../lib/priceValidation';

export const ChangeStatus: React.FC<{ entry?: DraftEntry; current: number }> = ({ entry, current }) => {
  if (!entry) return <span className="text-[11px] text-ink-muted font-mono">No change</span>;
  if (entry.error) return <span className="text-[11px] font-bold text-red font-mono">Invalid</span>;
  return (
    <div className="text-[11px] leading-snug">
      <span className="font-bold text-amber-800 font-mono">Unsaved</span>
      <div className="font-data tabular-nums text-ink-muted">
        {formatLKR(current)} → <strong className="text-ink">{formatLKR(entry.newPrice!)}</strong>
      </div>
      <span className={entry.large ? 'font-bold text-red font-mono' : 'text-ink-muted font-mono'}>
        {formatPercent(entry.pct!)}
        {entry.large && ' · large'}
      </span>
    </div>
  );
};

export const formatUpdated = (iso?: string) => (iso ? new Date(iso).toLocaleString() : '—');
