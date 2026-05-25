import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { path: '/', key: 'home', emoji: '🏠' },
  { path: '/standings', key: 'standings', emoji: '📊' },
  { path: '/calendar', key: 'calendar', emoji: '📅' },
  { path: '/head-to-head', key: 'headToHead', emoji: '⚔️' },
  { path: '/matchday-kings', key: 'matchdayKings', emoji: '👑' },
  { path: '/awards', key: 'awards', emoji: '🏆' },
  { path: '/hall-of-shame', key: 'hallOfShame', emoji: '💀' },
  { path: '/streaks', key: 'streaks', emoji: '🔥' },
  { path: '/what-if', key: 'whatIf', emoji: '🤔' },
  { path: '/charts', key: 'charts', emoji: '📈' },
  { path: '/roast', key: 'memes', emoji: '🎤' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light') {
      document.documentElement.classList.add('light-theme');
      return 'light';
    } else {
      document.documentElement.classList.remove('light-theme');
      return 'dark';
    }
  });

  const toggleTheme = () => {
    if (theme === 'dark') {
      document.documentElement.classList.add('light-theme');
      localStorage.setItem('theme', 'light');
      setTheme('light');
    } else {
      document.documentElement.classList.remove('light-theme');
      localStorage.setItem('theme', 'dark');
      setTheme('dark');
    }
  };

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === 'it' ? 'en' : 'it');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Intestazione */}
      <header className="pitch-bg text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 no-underline text-white">
            <span className="text-3xl">⚽</span>
            <span className="font-display text-xl font-bold hidden sm:inline">
              Fanta La Sete
            </span>
          </Link>

          {/* Navigazione desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all no-underline ${
                  location.pathname === item.path
                    ? 'bg-white/20 text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="mr-1">{item.emoji}</span>
                {t(`nav.${item.key}`)}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="px-3 py-1.5 rounded-lg bg-white/20 text-white text-sm font-bold hover:bg-white/30 transition-all cursor-pointer border-none"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>

            <button
              onClick={toggleLang}
              className="px-3 py-1.5 rounded-lg bg-white/20 text-white text-sm font-bold hover:bg-white/30 transition-all cursor-pointer border-none"
            >
              {i18n.language === 'it' ? '🇬🇧 EN' : '🇮🇹 IT'}
            </button>

            {/* Pulsante menu mobile */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden px-2 py-1.5 rounded-lg bg-white/20 text-white text-xl cursor-pointer border-none"
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Navigazione mobile */}
        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden overflow-hidden border-t border-white/20"
            >
              <div className="px-4 py-2 grid grid-cols-2 gap-1">
                {navItems.map(item => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMenuOpen(false)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium no-underline ${
                      location.pathname === item.path
                        ? 'bg-white/20 text-white'
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    {item.emoji} {t(`nav.${item.key}`)}
                  </Link>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      {/* Contenuto principale */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Piede pagina */}
      <footer className="pitch-bg text-white/60 text-center py-4 text-sm">
        <p>⚽ Fanta La Sete — Via che la vaga dio canpionato ⚽</p>
        <p className="mt-1 flex items-center justify-center gap-1.5 flex-wrap">
          <span>Made with 💚 and too much fantasy football by SCA</span>
          <a
            href="https://www.linkedin.com/in/carlo-scarsini/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-white/70 hover:text-white transition-colors"
            title="SCA LinkedIn"
          >
            <svg
              className="w-4 h-4 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
          </a>
        </p>
      </footer>
    </div>
  );
}
