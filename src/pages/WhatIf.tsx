import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import seasonData from '../data/season.json';
import type { SeasonData } from '../types';
import {
  computeEveVsEve,
  computeHomeStandings,
  computeAwayStandings,
  computeLuckIndex,
} from '../utils/whatIf';
import { computeStandings } from '../utils/standings';
import TeamBadge from '../components/TeamBadge';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';

const data = seasonData as SeasonData;

type Tab = 'eveVsEve' | 'home' | 'away' | 'luck';

export default function WhatIf() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<Tab>('eveVsEve');

  const eveStandings = computeEveVsEve(data);
  const homeStandings = computeHomeStandings(data);
  const awayStandings = computeAwayStandings(data);
  const luckData = computeLuckIndex(data);
  const actualStandings = computeStandings(data);

  const tabs: { key: Tab; label: string; emoji: string }[] = [
    { key: 'eveVsEve', label: t('whatIf.eveVsEve'), emoji: '🌐' },
    { key: 'home', label: t('whatIf.homeOnly'), emoji: '🏠' },
    { key: 'away', label: t('whatIf.awayOnly'), emoji: '✈️' },
    { key: 'luck', label: t('whatIf.luckIndex'), emoji: '🍀' },
  ];

  const renderTable = (standings: typeof actualStandings) => (
    <div className="glass-card overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-3">#</th>
            <th className="text-left py-3 px-3">{t('standings.team')}</th>
            <th className="text-center py-3 px-3">{t('standings.played')}</th>
            <th className="text-center py-3 px-3">{t('standings.won')}</th>
            <th className="text-center py-3 px-3">{t('standings.drawn')}</th>
            <th className="text-center py-3 px-3">{t('standings.lost')}</th>
            <th className="text-center py-3 px-3 font-bold">{t('standings.points')}</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((s, i) => {
            // Trova posizione reale
            const actualPos = actualStandings.findIndex(a => a.team === s.team) + 1;
            const diff = actualPos - (i + 1);

            return (
              <tr key={s.team} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="py-2 px-3 font-bold">{i + 1}</td>
                <td className="py-2 px-3">
                  <div className="flex items-center gap-2">
                    <TeamBadge team={s.team} size="sm" />
                    <span className="font-medium">{s.team}</span>
                    {diff !== 0 && (
                      <span className={`text-xs font-bold ${diff > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {diff > 0 ? `↑${diff}` : `↓${Math.abs(diff)}`}
                      </span>
                    )}
                  </div>
                </td>
                <td className="text-center py-2 px-3">{s.played}</td>
                <td className="text-center py-2 px-3 text-green-600">{s.won}</td>
                <td className="text-center py-2 px-3 text-amber-600">{s.drawn}</td>
                <td className="text-center py-2 px-3 text-red-600">{s.lost}</td>
                <td className="text-center py-2 px-3 font-bold text-lg">{s.points}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  return (
    <div>
      <h1 className="text-3xl font-bold text-pitch-dark mb-6">🤔 {t('whatIf.title')}</h1>

      {/* Schede */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map(tabItem => (
          <button
            key={tabItem.key}
            onClick={() => setTab(tabItem.key)}
            className={`px-4 py-2 rounded-lg font-medium text-sm cursor-pointer border-none transition-all ${
              tab === tabItem.key
                ? 'bg-pitch text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {tabItem.emoji} {tabItem.label}
          </button>
        ))}
      </div>

      {tab === 'eveVsEve' && (
        <div>
          <p className="text-sm text-gray-500 mb-4">{t('whatIf.eveVsEveDesc')}</p>
          {renderTable(eveStandings)}
        </div>
      )}

      {tab === 'home' && renderTable(homeStandings)}
      {tab === 'away' && renderTable(awayStandings)}

      {tab === 'luck' && (
        <div>
          <p className="text-sm text-gray-500 mb-4">{t('whatIf.luckIndexDesc')}</p>
          <div className="glass-card p-6 mb-6">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={luckData} layout="vertical" margin={{ left: 120, right: 20, top: 5, bottom: 5 }}>
                <XAxis type="number" />
                <YAxis type="category" dataKey="team" tick={{ fontSize: 12 }} width={110} />
                <Tooltip />
                <ReferenceLine x={0} stroke="#666" />
                <Bar dataKey="luckIndex" name="Luck Index">
                  {luckData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.luckIndex >= 0 ? '#22c55e' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card p-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3">{t('standings.team')}</th>
                  <th className="text-center py-2 px-3">{t('standings.points')}</th>
                  <th className="text-center py-2 px-3">What If</th>
                  <th className="text-center py-2 px-3">Luck</th>
                </tr>
              </thead>
              <tbody>
                {luckData.map(l => (
                  <tr key={l.team} className="border-b border-gray-50">
                    <td className="py-2 px-3 flex items-center gap-2">
                      <TeamBadge team={l.team} size="sm" />
                      <span className="font-medium">{l.team}</span>
                    </td>
                    <td className="text-center py-2 px-3 font-bold">{l.actualPoints}</td>
                    <td className="text-center py-2 px-3 text-gray-500">{l.whatIfPoints}</td>
                    <td className="text-center py-2 px-3">
                      <span className={`font-bold ${l.luckIndex >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {l.luckIndex > 0 ? '+' : ''}{l.luckIndex} {l.luckIndex >= 0 ? '🍀' : '😢'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
