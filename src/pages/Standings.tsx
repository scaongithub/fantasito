import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import seasonData from '../data/season.json';
import type { SeasonData } from '../types';
import { computeStandings } from '../utils/standings';
import TeamBadge from '../components/TeamBadge';
import { getTeamEmoji } from '../utils/teamUtils';

const data = seasonData as SeasonData;

export default function Standings() {
  const { t } = useTranslation();
  const standings = computeStandings(data);

  return (
    <div>
      <h1 className="text-3xl font-bold text-pitch-dark mb-6">📊 {t('standings.title')}</h1>

      <div className="glass-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-3 text-gray-500">#</th>
              <th className="text-left py-3 px-2">{t('standings.team')}</th>
              <th className="text-center py-3 px-2">{t('standings.played')}</th>
              <th className="text-center py-3 px-2">{t('standings.won')}</th>
              <th className="text-center py-3 px-2">{t('standings.drawn')}</th>
              <th className="text-center py-3 px-2">{t('standings.lost')}</th>
              <th className="text-center py-3 px-2">{t('standings.goalsFor')}</th>
              <th className="text-center py-3 px-2">{t('standings.goalsAgainst')}</th>
              <th className="text-center py-3 px-2">{t('standings.goalDifference')}</th>
              <th className="text-center py-3 px-2 font-bold">{t('standings.points')}</th>
              <th className="text-center py-3 px-2 hidden sm:table-cell">{t('standings.fantaPoints')}</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((s, i) => {
              const pos = i + 1;
              const bgClass = pos === 1
                ? 'bg-amber-50'
                : pos <= 3
                ? 'bg-green-50'
                : pos >= 11
                ? 'bg-red-50'
                : '';

              return (
                <motion.tr
                  key={s.team}
                  className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${bgClass}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <td className="py-3 px-3 font-bold text-gray-600">
                    {getTeamEmoji(pos)} {pos}
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      <TeamBadge team={s.team} size="sm" />
                      <span className="font-medium text-gray-800">{s.team}</span>
                    </div>
                  </td>
                  <td className="text-center py-3 px-2 text-gray-600">{s.played}</td>
                  <td className="text-center py-3 px-2 text-green-600 font-medium">{s.won}</td>
                  <td className="text-center py-3 px-2 text-amber-600 font-medium">{s.drawn}</td>
                  <td className="text-center py-3 px-2 text-red-600 font-medium">{s.lost}</td>
                  <td className="text-center py-3 px-2">{s.goalsFor}</td>
                  <td className="text-center py-3 px-2">{s.goalsAgainst}</td>
                  <td className="text-center py-3 px-2 font-medium">
                    <span className={s.goalDifference > 0 ? 'text-green-600' : s.goalDifference < 0 ? 'text-red-600' : ''}>
                      {s.goalDifference > 0 ? '+' : ''}{s.goalDifference}
                    </span>
                  </td>
                  <td className="text-center py-3 px-2 font-bold text-pitch-dark text-lg">{s.points}</td>
                  <td className="text-center py-3 px-2 text-gray-500 hidden sm:table-cell">
                    {s.fantaPointsFor.toFixed(1)}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
