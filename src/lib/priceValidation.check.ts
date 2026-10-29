// Lightweight sanity checks (no test framework in the repo): npx tsx src/lib/priceValidation.check.ts
import { parsePriceInput, isLargeChange, percentChange } from './priceValidation';
import { INITIAL_PRODUCTS } from '../data/mockData';
import { normalizeProducts } from './variants';
import { buildPriceRows, filterPriceRows, EMPTY_FILTERS } from './priceRows';

const check = (c: boolean, m: string) => {
  if (!c) {
    console.error('FAIL', m);
    process.exitCode = 1;
  } else console.log('ok  ', m);
};

const ok = (s: string) => {
  const r = parsePriceInput(s);
  return r.ok ? r.value : NaN;
};
check(ok('245000') === 245000, 'plain number');
check(ok('Rs. 245,000') === 245000, 'Rs prefix and commas');
check(ok('245000.5') === 245000.5, 'one decimal');
for (const bad of ['', '   ', 'abc', 'NaN', '0', '-5', '0.00', '12.345', '1e5', '999999999999', 'Infinity'])
  check(!parsePriceInput(bad).ok, `rejects "${bad}"`);

check(isLargeChange(100000, 130000) && !isLargeChange(100000, 110000), '25% threshold');
check(Math.round(percentChange(249000, 245000) * 10) / 10 === -1.6, 'percent change');

const rows = buildPriceRows(normalizeProducts(INITIAL_PRODUCTS));
const apple = filterPriceRows(rows, { ...EMPTY_FILTERS, brand: 'Apple' }, () => false);
check(apple.length > 0 && apple.every((r) => r.brand === 'Apple'), 'brand filter only filters');
check(rows.length === buildPriceRows(normalizeProducts(INITIAL_PRODUCTS)).length, 'filter does not alter rows');
check(new Set(rows.map((r) => r.key)).size === rows.length, 'unique row keys');
check(rows.some((r) => !r.variantId), 'non-variant products have rows too');
check(filterPriceRows(rows, { ...EMPTY_FILTERS, search: 'apl-ip15-128gb' }, () => false).length === 3, 'search by SKU');
