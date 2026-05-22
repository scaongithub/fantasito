import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import seasonData from '../data/season.json';
import type { SeasonData } from '../types';
import { computeStandings } from '../utils/standings';
import { computeStreaks } from '../utils/streaks';
import { computeKingLeaderboard } from '../utils/matchdayKings';
import TeamBadge from '../components/TeamBadge';

const data = seasonData as SeasonData;

interface Roast {
  emoji: string;
  titleIt: string;
  titleEn: string;
  team: string;
  descIt: string;
  descEn: string;
}

function generateRoasts(): Roast[] {
  const standings = computeStandings(data);
  const streaks = computeStreaks(data);
  const kings = computeKingLeaderboard(data);

  const last = standings[standings.length - 1];
  const secondLast = standings[standings.length - 2];
  const champion = standings[0];
  const mostDraws = [...standings].sort((a, b) => b.drawn - a.drawn)[0];
  const leastGoals = [...standings].sort((a, b) => a.goalsFor - b.goalsFor)[0];
  const mostConceded = [...standings].sort((a, b) => b.goalsAgainst - a.goalsAgainst)[0];
  const worstLossStreak = [...streaks].sort((a, b) => b.longestLossStreak - a.longestLossStreak)[0];

  const topKing = kings[0];
  const noKing = kings[kings.length - 1];

  // Peggior sconfitta (margine più largo)
  let biggestLoss = { team: '', result: '', opponent: '', goals: 0 };
  for (const md of data.matchdays) {
    for (const m of md.matches) {
      if (!m.played) continue;
      const diff = Math.abs(m.homeGoals - m.awayGoals);
      if (diff > biggestLoss.goals) {
        const loser = m.homeGoals < m.awayGoals ? m.homeTeam : m.awayTeam;
        const winner = m.homeGoals > m.awayGoals ? m.homeTeam : m.awayTeam;
        biggestLoss = { team: loser, result: m.result, opponent: winner, goals: diff };
      }
    }
  }

  return [
    {
      emoji: '🏆',
      titleIt: 'Il Padrone',
      titleEn: 'The Boss',
      team: champion.team,
      descIt: `${champion.points} punti. ${champion.won} vittorie. La lega ha un padrone e il resto sono comparse.`,
      descEn: `${champion.points} points. ${champion.won} wins. The league has a boss, the rest are extras.`,
    },
    {
      emoji: '🗑️',
      titleIt: "L'Ultimo della Classe",
      titleEn: 'Dead Last',
      team: last.team,
      descIt: `${last.points} punti in ${last.played} giornate. Servono più punti per comprare il caffè.`,
      descEn: `${last.points} points in ${last.played} matchdays. You need more points to buy a coffee.`,
    },
    {
      emoji: '🪑',
      titleIt: 'Il Penultimo',
      titleEn: 'Almost Last',
      team: secondLast.team,
      descIt: `L'unica consolazione di ${secondLast.team}? Non essere ${last.team}.`,
      descEn: `The only consolation for ${secondLast.team}? Not being ${last.team}.`,
    },
    {
      emoji: '🤝',
      titleIt: 'Il Diplomatico',
      titleEn: 'The Diplomat',
      team: mostDraws.team,
      descIt: `${mostDraws.drawn} pareggi. Non sa vincere, non sa perdere. L'arte del compromesso.`,
      descEn: `${mostDraws.drawn} draws. Can't win, can't lose. The art of compromise.`,
    },
    {
      emoji: '😶',
      titleIt: "L'Attacco Spuntato",
      titleEn: 'Blunt Attack',
      team: leastGoals.team,
      descIt: `Solo ${leastGoals.goalsFor} gol in ${leastGoals.played} partite. L'attacco è in sciopero.`,
      descEn: `Only ${leastGoals.goalsFor} goals in ${leastGoals.played} games. The attack is on strike.`,
    },
    {
      emoji: '🚪',
      titleIt: 'La Porta Aperta',
      titleEn: 'Open Door Policy',
      team: mostConceded.team,
      descIt: `${mostConceded.goalsAgainst} gol subiti. La difesa è un concetto astratto.`,
      descEn: `${mostConceded.goalsAgainst} goals conceded. Defense is an abstract concept.`,
    },
    {
      emoji: '📉',
      titleIt: 'La Caduta Libera',
      titleEn: 'Free Fall',
      team: worstLossStreak.team,
      descIt: `${worstLossStreak.longestLossStreak} sconfitte di fila. Record che nessuno voleva.`,
      descEn: `${worstLossStreak.longestLossStreak} losses in a row. A record nobody wanted.`,
    },
    {
      emoji: '💀',
      titleIt: 'La Figuraccia',
      titleEn: 'The Humiliation',
      team: biggestLoss.team,
      descIt: `${biggestLoss.result} contro ${biggestLoss.opponent}. C'era anche il portiere? Non si sa.`,
      descEn: `${biggestLoss.result} against ${biggestLoss.opponent}. Was there a goalkeeper? Unknown.`,
    },
    {
      emoji: '👑',
      titleIt: 'Re Senza Corona',
      titleEn: 'Crownless',
      team: noKing.team,
      descIt: `Solo ${noKing.crowns} volta/e miglior punteggio della giornata. Mai il migliore, sempre mediocre.`,
      descEn: `Only ${noKing.crowns} matchday top score(s). Never the best, always mediocre.`,
    },
    {
      emoji: '⚡',
      titleIt: 'Il Flash',
      titleEn: 'The Flash',
      team: topKing.team,
      descIt: `${topKing.crowns} volte re della giornata! Quando si accende, brucia tutto.`,
      descEn: `${topKing.crowns} matchday crowns! When they're on fire, everything burns.`,
    },
  ];
}

export default function Memes() {
  const { t, i18n } = useTranslation();
  const roasts = generateRoasts();

  return (
    <div>
      <h1 className="text-3xl font-bold text-pitch-dark mb-2">{t('memes.title')}</h1>
      <p className="text-gray-500 mb-8">{t('memes.subtitle')}</p>

      <h2 className="text-2xl font-bold text-pitch-dark mb-6">{t('memes.superlatives')}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {roasts.map((roast, i) => (
          <motion.div
            key={roast.titleEn}
            className="glass-card p-6 border-l-4 hover:shadow-lg transition-shadow"
            style={{ borderLeftColor: i < 2 ? '#22c55e' : '#ef4444' }}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="flex items-start gap-3">
              <span className="text-3xl">{roast.emoji}</span>
              <div>
                <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">
                  {i18n.language === 'it' ? roast.titleIt : roast.titleEn}
                </p>
                <div className="flex items-center gap-2 my-2">
                  <TeamBadge team={roast.team} size="sm" />
                  <span className="font-bold text-pitch-dark">{roast.team}</span>
                </div>
                <p className="text-sm text-gray-600 italic">
                  "{i18n.language === 'it' ? roast.descIt : roast.descEn}"
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
