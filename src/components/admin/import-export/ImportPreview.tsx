import React from 'react';
import { AlertTriangle, Download } from 'lucide-react';
import { ImportRow, ImportSummary, STATUS_LABEL, ImportStatus } from '../../../lib/priceImport';
import { formatLKR, formatPercent } from '../../../lib/priceValidation';

interface Props {
  fileName: string;
  rows: ImportRow[];
  summary: ImportSummary;
  excluded: Set<number>;
  largeAck: boolean;
  onLargeAck: (v: boolean) => void;
  onToggle: (line: number) => void;
  onEditPrice: (line: number, raw: string) => void;
  onErrorReport: () => void;
  onApply: () => void;
  onCancel: () => void;
}

const BADGE: Record<ImportStatus, string> = {
  change: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  unchanged: 'bg-paper-sunk text-ink-muted border-ink/10',
  invalid: 'bg-rose-50 text-rose-800 border-rose-200',
  'unknown-sku': 'bg-rose-50 text-rose-800 border-rose-200',
  'duplicate-sku': 'bg-amber-50 text-amber-800 border-amber-200',
  'duplicate-row': 'bg-amber-50 text-amber-800 border-amber-200',
};

const Tile: React.FC<{ label: string; value: number; tone?: string }> = ({
  label,
  value,
  tone = 'bg-paper-sunk text-ink border-ink/10',
}) => (
  <div className={`rounded-xl p-2.5 text-center border ${tone}`}>
    <strong className="block text-lg font-bold font-data tabular-nums">{value}</strong>
    <span className="text-[10px] font-mono uppercase tracking-wide text-ink-muted">{label}</span>
  </div>
);

