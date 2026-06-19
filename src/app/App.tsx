import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CustomCursor } from './components/CustomCursor';
import { PlanetScene } from './components/PlanetScene';
import { LeftSidebar } from './components/LeftSidebar';
import { RightSidebar } from './components/RightSidebar';
import { PLANETS } from './components/planetData';
import type { PlanetId } from './components/planetData';
import type { Lang } from './components/i18n';
import { UI_TEXT } from './components/i18n';

const TRANSITION_DURATION = 900;

export default function App() {
  const [activePlanet, setActivePlanet] = useState<PlanetId>('moon');
  const [pendingPlanet, setPendingPlanet] = useState<PlanetId | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [lang, setLang] = useState<Lang>(() => {
    const stored = localStorage.getItem('orbitlab-lang') as Lang | null;
    return stored === 'ru' ? 'ru' : 'en';
  });

  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);

  const t = UI_TEXT[lang];

  const planet = PLANETS.find(p => p.id === activePlanet)!;

  const handleSelectPlanet = useCallback((id: PlanetId) => {
    if (id === activePlanet || transitioning) return;
    setTransitioning(true);
    setPendingPlanet(id);
    setTimeout(() => {
      setActivePlanet(id);
      setTransitioning(false);
      setPendingPlanet(null);
    }, TRANSITION_DURATION);
  }, [activePlanet, transitioning]);

  const handleLangToggle = useCallback(() => {
    setLang(l => {
      const next = l === 'en' ? 'ru' : 'en';
      localStorage.setItem('orbitlab-lang', next);
      return next;
    });
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const cx = e.clientX / window.innerWidth - 0.5;
      const cy = e.clientY / window.innerHeight - 0.5;
      setMouseX(cx);
      setMouseY(cy);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <div
      className="size-full overflow-hidden select-none"
      style={{ background: 'var(--background)', color: 'var(--foreground)' }}
    >
      <CustomCursor />

      {/* Space transition overlay */}
      <AnimatePresence>
        {transitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 pointer-events-none z-30"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(5,5,16,0) 40%, rgba(5,5,16,0.6) 100%)',
            }}
          />
        )}
      </AnimatePresence>

      {/* Nebula background */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `
            radial-gradient(ellipse 60% 50% at 20% 70%, rgba(139,92,246,0.06) 0%, transparent 60%),
            radial-gradient(ellipse 50% 40% at 80% 30%, rgba(6,182,212,0.05) 0%, transparent 60%),
            radial-gradient(ellipse 40% 60% at 50% 50%, rgba(30,20,60,0.4) 0%, transparent 80%)
          `,
        }}
      />

      {/* Main layout */}
      <div className="relative z-10 size-full flex items-stretch">
        {/* Left sidebar */}
        <div
          className="flex items-center"
          style={{
            background: 'rgba(5,5,20,0.5)',
            backdropFilter: 'blur(20px)',
            borderRight: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <LeftSidebar
            planets={PLANETS}
            activePlanet={activePlanet}
            onSelect={handleSelectPlanet}
            lang={lang}
            onLangToggle={handleLangToggle}
          />
        </div>

        {/* Center: 3D scene */}
        <div className="flex-1 relative">
          <PlanetScene
            activePlanet={activePlanet}
            mouseX={mouseX}
            mouseY={mouseY}
            transitioning={transitioning}
          />

          {/* Bottom hint */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-xs"
            style={{
              color: 'rgba(255,255,255,0.25)',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.06em',
              pointerEvents: 'none',
            }}
          >
            <span style={{ color: 'rgba(139,92,246,0.5)' }}>⬡</span>
            {t.dragToRotate}
            <span style={{ color: 'rgba(139,92,246,0.5)' }}>⬡</span>
          </motion.div>

          {/* Planet name overlay */}
          <AnimatePresence mode="wait">
            {!transitioning && (
              <motion.div
                key={activePlanet + '-overlay'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute top-8 left-1/2 -translate-x-1/2 pointer-events-none"
              >
                <div
                  className="px-4 py-1.5 rounded-full text-xs tracking-widest uppercase"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: planet.accentColor,
                    fontFamily: 'var(--font-mono)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  {planet.name[lang]}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Transit warp lines */}
          <AnimatePresence>
            {transitioning && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 pointer-events-none overflow-hidden"
              >
                {Array.from({ length: 20 }, (_, i) => (
                  <motion.div
                    key={i}
                    initial={{
                      opacity: 0,
                      scaleX: 0,
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      opacity: [0, 0.6, 0],
                      scaleX: [0, 1, 0],
                    }}
                    transition={{
                      duration: 0.6 + Math.random() * 0.4,
                      delay: Math.random() * 0.3,
                      ease: 'easeInOut',
                    }}
                    style={{
                      position: 'absolute',
                      height: 1,
                      width: `${30 + Math.random() * 60}%`,
                      background: `linear-gradient(90deg, transparent, ${i % 2 === 0 ? 'rgba(139,92,246,0.6)' : 'rgba(6,182,212,0.6)'}, transparent)`,
                      transformOrigin: 'center',
                    }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right sidebar */}
        <div
          className="flex items-center"
          style={{
            background: 'rgba(5,5,20,0.5)',
            backdropFilter: 'blur(20px)',
            borderLeft: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <RightSidebar planet={planet} lang={lang} />
        </div>
      </div>

      {/* Scroll zoom info - small keyboard shortcut pill */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="fixed bottom-4 right-4 z-20 flex gap-1.5 items-center pointer-events-none"
      >
        <div
          className="px-2 py-1 rounded text-xs"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: 'rgba(255,255,255,0.2)',
            fontFamily: 'var(--font-mono)',
          }}
        >
          OrbitLab v1.0
        </div>
      </motion.div>
    </div>
  );
}
