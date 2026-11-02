import React from 'react';
import { PriceDraft } from './usePriceDraft';
import { Save, Trash2, ArrowRight, AlertCircle } from 'lucide-react';

interface Props {
  draft: PriceDraft;
  onReview: () => void;
  onDiscard: () => void;
}

/** Unsaved-changes bar: pinned above or below the table, showing live drafted count with Save/Publish and Discard always visible. */
export const DraftActionBar: React.FC<Props> = ({ draft, onReview, onDiscard }) => {
  const dirty = draft.entries.length;
  const hasDraft = Object.values(draft.drafts).some((v) => v !== '');
  const n = draft.changes.length;

  return (
    <aside
      aria-label="Pending Price Changes"
      className={`md:sticky md:top-2 md:z-20 rounded-[16px] border border-[#E5E7EB] bg-white/95 backdrop-blur-md px-4 py-3 shadow-floating transition-all duration-200 ${
        dirty === 0 ? 'max-md:hidden' : ''
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2.5">
        <div className="text-xs text-[#111827] flex items-center gap-2.5 min-w-0" aria-live="polite">
          {dirty === 0 ? (
            <span className="text-[#6B7280]">
              Type a new price in any row. <span className="hidden md:inline">Nothing is written to the store until you publish.</span>
            </span>
          ) : (
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="font-bold">
                <span className="font-mono text-amber-700 font-bold">{n}</span> staged edit{n === 1 ? '' : 's'} pending publish
              </span>
              {draft.invalid.length > 0 && (
                <span className="text-rose-600 font-bold flex items-center gap-1 font-mono text-[11px] bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  <AlertCircle className="w-3 h-3" />
                  {draft.invalid.length} invalid
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={onDiscard}
            disabled={!hasDraft}
            className="flex-1 sm:flex-none h-11 md:h-9 px-4 text-xs font-semibold rounded-lg border border-[#E5E7EB] bg-white text-slate-700 hover:bg-slate-50 hover:text-[#DC2626] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors flex items-center justify-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Discard</span>
          </button>
          
          <button
            type="button"
            onClick={onReview}
            disabled={dirty === 0}
            title="Check scope and publish changes"
            className="flex-[2] sm:flex-none h-11 md:h-9 px-4 text-xs font-bold rounded-lg bg-[#E11D48] text-white hover:bg-[#BE123C] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors shadow-xs flex items-center justify-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Review &amp; Publish{n > 0 ? ` (${n})` : ''}</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
