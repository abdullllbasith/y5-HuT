import React from 'react';
import { Smartphone, History } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { AdminShell } from './AdminShell';
import { OverviewPage } from './pages/OverviewPage';
import { ComingSoonPage } from './pages/ComingSoonPage';
import { InventoryPage } from './inventory/InventoryPage';
import { PriceHistoryPage } from './price-history/PriceHistoryPage';
import { ProductsPage } from './products/ProductsPage';
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
        return <ProductsPage />;
      case 'inventory':
        return <InventoryPage />;
      case 'price-history':
        return <PriceHistoryPage />;
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
