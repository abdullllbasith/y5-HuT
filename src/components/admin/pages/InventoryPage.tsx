import React, { useState } from 'react';
import { useStore } from '../../../context/StoreContext';
import { Product, ProductCategory, BrandName } from '../../../types';
import { hasVariants } from '../../../lib/variants';
import { TrendingUp, Package, Layers, Users, Shield, Search, Plus, Mail, ChevronRight, Download, AlertTriangle, CheckCircle, Truck, DollarSign, ArrowUpRight } from 'lucide-react';

export const InventoryPage: React.FC = () => {
  const { products, updateProductStock, restockProduct, updateVariantStock, addProduct, currentUser, formatPrice, currency, switchUserRole } = useStore();
  const [stockSearch, setStockSearch] = useState('');
  const [isNewProductOpen, setIsNewProductOpen] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductBrand, setNewProductBrand] = useState<BrandName>('Apple');
  const [newProductCategory, setNewProductCategory] = useState<ProductCategory>('apple-store');
  const [newProductPriceLKR, setNewProductPriceLKR] = useState(45000);
  const [newProductPriceUSD, setNewProductPriceUSD] = useState(135);
  const [newProductStock, setNewProductStock] = useState(20);
  const canManageInventory =
    currentUser.role === 'super_admin' || currentUser.role === 'inventory_manager';

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName.trim()) return;

    const newProd: Product = {
      id: `prod-${Date.now()}`,
      name: newProductName,
      brand: newProductBrand,
      category: newProductCategory,
      priceLKR: Number(newProductPriceLKR),
      priceUSD: Number(newProductPriceUSD),
      stock: Number(newProductStock),
      lowStockThreshold: 5,
      rating: 5.0,
      reviewCount: 0,
      description: 'Official genuine electronic hardware certified by y5Hut.lk Sri Lanka.',
      tagline: 'High-performance tech hardware with official local warranty support.',
      deviceType: newProductCategory === 'smartphones' || newProductCategory === 'apple-store' ? 'phone' : 'charger',
      colorOptions: [{ name: 'Space Gray', hex: '#334155' }],
      specs: {
        warranty: '1-Year y5Hut.lk Official Local Warranty',
      },
      reviews: [],
      kokoEligible: true,
      mintpayEligible: true,
    };

    addProduct(newProd);
    setIsNewProductOpen(false);
    setNewProductName('');
  };

  return (
    <>
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-sans">
                Warehouse Stock &amp; Serial Ledger
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Automated low stock alerts fire when counts drop below the safety buffer.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Filter stock by name..."
                  value={stockSearch}
                  onChange={(e) => setStockSearch(e.target.value)}
                  className="text-xs pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#E11D48]"
                />
              </div>

              {canManageInventory && (
                <button
                  onClick={() => setIsNewProductOpen(true)}
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#E11D48] hover:bg-[#BE123C] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Product</span>
                </button>
              )}
            </div>
          </div>

          {!canManageInventory && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Read-Only Inventory Mode: Sales Reps have view-only access to verify warehouse stock for client quotations. Stock adjustments are restricted to Inventory Management.</span>
              </div>
              <button
                onClick={() => switchUserRole('inventory_manager')}
                className="text-xs font-bold text-blue-700 hover:text-blue-900 underline whitespace-nowrap cursor-pointer"
              >
                Switch to Inventory Manager
              </button>
            </div>
          )}

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-bold tracking-wider">
                <tr>
                  <th className="px-4 py-3">Hardware Item</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Stock on Hand</th>
                  <th className="px-4 py-3">Threshold</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Quick Restock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {products
                  .filter((p) =>
                    stockSearch.trim()
                      ? p.name.toLowerCase().includes(stockSearch.toLowerCase()) ||
                        p.id.toLowerCase().includes(stockSearch.toLowerCase())
                      : true
                  )
                  .flatMap((p) => {
                    const isLow = p.stock > 0 && p.stock <= p.lowStockThreshold;
                    const isOut = p.stock === 0;

                    const parentRow = (
                      <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-bold text-slate-900">{p.name}</div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            {p.id} · {p.brand}
                          </div>
                        </td>
                        <td className="px-4 py-3 capitalize">{p.category}</td>
                        <td className="px-4 py-3 font-mono font-bold text-slate-900 tabular-nums">
                          {hasVariants(p) && <span className="text-[10px] font-bold text-slate-500 mr-1">From</span>}
                          {formatPrice(p.priceLKR, p.priceUSD)}
                        </td>
                        <td className="px-4 py-3 font-mono font-bold tabular-nums text-slate-950">
                          {p.stock} units{hasVariants(p) && <span className="block text-[10px] font-normal text-slate-400">total of {p.variants!.length} variants</span>}
                        </td>
                        <td className="px-4 py-3 font-mono tabular-nums text-slate-500">
                          {p.lowStockThreshold} units
                        </td>
                        <td className="px-4 py-3">
                          {isOut ? (
                            <span className="text-[11px] font-bold text-rose-600">
                              Sold Out
                            </span>
                          ) : isLow ? (
                            <span className="text-[11px] font-bold text-[#E11D48]">
                              Low Stock Warning
                            </span>
                          ) : (
                            <span className="text-[11px] font-semibold text-emerald-700">
                              Optimal
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right space-x-2">
                          {hasVariants(p) ? (
                            <span className="text-[11px] text-slate-400">Adjust per variant below</span>
                          ) : (<>
                          <button
                            onClick={() => updateProductStock(p.id, Math.max(0, p.stock - 1))}
                            className="px-2 py-0.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded cursor-pointer"
                          >
                            -1
                          </button>
                          <button
                            onClick={() => restockProduct(p.id, 10)}
                            className="px-2 py-0.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded cursor-pointer"
                          >
                            +10
                          </button>
                          <button
                            onClick={() => restockProduct(p.id, 25)}
                            className="px-2.5 py-0.5 text-xs bg-slate-900 hover:bg-[#E11D48] text-white rounded font-bold transition-colors cursor-pointer"
                          >
                            Restock +25
                          </button>
                          </>)}
                        </td>
                      </tr>
                    );
                    const variantRows = (p.variants ?? []).map((v) => (
                      <tr key={v.id} className="bg-slate-50/60">
                        <td className="pl-10 pr-4 py-2 text-[11px]">
                          <span className="font-bold text-slate-700">
                            {[v.storage, v.color].filter(Boolean).join(' · ')}
                          </span>
                          <div className="text-slate-400 font-mono">{v.sku}</div>
                        </td>
                        <td className="px-4 py-2" />
                        <td className="px-4 py-2 font-mono tabular-nums text-[11px]">
                          {formatPrice(v.priceLKR, v.priceUSD ?? p.priceUSD)}
                        </td>
                        <td className="px-4 py-2 font-mono tabular-nums text-[11px] font-bold">{v.stock} units</td>
                        <td className="px-4 py-2" />
                        <td className="px-4 py-2 text-[11px]">
                          {v.stock === 0 ? (
                            <span className="font-bold text-rose-600">Sold Out</span>
                          ) : v.stock <= p.lowStockThreshold ? (
                            <span className="font-bold text-[#E11D48]">Low</span>
                          ) : (
                            <span className="text-emerald-700">OK</span>
                          )}
                        </td>
                        <td className="px-4 py-2 text-right space-x-2">
                          <button
                            onClick={() => updateVariantStock(p.id, v.id, Math.max(0, v.stock - 1))}
                            className="px-2 py-0.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded cursor-pointer"
                          >
                            -1
                          </button>
                          <button
                            onClick={() => updateVariantStock(p.id, v.id, v.stock + 10)}
                            className="px-2 py-0.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded cursor-pointer"
                          >
                            +10
                          </button>
                        </td>
                      </tr>
                    ));
                    return [parentRow, ...variantRows];
                  })}
              </tbody>
            </table>
          </div>
        </div>

      {/* Modal: Add Product */}
      {isNewProductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-slate-200 p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Add New Product to y5Hut.lk</h3>
            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anker Prime 240W GaN Charging Station"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#E11D48]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Brand</label>
                  <select
                    value={newProductBrand}
                    onChange={(e: any) => setNewProductBrand(e.target.value)}
                    className="w-full px-2 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="Apple">Apple</option>
                    <option value="Samsung">Samsung</option>
                    <option value="Anker">Anker</option>
                    <option value="Soundpeats">Soundpeats</option>
                    <option value="UGREEN">UGREEN</option>
                    <option value="Xiaomi">Xiaomi</option>
                    <option value="Baseus">Baseus</option>
                    <option value="Sony">Sony</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Category</label>
                  <select
                    value={newProductCategory}
                    onChange={(e: any) => setNewProductCategory(e.target.value)}
                    className="w-full px-2 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="apple-store">AppleHuT</option>
                    <option value="smartphones">Mobile Phones</option>
                    <option value="smartwatches">Smartwatches</option>
                    <option value="audio">Earphones &amp; Audio</option>
                    <option value="power-banks">Power Banks</option>
                    <option value="charging">Fast Chargers</option>
                    <option value="cases-protection">Cases &amp; Protection</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Price (LKR Rs.)</label>
                  <input
                    type="number"
                    min="100"
                    required
                    value={newProductPriceLKR}
                    onChange={(e) => setNewProductPriceLKR(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Initial Stock Count</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={newProductStock}
                    onChange={(e) => setNewProductStock(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsNewProductOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#E11D48] text-white rounded-lg font-bold hover:bg-[#BE123C] cursor-pointer"
                >
                  Publish Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
