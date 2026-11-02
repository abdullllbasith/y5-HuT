import React, { useState } from 'react';
import { useStore } from '../../../context/StoreContext';
import { ClientAccount } from '../../../types';
import { Search, Plus, AlertTriangle } from 'lucide-react';

export const ClientsPage: React.FC = () => {
  const { clients, updateClientAccount, addClientAccount, currentUser, switchUserRole } = useStore();
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
      <div className="bg-paper-card rounded-2xl border border-ink/10 p-5 sm:p-6 space-y-4 shadow-paper text-left">
        {!canManageClients ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto border border-amber-200">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="text-base font-bold text-ink font-display">
                Corporate Client CRM Restricted
              </h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                Your current role (<strong className="capitalize text-ink">{currentUser.role.replace('_', ' ')}</strong>) is restricted to warehouse inventory and dispatch logistics. Corporate Net-30 credit allocations, enterprise invoicing, and client accounts are managed by Corporate Sales Reps and Super Admin.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => switchUserRole('sales_rep')}
                className="px-4 py-2 bg-red text-paper hover:bg-red/90 rounded-xl text-xs font-bold transition-colors cursor-pointer min-h-[38px]"
              >
                Simulate Corporate Sales Rep
              </button>
              <button
                onClick={() => switchUserRole('super_admin')}
                className="px-4 py-2 bg-paper-sunk hover:bg-ink/5 border border-ink/10 text-ink rounded-xl text-xs font-bold transition-colors cursor-pointer min-h-[38px]"
              >
                Simulate Super Admin
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-ink font-display">
                  Corporate Client Accounts &amp; Net-30 Portfolios
                </h3>
                <p className="text-xs text-ink-muted mt-0.5">
                  Corporate procurement ledgers across fictional sample companies (demo data).
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search client company..."
                    value={clientSearch}
                    onChange={(e) => setClientSearch(e.target.value)}
                    className="text-xs pl-8 pr-3 py-2 border border-ink/15 rounded-xl bg-paper text-ink focus:outline-none focus:border-red min-h-[38px]"
                  />
                </div>

                {canManageClients && (
                  <button
                    onClick={() => setIsNewClientOpen(true)}
                    className="px-4 py-2 text-xs font-bold text-paper bg-red hover:bg-red/90 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer min-h-[38px] shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Register Corporate Client</span>
                  </button>
                )}
              </div>
            </div>

            <div className="overflow-x-auto border border-ink/10 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-paper-sunk border-b border-ink/10 text-ink-muted uppercase font-bold tracking-wider text-[10px] font-mono">
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
                <tbody className="divide-y divide-ink/5 text-ink bg-paper-card">
                  {clients
                    .filter((c) =>
                      clientSearch.trim()
                        ? c.companyName.toLowerCase().includes(clientSearch.toLowerCase()) ||
                          c.contactName.toLowerCase().includes(clientSearch.toLowerCase())
                        : true
                    )
                    .map((c) => (
                      <tr key={c.id} className="hover:bg-paper-sunk/40 transition-colors">
                        <td className="px-4 py-3.5">
                          <div className="font-bold text-ink">{c.companyName}</div>
                          <div className="text-[11px] text-ink-muted">{c.contactName} · {c.email}</div>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="font-bold text-ink px-2 py-0.5 rounded-full bg-paper-sunk border border-ink/10 text-[11px]">{c.tier}</span>
                        </td>
                        <td className="px-4 py-3.5 font-data font-bold text-ink tabular-nums">
                          Rs. {c.totalSpentLKR.toLocaleString()}
                          <div className="text-[10px] text-ink-muted font-normal font-sans">
                            {c.totalOrders} total orders
                          </div>
                        </td>
                        <td className="px-4 py-3.5 font-data tabular-nums text-ink-muted">
                          Rs. {c.creditLimitLKR.toLocaleString()}
                        </td>
                        <td className="px-4 py-3.5 font-data font-bold tabular-nums">
                          {c.outstandingBalanceLKR > 0 ? (
                            <span className="text-red">
                              Rs. {c.outstandingBalanceLKR.toLocaleString()}
                            </span>
                          ) : (
                            <span className="text-emerald-700">Rs. 0.00</span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-ink-muted">{c.assignedRep}</td>
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
                            className="px-2.5 py-1 text-xs border border-ink/15 hover:bg-paper-sunk rounded-lg text-ink font-bold cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs">
          <div className="bg-paper-card rounded-2xl shadow-paper max-w-md w-full border border-ink/15 p-6 space-y-4 text-left">
            <h3 className="text-base font-bold text-ink font-display">Register Sri Lankan Corporate Client</h3>
            <form onSubmit={handleCreateClient} className="space-y-3 text-xs">
              <div>
                <label className="block text-ink font-bold mb-1">Company Legal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sample Company Ltd"
                  value={newCompanyName}
                  onChange={(e) => setNewCompanyName(e.target.value)}
                  className="w-full px-3 py-2 border border-ink/15 bg-paper rounded-xl text-ink focus:outline-none focus:border-red"
                />
              </div>

              <div>
                <label className="block text-ink font-bold mb-1">Procurement Contact Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pradeep Jayasuriya"
                  value={newContactName}
                  onChange={(e) => setNewContactName(e.target.value)}
                  className="w-full px-3 py-2 border border-ink/15 bg-paper rounded-xl text-ink focus:outline-none focus:border-red"
                />
              </div>

              <div>
                <label className="block text-ink font-bold mb-1">Billing Email (Net-30 Invoices)</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. accounts@example.lk"
                  value={newClientEmail}
                  onChange={(e) => setNewClientEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-ink/15 bg-paper rounded-xl text-ink focus:outline-none focus:border-red"
                />
              </div>

              <div>
                <label className="block text-ink font-bold mb-1">Approved Credit Limit (LKR Rs.)</label>
                <input
                  type="number"
                  min="500000"
                  step="500000"
                  required
                  value={newCreditLimitLKR}
                  onChange={(e) => setNewCreditLimitLKR(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-ink/15 bg-paper rounded-xl text-ink font-data"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsNewClientOpen(false)}
                  className="px-4 py-2 text-ink-muted hover:text-ink cursor-pointer min-h-[38px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red text-paper rounded-xl font-bold hover:bg-red/90 cursor-pointer min-h-[38px] shadow-sm"
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
