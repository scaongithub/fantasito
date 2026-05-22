import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import seasonData from '../data/season.json';
import type { SeasonData } from '../types';
import { computeStreaks } from '../utils/streaks';
import TeamBadge from '../components/TeamBadge';
import { getFormDot } from '../utils/teamUtils';

const data = seasonData as SeasonData;

export default function Streaks() {
  const { t } = useTranslation();
  const streaks = computeStreaks(data);

  const sortedByWin = [...streaks].sort((a, b) => b.longestWinStreak - a.longestWinStreak);
  const sortedByUnbeaten = [...streaks].sort((a, b) => b.longestUnbeatenStreak - a.longestUnbeatenStreak);

  return (
    <div>
      <h1 className="text-3xl font-bold text-pitch-dark mb-6">🔥 {t('streaks.title')}</h1>

      {/* Forma attuale */}
      <h2 className="text-2xl font-bold text-pitch-dark mb-4">{t('streaks.currentForm')}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        {streaks.map((s, i) => (
          <motion.div
            key={s.team}
            className="glass-card p-4 flex items-center gap-3"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: i * 0.05 }}
          >
            <TeamBadge team={s.team} size="sm" />
            <span className="font-medium text-sm flex-1 min-w-0 truncate">{s.team}</span>
            <div className="flex gap-1">
              {s.currentForm.map((r, j) => {
                const dot = getFormDot(r);
                return (
                  <span
                    key={j}
                    className="form-dot"
                    style={{ backgroundColor: dot.color }}
                  >
                    {dot.label}
                  </span>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tabelle serie */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-bold text-pitch-dark mb-3">🏆 {t('streaks.longestWin')}</h2>
          <div className="glass-card p-4">
            {sortedByWin.map((s) => (
              <div key={s.team} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-2">
                  <TeamBadge team={s.team} size="sm" />
                  <span className="text-sm">{s.team}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-green-600">{s.longestWinStreak}</span>
                  <span className="text-xs text-gray-400">{t('streaks.matches')}</span>
                  <div className="w-16 h-2 bg-gray-200 rounded-full ml-2 overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${(s.longestWinStreak / sortedByWin[0].longestWinStreak) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-pitch-dark mb-3">🛡️ {t('streaks.longestUnbeaten')}</h2>
          <div className="glass-card p-4">
            {sortedByUnbeaten.map((s) => (
              <div key={s.team} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-2">
                  <TeamBadge team={s.team} size="sm" />
                  <span className="text-sm">{s.team}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-blue-600">{s.longestUnbeatenStreak}</span>
                  <span className="text-xs text-gray-400">{t('streaks.matches')}</span>
                  <div className="w-16 h-2 bg-gray-200 rounded-full ml-2 overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${(s.longestUnbeatenStreak / sortedByUnbeaten[0].longestUnbeatenStreak) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
