import React from 'react';
import { Tags, Smartphone, History, FileSpreadsheet } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { AdminShell } from './AdminShell';
import { OverviewPage } from './pages/OverviewPage';
import { ComingSoonPage } from './pages/ComingSoonPage';
import { InventoryPage } from './pages/InventoryPage';
import { OrdersPage } from './pages/OrdersPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ClientsPage } from './pages/ClientsPage';
import { RolesPage } from './pages/RolesPage';
import { CustomerAccessGate } from './pages/CustomerAccessGate';

export const AdminDashboard: React.FC = () => {
  const { activeAdminTab, setActiveAdminTab, currentUser } = useStore();
  const backToOverview = () => setActiveAdminTab('overview');

  // Role simulation: customers see the access gate instead of the console.
  if (currentUser.role === 'customer') {
    return (
      <div className="py-8">
        <CustomerAccessGate />
      </div>
    );
  }

  const renderPage = () => {
    switch (activeAdminTab) {
      case 'overview':
        return <OverviewPage />;
      case 'price-manager':
        return (
          <ComingSoonPage
            title="Price Manager"
            phase={3}
            icon={Tags}
            summary="Filter by brand, model and variant, then change prices in one place."
            planned={['Brand / model / variant filters', 'Quick price edits with publish to storefront', 'Bulk updates (Phase 4)']}
            onBack={backToOverview}
            backLabel="Back to Overview"
          />
        );
      case 'products':
        return (
          <ComingSoonPage
            title="Products"
            phase={2}
            icon={Smartphone}
            summary="A clearer product and variant model for adding and editing items."
            planned={['Add / edit products and variants', 'LKR pricing with clear USD handling', 'Reset demo data']}
            onBack={backToOverview}
            backLabel="Back to Overview"
          />
        );
      case 'inventory':
        return <InventoryPage />;
      case 'price-history':
        return (
          <ComingSoonPage
            title="Price History"
            phase={6}
            icon={History}
            summary="A log of every price change: old price, new price, when and how."
            planned={['Single, bulk and CSV changes recorded', 'Filter by product and date']}
            onBack={backToOverview}
            backLabel="Back to Overview"
          />
        );
      case 'import-export':
        return (
          <ComingSoonPage
            title="Import / Export"
            phase={5}
            icon={FileSpreadsheet}
            summary="Export prices to CSV, edit in Excel, and import them back with validation."
            planned={['CSV export', 'Import preview with row-by-row errors']}
            onBack={backToOverview}
            backLabel="Back to Overview"
          />
        );
      case 'orders':
        return <OrdersPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'clients':
        return <ClientsPage />;
      case 'rbac':
        return <RolesPage />;
    }
  };

  return <AdminShell>{renderPage()}</AdminShell>;
};
