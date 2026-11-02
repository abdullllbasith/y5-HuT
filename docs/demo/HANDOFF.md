# Handoff: y5Hut Smart Price Manager & Retail Storefront Demo

> **DEMO MODE — data is stored only in this browser.** This is a concept demonstration for pitching to a mobile phone shop owner, not a live production store.

---

## 1. Quickstart & Local Setup

- **Requirements:** Node.js 18+ and npm (or pnpm).
- **Run locally:**
  ```bash
  npm install
  npm run dev
  # Server starts on http://localhost:3000 (accessible on local network at your host IP)
  ```
- **Build & Quality Checks:**
  ```bash
  npm run lint       # TypeScript strict type check (0 errors)
  npm run build      # Production client build via Vite
  ```
- **Verification Scripts:**
  ```bash
  npx tsx src/lib/variants.check.ts
  npx tsx src/lib/priceValidation.check.ts
  npx tsx src/lib/bulkPricing.check.ts
  npx tsx src/lib/priceImport.check.ts
  npx tsx src/lib/productForm.check.ts
  ```

---

## 2. Feature & Architecture Matrix

| Capability | Demonstration Status | Real Production Equivalent Needed |
| :--- | :--- | :--- |
| **Single Price Edit** | **Fully Interactive in Browser.** Edits stage, preview, publish, and reflect instantly on public catalog, hero, and cart without reload. | API endpoint + PostgreSQL/Firestore write with optimistic locking. |
| **Multi-Variant Bulk Update** | **Fully Interactive in Browser.** Filter by brand/model, select items, adjust by amount (+/− Rs.) or %, whole-rupee rounding, safety warning on >25% shifts. | Batch update query with transactional rollback and staff audit logs. |
| **CSV Import / Export** | **Fully Interactive in Browser.** Export active prices to CSV; import supplier CSV with dry run, inline error corrections, and exclusion toggles. Rejects null bytes, protects formula injection. Friendly `.xlsx` guidance. | Background worker parsing spreadsheet files on S3/GCS with schema validation. |
| **Inventory Management** | **Fully Interactive in Browser.** Quick preset adjustments (+1, +5, +10, −1, −5, Set 0), reasons, before/after preview, storefront sold-out badge enforcement, stock movement log. | Multi-warehouse inventory system synced with barcode scanners and point-of-sale. |
| **Product & Variant Form** | **Fully Interactive in Browser.** Step-by-step form wizard (Model details → Variants with Storage/Color/SKU/Price/Stock → Publish/Archive). Prevents duplicate SKUs. | Admin CMS with image asset upload to CDN, S3/Cloud Storage, and slug generator. |
| **Price History & Restore** | **Fully Interactive in Browser.** Chronological log of price shifts with previous/new values, timestamps, and staff roles. One-tap restore generates a new append-only audit event. | Immutable SQL append-only ledger or event store with cryptographic audit trail. |
| **Customer Storefront** | **Fully Interactive & Responsive.** Dynamic hero, hot deals derived from active state, mobile-first product cards, product details modal, end-to-end keyword and category search. | Edge-cached SSR/SSG storefront with SEO meta tags and CDN caching. |
| **WhatsApp Customer Enquiry** | **Interactive Prototype.** Click opens clean message preview with formatted model, storage, color, SKU, and price. Supports `VITE_DEMO_WHATSAPP_NUMBER` env variable. Never sends automated spam. | Official WhatsApp Business API / Cloud API integration with webhook auto-responder. |
| **Customer Checkout** | **Simulated Demo Flow.** Step-by-step modal (Shipping → Installments/Card → Confirmation) with client-side stock deduction and mock email preview. | Payment gateway (Stripe, PayHere, Koko/Mintpay merchant API) with webhook webhooks. |
| **User Roles & Security** | **Simulated Demo Roles.** Role switcher (Super Admin, Inventory Manager, Sales Rep, Customer) for testing UI gating. No passwords required. | Real authentication (OAuth / JWT / Supabase / Clerk) with row-level security. |
| **Data Persistence** | **Browser LocalStorage.** Keys: `y5hut_products_v4`, `y5hut_orders_v3`, `y5hut_clients_v3`, `y5hut_user_v3`, `y5hut_stock_log_v1`, `y5hut_price_history_v1`. Stable across reloads. | Persistent cloud database with daily backups and multi-region replication. |

---

## 3. Demo Limitations (Disclose Honestly to Client)

1. **Browser-Isolated State:** Data changed in one browser window will not appear on another person's device unless they share the same physical browser profile. Clearing site data returns the app to seed values.
2. **Simulated Security:** The role switcher is a visual demonstration aid. There are no stored passwords or server-side permission checks.
3. **Illustrative Currency & Financing:** All transactions and admin operations operate in Sri Lankan Rupees (LKR). When toggled to USD, values are illustrative estimates. Koko 3-month installment calculations are shown for concept demonstration.
4. **Mocked Orders & Analytics:** The initial order records and sales graphs are static sample metrics provided to illustrate how a reporting dashboard would look once connected to a sales database.
5. **CSV Format:** Only `.csv` text files are parsed in-browser. Standard Excel `.xlsx` binary files are detected and prompt a friendly reminder to use **"File" → "Save As" → "CSV"**.

---

## 4. Production Roadmap (What to Build After Owner Buys In)

1. **Phase 1: Cloud Backend & Auth:** Connect to Supabase or Firebase for real PostgreSQL database, JWT authentication, and row-level security.
2. **Phase 2: Real WhatsApp & SMS Integration:** Connect the WhatsApp enquiry prototype to the shop's verified Meta WhatsApp Business Account for automated customer lead capture.
3. **Phase 3: Payment Gateway & Invoicing:** Integrate Sri Lankan payment gateways (e.g. PayHere, direct Koko/Mintpay merchant API) with automated PDF receipt generation.
4. **Phase 4: Physical Store Barcode Sync:** Link the web inventory module to the shop's physical barcode scanner or existing POS software.
