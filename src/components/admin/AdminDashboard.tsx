import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { MONTHLY_METRICS, INITIAL_TEAM_USERS } from '../../data/mockData';
import { OrderStatus, Product, ProductCategory, BrandName, ClientAccount, UserRole } from '../../types';
import {
  TrendingUp,
  Package,
  Layers,
  Users,
  Shield,
  Search,
  Plus,
  Mail,
  ChevronRight,
  Download,
  AlertTriangle,
  CheckCircle,
  Truck,
  DollarSign,
  ArrowUpRight,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    activeAdminTab,
    setActiveAdminTab,
    setActiveView,
    orders,
    updateOrderStatus,
    products,
    updateProductStock,
    restockProduct,
    addProduct,
    clients,
    updateClientAccount,
    addClientAccount,
    currentUser,
    switchUserRole,
    setPreviewingEmail,
    triggerNotification,
    formatPrice,
    currency,
  } = useStore();

  // Orders Sub-Tab state
  const [orderFilter, setOrderFilter] = useState<OrderStatus | 'all'>('all');
  const [orderSearch, setOrderSearch] = useState('');

  // Inventory Sub-Tab state
  const [stockSearch, setStockSearch] = useState('');
  const [isNewProductOpen, setIsNewProductOpen] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductBrand, setNewProductBrand] = useState<BrandName>('Apple');
  const [newProductCategory, setNewProductCategory] = useState<ProductCategory>('apple-store');
  const [newProductPriceLKR, setNewProductPriceLKR] = useState(45000);
  const [newProductPriceUSD, setNewProductPriceUSD] = useState(135);
  const [newProductStock, setNewProductStock] = useState(20);

  // Client Accounts Sub-Tab state
  const [clientSearch, setClientSearch] = useState('');
  const [isNewClientOpen, setIsNewClientOpen] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newContactName, setNewContactName] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newCreditLimitLKR, setNewCreditLimitLKR] = useState(5000000);

  // RBAC Permission checks
  const canManageInventory =
    currentUser.role === 'super_admin' || currentUser.role === 'inventory_manager';
  const canManageOrders =
    currentUser.role === 'super_admin' || currentUser.role === 'inventory_manager' || currentUser.role === 'sales_rep';
  const canManageClients =
    currentUser.role === 'super_admin' || currentUser.role === 'sales_rep';
  const canViewAnalytics =
    currentUser.role === 'super_admin' || currentUser.role === 'sales_rep';

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

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName.trim()) return;

    const newProd: Product = {
      id: `prod-${Date.now()}`,
      name: newProductName,
      brand: newProductBrand,
      category: newProductCategory,
      priceLKR: Number(newProductPriceLKR),
      priceUSD: Number(newProductPriceUSD),
      stock: Number(newProductStock),
      lowStockThreshold: 5,
      rating: 5.0,
      reviewCount: 0,
      description: 'Official genuine electronic hardware certified by y5Hut.lk Sri Lanka.',
      tagline: 'High-performance tech hardware with official local warranty support.',
      deviceType: newProductCategory === 'smartphones' || newProductCategory === 'apple-store' ? 'phone' : 'charger',
      colorOptions: [{ name: 'Space Gray', hex: '#334155' }],
      specs: {
        warranty: '1-Year y5Hut.lk Official Local Warranty',
      },
      reviews: [],
      kokoEligible: true,
      mintpayEligible: true,
    };

    addProduct(newProd);
    setIsNewProductOpen(false);
    setNewProductName('');
  };

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
    <div className="py-8 space-y-6">
      {/* Admin Suite Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E11D48]">
            <Shield className="w-3.5 h-3.5" />
            <span>y5Hut.lk Executive Operations Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 font-sans mt-0.5">
            Store Command Center &amp; CRM
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Logged in as: <strong className="text-slate-800">{currentUser.name}</strong> · Role:{' '}
            <span className="capitalize font-bold text-[#E11D48]">
              {currentUser.role.replace('_', ' ')}
            </span>
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveAdminTab('analytics')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              activeAdminTab === 'analytics'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Analytics &amp; Sales
          </button>
          <button
            onClick={() => setActiveAdminTab('orders')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              activeAdminTab === 'orders'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Orders &amp; Milestones ({orders.length})
          </button>
          <button
            onClick={() => setActiveAdminTab('inventory')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              activeAdminTab === 'inventory'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Inventory Tracking
          </button>
          <button
            onClick={() => setActiveAdminTab('clients')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              activeAdminTab === 'clients'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Corporate Clients CRM
          </button>
          <button
            onClick={() => setActiveAdminTab('rbac')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              activeAdminTab === 'rbac'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            RBAC &amp; Roles
          </button>
        </div>
      </div>

      {/* If customer role is active, display the Interactive RBAC Access Gate */}
      {currentUser.role === 'customer' ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 bg-gradient-to-r from-rose-50 to-amber-50 border border-rose-200 rounded-xl">
            <div className="w-12 h-12 rounded-xl bg-[#E11D48] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Shield className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-rose-200 text-rose-900 px-2 py-0.5 rounded font-mono">
                  RBAC SECURITY ACTIVE
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
              Enterprise Role-Based Security Verified
            </span>
          </div>
        </div>
      ) : (
        <>
          {/* ================= TAB 1: ANALYTICS & SALES REPORTING ================= */}
          {activeAdminTab === 'analytics' && (
            <div className="space-y-6">
              {!canViewAnalytics ? (
                <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-4 shadow-xs">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto border border-amber-200">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div className="max-w-md mx-auto space-y-1">
                    <h3 className="text-base font-bold text-slate-900">
                      Financial Analytics Restricted
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Your current role (<strong className="capitalize">{currentUser.role.replace('_', ' ')}</strong>) is authorized for warehouse inventory and dispatch logistics. Executive monthly sales analytics are reserved for Super Admin and Corporate Sales Reps.
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      onClick={() => switchUserRole('super_admin')}
                      className="px-4 py-2 bg-[#E11D48] hover:bg-[#BE123C] text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      Simulate Super Admin
                    </button>
                    <button
                      onClick={() => switchUserRole('sales_rep')}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      Simulate Sales Rep
                    </button>
                  </div>
                </div>
              ) : (
                <>

          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-bold uppercase tracking-wider">October Gross Sales</span>
                <DollarSign className="w-4 h-4 text-[#E11D48]" />
              </div>
              <div className="text-2xl font-black font-mono text-slate-950 mt-2 tabular-nums">
                {formatPrice(56400000, 160000)}
              </div>
              <div className="text-xs text-emerald-700 font-bold mt-1 flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>+15.3% vs September</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-bold uppercase tracking-wider">Completed Orders</span>
                <Package className="w-4 h-4 text-slate-600" />
              </div>
              <div className="text-2xl font-black font-mono text-slate-950 mt-2 tabular-nums">
                228
              </div>
              <div className="text-xs text-emerald-700 font-bold mt-1 flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>Islandwide Dispatches</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-bold uppercase tracking-wider">Average Order Value</span>
                <TrendingUp className="w-4 h-4 text-slate-600" />
              </div>
              <div className="text-2xl font-black font-mono text-slate-950 mt-2 tabular-nums">
                {formatPrice(247368, 701)}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                iPhones + Anker Charging Sets
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-bold uppercase tracking-wider">Return / RMA Rate</span>
                <CheckCircle className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black font-mono text-slate-950 mt-2 tabular-nums">
                0.28%
              </div>
              <div className="text-xs text-emerald-700 font-bold mt-1">
                Strict TRCSL Serial QC
              </div>
            </div>
          </div>

          {/* Monthly Revenue Chart */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-sans">
                  Monthly Revenue Performance (2026 Sri Lanka)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Audited sales in Sri Lankan Rupees across AppleHuT, smartphones, and accessories.
                </p>
              </div>
              <button
                onClick={handleExportCSV}
                className="px-3.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Sales CSV</span>
              </button>
            </div>

            {/* Custom Bar Visualization */}
            <div className="pt-6 pb-2">
              <div className="grid grid-cols-6 gap-3 sm:gap-6 items-end h-48 border-b border-slate-200">
                {MONTHLY_METRICS.map((m) => {
                  const maxRevenue = 65000000;
                  const heightPercent = Math.round((m.revenueLKR / maxRevenue) * 100);
                  return (
                    <div key={m.month} className="flex flex-col items-center gap-2 group h-full justify-end">
                      <div className="text-[10px] font-mono font-bold text-slate-600 tabular-nums opacity-0 group-hover:opacity-100 transition-opacity">
                        Rs. {(m.revenueLKR / 1000000).toFixed(1)}M
                      </div>
                      <div
                        className="w-full bg-slate-900 group-hover:bg-[#E11D48] rounded-t transition-all duration-300 relative"
                        style={{ height: `${heightPercent}%` }}
                      >
                        <div
                          className="w-full bg-[#E11D48]/40 rounded-t"
                          style={{
                            height: `${Math.round((m.smartphonesCount / (m.smartphonesCount + m.accessoriesCount)) * 100)}%`,
                          }}
                        />
                      </div>
                      <div className="text-xs font-bold text-slate-700">{m.month}</div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-3 text-xs text-slate-500">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 bg-slate-900 rounded-xs" />
                    <span>Total Store Billings</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 bg-[#E11D48]/40 rounded-xs" />
                    <span>Smartphones Segment</span>
                  </div>
                </div>
                <span>Figures in LKR / USD · Tabular</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )}

      {/* ================= TAB 2: ORDER MANAGEMENT & MILESTONES ================= */}
      {activeAdminTab === 'orders' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden space-y-4 p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-sans">
                Order Fulfillments &amp; Live Waybills
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Advancing status dispatches automated milestone emails and Pronto Express courier waybills.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1 flex-wrap">
              {(['all', 'confirmed', 'processing', 'dispatched', 'delivered'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setOrderFilter(st)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg capitalize transition-colors cursor-pointer ${
                    orderFilter === st
                      ? 'bg-[#E11D48] text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-bold tracking-wider">
                <tr>
                  <th className="px-4 py-3">Order Ref</th>
                  <th className="px-4 py-3">Client / Recipient</th>
                  <th className="px-4 py-3">Items</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Payment Method</th>
                  <th className="px-4 py-3">Milestone</th>
                  <th className="px-4 py-3 text-right">Fulfillment Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {orders
                  .filter((o) => (orderFilter === 'all' ? true : o.status === orderFilter))
                  .map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3.5 font-mono font-bold text-slate-900">
                        {ord.id}
                        <div className="text-[10px] text-slate-400 font-normal">
                          {new Date(ord.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-slate-900">{ord.customerName}</div>
                        <div className="text-[11px] text-slate-500">{ord.customerPhone}</div>
                      </td>
                      <td className="px-4 py-3.5 max-w-xs truncate">
                        {ord.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                      </td>
                      <td className="px-4 py-3.5 font-mono font-bold text-slate-950 tabular-nums">
                        {formatPrice(ord.totalLKR, ord.totalUSD)}
                      </td>
                      <td className="px-4 py-3.5 uppercase font-bold text-[10px]">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                          {ord.paymentMethod}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                            ord.status === 'delivered'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : ord.status === 'dispatched'
                              ? 'bg-blue-50 text-blue-800 border border-blue-200'
                              : ord.status === 'processing'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-slate-100 text-slate-800 border border-slate-300'
                          }`}
                        >
                          {ord.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right space-x-1.5 whitespace-nowrap">
                        {ord.status === 'confirmed' && (
                          <button
                            onClick={() => updateOrderStatus(ord.id, 'processing')}
                            className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-[11px] font-bold cursor-pointer"
                          >
                            → Mark QC Checked
                          </button>
                        )}
                        {ord.status === 'processing' && (
                          <button
                            onClick={() => updateOrderStatus(ord.id, 'dispatched')}
                            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[11px] font-bold cursor-pointer"
                          >
                            → Dispatch Courier
                          </button>
                        )}
                        {ord.status === 'dispatched' && (
                          <button
                            onClick={() => updateOrderStatus(ord.id, 'delivered')}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold cursor-pointer"
                          >
                            ✓ Mark Delivered
                          </button>
                        )}
                        {ord.status === 'delivered' && (
                          <span className="text-[11px] text-emerald-700 font-bold">
                            Complete
                          </span>
                        )}

                        <button
                          onClick={() => {
                            const emailAlert = {
                              id: `view-${ord.id}`,
                              type: 'milestone' as const,
                              title: `y5Hut.lk Order #${ord.id}`,
                              message: `Order status is ${ord.status}.`,
                              timestamp: 'Log',
                              read: true,
                              orderId: ord.id,
                              emailSubject: `y5Hut.lk Milestone Log #${ord.id}`,
                              emailBodyHtml: `
                                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #E2E8F0; border-radius: 8px;">
                                  <h2 style="color: #E11D48; margin: 0 0 10px 0;">y5<span style="color: #0F172A;">Hut</span>.lk Sri Lanka</h2>
                                  <p>Order: <strong>#${ord.id}</strong></p>
                                  <p>Customer: <strong>${ord.customerName}</strong> (${ord.customerPhone})</p>
                                  <p>Status: <strong style="color: #E11D48;">${ord.status.toUpperCase()}</strong></p>
                                  ${ord.trackingNumber ? `<p>Pronto Express Tracking: <strong>${ord.trackingNumber}</strong></p>` : ''}
                                  <p>Total: <strong>${formatPrice(ord.totalLKR, ord.totalUSD)}</strong></p>
                                </div>
                              `,
                            };
                            setPreviewingEmail(emailAlert);
                          }}
                          className="p-1 text-slate-500 hover:text-slate-900 rounded"
                          title="Inspect Milestone Email"
                        >
                          <Mail className="w-4 h-4 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 3: INVENTORY TRACKING & RESTOCK ================= */}
      {activeAdminTab === 'inventory' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-sans">
                Warehouse Stock &amp; Serial Ledger
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Automated low stock alerts fire when counts drop below the safety buffer.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Filter stock by name..."
                  value={stockSearch}
                  onChange={(e) => setStockSearch(e.target.value)}
                  className="text-xs pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#E11D48]"
                />
              </div>

              {canManageInventory && (
                <button
                  onClick={() => setIsNewProductOpen(true)}
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#E11D48] hover:bg-[#BE123C] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Product</span>
                </button>
              )}
            </div>
          </div>

          {!canManageInventory && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Read-Only Inventory Mode: Sales Reps have view-only access to verify warehouse stock for client quotations. Stock adjustments are restricted to Inventory Management.</span>
              </div>
              <button
                onClick={() => switchUserRole('inventory_manager')}
                className="text-xs font-bold text-blue-700 hover:text-blue-900 underline whitespace-nowrap cursor-pointer"
              >
                Switch to Inventory Manager
              </button>
            </div>
          )}

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-bold tracking-wider">
                <tr>
                  <th className="px-4 py-3">Hardware Item</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Stock on Hand</th>
                  <th className="px-4 py-3">Threshold</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Quick Restock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {products
                  .filter((p) =>
                    stockSearch.trim()
                      ? p.name.toLowerCase().includes(stockSearch.toLowerCase()) ||
                        p.id.toLowerCase().includes(stockSearch.toLowerCase())
                      : true
                  )
                  .map((p) => {
                    const isLow = p.stock > 0 && p.stock <= p.lowStockThreshold;
                    const isOut = p.stock === 0;

                    return (
                      <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-bold text-slate-900">{p.name}</div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            {p.id} · {p.brand}
                          </div>
                        </td>
                        <td className="px-4 py-3 capitalize">{p.category}</td>
                        <td className="px-4 py-3 font-mono font-bold text-slate-900 tabular-nums">
                          {formatPrice(p.priceLKR, p.priceUSD)}
                        </td>
                        <td className="px-4 py-3 font-mono font-bold tabular-nums text-slate-950">
                          {p.stock} units
                        </td>
                        <td className="px-4 py-3 font-mono tabular-nums text-slate-500">
                          {p.lowStockThreshold} units
                        </td>
                        <td className="px-4 py-3">
                          {isOut ? (
                            <span className="text-[11px] font-bold text-rose-600">
                              Sold Out
                            </span>
                          ) : isLow ? (
                            <span className="text-[11px] font-bold text-[#E11D48]">
                              Low Stock Warning
                            </span>
                          ) : (
                            <span className="text-[11px] font-semibold text-emerald-700">
                              Optimal
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right space-x-2">
                          <button
                            onClick={() => updateProductStock(p.id, Math.max(0, p.stock - 1))}
                            className="px-2 py-0.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded cursor-pointer"
                          >
                            -1
                          </button>
                          <button
                            onClick={() => restockProduct(p.id, 10)}
                            className="px-2 py-0.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded cursor-pointer"
                          >
                            +10
                          </button>
                          <button
                            onClick={() => restockProduct(p.id, 25)}
                            className="px-2.5 py-0.5 text-xs bg-slate-900 hover:bg-[#E11D48] text-white rounded font-bold transition-colors cursor-pointer"
                          >
                            Restock +25
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 4: CLIENT ACCOUNTS CRM ================= */}
      {activeAdminTab === 'clients' && (
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
  )}

      {/* ================= TAB 5: RBAC PERMISSIONS ================= */}
      {activeAdminTab === 'rbac' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6 shadow-xs">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-sans">
              Role-Based Access Control (RBAC) Governance
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
      )}
    </>
  )}

      {/* Modal: Add Product */}
      {isNewProductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-slate-200 p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Add New Product to y5Hut.lk</h3>
            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anker Prime 240W GaN Charging Station"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#E11D48]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Brand</label>
                  <select
                    value={newProductBrand}
                    onChange={(e: any) => setNewProductBrand(e.target.value)}
                    className="w-full px-2 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="Apple">Apple</option>
                    <option value="Samsung">Samsung</option>
                    <option value="Anker">Anker</option>
                    <option value="Soundpeats">Soundpeats</option>
                    <option value="UGREEN">UGREEN</option>
                    <option value="Xiaomi">Xiaomi</option>
                    <option value="Baseus">Baseus</option>
                    <option value="Sony">Sony</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Category</label>
                  <select
                    value={newProductCategory}
                    onChange={(e: any) => setNewProductCategory(e.target.value)}
                    className="w-full px-2 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="apple-store">AppleHuT</option>
                    <option value="smartphones">Mobile Phones</option>
                    <option value="smartwatches">Smartwatches</option>
                    <option value="audio">Earphones &amp; Audio</option>
                    <option value="power-banks">Power Banks</option>
                    <option value="charging">Fast Chargers</option>
                    <option value="cases-protection">Cases &amp; Protection</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Price (LKR Rs.)</label>
                  <input
                    type="number"
                    min="100"
                    required
                    value={newProductPriceLKR}
                    onChange={(e) => setNewProductPriceLKR(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Initial Stock Count</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={newProductStock}
                    onChange={(e) => setNewProductStock(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsNewProductOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#E11D48] text-white rounded-lg font-bold hover:bg-[#BE123C] cursor-pointer"
                >
                  Publish Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
    </div>
  );
};
