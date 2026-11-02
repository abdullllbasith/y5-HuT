import React from 'react';
import { useStore } from '../../../context/StoreContext';
import { INITIAL_TEAM_USERS } from '../../../data/mockData';
import { Dot } from '../../ui/Dot';

export const RolesPage: React.FC = () => {
  const { currentUser, switchUserRole } = useStore();
  return (
    <>
      <div className="bg-paper-card rounded-2xl border border-ink/10 p-5 sm:p-6 space-y-6 shadow-paper text-left">
        <div>
          <h3 className="text-base font-bold text-ink font-display">
            Role Simulation (demo only — no real access control)
          </h3>
          <p className="text-xs text-ink-muted mt-0.5">
            Team members access only operational parameters relevant to their role in y5Hut.lk.
          </p>
        </div>

        <div className="overflow-x-auto border border-ink/10 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-paper-sunk border-b border-ink/10 text-ink-muted uppercase font-bold tracking-wider text-[10px] font-mono">
              <tr>
                <th className="px-4 py-3">Permission Scope</th>
                <th className="px-4 py-3 text-center">Super Admin</th>
                <th className="px-4 py-3 text-center">Inventory Manager</th>
                <th className="px-4 py-3 text-center">Corporate Sales</th>
                <th className="px-4 py-3 text-center">Customer / Buyer</th>
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
                <td className="px-4 py-3 text-center text-ink-muted">Restricted</td>
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
                <td className="px-4 py-3 text-center text-ink-muted">Restricted</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="pt-4 border-t border-ink/10">
          <h4 className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-3 font-mono">
            Switch Simulation Session
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {INITIAL_TEAM_USERS.map((usr) => (
              <button
                key={usr.id}
                onClick={() => switchUserRole(usr.role)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer min-h-[44px] ${
                  currentUser.role === usr.role
                    ? 'border-red bg-red/5 ring-1 ring-red'
                    : 'border-ink/10 bg-paper-card hover:bg-paper-sunk'
                }`}
              >
                <div className="font-bold text-xs text-ink">{usr.name}</div>
                <div className="text-[10px] text-ink-muted capitalize">{usr.role.replace('_', ' ')}</div>
                {currentUser.role === usr.role && (
                  <div className="text-[10px] font-bold text-red mt-1.5 flex items-center gap-1">
                    <Dot tone="red" size="xs" />
                    <span>Active Now</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
