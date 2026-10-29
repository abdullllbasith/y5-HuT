import React, { useMemo, useState } from 'react';
import { CheckCircle, FlaskConical, SearchX, PackageOpen } from 'lucide-react';
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

  const visible = useMemo(
    () => filterPriceRows(draft.rows, filters, (k) => draft.entryByKey.has(k)),
    [draft.rows, draft.entryByKey, filters]
  );

  const dirty = draft.entries.length;
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

      <PriceFiltersBar rows={draft.rows} filters={filters} onChange={setFilters} />

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
