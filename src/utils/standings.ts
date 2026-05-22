import type { SeasonData, TeamStanding } from '../types';

export function computeStandings(data: SeasonData): TeamStanding[] {
  const map = new Map<string, TeamStanding>();

  for (const team of data.teams) {
    map.set(team, {
      team,
      played: 0, won: 0, drawn: 0, lost: 0,
      goalsFor: 0, goalsAgainst: 0, goalDifference: 0,
      points: 0, fantaPointsFor: 0, fantaPointsAgainst: 0,
    });
  }

  for (const md of data.matchdays) {
    for (const m of md.matches) {
      if (!m.played) continue;
      const home = map.get(m.homeTeam)!;
      const away = map.get(m.awayTeam)!;

      home.played++;
      away.played++;
      home.goalsFor += m.homeGoals;
      home.goalsAgainst += m.awayGoals;
      away.goalsFor += m.awayGoals;
      away.goalsAgainst += m.homeGoals;
      home.fantaPointsFor += m.homeFantaPoints;
      home.fantaPointsAgainst += m.awayFantaPoints;
      away.fantaPointsFor += m.awayFantaPoints;
      away.fantaPointsAgainst += m.homeFantaPoints;

      if (m.homeGoals > m.awayGoals) {
        home.won++;
        home.points += 3;
        away.lost++;
      } else if (m.homeGoals < m.awayGoals) {
        away.won++;
        away.points += 3;
        home.lost++;
      } else {
        home.drawn++;
        away.drawn++;
        home.points += 1;
        away.points += 1;
      }
    }
  }

  const standings = [...map.values()];
  for (const s of standings) {
    s.goalDifference = s.goalsFor - s.goalsAgainst;
  }

  standings.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    return b.goalsFor - a.goalsFor;
  });

  return standings;
}

export function computeStandingsUpToMatchday(data: SeasonData, upTo: number): TeamStanding[] {
  const filtered: SeasonData = {
    ...data,
    matchdays: data.matchdays.filter(md => md.number <= upTo),
  };
  return computeStandings(filtered);
}

export function getPointsProgression(data: SeasonData): Map<string, number[]> {
  const progression = new Map<string, number[]>();
  for (const team of data.teams) {
    progression.set(team, []);
  }

  let cumulative = new Map<string, number>();
  for (const team of data.teams) {
    cumulative.set(team, 0);
  }

  const sortedMd = [...data.matchdays].sort((a, b) => a.number - b.number);
  for (const md of sortedMd) {
    for (const m of md.matches) {
      if (!m.played) continue;
      if (m.homeGoals > m.awayGoals) {
        cumulative.set(m.homeTeam, (cumulative.get(m.homeTeam) || 0) + 3);
      } else if (m.homeGoals < m.awayGoals) {
        cumulative.set(m.awayTeam, (cumulative.get(m.awayTeam) || 0) + 3);
      } else {
        cumulative.set(m.homeTeam, (cumulative.get(m.homeTeam) || 0) + 1);
        cumulative.set(m.awayTeam, (cumulative.get(m.awayTeam) || 0) + 1);
      }
    }
    for (const team of data.teams) {
      progression.get(team)!.push(cumulative.get(team) || 0);
    }
  }

  return progression;
}
