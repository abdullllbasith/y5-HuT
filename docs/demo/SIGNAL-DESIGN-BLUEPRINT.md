# Y5 SIGNAL / Precision Tech Showroom — Design Blueprint & Foundation
**Document Version:** 2.0.0 (Stage 01 Foundation)  
**Date:** November 2026  
**Repository:** https://github.com/abdullllbasith/y5-HuT.git  
**Target:** Client Pitch Demonstration (Sri Lankan Mobile & Accessories Retailer)

---

## 1. Executive Summary & Brand Identity

### The Core Brand Idea
> **"Discover the device. See the details. Know the price."**

Y5Hut is a modern Sri Lankan retail electronics showroom. The previous prototype iteration leaned heavily into a retro paper-and-receipt concept ("The Hang-Tag Counter") with cream parchment, Fraunces serif type, punched tag holes, thermal receipt zigzags, and hard black offset shadows. While creative, this treatment obscured product photography, overwhelmed the interface with decorative visual noise, and caused usability frictions on mobile viewports.

**Y5 SIGNAL** reimagines the platform into a high-confidence consumer tech showroom for shoppers and a streamlined, high-speed pricing/inventory workstation for the shop owner.

---

## 2. Five Core Design Principles (Derived from References)

1. **Quiet Staging & Hero Hardware (Apple Shop & Nothing Tech)**
   - Devices are framed against neutral porcelain (`#F6F8F9`) or crisp white (`#FFFFFF`) stages with subtle lighting.
   - Hardware photography is the focal point, occupying 50–60% of card height. Device images are never subordinated to decorative badges or labels.
2. **The Signal Spine (Restrained Brand Accent)**
   - Y5Hut's signature red (`#E10600`) is used purposefully: a vertical active marker, selection spine, primary action callout, or price drop delta. It is never sprayed gratuitously across backgrounds.
3. **Precision Metadata, Zero Clutter (Linear & Vercel Interface Guidelines)**
   - Monospace typography (`JetBrains Mono`) is reserved strictly for tabular numbers, SKUs, and storage tags.
   - Badges and tags are small, high-contrast, rounded pills with functional meaning (e.g. `128GB`, `256GB`, `Low Stock`, `Out of Stock`) rather than slanted stickers.
4. **Split Personality, Unified System (Shopify 2026 Admin Architecture)**
   - Customer-facing surfaces are airy, editorial, and exploratory.
   - Merchant-facing surfaces (Owner Console) are calm, dense, and task-driven.
   - Both share identical tokens, spacing, typography, and form control standards.
5. **Mobile-First Scannability & Real 44px Touch Targets (Baymard Institute)**
   - Every primary interactive control meets or exceeds 44×44px with comfortable spacing.
   - Product titles allow two lines of readable text with graceful clamping.
   - No forced multi-column grids below 360px if legibility is compromised.

---

## 3. UI/UX Audit & Prioritized Issue Inventory

| ID | Priority | Surface | Issue Description | Signal Resolution |
| :--- | :--- | :--- | :--- | :--- |
| **AUD-01** | **P0** | Product Card | Small touch targets: Wishlist button was ~28px, color swatches ~10px, Add to Bag 34–38px. | Enforce minimum 44px touch targets on mobile; size wishlist button to 36–40px with generous hit area; color dots to 14–16px. |
| **AUD-02** | **P0** | Product Card | Variant disconnect: Tapping a color dot updated the image preview, but Add to Bag silently added the default variant. | Make variant selection semantically bind to the actual item or route explicitly to Product Detail modal for multi-variant items. |
| **AUD-03** | **P0** | Storefront | Decorative overload: Paper grain filter, thermal receipt zigzags, hole punches, and hard shadows created visual noise. | Eliminate noise textures and hard black offset shadows; replace with clean hairline borders (`#DFE5E9`) and natural elevation shadows. |
| **AUD-04** | **P1** | Typography | Fraunces serif typeface gave an antiquarian / boutique feel rather than a precision electronics showroom. | Standardize on modern geometric sans (`Hanken Grotesk` / `Inter`) with `JetBrains Mono` for tabular pricing and data. |
| **AUD-05** | **P1** | Global Navigation | Disorienting view transitions between Storefront and Owner Console. | Clear, persistent top header toggle with explicit status badge (`[🛡️ Admin]` / `[🏪 Store]`). |
| **AUD-06** | **P1** | Storefront | Unwarranted marquee animations and perpetual pulsing effects. | Restrain motion: remove perpetual motion marquees, honor `prefers-reduced-motion`, use subtle 120–160ms micro-interactions. |
| **AUD-07** | **P2** | Copy & Disclosures | Misleading labels ("Synced", "Live counter drop", "Verified buyer"). | Replace with truthful local-only demo disclosures: "Updated in this browser", "Sample customer review", "Concept demonstration". |

