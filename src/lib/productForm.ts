import { Product, ProductCategory, ProductVariant } from '../types';
import { hasVariants } from './variants';
import { parsePriceInput } from './priceValidation';
import { MAX_STOCK } from './stock';

/** USD for items created in the demo admin is an illustrative estimate only, never kept in sync with LKR. */
export const ILLUSTRATIVE_LKR_PER_USD = 300;

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  'apple-store': 'AppleHuT',
  smartphones: 'Mobile phones',
  smartwatches: 'Smartwatches',
  audio: 'Earphones & audio',
  'power-banks': 'Power banks',
  charging: 'Chargers',
  'cases-protection': 'Cases & protection',
  'drones-lifestyle': 'Drones & lifestyle',
  accessories: 'Accessories',
  applehut: 'AppleHuT (legacy)',
};

export const SELECTABLE_CATEGORIES = (Object.keys(CATEGORY_LABELS) as ProductCategory[]).filter((c) => c !== 'applehut');

const DEVICE_BY_CATEGORY: Record<ProductCategory, Product['deviceType']> = {
  applehut: 'phone',
  'apple-store': 'phone',
  smartphones: 'phone',
  smartwatches: 'smartwatch',
  audio: 'earbuds',
  'power-banks': 'powerbank',
  charging: 'charger',
  'cases-protection': 'case',
  'drones-lifestyle': 'cable',
  accessories: 'cable',
};

export interface VariantForm {
  key: string; // stable React key, not persisted
  id?: string; // existing variant id, when editing
  sku: string;
  storage: string;
  color: string;
  price: string;
  stock: string;
}

export interface ProductForm {
  id?: string;
  name: string;
  brand: string;
  category: ProductCategory;
  description: string;
  imageUrl: string;
  lowStockThreshold: string;
  archived: boolean;
  variants: VariantForm[];
}

let counter = 0;
export const newVariantRow = (patch: Partial<VariantForm> = {}): VariantForm => ({
  key: `vf-${Date.now()}-${counter++}`,
  sku: '',
  storage: '',
  color: '',
  price: '',
  stock: '0',
  ...patch,
});

export const emptyProductForm = (): ProductForm => ({
  name: '',
  brand: '',
  category: 'smartphones',
  description: '',
  imageUrl: '',
  lowStockThreshold: '3',
  archived: false,
  variants: [newVariantRow()],
});

/** Products without variants are edited in "simple" mode: details only (price/stock live in Price Manager / Inventory). */
export const toProductForm = (p: Product): ProductForm => ({
  id: p.id,
  name: p.name,
  brand: p.brand,
  category: p.category,
  description: p.description,
  imageUrl: p.imageUrl ?? '',
  lowStockThreshold: String(p.lowStockThreshold),
  archived: !!p.archived,
  variants: hasVariants(p)
    ? p.variants!.map((v) =>
        newVariantRow({ id: v.id, sku: v.sku, storage: v.storage ?? '', color: v.color ?? '', price: String(v.priceLKR), stock: String(v.stock) })
      )
    : [],
});

/** A copy starts hidden so it never appears on the storefront by surprise. */
export const duplicateForm = (p: Product, takenSkus: Set<string>): ProductForm => {
  const f = toProductForm(p);
  const suffix = (sku: string) => {
    let candidate = `${sku}-COPY`;
    for (let n = 2; takenSkus.has(candidate.toLowerCase()); n++) candidate = `${sku}-COPY${n}`;
    takenSkus.add(candidate.toLowerCase());
    return candidate;
  };
  return {
    ...f,
    id: undefined,
    name: `${p.name} (copy)`,
    archived: true,
    variants: f.variants.map((v) => ({ ...v, key: newVariantRow().key, id: undefined, sku: suffix(v.sku || 'SKU') })),
  };
};

export interface FormErrors {
  fields: Partial<Record<'name' | 'brand' | 'description' | 'imageUrl' | 'lowStockThreshold' | 'variants', string>>;
  variants: Record<string, Partial<Record<'sku' | 'price' | 'stock' | 'combo', string>>>;
}

export const isHttpUrl = (s: string) => {
  try {
    const u = new URL(s);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
};

const SKU_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._-]{1,39}$/;

/** SKUs already used elsewhere (other products' variants, and variant-less products by their id). */
export const takenSkus = (products: Product[], exceptProductId?: string): Set<string> => {
  const set = new Set<string>();
  products.forEach((p) => {
    if (p.id === exceptProductId) return;
    if (hasVariants(p)) p.variants!.forEach((v) => set.add(v.sku.toLowerCase()));
    else set.add(p.id.toLowerCase());
  });
  return set;
};

