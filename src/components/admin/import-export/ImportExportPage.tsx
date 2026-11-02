import React, { useMemo, useRef, useState } from 'react';
import { CheckCircle, Download, FileDown, FileSpreadsheet, FlaskConical, Undo2, Upload, AlertCircle } from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { buildPriceRows } from '../../../lib/priceRows';
import { downloadCsv } from '../../../lib/csv';
import {
  ImportRawRow,
  analyzeImport,
  buildErrorReportCsv,
  buildPriceListCsv,
  readPriceCsv,
  summarizeImport,
} from '../../../lib/priceImport';
import { ImportPreview } from './ImportPreview';

const MAX_FILE_BYTES = 1_000_000;
const SAMPLE_URL = `${import.meta.env?.BASE_URL ?? "/"}demo/y5hut-sample-price-update.csv`;

interface Loaded {
  name: string;
  raw: ImportRawRow[];
}

export const ImportExportPage: React.FC = () => {
  const { products, publishPriceChanges, lastPublish, undoLastPublish } = useStore();
  const catalogue = useMemo(() => buildPriceRows(products), [products]);
  const fileInput = useRef<HTMLInputElement>(null);

  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [overrides, setOverrides] = useState<Record<number, string>>({});
  const [excluded, setExcluded] = useState<Set<number>>(new Set());
  const [largeAck, setLargeAck] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  const rows = useMemo(
    () => (loaded ? analyzeImport(loaded.raw, catalogue, overrides) : []),
    [loaded, catalogue, overrides]
  );
  const summary = useMemo(() => summarizeImport(rows), [rows]);

  const reset = () => {
    setLoaded(null);
    setOverrides({});
    setExcluded(new Set());
    setLargeAck(false);
    if (fileInput.current) fileInput.current.value = '';
  };

  // Reading a file only builds a dry-run preview. Nothing is published here.
  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);
    setDone(null);
    if (!file) return;
    reset();

    // Check file size
    if (file.size > MAX_FILE_BYTES) {
      return setError('File is too large for this demo (maximum size is 1 MB).');
    }

    // Specific friendly guidance for .xlsx files
    if (/\.(xlsx|xls)$/i.test(file.name)) {
      return setError(
        'Excel workbook (.xlsx / .xls) files cannot be read directly in this browser. In Excel, please click "File" → "Save As" and choose "CSV (Comma delimited) (*.csv)" before importing.'
      );
    }

    // Validate extension
    if (!/\.(csv|txt)$/i.test(file.name)) {
      return setError('Please choose a .csv text file. (Other spreadsheet formats must be saved as CSV).');
    }

    const text = await file.text();
    const result = readPriceCsv(text);
    if (result.fatal) return setError(result.fatal);
    setLoaded({ name: file.name, raw: result.rows });
  };

  const apply = () => {
    const picked = rows.filter((r) => r.status === 'change' && !excluded.has(r.line));
    const { applied } = publishPriceChanges(
      picked.map((r) => ({
        productId: r.target!.productId,
        variantId: r.target!.variantId,
        newPriceLKR: r.newPrice!,
        source: 'csv' as const,
      }))
    );
    const skipped = rows.length - applied;
    reset();
    setDone(
      `Applied ${applied} price update${applied === 1 ? '' : 's'} to the storefront in this browser. ${skipped} row${skipped === 1 ? ' was' : 's were'} skipped or unchanged.`
    );
  };

  const dateTag = new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-4 text-left">
      {/* Demo Notice */}
      <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50/80 px-4 py-2.5 text-xs text-amber-900 shadow-2xs">
        <FlaskConical className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
        <p>
          Demo: imported prices update the storefront in <strong>this browser only</strong>. Prices are in LKR. Only the price
          column is imported; stock quantities are never altered by a price sheet.
        </p>
      </div>

      {/* CSV Manager Surface */}
      <div className="bg-white rounded-[18px] border border-[#E5E7EB] p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-[#E11D48] border border-rose-100 shrink-0">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#111827] font-sans">
              Weekly CSV Price Lists
            </h2>
            <p className="text-xs text-[#6B7280]">
              Import supplier price sheets saved as CSV from Excel or Google Sheets.
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-[#F7F8FA] p-4 rounded-xl border border-[#E5E7EB] space-y-1.5 text-xs text-slate-700">
          <span className="font-mono text-[10px] uppercase font-bold text-slate-500 block">
            How It Works
          </span>
          <ol className="list-decimal pl-4 space-y-1 text-slate-600 text-xs">
            <li>Download the CSV template or export current catalogue prices.</li>
            <li>Open the CSV in Excel, enter updated prices in <code className="font-mono text-[#111827] font-bold">new_price_lkr</code>, then Save As → CSV.</li>
            <li>Tap <strong>Choose CSV File</strong> to review a dry-run preview with validation checks before applying.</li>
          </ol>
        </div>

        {/* Action Buttons: Full-width responsive layout with 44px min touch targets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
          {/* File Upload Trigger */}
          <label className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#111827] text-white text-xs font-bold hover:bg-[#E11D48] cursor-pointer transition-colors shadow-xs min-h-[44px]">
            <Upload className="w-4 h-4 shrink-0" />
            <span>Choose CSV File</span>
            <input
              ref={fileInput}
              type="file"
              accept=".csv,text/csv,.txt"
              onChange={onFile}
              className="sr-only"
            />
          </label>

          <button
            type="button"
            onClick={() => downloadCsv('y5hut-price-template.csv', buildPriceListCsv(catalogue, true))}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-[#E5E7EB] bg-white text-xs font-semibold text-[#111827] hover:bg-slate-50 hover:border-slate-300 cursor-pointer transition-colors min-h-[44px]"
          >
            <FileDown className="w-4 h-4 text-slate-500 shrink-0" />
            <span>Download Template</span>
          </button>

          <button
            type="button"
            onClick={() => downloadCsv(`y5hut-price-list-${dateTag}.csv`, buildPriceListCsv(catalogue, false))}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-[#E5E7EB] bg-white text-xs font-semibold text-[#111827] hover:bg-slate-50 hover:border-slate-300 cursor-pointer transition-colors min-h-[44px]"
          >
            <Download className="w-4 h-4 text-slate-500 shrink-0" />
            <span>Export Prices</span>
          </button>

          <a
            href={SAMPLE_URL}
            download
            className="w-full flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl border border-rose-200 bg-rose-50 text-xs font-bold text-[#E11D48] hover:bg-rose-100 transition-colors min-h-[44px]"
          >
            <span>Sample CSV File (demo)</span>
          </a>
        </div>

        {/* Format Details */}
        <details className="text-[11px] text-[#6B7280]">
          <summary className="cursor-pointer font-bold text-slate-700">About CSV columns and safeguards</summary>
          <p className="mt-1.5 leading-relaxed bg-[#F7F8FA] p-3 rounded-lg border border-[#E5E7EB]">
            Columns: <code className="font-mono text-[#111827]">sku, product_name, brand, variant, current_price_lkr, new_price_lkr, stock</code>.
            Matching is performed strictly by <strong>SKU</strong>. Leave <code className="font-mono">new_price_lkr</code> blank on rows you do not wish to update.
            Formula injection characters (<code className="font-mono">=, +, -, @</code>) are safely escaped upon export.
          </p>
        </details>
      </div>

      {/* Error Message Alert */}
      {error && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800 shadow-2xs"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
          <div className="leading-relaxed">{error}</div>
        </div>
      )}

      {/* Success Notification */}
      {done && (
        <div
          role="status"
          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-900 shadow-2xs"
        >
          <span className="flex items-center gap-2 font-semibold">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{done}</span>
          </span>
          {lastPublish && (
            <button
              onClick={() => {
                const r = undoLastPublish();
                setDone(`Undid last publish: ${r.restored} restored${r.skipped ? `, ${r.skipped} left alone` : ''}.`);
              }}
              className="inline-flex items-center gap-1 font-bold text-[#E11D48] hover:underline cursor-pointer"
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span>Undo publish</span>
            </button>
          )}
        </div>
      )}

      {/* Dry Run Preview Component */}
      {loaded && (
        <ImportPreview
          fileName={loaded.name}
          rows={rows}
          summary={summary}
          excluded={excluded}
          largeAck={largeAck}
          onLargeAck={setLargeAck}
          onToggle={(line) =>
            setExcluded((prev) => {
              const next = new Set(prev);
              if (next.has(line)) next.delete(line);
              else next.add(line);
              return next;
            })
          }
          onEditPrice={(line, raw) => setOverrides((prev) => ({ ...prev, [line]: raw }))}
          onErrorReport={() => downloadCsv('y5hut-import-errors.csv', buildErrorReportCsv(rows))}
          onApply={apply}
          onCancel={reset}
        />
      )}
    </div>
  );
};
