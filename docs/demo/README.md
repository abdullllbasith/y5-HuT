# y5Hut Demo — Smart Price Manager

> **DEMO MODE — data is stored only in this browser.**
> This is a concept demonstration for the shop owner, not a production store.

## 1. Objective

The shop changes phone prices, adds products and adjusts stock very often. This demo shows a
**Smart Price Manager** simple enough for the owner to understand in minutes:

- brand / model / variant filters
- quick single price edits and bulk updates
- CSV import / export
- price-change history
- quick stock adjustment
- changes published in the admin appear in the public catalog (same browser only)

## 2. Scope

| In scope | Out of scope |
| --- | --- |
| Extending the existing React admin dashboard | Rebuilding the app or changing its visual identity |
| LKR price editing with explicit currency handling | Production database, Supabase or any backend |
| localStorage persistence + a visible reset | Real authentication / real roles |
| CSV import/export in the browser | Payment gateway, real orders, email/SMS |
| Price history and stock adjustment | Multi-device sync, multi-user concurrency |
| Unit tests for pricing/CSV logic | Deployment / hosting hardening |

## 3. Current architecture (baseline findings)

Stack: React 19 + TypeScript + Vite 8 + Tailwind 4 (+ `lucide-react`, `motion`). No router, no backend.
`@google/genai` and `express` are listed in `package.json` but are **not used by any source file**.

### State — `src/context/StoreContext.tsx`
A single React context holds everything: products, orders, clients, cart, wishlist, currency,
current user, notifications, UI flags (drawers, `activeView`, `activeAdminTab`) and all actions.

### "Routing"
There is **no URL routing**. `activeView` (`store | deals | admin | reviews | apple-store`) in context is
switched by the navbar, and `App.tsx` renders the matching section. The admin sub-page is
`activeAdminTab` (`analytics | orders | inventory | clients | rbac`). A refresh returns to the
storefront; there are no deep links.

### localStorage keys

| Key | Content | Persisted? |
| --- | --- | --- |
| `y5hut_products_v3` | products (price, stock, reviews…) | yes |
| `y5hut_orders_v3` | orders | yes |
| `y5hut_clients_v3` | B2B client accounts | yes |
| `y5hut_user_v3` | simulated current user | yes |
| `y5hut_wishlist_v3` | wishlist product ids | yes |
| `y5hut_currency_v3` | `LKR` / `USD` | yes |
| `y5hut_notifications_v3` | declared but never read or written | **no** — notifications reset on reload |
| cart | in memory only | no |

There is no central "reset demo data" function yet.

### Role simulation
`UserRole = super_admin | inventory_manager | sales_rep | customer`. `switchUserRole` swaps
`currentUser` for one of four hard-coded profiles in `INITIAL_TEAM_USERS`. `AdminDashboard` shows or
hides tabs and actions by role; the `customer` role shows an access gate with buttons to switch role.
This is **UI-only simulation**: no credentials, nothing enforced.

### Checkout
`CheckoutModal` is a 3-step flow (shipping → payment → confirmation). Payment is **simulated**: a
1.1 s `setTimeout`, then `createOrder()`. Card fields are pre-filled placeholder text and are never
validated or sent anywhere. `createOrder` generates an `ST-xxxxx` id, deducts stock, stores the order,
clears the cart and creates an in-app "email" notification (an HTML preview; nothing is sent).

### What already works (real, within the browser)
- Storefront: hero, deals, brands, catalog with filters, product detail modal, reviews, wishlist, cart.
- LKR/USD display toggle.
- Admin: analytics (from static mock metrics), order status progression, inventory table with
  −1 / +10 / +25 stock buttons, add product, client accounts, role switching.
- Product, order and client changes persist across reloads.

### What is merely simulated
- Payments, Koko/Mintpay/Net-30, tracking numbers, courier, TRCSL, emails/notifications.
- Roles and "security" (UI hiding only).
- Analytics (`MONTHLY_METRICS` is static; not computed from orders).
- Client credit lines.
- The 10 seed products and 3 seed orders are mock data.

### Fragile areas (documented, not fixed in Phase 0)
1. **Dual currency fields.** Every `Product` has independent `priceLKR` and `priceUSD`; `OrderItem`
   copies both. Editing LKR will **not** update USD. Phase 2/3 must either edit LKR only and label USD
   as "not synced", or hide USD. Do not silently derive one from the other.
2. **`AdminDashboard.tsx` is ~1,280 lines** with ~20 `useState` hooks across five modules (Phase 1).
3. **`selectedProductForDetail` stores a full `Product` copy** in context, so an open modal can show a
   stale price/stock after an admin edit. Prefer storing an id and looking the product up.
4. **Cart lines snapshot price at add time** (`priceLKR/priceUSD/maxStock`). A later price edit will not
   change items already in the cart, so checkout would charge the old price.
5. **`createOrder` stock deduction** calls `updateProductStock` per item using the render-time
   `products` array (falling back to `10` if not found), and `updateProductStock` fires notifications
   from inside a `setProducts` updater (a side effect in a state updater). The same product on two cart
   lines could be deducted incorrectly.
