import React, { useMemo, useState, useEffect } from 'react';
import { CheckCircle, FlaskConical, SearchX, PackageOpen, Undo2, X } from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { BulkMode, previewBulk } from '../../../lib/bulkPricing';
import { BulkToolbar } from './BulkToolbar';
import { BulkPreviewDialog } from './BulkPreviewDialog';
import { DraftActionBar } from './DraftActionBar';
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
  const [undoTimer, setUndoTimer] = useState<number | null>(null);
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
  const bulkPreview = bulk ? previewBulk(draft.selectedRows, bulk.mode, bulk.value, hiddenSelected) : null;
  if (bulkPreview) {
    const replaced = bulkPreview.changes.filter((c) => (draft.drafts[c.row.key] ?? '').trim() !== '').length;
    if (replaced > 0) {
      bulkPreview.warnings.push(`${replaced} row${replaced === 1 ? ' has' : 's have'} an unsaved draft edit that staging will replace.`);
    }
  }

  // 10-second countdown timer for the post-publish Undo toast
  useEffect(() => {
    if (undoTimer === null) return;
    if (undoTimer <= 0) {
      setUndoTimer(null);
      return;
    }
    const interval = setInterval(() => {
      setUndoTimer((prev) => (prev !== null && prev > 1 ? prev - 1 : null));
    }, 1000);
    return () => clearInterval(interval);
  }, [undoTimer]);

  // Phone spacer so the last rows can scroll clear of the fixed action dock.
  const dockSpace = draft.selected.size > 0 ? 'h-80' : dirty > 0 ? 'h-24' : 'h-0';

  const textBtn = 'min-h-10 px-2 text-xs font-semibold text-slate-700 hover:text-[#E11D48] disabled:opacity-40 cursor-pointer transition-colors';

  return (
    <div className="space-y-4 text-left">
      {/* Scope Disclaimer */}
      <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50/80 px-4 py-2.5 text-xs text-amber-900 shadow-2xs">
        <FlaskConical className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
        <p>
          Prices are maintained in <strong>LKR</strong>. Published price changes update catalog and checkout in <strong>this browser</strong> immediately.
          <span className="hidden sm:inline text-amber-800"> USD display prices are illustrative conversions.</span>
        </p>
      </div>

      {/* Floating 10-Second Undo Toast */}
      {undoTimer !== null && (
        <div
          role="status"
          className="fixed bottom-16 sm:bottom-6 right-4 sm:right-6 z-50 bg-[#111827] text-white p-3.5 sm:p-4 rounded-[16px] shadow-floating border border-slate-700 max-w-md flex items-center justify-between gap-3 animate-in slide-in-from-bottom-2 duration-200"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            <div className="text-xs">
              <span className="font-bold block truncate">{publishedMsg}</span>
              <span className="text-[11px] text-slate-300">
                Reversible for <strong className="text-amber-400 font-mono">{undoTimer}s</strong>
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                const { restored, skipped } = undoLastPublish();
                setUndoTimer(null);
                setPublishedMsg(
                  `Undid last publish: ${restored} restored${skipped ? `, ${skipped} skipped` : ''}.`
                );
              }}
              className="px-3 py-1.5 bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span>Undo ({undoTimer}s)</span>
            </button>
            <button
              onClick={() => setUndoTimer(null)}
              className="p-1 text-slate-400 hover:text-white rounded cursor-pointer"
              aria-label="Dismiss toast"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Static Feedback when Undo Timer expires */}
      {publishedMsg && undoTimer === null && (
        <div role="status" className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs text-emerald-900">
          <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
          <span>{publishedMsg}</span>
        </div>
      )}

      {/* Permanent Historical Undo Option */}
      {lastPublish && undoTimer === null && (
        <div role="status" className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-xs text-slate-700 shadow-2xs">
          <span>
            Previous publish: <strong className="font-mono text-[#111827]">{lastPublish.entries.length}</strong> price{lastPublish.entries.length === 1 ? '' : 's'} updated at{' '}
            {new Date(lastPublish.at).toLocaleTimeString()}.
          </span>
          <button
            onClick={() => {
              const { restored, skipped } = undoLastPublish();
              setPublishedMsg(
                `Undid last publish: ${restored} restored${skipped ? `, ${skipped} left alone because they changed since` : ''}.`
              );
            }}
            className="inline-flex items-center gap-1 font-semibold text-[#E11D48] hover:underline cursor-pointer"
          >
            <Undo2 className="w-3.5 h-3.5" /> Revert last publish
          </button>
        </div>
      )}

      <PriceFiltersBar rows={draft.rows} filters={filters} onChange={setFilters} />

      {/* Filtered count vs. explicit selection */}
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs px-1">
        <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-[#6B7280]" aria-live="polite">
          <span>Filtered products: <strong className="text-[#111827] font-mono">{filteredProducts}</strong> <span className="text-slate-400">({visible.length} variant rows)</span></span>
          <span>Selected variants: <strong className="text-[#E11D48] font-mono font-bold">{draft.selected.size}</strong></span>
        </div>
        <div className="flex gap-2">
          <button onClick={() => draft.selectMany(visible.map((r) => r.key))} disabled={visible.length === 0} className={textBtn}>
            Select visible ({visible.length})
          </button>
          <button onClick={draft.clearSelection} disabled={draft.selected.size === 0} className={textBtn}>
            Clear selection
          </button>
        </div>
      </div>

      {/* Action dock: Pinned pending-changes bar and bulk toolbar */}
      <div className="fixed inset-x-0 z-30 px-3 flex flex-col gap-2 bottom-[calc(3.5rem+env(safe-area-inset-bottom))] md:contents">
        <BulkToolbar
          selectedCount={draft.selected.size}
          hiddenCount={hiddenSelected}
          onClear={draft.clearSelection}
          onPreview={(mode, value) => setBulk({ mode, value })}
        />
        <DraftActionBar
          draft={draft}
          onReview={() => {
            setPublishedMsg(null);
            setReviewing(true);
          }}
          onDiscard={() => {
            draft.clear();
            setPublishedMsg(null);
          }}
        />
      </div>

      {draft.rows.length === 0 ? (
        <EmptyState icon={PackageOpen} title="No products in catalog" text="Reset demo data to restore the sample catalogue." />
      ) : visible.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No matching models"
          text="Try adjusting your brand, storage, or keyword filters."
          action={{ label: 'Clear filters', onClick: () => setFilters(EMPTY_FILTERS) }}
        />
      ) : (
        <>
          <PriceTable rows={visible} draft={draft} />
          <PriceCards rows={visible} draft={draft} />
        </>
      )}

      <div className={`md:hidden ${dockSpace}`} aria-hidden />

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
              `Staged ${bulkPreview.changes.length} bulk change${bulkPreview.changes.length === 1 ? '' : 's'} as draft. Use Review & Publish to check and publish.`
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
            setPublishedMsg(`Published ${n} price change${n === 1 ? '' : 's'} to the storefront.`);
            setUndoTimer(10);
          }}
        />
      )}
    </div>
  );
};

const EmptyState: React.FC<{
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  text: string;
  action?: { label: string; onClick: () => void };
}> = ({ icon: Icon, title, text, action }) => (
  <div className="bg-white rounded-[18px] border border-dashed border-[#E5E7EB] p-10 text-center">
    <Icon className="w-8 h-8 mx-auto text-slate-300" />
    <div className="mt-2 text-sm font-bold text-[#111827]">{title}</div>
    <p className="text-xs text-[#6B7280]">{text}</p>
    {action && (
      <button onClick={action.onClick} className="mt-3 min-h-11 text-xs font-semibold text-[#E11D48] hover:underline cursor-pointer">
        {action.label}
      </button>
    )}
  </div>
);
