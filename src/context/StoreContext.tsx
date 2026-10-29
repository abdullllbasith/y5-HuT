import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  OrderItem,
  Order,
  ClientAccount,
  UserProfile,
  UserRole,
  NotificationAlert,
  OrderStatus,
  ProductReview,
  Currency,
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_CLIENTS,
  INITIAL_TEAM_USERS,
} from '../data/mockData';

interface CartItem extends OrderItem {
  maxStock: number;
}

interface StoreContextType {
  products: Product[];
  orders: Order[];
  clients: ClientAccount[];
  cart: CartItem[];
  wishlist: string[];
  currency: Currency;
  currentUser: UserProfile;
  notifications: NotificationAlert[];
  unreadNotificationCount: number;
  isCartOpen: boolean;
  isWishlistOpen: boolean;
  isNotificationOpen: boolean;
  selectedProductForDetail: Product | null;
  activeView: 'store' | 'deals' | 'admin' | 'reviews' | 'apple-store';
  activeAdminTab: 'analytics' | 'orders' | 'inventory' | 'clients' | 'rbac';
  previewingEmail: NotificationAlert | null;
  
  // Actions
  setCurrency: (c: Currency) => void;
  formatPrice: (priceLKR: number, priceUSD: number) => string;
  formatInstallment: (priceLKR: number, priceUSD: number) => string;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  setActiveView: (view: 'store' | 'deals' | 'admin' | 'reviews' | 'apple-store') => void;
  setActiveAdminTab: (tab: 'analytics' | 'orders' | 'inventory' | 'clients' | 'rbac') => void;
  setIsCartOpen: (open: boolean) => void;
  setIsWishlistOpen: (open: boolean) => void;
  setIsNotificationOpen: (open: boolean) => void;
  setSelectedProductForDetail: (product: Product | null) => void;
  setPreviewingEmail: (notification: NotificationAlert | null) => void;
  switchUserRole: (role: UserRole) => void;

  // Cart actions
  addToCart: (
    product: Product,
    quantity: number,
    color?: string,
    storage?: string
  ) => void;
  removeFromCart: (productId: string, color?: string, storage?: string) => void;
  updateCartQuantity: (
    productId: string,
    quantity: number,
    color?: string,
    storage?: string
  ) => void;
  clearCart: () => void;
  cartTotalCount: number;
  cartSubtotalLKR: number;
  cartSubtotalUSD: number;

