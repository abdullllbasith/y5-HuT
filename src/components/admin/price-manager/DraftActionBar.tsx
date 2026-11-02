import React from 'react';
import { PriceDraft } from './usePriceDraft';
import { Save, Trash2, AlertCircle } from 'lucide-react';
import { Dot } from '../../ui/Dot';

interface Props {
  draft: PriceDraft;
  onReview: () => void;
  onDiscard: () => void;
}

export const DraftActionBar: React.FC<Props> = ({ draft, onReview, onDiscard }) => {
  const dirty = draft.entries.length;
  const hasDraft = Object.values(draft.drafts).some((v) => v !== '');
  const n = draft.changes.length;

  return (
    <aside
      aria-label="Pending Price Changes"
      className={`md:sticky md:top-2 md:z-20 rounded-2xl border border-line bg-card/95 backdrop-blur-md px-4 py-3 shadow-hard transition-all duration-200 ${
        dirty === 0 ? 'max-md:hidden' : ''
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2.5">
        <div className="text-xs text-ink flex items-center gap-2.5 min-w-0 font-ui" aria-live="polite">
          {dirty === 0 ? (
            <span className="text-ink-soft">
              Type a new rupee price in any row. <span className="hidden md:inline">Nothing is written to the store until you publish.</span>
            </span>
          ) : (
            <div className="flex items-center gap-2">
              <Dot tone="red" size="sm" pulse />
              <span className="font-bold text-ink">
                <span className="font-data text-red font-extrabold">{n}</span> staged edit{n === 1 ? '' : 's'} pending publish
              </span>
              {draft.invalid.length > 0 && (
                <span className="text-red font-bold flex items-center gap-1 font-data text-[11px] bg-red-wash px-2 py-0.5 rounded-full border border-red/20">
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
            className="flex-1 sm:flex-none h-11 md:h-10 px-4 text-xs font-bold rounded-full border border-line bg-paper text-ink hover:text-red hover:border-ink disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors flex items-center justify-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Discard</span>
          </button>
          
          <button
            type="button"
            onClick={onReview}
            disabled={dirty === 0}
            title="Check scope and publish changes"
            className="flex-[2] sm:flex-none h-11 md:h-10 px-5 text-xs font-bold rounded-full bg-red text-white hover:bg-red-ink disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all shadow-hard-sm flex items-center justify-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Review &amp; Publish{n > 0 ? ` (${n})` : ''}</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
