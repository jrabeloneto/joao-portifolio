import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Global parallax. Scans every [data-speed] in the DOM and scroll-links
 * its Y translation. speed=0.3 → slow (background), speed=1 → normal,
 * speed=1.4 → faster (foreground). Also supports [data-rotate] and [data-scale-scroll].
 */
export function useParallaxLayers() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      const els = gsap.utils.toArray<HTMLElement>('[data-speed]');
      els.forEach((el) => {
        const speed = parseFloat(el.dataset.speed || '1');
        const distance = (speed - 1) * 400;
        gsap.fromTo(
          el,
          { y: -distance / 2 },
          {
            y: distance / 2,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.1,
              invalidateOnRefresh: true,
            },
          }
        );
      });

      const rotateEls = gsap.utils.toArray<HTMLElement>('[data-rotate]');
      rotateEls.forEach((el) => {
        const rot = parseFloat(el.dataset.rotate || '0');
        gsap.fromTo(
          el,
          { rotate: -rot },
          {
            rotate: rot,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.4,
            },
          }
        );
      });

      const scaleEls = gsap.utils.toArray<HTMLElement>('[data-scale-scroll]');
      scaleEls.forEach((el) => {
        const to = parseFloat(el.dataset.scaleScroll || '1.1');
        gsap.fromTo(
          el,
          { scale: 1 },
          {
            scale: to,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.4,
            },
          }
        );
      });
    });

    // delay so DOM is painted
    const t = setTimeout(() => ScrollTrigger.refresh(), 300);

    return () => {
      clearTimeout(t);
      ctx.revert();
    };
  }, []);
}
