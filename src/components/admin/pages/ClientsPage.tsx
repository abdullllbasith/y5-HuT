import React, { useState } from 'react';
import { useStore } from '../../../context/StoreContext';
import { ClientAccount } from '../../../types';
import { TrendingUp, Package, Layers, Users, Shield, Search, Plus, Mail, ChevronRight, Download, AlertTriangle, CheckCircle, Truck, DollarSign, ArrowUpRight } from 'lucide-react';

export const ClientsPage: React.FC = () => {
  const { clients, updateClientAccount, addClientAccount, currentUser, switchUserRole, formatPrice, currency } = useStore();
  const [clientSearch, setClientSearch] = useState('');
  const [isNewClientOpen, setIsNewClientOpen] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newContactName, setNewContactName] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newCreditLimitLKR, setNewCreditLimitLKR] = useState(5000000);
  const canManageClients = currentUser.role === 'super_admin' || currentUser.role === 'sales_rep';

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompanyName.trim() || !newClientEmail.trim()) return;

    const newClient: ClientAccount = {
      id: `cli-lk-${Date.now()}`,
      companyName: newCompanyName,
      contactName: newContactName || 'Corporate Procurement',
      email: newClientEmail,
      phone: '+94 11 200 0000',
      tier: 'Corporate Gold',
      totalSpentLKR: 0,
      totalOrders: 0,
      creditLimitLKR: Number(newCreditLimitLKR),
      outstandingBalanceLKR: 0,
      assignedRep: currentUser.name,
      lastActive: 'Just registered',
      status: 'Active',
    };

    addClientAccount(newClient);
    setIsNewClientOpen(false);
    setNewCompanyName('');
    setNewContactName('');
    setNewClientEmail('');
  };

  return (
    <>
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-xs">
          {!canManageClients ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto border border-amber-200">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h3 className="text-base font-bold text-slate-900">
                  Corporate Client CRM Restricted
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Your current role (<strong className="capitalize">{currentUser.role.replace('_', ' ')}</strong>) is restricted to warehouse inventory and dispatch logistics. Corporate Net-30 credit allocations, enterprise invoicing, and client accounts are managed by Corporate Sales Reps and Super Admin.
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => switchUserRole('sales_rep')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  Simulate Corporate Sales Rep
                </button>
                <button
                  onClick={() => switchUserRole('super_admin')}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  Simulate Super Admin
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-sans">
                    Corporate Client Accounts &amp; Net-30 Portfolios
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Corporate procurement ledgers across Dialog Axiata, MAS Holdings, John Keells, and enterprise partners.
                  </p>
                </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search client company..."
                  value={clientSearch}
                  onChange={(e) => setClientSearch(e.target.value)}
                  className="text-xs pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#E11D48]"
                />
              </div>

              {canManageClients && (
                <button
                  onClick={() => setIsNewClientOpen(true)}
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#E11D48] hover:bg-[#BE123C] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Register Corporate Client</span>
                </button>
              )}
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-bold tracking-wider">
                <tr>
                  <th className="px-4 py-3">Company &amp; Key Contact</th>
                  <th className="px-4 py-3">Tier</th>
                  <th className="px-4 py-3">Total Spend (LKR)</th>
                  <th className="px-4 py-3">Credit Limit (LKR)</th>
                  <th className="px-4 py-3">Outstanding</th>
                  <th className="px-4 py-3">Account Rep</th>
                  <th className="px-4 py-3 text-right">Adjust Credit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {clients
                  .filter((c) =>
                    clientSearch.trim()
                      ? c.companyName.toLowerCase().includes(clientSearch.toLowerCase()) ||
                        c.contactName.toLowerCase().includes(clientSearch.toLowerCase())
                      : true
                  )
                  .map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-slate-900">{c.companyName}</div>
                        <div className="text-[11px] text-slate-500">{c.contactName} · {c.email}</div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="font-bold text-slate-800">{c.tier}</span>
                      </td>
                      <td className="px-4 py-3.5 font-mono font-bold text-slate-950 tabular-nums">
                        Rs. {c.totalSpentLKR.toLocaleString()}
                        <div className="text-[10px] text-slate-400 font-normal">
                          {c.totalOrders} total orders
                        </div>
                      </td>
                      <td className="px-4 py-3.5 font-mono tabular-nums text-slate-700">
                        Rs. {c.creditLimitLKR.toLocaleString()}
                      </td>
                      <td className="px-4 py-3.5 font-mono font-bold tabular-nums">
                        {c.outstandingBalanceLKR > 0 ? (
                          <span className="text-[#E11D48]">
                            Rs. {c.outstandingBalanceLKR.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-emerald-700">Rs. 0.00</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-slate-600">{c.assignedRep}</td>
                      <td className="px-4 py-3.5 text-right">
                        <button
                          onClick={() => {
                            const newLimit = prompt(
                              `Update credit limit for ${c.companyName} (LKR):`,
                              String(c.creditLimitLKR)
                            );
                            if (newLimit && !isNaN(Number(newLimit))) {
                              updateClientAccount(c.id, { creditLimitLKR: Number(newLimit) });
                            }
                          }}
                          className="px-2.5 py-1 text-xs border border-slate-300 hover:bg-slate-50 rounded text-slate-700 font-bold cursor-pointer"
                        >
                          Edit Limit
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>

      {/* Modal: Register Client */}
      {isNewClientOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-slate-200 p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Register Sri Lankan Corporate Client</h3>
            <form onSubmit={handleCreateClient} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Company Legal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Brandix Lanka, Hayleys PLC"
                  value={newCompanyName}
                  onChange={(e) => setNewCompanyName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#E11D48]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Procurement Contact Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pradeep Jayasuriya"
                  value={newContactName}
                  onChange={(e) => setNewContactName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#E11D48]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Billing Email (Net-30 Invoices)</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. accounts@brandix.com"
                  value={newClientEmail}
                  onChange={(e) => setNewClientEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#E11D48]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Approved Credit Limit (LKR Rs.)</label>
                <input
                  type="number"
                  min="500000"
                  step="500000"
                  required
                  value={newCreditLimitLKR}
                  onChange={(e) => setNewCreditLimitLKR(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsNewClientOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#E11D48] text-white rounded-lg font-bold hover:bg-[#BE123C] cursor-pointer"
                >
                  Authorize Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
