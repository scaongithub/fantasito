import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import seasonData from '../data/season.json';
import type { SeasonData } from '../types';
import { computeMatchdayKings, computeKingLeaderboard } from '../utils/matchdayKings';
import TeamBadge from '../components/TeamBadge';

const data = seasonData as SeasonData;

export default function MatchdayKings() {
  const { t } = useTranslation();
  const kings = computeMatchdayKings(data);
  const leaderboard = computeKingLeaderboard(data);

  return (
    <div>
      <h1 className="text-3xl font-bold text-pitch-dark mb-2">👑 {t('kings.title')}</h1>
      <p className="text-gray-500 mb-8">{t('kings.subtitle')}</p>

      {/* Classifica corone */}
      <h2 className="text-2xl font-bold text-pitch-dark mb-4">{t('kings.leaderboard')}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {leaderboard.map((k, i) => (
          <motion.div
            key={k.team}
            className={`glass-card p-5 flex items-center gap-4 ${i === 0 ? 'border-2 border-amber-400 bg-amber-50' : ''}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.08 }}
          >
            <span className="text-2xl font-bold text-gray-300">#{i + 1}</span>
            <TeamBadge team={k.team} size="md" />
            <div className="flex-1">
              <p className="font-bold text-sm text-gray-800">{k.team}</p>
              <p className="text-amber-600 font-bold">
                {'👑'.repeat(Math.floor(Math.min(k.crowns, 10)))} ×{k.crowns % 1 === 0 ? k.crowns : k.crowns.toFixed(1)}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recap per giornata */}
      <h2 className="text-2xl font-bold text-pitch-dark mb-4">{t('kings.matchdayRecap')}</h2>
      <div className="glass-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4">{t('common.matchday')}</th>
              <th className="text-left py-3 px-4">👑 {t('kings.king')}</th>
              <th className="text-right py-3 px-4">{t('kings.score')}</th>
            </tr>
          </thead>
          <tbody>
            {kings.map(mk => (
              <tr key={mk.matchday} className="border-b border-gray-50 hover:bg-amber-50 transition-colors">
                <td className="py-2 px-4 font-bold text-gray-600">{mk.matchday}</td>
                <td className="py-2 px-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    {mk.kings.map((k, i) => (
                      <div key={i} className="flex items-center gap-1">
                        <TeamBadge team={k.team} size="sm" />
                        <span className="font-medium">{k.team}</span>
                        {mk.kings.length > 1 && i < mk.kings.length - 1 && (
                          <span className="text-gray-400 mx-1">&</span>
                        )}
                      </div>
                    ))}
                  </div>
                </td>
                <td className="py-2 px-4 text-right font-bold text-amber-600">
                  {mk.kings[0].points}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
