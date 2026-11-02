import React, { useMemo, useState } from 'react';
import { CheckCircle, FlaskConical, SearchX, PackageOpen, Undo2 } from 'lucide-react';
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
import { UndoToast } from '../../ui/Toast';
import { Button } from '../../ui/Button';

export const PriceManagerPage: React.FC<{ draft: PriceDraft }> = ({ draft }) => {
  const [filters, setFilters] = useState<PriceFilters>(EMPTY_FILTERS);
  const [reviewing, setReviewing] = useState(false);
  const [publishedMsg, setPublishedMsg] = useState<string | null>(null);
  const [showUndoToast, setShowUndoToast] = useState(false);
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

  const dockSpace = draft.selected.size > 0 ? 'h-80' : dirty > 0 ? 'h-24' : 'h-0';

  const textBtn = 'min-h-[40px] px-3 font-data text-xs font-bold text-ink-soft hover:text-red disabled:opacity-40 cursor-pointer transition-colors';

  return (
    <div className="space-y-4 text-left font-ui">
      {/* Scope Disclaimer */}
      <div className="flex items-start gap-2.5 rounded-2xl border border-line bg-highlighter/30 px-4 py-3 text-xs text-ink shadow-hard-sm">
        <FlaskConical className="w-4 h-4 shrink-0 mt-0.5 text-red" />
        <p>
          Prices are maintained in <strong>LKR</strong>. Published price changes update catalog and checkout in <strong>this browser</strong> immediately.
          <span className="hidden sm:inline text-ink-soft"> USD display prices are illustrative conversions.</span>
        </p>
      </div>

      {/* 10-Second Undo Toast */}
      <UndoToast
        isOpen={showUndoToast}
        message={publishedMsg || 'Price changes published to counter!'}
        durationMs={10000}
        onUndo={() => {
          const { restored, skipped } = undoLastPublish();
          setShowUndoToast(false);
          setPublishedMsg(
            `Undid last publish: ${restored} restored${skipped ? `, ${skipped} skipped` : ''}.`
          );
        }}
        onDismiss={() => setShowUndoToast(false)}
      />

      {/* Static Feedback when Undo expires */}
      {publishedMsg && !showUndoToast && (
        <div role="status" className="flex items-start gap-2 rounded-2xl border border-go/20 bg-go/10 px-4 py-3 text-xs text-go font-bold">
          <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-go" />
          <span>{publishedMsg}</span>
        </div>
      )}

      {/* Permanent Historical Undo Option */}
      {lastPublish && !showUndoToast && (
        <div role="status" className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 rounded-2xl border border-line bg-card px-4 py-3 text-xs text-ink shadow-hard-sm">
          <span>
            Previous publish: <strong className="font-data text-red">{lastPublish.entries.length}</strong> price{lastPublish.entries.length === 1 ? '' : 's'} updated at{' '}
            {new Date(lastPublish.at).toLocaleTimeString()}.
          </span>
          <button
            onClick={() => {
              const { restored, skipped } = undoLastPublish();
              setPublishedMsg(
                `Undid last publish: ${restored} restored${skipped ? `, ${skipped} left alone because they changed since` : ''}.`
              );
            }}
            className="inline-flex items-center gap-1.5 font-bold font-data text-red hover:underline cursor-pointer"
          >
            <Undo2 className="w-3.5 h-3.5" /> Revert last publish
          </button>
        </div>
      )}

      <PriceFiltersBar rows={draft.rows} filters={filters} onChange={setFilters} />

      {/* Filtered count vs. explicit selection */}
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs px-1">
        <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-ink-soft font-data" aria-live="polite">
          <span>Filtered products: <strong className="text-ink font-bold">{filteredProducts}</strong> <span className="opacity-70">({visible.length} variant rows)</span></span>
          <span>Selected variants: <strong className="text-red font-bold">{draft.selected.size}</strong></span>
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
            setShowUndoToast(true);
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
  <div className="bg-card rounded-2xl border border-dashed border-line p-10 text-center space-y-2">
    <Icon className="w-8 h-8 mx-auto text-ink-soft" />
    <div className="font-display font-bold text-base text-ink">{title}</div>
    <p className="font-ui text-xs text-ink-soft">{text}</p>
    {action && (
      <button onClick={action.onClick} className="mt-3 min-h-[44px] px-4 font-data text-xs font-bold text-red hover:underline cursor-pointer">
        {action.label}
      </button>
    )}
  </div>
);
