import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import seasonData from '../data/season.json';
import type { SeasonData } from '../types';
import { computeSeasonAwards, computeAwards } from '../utils/awards';
import { computeStandings } from '../utils/standings';
import TeamBadge from '../components/TeamBadge';

const data = seasonData as SeasonData;

export default function Awards() {
  const { t, i18n } = useTranslation();
  const seasonAwards = computeSeasonAwards(data);
  const mdAwards = computeAwards(data);
  const standings = computeStandings(data);

  // Calcolo premi birre per ogni squadra
  const teamPrizes = new Map<string, {
    campionato: number;
    coppa: number;
    battleRoyale: number;
    giornate: number;
    total: number;
  }>();

  for (const team of data.teams) {
    teamPrizes.set(team, { campionato: 0, coppa: 0, battleRoyale: 0, giornate: 0, total: 0 });
  }

  // 1. Campionato
  if (standings[0]) teamPrizes.get(standings[0].team)!.campionato = 280;
  if (standings[1]) teamPrizes.get(standings[1].team)!.campionato = 140;
  if (standings[2]) teamPrizes.get(standings[2].team)!.campionato = 70;

  // 2. Coppa (FC BARCIOLONA ha vinto Coppa e Battle Royale)
  const coppaWinner = 'FC BARCIOLONA';
  if (teamPrizes.has(coppaWinner)) {
    teamPrizes.get(coppaWinner)!.coppa = 140;
  }

  // 3. Battle Royale
  const brWinner = 'FC BARCIOLONA';
  if (teamPrizes.has(brWinner)) {
    teamPrizes.get(brWinner)!.battleRoyale = 30;
  }

  // 4. Matchday highest score (5 birre diviso i vincitori della giornata)
  for (const md of data.matchdays) {
    const playedMatches = md.matches.filter(m => m.played);
    if (playedMatches.length === 0) continue;

    const scores: { team: string; points: number }[] = [];
    for (const m of playedMatches) {
      scores.push({ team: m.homeTeam, points: m.homeFantaPoints });
      scores.push({ team: m.awayTeam, points: m.awayFantaPoints });
    }
    scores.sort((a, b) => b.points - a.points);

    const maxPts = scores[0].points;
    const kings = scores.filter(s => s.points === maxPts);
    const prizePerKing = 5 / kings.length;
    for (const k of kings) {
      if (teamPrizes.has(k.team)) {
        teamPrizes.get(k.team)!.giornate += prizePerKing;
      }
    }
  }

  // 5. Totali
  for (const [_, p] of teamPrizes.entries()) {
    p.total = p.campionato + p.coppa + p.battleRoyale + p.giornate;
  }

  const sortedPrizes = [...teamPrizes.entries()]
    .map(([team, p]) => ({ team, ...p }))
    .sort((a, b) => b.total - a.total);

  const formatBeer = (v: number) => (v % 1 === 0 ? String(v) : v.toFixed(1));

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

      {/* Sezione Montepremi (Prizes at Stake) */}
      <h2 className="text-2xl font-bold text-pitch-dark mb-4">🍻 {t('awards.prizesTitle')}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <div className="glass-card p-5">
          <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">🏆 {t('awards.championship')}</p>
          <div className="mt-3 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">🥇 {t('awards.firstPlace')}</span>
              <span className="font-bold text-amber-500 text-lg">280 🍺</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">🥈 {t('awards.secondPlace')}</span>
              <span className="font-bold text-gray-400 text-lg">140 🍺</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">🥉 {t('awards.thirdPlace')}</span>
              <span className="font-bold text-amber-700 text-lg">70 🍺</span>
            </div>
          </div>
        </div>

        <div className="glass-card p-5">
          <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">🛡️ {t('awards.coppa')}</p>
          <div className="mt-3 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">🥇 {t('awards.firstPlace')}</span>
              <span className="font-bold text-amber-500 text-lg">140 🍺</span>
            </div>
          </div>
        </div>

        <div className="glass-card p-5">
          <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">👑 {t('awards.battleRoyale')}</p>
          <div className="mt-3 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">🥇 {t('awards.firstPlace')}</span>
              <span className="font-bold text-amber-500 text-lg">30 🍺</span>
            </div>
          </div>
        </div>

        <div className="glass-card p-5">
          <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">🔥 {t('awards.matchdayWinner')}</p>
          <div className="mt-3 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">🥇 {t('awards.firstPlace')}</span>
              <span className="font-bold text-amber-500 text-lg">5 🍺</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sezione Premi Guadagnati dalle Squadre (Team Earnings) */}
      <h2 className="text-2xl font-bold text-pitch-dark mb-4">💰 {t('awards.earningsTitle')}</h2>
      <div className="glass-card overflow-x-auto mb-10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4">#</th>
              <th className="text-left py-3 px-4">{t('standings.team')}</th>
              <th className="text-right py-3 px-4">🏆 {t('awards.championship')}</th>
              <th className="text-right py-3 px-4">🛡️ {t('awards.coppa')}</th>
              <th className="text-right py-3 px-4">👑 {t('awards.battleRoyale')}</th>
              <th className="text-right py-3 px-4">⚡ {t('awards.matchdayWinner')}</th>
              <th className="text-right py-3 px-4 font-bold text-amber-600">🍺 {t('awards.totalEarned')}</th>
            </tr>
          </thead>
          <tbody>
            {sortedPrizes.map((p, idx) => (
              <tr key={p.team} className={`border-b border-gray-50 hover:bg-gray-100/50 transition-colors ${idx === 0 ? 'bg-amber-500/10 font-bold' : ''}`}>
                <td className="py-3 px-4 font-bold">{idx + 1}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <TeamBadge team={p.team} size="sm" />
                    <span>{p.team}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-right">{p.campionato > 0 ? `${p.campionato} 🍺` : '-'}</td>
                <td className="py-3 px-4 text-right">{p.coppa > 0 ? `${p.coppa} 🍺` : '-'}</td>
                <td className="py-3 px-4 text-right">{p.battleRoyale > 0 ? `${p.battleRoyale} 🍺` : '-'}</td>
                <td className="py-3 px-4 text-right">{p.giornate > 0 ? `${formatBeer(p.giornate)} 🍺` : '-'}</td>
                <td className="py-3 px-4 text-right font-bold text-amber-600 text-base">{formatBeer(p.total)} 🍺</td>
              </tr>
            ))}
          </tbody>
        </table>
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
