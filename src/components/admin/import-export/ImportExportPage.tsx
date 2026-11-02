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
import { Dot } from '../../ui/Dot';
import { Button } from '../../ui/Button';

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

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);
    setDone(null);
    if (!file) return;
    reset();

    if (file.size > MAX_FILE_BYTES) {
      return setError('File exceeds demo size limit (maximum 1 MB).');
    }

    if (/\.(xlsx|xls)$/i.test(file.name)) {
      return setError(
        'Excel workbook (.xlsx / .xls) files cannot be parsed directly. In Excel, please click "File" → "Save As" and select "CSV (Comma delimited) (*.csv)" before importing.'
      );
    }

    if (!/\.(csv|txt)$/i.test(file.name)) {
      return setError('Please choose a valid .csv text file.');
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
      `Applied ${applied} price update${applied === 1 ? '' : 's'} to the counter in this browser. ${skipped} row${skipped === 1 ? ' was' : 's were'} skipped or unchanged.`
    );
  };

  const dateTag = new Date().toISOString().slice(0, 10);
  const currentStep = loaded ? 2 : done ? 3 : 1;

  return (
    <div className="space-y-4 text-left font-ui">
      {/* Demo Notice */}
      <div className="flex items-start gap-2.5 rounded-2xl border border-line bg-highlighter/30 px-4 py-3 text-xs text-ink shadow-hard-sm">
        <FlaskConical className="w-4 h-4 shrink-0 mt-0.5 text-red" />
        <p>
          Demo: imported prices update the storefront in <strong>this browser only</strong>. Prices are in LKR. Only the price
          column is imported; stock quantities are never altered by a price sheet.
        </p>
      </div>

      {/* CSV Manager Surface */}
      <div className="bg-card rounded-2xl border border-line p-5 sm:p-6 shadow-hard-sm space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-paper-sunk flex items-center justify-center text-red border border-line shrink-0">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-ink">
                Weekly CSV Price Sheet Importer
              </h2>
              <p className="font-ui text-xs text-ink-soft">
                Import supplier sheets saved as CSV from Excel or Google Sheets.
              </p>
            </div>
          </div>

          {/* 3-Step Stepper */}
          <div className="flex items-center gap-2 font-data text-xs text-ink-soft bg-paper-sunk px-3 py-1.5 rounded-full border border-line">
            <span className={currentStep === 1 ? 'text-red font-bold' : ''}>1. Choose CSV</span>
            <span>&mdash;</span>
            <span className={currentStep === 2 ? 'text-red font-bold' : ''}>2. Dry Run</span>
            <span>&mdash;</span>
            <span className={currentStep === 3 ? 'text-go font-bold' : ''}>3. Published</span>
          </div>
        </div>

        {/* Dropzone Upload Area */}
        <label className="border-2 border-dashed border-line hover:border-ink rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-paper hover:bg-paper-sunk group">
          <div className="w-12 h-12 rounded-full bg-paper-sunk border border-line flex items-center justify-center text-ink group-hover:scale-110 transition-transform mb-3">
            <Upload className="w-5 h-5 text-red" />
          </div>
          <span className="font-ui font-bold text-sm text-ink">
            Drop your weekly CSV sheet here, or <span className="text-red underline">browse files</span>
          </span>
          <span className="font-data text-xs text-ink-soft mt-1">
            Accepts UTF-8 .csv files up to 1 MB
          </span>
          <input
            ref={fileInput}
            type="file"
            accept=".csv,text/csv,.txt"
            onChange={onFile}
            className="sr-only"
          />
        </label>

        {/* Action Buttons: Full-width responsive layout */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          <button
            type="button"
            onClick={() => downloadCsv('y5hut-price-template.csv', buildPriceListCsv(catalogue, true))}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-full border border-line bg-paper text-xs font-bold text-ink hover:bg-paper-sunk hover:border-ink cursor-pointer transition-colors min-h-[44px]"
          >
            <FileDown className="w-4 h-4 text-red shrink-0" />
            <span>Download CSV Template</span>
          </button>

          <button
            type="button"
            onClick={() => downloadCsv(`y5hut-price-list-${dateTag}.csv`, buildPriceListCsv(catalogue, false))}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-full border border-line bg-paper text-xs font-bold text-ink hover:bg-paper-sunk hover:border-ink cursor-pointer transition-colors min-h-[44px]"
          >
            <Download className="w-4 h-4 text-ink shrink-0" />
            <span>Export Active Prices</span>
          </button>

          <a
            href={SAMPLE_URL}
            download
            className="w-full flex items-center justify-center gap-1.5 px-4 py-3 rounded-full border border-red/30 bg-red-wash text-xs font-bold text-red hover:bg-red-wash/80 transition-colors min-h-[44px]"
          >
            <span>Sample Price CSV (Demo)</span>
          </a>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-2xl border border-red/30 bg-red-wash p-4 text-xs text-red shadow-hard-sm"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red" />
          <div className="leading-relaxed font-ui font-semibold">{error}</div>
        </div>
      )}

      {/* Success Notification */}
      {done && (
        <div
          role="status"
          className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-go/20 bg-go/10 px-4 py-3 text-xs text-go font-bold shadow-hard-sm"
        >
          <span className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-go shrink-0" />
            <span>{done}</span>
          </span>
          {lastPublish && (
            <button
              onClick={() => {
                const r = undoLastPublish();
                setDone(`Undid last publish: ${r.restored} restored${r.skipped ? `, ${r.skipped} left alone` : ''}.`);
              }}
              className="inline-flex items-center gap-1 font-data font-bold text-red hover:underline cursor-pointer"
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
