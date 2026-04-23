import { useEffect, useRef } from 'react';

export function useCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const trailRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(max-width: 768px)').matches) return;

    const dot = cursorRef.current;
    const trail = trailRef.current;
    if (!dot || !trail) return;

    let tx = window.innerWidth / 2, ty = window.innerHeight / 2;
    let dx = tx, dy = ty;
    let lx = tx, ly = ty;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };
    window.addEventListener('mousemove', onMove);

    let raf = 0;
    const tick = () => {
      // dot follows quickly
      dx += (tx - dx) * 0.32;
      dy += (ty - dy) * 0.32;
      // trail follows slowly + scales with velocity
      lx += (tx - lx) * 0.12;
      ly += (ty - ly) * 0.12;
      const vx = tx - lx;
      const vy = ty - ly;
      const speed = Math.min(Math.hypot(vx, vy), 200);
      const scaleX = 1 + speed * 0.006;
      const scaleY = 1 - Math.min(speed * 0.003, 0.3);
      const angle = Math.atan2(vy, vx) * (180 / Math.PI);

      dot.style.transform = `translate3d(${dx}px, ${dy}px, 0) translate(-50%, -50%)`;
      trail.style.transform =
        `translate3d(${lx}px, ${ly}px, 0) translate(-50%, -50%) rotate(${angle}deg) scale(${scaleX}, ${scaleY})`;
      raf = requestAnimationFrame(tick);
    };
    tick();

    const onEnter = () => {
      dot.classList.add('is-hover');
      trail.classList.add('is-hover');
    };
    const onLeave = () => {
      dot.classList.remove('is-hover');
      trail.classList.remove('is-hover');
    };

    const bind = () => {
      document.querySelectorAll('a, button, [data-cursor]').forEach((n) => {
        n.removeEventListener('mouseenter', onEnter);
        n.removeEventListener('mouseleave', onLeave);
        n.addEventListener('mouseenter', onEnter);
        n.addEventListener('mouseleave', onLeave);
      });
    };
    bind();
    const rebindId = window.setInterval(bind, 1500);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
      window.clearInterval(rebindId);
    };
  }, []);

  return { cursorRef, trailRef };
}
