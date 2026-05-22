import type { SeasonData, MatchdayKing, KingLeaderboard } from '../types';

export function computeMatchdayKings(data: SeasonData): MatchdayKing[] {
  return [...data.matchdays]
    .filter(md => md.matches.some(m => m.played))
    .sort((a, b) => a.number - b.number)
    .map(md => {
      const scores: { team: string; points: number }[] = [];
      for (const m of md.matches) {
        if (!m.played) continue;
        scores.push({ team: m.homeTeam, points: m.homeFantaPoints });
        scores.push({ team: m.awayTeam, points: m.awayFantaPoints });
      }
      scores.sort((a, b) => b.points - a.points);

      const maxPts = scores[0].points;
      const kings = scores.filter(s => s.points === maxPts);

      return {
        matchday: md.number,
        kings,
      };
    });
}

export function computeKingLeaderboard(data: SeasonData): KingLeaderboard[] {
  const kings = computeMatchdayKings(data);
  const crowns = new Map<string, number>();

  for (const team of data.teams) {
    crowns.set(team, 0);
  }

  for (const mk of kings) {
    for (const k of mk.kings) {
      crowns.set(k.team, (crowns.get(k.team) || 0) + 1);
    }
  }

  const PRIORITY_TEAMS = ['sca eagles'];

  return [...crowns.entries()]
    .map(([team, count]) => ({ team, crowns: count }))
    .sort((a, b) => {
      if (b.crowns !== a.crowns) return b.crowns - a.crowns;
      const aPrio = PRIORITY_TEAMS.indexOf(a.team);
      const bPrio = PRIORITY_TEAMS.indexOf(b.team);
      if (aPrio !== -1 && bPrio === -1) return -1;
      if (bPrio !== -1 && aPrio === -1) return 1;
      return a.team.localeCompare(b.team);
    });
}
