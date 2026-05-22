import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import seasonData from '../data/season.json';
import type { SeasonData } from '../types';
import { getH2HRecord, getH2HMatrix } from '../utils/headToHead';
import TeamBadge from '../components/TeamBadge';


const data = seasonData as SeasonData;

export default function HeadToHead() {
  const { t } = useTranslation();
  const [teamA, setTeamA] = useState(data.teams[0]);
  const [teamB, setTeamB] = useState(data.teams[1]);
  const [showMatrix, setShowMatrix] = useState(false);

  const record = getH2HRecord(data, teamA, teamB);
  const matrix = getH2HMatrix(data);

  return (
    <div>
      <h1 className="text-3xl font-bold text-pitch-dark mb-6">⚔️ {t('h2h.title')}</h1>

      {/* Selezione squadre */}
      <div className="glass-card p-6 mb-6">
        <p className="text-sm text-gray-500 mb-3">{t('h2h.selectTeams')}</p>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <select
            value={teamA}
            onChange={e => setTeamA(e.target.value)}
            className="w-full sm:w-auto flex-1 px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium"
          >
            {data.teams.map(team => (
              <option key={team} value={team}>{team}</option>
            ))}
          </select>
          <span className="text-xl font-bold text-gray-400">VS</span>
          <select
            value={teamB}
            onChange={e => setTeamB(e.target.value)}
            className="w-full sm:w-auto flex-1 px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium"
          >
            {data.teams.map(team => (
              <option key={team} value={team}>{team}</option>
            ))}
          </select>
        </div>
      </div>

      {teamA !== teamB && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {/* Riepilogo scontro diretto */}
          <div className="glass-card p-6 mb-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <TeamBadge team={teamA} size="lg" />
                <p className="font-bold mt-2 text-sm">{teamA}</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{record.winsA}</p>
                <p className="text-xs text-gray-500">{t('h2h.wins')}</p>
              </div>
              <div>
                <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center mx-auto text-2xl">
                  🤝
                </div>
                <p className="font-bold mt-2 text-sm">&nbsp;</p>
                <p className="text-3xl font-bold text-amber-600 mt-1">{record.draws}</p>
                <p className="text-xs text-gray-500">{t('h2h.draws')}</p>
              </div>
              <div>
                <TeamBadge team={teamB} size="lg" />
                <p className="font-bold mt-2 text-sm">{teamB}</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{record.winsB}</p>
                <p className="text-xs text-gray-500">{t('h2h.wins')}</p>
              </div>
            </div>
            <div className="flex justify-center gap-8 mt-4 text-sm text-gray-600">
              <span>{t('h2h.goals')}: {record.goalsA} - {record.goalsB}</span>
            </div>
          </div>

          {/* Lista partite */}
          <div className="glass-card p-6 mb-6">
            <h3 className="font-bold text-pitch-dark mb-3">{t('h2h.allMatches')}</h3>
            <div className="space-y-2">
              {record.matches.map((m, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0 text-sm">
                  <div className="flex items-center gap-2">
                    <TeamBadge team={m.homeTeam} size="sm" />
                    <span className={m.homeGoals > m.awayGoals ? 'font-bold' : ''}>{m.homeTeam}</span>
                  </div>
                  <div className="bg-gray-100 rounded px-3 py-1 font-bold">{m.result}</div>
                  <div className="flex items-center gap-2">
                    <span className={m.awayGoals > m.homeGoals ? 'font-bold' : ''}>{m.awayTeam}</span>
                    <TeamBadge team={m.awayTeam} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Matrice scontri diretti */}
      <button
        onClick={() => setShowMatrix(!showMatrix)}
        className="glass-card px-6 py-3 w-full text-left font-bold text-pitch-dark cursor-pointer border-none bg-white"
      >
        {showMatrix ? '▲' : '▼'} {t('h2h.matrix')}
      </button>

      {showMatrix && (
        <div className="glass-card p-4 mt-2 overflow-x-auto">
          <table className="text-xs w-full">
            <thead>
              <tr>
                <th className="p-1"></th>
                {matrix.teams.map(team => (
                  <th key={team} className="p-1 text-center" style={{ writingMode: 'vertical-rl', minWidth: 30 }}>
                    <span className="text-xs">{team.slice(0, 8)}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrix.teams.map((team, i) => (
                <tr key={team}>
                  <td className="p-1 font-medium text-right pr-2 whitespace-nowrap">{team.slice(0, 12)}</td>
                  {matrix.matrix[i].map((val, j) => (
                    <td
                      key={j}
                      className="p-1 text-center font-bold"
                      style={{
                        backgroundColor: val === -1 ? '#e5e7eb' : `rgba(34,197,94,${Math.min(val / 10, 1)})`,
                        color: val > 5 ? 'white' : '#1f2937',
                      }}
                    >
                      {val === -1 ? '-' : val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
