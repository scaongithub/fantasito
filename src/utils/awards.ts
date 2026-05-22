import type { SeasonData, MatchdayAward } from '../types';

export function computeAwards(data: SeasonData): MatchdayAward[] {
  return data.matchdays
    .filter(md => md.matches.some(m => m.played))
    .map(md => {
      const playedMatches = md.matches.filter(m => m.played);

      // Tutti i punteggi di questa giornata
      const scores: { team: string; points: number }[] = [];
      for (const m of playedMatches) {
        scores.push({ team: m.homeTeam, points: m.homeFantaPoints });
        scores.push({ team: m.awayTeam, points: m.awayFantaPoints });
      }
      scores.sort((a, b) => b.points - a.points);

      // Vittoria più larga (per fanta punti)
      let biggestWin = playedMatches[0];
      let biggestMargin = 0;
      for (const m of playedMatches) {
        const margin = Math.abs(m.homeFantaPoints - m.awayFantaPoints);
        if (margin > biggestMargin) {
          biggestMargin = margin;
          biggestWin = m;
        }
      }

      // Partita più equilibrata
      let closestMatch = playedMatches[0];
      let closestDiff = Infinity;
      for (const m of playedMatches) {
        const diff = Math.abs(m.homeFantaPoints - m.awayFantaPoints);
        if (diff < closestDiff) {
          closestDiff = diff;
          closestMatch = m;
        }
      }

      return {
        matchday: md.number,
        highestScore: scores[0],
        lowestScore: scores[scores.length - 1],
        biggestWin: {
          home: biggestWin.homeTeam,
          away: biggestWin.awayTeam,
          margin: biggestMargin,
          result: biggestWin.result,
        },
        closestMatch: {
          home: closestMatch.homeTeam,
          away: closestMatch.awayTeam,
          diff: closestDiff,
          result: closestMatch.result,
        },
      };
    });
}

export interface SeasonAward {
  title: string;
  titleIt: string;
  team: string;
  value: string;
  emoji: string;
}

export function computeSeasonAwards(data: SeasonData): SeasonAward[] {
  const awards: SeasonAward[] = [];
  const mdAwards = computeAwards(data);

  // Conteggio MVP (più volte miglior punteggio della giornata)
  const mvpCount = new Map<string, number>();
  const shameCount = new Map<string, number>();
  for (const a of mdAwards) {
    mvpCount.set(a.highestScore.team, (mvpCount.get(a.highestScore.team) || 0) + 1);
    shameCount.set(a.lowestScore.team, (shameCount.get(a.lowestScore.team) || 0) + 1);
  }

  const mvp = [...mvpCount.entries()].sort((a, b) => b[1] - a[1])[0];
  awards.push({
    title: 'Season MVP',
    titleIt: 'MVP della Stagione',
    team: mvp[0],
    value: `${mvp[1]} matchday wins`,
    emoji: '🏆',
  });

  const bidone = [...shameCount.entries()].sort((a, b) => b[1] - a[1])[0];
  awards.push({
    title: "Bidone d'Oro",
    titleIt: "Bidone d'Oro",
    team: bidone[0],
    value: `${bidone[1]} worst scores`,
    emoji: '🗑️',
  });

  // Punteggio singolo più alto
  let maxScore = { team: '', points: 0, md: 0 };
  let minScore = { team: '', points: Infinity, md: 0 };
  for (const md of data.matchdays) {
    for (const m of md.matches) {
      if (!m.played) continue;
      if (m.homeFantaPoints > maxScore.points) {
        maxScore = { team: m.homeTeam, points: m.homeFantaPoints, md: md.number };
      }
      if (m.awayFantaPoints > maxScore.points) {
        maxScore = { team: m.awayTeam, points: m.awayFantaPoints, md: md.number };
      }
      if (m.homeFantaPoints < minScore.points) {
        minScore = { team: m.homeTeam, points: m.homeFantaPoints, md: md.number };
      }
      if (m.awayFantaPoints < minScore.points) {
        minScore = { team: m.awayTeam, points: m.awayFantaPoints, md: md.number };
      }
    }
  }

  awards.push({
    title: 'Highest Score Ever',
    titleIt: 'Punteggio Record',
    team: maxScore.team,
    value: `${maxScore.points} pts (MD ${maxScore.md})`,
    emoji: '🔥',
  });

  awards.push({
    title: 'Lowest Score Ever',
    titleIt: 'Punteggio Più Basso',
    team: minScore.team,
    value: `${minScore.points} pts (MD ${minScore.md})`,
    emoji: '💀',
  });

  // Vittoria più larga della stagione
  let biggestWin = { home: '', away: '', margin: 0, result: '', md: 0 };
  for (const md of data.matchdays) {
    for (const m of md.matches) {
      if (!m.played) continue;
      const margin = Math.abs(m.homeGoals - m.awayGoals);
      if (margin > biggestWin.margin) {
        biggestWin = { home: m.homeTeam, away: m.awayTeam, margin, result: m.result, md: md.number };
      }
    }
  }

  awards.push({
    title: 'Biggest Win',
    titleIt: 'Vittoria Più Larga',
    team: `${biggestWin.home} vs ${biggestWin.away}`,
    value: `${biggestWin.result} (MD ${biggestWin.md})`,
    emoji: '💪',
  });

  // Squadra più divertente (media gol più alta nelle proprie partite)
  const teamTotalGoals = new Map<string, { total: number; matches: number }>();
  for (const team of data.teams) {
    teamTotalGoals.set(team, { total: 0, matches: 0 });
  }
  for (const md of data.matchdays) {
    for (const m of md.matches) {
      if (!m.played) continue;
      const total = m.homeGoals + m.awayGoals;
      const h = teamTotalGoals.get(m.homeTeam)!;
      const a = teamTotalGoals.get(m.awayTeam)!;
      h.total += total;
      h.matches++;
      a.total += total;
      a.matches++;
    }
  }
  let mostEntertaining = { team: '', avg: 0 };
  for (const [team, { total, matches }] of teamTotalGoals) {
    const avg = matches > 0 ? total / matches : 0;
    if (avg > mostEntertaining.avg) {
      mostEntertaining = { team, avg };
    }
  }

  awards.push({
    title: 'Most Entertaining',
    titleIt: 'Più Divertente',
    team: mostEntertaining.team,
    value: `${mostEntertaining.avg.toFixed(1)} avg goals/match`,
    emoji: '🎭',
  });

  return awards;
}
