import React from 'react';
import { useStore } from '../../../context/StoreContext';
import { TrendingUp, Package, Layers, Users, Shield, Search, Plus, Mail, ChevronRight, Download, AlertTriangle, CheckCircle, Truck, DollarSign, ArrowUpRight } from 'lucide-react';

export const CustomerAccessGate: React.FC = () => {
  const { currentUser, switchUserRole, setActiveView, setActiveAdminTab } = useStore();
  return (
    <>
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 bg-gradient-to-r from-rose-50 to-amber-50 border border-rose-200 rounded-xl">
            <div className="w-12 h-12 rounded-xl bg-[#E11D48] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Shield className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-rose-200 text-rose-900 px-2 py-0.5 rounded font-mono">
                  ROLE SIMULATION (DEMO)
                </span>
                <span className="text-xs font-bold text-slate-700">
                  Current Session: {currentUser.name} (Customer / Buyer)
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 font-sans">
                Enterprise Command Center &amp; CRM Access Control
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                You are currently browsing with a customer account. Under y5Hut.lk enterprise role-based security governance, the store management console, warehouse stock adjustments, corporate Net-30 credit lines, and executive sales analytics are restricted to authorized internal operations personnel.
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                1-Click Interactive Role Simulation:
              </h3>
              <span className="text-xs text-slate-500">
                Click any role to test its specific interface and permissions
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => {
                  switchUserRole('super_admin');
                  setActiveAdminTab('analytics');
                }}
                className="p-5 rounded-xl border-2 border-slate-200 hover:border-[#E11D48] hover:bg-rose-50/40 transition-all text-left space-y-2 group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#E11D48] group-hover:underline">
                    Super Admin
                  </span>
                  <span className="text-[10px] bg-red-100 text-[#E11D48] font-bold px-2 py-0.5 rounded">
                    Full Access
                  </span>
                </div>
                <div className="text-sm font-bold text-slate-900">Suren Mendis</div>
                <div className="text-[11px] text-slate-500 font-mono">admin@y5hut.lk</div>
                <p className="text-xs text-slate-600 leading-relaxed pt-1">
                  Executive management with unrestricted clearance across Sales Analytics, Orders &amp; Dispatches, Warehouse Stock Audits, Corporate Net-30 CRM, and RBAC governance.
                </p>
                <div className="pt-2 text-xs font-bold text-[#E11D48] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Simulate as Super Admin</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </button>

              <button
                onClick={() => {
                  switchUserRole('inventory_manager');
                  setActiveAdminTab('inventory');
                }}
                className="p-5 rounded-xl border-2 border-slate-200 hover:border-blue-600 hover:bg-blue-50/40 transition-all text-left space-y-2 group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600 group-hover:underline">
                    Inventory Manager
                  </span>
                  <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded">
                    Logistics &amp; Stock
                  </span>
                </div>
                <div className="text-sm font-bold text-slate-900">Dilshan Silva</div>
                <div className="text-[11px] text-slate-500 font-mono">inventory@y5hut.lk</div>
                <p className="text-xs text-slate-600 leading-relaxed pt-1">
                  Warehouse fulfillment lead. Can audit hardware inventory, update stock levels, configure safety thresholds, add new catalog products, and manage order dispatches.
                </p>
                <div className="pt-2 text-xs font-bold text-blue-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Simulate as Inventory Manager</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </button>

              <button
                onClick={() => {
                  switchUserRole('sales_rep');
                  setActiveAdminTab('clients');
                }}
                className="p-5 rounded-xl border-2 border-slate-200 hover:border-emerald-600 hover:bg-emerald-50/40 transition-all text-left space-y-2 group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 group-hover:underline">
                    Corporate Sales Rep
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded">
                    B2B &amp; Client CRM
                  </span>
                </div>
                <div className="text-sm font-bold text-slate-900">Sarah Lin</div>
                <div className="text-[11px] text-slate-500 font-mono">corporate@y5hut.lk</div>
                <p className="text-xs text-slate-600 leading-relaxed pt-1">
                  B2B corporate desk lead. Manages Corporate Client accounts, allocates Net-30 credit limits, inspects monthly revenue charts, and handles corporate purchase orders.
                </p>
                <div className="pt-2 text-xs font-bold text-emerald-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Simulate as Sales Rep</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </button>
            </div>
          </div>

          {/* RBAC Matrix Preview for Customer */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Role Permission Governance Matrix
            </h4>
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-bold tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Permission Scope</th>
                    <th className="px-4 py-3 text-center">Super Admin</th>
                    <th className="px-4 py-3 text-center">Inventory Manager</th>
                    <th className="px-4 py-3 text-center">Corporate Sales</th>
                    <th className="px-4 py-3 text-center text-[#E11D48]">Customer (You)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-700">
                  <tr>
                    <td className="px-4 py-3 font-bold text-slate-900">
                      Monthly Sales &amp; Revenue Analytics
                    </td>
                    <td className="px-4 py-3 text-center text-emerald-600 font-bold">✓ Full</td>
                    <td className="px-4 py-3 text-center text-slate-400">Restricted</td>
                    <td className="px-4 py-3 text-center text-emerald-600 font-bold">✓ Read-Only</td>
                    <td className="px-4 py-3 text-center text-red-500 font-bold">✕ Locked</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-bold text-slate-900">
                      Warehouse Stock Audits &amp; Reordering
                    </td>
                    <td className="px-4 py-3 text-center text-emerald-600 font-bold">✓ Full</td>
                    <td className="px-4 py-3 text-center text-emerald-600 font-bold">✓ Full Control</td>
                    <td className="px-4 py-3 text-center text-emerald-600 font-bold">✓ View Stock</td>
                    <td className="px-4 py-3 text-center text-emerald-600 font-bold">✓ View Availability</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-bold text-slate-900">
                      Order Milestones &amp; Courier Waybills
                    </td>
                    <td className="px-4 py-3 text-center text-emerald-600 font-bold">✓ Full</td>
                    <td className="px-4 py-3 text-center text-emerald-600 font-bold">✓ Dispatch Only</td>
                    <td className="px-4 py-3 text-center text-emerald-600 font-bold">✓ Full</td>
                    <td className="px-4 py-3 text-center text-emerald-600 font-bold">✓ View Own Milestones</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-bold text-slate-900">
                      Client CRM &amp; Net-30 Portfolios
                    </td>
                    <td className="px-4 py-3 text-center text-emerald-600 font-bold">✓ Full</td>
                    <td className="px-4 py-3 text-center text-slate-400">Restricted</td>
                    <td className="px-4 py-3 text-center text-emerald-600 font-bold">✓ Full Management</td>
                    <td className="px-4 py-3 text-center text-red-500 font-bold">✕ Locked</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={() => setActiveView('store')}
              className="text-xs font-bold text-slate-700 hover:text-[#E11D48] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              ← Return to y5Hut.lk Store Catalog
            </button>
            <span className="text-[11px] text-slate-400 font-medium">
              Demo only — no real login or security
            </span>
          </div>
        </div>
    </>
  );
};