6. **No schema versioning/migration.** Keys end in `_v3`; stored products are parsed as-is with no
   validation. Adding fields (variants, price history) needs a new key or a migration step, and a
   corrupted value silently falls back to defaults.
7. **No model/variant entity.** A "variant" today is only `storageOptions` (strings) and
   `colorOptions`, with a single price for all variants. Variant-level pricing needs a data-model
   decision in Phase 2.
8. **Leftover branding:** the checkout header still reads "simplytek Checkout".
9. **README.md** still says "Run and deploy your AI Studio app" and asks for `GEMINI_API_KEY`, which
   nothing uses.
10. **No tests** and no linter other than `tsc --noEmit` (`npm run lint`).
11. **Admin is reachable by anyone** from the navbar; the role gate is cosmetic.

## 4. Baseline validation (Phase 0)

Environment: Node 24.10.0, npm 11.6.1, Windows 11.

| Check | Result |
| --- | --- |
| `npm install` (as committed) | **Failed** with `ERESOLVE`: `vite@8` has an optional peer `esbuild ^0.27 \|\| ^0.28`, but the repo pinned `esbuild ^0.25.0` |
| Fix applied | `package.json`: `esbuild ^0.25.0` → `^0.28.0` (no source file imports esbuild; Vite uses it) |
| `npm install` (after fix) | OK — 270 packages, 0 vulnerabilities |
| `npm run lint` (`tsc --noEmit`) | **Passes**, no errors |
| `npm run build` | **Passes** — 1678 modules, JS 425.5 kB (112.6 kB gzip), CSS 52.5 kB. Warning: `vite.config.ts` uses `__dirname` (harmless) |

No `package-lock.json` is committed. `npm install` generates one locally; it was intentionally **not**
committed in Phase 0 to avoid lockfile churn. The repo owner should decide whether to commit one so both
developers get identical installs.

## 5. Target owner journey

1. Open the site → click **Admin** → land on an **Overview** with a visible Demo Mode banner.
2. Open **Price Manager** → filter by brand (e.g. Apple) → model → variant.
3. Edit a price in-line, or select several rows and apply a bulk change (e.g. +5 %, −Rs. 2,000).
4. Review the **before → after** preview, then **Publish**.
5. Open **Price History** to see when/old/new/source; open the storefront and see the new price.
6. **Inventory**: quick +/− stock adjustment with low-stock highlighting.
7. **Import/Export**: export CSV, edit in Excel, import with a validation preview, then apply.
8. **Reset demo data** at any time.

## 6. Acceptance checklist

- [ ] Demo Mode notice is visible in the admin and says data lives only in this browser.
- [ ] Reset restores the original mock data (products, history, orders) after confirmation.
- [ ] A price edit in the admin changes the storefront price after publish (same browser).
- [ ] LKR is the edited currency; USD handling is explained on screen and never silently coupled.
- [ ] Bulk update shows a preview and can be cancelled.
- [ ] Every price change is recorded in history (old, new, time, source: single/bulk/CSV).
- [ ] CSV export opens correctly in Excel; import rejects bad rows with clear messages.
- [ ] Stock adjustment works and cannot go negative.
- [ ] Existing storefront, cart, checkout demo, wishlist, reviews and role switching still work.
- [ ] `npm run lint` and `npm run build` pass on every phase PR.

## 7. Key files

| File | Role |
| --- | --- |
| `src/App.tsx` | view switch (no router) |
| `src/context/StoreContext.tsx` | all state, persistence, actions |
| `src/types/index.ts` | shared types — coordinate edits |
| `src/data/mockData.ts` | seed products/orders/clients/users |
| `src/components/admin/AdminDashboard.tsx` | current admin (split in Phase 1) |
| `src/components/store/CatalogView.tsx`, `ProductCard.tsx`, `ProductDetailModal.tsx` | public price display |
| `src/components/store/CartDrawer.tsx`, `src/components/checkout/CheckoutModal.tsx` | cart + simulated checkout |
| `src/components/layout/Navbar.tsx` | storefront ↔ admin navigation |

## 8. Mock-data limitations

- Only 10 products, 3 orders and a few clients; brands are a fixed union type (`BrandName`).
- Seed data is not a realistic phone-shop catalogue (no model/variant rows with per-storage prices).
- USD and LKR prices are independent hand-typed values; there is no exchange-rate logic.
- localStorage is per browser profile and origin, about 5 MB, can be cleared by the user, and is not
  shared between the two developers or with the owner's own device.
- Analytics numbers are static and will not react to price or order changes.

## 9. Planned phases

| Phase | Branch | Outcome |
| --- | --- | --- |
| 0 | `feature/demo-00-foundation` | This documentation + baseline |
| 1 | `feature/demo-01-dashboard-shell` | Admin shell + page modules, navigation, Demo Mode banner, honest placeholders |
| 2 | data model | Price/variant model, price-history type, storage versioning, reset |
| 3 | price manager | Filters, inline edit, publish to storefront |
| 4 | bulk update | Bulk operations with preview |
| 5 | CSV | Import/export with validation |
| 6 | stock + history | Quick stock adjustment, price-history view, tests |
| 7 | polish | Storefront consistency, fragile-area fixes, final demo script |

The exact scope of Phases 2–7 is set by their own prompts; this table is indicative.
