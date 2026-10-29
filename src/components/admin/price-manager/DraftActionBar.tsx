import React from 'react';
import { PriceDraft } from './usePriceDraft';

interface Props {
  draft: PriceDraft;
  onReview: () => void;
  onDiscard: () => void;
}

/** Unsaved-changes bar: Discard, or one primary "Review & Publish" that opens the confirmation step. */
export const DraftActionBar: React.FC<Props> = ({ draft, onReview, onDiscard }) => {
  const dirty = draft.entries.length;
  const hasDraft = Object.values(draft.drafts).some((v) => v !== '');
  const n = draft.changes.length;

  return (
    <div className={`md:sticky md:top-2 md:z-10 rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-lg md:shadow-xs ${dirty === 0 ? 'max-md:hidden' : ''}`}>
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <div className="text-xs text-slate-600 min-w-0" aria-live="polite">
          {dirty === 0 ? (
            <>Type a new price in any row. <span className="hidden md:inline">Nothing is saved until you publish.</span></>
          ) : (
            <>
              <strong className="text-amber-700">{n} unsaved change{n === 1 ? '' : 's'}</strong>
              {draft.invalid.length > 0 && <span className="text-rose-600 font-bold"> · {draft.invalid.length} invalid</span>}
            </>
          )}
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={onDiscard}
            disabled={!hasDraft}
            className="flex-1 sm:flex-none h-11 md:h-auto px-4 md:px-3 md:py-1.5 text-sm md:text-xs font-bold rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Discard Draft
          </button>
          <button
            onClick={onReview}
            disabled={dirty === 0}
            title="Check every change before it is published"
            className="flex-[2] sm:flex-none h-11 md:h-auto px-4 md:px-3 md:py-1.5 text-sm md:text-xs font-bold rounded-lg bg-[#E11D48] text-white hover:bg-[#BE123C] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Review &amp; Publish{n > 0 ? ` (${n})` : ''}
          </button>
        </div>
      </div>
    </div>
  );
};
