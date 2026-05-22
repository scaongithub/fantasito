import pkg from 'xlsx';
const { readFile, utils } = pkg;
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, '..', 'Calendario_Via-che-la-vaga-dio-canpionato.xlsx');
const wb = readFile(file);

console.log('=== SHEET NAMES ===');
console.log(wb.SheetNames);

wb.SheetNames.forEach(name => {
  console.log(`\n=== SHEET: "${name}" ===`);
  const ws = wb.Sheets[name];
  const range = utils.decode_range(ws['!ref'] || 'A1');
  console.log(`Range: ${ws['!ref']}  (rows: ${range.e.r - range.s.r + 1}, cols: ${range.e.c - range.s.c + 1})`);
  
  const data = utils.sheet_to_json(ws, { header: 1, defval: '' });
  data.forEach((row, i) => {
    console.log(`Row ${i}: ${JSON.stringify(row)}`);
  });
});
