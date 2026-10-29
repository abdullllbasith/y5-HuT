import React, { useMemo, useRef, useState } from 'react';
import { CheckCircle, Download, FileDown, FileSpreadsheet, FlaskConical, Undo2, Upload } from 'lucide-react';
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
const SAMPLE_URL = `${import.meta.env.BASE_URL}demo/y5hut-sample-price-update.csv`;

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
    if (file.size > MAX_FILE_BYTES) return setError('File is too large for this demo (limit 1 MB).');
    if (!/\.(csv|txt)$/i.test(file.name)) {
      return setError('Please choose a .csv file. Excel .xlsx files are not supported: in Excel use Save As → CSV.');
    }
    const result = readPriceCsv(await file.text());
    if (result.fatal) return setError(result.fatal);
    setLoaded({ name: file.name, raw: result.rows });
  };

  const apply = () => {
    const picked = rows.filter((r) => r.status === 'change' && !excluded.has(r.line));
    const { applied } = publishPriceChanges(
      picked.map((r) => ({ productId: r.target!.productId, variantId: r.target!.variantId, newPriceLKR: r.newPrice! }))
    );
    const skipped = rows.length - applied;
    reset();
    setDone(`Applied ${applied} price update${applied === 1 ? '' : 's'} to the storefront in this browser. ${skipped} row${skipped === 1 ? ' was' : 's were'} not applied.`);
  };

  const dateTag = new Date().toISOString().slice(0, 10);

  return (
    <>
      <div className="flex items-start gap-2 rounded-xl border border-amber-300 bg-amber-50 px-4 py-2.5 text-xs text-amber-900">
        <FlaskConical className="w-4 h-4 shrink-0 mt-0.5" />
        <p>
          Demo: imported prices update the storefront in <strong>this browser only</strong>. Prices are in LKR. Only the price
          column is imported; stock is never changed by an import.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-[#E11D48]" />
          <div>
            <h2 className="text-base font-bold text-slate-900">CSV price lists</h2>
            <p className="text-xs font-semibold text-emerald-700">Works with CSV files saved from Excel</p>
          </div>
        </div>

        <ol className="text-xs text-slate-600 list-decimal pl-5 space-y-0.5">
          <li>Download the template or export the current price list.</li>
          <li>Open it in Excel, type new prices in <code className="font-mono">new_price_lkr</code>, then Save As → CSV.</li>
          <li>Import the CSV. You will see a preview first. Nothing changes until you click Apply.</li>
        </ol>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => downloadCsv('y5hut-price-template.csv', buildPriceListCsv(catalogue, true))}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:border-[#E11D48] hover:text-[#E11D48] cursor-pointer"
          >
            <FileDown className="w-4 h-4" /> Download CSV Template
          </button>
          <button
            onClick={() => downloadCsv(`y5hut-price-list-${dateTag}.csv`, buildPriceListCsv(catalogue, false))}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:border-[#E11D48] hover:text-[#E11D48] cursor-pointer"
          >
            <Download className="w-4 h-4" /> Export Current Price List
          </button>
          <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-[#E11D48] cursor-pointer focus-within:ring-2 focus-within:ring-[#E11D48]">
            <Upload className="w-4 h-4" /> Import CSV
            <input ref={fileInput} type="file" accept=".csv,text/csv" onChange={onFile} className="sr-only" />
          </label>
          <a
            href={SAMPLE_URL}
            download
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-[#E11D48] hover:underline"
          >
            Download sample update file (demo)
          </a>
        </div>

        <details className="text-[11px] text-slate-500">
          <summary className="cursor-pointer font-bold text-slate-600">About the file format</summary>
          <p className="mt-1">
            Columns: <code className="font-mono">sku, product_name, brand, variant, current_price_lkr, new_price_lkr, stock</code>.
            Rows are matched by <strong>SKU</strong> (not name). Products without variants use their product id as the SKU. Leave
            <code className="font-mono"> new_price_lkr</code> empty to skip a row. Quoted values and comma or semicolon separators
            are supported. Excel may drop leading zeros from number-like SKUs; format the SKU column as Text.
          </p>
        </details>
      </div>

      {error && (
        <div role="alert" className="rounded-xl border border-rose-300 bg-rose-50 px-4 py-2.5 text-xs text-rose-800">{error}</div>
      )}

      {done && (
        <div role="status" className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2.5 text-xs text-emerald-900">
          <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /> {done}</span>
          {lastPublish && (
            <button
              onClick={() => {
                const r = undoLastPublish();
                setDone(`Undid last publish: ${r.restored} restored${r.skipped ? `, ${r.skipped} left alone` : ''}.`);
              }}
              className="inline-flex items-center gap-1 font-bold text-[#E11D48] hover:underline cursor-pointer"
            >
              <Undo2 className="w-3.5 h-3.5" /> Undo last publish
            </button>
          )}
        </div>
      )}

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
    </>
  );
};
