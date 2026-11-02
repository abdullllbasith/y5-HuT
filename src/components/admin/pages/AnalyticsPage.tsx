import React from 'react';
import { useStore } from '../../../context/StoreContext';
import { MONTHLY_METRICS } from '../../../data/mockData';
import { DemoNotice } from '../../common/DemoNotice';
import { TrendingUp, Package, Download, AlertTriangle, CheckCircle, DollarSign, ArrowUpRight } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const { currentUser, switchUserRole, triggerNotification, formatPrice } = useStore();
  const canViewAnalytics = currentUser.role === 'super_admin' || currentUser.role === 'sales_rep';
  // Export CSV mock
  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,Month,RevenueLKR,Orders,Smartphones,Accessories\n' +
      MONTHLY_METRICS.map(
        (m) => `${m.month},${m.revenueLKR},${m.orders},${m.smartphonesCount},${m.accessoriesCount}`
      ).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `y5hut_sales_report_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    triggerNotification(
      'task',
      'Sales Report Exported',
      'Monthly sales performance CSV downloaded for y5Hut.lk corporate accounting.'
    );
  };

  return (
    <>
      <DemoNotice className="mb-4">Mock analytics. These figures are static sample data and do not come from real sales or from the orders in this demo.</DemoNotice>
      <div className="space-y-6 text-left">
        {!canViewAnalytics ? (
          <div className="bg-paper-card rounded-2xl border border-ink/10 p-8 text-center space-y-4 shadow-paper">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto border border-amber-200">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="text-base font-bold text-ink font-display">
                Financial Analytics Restricted
              </h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                Your current role (<strong className="capitalize text-ink">{currentUser.role.replace('_', ' ')}</strong>) is authorized for warehouse inventory and dispatch logistics. Executive monthly sales analytics are reserved for Super Admin and Corporate Sales Reps.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => switchUserRole('super_admin')}
                className="px-4 py-2 bg-red text-paper hover:bg-red/90 rounded-xl text-xs font-bold transition-colors cursor-pointer min-h-[38px]"
              >
                Simulate Super Admin
              </button>
              <button
                onClick={() => switchUserRole('sales_rep')}
                className="px-4 py-2 bg-paper-sunk hover:bg-ink/5 border border-ink/10 text-ink rounded-xl text-xs font-bold transition-colors cursor-pointer min-h-[38px]"
              >
                Simulate Sales Rep
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Top KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-paper-card p-5 rounded-2xl border border-ink/10 shadow-paper">
                <div className="flex items-center justify-between text-xs text-ink-muted">
                  <span className="font-bold uppercase tracking-wider text-[10px] font-mono">October Gross Sales</span>
                  <DollarSign className="w-4 h-4 text-red" />
                </div>
                <div className="text-2xl font-black font-data text-ink mt-2 tabular-nums">
                  {formatPrice(56400000, 160000)}
                </div>
                <div className="text-xs text-emerald-700 font-bold mt-1 flex items-center gap-1">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>+15.3% vs September</span>
                </div>
              </div>

              <div className="bg-paper-card p-5 rounded-2xl border border-ink/10 shadow-paper">
                <div className="flex items-center justify-between text-xs text-ink-muted">
                  <span className="font-bold uppercase tracking-wider text-[10px] font-mono">Completed Orders</span>
                  <Package className="w-4 h-4 text-ink-muted" />
                </div>
                <div className="text-2xl font-black font-data text-ink mt-2 tabular-nums">
                  228
                </div>
                <div className="text-xs text-emerald-700 font-bold mt-1 flex items-center gap-1">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>Islandwide Dispatches</span>
                </div>
              </div>

              <div className="bg-paper-card p-5 rounded-2xl border border-ink/10 shadow-paper">
                <div className="flex items-center justify-between text-xs text-ink-muted">
                  <span className="font-bold uppercase tracking-wider text-[10px] font-mono">Average Order Value</span>
                  <TrendingUp className="w-4 h-4 text-ink-muted" />
                </div>
                <div className="text-2xl font-black font-data text-ink mt-2 tabular-nums">
                  {formatPrice(247368, 701)}
                </div>
                <div className="text-xs text-ink-muted mt-1">
                  iPhones + Anker Charging Sets
                </div>
              </div>

              <div className="bg-paper-card p-5 rounded-2xl border border-ink/10 shadow-paper">
                <div className="flex items-center justify-between text-xs text-ink-muted">
                  <span className="font-bold uppercase tracking-wider text-[10px] font-mono">Return / RMA Rate</span>
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-black font-data text-ink mt-2 tabular-nums">
                  0.28%
                </div>
                <div className="text-xs text-emerald-700 font-bold mt-1">
                  Strict TRCSL Serial QC
                </div>
              </div>
            </div>

            {/* Monthly Revenue Chart */}
            <div className="bg-paper-card p-6 rounded-2xl border border-ink/10 shadow-paper space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-ink font-display">
                    Monthly Revenue Performance (2026 Sri Lanka)
                  </h3>
                  <p className="text-xs text-ink-muted mt-0.5">
                    Audited sales in Sri Lankan Rupees across AppleHuT, smartphones, and accessories.
                  </p>
                </div>
                <button
                  onClick={handleExportCSV}
                  className="px-3.5 py-2 text-xs font-bold text-ink bg-paper-sunk hover:bg-ink/5 border border-ink/10 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer min-h-[38px]"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Sales CSV</span>
                </button>
              </div>

              {/* Custom Bar Visualization */}
              <div className="pt-6 pb-2">
                <div className="grid grid-cols-6 gap-3 sm:gap-6 items-end h-48 border-b border-ink/10">
                  {MONTHLY_METRICS.map((m) => {
                    const maxRevenue = 65000000;
                    const heightPercent = Math.round((m.revenueLKR / maxRevenue) * 100);
                    return (
                      <div key={m.month} className="flex flex-col items-center gap-2 group h-full justify-end">
                        <div className="text-[10px] font-data font-bold text-ink tabular-nums opacity-0 group-hover:opacity-100 transition-opacity">
                          Rs. {(m.revenueLKR / 1000000).toFixed(1)}M
                        </div>
                        <div
                          className="w-full bg-ink group-hover:bg-red rounded-t transition-all duration-300 relative"
                          style={{ height: `${heightPercent}%` }}
                        >
                          <div
                            className="w-full bg-red/40 rounded-t"
                            style={{
                              height: `${Math.round((m.smartphonesCount / (m.smartphonesCount + m.accessoriesCount)) * 100)}%`,
                            }}
                          />
                        </div>
                        <div className="text-xs font-bold text-ink">{m.month}</div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 text-xs text-ink-muted">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 bg-ink rounded-xs" />
                      <span>Total Store Billings</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 bg-red/40 rounded-xs" />
                      <span>Smartphones Segment</span>
                    </div>
                  </div>
                  <span className="font-mono text-[11px]">Figures in LKR / USD · Tabular</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};
