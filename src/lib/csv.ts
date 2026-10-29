/** Small RFC-4180 style CSV reader/writer. Every cell is kept as text, so leading zeros survive. */

export const detectDelimiter = (text: string): ',' | ';' | '\t' => {
  const firstLine = text.split(/\r?\n/, 1)[0] ?? '';
  // Count only outside quotes.
  const counts: Record<string, number> = { ',': 0, ';': 0, '\t': 0 };
  let inQuotes = false;
  for (const ch of firstLine) {
    if (ch === '"') inQuotes = !inQuotes;
    else if (!inQuotes && ch in counts) counts[ch]++;
  }
  // Excel in some regional settings saves semicolon-separated "CSV".
  if (counts[';'] > counts[','] && counts[';'] >= counts['\t']) return ';';
  if (counts['\t'] > counts[',']) return '\t';
  return ',';
};

export interface ParsedCsv {
  rows: string[][];
  delimiter: string;
  error?: string;
}

export const parseCsv = (input: string): ParsedCsv => {
  const text = input.replace(/^﻿/, '');
  const delimiter = detectDelimiter(text);
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let inQuotes = false;
  let wasQuoted = false;

  const endCell = () => {
    row.push(wasQuoted ? cell : cell.trim());
    cell = '';
    wasQuoted = false;
  };
  const endRow = () => {
    endCell();
    rows.push(row);
    row = [];
  };

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          cell += '"';
          i++;
        } else inQuotes = false;
      } else cell += ch;
    } else if (ch === '"' && cell.trim() === '') {
      inQuotes = true;
      wasQuoted = true;
      cell = '';
    } else if (ch === delimiter) endCell();
    else if (ch === '\r') {
      if (text[i + 1] === '\n') i++;
      endRow();
    } else if (ch === '\n') endRow();
    else cell += ch;
  }
  if (inQuotes) return { rows: [], delimiter, error: 'A quoted value is never closed (missing closing ").' };
  if (cell !== '' || row.length > 0) endRow();
  return { rows, delimiter };
};

const needsQuotes = /[",\r\n]|^\s|\s$/;

export const toCsv = (rows: (string | number | undefined)[][]): string =>
  rows
    .map((r) =>
      r
        .map((v) => {
          const s = v === undefined ? '' : String(v);
          return needsQuotes.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
        })
        .join(',')
    )
    .join('\r\n') + '\r\n';

/** Download text as a CSV file. A BOM makes Excel read UTF-8 correctly. */
export const downloadCsv = (filename: string, csv: string) => {
  const blob = new Blob(['﻿', csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
