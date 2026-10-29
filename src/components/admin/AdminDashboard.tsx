import React from 'react';
import { Smartphone, History } from 'lucide-react';
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
import { PriceManagerPage } from './price-manager/PriceManagerPage';
import { ImportExportPage } from './import-export/ImportExportPage';
import { usePriceDraft } from './price-manager/usePriceDraft';

export const AdminDashboard: React.FC = () => {
  const { activeAdminTab, setActiveAdminTab, currentUser } = useStore();
  // Held here so an unpublished draft survives switching between admin pages.
  const priceDraft = usePriceDraft();
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
        return <PriceManagerPage draft={priceDraft} />;
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
        return <ImportExportPage />;
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
