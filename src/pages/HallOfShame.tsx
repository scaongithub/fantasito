import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import seasonData from '../data/season.json';
import type { SeasonData } from '../types';
import { computeStandings } from '../utils/standings';
import { computeStreaks } from '../utils/streaks';
import TeamBadge from '../components/TeamBadge';

const data = seasonData as SeasonData;

export default function HallOfShame() {
  const { t } = useTranslation();
  const standings = computeStandings(data);
  const streaks = computeStreaks(data);

  // Ultime 4 squadre
  const bottom = standings.slice(-4).reverse();

  // Peggiori punteggi singoli
  const allScores: { team: string; points: number; md: number }[] = [];
  for (const md of data.matchdays) {
    for (const m of md.matches) {
      if (!m.played) continue;
      allScores.push({ team: m.homeTeam, points: m.homeFantaPoints, md: md.number });
      allScores.push({ team: m.awayTeam, points: m.awayFantaPoints, md: md.number });
    }
  }
  allScores.sort((a, b) => a.points - b.points);
  const worstScores = allScores.slice(0, 10);

  // Peggiori serie di sconfitte
  const worstStreaks = [...streaks].sort((a, b) => b.longestLossStreak - a.longestLossStreak).slice(0, 5);

  // Più sconfitte
  const mostLosses = [...standings].sort((a, b) => b.lost - a.lost).slice(0, 5);

  const shameQuotes = [
    "Tecnicamente ancora in lega... tecnicamente.",
    "Almeno si sono presentati. La maggior parte delle volte.",
    "La loro difesa ha più buchi del groviera.",
    "Il fantacalcio non è per tutti.",
    "Portano gioia... agli avversari.",
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-pitch-dark mb-2">💀 {t('shame.title')}</h1>
      <p className="text-gray-500 mb-8">{t('shame.subtitle')}</p>

      {/* Vetrina squadre ultime in classifica */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        {bottom.map((team, i) => (
          <motion.div
            key={team.team}
            className="glass-card p-6 border-l-4 border-red-400"
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: i * 0.15 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <TeamBadge team={team.team} size="lg" />
              <div>
                <p className="font-bold text-lg text-gray-800">
                  💀 #{standings.length - i} {team.team}
                </p>
                <p className="text-sm text-gray-500">
                  {team.points} pts — {team.won}W {team.drawn}D {team.lost}L
                </p>
              </div>
            </div>
            <p className="text-sm italic text-gray-400 mt-2">"{shameQuotes[i % shameQuotes.length]}"</p>
          </motion.div>
        ))}
      </div>

      {/* Peggiori punteggi */}
      <h2 className="text-2xl font-bold text-pitch-dark mb-4">📉 {t('shame.worstScores')}</h2>
      <div className="glass-card p-4 mb-8">
        <div className="space-y-2">
          {worstScores.map((s, i) => (
            <motion.div
              key={`${s.team}-${s.md}-${i}`}
              className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-red-400">#{i + 1}</span>
                <TeamBadge team={s.team} size="sm" />
                <span className="text-sm font-medium">{s.team}</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-red-600 text-lg">{s.points}</span>
                <span className="text-xs text-gray-400 ml-2">MD {s.md}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Più sconfitte */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-bold text-pitch-dark mb-4">😭 {t('shame.mostLosses')}</h2>
          <div className="glass-card p-4">
            {mostLosses.map((s) => (
              <div key={s.team} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-2">
                  <TeamBadge team={s.team} size="sm" />
                  <span className="text-sm">{s.team}</span>
                </div>
                <span className="font-bold text-red-600">{s.lost} L</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-pitch-dark mb-4">📉 {t('shame.worstStreak')}</h2>
          <div className="glass-card p-4">
            {worstStreaks.map((s) => (
              <div key={s.team} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-2">
                  <TeamBadge team={s.team} size="sm" />
                  <span className="text-sm">{s.team}</span>
                </div>
                <span className="font-bold text-red-600">{s.longestLossStreak} {t('streaks.matches')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
