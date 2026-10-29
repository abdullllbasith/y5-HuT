export type ProductCategory = 
  | 'applehut'
  | 'apple-store'
  | 'smartphones' 
  | 'smartwatches'
  | 'audio' 
  | 'power-banks'
  | 'charging' 
  | 'cases-protection' 
  | 'drones-lifestyle'
  | 'accessories';

export type KnownBrand =
  | 'Apple'
  | 'Samsung'
  | 'Anker'
  | 'Soundpeats'
  | 'UGREEN'
  | 'Xiaomi'
  | 'Baseus'
  | 'Sony'
  | 'Google'
  | 'OnePlus'
  | 'y5 HuT Certified';

/** Known brands autocomplete, but owners can add any brand in the demo admin. */
export type BrandName = KnownBrand | (string & {});

export type Currency = 'LKR' | 'USD';

export interface ProductSpec {
  display?: string;
  processor?: string;
  battery?: string;
  camera?: string;
  storage?: string;
  connectivity?: string;
  dimensions?: string;
  weight?: string;
  warranty: string;
}

export interface ProductReview {
  id: string;
  authorName: string;
  authorCompany?: string;
  rating: number; // 1-5
  date: string;
  title: string;
  comment: string;
  isVerifiedPurchase: boolean;
}

/**
 * A sellable combination of storage + colour. When a product has variants, the
 * variant's price and stock are the source of truth; Product.priceLKR and
 * Product.stock are derived (lowest price / total stock) by normalizeProduct().
 */
export interface ProductVariant {
  id: string;
  sku: string;
  storage?: string;
  color?: string;
  priceLKR: number; // editable selling price (LKR)
  priceUSD?: number; // illustrative only, not exchange-synced
  stock: number;
  priceUpdatedAt?: string; // ISO time of the last published price change
}

export interface Product {
  id: string;
  name: string;
  brand: BrandName;
  category: ProductCategory;
  priceUSD: number;
  priceLKR: number;
  originalPriceUSD?: number;
  originalPriceLKR?: number;
  stock: number;
  lowStockThreshold: number;
  rating: number;
  reviewCount: number;
  description: string;
  tagline: string;
  isFeaturedPromo?: boolean;
  promoDiscountPercent?: number;
  badge?: 'HOT' | 'SALE' | 'GENUINE' | 'NEW' | 'BESTSELLER';
  deviceType: 'phone' | 'earbuds' | 'charger' | 'case' | 'cable' | 'smartwatch' | 'powerbank';
  colorOptions: { name: string; hex: string }[];
  storageOptions?: string[];
  specs: ProductSpec;
  reviews: ProductReview[];
  kokoEligible?: boolean;
  mintpayEligible?: boolean;
  variants?: ProductVariant[];
  priceUpdatedAt?: string; // ISO time of the last published price change (products without variants)
  archived?: boolean; // hidden from the storefront; never deleted so order history stays valid
  imageUrl?: string; // optional demo image URL (http/https); falls back to the built-in graphic
}

export type OrderStatus = 'confirmed' | 'processing' | 'dispatched' | 'delivered' | 'cancelled';

export interface OrderMilestone {
  stage: OrderStatus;
  label: string;
  timestamp: string;
  description: string;
  completed: boolean;
}

export interface OrderItem {
  productId: string;
  name: string;
  priceUSD: number;
  priceLKR: number;
  quantity: number;
  selectedColor?: string;
  selectedStorage?: string;
  variantId?: string;
  sku?: string;
  deviceType: 'phone' | 'earbuds' | 'charger' | 'case' | 'cable' | 'smartwatch' | 'powerbank';
}

export interface Order {
  id: string; // e.g. ST-80942
  createdAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerCompany?: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  items: OrderItem[];
  subtotalLKR: number;
  subtotalUSD: number;
  shippingLKR: number;
  shippingUSD: number;
  totalLKR: number;
  totalUSD: number;
  currency: Currency;
  paymentMethod: 'card' | 'koko' | 'mintpay' | 'cod' | 'corporate-invoice';
  status: OrderStatus;
  milestones: OrderMilestone[];
  trackingNumber?: string;
  carrier?: string;
}

export type UserRole = 'super_admin' | 'inventory_manager' | 'sales_rep' | 'customer';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarInitials: string;
  company?: string;
  department?: string;
}

export interface ClientAccount {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  tier: 'Enterprise Platinum' | 'Corporate Gold' | 'Standard Business';
  totalSpentLKR: number;
  totalOrders: number;
  creditLimitLKR: number;
  outstandingBalanceLKR: number;
  assignedRep: string;
  lastActive: string;
  status: 'Active' | 'Review' | 'Suspended';
}

export interface NotificationAlert {
  id: string;
  type: 'milestone' | 'inventory' | 'task' | 'security';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  orderId?: string;
  emailSubject?: string;
  emailBodyHtml?: string;
}

export interface MonthlySalesMetric {
  month: string;
  revenueLKR: number;
  orders: number;
  smartphonesCount: number;
  accessoriesCount: number;
}

/** One published price edit. variantId is omitted for products without variants. */
export interface PriceChange {
  productId: string;
  variantId?: string;
  newPriceLKR: number;
}

export type StockReason =
  | 'received-shipment'
  | 'store-sale'
  | 'damaged'
  | 'correction'
  | 'customer-return'
  | 'other';

export interface StockAdjustment {
  id: string;
  at: string; // ISO time
  productId: string;
  variantId?: string;
  productName: string;
  sku: string;
  label: string; // e.g. "256GB / Blue"
  before: number;
  after: number;
  reason: StockReason;
  note?: string;
  by: string; // simulated role/user name (demo only)
}

/** What the most recent publish changed, so it can be undone safely. In memory only. */
export interface PublishSnapshot {
  at: string;
  entries: {
    productId: string;
    variantId?: string;
    oldPriceLKR: number;
    newPriceLKR: number;
    oldUpdatedAt?: string;
    oldOriginalPriceLKR?: number;
  }[];
}

export type AdminTab =
  | 'overview'
  | 'price-manager'
  | 'products'
  | 'inventory'
  | 'price-history'
  | 'import-export'
  | 'orders'
  | 'analytics'
  | 'clients'
  | 'rbac';
