import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import seasonData from '../data/season.json';
import type { SeasonData } from '../types';
import { computeAwards } from '../utils/awards';
import TeamBadge from '../components/TeamBadge';

const data = seasonData as SeasonData;

export default function Calendar() {
  const { t } = useTranslation();
  const [openMd, setOpenMd] = useState<number | null>(null);
  const awards = computeAwards(data);
  const sortedMd = [...data.matchdays].sort((a, b) => a.number - b.number);

  return (
    <div>
      <h1 className="text-3xl font-bold text-pitch-dark mb-6">📅 {t('calendar.title')}</h1>

      <div className="space-y-3">
        {sortedMd.map(md => {
          const isOpen = openMd === md.number;
          const award = awards.find(a => a.matchday === md.number);

          return (
            <div key={md.number} className="glass-card overflow-hidden">
              <button
                onClick={() => setOpenMd(isOpen ? null : md.number)}
                className="w-full px-5 py-4 flex items-center justify-between cursor-pointer bg-transparent border-none text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-pitch-dark">
                    {md.number}
                  </span>
                  <div>
                    <p className="font-medium text-gray-800">
                      {t('calendar.matchday')} {md.number}
                    </p>
                    {md.serieAMatchday && (
                      <p className="text-xs text-gray-500">
                        {t('calendar.serieA')}: Giornata {md.serieAMatchday}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {award && (
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                      {t('calendar.mvp')}: {award.highestScore.team} ({award.highestScore.points})
                    </span>
                  )}
                  <span className="text-xl">{isOpen ? '▲' : '▼'}</span>
                </div>
              </button>

              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="border-t border-gray-100 px-5 py-4"
                >
                  <div className="space-y-3">
                    {md.matches.filter(m => m.played).map((m, i) => {
                      const homeWin = m.homeGoals > m.awayGoals;
                      const awayWin = m.awayGoals > m.homeGoals;

                      return (
                        <div key={i} className="flex items-center justify-between gap-2 py-2 border-b border-gray-50 last:border-0">
                          <div className={`flex items-center gap-2 flex-1 justify-end ${homeWin ? 'font-bold' : ''}`}>
                            <span className="text-sm text-right">{m.homeTeam}</span>
                            <TeamBadge team={m.homeTeam} size="sm" />
                          </div>
                          <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-1 min-w-fit">
                            <span className="text-xs text-gray-400">{m.homeFantaPoints}</span>
                            <span className="font-bold text-pitch-dark text-lg">{m.result}</span>
                            <span className="text-xs text-gray-400">{m.awayFantaPoints}</span>
                          </div>
                          <div className={`flex items-center gap-2 flex-1 ${awayWin ? 'font-bold' : ''}`}>
                            <TeamBadge team={m.awayTeam} size="sm" />
                            <span className="text-sm">{m.awayTeam}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
