# Client demo script (5–7 minutes)

> **DEMO MODE — data is stored only in this browser.** Everything below is a concept preview with sample data.
> Roles are simulated, checkout is simulated, and nothing is sent to any server.

**Before you start:** run `npm run dev` (opens on http://localhost:3000). Use one browser window. If you have
shown the demo before, open **Admin → Reset demo data** and confirm, so the numbers match this script.

## 1. Open the owner console (≈30 s)
1. On the storefront, click **Admin** in the top navigation.
2. If you see the "Role simulation" screen, click **Simulate as Super Admin**. This is a *simulated demo role*, not a
   real login. There is no password in this demo.
3. Point out the amber **DEMO MODE** banner and the "Simulated role" chip.

## 2. Change one phone's price (≈60 s)
1. Menu → **Price Manager**. In search type `APL-IP15-128GB-B` (iPhone 15, 128GB, Blue, sample price Rs. 245,000).
2. Click the **New price** box, type `249000`, and note the amber "Unsaved" row with the old → new preview.
3. Click **Review Changes**, then **Publish 1 Change**.
4. Click **View storefront**, find *Apple iPhone 15*; the 128GB Blue price is now Rs. 249,000.

## 3. Filter by brand (≈30 s)
Back in Price Manager click the **Samsung** chip. Only Samsung variants are listed. Point out that choosing a brand only
*filters*; it never edits anything. Click **All brands**.

## 4. Bulk-update variants (≈60 s)
1. Click the **Apple** chip, tick three Apple variants (or **Select visible** if you want them all).
2. In the bulk bar choose **Decrease by Rs.**, type `2000`, click **Preview changes**.
3. Show the before / after / difference table and the whole-rupee rounding note, then **Stage … as draft**.
4. **Review Changes → Publish**. Only the ticked variants changed.

## 5. Import a CSV price list (≈60 s)
1. Menu → **Import / Export**. Mention "Works with CSV files saved from Excel".
2. Optionally click **Export Current Price List** to show what owners would open in Excel.
3. Click **Import CSV** and choose `public/demo/y5hut-sample-price-update.csv` (also linked on the page).
4. Read the dry run: 2 will change, 2 unchanged, 1 invalid price, 1 unknown SKU. Nothing has changed yet.
5. Click **Apply Valid Price Updates (2)**. Only the two valid rows change; stock is never touched by an import.

## 6. Adjust stock (≈45 s)
1. Menu → **Inventory**, search `XIA-14T`, click **Adjust** on a variant.
2. Choose **Set exact stock**, enter `0`, pick the reason *Store sale*, and note the preview
   "Stock N → 0, Storefront will show: Out of Stock". Save.
3. Open the storefront: that variant now shows as out of stock. The adjustment appears in the **Recent stock adjustments** log.

## 7. Add a phone (≈60 s)
1. Menu → **Products → Add new model**. Name `Demo Phone X`, brand `Apple` (or type a new brand).
2. Add two variants (for example `128GB / Black` and `256GB / Black`) with unique SKUs, prices and stock.
3. Click **Publish demo product**. Find it on the storefront and in the brand filters.
4. Optional: **Archive** it to show that products are hidden, never deleted.

## 8. Inspect price history and restore (≈45 s)
Menu → **Price History**. Show each change with previous price, new price, time, source (Quick edit, Bulk update, CSV import)
and the demo staff label. Click **Restore previous** on the iPhone 15 row, confirm, and note that it changes only that one
variant and appears as a *new* history entry. State clearly that this log is a demo, **not a secure audit trail**.

## 9. Refresh and wrap up (≈30 s)
Refresh the page. Prices, stock, the new phone and the history are all still there, because they are saved in this browser.
Open the site in a different browser (or a private window) to show that it starts from the original sample data.

## Things to say out loud
- Prices, stock, promotions, warranty, delivery and contact details are **sample content**.
- Checkout, emails/SMS, analytics and roles are **simulated**.
- A real version needs a backend, real login, and so on; see [HANDOFF.md](HANDOFF.md).

## If something goes wrong
- Unexpected numbers → **Admin → Reset demo data**.
- A price will not publish → look for a red row (invalid price) or the "large change" checkbox in the review step.
