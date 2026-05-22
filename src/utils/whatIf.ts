import type { SeasonData, TeamStanding } from '../types';
import { computeStandings } from './standings';

export interface WhatIfStanding {
  team: string;
  actualPoints: number;
  whatIfPoints: number;
  luckIndex: number;
}

// "Tutti contro tutti": ogni giornata, classifica tutti i 12 punteggi, il primo prende 3 punti, ecc.
export function computeEveVsEve(data: SeasonData): TeamStanding[] {
  const points = new Map<string, number>();
  for (const team of data.teams) points.set(team, 0);

  for (const md of data.matchdays) {
    const scores: { team: string; points: number }[] = [];
    for (const m of md.matches) {
      if (!m.played) continue;
      scores.push({ team: m.homeTeam, points: m.homeFantaPoints });
      scores.push({ team: m.awayTeam, points: m.awayFantaPoints });
    }
    scores.sort((a, b) => b.points - a.points);

    // Assegna punti: ogni squadra prende 3 pt per ogni squadra battuta, 1 per i pareggi
    for (let i = 0; i < scores.length; i++) {
      let pts = 0;
      for (let j = 0; j < scores.length; j++) {
        if (i === j) continue;
        if (scores[i].points > scores[j].points) pts += 3;
        else if (scores[i].points === scores[j].points) pts += 1;
      }
      points.set(scores[i].team, (points.get(scores[i].team) || 0) + pts);
    }
  }

  return [...points.entries()]
    .map(([team, pts]) => ({
      team, points: pts,
      played: 0, won: 0, drawn: 0, lost: 0,
      goalsFor: 0, goalsAgainst: 0, goalDifference: 0,
      fantaPointsFor: 0, fantaPointsAgainst: 0,
    }))
    .sort((a, b) => b.points - a.points);
}

// Classifica solo casa
export function computeHomeStandings(data: SeasonData): TeamStanding[] {
  const map = new Map<string, TeamStanding>();
  for (const team of data.teams) {
    map.set(team, {
      team, played: 0, won: 0, drawn: 0, lost: 0,
      goalsFor: 0, goalsAgainst: 0, goalDifference: 0,
      points: 0, fantaPointsFor: 0, fantaPointsAgainst: 0,
    });
  }

  for (const md of data.matchdays) {
    for (const m of md.matches) {
      if (!m.played) continue;
      const home = map.get(m.homeTeam)!;
      home.played++;
      home.goalsFor += m.homeGoals;
      home.goalsAgainst += m.awayGoals;
      home.fantaPointsFor += m.homeFantaPoints;
      home.fantaPointsAgainst += m.awayFantaPoints;
      if (m.homeGoals > m.awayGoals) { home.won++; home.points += 3; }
      else if (m.homeGoals < m.awayGoals) { home.lost++; }
      else { home.drawn++; home.points += 1; }
    }
  }

  const standings = [...map.values()];
  for (const s of standings) s.goalDifference = s.goalsFor - s.goalsAgainst;
  standings.sort((a, b) => b.points !== a.points ? b.points - a.points : b.goalDifference - a.goalDifference);
  return standings;
}

// Classifica solo trasferta
export function computeAwayStandings(data: SeasonData): TeamStanding[] {
  const map = new Map<string, TeamStanding>();
  for (const team of data.teams) {
    map.set(team, {
      team, played: 0, won: 0, drawn: 0, lost: 0,
      goalsFor: 0, goalsAgainst: 0, goalDifference: 0,
      points: 0, fantaPointsFor: 0, fantaPointsAgainst: 0,
    });
  }

  for (const md of data.matchdays) {
    for (const m of md.matches) {
      if (!m.played) continue;
      const away = map.get(m.awayTeam)!;
      away.played++;
      away.goalsFor += m.awayGoals;
      away.goalsAgainst += m.homeGoals;
      away.fantaPointsFor += m.awayFantaPoints;
      away.fantaPointsAgainst += m.homeFantaPoints;
      if (m.awayGoals > m.homeGoals) { away.won++; away.points += 3; }
      else if (m.awayGoals < m.homeGoals) { away.lost++; }
      else { away.drawn++; away.points += 1; }
    }
  }

  const standings = [...map.values()];
  for (const s of standings) s.goalDifference = s.goalsFor - s.goalsAgainst;
  standings.sort((a, b) => b.points !== a.points ? b.points - a.points : b.goalDifference - a.goalDifference);
  return standings;
}

// Indice di fortuna: punti reali vs what-if (tutti contro tutti normalizzato)
export function computeLuckIndex(data: SeasonData): WhatIfStanding[] {
  const actual = computeStandings(data);
  const eveVsEve = computeEveVsEve(data);

  // Normalizza i punti tutti-vs-tutti alla stessa scala
  const maxActual = Math.max(...actual.map(s => s.points));
  const maxEve = Math.max(...eveVsEve.map(s => s.points));
  const scale = maxEve > 0 ? maxActual / maxEve : 1;

  return actual.map(a => {
    const eve = eveVsEve.find(e => e.team === a.team)!;
    const normalizedWhatIf = Math.round(eve.points * scale);
    return {
      team: a.team,
      actualPoints: a.points,
      whatIfPoints: normalizedWhatIf,
      luckIndex: a.points - normalizedWhatIf,
    };
  }).sort((a, b) => b.luckIndex - a.luckIndex);
}
