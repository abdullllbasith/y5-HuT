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
  change: 'bg-emerald-100 text-emerald-800',
  unchanged: 'bg-slate-100 text-slate-600',
  invalid: 'bg-rose-100 text-rose-800',
  'unknown-sku': 'bg-rose-100 text-rose-800',
  'duplicate-sku': 'bg-amber-100 text-amber-800',
  'duplicate-row': 'bg-amber-100 text-amber-800',
};

const Tile: React.FC<{ label: string; value: number; tone?: string }> = ({ label, value, tone = 'bg-slate-50 text-slate-700' }) => (
  <div className={`rounded-lg p-2 text-center ${tone}`}>
    <strong className="block text-lg tabular-nums">{value}</strong>
    <span className="text-[10px] uppercase tracking-wide">{label}</span>
  </div>
);

/** Dry run: nothing here has changed any price. */
export const ImportPreview: React.FC<Props> = ({
  fileName, rows, summary, excluded, largeAck, onLargeAck, onToggle, onEditPrice, onErrorReport, onApply, onCancel,
}) => {
  const applicable = rows.filter((r) => r.status === 'change' && !excluded.has(r.line));
  const largeCount = applicable.filter((r) => r.large).length;
  const problems = summary.invalid + summary.unknown + summary.duplicateSku + summary.duplicateRow;
  const blocked = applicable.length === 0 || (largeCount > 0 && !largeAck);

  return (
    <section aria-label="Import preview" className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Dry run: {fileName}</h3>
          <p className="text-xs text-slate-500">Nothing has been changed yet. Review, fix or exclude rows, then apply.</p>
        </div>
        <button onClick={onCancel} className="text-xs font-bold text-slate-600 hover:text-[#E11D48] cursor-pointer">
          Cancel import
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        <Tile label="Rows" value={summary.total} />
        <Tile label="Matched" value={summary.matched} />
        <Tile label="Will change" value={summary.changed} tone="bg-emerald-50 text-emerald-800" />
        <Tile label="Unchanged" value={summary.unchanged} />
        <Tile label="Invalid" value={summary.invalid} tone={summary.invalid ? 'bg-rose-50 text-rose-800' : undefined} />
        <Tile label="Unknown SKU" value={summary.unknown} tone={summary.unknown ? 'bg-rose-50 text-rose-800' : undefined} />
        <Tile label="Duplicate SKU" value={summary.duplicateSku} tone={summary.duplicateSku ? 'bg-amber-50 text-amber-800' : undefined} />
        <Tile label="Duplicate rows" value={summary.duplicateRow} tone={summary.duplicateRow ? 'bg-amber-50 text-amber-800' : undefined} />
      </div>

      <div className="overflow-x-auto border border-slate-200 rounded-lg">
        <table className="w-full text-xs">
          <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="px-3 py-2 text-left w-8"><span className="sr-only">Include</span></th>
              <th className="px-3 py-2 text-left">Line</th>
              <th className="px-3 py-2 text-left">SKU</th>
              <th className="px-3 py-2 text-right">Current</th>
              <th className="px-3 py-2 text-right">New price (editable)</th>
              <th className="px-3 py-2 text-left">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((r) => {
              const off = r.status === 'change' && excluded.has(r.line);
              return (
                <tr key={r.line} className={off ? 'opacity-50' : r.status === 'change' ? '' : 'bg-slate-50/50'}>
                  <td className="px-3 py-2">
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
                  <td className="px-3 py-2 text-slate-400">{r.line}</td>
                  <td className="px-3 py-2">
                    <div className="font-mono">{r.sku || '—'}</div>
                    {r.target && <div className="text-[10px] text-slate-500">{r.target.name}</div>}
                  </td>
                  <td className="px-3 py-2 text-right font-mono tabular-nums">{r.target ? formatLKR(r.target.priceLKR) : '—'}</td>
                  <td className="px-3 py-2 text-right">
                    {r.target ? (
                      <input
                        inputMode="decimal"
                        aria-label={`New price for line ${r.line}`}
                        value={r.rawPrice}
                        onChange={(e) => onEditPrice(r.line, e.target.value)}
                        className={`w-28 px-2 py-1 rounded border text-right font-mono tabular-nums ${r.status === 'invalid' ? 'border-rose-400 bg-rose-50' : 'border-slate-200'}`}
                      />
                    ) : (
                      <span className="font-mono text-slate-400">{r.rawPrice || '—'}</span>
                    )}
                    {r.status === 'change' && (
                      <div className={`text-[10px] font-mono ${r.large ? 'text-rose-600 font-bold' : 'text-slate-500'}`}>
                        {formatPercent(r.pct!)}
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${BADGE[r.status]}`}>
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

      {problems > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900">
          <span>
            {problems} row{problems === 1 ? '' : 's'} cannot be applied and will be skipped. Fix invalid prices above, or correct
            the file and import again.
          </span>
          <button onClick={onErrorReport} className="inline-flex items-center gap-1 font-bold text-[#E11D48] hover:underline cursor-pointer">
            <Download className="w-3.5 h-3.5" /> Download error report
          </button>
        </div>
      )}

      {largeCount > 0 && (
        <label className="flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900 cursor-pointer">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            <input type="checkbox" className="mr-2" checked={largeAck} onChange={(e) => onLargeAck(e.target.checked)} />
            {largeCount} selected change{largeCount === 1 ? ' is' : 's are'} 25% or more. I have checked them.
          </span>
        </label>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <p className="text-[11px] text-slate-500">
          Only prices are applied. Stock, names and all other fields in the file are ignored.
        </p>
        <button
          onClick={onApply}
          disabled={blocked}
          className="px-4 py-2 rounded-lg bg-[#E11D48] text-white text-xs font-bold hover:bg-[#BE123C] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          Apply Valid Price Updates ({applicable.length})
        </button>
      </div>
    </section>
  );
};
