import React from 'react';
import { useStore } from '../../../context/StoreContext';
import { Shield, ArrowUpRight } from 'lucide-react';

export const CustomerAccessGate: React.FC = () => {
  const { currentUser, switchUserRole, setActiveView, setActiveAdminTab } = useStore();
  return (
    <>
      <div className="bg-paper-card rounded-2xl border border-ink/10 p-6 sm:p-8 shadow-paper space-y-6 text-left">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 bg-paper-sunk border border-ink/10 rounded-2xl">
          <div className="w-12 h-12 rounded-2xl bg-red text-paper flex items-center justify-center shrink-0 shadow-sm">
            <Shield className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-red/10 text-red px-2 py-0.5 rounded-full font-mono">
                ROLE SIMULATION (DEMO)
              </span>
              <span className="text-xs font-bold text-ink-muted">
                Current Session: {currentUser.name} (Customer / Buyer)
              </span>
            </div>
            <h2 className="text-xl font-bold text-ink font-display">
              Enterprise Command Center &amp; CRM Access Control
            </h2>
            <p className="text-xs text-ink-muted leading-relaxed max-w-3xl">
              You are currently browsing with a customer account. Under y5Hut.lk enterprise role-based security governance, the store management console, warehouse stock adjustments, corporate Net-30 credit lines, and executive sales analytics are restricted to authorized internal operations personnel.
            </p>
          </div>
        </div>

        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3">
            <h3 className="text-xs font-bold text-ink uppercase tracking-wider font-mono">
              1-Click Interactive Role Simulation:
            </h3>
            <span className="text-xs text-ink-muted">
              Click any role to test its specific interface and permissions
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => {
                switchUserRole('super_admin');
                setActiveAdminTab('analytics');
              }}
              className="p-5 rounded-2xl border border-ink/15 hover:border-red hover:bg-paper-sunk transition-all text-left space-y-2 group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-red group-hover:underline">
                  Super Admin
                </span>
                <span className="text-[10px] bg-red/10 text-red font-bold px-2 py-0.5 rounded-full font-mono">
                  Full Access
                </span>
              </div>
              <div className="text-sm font-bold text-ink">Suren Mendis</div>
              <div className="text-[11px] text-ink-muted font-mono">admin@y5hut.lk</div>
              <p className="text-xs text-ink-muted leading-relaxed pt-1">
                Executive management with unrestricted clearance across Sales Analytics, Orders &amp; Dispatches, Warehouse Stock Audits, Corporate Net-30 CRM, and RBAC governance.
              </p>
              <div className="pt-2 text-xs font-bold text-red flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Simulate as Super Admin</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </button>

            <button
              onClick={() => {
                switchUserRole('inventory_manager');
                setActiveAdminTab('inventory');
              }}
              className="p-5 rounded-2xl border border-ink/15 hover:border-ink hover:bg-paper-sunk transition-all text-left space-y-2 group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-ink group-hover:underline">
                  Inventory Manager
                </span>
                <span className="text-[10px] bg-paper-sunk border border-ink/10 text-ink font-bold px-2 py-0.5 rounded-full font-mono">
                  Logistics &amp; Stock
                </span>
              </div>
              <div className="text-sm font-bold text-ink">Dilshan Silva</div>
              <div className="text-[11px] text-ink-muted font-mono">inventory@y5hut.lk</div>
              <p className="text-xs text-ink-muted leading-relaxed pt-1">
                Warehouse fulfillment lead. Can audit hardware inventory, update stock levels, configure safety thresholds, add new catalog products, and manage order dispatches.
              </p>
              <div className="pt-2 text-xs font-bold text-ink flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Simulate as Inventory Manager</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </button>

            <button
              onClick={() => {
                switchUserRole('sales_rep');
                setActiveAdminTab('clients');
              }}
              className="p-5 rounded-2xl border border-ink/15 hover:border-emerald-600 hover:bg-paper-sunk transition-all text-left space-y-2 group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 group-hover:underline">
                  Corporate Sales Rep
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full font-mono">
                  B2B &amp; Client CRM
                </span>
              </div>
              <div className="text-sm font-bold text-ink">Sarah Lin</div>
              <div className="text-[11px] text-ink-muted font-mono">corporate@y5hut.lk</div>
              <p className="text-xs text-ink-muted leading-relaxed pt-1">
                B2B corporate desk lead. Manages Corporate Client accounts, allocates Net-30 credit limits, inspects monthly revenue charts, and handles corporate purchase orders.
              </p>
              <div className="pt-2 text-xs font-bold text-emerald-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Simulate as Sales Rep</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </button>
          </div>
        </div>

        {/* RBAC Matrix Preview for Customer */}
        <div className="space-y-3 pt-4 border-t border-ink/10">
          <h4 className="text-xs font-bold uppercase tracking-wider text-ink-muted font-mono">
            Role Permission Governance Matrix
          </h4>
          <div className="overflow-x-auto border border-ink/10 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-paper-sunk border-b border-ink/10 text-ink-muted uppercase font-bold tracking-wider text-[10px] font-mono">
                <tr>
                  <th className="px-4 py-3">Permission Scope</th>
                  <th className="px-4 py-3 text-center">Super Admin</th>
                  <th className="px-4 py-3 text-center">Inventory Manager</th>
                  <th className="px-4 py-3 text-center">Corporate Sales</th>
                  <th className="px-4 py-3 text-center text-red">Customer (You)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5 text-ink bg-paper-card">
                <tr>
                  <td className="px-4 py-3 font-bold text-ink">
                    Monthly Sales &amp; Revenue Analytics
                  </td>
                  <td className="px-4 py-3 text-center text-emerald-700 font-bold">✓ Full</td>
                  <td className="px-4 py-3 text-center text-ink-muted">Restricted</td>
                  <td className="px-4 py-3 text-center text-emerald-700 font-bold">✓ Read-Only</td>
                  <td className="px-4 py-3 text-center text-red font-bold">✕ Locked</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-bold text-ink">
                    Warehouse Stock Audits &amp; Reordering
                  </td>
                  <td className="px-4 py-3 text-center text-emerald-700 font-bold">✓ Full</td>
                  <td className="px-4 py-3 text-center text-emerald-700 font-bold">✓ Full Control</td>
                  <td className="px-4 py-3 text-center text-emerald-700 font-bold">✓ View Stock</td>
                  <td className="px-4 py-3 text-center text-emerald-700 font-bold">✓ View Availability</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-bold text-ink">
                    Order Milestones &amp; Courier Waybills
                  </td>
                  <td className="px-4 py-3 text-center text-emerald-700 font-bold">✓ Full</td>
                  <td className="px-4 py-3 text-center text-emerald-700 font-bold">✓ Dispatch Only</td>
                  <td className="px-4 py-3 text-center text-emerald-700 font-bold">✓ Full</td>
                  <td className="px-4 py-3 text-center text-emerald-700 font-bold">✓ View Own Milestones</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-bold text-ink">
                    Client CRM &amp; Net-30 Portfolios
                  </td>
                  <td className="px-4 py-3 text-center text-emerald-700 font-bold">✓ Full</td>
                  <td className="px-4 py-3 text-center text-ink-muted">Restricted</td>
                  <td className="px-4 py-3 text-center text-emerald-700 font-bold">✓ Full Management</td>
                  <td className="px-4 py-3 text-center text-red font-bold">✕ Locked</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <button
            onClick={() => setActiveView('store')}
            className="text-xs font-bold text-ink hover:text-red transition-colors flex items-center gap-1.5 cursor-pointer min-h-[36px]"
          >
            ← Return to y5Hut.lk Store Catalog
          </button>
          <span className="text-[11px] text-ink-muted font-medium font-mono">
            Demo only — no real login or security
          </span>
        </div>
      </div>
    </>
  );
};
