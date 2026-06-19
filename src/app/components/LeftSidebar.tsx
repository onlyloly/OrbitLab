import { motion, AnimatePresence } from 'motion/react';
import type { PlanetId, PlanetInfo } from './planetData';
import type { Lang } from './i18n';
import { UI_TEXT } from './i18n';

interface LeftSidebarProps {
  planets: PlanetInfo[];
  activePlanet: PlanetId;
  onSelect: (id: PlanetId) => void;
  lang: Lang;
  onLangToggle: () => void;
}

const PLANET_ICONS: Record<PlanetId, string> = {
  moon: '🌙',
  mars: '🔴',
  saturn: '🪐',
  neptune: '🔵',
  jupiter: '🟠',
  nova: '✨',
};

export function LeftSidebar({ planets, activePlanet, onSelect, lang, onLangToggle }: LeftSidebarProps) {
  const t = UI_TEXT[lang];

  return (
    <motion.aside
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={{ fontFamily: 'var(--font-body)' }}
      className="flex flex-col justify-between h-full py-8 px-4 w-[200px] shrink-0"
    >
      {/* Logo */}
      <div>
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.12em' }}
            className="text-white text-xl font-semibold tracking-widest">
            {t.orbitlab}
          </div>
          <div className="text-xs mt-1" style={{ color: 'var(--muted-foreground)', letterSpacing: '0.08em' }}>
            {t.tagline}
          </div>
        </motion.div>

        {/* Planet nav */}
        <nav className="flex flex-col gap-1">
          {planets.map((planet, i) => {
            const isActive = planet.id === activePlanet;
            return (
              <motion.button
                key={planet.id}
                data-hover
                onClick={() => onSelect(planet.id)}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 + i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ x: 4 }}
                className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors duration-200"
                style={{
                  background: isActive
                    ? 'rgba(139, 92, 246, 0.18)'
                    : 'transparent',
                  border: isActive
                    ? '1px solid rgba(139, 92, 246, 0.35)'
                    : '1px solid transparent',
                }}
              >
                {/* Active indicator */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      layoutId="planet-indicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full"
                      style={{ background: 'var(--primary)' }}
                      initial={{ opacity: 0, scaleY: 0 }}
                      animate={{ opacity: 1, scaleY: 1 }}
                      exit={{ opacity: 0, scaleY: 0 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </AnimatePresence>

                <span className="text-base leading-none">{PLANET_ICONS[planet.id]}</span>
                <span
                  className="text-sm transition-colors duration-200"
                  style={{
                    color: isActive ? '#ffffff' : 'var(--muted-foreground)',
                    fontWeight: isActive ? 500 : 400,
                  }}
                >
                  {planet.name[lang]}
                </span>

                {isActive && (
                  <motion.div
                    layoutId="planet-glow"
                    className="absolute inset-0 rounded-xl pointer-events-none"
                    style={{
                      boxShadow: `0 0 16px 1px ${planet.glowColor}`,
                    }}
                  />
                )}
              </motion.button>
            );
          })}
        </nav>
      </div>

      {/* Lang toggle */}
      <motion.button
        data-hover
        onClick={onLangToggle}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.96 }}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm self-start"
        style={{
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)',
          color: 'var(--muted-foreground)',
          fontFamily: 'var(--font-mono)',
          letterSpacing: '0.05em',
        }}
      >
        <span style={{ color: lang === 'en' ? 'var(--accent)' : 'inherit' }}>EN</span>
        <span style={{ color: 'rgba(255,255,255,0.2)' }}>/</span>
        <span style={{ color: lang === 'ru' ? 'var(--accent)' : 'inherit' }}>RU</span>
      </motion.button>
    </motion.aside>
  );
}
