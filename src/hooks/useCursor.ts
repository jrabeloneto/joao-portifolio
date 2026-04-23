import { useEffect, useRef } from 'react';

export function useCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(max-width: 768px)').matches) return;

    const el = cursorRef.current;
    if (!el) return;

    let x = 0, y = 0, tx = 0, ty = 0;
    const onMove = (e: MouseEvent) => { tx = e.clientX; ty = e.clientY; };
    window.addEventListener('mousemove', onMove);

    let raf = 0;
    const tick = () => {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };
    tick();

    const onEnter = () => el.classList.add('is-hover');
    const onLeave = () => el.classList.remove('is-hover');

    const bind = () => {
      document.querySelectorAll('a, button, [data-cursor]').forEach((n) => {
        n.removeEventListener('mouseenter', onEnter);
        n.removeEventListener('mouseleave', onLeave);
        n.addEventListener('mouseenter', onEnter);
        n.addEventListener('mouseleave', onLeave);
      });
    };

    // bind initial + rebind after likely DOM changes
    bind();
    const rebindId = window.setInterval(bind, 1500);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
      window.clearInterval(rebindId);
    };
  }, []);

  return cursorRef;
}
