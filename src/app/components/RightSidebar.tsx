import { motion, AnimatePresence } from 'motion/react';
import type { PlanetInfo } from './planetData';
import type { Lang } from './i18n';
import { UI_TEXT } from './i18n';

interface RightSidebarProps {
  planet: PlanetInfo;
  lang: Lang;
}

function StatRow({ label, value, delay }: { label: string; value: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="flex flex-col gap-0.5"
    >
      <span className="text-xs uppercase tracking-widest" style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>
        {label}
      </span>
      <span className="text-sm text-white" style={{ fontFamily: 'var(--font-mono)' }}>{value}</span>
    </motion.div>
  );
}

export function RightSidebar({ planet, lang }: RightSidebarProps) {
  const t = UI_TEXT[lang];

  return (
    <motion.aside
      initial={{ x: 80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col h-full py-8 px-4 w-[260px] shrink-0 overflow-y-auto"
      style={{
        scrollbarWidth: 'none',
        fontFamily: 'var(--font-body)',
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={planet.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-6 h-full"
        >
          {/* Planet name + glow */}
          <div>
            <motion.div
              className="text-xs uppercase tracking-widest mb-1"
              style={{ color: planet.accentColor, fontFamily: 'var(--font-mono)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.05 }}
            >
              {String(PLANET_INDEX[planet.id]).padStart(2, '0')} / 06
            </motion.div>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                color: '#ffffff',
                letterSpacing: '0.08em',
                lineHeight: 1.1,
                fontSize: '2.2rem',
                fontWeight: 700,
                textShadow: `0 0 30px ${planet.glowColor}`,
              }}
            >
              {planet.name[lang]}
            </h1>
          </div>

          {/* Description */}
          <motion.p
            className="text-sm leading-relaxed"
            style={{ color: 'var(--muted-foreground)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.08 }}
          >
            {planet.description[lang]}
          </motion.p>

          {/* Stats */}
          <div
            className="rounded-xl p-4 flex flex-col gap-4"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <StatRow label={t.diameter} value={planet.diameter} delay={0.1} />
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} />
            <StatRow label={t.atmosphere} value={planet.atmosphere[lang]} delay={0.15} />
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} />
            <StatRow label={t.distanceFromSun} value={planet.distanceFromSun} delay={0.2} />
          </div>

          {/* Facts */}
          <div>
            <div
              className="text-xs uppercase tracking-widest mb-3"
              style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}
            >
              {t.facts}
            </div>
            <div className="flex flex-col gap-2">
              {planet.facts[lang].map((fact, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.07 }}
                  className="flex gap-2.5 text-sm leading-relaxed"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  <span style={{ color: planet.accentColor, marginTop: 2, flexShrink: 0 }}>◆</span>
                  <span>{fact}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Accent bar */}
          <motion.div
            className="mt-auto rounded-full h-0.5 w-full"
            style={{
              background: `linear-gradient(90deg, ${planet.color}, ${planet.accentColor}, transparent)`,
            }}
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          />
        </motion.div>
      </AnimatePresence>
    </motion.aside>
  );
}

const PLANET_INDEX: Record<string, number> = {
  moon: 1, mars: 2, saturn: 3, neptune: 4, jupiter: 5, nova: 6,
};
