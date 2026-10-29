import React from 'react';
import { ArrowRight, Tags, Smartphone, Boxes, Package, AlertTriangle, ShoppingBag } from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { AdminTab } from '../../../types';

interface QuickAction {
  tab: AdminTab;
  label: string;
  hint: string;
  status: string;
  icon: React.ComponentType<{ className?: string }>;
}

const QUICK_ACTIONS: QuickAction[] = [
  { tab: 'price-manager', label: 'Change prices', hint: 'Edit one or many prices', status: 'Available now', icon: Tags },
  { tab: 'products', label: 'Add a product', hint: 'List a new phone or accessory', status: 'Coming in Phase 2', icon: Smartphone },
  { tab: 'inventory', label: 'Adjust stock', hint: 'Update stock counts', status: 'Available now', icon: Boxes },
];

export const OverviewPage: React.FC = () => {
  const { products, orders, setActiveAdminTab, resetDemoData } = useStore();
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= p.lowStockThreshold).length;
  const outOfStock = products.filter((p) => p.stock === 0).length;

  const stats = [
    { label: 'Products', value: products.length, icon: Package },
    { label: 'Low stock', value: lowStock, icon: AlertTriangle },
    { label: 'Out of stock', value: outOfStock, icon: Boxes },
    { label: 'Demo orders', value: orders.length, icon: ShoppingBag },
  ];

  return (
    <>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
              <Icon className="w-4 h-4 text-[#E11D48]" />
            </div>
            <div className="mt-2 text-2xl font-black text-slate-900 font-mono">{value}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <h2 className="text-base font-bold text-slate-900">Owner Quick Actions</h2>
        <p className="text-xs text-slate-500 mt-0.5">The three things you do most often.</p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          {QUICK_ACTIONS.map(({ tab, label, hint, status, icon: Icon }) => (
            <button
              key={tab}
              onClick={() => setActiveAdminTab(tab)}
              className="group text-left p-4 rounded-xl border border-slate-200 hover:border-[#E11D48] hover:bg-rose-50/40 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="w-9 h-9 rounded-lg bg-rose-50 text-[#E11D48] flex items-center justify-center">
                  <Icon className="w-4 h-4" />
                </span>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#E11D48] group-hover:translate-x-0.5 transition-all" />
              </div>
              <div className="mt-3 text-sm font-bold text-slate-900">{label}</div>
              <div className="text-xs text-slate-500">{hint}</div>
              <span
                className={`inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  status === 'Available now' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {status}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4">
        <p className="text-xs text-slate-600">
          Want a clean start? Reset restores the sample products, orders and clients in this browser.
        </p>
        <button
          onClick={() => {
            if (window.confirm('Reset all demo data in this browser to the original samples?')) resetDemoData();
          }}
          className="text-xs font-bold px-3 py-1.5 rounded-lg border border-rose-200 text-[#E11D48] hover:bg-rose-50 cursor-pointer shrink-0"
        >
          Reset demo data
        </button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600 leading-relaxed">
        <strong className="text-slate-800">About this demo:</strong> product and stock figures above come from the
        sample catalogue stored in this browser. Orders, Analytics, Clients and Roles (under “Demo / Existing
        Modules”) use sample data to illustrate ideas only.
      </div>
    </>
  );
};
