# Client Demo Script (5–7 Minutes)

> **DEMO MODE — data is stored only in this browser.** Everything below is a concept preview with sample data.
> Roles are simulated, checkout is simulated, enquiry messages are simulated, and nothing is sent to any external server.

---

## Pre-Flight Checklist (Before the Client Meeting)

1. Open your terminal in the project directory and start the local development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in Google Chrome or Safari.
2. **Clean slate:** In the header, click **Owner Console** (or **Admin**).
3. In the top amber bar, click **Reset demo data**, and confirm in the dialog. This guarantees your sample catalog matches this script with 100% precision.
4. **Mobile demonstration:** You can demonstrate either on a physical phone on the same Wi-Fi network (using the Vite network IP shown in your terminal) or by opening Chrome DevTools (`F12` or `Cmd+Option+I`) and selecting **iPhone 14/15 Pro (390px)** or **iPhone SE (375px)**.

---

## 5–7 Minute Walkthrough Agenda

| Time | Stop | Action | Key Talking Point for Shop Owner |
| :--- | :--- | :--- | :--- |
| **0:00–0:45** | **Storefront & Problem Context** | Browse Home & Catalog | "Right now, your customers message you asking for daily prices because websites take too long to update. Here's how Y5Hut solves that." |
| **0:45–1:45** | **Single Price Edit** | Change iPhone 15 price by Rs. 4,000 | "Update any phone price in 15 seconds. It updates on your customer's screen immediately without calling a developer." |
| **1:45–2:45** | **Multi-Variant Bulk Update** | Discount Apple models by Rs. 2,000 | "Supplier price changes? Tick 5 variants and adjust them all by a fixed amount or percentage with a safety preview." |
| **2:45–4:00** | **Excel CSV Import** | Import weekly supplier CSV sheet | "Have a supplier price sheet in Excel? Export your prices, update them, and drag-and-drop the CSV. Errors are caught before publishing." |
| **4:00–4:45** | **Quick Stock Adjustment** | Set Xiaomi 14T stock to 0 | "Sold a phone in-store? One tap adjusts inventory and marks the phone 'Sold Out' so you never oversell." |
| **4:45–5:30** | **Price Audit & One-Tap Restore** | Inspect History & Restore | "Every change is logged with previous price, date, and user. Made a mistake? Hit Restore and the old price is back." |
| **5:30–6:00** | **Wrap Up & Q&A** | Refresh browser | "Everything stays in sync across your browser. Clean, fast, and built specifically for Sri Lankan phone retail." |

---

## Step-by-Step Script

### 1. Open the Owner Console (≈30 s)
1. On desktop: In the top navigation, click the bold **Owner Console (MANAGE PRICES)** button.
   *(On mobile: Tap the hamburger menu in the top right, then tap **Owner Console: Manage prices in seconds**).*
2. If you see the "Role simulation" gate, click **Simulate as Super Admin**. Mention: *"This is a simulated demo role for testing permissions without needing a complex password during our presentation."*
3. Point out the amber **DEMO ENVIRONMENT** banner and the quick-action tiles.

### 2. Change One Phone's Price (≈60 s)
1. Navigate to **Price Manager** (first primary menu item).
2. In the search box, type `APL-IP15-128GB-B` (or type `iPhone 15`).
   - *Current price:* **Rs. 245,000** (128GB / Blue).
3. In the **New price** input box, enter `249000`.
4. Point out the amber **Unsaved Changes** bar showing the previous price (`245,000`), new price (`249,000`), and `+1.6%` shift.
5. Click **Review Changes (1)**, verify the draft modal, and click **Publish 1 Change**.
6. In the top bar, click **View storefront**:
   - Scroll to **Apple iPhone 15** in the catalog (or search `iPhone 15`).
   - The active price displays **Rs. 249,000** immediately without reloading the page!

### 3. Filter by Brand & Bulk-Update (≈60 s)
1. Head back to **Owner Console → Price Manager**.
2. Click the **Apple** brand filter pill. Point out: *"Filtering by brand only filters your view; it never alters any price."*
3. Tick the checkboxes for two or three variants (e.g. `APL-IP16PM-256GB-DT` and `APL-IP16PM-512GB-DT`).
4. In the bottom bulk actions toolbar:
   - Select **Decrease by Rs.** from the dropdown.
   - Enter `2000` in the amount box.
   - Click **Preview changes**.
5. Show the before/after preview card, whole-rupee rounding note, and click **Stage Changes as Draft**.
6. Click **Review Changes → Publish**. Emphasize: *"Only the checked variants were modified. Nothing else was touched."*

### 4. Import a Weekly Supplier CSV (≈60 s)
1. Navigate to **Owner Console → Import / Export**.
2. Mention: *"This is built for shop owners who manage prices in Excel. We provide a sample CSV matching weekly supplier imports."*
3. Click **Import CSV** and select `public/demo/y5hut-sample-price-update.csv` (or click the sample download link on the page).
4. Review the Dry Run Preview:
   - **Summary Tiles:** 6 rows total, 2 will change, 2 unchanged, 1 invalid (`abc`), 1 unknown SKU (`APL-IP99`).
   - **Mobile Cards / Table:** Point out how the invalid row clearly flags the formatting error and allows the owner to fix the number inline.
5. Click **Apply 2 Price Updates to Store**. Notice that only the 2 valid rows apply; stock quantities are completely untouched.

### 5. Adjust Stock in Seconds (≈45 s)
1. Navigate to **Owner Console → Inventory**.
2. Search for `XIA-14T` (Xiaomi 14T).
3. Click **Adjust** on `XIA-14T-256GB-TB`.
4. On mobile or desktop, the **Adjust Stock** bottom sheet opens.
5. Tap the quick preset button **Set 0** (or enter `-3`), pick reason **Store sale**, and point to the live preview:
   - *"Stock Preview: 3 → 0 units | Storefront shows: ● Out of Stock"*
6. Click **Save Stock**.
7. Switch to the storefront: Xiaomi 14T now immediately shows a **Sold Out** badge.

### 6. Inspect Price History & Restore (≈45 s)
1. Navigate to **Owner Console → Price History**.
2. Show the chronological audit entries displaying:
   - Product name and Space Mono SKU (`APL-IP15-128GB-B`).
   - Previous price (`Rs. 245,000`) strikethrough → New price (`Rs. 249,000`).
   - Timestamp and simulated staff member (`Super Admin`).
3. Click **Restore Previous Price** on the iPhone 15 row.
4. Confirm in the modal. Point out: *"Restoring does not delete history—it records a new restore transaction and resets the price on the storefront."*

### 7. Wrap Up & Key Talking Points
- **Repeatability:** Refresh the page to demonstrate that all changes remain saved in local browser storage.
- **Honest Prototype Notice:** Remind the owner:
  - *"All products, prices, and orders shown here are sample demo records."*
  - *"WhatsApp enquiries open a structured draft message with product details; no message is sent automatically without owner approval."*
  - *"In a live production deployment, this owner console connects to a secure cloud database with individual staff logins and multi-device sync."*

---

## Recovery Steps During Live Demo

- **If numbers look unexpected:** Click **Owner Console → Reset demo data**, confirm, and start the step again.
- **If a price won't publish:** Look for a red-bordered row with an invalid price string, or check the `>25% shift` confirmation checkbox if adjusting by a large amount.
- **If you lose your place:** Click the top-left **y5Hut.lk** logo to return to the public storefront, or click **Owner Console** in the top navigation.
