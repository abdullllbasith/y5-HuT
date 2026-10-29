import { Product, ProductVariant } from '../types';

/** Variant helpers. Variants are the source of truth for price/stock when present. */

export const hasVariants = (p: Product): boolean => !!p.variants && p.variants.length > 0;

export const getTotalStock = (p: Product): number =>
  hasVariants(p) ? p.variants!.reduce((sum, v) => sum + v.stock, 0) : p.stock;

/** First in-stock variant, else the first variant. Undefined for products without variants. */
export const getDefaultVariant = (p: Product): ProductVariant | undefined => {
  if (!hasVariants(p)) return undefined;
  return p.variants!.find((v) => v.stock > 0) ?? p.variants![0];
};

/**
 * The variant matching the chosen colour/storage. Selectors that are not
 * provided are ignored, so a product with only storage variants works too.
 */
export const getSelectedVariant = (
  p: Product,
  color?: string,
  storage?: string
): ProductVariant | undefined => {
  if (!hasVariants(p)) return undefined;
  return p.variants!.find(
    (v) => (!color || !v.color || v.color === color) && (!storage || !v.storage || v.storage === storage)
  );
};

export const getDisplayPriceLKR = (p: Product, variant?: ProductVariant): number =>
  variant ? variant.priceLKR : p.priceLKR;

/** Illustrative only: USD is never derived from LKR. */
export const getDisplayPriceUSD = (p: Product, variant?: ProductVariant): number =>
  variant?.priceUSD ?? p.priceUSD;

export const getPriceRangeLKR = (p: Product): { min: number; max: number } => {
  if (!hasVariants(p)) return { min: p.priceLKR, max: p.priceLKR };
  const prices = p.variants!.map((v) => v.priceLKR);
  return { min: Math.min(...prices), max: Math.max(...prices) };
};

export const hasPriceRange = (p: Product): boolean => {
  const { min, max } = getPriceRangeLKR(p);
  return min !== max;
};

/** Distinct storage / colour values present on variants, in first-seen order. */
export const getVariantStorages = (p: Product): string[] =>
  Array.from(new Set((p.variants ?? []).map((v) => v.storage).filter((s): s is string => !!s)));

export const getVariantColors = (p: Product): string[] =>
  Array.from(new Set((p.variants ?? []).map((v) => v.color).filter((c): c is string => !!c)));

interface BuildVariantsInput {
  skuPrefix: string;
  colors: string[];
  storages: { storage: string; priceLKR: number; priceUSD?: number }[];
  stockFor: (storage: string, color: string, index: number) => number;
}

const initials = (s: string) =>
  s
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

/** Deterministic variant generator for seed data (same input → same ids/skus). */
export const buildVariants = ({ skuPrefix, colors, storages, stockFor }: BuildVariantsInput): ProductVariant[] => {
  const out: ProductVariant[] = [];
  storages.forEach((s) => {
    colors.forEach((color) => {
      const sku = `${skuPrefix}-${s.storage}-${initials(color)}`;
      out.push({
        id: `var-${sku.toLowerCase()}`,
        sku,
        storage: s.storage,
        color,
        priceLKR: s.priceLKR,
        priceUSD: s.priceUSD,
        stock: stockFor(s.storage, color, out.length),
      });
    });
  });
  return out;
};

/**
 * Make a product internally consistent. With variants: sanitise them and derive
 * priceLKR (lowest), priceUSD (lowest, when every variant has one) and stock (total)
 * so no second copy of price/stock can disagree. Without variants: unchanged.
 */
export const normalizeProduct = (p: Product): Product => {
  if (!hasVariants(p)) return p;
  const variants = p.variants!.map((v) => ({
    ...v,
    priceLKR: Math.max(0, Number(v.priceLKR) || 0),
    stock: Math.max(0, Math.floor(Number(v.stock) || 0)),
  }));
  const usd = variants.map((v) => v.priceUSD);
  const allUsd = usd.every((u): u is number => typeof u === 'number');
  return {
    ...p,
    variants,
    priceLKR: Math.min(...variants.map((v) => v.priceLKR)),
    priceUSD: allUsd ? Math.min(...(usd as number[])) : p.priceUSD,
    stock: variants.reduce((sum, v) => sum + v.stock, 0),
  };
};

/** Normalise all products and guarantee unique variant ids and SKUs across the catalogue. */
export const normalizeProducts = (products: Product[]): Product[] => {
  const ids = new Set<string>();
  const skus = new Set<string>();
  const unique = (value: string, seen: Set<string>) => {
    let candidate = value;
    for (let n = 2; seen.has(candidate); n++) candidate = `${value}-${n}`;
    seen.add(candidate);
    return candidate;
  };
  return products.map((p) => {
    const n = normalizeProduct(p);
    if (!hasVariants(n)) return n;
    return {
      ...n,
      variants: n.variants!.map((v) => ({ ...v, id: unique(v.id, ids), sku: unique(v.sku, skus) })),
    };
  });
};

/** Apply a stock change to one variant and re-derive product totals. */
export const setVariantStock = (p: Product, variantId: string, stock: number): Product =>
  normalizeProduct({
    ...p,
    variants: p.variants?.map((v) => (v.id === variantId ? { ...v, stock: Math.max(0, stock) } : v)),
  });
