import { Product, ProductCategory, BrandName } from '../types';
import { hasVariants } from './variants';

/** Flat, editable view of the catalogue: one row per variant (or per product without variants). */
export interface PriceRow {
  key: string; // `${productId}::${variantId ?? '-'}`
  productId: string;
  variantId?: string;
  name: string; // product / model name
  brand: BrandName;
  category: ProductCategory;
  sku: string;
  storage?: string;
  color?: string;
  priceLKR: number;
  stock: number;
  updatedAt?: string;
}

export const rowKey = (productId: string, variantId?: string) => `${productId}::${variantId ?? '-'}`;

export const buildPriceRows = (products: Product[]): PriceRow[] =>
  products.flatMap((p): PriceRow[] =>
    hasVariants(p)
      ? p.variants!.map((v) => ({
          key: rowKey(p.id, v.id),
          productId: p.id,
          variantId: v.id,
          name: p.name,
          brand: p.brand,
          category: p.category,
          sku: v.sku,
          storage: v.storage,
          color: v.color,
          priceLKR: v.priceLKR,
          stock: v.stock,
          updatedAt: v.priceUpdatedAt,
        }))
      : [
          {
            key: rowKey(p.id),
            productId: p.id,
            name: p.name,
            brand: p.brand,
            category: p.category,
            sku: p.id, // products without variants have no SKU; the product id is shown instead
            priceLKR: p.priceLKR,
            stock: p.stock,
            updatedAt: p.priceUpdatedAt,
          },
        ]
  );

export interface PriceFilters {
  search: string;
  brand: BrandName | 'all';
  category: ProductCategory | 'all';
  model: string | 'all';
  inStockOnly: boolean;
  changedOnly: boolean;
}

export const EMPTY_FILTERS: PriceFilters = {
  search: '',
  brand: 'all',
  category: 'all',
  model: 'all',
  inStockOnly: false,
  changedOnly: false,
};

/** Filtering only narrows the visible rows; it never changes any price. */
export const filterPriceRows = (
  rows: PriceRow[],
  f: PriceFilters,
  isChanged: (key: string) => boolean
): PriceRow[] => {
  const q = f.search.trim().toLowerCase();
  return rows.filter((r) => {
    if (f.brand !== 'all' && r.brand !== f.brand) return false;
    if (f.category !== 'all' && r.category !== f.category) return false;
    if (f.model !== 'all' && r.name !== f.model) return false;
    if (f.inStockOnly && r.stock <= 0) return false;
    if (f.changedOnly && !isChanged(r.key)) return false;
    if (q && !(r.name.toLowerCase().includes(q) || r.sku.toLowerCase().includes(q))) return false;
    return true;
  });
};
