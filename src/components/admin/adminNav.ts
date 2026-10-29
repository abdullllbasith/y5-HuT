import {
  LayoutDashboard,
  Tags,
  Smartphone,
  Boxes,
  History,
  FileSpreadsheet,
  ShoppingBag,
  BarChart3,
  Users,
  ShieldCheck,
  LucideIcon,
} from 'lucide-react';
import { AdminTab } from '../../types';

export interface AdminNavItem {
  id: AdminTab;
  label: string;
  description: string;
  icon: LucideIcon;
}

/** Owner-focused pages: the Smart Price Manager journey. */
export const PRIMARY_NAV: AdminNavItem[] = [
  { id: 'overview', label: 'Overview', description: 'Shop snapshot and quick actions', icon: LayoutDashboard },
  { id: 'price-manager', label: 'Price Manager', description: 'Change prices quickly', icon: Tags },
  { id: 'products', label: 'Products', description: 'Add and edit products', icon: Smartphone },
  { id: 'inventory', label: 'Inventory', description: 'Stock levels', icon: Boxes },
  { id: 'price-history', label: 'Price History', description: 'Every price change', icon: History },
  { id: 'import-export', label: 'Import / Export', description: 'CSV in and out', icon: FileSpreadsheet },
];

/** Pre-existing mock modules, kept as demo-only screens. */
export const SECONDARY_NAV: AdminNavItem[] = [
  { id: 'orders', label: 'Orders', description: 'Demo orders', icon: ShoppingBag },
  { id: 'analytics', label: 'Analytics', description: 'Sample figures', icon: BarChart3 },
  { id: 'clients', label: 'Clients (CRM)', description: 'Sample accounts', icon: Users },
  { id: 'rbac', label: 'Roles', description: 'Role simulation', icon: ShieldCheck },
];

export const ALL_NAV: AdminNavItem[] = [...PRIMARY_NAV, ...SECONDARY_NAV];
