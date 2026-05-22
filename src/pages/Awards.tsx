import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import seasonData from '../data/season.json';
import type { SeasonData } from '../types';
import { computeSeasonAwards, computeAwards } from '../utils/awards';
import TeamBadge from '../components/TeamBadge';

const data = seasonData as SeasonData;

export default function Awards() {
  const { t, i18n } = useTranslation();
  const seasonAwards = computeSeasonAwards(data);
  const mdAwards = computeAwards(data);

  return (
    <div>
      <h1 className="text-3xl font-bold text-pitch-dark mb-6">🏆 {t('awards.title')}</h1>

      {/* Premi stagionali */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {seasonAwards.map((award, i) => (
          <motion.div
            key={award.title}
            className="glass-card p-6 text-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.1, type: 'spring' }}
          >
            <p className="text-4xl mb-2">{award.emoji}</p>
            <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">
              {i18n.language === 'it' ? award.titleIt : award.title}
            </p>
            <div className="flex justify-center my-3">
              <TeamBadge team={award.team.split(' vs ')[0]} size="lg" />
            </div>
            <p className="font-bold text-pitch-dark text-lg">{award.team}</p>
            <p className="text-sm text-gray-600">{award.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Tabella premi per giornata */}
      <h2 className="text-2xl font-bold text-pitch-dark mb-4">{t('awards.matchdayAwards')}</h2>
      <div className="glass-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-3">{t('common.matchday')}</th>
              <th className="text-left py-3 px-3">🔥 {t('awards.highestScore')}</th>
              <th className="text-left py-3 px-3">💀 {t('awards.lowestScore')}</th>
              <th className="text-left py-3 px-3 hidden sm:table-cell">💪 {t('awards.biggestWin')}</th>
            </tr>
          </thead>
          <tbody>
            {mdAwards.map(a => (
              <tr key={a.matchday} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="py-2 px-3 font-bold">{a.matchday}</td>
                <td className="py-2 px-3">
                  <div className="flex items-center gap-2">
                    <TeamBadge team={a.highestScore.team} size="sm" />
                    <span>{a.highestScore.team}</span>
                    <span className="text-xs text-amber-600 font-bold">{a.highestScore.points}</span>
                  </div>
                </td>
                <td className="py-2 px-3">
                  <div className="flex items-center gap-2">
                    <TeamBadge team={a.lowestScore.team} size="sm" />
                    <span>{a.lowestScore.team}</span>
                    <span className="text-xs text-red-500 font-bold">{a.lowestScore.points}</span>
                  </div>
                </td>
                <td className="py-2 px-3 hidden sm:table-cell text-xs text-gray-600">
                  {a.biggestWin.home} {a.biggestWin.result} {a.biggestWin.away}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
