# Phase 08 — Mobile admin dashboard

> **DEMO MODE — data is stored only in this browser.**

## Summary of changes

- **Bottom navigation on phones and tablets** (`MobileNav.tsx`): Home, Prices, Products and More. More opens a bottom sheet with the remaining pages (Inventory, Price History, Import / Export, and the demo modules). The desktop sidebar is unchanged and shows at 1024px and up.
- **Layout:** the admin page has bottom padding so content is not hidden behind the bottom bar. The demo banner is shorter on phones. The "View storefront" button and the reset button move into the More sheet on phones.
- **Price Manager, phones:** cards are grouped by model and show one variant per card. Each card has a 48px selection tap target, the variant and SKU, the current price, a large LKR input (48px), stock status, and the change summary.
- **Action dock:** the bulk bar and the draft bar stack above the bottom navigation, with safe-area padding. The page adds a spacer so the last rows can scroll clear. Desktop keeps the sticky draft bar.
- **Draft bar:** Discard Draft and a single primary "Review & Publish (N)" button. The button opens the same confirmation as before.
- **Review:** a bottom sheet on phones, with the publish button at the bottom. Escape closes it, and it focuses "Back to editing" on open.
- **Filters:** brand chips scroll sideways inside their own strip, so the page never scrolls sideways. Search has a clear button. Model and category selects are full-width on phones.
- **Overview:** the three quick actions are now Change Prices, Add Product and Update Stock. On phones they are tap rows with icons. The stat cards are two-up on phones.

Preserved, not changed: price validation, bulk selection and preview, the large-change confirmation, publish and undo, the desktop table, reset, and all demo notices.

## Tests

- **Build and types:** `npm run lint` (type-check) and `npm run build` pass.
- **Check scripts:** `variants`, `priceValidation`, `bulkPricing`, `priceImport` and `productForm` all report zero failures.
- **Browser walkthrough** (headless Chrome, scripted over the DevTools protocol against the dev build, 92 checks):
  - Widths 320, 360, 375, 390 and 430px:
    - no horizontal overflow on Home, Prices and at the end of the flow;
    - the bottom bar shows Home, Prices, Products and More, and More opens and closes with Escape;
    - an invalid price shows an error and blocks publish;
    - a bulk bar and the draft bar sit above the bottom bar with no overlap;
    - the review opens as a bottom sheet;
    - a publish writes to localStorage and shows the success message;
    - Undo restores the original price;
    - Discard clears the draft.
  - 768px tablet: bottom navigation shown, no overflow.
  - 1024px and 1440px desktop: the sidebar is shown, there is no bottom bar, the table is visible, a single edit publishes, and undo works.
  - No console errors were reported.

## Limitations

- Screenshots were not reviewed. The checks above are scripted DOM and geometry checks, not a visual review; a person should look at 320px and 390px before a client meeting.
- The navbar's LKR/USD currency toggle is about 33px tall on phones. It belongs to the storefront header, not the admin, and was left as is.
- The More sheet is not a full focus trap. It closes on Escape and on the backdrop, but Tab can move behind it.
- The draft bar keeps the Phase 3 behaviour where the review step is the only publish path; no change was made to publish logic.
- Only the Price Manager was restyled for phones in depth. Products, Inventory, Price History and Import/Export use the existing responsive layouts.
