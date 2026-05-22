import pkg from 'xlsx';
const { readFile, utils } = pkg;
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { writeFileSync, mkdirSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, '..', 'Calendario_Via-che-la-vaga-dio-canpionato.xlsx');
const wb = readFile(file);
const ws = wb.Sheets[wb.SheetNames[0]];
const rows = utils.sheet_to_json(ws, { header: 1, defval: '' });

const teams = new Set();
const matchdays = [];
let currentMatchday = null;

for (let i = 3; i < rows.length; i++) {
  const row = rows[i];
  if (!row || !row[0]) continue;

  // Check if it's a matchday header
  const headerMatch = String(row[0]).match(/^(\d+)ª Giornata lega$/);
  if (headerMatch) {
    if (currentMatchday) matchdays.push(currentMatchday);
    const serieAMatch = String(row[2]).match(/^(\d+)ª Giornata serie a$/);
    currentMatchday = {
      number: parseInt(headerMatch[1]),
      serieAMatchday: serieAMatch ? parseInt(serieAMatch[1]) : null,
      matches: []
    };
    continue;
  }

  // It's a match row
  if (currentMatchday && row[0] && row[3]) {
    const homeTeam = String(row[0]).trim();
    const awayTeam = String(row[3]).trim();
    const homeFantaPoints = Number(row[1]) || 0;
    const awayFantaPoints = Number(row[2]) || 0;
    const result = String(row[4]).trim();
    
    // Parse goals
    let homeGoals = 0, awayGoals = 0, played = true;
    if (result === '-' || result === '') {
      played = false;
    } else {
      const parts = result.split('-');
      homeGoals = parseInt(parts[0]) || 0;
      awayGoals = parseInt(parts[1]) || 0;
    }

    teams.add(homeTeam);
    teams.add(awayTeam);

    currentMatchday.matches.push({
      homeTeam,
      awayTeam,
      homeFantaPoints,
      awayFantaPoints,
      homeGoals,
      awayGoals,
      result,
      played
    });
  }
}
if (currentMatchday) matchdays.push(currentMatchday);

// Includi tutte le giornate (giocate e non)
const seasonData = {
  leagueName: "Via che la vaga dio canpionato",
  leagueUrl: "https://leghe.fantacalcio.it/fanta-la-sete",
  teams: [...teams].sort(),
  matchdays: matchdays
};

const outDir = join(__dirname, '..', 'src', 'data');
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'season.json'), JSON.stringify(seasonData, null, 2));

console.log(`Parsed ${matchdays.length} matchdays with ${teams.size} teams`);
console.log('Teams:', [...teams].sort().join(', '));
console.log(`Output: src/data/season.json`);
