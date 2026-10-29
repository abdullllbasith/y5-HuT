import { Product, ProductCategory } from '../../../types';
import { hasVariants } from '../../../lib/variants';

/** One stock line: a variant, or a whole product that has no variants. */
export interface InventoryRow {
  key: string;
  productId: string;
  variantId?: string;
  name: string;
  brand: string;
  category: ProductCategory;
  sku: string;
  label: string;
  stock: number;
  threshold: number;
  archived: boolean;
}

export const buildInventoryRows = (products: Product[]): InventoryRow[] =>
  products.flatMap((p): InventoryRow[] =>
    hasVariants(p)
      ? p.variants!.map((v) => ({
          key: `${p.id}::${v.id}`,
          productId: p.id,
          variantId: v.id,
          name: p.name,
          brand: p.brand,
          category: p.category,
          sku: v.sku,
          label: [v.storage, v.color].filter(Boolean).join(' / '),
          stock: v.stock,
          threshold: p.lowStockThreshold,
          archived: !!p.archived,
        }))
      : [
          {
            key: `${p.id}::-`,
            productId: p.id,
            name: p.name,
            brand: p.brand,
            category: p.category,
            sku: p.id,
            label: '',
            stock: p.stock,
            threshold: p.lowStockThreshold,
            archived: !!p.archived,
          },
        ]
  );
