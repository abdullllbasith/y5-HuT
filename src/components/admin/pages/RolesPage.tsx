import React from 'react';
import { useStore } from '../../../context/StoreContext';
import { INITIAL_TEAM_USERS } from '../../../data/mockData';
import { TrendingUp, Package, Layers, Users, Shield, Search, Plus, Mail, ChevronRight, Download, AlertTriangle, CheckCircle, Truck, DollarSign, ArrowUpRight } from 'lucide-react';

export const RolesPage: React.FC = () => {
  const { currentUser, switchUserRole } = useStore();
  return (
    <>
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6 shadow-xs">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-sans">
              Role Simulation (demo only — no real access control)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Team members access only operational parameters relevant to their role in y5Hut.lk.
            </p>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-bold tracking-wider">
                <tr>
                  <th className="px-4 py-3">Permission Scope</th>
                  <th className="px-4 py-3 text-center">Super Admin</th>
                  <th className="px-4 py-3 text-center">Inventory Manager</th>
                  <th className="px-4 py-3 text-center">Corporate Sales</th>
                  <th className="px-4 py-3 text-center">Customer / Buyer</th>
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
                  <td className="px-4 py-3 text-center text-slate-400">Restricted</td>
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
                  <td className="px-4 py-3 text-center text-slate-400">Restricted</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="pt-4 border-t border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Switch Simulation Session
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {INITIAL_TEAM_USERS.map((usr) => (
                <button
                  key={usr.id}
                  onClick={() => switchUserRole(usr.role)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    currentUser.role === usr.role
                      ? 'border-[#E11D48] bg-rose-50/40 ring-1 ring-[#E11D48]'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold text-xs text-slate-900">{usr.name}</div>
                  <div className="text-[10px] text-slate-500 capitalize">{usr.role.replace('_', ' ')}</div>
                  {currentUser.role === usr.role && (
                    <div className="text-[10px] font-bold text-[#E11D48] mt-1">Active Now</div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
    </>
  );
};
