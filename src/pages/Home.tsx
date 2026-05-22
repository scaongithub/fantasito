import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import seasonData from '../data/season.json';
import type { SeasonData } from '../types';
import { computeStandings } from '../utils/standings';
import { computeSeasonAwards } from '../utils/awards';
import { computeKingLeaderboard } from '../utils/matchdayKings';
import TeamBadge from '../components/TeamBadge';

const data = seasonData as SeasonData;

export default function Home() {
  const { t } = useTranslation();
  const standings = computeStandings(data);
  const champion = standings[0];
  const awards = computeSeasonAwards(data);
  const kings = computeKingLeaderboard(data);

  // Gol totali
  let totalGoals = 0;
  for (const md of data.matchdays) {
    for (const m of md.matches) {
      if (m.played) totalGoals += m.homeGoals + m.awayGoals;
    }
  }

  const statCards = [
    { label: t('home.matchdays'), value: data.matchdays.length, emoji: '📅' },
    { label: t('home.teams'), value: data.teams.length, emoji: '👥' },
    { label: t('home.totalGoals'), value: totalGoals, emoji: '⚽' },
  ];

  return (
    <div>
      {/* Sezione hero */}
      <div className="text-center mb-12">
        <motion.h1
          className="text-4xl sm:text-6xl font-bold text-pitch-dark mb-2"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          ⚽ {t('home.title')}
        </motion.h1>
        <p className="text-lg text-gray-600">{t('home.subtitle')}</p>
      </div>

      {/* Scheda campione */}
      <motion.div
        className="glass-card p-8 mb-8 text-center"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <p className="text-sm uppercase tracking-widest text-gray-500 mb-2">
          {t('home.champion')}
        </p>
        <div className="flex items-center justify-center gap-4 mb-3">
          <TeamBadge team={champion.team} size="lg" />
          <div>
            <h2 className="text-3xl font-bold text-pitch-dark trophy-shimmer">
              🏆 {champion.team}
            </h2>
            <p className="text-gray-600">
              {champion.points} pts — {champion.won}W {champion.drawn}D {champion.lost}L
            </p>
          </div>
        </div>
      </motion.div>

      {/* Schede statistiche */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            className="glass-card p-6 text-center"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 + i * 0.1 }}
          >
            <p className="text-3xl mb-1">{card.emoji}</p>
            <p className="text-3xl font-bold text-pitch-dark">{card.value}</p>
            <p className="text-sm text-gray-500">{card.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Anteprima premi stagionali */}
      <h2 className="text-2xl font-bold text-pitch-dark mb-4">
        {t('home.seasonHighlights')}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {awards.map((award, i) => (
          <motion.div
            key={award.title}
            className="glass-card p-5"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 + i * 0.08 }}
          >
            <p className="text-2xl mb-1">{award.emoji}</p>
            <p className="text-sm text-gray-500 font-medium">{award.titleIt}</p>
            <p className="font-bold text-pitch-dark">{award.team}</p>
            <p className="text-sm text-gray-600">{award.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Anteprima classifica corone */}
      <div className="glass-card p-6 mb-8">
        <h3 className="text-xl font-bold text-pitch-dark mb-3">
          👑 {t('kings.title')}
        </h3>
        <div className="flex flex-wrap gap-3">
          {kings.slice(0, 5).map((k) => (
            <div key={k.team} className="flex items-center gap-2 bg-amber-50 rounded-full px-4 py-2">
              <TeamBadge team={k.team} size="sm" />
              <span className="font-medium text-sm">{k.team}</span>
              <span className="text-amber-600 font-bold">👑 ×{k.crowns}</span>
            </div>
          ))}
        </div>
        <Link to="/matchday-kings" className="text-pitch font-medium text-sm mt-3 inline-block">
          → {t('kings.matchdayRecap')}
        </Link>
      </div>

      {/* Link rapidi */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { to: '/standings', emoji: '📊', label: t('nav.standings') },
          { to: '/head-to-head', emoji: '⚔️', label: t('nav.headToHead') },
          { to: '/hall-of-shame', emoji: '💀', label: t('nav.hallOfShame') },
          { to: '/roast', emoji: '🎤', label: t('nav.memes') },
        ].map(link => (
          <Link
            key={link.to}
            to={link.to}
            className="glass-card p-4 text-center hover:shadow-lg transition-shadow no-underline"
          >
            <p className="text-2xl">{link.emoji}</p>
            <p className="text-sm font-medium text-pitch-dark">{link.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
