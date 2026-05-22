import type { SeasonData, TeamStreak } from '../types';

type FormResult = 'W' | 'D' | 'L';

function getTeamResults(data: SeasonData, team: string): FormResult[] {
  const results: FormResult[] = [];
  const sortedMd = [...data.matchdays].sort((a, b) => a.number - b.number);

  for (const md of sortedMd) {
    for (const m of md.matches) {
      if (!m.played) continue;
      if (m.homeTeam !== team && m.awayTeam !== team) continue;

      const isHome = m.homeTeam === team;
      const teamGoals = isHome ? m.homeGoals : m.awayGoals;
      const oppGoals = isHome ? m.awayGoals : m.homeGoals;

      if (teamGoals > oppGoals) results.push('W');
      else if (teamGoals < oppGoals) results.push('L');
      else results.push('D');
    }
  }

  return results;
}

function longestStreak(results: FormResult[], ...targets: FormResult[]): number {
  let max = 0, current = 0;
  for (const r of results) {
    if (targets.includes(r)) {
      current++;
      max = Math.max(max, current);
    } else {
      current = 0;
    }
  }
  return max;
}

export function computeStreaks(data: SeasonData): TeamStreak[] {
  return data.teams.map(team => {
    const results = getTeamResults(data, team);
    return {
      team,
      longestWinStreak: longestStreak(results, 'W'),
      longestLossStreak: longestStreak(results, 'L'),
      longestUnbeatenStreak: longestStreak(results, 'W', 'D'),
      longestDrawStreak: longestStreak(results, 'D'),
      currentForm: results.slice(-5) as FormResult[],
    };
  });
}

export function getTeamForm(data: SeasonData, team: string): FormResult[] {
  return getTeamResults(data, team);
}