---

## 4. Product Card Proposals: Comparison & Selection

### Direction A: The Frameless Gallery Tile
- *Concept*: Edge-to-edge transparent product photography with floating text overlays and minimalist hover actions.
- *Pros*: Extremely striking in large desktop grid formats.
- *Cons*: Fails on mobile screens (320px–375px) where text overlay obscures hardware, and inventory metadata becomes difficult to scan.

### Direction B: The Precision Inventory Card (**SELECTED WINNER**)
- *Concept*: A structured, cool-porcelain device stage (`#EDF1F3`) occupying ~55% of the card height, framed by a delicate hairline (`#DFE5E9`).
- *Anatomy*:
  1. **Top utility bar**: Single informative pill (e.g., brand, model status) + 36px wishlist action.
  2. **Device stage**: Centered high-resolution hardware render with subtle elevation; no text clipping.
  3. **Product identity**: 2-line title in clean geometric sans, followed by available storage chips.
  4. **Pricing stub**: Tabular LKR price in bold display sans; strike-through original price only if discounted; honest stock indicator dot.
  5. **Action**: Dedicated 42–44px "Add to Bag" / "Select Options" button with tactile hover and active feedback.

---

## 5. Design Tokens (Y5 Signal System)

```css
/* Color Palette */
--color-canvas:       #F6F8F9; /* Cool porcelain showroom background */
--color-surface:      #FFFFFF; /* Pure clean card/modal white */
--color-soft-surface: #EDF1F3; /* Raised input/device backplate */
--color-ink:          #101418; /* High-contrast near-black (17.5:1 on canvas) */
--color-body:         #2D3740; /* Readable deep charcoal body (10.4:1 on white) */
--color-muted:        #64717B; /* Secondary technical metadata (4.8:1 on white) */
--color-line:         #DFE5E9; /* Structural hairline borders */
--color-brand-red:    #E10600; /* Y5Hut signature red */
--color-brand-hover:  #BA0806; /* Deeper interaction red */
--color-signal-blue:  #DCECF4; /* Subtle device stage tint */
--color-positive:     #16734B; /* Stock in hand (5.5:1 on white) */
--color-warning:      #9B6200; /* Low inventory warning (4.8:1 on white) */
--color-error:        #B42318; /* Sold out / error state (5.6:1 on white) */

/* Typography Tokens */
--font-sans:  "Hanken Grotesk", system-ui, -apple-system, sans-serif;
--font-display: "Hanken Grotesk", system-ui, -apple-system, sans-serif;
--font-mono:  "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;

/* Elevation & Shadows */
--shadow-xs: 0 1px 2px rgba(16, 20, 24, 0.04);
--shadow-sm: 0 1px 3px rgba(16, 20, 24, 0.06), 0 1px 2px rgba(16, 20, 24, 0.04);
--shadow-md: 0 4px 12px rgba(16, 20, 24, 0.08), 0 2px 4px rgba(16, 20, 24, 0.04);
--shadow-lg: 0 12px 32px rgba(16, 20, 24, 0.12), 0 4px 8px rgba(16, 20, 24, 0.04);
--shadow-sheet: 0 20px 48px rgba(16, 20, 24, 0.16);
```

---

## 6. Implementation Stages & Roadmap

- [x] **Stage 01 — Design Audit & Foundation** (`feature/uiux-v2-01-foundation`): Tokens, typography, primitives, clean shells, audit blueprint.
- [ ] **Stage 02 — Signature Shopping Experience** (`feature/uiux-v2-02-storefront`): ProductCard, catalog filters, hero, bento, deals.
- [ ] **Stage 03 — Product Journey & Shopping Flow** (`feature/uiux-v2-03-shopping-flow`): Detail modal, drawers, checkout steps, micro-motion.
- [ ] **Stage 04 — Owner Console Redesign** (`feature/uiux-v2-04-owner-console`): Price Manager, CSV import, inventory, product editor.
- [ ] **Stage 05 — Performance, Accessibility & Polish** (`feature/uiux-v2-05-final-polish`): Lighthouse, responsive QA, demo script.
