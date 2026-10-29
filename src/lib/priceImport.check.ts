// Lightweight sanity checks (no test framework in the repo): npx tsx src/lib/priceImport.check.ts
import { parseCsv, toCsv } from './csv';
import { analyzeImport, buildPriceListCsv, readPriceCsv, summarizeImport } from './priceImport';
import { buildPriceRows } from './priceRows';
import { normalizeProducts } from './variants';
import { INITIAL_PRODUCTS } from '../data/mockData';

const check = (c: boolean, m: string) => {
  if (!c) {
    console.error('FAIL', m);
    process.exitCode = 1;
  } else console.log('ok  ', m);
};

// Parser
const p = parseCsv('a,b,c\r\n"x, y","he said ""hi""",007\r\n"multi\nline",,z\r\n');
check(p.rows[1][0] === 'x, y' && p.rows[1][1] === 'he said "hi"', 'quoted comma and escaped quote');
check(p.rows[1][2] === '007', 'leading zeros kept as text');
check(p.rows[2][0] === 'multi\nline' && p.rows[2][1] === '', 'newline in quotes, empty cell');
check(parseCsv('﻿a;b\r\n1;2').rows[1][1] === '2', 'BOM and semicolon delimiter');
check(parseCsv('a,"b').error !== undefined, 'unclosed quote is an error');
const round = toCsv([['a,b', 'c"d', '007', '']]);
check(parseCsv(round).rows[0].join('|') === 'a,b|c"d|007|', 'write then read round-trips');

// Import against the demo catalogue
const cat = buildPriceRows(normalizeProducts(INITIAL_PRODUCTS));
const exported = buildPriceListCsv(cat, false);
const re = analyzeImport(readPriceCsv(exported).rows, cat);
check(re.every((r) => r.status === 'unchanged'), 'exporting then importing changes nothing');
const tpl = analyzeImport(readPriceCsv(buildPriceListCsv(cat, true)).rows, cat);
check(tpl.every((r) => r.status === 'unchanged'), 'blank template changes nothing');

const csv = [
  'sku,product_name,brand,variant,current_price_lkr,new_price_lkr,stock',
  'APL-IP15-128GB-B,Apple iPhone 15,Apple,x,245000,242000,999',
  'SAM-A55-128GB-AN,Samsung Galaxy A55 5G,Samsung,x,112000,114500,0',
  'XIA-RN13P-128GB-MB,Xiaomi Redmi Note 13 Pro,Xiaomi,x,82000,82000,1',
  'APL-IP16PM-256GB-DT,Apple iPhone 16 Pro Max,Apple,x,425000,abc,1',
  'NOPE-1,Nothing,X,x,1,100,1',
  'apl-ip15-128gb-p,Apple iPhone 15,Apple,x,245000,0,1',
  'XIA-14T-256GB-TB,Xiaomi 14T,Xiaomi,x,189000,,1',
  'XIA-14T-256GB-TB,Xiaomi 14T,Xiaomi,x,189000,,1',
  'SAM-S24U-256GB-TG,Galaxy,Samsung,x,365000,300000,1',
  'SAM-S24U-256GB-TG,Galaxy,Samsung,x,365000,310000,1',
  ',no sku,,,,100,',
].join('\r\n');
const rows = analyzeImport(readPriceCsv(csv).rows, cat);
const s = summarizeImport(rows);
check(s.changed === 2, 'two changed rows');
check(s.invalid === 3, 'invalid: "abc", zero, missing SKU');
check(s.unknown === 1, 'unknown SKU');
check(s.duplicateRow === 1, 'exact duplicate row');
check(s.duplicateSku === 2, 'conflicting duplicate SKUs both excluded');
check(rows[5].status === 'invalid', 'case-insensitive SKU still matched, then zero rejected');
check(rows.filter((r) => r.status === 'change').every((r) => r.target && r.newPrice !== undefined), 'changes carry targets');
const fixed = analyzeImport(readPriceCsv(csv).rows, cat, { 5: '240000' });
check(fixed[3].status === 'change', 'owner correction of an invalid price is re-validated');
check(readPriceCsv('foo,bar\r\n1,2').fatal !== undefined, 'missing columns is fatal');
check(readPriceCsv('PK\u0000\u0003binary').fatal !== undefined, 'binary file rejected');
