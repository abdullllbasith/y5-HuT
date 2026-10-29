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

  const restoreBtn = (e: PriceHistoryEntry) => {
    const now = priceNow(e);
    const gone = now === undefined;
    const same = now === e.oldPriceLKR;
    return (
      <button
        onClick={() => setRestoring(e)}
        disabled={!canEdit || gone || same}
        title={!canEdit ? 'View only for this simulated role' : gone ? 'Product no longer exists' : same ? 'Already at this price' : 'Restore this previous price'}
        className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-slate-200 text-[11px] font-bold text-slate-600 hover:border-[#E11D48] hover:text-[#E11D48] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      >
        <RotateCcw className="w-3 h-3" /> Restore previous
      </button>
    );
  };

  return (
    <>
      <DemoNotice>
        This history is kept in this browser's local storage for the demo. It is <strong>not a secure audit trail</strong>:
        anyone using this browser can clear it, and staff names come from the simulated demo role.
      </DemoNotice>

      {message && (
        <div role="status" className="flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2.5 text-xs text-emerald-900">
          <CheckCircle className="w-4 h-4" /> {message}
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 p-3 flex flex-col md:flex-row gap-2 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name or SKU…" className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#E11D48]/30" />
        </div>
        <select aria-label="Action source" value={source} onChange={(e) => setSource(e.target.value as PriceSource | 'all')} className="px-2 py-2 rounded-lg border border-slate-200 bg-white text-xs text-slate-700">
          <option value="all">All sources</option>
          {(Object.keys(SOURCE_LABEL) as PriceSource[]).map((s) => <option key={s} value={s}>{SOURCE_LABEL[s]}</option>)}
        </select>
      </div>

      {priceHistory.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-slate-300 p-10 text-center">
          <History className="w-8 h-8 mx-auto text-slate-300" />
          <div className="mt-2 text-sm font-bold text-slate-800">No price changes yet</div>
          <p className="text-xs text-slate-500">Publish a price from Price Manager or Import / Export and it will appear here.</p>
        </div>
      ) : visible.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-slate-300 p-10 text-center text-xs text-slate-500">No entries match your search.</div>
      ) : (
        <>
          <div className="text-[11px] text-slate-500">Showing {visible.length} of {priceHistory.length} entries (latest 500 are kept)</div>

          {/* Table (tablet and desktop) */}
          <div className="hidden md:block bg-white rounded-xl border border-slate-200 overflow-x-auto shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider font-bold">
                <tr>
                  <th className="px-3 py-3">When</th>
                  <th className="px-3 py-3">Product / SKU</th>
                  <th className="px-3 py-3 text-right">Previous (LKR)</th>
                  <th className="px-3 py-3 text-right">New (LKR)</th>
                  <th className="px-3 py-3">Source</th>
                  <th className="px-3 py-3">Demo staff</th>
                  <th className="px-3 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visible.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50">
                    <td className="px-3 py-2 whitespace-nowrap text-slate-500">{new Date(e.at).toLocaleString()}</td>
                    <td className="px-3 py-2">
                      <div className="font-bold text-slate-900">{e.productName}</div>
                      <div className="text-[11px] text-slate-500">{e.label} <span className="font-mono text-slate-400">{e.sku}</span></div>
                    </td>
                    <td className="px-3 py-2 text-right font-mono tabular-nums text-slate-500">{formatLKR(e.oldPriceLKR)}</td>
                    <td className="px-3 py-2 text-right font-mono tabular-nums font-bold">
                      {formatLKR(e.newPriceLKR)}
                      <div className="text-[10px] font-normal text-slate-500">{formatPercent(percentChange(e.oldPriceLKR, e.newPriceLKR))}</div>
                    </td>
                    <td className="px-3 py-2"><span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">{SOURCE_LABEL[e.source]}</span></td>
                    <td className="px-3 py-2 text-slate-600">{e.by}</td>
                    <td className="px-3 py-2 text-right">{restoreBtn(e)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards (mobile) */}
          <ul className="md:hidden space-y-2">
            {visible.map((e) => (
              <li key={e.id} className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs space-y-1.5">
                <div className="flex justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-slate-900 truncate">{e.productName}</div>
                    <div className="text-[11px] text-slate-500">{e.label} <span className="font-mono text-slate-400">{e.sku}</span></div>
                  </div>
                  <span className="self-start px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold whitespace-nowrap">{SOURCE_LABEL[e.source]}</span>
                </div>
                <div className="font-mono tabular-nums text-sm">
                  <span className="text-slate-500">{formatLKR(e.oldPriceLKR)}</span> → <strong>{formatLKR(e.newPriceLKR)}</strong>
                  <span className="ml-2 text-[11px] text-slate-500">{formatPercent(percentChange(e.oldPriceLKR, e.newPriceLKR))}</span>
                </div>
                <div className="text-[10px] text-slate-400">{new Date(e.at).toLocaleString()} · {e.by}</div>
                <div>{restoreBtn(e)}</div>
              </li>
            ))}
          </ul>
        </>
      )}

      {restoring && (
        <RestoreDialog entry={restoring} currentPrice={priceNow(restoring) ?? restoring.newPriceLKR} onCancel={() => setRestoring(null)} onConfirm={confirmRestore} />
      )}
    </>
  );
};
