import React from 'react';
import {
  ArrowRight,
  Tags,
  Smartphone,
  Boxes,
  Package,
  AlertTriangle,
  FileSpreadsheet,
  History,
  TrendingUp,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { AdminTab } from '../../../types';
import { ResetDemoButton } from '../ResetDemoButton';

export const OverviewPage: React.FC = () => {
  const { products, orders, priceHistory, lastPublish, setActiveAdminTab } = useStore();

  const inStock = products.filter((p) => p.stock > p.lowStockThreshold).length;
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= p.lowStockThreshold).length;
  const outOfStock = products.filter((p) => p.stock === 0).length;

  const recentChanges = priceHistory.slice(0, 5);

  return (
    <div className="space-y-5 text-left">
      
      {/* 1. Quick Actions Bento Block: "Change Prices" as Hero 2x2 Tile */}
      <div className="bg-white rounded-[18px] border border-[#E5E7EB] p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#111827] font-sans">
              Merchant Quick Actions
            </h2>
            <p className="text-xs text-[#6B7280]">
              The core daily workflows for managing shop catalog and pricing.
            </p>
          </div>
          <span className="text-[10px] font-mono uppercase font-bold text-slate-400 bg-[#F7F8FA] px-2.5 py-1 rounded-full border border-[#E5E7EB] self-start sm:self-auto">
            Prioritized by Frequency
          </span>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4">
          
          {/* Hero Bento Tile (spanning 6 cols on md) -> Change Prices */}
          <button
            type="button"
            onClick={() => setActiveAdminTab('price-manager')}
            className="md:col-span-6 bg-[#111827] hover:bg-slate-900 text-white rounded-[16px] p-5 sm:p-6 text-left transition-all duration-200 cursor-pointer flex flex-col justify-between group shadow-xs relative overflow-hidden"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#E11D48]">
                <Tags className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 px-2.5 py-0.5 rounded-full border border-rose-500/30">
                Most Frequent
              </span>
            </div>

            <div className="my-4 space-y-1">
              <h3 className="text-lg sm:text-xl font-bold font-sans tracking-tight text-white group-hover:text-rose-200 transition-colors">
                Smart Price Manager
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
                Stage individual or bulk price edits with safety previews, instant store reflection, and one-tap undo.
              </p>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-rose-300">
              <span>{lastPublish ? `Last published at ${new Date(lastPublish.at).toLocaleTimeString()}` : 'Ready to draft changes'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Right Column Companion Tiles (6 cols on md, 3 stacked/grid tiles) */}
          <div className="md:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            {/* Tile 2: Add Product */}
            <button
              type="button"
              onClick={() => setActiveAdminTab('products')}
              className="bg-[#F7F8FA] hover:bg-white rounded-[16px] border border-[#E5E7EB] hover:border-slate-300 p-4 text-left transition-all cursor-pointer flex flex-col justify-between group shadow-2xs min-h-[140px]"
            >
              <div className="w-8 h-8 rounded-lg bg-white border border-[#E5E7EB] flex items-center justify-center text-slate-700">
                <Smartphone className="w-4 h-4" />
              </div>
              <div className="mt-3">
                <h4 className="text-sm font-bold text-[#111827] group-hover:text-[#E11D48] transition-colors">
                  Add Product
                </h4>
                <p className="text-[11px] text-[#6B7280] mt-0.5">
                  List new model or accessories
                </p>
              </div>
              <div className="pt-2 flex items-center justify-end text-slate-400 group-hover:text-[#E11D48]">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>

            {/* Tile 3: Update Stock */}
            <button
              type="button"
              onClick={() => setActiveAdminTab('inventory')}
              className="bg-[#F7F8FA] hover:bg-white rounded-[16px] border border-[#E5E7EB] hover:border-slate-300 p-4 text-left transition-all cursor-pointer flex flex-col justify-between group shadow-2xs min-h-[140px]"
            >
              <div className="w-8 h-8 rounded-lg bg-white border border-[#E5E7EB] flex items-center justify-center text-slate-700">
                <Boxes className="w-4 h-4" />
              </div>
              <div className="mt-3">
                <h4 className="text-sm font-bold text-[#111827] group-hover:text-[#E11D48] transition-colors">
                  Update Stock
                </h4>
                <p className="text-[11px] text-[#6B7280] mt-0.5">
                  Audit counts &amp; log changes
                </p>
              </div>
              <div className="pt-2 flex items-center justify-end text-slate-400 group-hover:text-[#E11D48]">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>

            {/* Tile 4: CSV Import */}
            <button
              type="button"
              onClick={() => setActiveAdminTab('import-export')}
              className="bg-[#F7F8FA] hover:bg-white rounded-[16px] border border-[#E5E7EB] hover:border-slate-300 p-4 text-left transition-all cursor-pointer flex flex-col justify-between group shadow-2xs min-h-[140px]"
            >
              <div className="w-8 h-8 rounded-lg bg-white border border-[#E5E7EB] flex items-center justify-center text-slate-700">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <div className="mt-3">
                <h4 className="text-sm font-bold text-[#111827] group-hover:text-[#E11D48] transition-colors">
                  Import CSV
                </h4>
                <p className="text-[11px] text-[#6B7280] mt-0.5">
                  Bulk supplier price sheets
                </p>
              </div>
              <div className="pt-2 flex items-center justify-end text-slate-400 group-hover:text-[#E11D48]">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>

          </div>

        </div>
      </div>

      {/* 2. Inventory Health & Operational Metrics (Linear & Nothing Type Discipline) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        <div className="bg-white rounded-[16px] border border-[#E5E7EB] p-4 sm:p-5 shadow-2xs">
          <div className="flex items-center justify-between text-[#6B7280]">
            <span className="text-[10px] font-mono uppercase font-bold tracking-wider">Catalog Models</span>
            <Package className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-sans text-[#111827] tabular-nums">
            {products.length}
          </div>
          <span className="text-[11px] font-mono text-emerald-700 font-medium">
            {inStock} healthy stock
          </span>
        </div>

        <div className="bg-white rounded-[16px] border border-[#E5E7EB] p-4 sm:p-5 shadow-2xs">
          <div className="flex items-center justify-between text-[#6B7280]">
            <span className="text-[10px] font-mono uppercase font-bold tracking-wider">Low Stock Warnings</span>
            <AlertTriangle className="w-4 h-4 text-[#D97706]" />
          </div>
          <div className="mt-2 text-2xl font-bold font-sans text-[#D97706] tabular-nums">
            {lowStock}
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            Below threshold
          </span>
        </div>

        <div className="bg-white rounded-[16px] border border-[#E5E7EB] p-4 sm:p-5 shadow-2xs">
          <div className="flex items-center justify-between text-[#6B7280]">
            <span className="text-[10px] font-mono uppercase font-bold tracking-wider">Out of Stock</span>
            <Boxes className="w-4 h-4 text-[#DC2626]" />
          </div>
          <div className="mt-2 text-2xl font-bold font-sans text-[#DC2626] tabular-nums">
            {outOfStock}
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            Requires restock
          </span>
        </div>

        <div className="bg-white rounded-[16px] border border-[#E5E7EB] p-4 sm:p-5 shadow-2xs">
          <div className="flex items-center justify-between text-[#6B7280]">
            <span className="text-[10px] font-mono uppercase font-bold tracking-wider">Demo Inquiries/Orders</span>
            <TrendingUp className="w-4 h-4 text-[#E11D48]" />
          </div>
          <div className="mt-2 text-2xl font-bold font-sans text-[#111827] tabular-nums">
            {orders.length}
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            Simulated transactions
          </span>
        </div>

      </div>

      {/* 3. Recent Price Adjustments List */}
      <div className="bg-white rounded-[18px] border border-[#E5E7EB] p-5 sm:p-6 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-500" />
            <h3 className="text-sm font-bold text-[#111827] font-sans">
              Recent Price Adjustments
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setActiveAdminTab('price-history')}
            className="text-xs font-semibold text-[#E11D48] hover:underline cursor-pointer"
          >
            View Complete History →
          </button>
        </div>

        {recentChanges.length === 0 ? (
          <p className="text-xs text-slate-500 py-3">No price changes recorded yet in this session.</p>
        ) : (
          <div className="divide-y divide-slate-100 border border-[#E5E7EB] rounded-xl overflow-hidden">
            {recentChanges.map((entry) => (
              <div key={entry.id} className="p-3 bg-white hover:bg-slate-50 flex items-center justify-between gap-3 text-xs">
                <div className="min-w-0">
                  <div className="font-semibold text-[#111827] truncate">{entry.productName}</div>
                  <div className="text-[11px] font-mono text-slate-400">
                    {entry.label} · SKU: {entry.sku}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-mono tabular-nums font-semibold">
                    <span className="text-slate-400 line-through mr-1.5">
                      {entry.oldPriceLKR.toLocaleString('en-LK')}
                    </span>
                    <span className="text-[#111827] font-bold">
                      {entry.newPriceLKR.toLocaleString('en-LK')}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    {new Date(entry.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Reset & Clean Slate Utility */}
      <div className="bg-white rounded-[18px] border border-[#E5E7EB] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
          Need a fresh start? Reset restores the original sample catalog in this browser (products, variants, mock orders, and history).
        </p>
        <ResetDemoButton />
      </div>

    </div>
  );
};
