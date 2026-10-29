import React from 'react';
import { ArrowRight, Tags, Smartphone, Boxes, Package, AlertTriangle, ShoppingBag } from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { AdminTab } from '../../../types';
import { ResetDemoButton } from '../ResetDemoButton';

interface QuickAction {
  tab: AdminTab;
  label: string;
  hint: string;
  icon: React.ComponentType<{ className?: string }>;
}

const QUICK_ACTIONS: QuickAction[] = [
  { tab: 'price-manager', label: 'Change Prices', hint: 'Edit one price or many at once', icon: Tags },
  { tab: 'products', label: 'Add Product', hint: 'List a new phone or accessory', icon: Smartphone },
  { tab: 'inventory', label: 'Update Stock', hint: 'Set or adjust stock counts', icon: Boxes },
];

export const OverviewPage: React.FC = () => {
  const { products, orders, setActiveAdminTab } = useStore();
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
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs">
        <h2 className="text-base font-bold text-slate-900">Owner Quick Actions</h2>
        <p className="text-xs text-slate-500 mt-0.5">The three things you do most often.</p>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3">
          {QUICK_ACTIONS.map(({ tab, label, hint, icon: Icon }) => (
            <button
              key={tab}
              onClick={() => setActiveAdminTab(tab)}
              className="group flex md:block items-center gap-3 text-left min-h-16 p-3 md:p-4 rounded-xl border border-slate-200 hover:border-[#E11D48] hover:bg-rose-50/40 active:bg-rose-50 transition-colors cursor-pointer"
            >
              <span className="w-11 h-11 md:w-9 md:h-9 shrink-0 rounded-lg bg-rose-50 text-[#E11D48] flex items-center justify-center">
                <Icon className="w-5 h-5 md:w-4 md:h-4" />
              </span>
              <span className="flex-1 min-w-0 md:block md:mt-3">
                <span className="block text-sm font-bold text-slate-900">{label}</span>
                <span className="block text-xs text-slate-500">{hint}</span>
              </span>
              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#E11D48] md:hidden" />
            </button>
          ))}
        </div>
      </div>

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

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4">
        <p className="text-xs text-slate-600">
          Want a clean start? Reset restores the original sample data in this browser only (products, orders, clients, history and stock log).
        </p>
        <ResetDemoButton />
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600 leading-relaxed">
        <strong className="text-slate-800">About this demo:</strong> product and stock figures above come from the
        sample catalogue stored in this browser. Orders, Analytics, Clients and Roles (under “Demo / Existing
        Modules”) use sample data to illustrate ideas only.
      </div>
    </>
  );
};