  // Order & Milestone Actions
  createOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'status' | 'milestones'>) => Order;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;

  // Inventory actions
  updateProductStock: (productId: string, newStock: number) => void;
  addProduct: (product: Product) => void;
  restockProduct: (productId: string, delta: number) => void;

  // Client actions
  updateClientAccount: (clientId: string, updates: Partial<ClientAccount>) => void;
  addClientAccount: (client: ClientAccount) => void;

  // Review actions
  addProductReview: (productId: string, review: Omit<ProductReview, 'id' | 'date'>) => void;

  // Notification actions
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  triggerNotification: (
    type: 'milestone' | 'inventory' | 'task' | 'security',
    title: string,
    message: string,
    orderId?: string,
    emailSubject?: string,
    emailBodyHtml?: string
  ) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'y5hut_products_v3',
  ORDERS: 'y5hut_orders_v3',
  CLIENTS: 'y5hut_clients_v3',
  NOTIFICATIONS: 'y5hut_notifications_v3',
  CURRENT_USER: 'y5hut_user_v3',
  WISHLIST: 'y5hut_wishlist_v3',
  CURRENCY: 'y5hut_currency_v3',
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENCY);
      return (saved as Currency) || 'LKR';
    } catch {
      return 'LKR';
    }
  });

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENCY, c);
    } catch (e) {
      console.error(e);
    }
  };

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [clients, setClients] = useState<ClientAccount[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CLIENTS);
      return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
    } catch {
      return INITIAL_CLIENTS;
    }
  });

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return saved ? JSON.parse(saved) : INITIAL_TEAM_USERS[0];
    } catch {
      return INITIAL_TEAM_USERS[0];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WISHLIST);
      return saved ? JSON.parse(saved) : ['prod-iphone16promax', 'prod-airpods-pro2'];
    } catch {
      return ['prod-iphone16promax', 'prod-airpods-pro2'];
    }
  });

  const [notifications, setNotifications] = useState<NotificationAlert[]>([
    {
      id: 'notif-1',
      type: 'milestone',
      title: 'Dispatched via Pronto Express: Order #Y5-90412',
      message: 'Waybill PRT-LK-994821 assigned. Scheduled for priority handover in Colombo today.',
      timestamp: 'Today, 09:00',
      read: false,
      orderId: 'Y5-90412',
      emailSubject: 'Order #Y5-90412 Shipped: y5Hut.lk Islandwide Express',
      emailBodyHtml: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #E2E8F0; border-radius: 8px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #0F172A; margin: 0; font-size: 22px;">y5<span style="color: #E11D48;">Hut</span>.lk</h2>
            <p style="color: #64748B; font-size: 13px; margin: 4px 0 0 0;">Sri Lanka's Premier Tech & Gadget Destination</p>
          </div>
          <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; padding: 16px; margin-bottom: 20px;">
            <p style="margin: 0 0 6px 0; font-size: 14px;"><strong>Order ID:</strong> #Y5-90412</p>
            <p style="margin: 0 0 6px 0; font-size: 14px;"><strong>Courier Partner:</strong> Pronto Islandwide Express</p>
            <p style="margin: 0 0 6px 0; font-size: 14px;"><strong>Waybill Tracking:</strong> PRT-LK-994821</p>
            <p style="margin: 0; font-size: 14px;"><strong>TRCSL Status:</strong> Approved & Registered</p>
          </div>
          <p style="font-size: 14px; color: #334155; line-height: 1.6;">
            Your items have been safely dispatched with tamper-evident security packaging and authentic warranty documentation from y5Hut.lk.
          </p>
          <div style="border-top: 1px solid #E2E8F0; padding-top: 16px; text-align: center; font-size: 12px; color: #94A3B8;">
            y5Hut Colombo Hub · Hotline: +94 117 555 888
          </div>
        </div>
      `,
    },
    {
      id: 'notif-2',
      type: 'inventory',
      title: 'Stock Notification: iPhone 16 Pro Max',
      message: 'Remaining stock is 14 units at the Colombo central vault.',
      timestamp: 'Today, 07:30',
      read: true,
    },
  ]);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);
  const [previewingEmail, setPreviewingEmail] = useState<NotificationAlert | null>(null);
  const [activeView, setActiveView] = useState<'store' | 'deals' | 'admin' | 'reviews' | 'apple-store'>('store');
  const [activeAdminTab, setActiveAdminTab] = useState<'analytics' | 'orders' | 'inventory' | 'clients' | 'rbac'>('analytics');

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
    } catch (e) {
      console.error(e);
    }
  }, [clients]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
    } catch (e) {
      console.error(e);
    }
  }, [currentUser]);

  // Price formatting
  const formatPrice = (priceLKR: number, priceUSD: number) => {
    if (currency === 'LKR') {
      return `Rs. ${priceLKR.toLocaleString()}`;
    }
    return `$${priceUSD.toLocaleString()}`;
  };

  const formatInstallment = (priceLKR: number, priceUSD: number) => {
    if (currency === 'LKR') {
      const third = Math.round(priceLKR / 3);
      return `or 3 installments of Rs. ${third.toLocaleString()} with Koko or Mintpay`;
    }
    const thirdUSD = Math.round(priceUSD / 3);
    return `or 3 payments of $${thirdUSD} with 0% interest`;
  };

  // Wishlist actions
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Switch role
  const switchUserRole = (role: UserRole) => {
    const matchedUser = INITIAL_TEAM_USERS.find((u) => u.role === role) || {
      id: `user-${role}`,
      name: role.replace('_', ' ').toUpperCase(),
      email: `${role}@y5hut.lk`,
      role,
      avatarInitials: role.substring(0, 2).toUpperCase(),
    };
    setCurrentUser(matchedUser);

    triggerNotification(
      'security',
      `Session Switched: ${matchedUser.name}`,
      `Credentials adjusted to ${role.replace('_', ' ').toUpperCase()}. Role restrictions applied.`
    );
  };

  // Notification actions
  const triggerNotification = (
    type: 'milestone' | 'inventory' | 'task' | 'security',
    title: string,
    message: string,
    orderId?: string,
    emailSubject?: string,
    emailBodyHtml?: string
  ) => {
    const newAlert: NotificationAlert = {
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type,
      title,
      message,
      timestamp: 'Just now',
      read: false,
      orderId,
      emailSubject,
      emailBodyHtml,
    };
    setNotifications((prev) => [newAlert, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  // Cart operations
  const addToCart = (
    product: Product,
    quantity: number,
    color?: string,
    storage?: string
  ) => {
    const chosenColor = color || product.colorOptions[0]?.name;
    const chosenStorage = storage || product.storageOptions?.[0];

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.productId === product.id &&
          item.selectedColor === chosenColor &&
          item.selectedStorage === chosenStorage
      );

      if (existingIndex > -1) {
        const next = [...prev];
        const newQty = Math.min(
          next[existingIndex].quantity + quantity,
          product.stock
        );
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: newQty,
        };
        return next;
      } else {
        return [
          ...prev,
          {
            productId: product.id,
            name: product.name,
            priceLKR: product.priceLKR,
            priceUSD: product.priceUSD,
            quantity: Math.min(quantity, product.stock),
            selectedColor: chosenColor,
            selectedStorage: chosenStorage,
            deviceType: product.deviceType,
            maxStock: product.stock,
          },
        ];
      }
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (
    productId: string,
    color?: string,
    storage?: string
  ) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(
            item.productId === productId &&
            item.selectedColor === color &&
            item.selectedStorage === storage
          )
      )
    );
  };

  const updateCartQuantity = (
    productId: string,
    quantity: number,
    color?: string,
    storage?: string
  ) => {
    if (quantity <= 0) {
      removeFromCart(productId, color, storage);
      return;
    }

    setCart((prev) =>
      prev.map((item) => {
        if (
          item.productId === productId &&
          item.selectedColor === color &&
          item.selectedStorage === storage
        ) {
          return {
            ...item,
            quantity: Math.min(quantity, item.maxStock),
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => setCart([]);

  const cartTotalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotalLKR = cart.reduce(
    (acc, item) => acc + item.priceLKR * item.quantity,
    0
  );
  const cartSubtotalUSD = cart.reduce(
    (acc, item) => acc + item.priceUSD * item.quantity,
    0
  );

  // Stock operations
  const updateProductStock = (productId: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const updated = { ...p, stock: Math.max(0, newStock) };
          if (updated.stock <= updated.lowStockThreshold) {
            triggerNotification(
              'inventory',
              `Low Stock Alert: ${updated.name}`,
              `Only ${updated.stock} units remaining in the warehouse.`
            );
          }
          return updated;
        }
        return p;
      })
    );
  };

  const restockProduct = (productId: string, delta: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: p.stock + delta } : p))
    );
  };

  const addProduct = (product: Product) => {
    setProducts((prev) => [product, ...prev]);
    triggerNotification(
      'task',
      'New Product Catalog Item Listed',
      `${product.name} registered with ${product.stock} units.`
    );
  };

  // Order creation with milestones
  const createOrder = (
    orderData: Omit<Order, 'id' | 'createdAt' | 'status' | 'milestones'>
  ): Order => {
    const orderId = `ST-${Math.floor(10000 + Math.random() * 90000)}`;
    const nowIso = new Date().toISOString();
    const nowFormatted = new Date().toLocaleString();

    const newMilestones = [
      {
        stage: 'confirmed' as OrderStatus,
        label: 'Order Confirmed',
        timestamp: nowFormatted,
        description: `Payment authorized via ${orderData.paymentMethod.toUpperCase()}. Inventory allocated.`,
        completed: true,
      },
      {
        stage: 'processing' as OrderStatus,
        label: 'Quality Audit & TRCSL Registration',
        timestamp: 'Estimated within 2 hours',
        description: 'Serial number verified with official warranty stamp.',
        completed: false,
      },
      {
        stage: 'dispatched' as OrderStatus,
        label: 'Dispatched via Pronto Express',
        timestamp: 'Pending Handover',
        description: 'Handover to priority courier for Islandwide delivery.',
        completed: false,
      },
      {
        stage: 'delivered' as OrderStatus,
        label: 'Delivered to Doorstep',
        timestamp: 'Estimated 1-3 Business Days',
        description: 'Signature proof of delivery logged.',
        completed: false,
      },
    ];

    const newOrder: Order = {
      ...orderData,
      id: orderId,
      createdAt: nowIso,
      status: 'confirmed',
      milestones: newMilestones,
    };

    // Deduct stock
    orderData.items.forEach((item) => {
      updateProductStock(
        item.productId,
        Math.max(
          0,
          (products.find((p) => p.id === item.productId)?.stock || 10) -
            item.quantity
        )
      );
    });

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();

    // Trigger email notification
    const emailSubject = `Order #${orderId} Confirmed - y5Hut.lk Sri Lanka`;
    const emailBodyHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #E2E8F0; border-radius: 8px;">
        <div style="border-bottom: 2px solid #E11D48; padding-bottom: 16px; margin-bottom: 20px;">
          <h1 style="color: #0F172A; margin: 0; font-size: 24px;">y5<span style="color: #E11D48;">Hut</span>.lk</h1>
          <p style="color: #64748B; font-size: 13px; margin: 4px 0 0 0;">Sri Lanka's Premier Tech & Gadget Destination</p>
        </div>
        <p style="color: #334155; font-size: 14px;">Dear ${orderData.customerName},</p>
        <p style="color: #475569; font-size: 14px; line-height: 1.6;">
          Thank you for choosing y5Hut.lk. Your order <strong>#${orderId}</strong> has been confirmed and is currently being prepared for islandwide express dispatch.
        </p>
        <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; padding: 16px; margin: 20px 0;">
          <h4 style="margin: 0 0 10px 0; font-size: 13px; text-transform: uppercase; color: #0F172A;">Summary of Items</h4>
          ${orderData.items
            .map(
              (item) => `
            <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 6px;">
              <span>${item.quantity}x ${item.name} (${item.selectedColor || ''})</span>
              <strong>${orderData.currency === 'LKR' ? `Rs. ${(item.priceLKR * item.quantity).toLocaleString()}` : `$${(item.priceUSD * item.quantity).toLocaleString()}`}</strong>
            </div>
          `
            )
            .join('')}
          <div style="border-top: 1px dashed #CBD5E1; margin-top: 10px; padding-top: 10px; display: flex; justify-content: space-between; font-weight: bold;">
            <span>Total:</span>
            <span style="color: #E11D48;">${orderData.currency === 'LKR' ? `Rs. ${orderData.totalLKR.toLocaleString()}` : `$${orderData.totalUSD.toLocaleString()}`}</span>
          </div>
        </div>
        <p style="font-size: 13px; color: #64748B;">Payment Method: <strong>${orderData.paymentMethod.toUpperCase()}</strong></p>
        <div style="border-top: 1px solid #E2E8F0; margin-top: 24px; padding-top: 16px; text-align: center; font-size: 12px; color: #94A3B8;">
          y5Hut Hotline: +94 117 555 888 · Showroom: Colombo 04, Sri Lanka
        </div>
      </div>
    `;

    triggerNotification(
      'milestone',
      `Order Confirmed: #${orderId}`,
      `Total ${orderData.currency === 'LKR' ? `Rs. ${orderData.totalLKR.toLocaleString()}` : `$${orderData.totalUSD.toLocaleString()}`} authorized. Milestone email sent to ${orderData.customerEmail}.`,
      orderId,
      emailSubject,
      emailBodyHtml
    );

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;

        const stages: OrderStatus[] = ['confirmed', 'processing', 'dispatched', 'delivered'];
        const targetIndex = stages.indexOf(newStatus);
        const nowFormatted = new Date().toLocaleString();

        const updatedMilestones = ord.milestones.map((m) => {
          const mIndex = stages.indexOf(m.stage);
          if (mIndex <= targetIndex) {
            return {
              ...m,
              completed: true,
              timestamp: m.completed ? m.timestamp : nowFormatted,
            };
          }
          return { ...m, completed: false };
        });

        const updatedOrder: Order = {
          ...ord,
          status: newStatus,
          milestones: updatedMilestones,
          trackingNumber:
            newStatus === 'dispatched' && !ord.trackingNumber
              ? `PRT-LK-${Math.floor(100000 + Math.random() * 900000)}`
              : ord.trackingNumber,
          carrier:
            newStatus === 'dispatched' && !ord.carrier
              ? 'Pronto Islandwide Express'
              : ord.carrier,
        };

        const emailSubject = `Order #${orderId} Update: ${newStatus.toUpperCase()}`;
        const emailBodyHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #E2E8F0; border-radius: 8px;">
            <h2 style="color: #0F172A; margin: 0 0 10px 0;">y5<span style="color: #E11D48;">Hut</span>.lk Milestone Log</h2>
            <p>Order Reference: <strong>#${orderId}</strong></p>
            <p>New Status: <strong style="color: #E11D48;">${newStatus.toUpperCase()}</strong></p>
            ${updatedOrder.trackingNumber ? `<p>Pronto Express Tracking: <strong>${updatedOrder.trackingNumber}</strong></p>` : ''}
            <div style="margin-top: 20px; font-size: 12px; color: #94A3B8;">
              y5Hut.lk Automated Fulfillment Center · Colombo, Sri Lanka
            </div>
          </div>
        `;

        triggerNotification(
          'milestone',
          `Order #${orderId}: ${newStatus.toUpperCase()}`,
          `Milestone updated to ${newStatus}. Notification sent to ${ord.customerEmail}.`,
          orderId,
          emailSubject,
          emailBodyHtml
        );

        return updatedOrder;
      })
    );
  };

  const updateClientAccount = (
    clientId: string,
    updates: Partial<ClientAccount>
  ) => {
    setClients((prev) =>
      prev.map((c) => (c.id === clientId ? { ...c, ...updates } : c))
    );
  };

  const addClientAccount = (client: ClientAccount) => {
    setClients((prev) => [client, ...prev]);
    triggerNotification(
      'task',
      'Corporate Client Profile Created',
      `${client.companyName} registered with Rs. ${client.creditLimitLKR.toLocaleString()} credit line.`
    );
  };

  const addProductReview = (
    productId: string,
    reviewData: Omit<ProductReview, 'id' | 'date'>
  ) => {
    const newReview: ProductReview = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const updatedReviews = [newReview, ...p.reviews];
          const newAvg = Number(
            (
              updatedReviews.reduce((sum, r) => sum + r.rating, 0) /
              updatedReviews.length
            ).toFixed(1)
          );
          return {
            ...p,
            reviews: updatedReviews,
            rating: newAvg,
            reviewCount: updatedReviews.length,
          };
        }
        return p;
      })
    );

    triggerNotification(
      'task',
      'Customer Product Review Submitted',
      `Rating ${reviewData.rating}/5 stars logged for verification.`
    );
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        orders,
        clients,
        cart,
        wishlist,
        currency,
        currentUser,
        notifications,
        unreadNotificationCount,
        isCartOpen,
        isWishlistOpen,
        isNotificationOpen,
        selectedProductForDetail,
        activeView,
        activeAdminTab,
        previewingEmail,
        setCurrency,
        formatPrice,
        formatInstallment,
        toggleWishlist,
        isInWishlist,
        setActiveView,
        setActiveAdminTab,
        setIsCartOpen,
        setIsWishlistOpen,
        setIsNotificationOpen,
        setSelectedProductForDetail,
        setPreviewingEmail,
        switchUserRole,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotalCount,
        cartSubtotalLKR,
        cartSubtotalUSD,
        createOrder,
        updateOrderStatus,
        updateProductStock,
        addProduct,
        restockProduct,
        updateClientAccount,
        addClientAccount,
        addProductReview,
        markNotificationAsRead,
        markAllNotificationsRead,
        triggerNotification,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
