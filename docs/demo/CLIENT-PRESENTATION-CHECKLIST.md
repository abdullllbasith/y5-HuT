# Client Presentation Checklist: 5–7 Minute Showcase

> **DEMO MODE — data is stored only in this browser.**
> Use this checklist before and during your presentation to a mobile phone shop owner.

---

## 1. Pre-Demo Setup (30 Minutes Before Presentation)

- [ ] **Machine & Battery:** Laptop fully charged or plugged in; display resolution at 100% scaling.
- [ ] **Local Server:** Terminal open and `npm run dev` running on `http://localhost:3000`.
- [ ] **Clean State:** In the browser, navigate to **Owner Console**, click **Reset demo data**, and confirm. Verify that `APL-IP15-128GB-B` is at Rs. 245,000.
- [ ] **Browser Prep:** Single clean browser window; close unnecessary tabs and notifications.
- [ ] **Mobile Preview Ready:**
  - *Option A (Physical phone):* Connect phone to same local Wi-Fi, open the local network IP provided by Vite (e.g. `http://192.168.1.x:3000`).
  - *Option B (Chrome DevTools):* Press `F12` or `Cmd+Option+I`, toggle Device Toolbar (`Cmd+Shift+M`), and select **iPhone 14/15 Pro (390x844)**.
- [ ] **Sample CSV File Accessible:** Ensure `public/demo/y5hut-sample-price-update.csv` is easy to select or download.

---

## 2. 5–7 Minute Walkthrough Sequence

```
0:00 ── 1. The Core Problem (Phone Shop Reality)
        "You update phone prices 3-4 times a week, but updating an online shop is painful."
0:45 ── 2. Single Price Edit (15 Seconds)
        Search "APL-IP15-128GB-B" (Rs. 245,000) -> Edit to Rs. 249,000 -> Review & Publish.
        Show storefront: Apple iPhone 15 updates to Rs. 249,000 immediately.
1:45 ── 3. Multi-Variant Bulk Update (Supplier Price Drop)
        Filter Apple -> Select 3 variants -> Decrease by Rs. 2,000 -> Preview & Stage -> Publish.
2:45 ── 4. CSV Import / Export (Managing via Excel)
        Open Import/Export -> Choose sample CSV -> Show Dry Run Preview (valid/invalid/unknown) -> Apply.
4:00 ── 5. Instant Stock Adjustment (Never Oversell)
        Inventory -> Search "XIA-14T" -> Adjust -> Tap "Set 0" (Store sale) -> Save.
        Show storefront: Xiaomi 14T immediately displays "Sold Out".
4:45 ── 6. Price Audit History & One-Tap Restore
        Price History -> Show chronological log -> Tap "Restore Previous Price" on iPhone 15 -> Reverted.
5:30 ── 7. Recap & Business Value
        Refresh browser to prove persistence -> Q&A and next steps.
```

---

## 3. Presenter Talking Points (Do's & Don'ts)

### What to Emphasize (DO):
- **Speed & Autonomy:** "You never have to call a developer, send a WhatsApp request, or wait days just to change phone prices."
- **Customer Trust:** "When prices drop in the market, your website reflects it immediately, keeping customers on your site instead of calling competitors."
- **Excel Friendly:** "If you or your suppliers already work in Excel, you don't have to learn a whole new complicated system—export to CSV, edit in Excel, and import."
- **Safety First:** "Every change has a preview before going live. If you enter an invalid number or a 30% price change, the system warns you."
- **Mobile First:** "You can manage prices, add stock, and import sheets directly from your phone while standing in your shop."

### What to Clarify Honestly (DON'T):
- **Do NOT claim real payments:** State clearly that checkout, Koko/Mintpay installments, and card payments are simulated for demonstration.
- **Do NOT claim real SMS/WhatsApp transmission:** State that the WhatsApp enquiry button formats an accurate customer enquiry text but does not send spam or message strangers.
- **Do NOT claim multi-device cloud sync:** Emphasize that in this concept prototype, data lives in the local browser; the real production version connects this exact console to a secure cloud database (Supabase/Firebase/PostgreSQL).

---

## 4. Emergency Fallback & Recovery

| Issue Encountered | Quick Recovery Action |
| :--- | :--- |
| **Catalog numbers look different from script** | Click **Owner Console → Reset demo data**, confirm, and start the sequence again. |
| **Publish button is disabled in Price Manager** | Check for a red-bordered row with an invalid price (e.g. non-numeric input) or ensure the ">25% shift" confirmation box is checked. |
| **Mobile drawer or modal won't close** | Tap anywhere outside the modal, tap the `X` button, or press `Escape` on desktop. |
| **Accidental navigation away from store** | Tap the **y5Hut.lk** logo in the top-left corner to return to the public storefront home. |
