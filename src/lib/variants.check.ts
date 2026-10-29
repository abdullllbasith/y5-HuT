// Lightweight sanity checks (no test framework in the repo): npx tsx src/lib/variants.check.ts
import { INITIAL_PRODUCTS } from '../data/mockData';
import {
  normalizeProducts, getSelectedVariant, getDefaultVariant, getTotalStock, hasVariants, setVariantStock, getPriceRangeLKR,
} from './variants';

const assert = (c: boolean, m: string) => { if (!c) { console.error('FAIL', m); process.exitCode = 1; } else console.log('ok  ', m); };
const ps = normalizeProducts(INITIAL_PRODUCTS);
const skus = ps.flatMap((p) => p.variants?.map((v) => v.sku) ?? []);
const ids = ps.flatMap((p) => p.variants?.map((v) => v.id) ?? []);
assert(new Set(skus).size === skus.length && skus.length > 30, `unique skus (${skus.length})`);
assert(new Set(ids).size === ids.length, 'unique variant ids');
const ip = ps.find((p) => p.id === 'prod-iphone16promax')!;
assert(getSelectedVariant(ip, 'Natural Titanium', '256GB')!.priceLKR === 425000, '256GB price');
assert(getSelectedVariant(ip, 'Natural Titanium', '512GB')!.priceLKR === 495000, '512GB price differs from 256GB');
assert(ip.priceLKR === 425000 && ip.stock === getTotalStock(ip), 'derived price=min, stock=sum');
assert(getDefaultVariant(ip)!.stock > 0, 'default variant in stock');
const edited = setVariantStock(ip, getSelectedVariant(ip, 'Natural Titanium', '512GB')!.id, 7);
assert(edited.stock === ip.stock - getSelectedVariant(ip, 'Natural Titanium', '512GB')!.stock + 7, 'variant stock edit updates total');
const plain = ps.find((p) => p.id === 'prod-airpods-pro2')!;
assert(!hasVariants(plain) && plain.stock === 28 && getSelectedVariant(plain, 'x', 'y') === undefined, 'variant-less product untouched');
assert(getPriceRangeLKR(ip).max === 565000, 'price range');
assert(getSelectedVariant(ip, 'Natural Titanium', '128GB') === undefined, 'missing combination -> undefined');
const brands = new Set(ps.filter(hasVariants).map((p) => p.brand));
assert(['Apple', 'Samsung', 'Xiaomi'].every((b) => brands.has(b as never)), 'Apple/Samsung/Xiaomi variant products');