/** Dry run: nothing here has changed any price. Matches the Smart Price Manager review UX. */
export const ImportPreview: React.FC<Props> = ({
  fileName,
  rows,
  summary,
  excluded,
  largeAck,
  onLargeAck,
  onToggle,
  onEditPrice,
  onErrorReport,
  onApply,
  onCancel,
}) => {
  const applicable = rows.filter((r) => r.status === 'change' && !excluded.has(r.line));
  const largeCount = applicable.filter((r) => r.large).length;
  const problems = summary.invalid + summary.unknown + summary.duplicateSku + summary.duplicateRow;
  const blocked = applicable.length === 0 || (largeCount > 0 && !largeAck);

  const affectedModels = new Set(applicable.map((r) => r.target?.productId).filter(Boolean)).size;

  return (
    <section
      aria-label="Import preview"
      className="bg-paper-card rounded-2xl border border-ink/10 p-5 sm:p-6 space-y-4 shadow-paper text-left"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-red">
            CSV Dry Run Preview
          </div>
          <h3 className="text-base font-bold text-ink font-display mt-0.5">
            Previewing: {fileName}
          </h3>
          <p className="text-xs text-ink-muted">
            Review changes, correct prices inline, or toggle exclusions before applying.
          </p>
        </div>
        <button
          onClick={onCancel}
          className="text-xs font-semibold text-ink-muted hover:text-red transition-colors cursor-pointer"
        >
          Cancel Import
        </button>
      </div>

      {/* Scope Callout matching Smart Price Manager */}
      <div className="p-3.5 bg-paper-sunk rounded-xl border border-ink/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div>
          <span className="font-bold text-ink block">
            Scope Summary: {applicable.length} prices will be updated across {affectedModels} models.
          </span>
          <span className="text-ink-muted text-[11px] block mt-0.5">
            {excluded.size > 0 ? `${excluded.size} rows excluded from publication.` : 'All valid changed rows included.'}
          </span>
        </div>
        <span className="text-[10px] font-mono font-bold bg-paper-card px-2.5 py-1 rounded-full border border-ink/10 text-ink-muted shrink-0 self-start sm:self-auto">
          Dry Run Active
        </span>
      </div>

      {/* Summary Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        <Tile label="Rows" value={summary.total} />
        <Tile label="Matched" value={summary.matched} />
        <Tile label="Will change" value={summary.changed} tone="bg-emerald-50 text-emerald-800 border-emerald-200" />
        <Tile label="Unchanged" value={summary.unchanged} />
        <Tile label="Invalid" value={summary.invalid} tone={summary.invalid ? 'bg-rose-50 text-rose-800 border-rose-200' : undefined} />
        <Tile label="Unknown SKU" value={summary.unknown} tone={summary.unknown ? 'bg-rose-50 text-rose-800 border-rose-200' : undefined} />
        <Tile label="Duplicate SKU" value={summary.duplicateSku} tone={summary.duplicateSku ? 'bg-amber-50 text-amber-800 border-amber-200' : undefined} />
        <Tile label="Duplicate rows" value={summary.duplicateRow} tone={summary.duplicateRow ? 'bg-amber-50 text-amber-800 border-amber-200' : undefined} />
      </div>

      {/* Table Preview (Desktop / Tablet) */}
      <div className="hidden md:block overflow-x-auto border border-ink/10 rounded-xl">
        <table className="w-full text-xs">
          <thead className="bg-paper-sunk text-ink-muted uppercase tracking-wider text-[10px] font-mono">
            <tr>
              <th className="px-3 py-2.5 text-left w-8"><span className="sr-only">Include</span></th>
              <th className="px-3 py-2.5 text-left">Line</th>
              <th className="px-3 py-2.5 text-left">SKU &amp; Model</th>
              <th className="px-3 py-2.5 text-right">Current</th>
              <th className="px-3 py-2.5 text-right">New Price</th>
              <th className="px-3 py-2.5 text-left">Result Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/5 bg-paper-card">
            {rows.map((r) => {
              const off = r.status === 'change' && excluded.has(r.line);
              return (
                <tr key={r.line} className={off ? 'opacity-40 bg-paper-sunk/50' : r.status === 'change' ? 'hover:bg-paper-sunk/60' : 'bg-paper-sunk/20'}>
                  <td className="px-3 py-2.5">
                    {r.status === 'change' && (
                      <input
                        type="checkbox"
                        aria-label={`Apply line ${r.line} (${r.sku})`}
                        checked={!excluded.has(r.line)}
                        onChange={() => onToggle(r.line)}
                        className="w-4 h-4 accent-red cursor-pointer"
                      />
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-ink-muted font-mono text-[11px]">{r.line}</td>
                  <td className="px-3 py-2.5">
                    <div className="font-mono font-bold text-ink">{r.sku || '—'}</div>
                    {r.target && <div className="text-[11px] text-ink-muted">{r.target.name}</div>}
                  </td>
                  <td className="px-3 py-2.5 text-right font-data tabular-nums text-ink-muted">
                    {r.target ? formatLKR(r.target.priceLKR) : '—'}
                  </td>
                  <td className="px-3 py-2.5 text-right">
                    {r.target ? (
                      <div className="inline-flex flex-col items-end">
                        <input
                          inputMode="decimal"
                          aria-label={`New price for line ${r.line}`}
                          value={r.rawPrice}
                          onChange={(e) => onEditPrice(r.line, e.target.value)}
                          className={`w-28 px-2 py-1 rounded-lg border text-right font-data tabular-nums text-xs ${
                            r.status === 'invalid'
                              ? 'border-rose-400 bg-rose-50 text-rose-900'
                              : 'border-ink/20 bg-paper focus:border-red focus:outline-none text-ink'
                          }`}
                        />
                        {r.status === 'change' && (
                          <span className={`text-[10px] font-mono mt-0.5 ${r.large ? 'text-red font-bold' : 'text-ink-muted'}`}>
                            {formatPercent(r.pct!)}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="font-data text-ink-muted">{r.rawPrice || '—'}</span>
                    )}
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${BADGE[r.status]}`}>
                      {STATUS_LABEL[r.status]}
                    </span>
                    {r.message && <div className="text-[10px] text-ink-muted mt-0.5">{r.message}</div>}
                    {r.warnings.map((w) => (
                      <div key={w} className="text-[10px] text-amber-700 mt-0.5">⚠ {w}</div>
                    ))}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Cards Preview (Mobile < 768px) */}
      <div className="md:hidden space-y-3">
        {rows.map((r) => {
          const off = r.status === 'change' && excluded.has(r.line);
          return (
            <div
              key={r.line}
              className={`rounded-xl border p-3.5 space-y-2.5 transition-colors ${
                off
                  ? 'border-ink/10 bg-paper-sunk/50 opacity-60'
                  : r.status === 'invalid' || r.status === 'unknown-sku'
                  ? 'border-rose-200 bg-rose-50/40'
                  : r.status === 'change'
                  ? 'border-ink/15 bg-paper-card shadow-xs'
                  : 'border-ink/10 bg-paper-sunk/40'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  {r.status === 'change' ? (
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        aria-label={`Apply line ${r.line} (${r.sku})`}
                        checked={!excluded.has(r.line)}
                        onChange={() => onToggle(r.line)}
                        className="w-4 h-4 accent-red cursor-pointer rounded"
                      />
                      <span className="font-mono text-[11px] font-bold text-ink-muted">Line {r.line}</span>
                    </label>
                  ) : (
                    <span className="font-mono text-[11px] font-bold text-ink-muted">Line {r.line}</span>
                  )}
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${BADGE[r.status]}`}>
                    {STATUS_LABEL[r.status]}
                  </span>
                </div>
                {r.status === 'change' && r.large && (
                  <span className="text-[10px] font-bold text-red bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full shrink-0">
                    &gt;25% shift
                  </span>
                )}
              </div>

              <div>
                <div className="font-mono font-bold text-xs text-ink">{r.sku || 'No SKU'}</div>
                {r.target ? (
                  <div className="text-xs text-ink-muted mt-0.5 font-medium">{r.target.name}</div>
                ) : (
                  <div className="text-xs text-ink-muted/70 italic mt-0.5">Unmatched product SKU</div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-ink/5">
                <div className="bg-paper-sunk p-2 rounded-lg border border-ink/10">
                  <span className="text-[10px] font-mono uppercase tracking-wide text-ink-muted block">Current</span>
                  <span className="font-data tabular-nums text-xs font-semibold text-ink">
                    {r.target ? formatLKR(r.target.priceLKR) : '—'}
                  </span>
                </div>

                <div className="bg-paper-sunk p-2 rounded-lg border border-ink/10">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wide text-ink-muted block">New Price</span>
                    {r.status === 'change' && (
                      <span className={`text-[10px] font-mono font-bold ${r.large ? 'text-red' : 'text-ink-muted'}`}>
                        {formatPercent(r.pct!)}
                      </span>
                    )}
                  </div>
                  {r.target ? (
                    <input
                      inputMode="decimal"
                      aria-label={`New price for line ${r.line}`}
                      value={r.rawPrice}
                      onChange={(e) => onEditPrice(r.line, e.target.value)}
                      placeholder="e.g. 245000"
                      className={`mt-1 w-full px-2 py-1 rounded-md border text-xs font-data tabular-nums font-bold ${
                        r.status === 'invalid'
                          ? 'border-rose-400 bg-rose-50 text-rose-900 focus:outline-rose-500'
                          : 'border-ink/20 bg-paper text-ink focus:border-red focus:outline-none'
                      }`}
                    />
                  ) : (
                    <span className="mt-1 block font-data text-xs text-ink-muted">{r.rawPrice || '—'}</span>
                  )}
                </div>
              </div>

              {/* Error messages / warnings */}
              {r.message && (
                <div className="text-[11px] text-rose-700 font-medium bg-rose-50/80 p-2.5 rounded-lg border border-rose-200">
                  {r.message}
                </div>
              )}
              {r.warnings.map((w) => (
                <div key={w} className="text-[11px] text-amber-800 bg-amber-50/80 p-2.5 rounded-lg border border-amber-200">
                  ⚠ {w}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Problem Callout with Error Export */}
      {problems > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-900">
          <span>
            {problems} row{problems === 1 ? '' : 's'} contain issues and will be skipped. You can download an error report, correct the issues, and re-import.
          </span>
          <button
            onClick={onErrorReport}
            className="inline-flex items-center gap-1.5 font-bold text-red hover:underline cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Error Report (.csv)</span>
          </button>
        </div>
      )}

      {/* Large Changes Confirmation Checkbox */}
      {largeCount > 0 && (
        <label className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-900 cursor-pointer">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
          <span>
            <input
              type="checkbox"
              className="mr-2 accent-red cursor-pointer"
              checked={largeAck}
              onChange={(e) => onLargeAck(e.target.checked)}
            />
            {largeCount} selected change{largeCount === 1 ? ' is' : 's are'} 25% or greater. I have checked them and confirm application.
          </span>
        </label>
      )}

      {/* Action Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <p className="text-[11px] text-ink-muted">
          Prices only: Stock, descriptions, and non-price columns in the CSV are ignored.
        </p>
        <button
          onClick={onApply}
          disabled={blocked}
          className="w-full sm:w-auto px-5 py-3 sm:py-2.5 rounded-xl sm:rounded-lg bg-red text-paper text-xs font-bold hover:bg-red/90 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-sm transition-colors min-h-[44px] flex items-center justify-center text-center"
        >
          Apply {applicable.length} Price Update{applicable.length === 1 ? '' : 's'} to Store
        </button>
      </div>
    </section>
  );
};
