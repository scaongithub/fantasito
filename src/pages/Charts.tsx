import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import seasonData from '../data/season.json';
import type { SeasonData } from '../types';
import { computeStandings, getPointsProgression } from '../utils/standings';
import { getTeamColor } from '../utils/teamUtils';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, Cell,
} from 'recharts';

const data = seasonData as SeasonData;

export default function Charts() {
  const { t } = useTranslation();
  const standings = computeStandings(data);
  const progression = getPointsProgression(data);
  const sortedMd = [...data.matchdays].sort((a, b) => a.number - b.number);

  // Squadre nascoste per ogni grafico
  const [hiddenTeams, setHiddenTeams] = useState<Set<string>>(new Set());
  const [hiddenGoalsSeries, setHiddenGoalsSeries] = useState<Set<string>>(new Set());

  // Gestione click sulla legenda - andamento punti
  const handleTeamLegendClick = useCallback((entry: { dataKey?: string | number | ((obj: unknown) => unknown); value?: string }) => {
    const team = String(entry.dataKey || entry.value || '');
    setHiddenTeams(prev => {
      const next = new Set(prev);
      if (next.has(team)) next.delete(team);
      else next.add(team);
      return next;
    });
  }, []);

  // Gestione click sulla legenda - gol
  const handleGoalsLegendClick = useCallback((entry: { dataKey?: string | number | ((obj: unknown) => unknown); value?: string }) => {
    const key = String(entry.dataKey || entry.value || '');
    setHiddenGoalsSeries(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  // Dati andamento punti
  const progressionData = sortedMd.map((md, i) => {
    const point: Record<string, number | string> = { matchday: `MD ${md.number}` };
    for (const team of data.teams) {
      point[team] = progression.get(team)![i];
    }
    return point;
  });

  // Gol segnati vs subiti
  const goalsData = standings.map(s => ({
    team: s.team,
    scored: s.goalsFor,
    conceded: s.goalsAgainst,
  })).sort((a, b) => b.scored - a.scored);

  // Media fanta punti
  const avgData = standings.map(s => ({
    team: s.team,
    avg: s.played > 0 ? +(s.fantaPointsFor / s.played).toFixed(1) : 0,
  })).sort((a, b) => b.avg - a.avg);

  return (
    <div>
      <h1 className="text-3xl font-bold text-pitch-dark mb-6">📈 {t('charts.title')}</h1>

      {/* Andamento punti */}
      <div className="glass-card p-6 mb-8">
        <h2 className="text-xl font-bold text-pitch-dark mb-4">{t('charts.pointsProgression')}</h2>
        <ResponsiveContainer width="100%" height={450}>
          <LineChart data={progressionData}>
            <XAxis dataKey="matchday" tick={{ fontSize: 10 }} />
            <YAxis />
            <Tooltip />
            <Legend
              wrapperStyle={{ fontSize: 11, cursor: 'pointer' }}
              onClick={handleTeamLegendClick}
              formatter={(value: string) => (
                <span style={{ color: hiddenTeams.has(value) ? '#ccc' : undefined, textDecoration: hiddenTeams.has(value) ? 'line-through' : undefined }}>
                  {value}
                </span>
              )}
            />
            {data.teams.map(team => (
              <Line
                key={team}
                type="monotone"
                dataKey={team}
                stroke={getTeamColor(team)}
                strokeWidth={2}
                dot={false}
                hide={hiddenTeams.has(team)}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Gol segnati vs subiti */}
      <div className="glass-card p-6 mb-8">
        <h2 className="text-xl font-bold text-pitch-dark mb-4">{t('charts.goalsChart')}</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={goalsData} margin={{ left: 0, right: 0 }}>
            <XAxis dataKey="team" tick={{ fontSize: 9, angle: -45, textAnchor: 'end' }} height={80} />
            <YAxis />
            <Tooltip />
            <Legend
              wrapperStyle={{ cursor: 'pointer' }}
              onClick={handleGoalsLegendClick}
              formatter={(value: string) => (
                <span style={{ color: hiddenGoalsSeries.has(value === 'Scored' ? 'scored' : 'conceded') ? '#ccc' : undefined, textDecoration: hiddenGoalsSeries.has(value === 'Scored' ? 'scored' : 'conceded') ? 'line-through' : undefined }}>
                  {value}
                </span>
              )}
            />
            <Bar dataKey="scored" fill="#22c55e" name="Scored" hide={hiddenGoalsSeries.has('scored')} />
            <Bar dataKey="conceded" fill="#ef4444" name="Conceded" hide={hiddenGoalsSeries.has('conceded')} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Media fanta punti */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-bold text-pitch-dark mb-4">{t('charts.fantaPointsAvg')}</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={avgData} layout="vertical" margin={{ left: 120 }}>
            <XAxis type="number" domain={[55, 80]} />
            <YAxis type="category" dataKey="team" tick={{ fontSize: 11 }} width={115} />
            <Tooltip />
            <Bar dataKey="avg" name="Avg Fanta Points">
              {avgData.map((entry, idx) => (
                <Cell key={idx} fill={getTeamColor(entry.team)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
