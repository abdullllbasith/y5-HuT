import React from 'react';
import {
  ArrowRight,
  Tags,
  Smartphone,
  Boxes,
  Package,
  AlertTriangle,
  FileSpreadsheet,
  Clock,
  TrendingDown,
  Receipt as ReceiptIcon,
} from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { ResetDemoButton } from '../ResetDemoButton';
import { Dot } from '../../ui/Dot';

export const OverviewPage: React.FC = () => {
  const { products, orders, priceHistory, lastPublish, setActiveAdminTab, currency } = useStore();

  const inStock = products.filter((p) => p.stock > p.lowStockThreshold).length;
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= p.lowStockThreshold).length;
  const outOfStock = products.filter((p) => p.stock === 0).length;

  const totalCatalogUnits = products.reduce((sum, p) => sum + p.stock, 0);
  const totalRevenueLKR = orders.reduce((sum, o) => sum + o.totalLKR, 0);

  const recentChanges = priceHistory.slice(0, 5);

  return (
    <div className="space-y-6 text-left font-ui">
      
      {/* 1. HERO QUICK ACTIONS: "CHANGE PRICES" (Solid Red 2x2 Tile) + PAPER TILES */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        
        {/* Solid Red 2x2 Hero Tile */}
        <button
          type="button"
          onClick={() => setActiveAdminTab('price-manager')}
          className="md:col-span-7 bg-red hover:bg-red-ink text-white rounded-3xl p-6 sm:p-8 text-left transition-all duration-200 cursor-pointer flex flex-col justify-between group shadow-hard relative overflow-hidden min-h-[220px]"
        >
          {/* Giant Tag Silhouette Background Accent */}
          <Tags
            className="absolute -right-6 -bottom-6 w-44 h-44 text-white/10 pointer-events-none group-hover:scale-110 transition-transform duration-500"
            aria-hidden="true"
          />

          <div className="flex items-start justify-between relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/20 border border-white/20 flex items-center justify-center text-white">
              <Tags className="w-6 h-6" />
            </div>
            <span className="font-data text-[10px] uppercase font-black tracking-widest bg-white/20 text-white px-3 py-1 rounded-full border border-white/30">
              Priority 01
            </span>
          </div>

          <div className="my-4 space-y-1 relative z-10">
            <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
              Change Counter Prices
            </h3>
            <p className="font-ui text-xs sm:text-sm text-white/85 leading-relaxed max-w-sm">
              Stage quick or bulk rupee adjustments with visual sanity checks, live storefront sync, and instant undo.
            </p>
          </div>

          <div className="pt-4 border-t border-white/20 flex items-center justify-between text-xs font-bold text-white relative z-10">
            <span className="font-data">
              {lastPublish
                ? `Last synced at ${new Date(lastPublish.at).toLocaleTimeString()}`
                : 'Ready to stage daily price sheet'}
            </span>
            <div className="flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
              <span>Open Price Manager</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </button>

        {/* Right Stack of 3 Action Tiles */}
        <div className="md:col-span-5 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-1 gap-3">
          {/* Add Product */}
          <button
            type="button"
            onClick={() => setActiveAdminTab('products')}
            className="bg-card hover:bg-paper-sunk rounded-2xl border border-line p-4 text-left transition-all cursor-pointer flex items-center justify-between group shadow-hard-sm min-h-[58px]"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-paper border border-line flex items-center justify-center text-ink shrink-0">
                <Smartphone className="w-4 h-4 text-red" />
              </div>
              <div>
                <h4 className="font-ui font-bold text-sm text-ink group-hover:text-red transition-colors">
                  Add Device
                </h4>
                <span className="font-data text-[10px] text-ink-soft">New phone or accessory SKU</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-ink-soft group-hover:text-red group-hover:translate-x-1 transition-all" />
          </button>

          {/* Audit Stock */}
          <button
            type="button"
            onClick={() => setActiveAdminTab('inventory')}
            className="bg-card hover:bg-paper-sunk rounded-2xl border border-line p-4 text-left transition-all cursor-pointer flex items-center justify-between group shadow-hard-sm min-h-[58px]"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-paper border border-line flex items-center justify-center text-ink shrink-0">
                <Boxes className="w-4 h-4 text-go" />
              </div>
              <div>
                <h4 className="font-ui font-bold text-sm text-ink group-hover:text-red transition-colors">
                  Adjust Inventory
                </h4>
                <span className="font-data text-[10px] text-ink-soft">Edit variant counts &amp; logs</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-ink-soft group-hover:text-red group-hover:translate-x-1 transition-all" />
          </button>

          {/* Import CSV */}
          <button
            type="button"
            onClick={() => setActiveAdminTab('import-export')}
            className="bg-card hover:bg-paper-sunk rounded-2xl border border-line p-4 text-left transition-all cursor-pointer flex items-center justify-between group shadow-hard-sm min-h-[58px]"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-paper border border-line flex items-center justify-center text-ink shrink-0">
                <FileSpreadsheet className="w-4 h-4 text-ink" />
              </div>
              <div>
                <h4 className="font-ui font-bold text-sm text-ink group-hover:text-red transition-colors">
                  Import CSV Price Sheet
                </h4>
                <span className="font-data text-[10px] text-ink-soft">Bulk supplier spreadsheet</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-ink-soft group-hover:text-red group-hover:translate-x-1 transition-all" />
          </button>
        </div>

      </div>

      {/* 2. PAPER KPI TILES: Revenue, Orders, Stock Alerts with Fraunces Numerals */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Total Catalog Models */}
        <div className="bg-card rounded-2xl border border-line p-4 sm:p-5 shadow-hard-sm">
          <div className="flex items-center justify-between text-ink-soft">
            <span className="font-data text-[10px] uppercase font-bold tracking-wider">Catalog Models</span>
            <Package className="w-4 h-4 text-ink" />
          </div>
          <div className="mt-2 font-display text-3xl sm:text-4xl font-extrabold text-ink tabular-nums">
            {products.length}
          </div>
          <div className="mt-1 font-data text-xs text-go font-semibold flex items-center gap-1.5">
            <Dot tone="go" size="xs" />
            <span>{totalCatalogUnits} Total units in store</span>
          </div>
        </div>

        {/* Low Stock (Highlighter Tone) */}
        <div className="bg-highlighter/30 rounded-2xl border border-line p-4 sm:p-5 shadow-hard-sm">
          <div className="flex items-center justify-between text-ink">
            <span className="font-data text-[10px] uppercase font-bold tracking-wider">Low Stock Warning</span>
            <AlertTriangle className="w-4 h-4 text-red" />
          </div>
          <div className="mt-2 font-display text-3xl sm:text-4xl font-extrabold text-ink tabular-nums">
            {lowStock}
          </div>
          <div className="mt-1 font-data text-xs text-ink font-semibold flex items-center gap-1.5">
            <Dot tone="low" size="xs" pulse />
            <span>Variants below threshold</span>
          </div>
        </div>

        {/* Out of Stock */}
        <div className="bg-card rounded-2xl border border-line p-4 sm:p-5 shadow-hard-sm">
          <div className="flex items-center justify-between text-ink-soft">
            <span className="font-data text-[10px] uppercase font-bold tracking-wider">Sold Out Items</span>
            <Boxes className="w-4 h-4 text-ink-soft" />
          </div>
          <div className="mt-2 font-display text-3xl sm:text-4xl font-extrabold text-ink tabular-nums">
            {outOfStock}
          </div>
          <div className="mt-1 font-data text-xs text-ink-soft font-semibold flex items-center gap-1.5">
            <Dot tone="ink" size="xs" />
            <span>Restock required</span>
          </div>
        </div>

        {/* Simulated Demo Revenue (Receipt Look) */}
        <div className="bg-paper-sunk rounded-2xl border border-line p-4 sm:p-5 shadow-hard-sm">
          <div className="flex items-center justify-between text-ink-soft">
            <span className="font-data text-[10px] uppercase font-bold tracking-wider">Counter Volume</span>
            <ReceiptIcon className="w-4 h-4 text-ink" />
          </div>
          <div className="mt-2 font-display text-2xl sm:text-3xl font-extrabold text-ink tabular-nums truncate">
            Rs. {totalRevenueLKR.toLocaleString('en-LK')}
          </div>
          <div className="mt-1 font-data text-xs text-red font-semibold flex items-center gap-1.5">
            <Dot tone="red" size="xs" />
            <span>{orders.length} Simulated orders</span>
          </div>
        </div>

      </div>

      {/* 3. SEGMENTED DOT INVENTORY HEALTH BARS */}
      <div className="bg-card rounded-2xl border border-line p-5 sm:p-6 shadow-hard-sm space-y-4">
        <div className="flex items-center justify-between border-b border-line pb-3">
          <div>
            <h3 className="font-display font-bold text-base sm:text-lg text-ink">
              Inventory Distribution by Flagship
            </h3>
            <p className="font-ui text-xs text-ink-soft mt-0.5">
              Live stock dots per variant color and capacity.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActiveAdminTab('inventory')}
            className="font-data text-xs font-bold text-red hover:underline cursor-pointer"
          >
            Manage Stock &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.slice(0, 6).map((product) => {
            return (
              <div
                key={product.id}
                className="p-3.5 bg-paper rounded-xl border border-line space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-ui font-bold text-ink truncate">{product.name}</span>
                  <span className="font-data text-xs font-bold text-ink shrink-0">
                    {product.stock} units
                  </span>
                </div>

                {/* Segmented Dots */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {product.variants && product.variants.length > 0 ? (
                    product.variants.map((v) => (
                      <span
                        key={v.id}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-data ${
                          v.stock === 0
                            ? 'bg-paper-sunk border-line text-ink-soft line-through'
                            : v.stock <= product.lowStockThreshold
                            ? 'bg-highlighter/30 border-line text-ink font-bold'
                            : 'bg-card border-line text-ink'
                        }`}
                        title={`${v.sku}: ${v.stock} in stock`}
                      >
                        <span
                          className="w-2 h-2 rounded-full border border-black/20"
                          style={{
                            backgroundColor:
                              product.colorOptions.find((c) => c.name === v.color)?.hex || '#141210',
                          }}
                        />
                        <span>{v.storage || v.color}</span>
                        <span className="font-bold">({v.stock})</span>
                      </span>
                    ))
                  ) : (
                    <span className="font-data text-[10px] text-ink-soft">
                      Single variant ({product.stock} units ready)
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. RECENT PRICE CHANGES: MINI TAGS */}
      <div className="bg-card rounded-2xl border border-line p-5 sm:p-6 shadow-hard-sm space-y-4">
        <div className="flex items-center justify-between border-b border-line pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-red" />
            <h3 className="font-display font-bold text-base text-ink">
              Recent Counter Tag Adjustments
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setActiveAdminTab('price-history')}
            className="font-data text-xs font-bold text-red hover:underline cursor-pointer"
          >
            Price Audit Log &rarr;
          </button>
        </div>

        {recentChanges.length === 0 ? (
          <p className="font-ui text-xs text-ink-soft py-3">No price updates published yet in this session.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {recentChanges.map((entry) => {
              const diff = entry.newPriceLKR - entry.oldPriceLKR;
              const isDrop = diff < 0;

              return (
                <div
                  key={entry.id}
                  className="p-3.5 bg-paper rounded-xl border border-line flex flex-col justify-between space-y-2"
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-data text-[9px] uppercase font-bold text-ink-soft bg-paper-sunk px-1.5 py-0.2 rounded border border-line">
                        {entry.source}
                      </span>
                      <span className="font-data text-[10px] text-ink-soft">
                        {new Date(entry.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <h5 className="font-ui font-bold text-xs text-ink truncate">
                      {entry.productName}
                    </h5>
                    <span className="font-data text-[10px] text-ink-soft block">
                      {entry.label} · SKU: {entry.sku}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-line/60 flex items-center justify-between">
                    <div className="font-data text-xs">
                      <span className="line-through text-ink-soft mr-1">
                        Rs. {entry.oldPriceLKR.toLocaleString('en-LK')}
                      </span>
                      <strong className="text-ink font-bold">
                        Rs. {entry.newPriceLKR.toLocaleString('en-LK')}
                      </strong>
                    </div>

                    <span
                      className={`font-data text-[10px] font-bold px-1.5 py-0.2 rounded ${
                        isDrop ? 'bg-highlighter text-ink' : 'bg-red-wash text-red'
                      }`}
                    >
                      {isDrop ? `Down Rs. ${Math.abs(diff).toLocaleString('en-LK')}` : `+Rs. ${diff.toLocaleString('en-LK')}`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. RESET DEMO DATA DISCLOSURE */}
      <div className="bg-card rounded-2xl border border-line p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-hard-sm">
        <p className="font-ui text-xs text-ink-soft max-w-xl">
          Want a clean slate for demonstrating? Reset restores the original sample catalog in this browser (products, variants, mock orders, and history).
        </p>
        <ResetDemoButton />
      </div>

    </div>
  );
};
