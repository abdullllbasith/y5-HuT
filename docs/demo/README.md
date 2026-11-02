# y5Hut Demo — Smart Price Manager & Mobile Tech Storefront

> **DEMO MODE — data is stored only in this browser.**
> This is a concept demonstration built for pitch presentations to a mobile phone shop owner, not a live production store.

---

## 1. Objective & Value Proposition

Mobile phone shops in Sri Lanka change prices on dozens of models multiple times a week based on supplier imports and exchange rate fluctuations. Updating an e-commerce website manually often takes hours, leading shops to rely solely on messaging apps.

This project demonstrates **y5Hut Smart Price Manager**: a retail shop template and merchant console simple enough for an owner to master in 5 minutes:
- **Instant Price Updates:** Change a single price or bulk-adjust 20 models by Rs. or % in seconds.
- **Immediate Storefront Sync:** Published price shifts reflect on the customer-facing storefront in the same browser instantly without server rebuilds.
- **Excel CSV Import/Export:** Export the active price sheet, update it in Excel, and re-import with a clear dry-run preview and inline validation.
- **Fast Mobile Inventory:** Rapid one-tap stock adjustments (+1, +5, -1, Set 0) with automatic sold-out status enforcement.
- **Audit & Restore:** Complete price change history with a one-click restore that reverts mistakes safely.
- **Modern Responsive Storefront:** Apple-inspired visual rhythm, clean typography, dynamic hero banners, end-to-end search, and safe WhatsApp customer enquiry prototyping.

---

## 2. Quickstart

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev
# Open http://localhost:3000 in your browser

# 3. Quality & Type Checking
npm run lint    # Runs tsc --noEmit (0 errors)
npm run build   # Production Vite build

# 4. Run Logic & Safety Verification Suites
npx tsx src/lib/variants.check.ts
npx tsx src/lib/priceValidation.check.ts
npx tsx src/lib/bulkPricing.check.ts
npx tsx src/lib/priceImport.check.ts
npx tsx src/lib/productForm.check.ts
```

---

## 3. Demo Documentation Suite

- [CLIENT-DEMO-SCRIPT.md](CLIENT-DEMO-SCRIPT.md) — 5–7 minute step-by-step walkthrough script for desktop and mobile presentations.
- [CLIENT-PRESENTATION-CHECKLIST.md](CLIENT-PRESENTATION-CHECKLIST.md) — Pre-meeting checklist, presenter talking points, and recovery steps.
- [DEMO-TEST-RESULTS.md](DEMO-TEST-RESULTS.md) — Full test execution log and responsive viewport verification matrix.
- [HANDOFF.md](HANDOFF.md) — Architectural overview, feature-by-feature demo vs production matrix, and production roadmap.
- [PHASE-11-MOBILE-WORKFLOWS.md](PHASE-11-MOBILE-WORKFLOWS.md) — Mobile CSV import cards, form wizards, and bottom-sheet stock dialog verification.
- [PHASE-10-CUSTOMER-EXPERIENCE.md](PHASE-10-CUSTOMER-EXPERIENCE.md) — End-to-end search, dynamic hero pricing, and WhatsApp enquiry prototype.
- [PREMIUM-UIUX-REDESIGN.md](PREMIUM-UIUX-REDESIGN.md) — Unified design system specifications and mobile visual architecture.

---

## 4. Key Demo Controls & Reset

- **Reset Demo Data:** Available in the top amber demo bar inside the Owner Console or on the Overview page. Restores the sample catalog, variants, mock orders, and clears price/stock logs in this browser.
- **Role Switcher:** Available in the top announcement bar to preview how different staff roles (Super Admin, Inventory Manager, Sales Rep, Customer) experience the system.
- **WhatsApp Enquiry:** Click "Ask on WhatsApp" on any product card or detail modal to preview the structured enquiry text that customers would send.
