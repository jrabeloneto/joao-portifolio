import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scrollState, notify } from '../state/scroll';

gsap.registerPlugin(ScrollTrigger);

/**
 * Lenis smooth scroll driving the global progress (0..1).
 * A tall spacer provides the scrollable range; window.scrollY maps to progress.
 */
export function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    });

    lenis.on('scroll', () => {
      ScrollTrigger.update();
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollState.progress = max > 0 ? window.scrollY / max : 0;
      scrollState.velocity = (lenis as unknown as { velocity: number }).velocity || 0;
      notify();
    });
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    const onMouse = (e: MouseEvent) => {
      scrollState.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      scrollState.mouseY = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', onMouse);

    // Initial push
    const max = document.documentElement.scrollHeight - window.innerHeight;
    scrollState.progress = max > 0 ? window.scrollY / max : 0;
    notify();

    return () => {
      lenis.destroy();
      window.removeEventListener('pointermove', onMouse);
    };
  }, []);
}
