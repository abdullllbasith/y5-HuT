import React, { useState } from 'react';
import { useStore } from '../../../context/StoreContext';
import { OrderStatus } from '../../../types';
import { Mail } from 'lucide-react';
import { Dot } from '../../ui/Dot';

export const OrdersPage: React.FC = () => {
  const { orders, updateOrderStatus, setPreviewingEmail, formatPrice, currentUser } = useStore();
  const [orderFilter, setOrderFilter] = useState<OrderStatus | 'all'>('all');
  const canManageOrders =
    currentUser.role === 'super_admin' || currentUser.role === 'inventory_manager' || currentUser.role === 'sales_rep';

  return (
    <>
      {!canManageOrders && (
        <div className="rounded-xl border border-ink/10 bg-paper-sunk px-4 py-2.5 text-xs text-ink-muted mb-4 text-left">
          View only for the simulated <strong className="text-ink">{currentUser.role.replace('_', ' ')}</strong> role. Roles are a demo simulation and are not real security.
        </div>
      )}

      <div className="bg-paper-card rounded-2xl border border-ink/10 overflow-hidden space-y-4 p-5 sm:p-6 shadow-paper text-left">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-ink font-display">
              Order Fulfillments &amp; Live Waybills
            </h3>
            <p className="text-xs text-ink-muted mt-0.5">
              Advancing status dispatches automated milestone emails and Pronto Express courier waybills.
            </p>
          </div>

          {/* Filter buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {(['all', 'confirmed', 'processing', 'dispatched', 'delivered'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setOrderFilter(st)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl capitalize transition-colors cursor-pointer min-h-[32px] ${
                  orderFilter === st
                    ? 'bg-red text-paper shadow-sm'
                    : 'bg-paper-sunk text-ink-muted border border-ink/10 hover:text-ink'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto border border-ink/10 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-paper-sunk border-b border-ink/10 text-ink-muted uppercase font-bold tracking-wider text-[10px] font-mono">
              <tr>
                <th className="px-4 py-3">Order Ref</th>
                <th className="px-4 py-3">Client / Recipient</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Payment Method</th>
                <th className="px-4 py-3">Milestone</th>
                <th className="px-4 py-3 text-right">Fulfillment Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5 text-ink bg-paper-card">
              {orders
                .filter((o) => (orderFilter === 'all' ? true : o.status === orderFilter))
                .map((ord) => (
                  <tr key={ord.id} className="hover:bg-paper-sunk/40 transition-colors">
                    <td className="px-4 py-3.5 font-mono font-bold text-ink">
                      {ord.id}
                      <div className="text-[10px] text-ink-muted font-normal font-sans">
                        {new Date(ord.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-ink">{ord.customerName}</div>
                      <div className="text-[11px] text-ink-muted">{ord.customerPhone}</div>
                    </td>
                    <td className="px-4 py-3.5 max-w-xs truncate text-ink-muted font-medium">
                      {ord.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                    </td>
                    <td className="px-4 py-3.5 font-data font-bold text-ink tabular-nums">
                      {formatPrice(ord.totalLKR, ord.totalUSD)}
                    </td>
                    <td className="px-4 py-3.5 uppercase font-bold text-[10px]">
                      <span className="px-2 py-0.5 rounded-full bg-paper-sunk border border-ink/10 text-ink">
                        {ord.paymentMethod}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          ord.status === 'delivered'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : ord.status === 'dispatched'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : ord.status === 'processing'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-paper-sunk text-ink-muted border-ink/10'
                        }`}
                      >
                        <Dot tone={ord.status === 'delivered' ? 'go' : ord.status === 'dispatched' ? 'ink' : ord.status === 'processing' ? 'low' : 'ink'} size="xs" />
                        {ord.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right space-x-1.5 whitespace-nowrap">
                      {ord.status === 'confirmed' && (
                        <button
                          onClick={() => updateOrderStatus(ord.id, 'processing')}
                          disabled={!canManageOrders}
                          className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white rounded-lg text-[11px] font-bold cursor-pointer"
                        >
                          → Mark QC Checked
                        </button>
                      )}
                      {ord.status === 'processing' && (
                        <button
                          onClick={() => updateOrderStatus(ord.id, 'dispatched')}
                          disabled={!canManageOrders}
                          className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-lg text-[11px] font-bold cursor-pointer"
                        >
                          → Dispatch Courier
                        </button>
                      )}
                      {ord.status === 'dispatched' && (
                        <button
                          onClick={() => updateOrderStatus(ord.id, 'delivered')}
                          disabled={!canManageOrders}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-lg text-[11px] font-bold cursor-pointer"
                        >
                          ✓ Mark Delivered
                        </button>
                      )}
                      {ord.status === 'delivered' && (
                        <span className="text-[11px] text-emerald-700 font-bold">
                          Complete
                        </span>
                      )}

                      <button
                        onClick={() => {
                          const emailAlert = {
                            id: `view-${ord.id}`,
                            type: 'milestone' as const,
                            title: `y5Hut.lk Order #${ord.id}`,
                            message: `Order status is ${ord.status}.`,
                            timestamp: 'Log',
                            read: true,
                            orderId: ord.id,
                            emailSubject: `y5Hut.lk Milestone Log #${ord.id}`,
                            emailBodyHtml: `
                              <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #E2E8F0; border-radius: 8px;">
                                <h2 style="color: #E11D48; margin: 0 0 10px 0;">y5<span style="color: #0F172A;">Hut</span>.lk Sri Lanka</h2>
                                <p>Order: <strong>#${ord.id}</strong></p>
                                <p>Customer: <strong>${ord.customerName}</strong> (${ord.customerPhone})</p>
                                <p>Status: <strong style="color: #E11D48;">${ord.status.toUpperCase()}</strong></p>
                                ${ord.trackingNumber ? `<p>Pronto Express Tracking: <strong>${ord.trackingNumber}</strong></p>` : ''}
                                <p>Total: <strong>${formatPrice(ord.totalLKR, ord.totalUSD)}</strong></p>
                              </div>
                            `,
                          };
                          setPreviewingEmail(emailAlert);
                        }}
                        className="p-1.5 text-ink-muted hover:text-ink hover:bg-paper-sunk rounded-lg transition-colors inline-flex items-center cursor-pointer"
                        title="Inspect Milestone Email"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