export const validateProductForm = (form: ProductForm, products: Product[], simple: boolean): FormErrors => {
  const errors: FormErrors = { fields: {}, variants: {} };
  if (form.name.trim().length < 2) errors.fields.name = 'Enter a model name';
  if (form.brand.trim() === '') errors.fields.brand = 'Choose or type a brand';
  if (form.description.length > 1000) errors.fields.description = 'Keep the description under 1,000 characters';
  if (form.imageUrl.trim() !== '' && !isHttpUrl(form.imageUrl.trim())) errors.fields.imageUrl = 'Use a full http(s) image link, or leave empty';
  if (!/^\d+$/.test(form.lowStockThreshold.trim()) || Number(form.lowStockThreshold) > 1000) {
    errors.fields.lowStockThreshold = 'Whole number, 0 to 1000';
  }
  if (simple) return errors;

  if (form.variants.length === 0) errors.fields.variants = 'Add at least one variant';
  const taken = takenSkus(products, form.id);
  const seenSku = new Map<string, number>();
  const seenCombo = new Set<string>();
  form.variants.forEach((v) => {
    const e: FormErrors['variants'][string] = {};
    const sku = v.sku.trim();
    if (!sku) e.sku = 'SKU is required';
    else if (!SKU_PATTERN.test(sku)) e.sku = 'Letters, numbers, - . _ only (2-40 chars)';
    else if (taken.has(sku.toLowerCase())) e.sku = 'This SKU is already used by another product';
    else if (seenSku.has(sku.toLowerCase())) e.sku = 'Duplicate SKU in this form';
    seenSku.set(sku.toLowerCase(), 1);

    const price = parsePriceInput(v.price);
    if (!price.ok) e.price = price.error;

    if (!/^\d+$/.test(v.stock.trim()) || Number(v.stock) > MAX_STOCK) e.stock = 'Whole number, 0 or more';

    const combo = `${v.storage.trim().toLowerCase()}|${v.color.trim().toLowerCase()}`;
    if (seenCombo.has(combo)) e.combo = 'Another variant already has this storage and colour';
    seenCombo.add(combo);

    if (Object.keys(e).length) errors.variants[v.key] = e;
  });
  return errors;
};

export const hasErrors = (e: FormErrors) => Object.keys(e.fields).length > 0 || Object.keys(e.variants).length > 0;

const COLOR_HEX: [RegExp, string][] = [
  [/black|graphite|midnight/i, '#1E293B'],
  [/white|silver|starlight/i, '#F1F5F9'],
  [/blue|navy/i, '#3B82F6'],
  [/red/i, '#DC2626'],
  [/green/i, '#16A34A'],
  [/pink|rose/i, '#F9A8D4'],
  [/purple|violet|lilac/i, '#8B5CF6'],
  [/gold|yellow/i, '#EAB308'],
  [/gr[ae]y|titanium/i, '#64748B'],
];
const hexFor = (name: string) => COLOR_HEX.find(([re]) => re.test(name))?.[1] ?? '#64748B';

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'item';

/** Build the product to save. `existing` keeps reviews, ratings and every field the form does not edit. */
export const productFromForm = (form: ProductForm, existing?: Product): Product => {
  const simple = !!existing && !hasVariants(existing);
  const threshold = Number(form.lowStockThreshold);

  const base: Product = existing ?? {
    id: `prod-${slug(form.name)}-${Date.now().toString(36)}`,
    name: '',
    brand: '',
    category: form.category,
    priceUSD: 0,
    priceLKR: 0,
    stock: 0,
    lowStockThreshold: 3,
    rating: 5,
    reviewCount: 0,
    description: '',
    tagline: 'Sample demo record added from the admin.',
    deviceType: DEVICE_BY_CATEGORY[form.category],
    colorOptions: [],
    specs: { warranty: '1-Year official local warranty (sample demo record)' },
    reviews: [],
    kokoEligible: true,
    mintpayEligible: true,
  };

  const details: Product = {
    ...base,
    name: form.name.trim(),
    brand: form.brand.trim(),
    category: form.category,
    description: form.description.trim() || base.description,
    imageUrl: form.imageUrl.trim() || undefined,
    lowStockThreshold: threshold,
    archived: form.archived,
    deviceType: existing ? base.deviceType : DEVICE_BY_CATEGORY[form.category],
  };
  if (simple) return details;

  const knownHex = new Map(base.colorOptions.map((c) => [c.name.toLowerCase(), c.hex]));
  const existingById = new Map((existing?.variants ?? []).map((v) => [v.id, v]));
  const variants: ProductVariant[] = form.variants.map((f) => {
    const old = f.id ? existingById.get(f.id) : undefined;
    const price = Math.round(Number((parsePriceInput(f.price) as { value: number }).value));
    return {
      ...(old ?? {}),
      id: old?.id ?? `var-${f.sku.trim().toLowerCase()}`,
      sku: f.sku.trim(),
      storage: f.storage.trim() || undefined,
      color: f.color.trim() || undefined,
      priceLKR: price,
      // USD is illustrative: estimated once when a variant is created, then left alone.
      priceUSD: old?.priceUSD ?? Math.max(1, Math.round(price / ILLUSTRATIVE_LKR_PER_USD)),
      stock: Number(f.stock),
      priceUpdatedAt: old && old.priceLKR === price ? old.priceUpdatedAt : old ? new Date().toISOString() : undefined,
    };
  });

  const colors = Array.from(new Set(variants.map((v) => v.color).filter((c): c is string => !!c)));
  const storages = Array.from(new Set(variants.map((v) => v.storage).filter((s): s is string => !!s)));
  return {
    ...details,
    variants,
    colorOptions: colors.map((name) => ({ name, hex: knownHex.get(name.toLowerCase()) ?? hexFor(name) })),
    storageOptions: storages.length ? storages : undefined,
    priceLKR: Math.min(...variants.map((v) => v.priceLKR)),
    priceUSD: Math.min(...variants.map((v) => v.priceUSD ?? 0)) || details.priceUSD,
    stock: variants.reduce((n, v) => n + v.stock, 0),
  };
};
