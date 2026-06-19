import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function CustomCursor() {
  const cursorRef = useRef({ x: 0, y: 0 });
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const ringPos = useRef({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const rippleId = useRef(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      cursorRef.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };

    const onEnter = (e: MouseEvent) => {
      const target = e.target as Element;
      if (target.closest('button, a, [data-hover], input, select, textarea, [role="button"]')) {
        setIsHovering(true);
      }
    };

    const onLeave = (e: MouseEvent) => {
      const target = e.target as Element;
      if (target.closest('button, a, [data-hover], input, select, textarea, [role="button"]')) {
        setIsHovering(false);
      }
    };

    const onClick = (e: MouseEvent) => {
      const id = rippleId.current++;
      setRipples(r => [...r, { id, x: e.clientX, y: e.clientY }]);
      setTimeout(() => setRipples(r => r.filter(rip => rip.id !== id)), 800);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onEnter);
    document.addEventListener('mouseout', onLeave);
    document.addEventListener('click', onClick);

    const animate = () => {
      const { x, y } = cursorRef.current;
      ringPos.current.x += (x - ringPos.current.x) * 0.12;
      ringPos.current.y += (y - ringPos.current.y) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px)`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onEnter);
      document.removeEventListener('mouseout', onLeave);
      document.removeEventListener('click', onClick);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      <style>{`* { cursor: none !important; }`}</style>

      {/* Dot */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 6,
          height: 6,
          marginLeft: -3,
          marginTop: -3,
          borderRadius: '50%',
          background: '#06b6d4',
          boxShadow: '0 0 8px 2px rgba(6,182,212,0.8)',
          pointerEvents: 'none',
          zIndex: 9999,
          willChange: 'transform',
        }}
      />

      {/* Ring */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: isHovering ? 44 : 28,
          height: isHovering ? 44 : 28,
          marginLeft: isHovering ? -22 : -14,
          marginTop: isHovering ? -22 : -14,
          borderRadius: '50%',
          border: `1.5px solid rgba(139,92,246,${isHovering ? 0.9 : 0.5})`,
          boxShadow: isHovering ? '0 0 16px 3px rgba(139,92,246,0.4)' : '0 0 8px 1px rgba(139,92,246,0.2)',
          pointerEvents: 'none',
          zIndex: 9998,
          willChange: 'transform',
          transition: 'width 0.2s, height 0.2s, margin 0.2s, border-color 0.2s, box-shadow 0.2s',
        }}
      />

      {/* Ripples */}
      {ripples.map(r => (
        <motion.div
          key={r.id}
          initial={{ width: 0, height: 0, opacity: 0.7, x: r.x, y: r.y, marginLeft: 0, marginTop: 0 }}
          animate={{ width: 80, height: 80, opacity: 0, marginLeft: -40, marginTop: -40 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            borderRadius: '50%',
            border: '1px solid rgba(6,182,212,0.7)',
            pointerEvents: 'none',
            zIndex: 9997,
          }}
        />
      ))}
    </>
  );
}
