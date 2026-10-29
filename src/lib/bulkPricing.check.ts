// Lightweight sanity checks (no test framework in the repo): npx tsx src/lib/bulkPricing.check.ts
import { applyBulk, parseBulkValue, previewBulk } from './bulkPricing';
import { PriceRow } from './priceRows';

const check = (c: boolean, m: string) => {
  if (!c) {
    console.error('FAIL', m);
    process.exitCode = 1;
  } else console.log('ok  ', m);
};
const row = (key: string, price: number, productId = 'p'): PriceRow => ({
  key, productId, name: 'X', brand: 'Apple', category: 'smartphones', sku: key, priceLKR: price, stock: 1,
});

check(applyBulk(245000, 'decrease-amount', 2000) === 243000, 'decrease by Rs. 2,000');
check(applyBulk(245000, 'increase-amount', 1500) === 246500, 'increase by amount');
check(applyBulk(245000, 'increase-percent', 3) === 252350, 'increase 3%');
check(applyBulk(99999, 'increase-percent', 1) === 100999, 'rounds 100998.99 to whole rupee');
check(applyBulk(1005, 'increase-percent', 0.5) === 1010, 'rounds half up (1010.025 -> 1010)');
check(applyBulk(1001, 'decrease-percent', 0.1) === 1000, 'rounds 999.999 -> 1000');
check(applyBulk(100, 'set', 99.6) === 100, 'set rounds to integer');

for (const [mode, raw] of [
  ['set', ''], ['set', 'abc'], ['set', '0'], ['set', '-5'], ['decrease-percent', '100'], ['increase-percent', '600'], ['set', '1.234'],
] as const) check(!parseBulkValue(mode, raw).ok, `rejects ${mode} "${raw}"`);
check(parseBulkValue('increase-percent', '5%').ok, 'accepts "5%"');

const p = previewBulk([row('a', 3000), row('b', 245000), row('c', 245000)], 'decrease-amount', 5000);
check(p.invalid.length === 1 && p.invalid[0].row.key === 'a', 'result <= 0 is invalid');
check(p.changes.length === 2, 'valid rows change');
check(previewBulk([row('a', 100)], 'set', 100).unchanged.length === 1, 'same price is "unchanged", not a change');
check(previewBulk([row('a', 100), row('b', 200)], 'set', 150).warnings.length >= 1, 'set over differing prices warns');
check(previewBulk([row('a', 100)], 'increase-percent', 50).warnings.some((w) => w.includes('25%')), 'large change warns');
check(previewBulk([row('a', 100)], 'increase-amount', 1, 3).warnings.some((w) => w.includes('hidden')), 'hidden selection warns');
