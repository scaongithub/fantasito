import type { SeasonData, H2HRecord } from '../types';

export function computeHeadToHead(data: SeasonData): Map<string, Map<string, H2HRecord>> {
  const h2h = new Map<string, Map<string, H2HRecord>>();

  for (const teamA of data.teams) {
    h2h.set(teamA, new Map());
    for (const teamB of data.teams) {
      if (teamA === teamB) continue;
      h2h.get(teamA)!.set(teamB, {
        teamA, teamB,
        winsA: 0, winsB: 0, draws: 0,
        goalsA: 0, goalsB: 0,
        matches: [],
      });
    }
  }

  for (const md of data.matchdays) {
    for (const m of md.matches) {
      if (!m.played) continue;

      const recAB = h2h.get(m.homeTeam)!.get(m.awayTeam)!;
      const recBA = h2h.get(m.awayTeam)!.get(m.homeTeam)!;

      recAB.matches.push(m);
      recBA.matches.push(m);

      recAB.goalsA += m.homeGoals;
      recAB.goalsB += m.awayGoals;
      recBA.goalsA += m.awayGoals;
      recBA.goalsB += m.homeGoals;

      if (m.homeGoals > m.awayGoals) {
        recAB.winsA++;
        recBA.winsB++;
      } else if (m.homeGoals < m.awayGoals) {
        recAB.winsB++;
        recBA.winsA++;
      } else {
        recAB.draws++;
        recBA.draws++;
      }
    }
  }

  return h2h;
}

export function getH2HRecord(data: SeasonData, teamA: string, teamB: string): H2HRecord {
  const record: H2HRecord = {
    teamA, teamB,
    winsA: 0, winsB: 0, draws: 0,
    goalsA: 0, goalsB: 0,
    matches: [],
  };

  for (const md of data.matchdays) {
    for (const m of md.matches) {
      if (!m.played) continue;
      const isRelevant =
        (m.homeTeam === teamA && m.awayTeam === teamB) ||
        (m.homeTeam === teamB && m.awayTeam === teamA);
      if (!isRelevant) continue;

      record.matches.push(m);

      const goalsA = m.homeTeam === teamA ? m.homeGoals : m.awayGoals;
      const goalsB = m.homeTeam === teamB ? m.homeGoals : m.awayGoals;

      record.goalsA += goalsA;
      record.goalsB += goalsB;

      if (goalsA > goalsB) record.winsA++;
      else if (goalsB > goalsA) record.winsB++;
      else record.draws++;
    }
  }

  return record;
}

export function getH2HMatrix(data: SeasonData): { teams: string[]; matrix: number[][] } {
  const teams = [...data.teams].sort();
  const matrix: number[][] = [];

  for (let i = 0; i < teams.length; i++) {
    matrix[i] = [];
    for (let j = 0; j < teams.length; j++) {
      if (i === j) {
        matrix[i][j] = -1;
        continue;
      }
      const rec = getH2HRecord(data, teams[i], teams[j]);
      matrix[i][j] = rec.winsA * 3 + rec.draws;
    }
  }

  return { teams, matrix };
}
