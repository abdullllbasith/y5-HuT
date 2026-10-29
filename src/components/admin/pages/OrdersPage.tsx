import React, { useState } from 'react';
import { useStore } from '../../../context/StoreContext';
import { OrderStatus } from '../../../types';
import { TrendingUp, Package, Layers, Users, Shield, Search, Plus, Mail, ChevronRight, Download, AlertTriangle, CheckCircle, Truck, DollarSign, ArrowUpRight } from 'lucide-react';

export const OrdersPage: React.FC = () => {
  const { orders, updateOrderStatus, setPreviewingEmail, formatPrice, currentUser } = useStore();
  const [orderFilter, setOrderFilter] = useState<OrderStatus | 'all'>('all');
  const [orderSearch, setOrderSearch] = useState('');
  const canManageOrders =
    currentUser.role === 'super_admin' || currentUser.role === 'inventory_manager' || currentUser.role === 'sales_rep';

  return (
    <>
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden space-y-4 p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-sans">
                Order Fulfillments &amp; Live Waybills
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Advancing status dispatches automated milestone emails and Pronto Express courier waybills.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1 flex-wrap">
              {(['all', 'confirmed', 'processing', 'dispatched', 'delivered'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setOrderFilter(st)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg capitalize transition-colors cursor-pointer ${
                    orderFilter === st
                      ? 'bg-[#E11D48] text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-bold tracking-wider">
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
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {orders
                  .filter((o) => (orderFilter === 'all' ? true : o.status === orderFilter))
                  .map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3.5 font-mono font-bold text-slate-900">
                        {ord.id}
                        <div className="text-[10px] text-slate-400 font-normal">
                          {new Date(ord.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-slate-900">{ord.customerName}</div>
                        <div className="text-[11px] text-slate-500">{ord.customerPhone}</div>
                      </td>
                      <td className="px-4 py-3.5 max-w-xs truncate">
                        {ord.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                      </td>
                      <td className="px-4 py-3.5 font-mono font-bold text-slate-950 tabular-nums">
                        {formatPrice(ord.totalLKR, ord.totalUSD)}
                      </td>
                      <td className="px-4 py-3.5 uppercase font-bold text-[10px]">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                          {ord.paymentMethod}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                            ord.status === 'delivered'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : ord.status === 'dispatched'
                              ? 'bg-blue-50 text-blue-800 border border-blue-200'
                              : ord.status === 'processing'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-slate-100 text-slate-800 border border-slate-300'
                          }`}
                        >
                          {ord.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right space-x-1.5 whitespace-nowrap">
                        {ord.status === 'confirmed' && (
                          <button
                            onClick={() => updateOrderStatus(ord.id, 'processing')}
                            className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-[11px] font-bold cursor-pointer"
                          >
                            → Mark QC Checked
                          </button>
                        )}
                        {ord.status === 'processing' && (
                          <button
                            onClick={() => updateOrderStatus(ord.id, 'dispatched')}
                            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[11px] font-bold cursor-pointer"
                          >
                            → Dispatch Courier
                          </button>
                        )}
                        {ord.status === 'dispatched' && (
                          <button
                            onClick={() => updateOrderStatus(ord.id, 'delivered')}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold cursor-pointer"
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
                          className="p-1 text-slate-500 hover:text-slate-900 rounded"
                          title="Inspect Milestone Email"
                        >
                          <Mail className="w-4 h-4 inline" />
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
