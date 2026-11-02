import React, { useMemo, useState } from 'react';
import { CheckCircle, History, RotateCcw, Search, ArrowRight } from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { PriceHistoryEntry, PriceSource } from '../../../types';
import { buildPriceRows } from '../../../lib/priceRows';
import { formatLKR, formatPercent, percentChange } from '../../../lib/priceValidation';
import { DemoNotice } from '../../common/DemoNotice';
import { RestoreDialog } from './RestoreDialog';
import { Dot } from '../../ui/Dot';

const SOURCE_LABEL: Record<PriceSource, string> = {
  'quick-edit': 'QUICK EDIT',
  bulk: 'BULK',
  csv: 'CSV IMPORT',
  restore: 'RESTORE',
  undo: 'UNDO',
};

const SOURCE_BADGE: Record<PriceSource, string> = {
  'quick-edit': 'bg-paper-sunk text-ink border-line',
  bulk: 'bg-highlighter/40 text-ink border-line',
  csv: 'bg-paper text-ink border-line font-bold',
  restore: 'bg-red-wash text-red border-red/30',
  undo: 'bg-paper-sunk text-ink-soft border-line',
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
        } items-center justify-center gap-1.5 px-3.5 py-2 rounded-full border border-line bg-paper text-xs font-bold text-ink hover:border-ink hover:text-red disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer min-h-[38px] transition-colors`}
      >
        <RotateCcw className="w-3.5 h-3.5 text-red" />
        <span>Restore Previous Price</span>
      </button>
    );
  };

  return (
    <div className="space-y-4 text-left font-ui">
      <DemoNotice>
        This history is kept in this browser's local storage for the demo. It is <strong>not a secure audit trail</strong>:
        anyone using this browser can clear it, and staff names come from the simulated demo role.
      </DemoNotice>

      {message && (
        <div role="status" className="flex items-center gap-2 rounded-2xl border border-go/20 bg-go/10 px-4 py-3 text-xs text-go font-bold">
          <CheckCircle className="w-4 h-4 text-go shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-card rounded-2xl border border-line p-3.5 flex flex-col sm:flex-row gap-2.5 shadow-hard-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-ink-soft absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search price history by name or SKU…"
            className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-line bg-paper text-xs font-ui text-ink focus:outline-none focus:border-ink min-h-[42px]"
          />
        </div>
        <select
          aria-label="Action source"
          value={source}
          onChange={(e) => setSource(e.target.value as PriceSource | 'all')}
          className="px-3.5 py-2.5 rounded-xl border border-line bg-paper text-xs text-ink font-semibold min-h-[42px] cursor-pointer"
        >
          <option value="all">All Sources</option>
          {(Object.keys(SOURCE_LABEL) as PriceSource[]).map((s) => (
            <option key={s} value={s}>{SOURCE_LABEL[s]}</option>
          ))}
        </select>
      </div>

      {priceHistory.length === 0 ? (
        <div className="bg-card rounded-2xl border border-dashed border-line p-10 text-center space-y-2">
          <History className="w-8 h-8 mx-auto text-ink-soft" />
          <div className="font-display text-base font-bold text-ink">No price changes yet</div>
          <p className="font-ui text-xs text-ink-soft">Publish a price from Price Manager or CSV Import to populate the timeline.</p>
        </div>
      ) : visible.length === 0 ? (
        <div className="bg-card rounded-2xl border border-dashed border-line p-10 text-center text-xs text-ink-soft font-ui">
          No entries match your search criteria.
        </div>
      ) : (
        <>
          <div className="font-data text-[11px] text-ink-soft font-medium">
            Showing {visible.length} of {priceHistory.length} audit logs (latest 500 retained locally)
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block bg-card rounded-2xl border border-line overflow-x-auto shadow-hard-sm">
            <table className="w-full text-left text-xs font-ui">
              <thead className="bg-paper-sunk border-b border-line text-ink-soft uppercase font-data text-[10px] tracking-wider font-bold">
                <tr>
                  <th className="px-3.5 py-3">Timestamp</th>
                  <th className="px-3.5 py-3">Product / SKU</th>
                  <th className="px-3.5 py-3 text-right">Previous Price</th>
                  <th className="px-3.5 py-3 text-right">Updated Tag</th>
                  <th className="px-3.5 py-3">Source Stamp</th>
                  <th className="px-3.5 py-3">Auditor</th>
                  <th className="px-3.5 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {visible.map((e) => (
                  <tr key={e.id} className="hover:bg-paper-sunk/40 transition-colors">
                    <td className="px-3.5 py-3 whitespace-nowrap text-ink-soft font-data text-[11px]">
                      {new Date(e.at).toLocaleString()}
                    </td>
                    <td className="px-3.5 py-3">
                      <div className="font-bold text-ink">{e.productName}</div>
                      <div className="font-data text-[11px] text-ink-soft">
                        {e.label} <span className="opacity-75 font-mono">({e.sku})</span>
                      </div>
                    </td>
                    <td className="px-3.5 py-3 text-right font-data tabular-nums text-red line-through">
                      {formatLKR(e.oldPriceLKR)}
                    </td>
                    <td className="px-3.5 py-3 text-right font-data tabular-nums font-bold">
                      <div className="text-ink">{formatLKR(e.newPriceLKR)}</div>
                      <div className="text-[10px] font-normal text-ink-soft">
                        {formatPercent(percentChange(e.oldPriceLKR, e.newPriceLKR))}
                      </div>
                    </td>
                    <td className="px-3.5 py-3">
                      <span className={`px-2 py-0.5 rounded-full font-data text-[9px] font-bold border ${SOURCE_BADGE[e.source]}`}>
                        {SOURCE_LABEL[e.source]}
                      </span>
                    </td>
                    <td className="px-3.5 py-3 font-data text-[11px] text-ink-soft">{e.by}</td>
                    <td className="px-3.5 py-3 text-right">{restoreBtn(e, false)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Timeline Cards */}
          <ul className="md:hidden space-y-3">
            {visible.map((e) => (
              <li key={e.id} className="bg-card rounded-2xl border border-line p-4 shadow-hard-sm space-y-3 text-left">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-ui font-bold text-sm text-ink truncate">{e.productName}</div>
                    <div className="font-data text-[11px] text-ink-soft mt-0.5">
                      {e.label} <span className="font-mono text-ink-soft font-semibold">{e.sku}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full font-data text-[9px] font-bold whitespace-nowrap border ${SOURCE_BADGE[e.source]}`}>
                    {SOURCE_LABEL[e.source]}
                  </span>
                </div>

                <div className="bg-paper p-3 rounded-xl border border-line flex items-center justify-between">
                  <div className="font-data tabular-nums text-xs">
                    <span className="text-red line-through mr-1.5">{formatLKR(e.oldPriceLKR)}</span>
                    <strong className="text-ink text-sm font-bold">{formatLKR(e.newPriceLKR)}</strong>
                  </div>
                  <span className={`text-[10px] font-data font-bold px-2 py-0.5 rounded-full ${
                    e.newPriceLKR >= e.oldPriceLKR ? 'bg-paper-sunk text-ink border border-line' : 'bg-highlighter text-ink'
                  }`}>
                    {formatPercent(percentChange(e.oldPriceLKR, e.newPriceLKR))}
                  </span>
                </div>

                <div className="font-data text-[10px] text-ink-soft">
                  {new Date(e.at).toLocaleString()} · Updated by {e.by}
                </div>

                <div className="pt-1 border-t border-line">
                  {restoreBtn(e, true)}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      {restoring && (
        <RestoreDialog
          entry={restoring}
          currentPrice={priceNow(restoring) ?? restoring.newPriceLKR}
          onCancel={() => setRestoring(null)}
          onConfirm={confirmRestore}
        />
      )}
    </div>
  );
};
