// Lightweight sanity checks (no test framework in the repo): npx tsx src/lib/productForm.check.ts
import { computeStock, stockLevel } from './stock';
import {
  duplicateForm, emptyProductForm, hasErrors, newVariantRow, productFromForm, takenSkus, toProductForm, validateProductForm,
} from './productForm';
import { INITIAL_PRODUCTS } from '../data/mockData';
import { getTotalStock, normalizeProducts } from './variants';

const check = (c: boolean, m: string) => {
  if (!c) {
    console.error('FAIL', m);
    process.exitCode = 1;
  } else console.log('ok  ', m);
};

// Stock arithmetic
const ok = (b: number, mode: 'set' | 'delta', v: string) => {
  const r = computeStock(b, mode, v);
  return r.ok ? r.after : NaN;
};
check(ok(5, 'set', '0') === 0, 'set 5 -> 0');
check(ok(5, 'delta', '-5') === 0, 'remove 5 from 5');
check(ok(5, 'delta', '+10') === 15, 'add 10');
check(!computeStock(5, 'delta', '-6').ok, 'cannot go below zero');
check(!computeStock(5, 'set', '-1').ok, 'set negative rejected');
for (const bad of ['', 'abc', '1.5', '1e3']) check(!computeStock(5, 'set', bad).ok, `rejects "${bad}"`);
check(stockLevel(0, 3) === 'out' && stockLevel(3, 3) === 'low' && stockLevel(4, 3) === 'ok', 'stock levels');

// Product form
const products = normalizeProducts(INITIAL_PRODUCTS);
const form = emptyProductForm();
check(hasErrors(validateProductForm(form, products, false)), 'empty form is invalid');

form.name = 'Apple iPhone 16';
form.brand = 'Apple';
form.variants = [
  newVariantRow({ sku: 'APL-IP16-128-BLU', storage: '128GB', color: 'Blue', price: '280000', stock: '5' }),
  newVariantRow({ sku: 'APL-IP16-256-BLU', storage: '256GB', color: 'Blue', price: '320000', stock: '3' }),
];
check(!hasErrors(validateProductForm(form, products, false)), 'valid form passes');

const dupAcross = { ...form, variants: [newVariantRow({ sku: 'apl-ip15-128gb-b', storage: '1', color: '1', price: '1000', stock: '1' })] };
check(validateProductForm(dupAcross, products, false).variants[dupAcross.variants[0].key]?.sku !== undefined, 'SKU used by another product is rejected (case-insensitive)');
const dupWithin = { ...form, variants: [newVariantRow({ sku: 'X-1', storage: 'a', price: '10', stock: '1' }), newVariantRow({ sku: 'x-1', storage: 'b', price: '10', stock: '1' })] };
check(hasErrors(validateProductForm(dupWithin, products, false)), 'duplicate SKU inside the form is rejected');
const dupCombo = { ...form, variants: [newVariantRow({ sku: 'A-1', storage: '128GB', color: 'Blue', price: '10', stock: '1' }), newVariantRow({ sku: 'A-2', storage: '128gb', color: 'blue', price: '10', stock: '1' })] };
check(hasErrors(validateProductForm(dupCombo, products, false)), 'same storage + colour twice is rejected');
const badNums = { ...form, variants: [newVariantRow({ sku: 'B-1', price: '0', stock: '-1' })] };
const be = validateProductForm(badNums, products, false).variants[badNums.variants[0].key];
check(!!be?.price && !!be?.stock, 'zero price and negative stock rejected');
check(validateProductForm({ ...form, imageUrl: 'javascript:alert(1)' }, products, false).fields.imageUrl !== undefined, 'non-http image link rejected');

const created = productFromForm(form);
check(created.stock === 8 && created.priceLKR === 280000 && created.variants!.length === 2, 'derived stock and lowest price');
check(created.colorOptions.length === 1 && created.storageOptions!.length === 2, 'colour/storage options derived from variants');
check(created.archived === false && getTotalStock(created) === 8, 'visible by default');

// Editing keeps reviews and untouched fields
const seed = products.find((p) => p.id === 'prod-iphone16promax')!;
const ef = toProductForm(seed);
ef.name = 'Apple iPhone 16 Pro Max (renamed)';
const edited = productFromForm(ef, seed);
check(edited.reviews.length === seed.reviews.length && edited.id === seed.id, 'edit keeps id and reviews');
check(edited.variants!.every((v, i) => v.id === seed.variants![i].id && v.priceLKR === seed.variants![i].priceLKR), 'edit keeps variant ids and prices');

// Simple (variant-less) products are edited as details only
const simple = products.find((p) => p.id === 'prod-airpods-pro2')!;
const sf = toProductForm(simple);
sf.archived = true;
const arch = productFromForm(sf, simple);
check(!!arch.archived && arch.stock === simple.stock && arch.priceLKR === simple.priceLKR && !arch.variants, 'archiving a simple product keeps price/stock');

// Duplicate starts hidden with fresh SKUs
const copy = duplicateForm(seed, takenSkus(products));
check(!!copy.archived && copy.id === undefined && copy.variants.every((v) => v.sku.endsWith('-COPY') && !v.id), 'duplicate is hidden with new SKUs');
check(!hasErrors(validateProductForm(copy, products, false)), 'duplicate form is valid as-is');
