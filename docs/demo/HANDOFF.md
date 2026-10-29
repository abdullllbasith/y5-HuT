# Handoff: y5Hut Smart Price Manager demo

> **DEMO MODE — data is stored only in this browser.** This is a concept demonstration, not a store.

## Setup / demo URL
- There is no hosted URL. Run it locally:
  1. `npm install`
  2. `npm run dev` → http://localhost:3000
- Checks: `npm run lint` (type-check) and `npm run build`.
- Optional sanity scripts (no test framework in the repo), run with `npx tsx`:
  `src/lib/variants.check.ts`, `priceValidation.check.ts`, `bulkPricing.check.ts`, `priceImport.check.ts`, `productForm.check.ts`.
- Walkthrough: [CLIENT-DEMO-SCRIPT.md](CLIENT-DEMO-SCRIPT.md). Scope and phases: [README.md](README.md).
- `package-lock.json` is not committed; the repo owner should decide whether to add one.

## What the demo shows
Price Manager (quick edit, bulk update, draft → review → publish, undo), CSV template/export/import with a dry-run preview,
product variants with SKU/price/stock, Products (add, edit, duplicate, archive), Inventory (set/add/remove stock with reasons
and a log), Price History with a restore action, and a reset. Published changes appear on the storefront without a reload.

## What is simulated (and flagged DEMO in the UI)
Checkout and payments, order milestones, email/SMS previews, role switching (no real login), analytics figures, sample
stock, promotions, warranties, delivery times, and shop contact details. Nothing here is a real offer, approval,
authorization or transaction.

## Persistence (browser-only)
Data lives in this browser's `localStorage` (about 5 MB), per browser profile and per address. Keys:
`y5hut_products_v4`, `y5hut_orders_v3`, `y5hut_clients_v3`, `y5hut_user_v3`, `y5hut_wishlist_v3`, `y5hut_currency_v3`,
`y5hut_stock_log_v1`, `y5hut_price_history_v1`, `y5hut_demo_data_version`. It does not sync between devices or browsers,
and clearing site data erases it.

## How to reset
In Admin use **Reset demo data** (top banner or Overview) and confirm. It restores the sample products, orders, clients,
and clears the price history, stock log and cart, for this browser only. Alternatively clear the site's storage in browser
dev tools.

## Known limitations
- No authentication or authorization. The role switcher is a UI simulation and is not security.
- Price history and stock log are plain local data: not tamper-proof, no real user identity, capped at 500 / 200 entries.
- USD display prices are illustrative and never derived from LKR. The hero banner prices are static.
- Undo is for the most recent publish only and is lost on refresh. Restore (Price History) is per variant.
- Orders store the prices at purchase time; later price changes never rewrite them. Cart lines are re-priced on publish.
- Sample orders/analytics/clients are static mock data. The catalog's category tabs are a fixed list.
- CSV: UTF-8 CSV only (no `.xlsx`), up to 1 MB. Excel can drop leading zeros from number-like SKUs; format the column as Text.
- Edge cases in the browser UI were checked by reading the code and by rendering each screen on the server; the interactive
  flows should be clicked through once before a client meeting.

## What a real, paid production version would need (not built here)
- **Backend and database** (products, variants, orders, price/stock history) with migrations and backups.
- **Authentication and authorization**: real staff accounts, roles enforced on the server, session security, audit logging.
- **Cross-device sync and multi-user safety**: concurrent edits, conflict handling, optimistic locking.
- **Real inventory**: stock movements tied to orders and returns, supplier receiving, multi-location if needed.
- **Payments and checkout**: a payment gateway (e.g. cards, installment providers), webhooks, refunds, tax/invoicing, order
  management and a tamper-proof audit trail.
- **Notifications**: real email/SMS providers, templates, delivery tracking.
- **Currency**: a real LKR/USD policy and rate source if USD is shown.
- **Catalogue content and legal**: real product data, images, warranty/approval claims verified with the actual shop and
  brands, privacy policy and terms.
- **Engineering**: automated tests, CI/CD, monitoring, accessibility and performance audits, secrets management, hosting.
