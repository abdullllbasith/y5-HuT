import React, { useMemo, useState } from 'react';
import { CheckCircle, History, RotateCcw, Search } from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { PriceHistoryEntry, PriceSource } from '../../../types';
import { buildPriceRows } from '../../../lib/priceRows';
import { formatLKR, formatPercent, percentChange } from '../../../lib/priceValidation';
import { DemoNotice } from '../../common/DemoNotice';
import { RestoreDialog } from './RestoreDialog';

const SOURCE_LABEL: Record<PriceSource, string> = {
  'quick-edit': 'Quick edit',
  bulk: 'Bulk update',
  csv: 'CSV import',
  restore: 'Restore',
  undo: 'Undo',
};

export const PriceHistoryPage: React.FC = () => {
  const { priceHistory, products, publishPriceChanges, currentUser } = useStore();
  const [search, setSearch] = useState('');
  const [source, setSource] = useState<PriceSource | 'all'>('all');
  const [restoring, setRestoring] = useState<PriceHistoryEntry | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const canEdit = currentUser.role === 'super_admin' || currentUser.role === 'inventory_manager';

  const currentByKey = useMemo(() => new Map(buildPriceRows(products).map((r) => [`${r.productId}::${r.variantId ?? '-'}`, r.priceLKR])), [products]);
  const priceNow = (e: PriceHistoryEntry) => currentByKey.get(`${e.productId}::${e.variantId ?? '-'}`);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return priceHistory.filter((e) => {
      if (source !== 'all' && e.source !== source) return false;
      return !q || e.sku.toLowerCase().includes(q) || e.productName.toLowerCase().includes(q);
    });
  }, [priceHistory, search, source]);

  const confirmRestore = () => {
    if (!restoring) return;
    // Exactly one change, for exactly this variant; recorded as a new history entry.
    const { applied } = publishPriceChanges([
      { productId: restoring.productId, variantId: restoring.variantId, newPriceLKR: restoring.oldPriceLKR, source: 'restore' },
    ]);
    setMessage(applied ? `Restored ${restoring.sku} to ${formatLKR(restoring.oldPriceLKR)} (logged as a new entry).` : 'Nothing to restore: the price already matches.');
    setRestoring(null);
  };

  const restoreBtn = (e: PriceHistoryEntry, isMobile = false) => {
    const now = priceNow(e);
    const gone = now === undefined;
    const same = now === e.oldPriceLKR;
    return (
      <button
        onClick={() => setRestoring(e)}
        disabled={!canEdit || gone || same}
        title={!canEdit ? 'View only for this simulated role' : gone ? 'Product no longer exists' : same ? 'Already at this price' : 'Restore this previous price'}
        className={`${
          isMobile ? 'w-full' : 'inline-flex'
        } items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:border-[#E11D48] hover:text-[#E11D48] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer min-h-[38px] transition-colors`}
      >
        <RotateCcw className="w-3.5 h-3.5 text-[#E11D48]" />
        <span>Restore Previous Price</span>
      </button>
    );
  };

  return (
    <div className="space-y-4 text-left">
      <DemoNotice>
        This history is kept in this browser's local storage for the demo. It is <strong>not a secure audit trail</strong>:
        anyone using this browser can clear it, and staff names come from the simulated demo role.
      </DemoNotice>

      {message && (
        <div role="status" className="flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2.5 text-xs text-emerald-900 shadow-2xs">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      <div className="bg-white rounded-[18px] border border-[#E5E7EB] p-3.5 flex flex-col sm:flex-row gap-2.5 shadow-2xs text-left">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or SKU…"
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#E11D48]/30 min-h-[42px]"
          />
        </div>
        <select
          aria-label="Action source"
          value={source}
          onChange={(e) => setSource(e.target.value as PriceSource | 'all')}
          className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 min-h-[42px] focus:outline-none focus:ring-2 focus:ring-[#E11D48]/30"
        >
          <option value="all">All sources</option>
          {(Object.keys(SOURCE_LABEL) as PriceSource[]).map((s) => <option key={s} value={s}>{SOURCE_LABEL[s]}</option>)}
        </select>
      </div>

      {priceHistory.length === 0 ? (
        <div className="bg-white rounded-[18px] border border-dashed border-slate-300 p-10 text-center">
          <History className="w-8 h-8 mx-auto text-slate-300" />
          <div className="mt-2 text-sm font-bold text-slate-800 font-sans">No price changes yet</div>
          <p className="text-xs text-slate-500 mt-1">Publish a price from Price Manager or Import / Export and it will appear here.</p>
        </div>
      ) : visible.length === 0 ? (
        <div className="bg-white rounded-[18px] border border-dashed border-slate-300 p-10 text-center text-xs text-slate-500">
          No entries match your search.
        </div>
      ) : (
        <>
          <div className="text-[11px] text-slate-500 font-medium">Showing {visible.length} of {priceHistory.length} entries (latest 500 are kept)</div>

          {/* Table (tablet and desktop) */}
          <div className="hidden md:block bg-white rounded-[18px] border border-[#E5E7EB] overflow-x-auto shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F8FA] border-b border-[#E5E7EB] text-slate-600 uppercase tracking-wider text-[10px] font-mono">
                <tr>
                  <th className="px-3.5 py-3">When</th>
                  <th className="px-3.5 py-3">Product / SKU</th>
                  <th className="px-3.5 py-3 text-right">Previous (LKR)</th>
                  <th className="px-3.5 py-3 text-right">New (LKR)</th>
                  <th className="px-3.5 py-3">Source</th>
                  <th className="px-3.5 py-3">Demo staff</th>
                  <th className="px-3.5 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visible.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-3.5 py-2.5 whitespace-nowrap text-slate-500 text-[11px]">{new Date(e.at).toLocaleString()}</td>
                    <td className="px-3.5 py-2.5">
                      <div className="font-bold text-[#111827]">{e.productName}</div>
                      <div className="text-[11px] text-[#6B7280]">{e.label} <span className="font-mono text-slate-400">{e.sku}</span></div>
                    </td>
                    <td className="px-3.5 py-2.5 text-right font-mono tabular-nums text-slate-500">{formatLKR(e.oldPriceLKR)}</td>
                    <td className="px-3.5 py-2.5 text-right font-mono tabular-nums font-bold">
                      <div className="text-[#111827]">{formatLKR(e.newPriceLKR)}</div>
                      <div className="text-[10px] font-normal text-slate-500">{formatPercent(percentChange(e.oldPriceLKR, e.newPriceLKR))}</div>
                    </td>
                    <td className="px-3.5 py-2.5"><span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200">{SOURCE_LABEL[e.source]}</span></td>
                    <td className="px-3.5 py-2.5 text-slate-600">{e.by}</td>
                    <td className="px-3.5 py-2.5 text-right">{restoreBtn(e, false)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards (mobile) */}
          <ul className="md:hidden space-y-3">
            {visible.map((e) => (
              <li key={e.id} className="bg-white rounded-[18px] border border-[#E5E7EB] p-4 shadow-2xs space-y-3 text-left">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-[#111827] truncate">{e.productName}</div>
                    <div className="text-[11px] text-[#6B7280] mt-0.5">{e.label} <span className="font-mono text-slate-500 font-semibold">{e.sku}</span></div>
                  </div>
                  <span className="self-start px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold whitespace-nowrap border border-slate-200">
                    {SOURCE_LABEL[e.source]}
                  </span>
                </div>

                <div className="bg-[#F7F8FA] p-3 rounded-xl border border-[#E5E7EB] flex items-center justify-between">
                  <div className="font-mono tabular-nums text-xs">
                    <span className="text-slate-500 line-through mr-1.5">{formatLKR(e.oldPriceLKR)}</span>
                    <strong className="text-[#111827] text-sm font-bold">{formatLKR(e.newPriceLKR)}</strong>
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                    e.newPriceLKR >= e.oldPriceLKR ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-600 border border-rose-200'
                  }`}>
                    {formatPercent(percentChange(e.oldPriceLKR, e.newPriceLKR))}
                  </span>
                </div>

                <div className="text-[10px] text-slate-400 font-medium">
                  {new Date(e.at).toLocaleString()} · Updated by {e.by}
                </div>

                <div className="pt-1 border-t border-slate-100">
                  {restoreBtn(e, true)}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      {restoring && (
        <RestoreDialog entry={restoring} currentPrice={priceNow(restoring) ?? restoring.newPriceLKR} onCancel={() => setRestoring(null)} onConfirm={confirmRestore} />
      )}
    </div>
  );
};
