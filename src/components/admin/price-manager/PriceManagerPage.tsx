import React, { useMemo, useState } from 'react';
import { CheckCircle, FlaskConical, SearchX, PackageOpen, Undo2 } from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { BulkMode, previewBulk } from '../../../lib/bulkPricing';
import { BulkToolbar } from './BulkToolbar';
import { BulkPreviewDialog } from './BulkPreviewDialog';
import { PriceDraft } from './usePriceDraft';
import { EMPTY_FILTERS, PriceFilters, filterPriceRows } from '../../../lib/priceRows';
import { PriceFiltersBar } from './PriceFiltersBar';
import { PriceTable } from './PriceTable';
import { PriceCards } from './PriceCards';
import { ReviewPanel } from './ReviewPanel';

export const PriceManagerPage: React.FC<{ draft: PriceDraft }> = ({ draft }) => {
  const [filters, setFilters] = useState<PriceFilters>(EMPTY_FILTERS);
  const [reviewing, setReviewing] = useState(false);
  const [publishedMsg, setPublishedMsg] = useState<string | null>(null);
  const [bulk, setBulk] = useState<{ mode: BulkMode; value: number } | null>(null);
  const { lastPublish, undoLastPublish } = useStore();

  const visible = useMemo(
    () => filterPriceRows(draft.rows, filters, (k) => draft.entryByKey.has(k)),
    [draft.rows, draft.entryByKey, filters]
  );

  const dirty = draft.entries.length;
  const visibleKeys = new Set(visible.map((r) => r.key));
  const hiddenSelected = draft.selectedRows.filter((r) => !visibleKeys.has(r.key)).length;
  const filteredProducts = new Set(visible.map((r) => r.productId)).size;
  const bulkPreview = bulk
    ? previewBulk(draft.selectedRows, bulk.mode, bulk.value, hiddenSelected)
    : null;
  if (bulkPreview) {
    const replaced = bulkPreview.changes.filter((c) => (draft.drafts[c.row.key] ?? '').trim() !== '').length;
    if (replaced > 0) {
      bulkPreview.warnings.push(`${replaced} row${replaced === 1 ? ' has' : 's have'} an unsaved draft edit that staging will replace.`);
    }
  }
  const hasDraft = Object.values(draft.drafts).some((v) => v !== '');

  return (
    <>
      <div className="flex items-start gap-2 rounded-xl border border-amber-300 bg-amber-50 px-4 py-2.5 text-xs text-amber-900">
        <FlaskConical className="w-4 h-4 shrink-0 mt-0.5" />
        <p>
          Prices are in <strong>LKR</strong>. Published changes update the storefront in <strong>this browser only</strong>.
          Prices are sample/demo values, and USD display prices are illustrative (not exchange-rate synced).
        </p>
      </div>

      {publishedMsg && (
        <div role="status" className="flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2.5 text-xs text-emerald-900">
          <CheckCircle className="w-4 h-4" />
          {publishedMsg}
        </div>
      )}

      {lastPublish && (
        <div role="status" className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-xs text-slate-700">
          <span>
            Last publish: <strong>{lastPublish.entries.length}</strong> price{lastPublish.entries.length === 1 ? '' : 's'} changed at{' '}
            {new Date(lastPublish.at).toLocaleTimeString()}.
          </span>
          <button
            onClick={() => {
              const { restored, skipped } = undoLastPublish();
              setPublishedMsg(
                `Undid last publish: ${restored} restored${skipped ? `, ${skipped} left alone because they changed since` : ''}.`
              );
            }}
            className="inline-flex items-center gap-1 font-bold text-[#E11D48] hover:underline cursor-pointer"
          >
            <Undo2 className="w-3.5 h-3.5" /> Undo last publish
          </button>
        </div>
      )}

      <PriceFiltersBar rows={draft.rows} filters={filters} onChange={setFilters} />

      {/* Filtered count vs. explicit selection: filtering never selects anything */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-slate-600">
          <span>Filtered products: <strong>{filteredProducts}</strong> <span className="text-slate-400">({visible.length} variant rows)</span></span>
          <span>Selected variants: <strong className="text-[#E11D48]">{draft.selected.size}</strong></span>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => draft.selectMany(visible.map((r) => r.key))}
            disabled={visible.length === 0}
            className="font-bold text-slate-700 hover:text-[#E11D48] disabled:opacity-40 cursor-pointer"
          >
            Select visible ({visible.length})
          </button>
          <button
            onClick={draft.clearSelection}
            disabled={draft.selected.size === 0}
            className="font-bold text-slate-700 hover:text-[#E11D48] disabled:opacity-40 cursor-pointer"
          >
            Clear selection
          </button>
        </div>
      </div>

      <BulkToolbar
        selectedCount={draft.selected.size}
        hiddenCount={hiddenSelected}
        onClear={draft.clearSelection}
        onPreview={(mode, value) => setBulk({ mode, value })}
      />
      {draft.selected.size > 0 && <div className="h-40 md:hidden" aria-hidden />}

      {/* Draft controls */}
      <div className="sticky top-2 z-10 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white/95 backdrop-blur px-4 py-2.5 shadow-xs">
        <div className="text-xs text-slate-600">
          {dirty === 0 ? (
            'Type a new price in any row. Nothing is saved until you publish.'
          ) : (
            <>
              <strong className="text-amber-700">{draft.changes.length} unsaved change{draft.changes.length === 1 ? '' : 's'}</strong>
              {draft.invalid.length > 0 && (
                <span className="text-rose-600 font-bold"> · {draft.invalid.length} invalid</span>
              )}
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              draft.clear();
              setPublishedMsg(null);
            }}
            disabled={!hasDraft}
            className="px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Discard Draft
          </button>
          <button
            onClick={() => {
              setPublishedMsg(null);
              setReviewing(true);
            }}
            disabled={dirty === 0}
            className="px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-900 text-white hover:bg-[#E11D48] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Review Changes
          </button>
          <button
            onClick={() => {
              setPublishedMsg(null);
              setReviewing(true);
            }}
            disabled={draft.changes.length === 0 || draft.invalid.length > 0}
            title="Opens the review step before anything is published"
            className="px-3 py-1.5 text-xs font-bold rounded-lg bg-[#E11D48] text-white hover:bg-[#BE123C] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Publish {draft.changes.length} Change{draft.changes.length === 1 ? '' : 's'}
          </button>
        </div>
      </div>

      {draft.rows.length === 0 ? (
        <EmptyState icon={PackageOpen} title="No products yet" text="Reset demo data from the Overview page to restore the sample catalogue." />
      ) : visible.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No matching products"
          text="Try a different search, or clear the filters."
          action={{ label: 'Clear filters', onClick: () => setFilters(EMPTY_FILTERS) }}
        />
      ) : (
        <>
          <div className="text-[11px] text-slate-500">
            Showing {visible.length} of {draft.rows.length} variants/products
          </div>
          <PriceTable rows={visible} draft={draft} />
          <PriceCards rows={visible} draft={draft} />
        </>
      )}

      {bulk && bulkPreview && (
        <BulkPreviewDialog
          mode={bulk.mode}
          value={bulk.value}
          preview={bulkPreview}
          onCancel={() => setBulk(null)}
          onStage={() => {
            const staged: Record<string, number> = {};
            bulkPreview.changes.forEach((c) => (staged[c.row.key] = c.newPrice!));
            draft.stageMany(staged);
            draft.clearSelection();
            setBulk(null);
            setPublishedMsg(
              `Staged ${bulkPreview.changes.length} bulk change${bulkPreview.changes.length === 1 ? '' : 's'} as draft. Use Review Changes to check and publish.`
            );
          }}
        />
      )}

      {reviewing && (
        <ReviewPanel
          draft={draft}
          onClose={() => setReviewing(false)}
          onPublished={(n) => {
            setReviewing(false);
            setPublishedMsg(`Published ${n} price change${n === 1 ? '' : 's'} to the storefront in this browser.`);
          }}
        />
      )}
    </>
  );
};

const EmptyState: React.FC<{
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  text: string;
  action?: { label: string; onClick: () => void };
}> = ({ icon: Icon, title, text, action }) => (
  <div className="bg-white rounded-xl border border-dashed border-slate-300 p-10 text-center">
    <Icon className="w-8 h-8 mx-auto text-slate-300" />
    <div className="mt-2 text-sm font-bold text-slate-800">{title}</div>
    <p className="text-xs text-slate-500">{text}</p>
    {action && (
      <button onClick={action.onClick} className="mt-3 text-xs font-bold text-[#E11D48] hover:underline cursor-pointer">
        {action.label}
      </button>
    )}
  </div>
);
