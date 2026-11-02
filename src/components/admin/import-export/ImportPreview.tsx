import React from 'react';
import { AlertTriangle, Download, ArrowRight, CheckCircle, X } from 'lucide-react';
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
  unchanged: 'bg-slate-50 text-slate-600 border-slate-200',
  invalid: 'bg-rose-50 text-rose-800 border-rose-200',
  'unknown-sku': 'bg-rose-50 text-rose-800 border-rose-200',
  'duplicate-sku': 'bg-amber-50 text-amber-800 border-amber-200',
  'duplicate-row': 'bg-amber-50 text-amber-800 border-amber-200',
};

const Tile: React.FC<{ label: string; value: number; tone?: string }> = ({
  label,
  value,
  tone = 'bg-[#F7F8FA] text-slate-700 border-[#E5E7EB]',
}) => (
  <div className={`rounded-xl p-2.5 text-center border ${tone}`}>
    <strong className="block text-lg font-bold font-mono tabular-nums">{value}</strong>
    <span className="text-[10px] font-mono uppercase tracking-wide text-slate-500">{label}</span>
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
      className="bg-white rounded-[18px] border border-[#E5E7EB] p-5 sm:p-6 space-y-4 shadow-2xs text-left"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#E11D48]">
            CSV Dry Run Preview
          </div>
          <h3 className="text-base font-bold text-[#111827] font-sans mt-0.5">
            Previewing: {fileName}
          </h3>
          <p className="text-xs text-[#6B7280]">
            Review changes, correct prices inline, or toggle exclusions before applying.
          </p>
        </div>
        <button
          onClick={onCancel}
          className="text-xs font-semibold text-slate-600 hover:text-[#E11D48] cursor-pointer"
        >
          Cancel Import
        </button>
      </div>

      {/* Scope Callout matching Smart Price Manager */}
      <div className="p-3.5 bg-[#F7F8FA] rounded-xl border border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div>
          <span className="font-bold text-[#111827] block">
            Scope Summary: {applicable.length} prices will be updated across {affectedModels} models.
          </span>
          <span className="text-[#6B7280] text-[11px] block mt-0.5">
            {excluded.size > 0 ? `${excluded.size} rows excluded from publication.` : 'All valid changed rows included.'}
          </span>
        </div>
        <span className="text-[10px] font-mono font-bold bg-white px-2.5 py-1 rounded-full border border-[#E5E7EB] text-slate-600 shrink-0 self-start sm:self-auto">
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

      {/* Table Preview */}
      <div className="overflow-x-auto border border-[#E5E7EB] rounded-xl">
        <table className="w-full text-xs">
          <thead className="bg-[#F7F8FA] text-slate-600 uppercase tracking-wider text-[10px] font-mono">
            <tr>
              <th className="px-3 py-2.5 text-left w-8"><span className="sr-only">Include</span></th>
              <th className="px-3 py-2.5 text-left">Line</th>
              <th className="px-3 py-2.5 text-left">SKU &amp; Model</th>
              <th className="px-3 py-2.5 text-right">Current</th>
              <th className="px-3 py-2.5 text-right">New Price</th>
              <th className="px-3 py-2.5 text-left">Result Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {rows.map((r) => {
              const off = r.status === 'change' && excluded.has(r.line);
              return (
                <tr key={r.line} className={off ? 'opacity-40 bg-slate-50/50' : r.status === 'change' ? 'hover:bg-slate-50' : 'bg-slate-50/30'}>
                  <td className="px-3 py-2.5">
                    {r.status === 'change' && (
                      <input
                        type="checkbox"
                        aria-label={`Apply line ${r.line} (${r.sku})`}
                        checked={!excluded.has(r.line)}
                        onChange={() => onToggle(r.line)}
                        className="w-4 h-4 accent-[#E11D48] cursor-pointer"
                      />
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-slate-400 font-mono text-[11px]">{r.line}</td>
                  <td className="px-3 py-2.5">
                    <div className="font-mono font-bold text-[#111827]">{r.sku || '—'}</div>
                    {r.target && <div className="text-[11px] text-[#6B7280]">{r.target.name}</div>}
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono tabular-nums text-slate-500">
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
                          className={`w-28 px-2 py-1 rounded-lg border text-right font-mono tabular-nums text-xs ${
                            r.status === 'invalid'
                              ? 'border-rose-400 bg-rose-50'
                              : 'border-[#E5E7EB] bg-white focus:border-[#E11D48] focus:outline-none'
                          }`}
                        />
                        {r.status === 'change' && (
                          <span className={`text-[10px] font-mono mt-0.5 ${r.large ? 'text-[#DC2626] font-bold' : 'text-slate-400'}`}>
                            {formatPercent(r.pct!)}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="font-mono text-slate-400">{r.rawPrice || '—'}</span>
                    )}
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${BADGE[r.status]}`}>
                      {STATUS_LABEL[r.status]}
                    </span>
                    {r.message && <div className="text-[10px] text-slate-600 mt-0.5">{r.message}</div>}
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

      {/* Problem Callout with Error Export */}
      {problems > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-900">
          <span>
            {problems} row{problems === 1 ? '' : 's'} contain issues and will be skipped. You can download an error report, correct the issues, and re-import.
          </span>
          <button
            onClick={onErrorReport}
            className="inline-flex items-center gap-1.5 font-bold text-[#E11D48] hover:underline cursor-pointer"
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
              className="mr-2 accent-[#E11D48] cursor-pointer"
              checked={largeAck}
              onChange={(e) => onLargeAck(e.target.checked)}
            />
            {largeCount} selected change{largeCount === 1 ? ' is' : 's are'} 25% or greater. I have checked them and confirm application.
          </span>
        </label>
      )}

      {/* Action Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <p className="text-[11px] text-[#6B7280]">
          Prices only: Stock, descriptions, and non-price columns in the CSV are ignored.
        </p>
        <button
          onClick={onApply}
          disabled={blocked}
          className="px-5 py-2.5 rounded-lg bg-[#E11D48] text-white text-xs font-bold hover:bg-[#BE123C] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs transition-colors"
        >
          Apply {applicable.length} Price Update{applicable.length === 1 ? '' : 's'} to Store
        </button>
      </div>
    </section>
  );
};
