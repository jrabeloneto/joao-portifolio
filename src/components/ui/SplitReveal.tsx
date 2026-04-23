import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type Props = {
  children: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  by?: 'char' | 'word';
  stagger?: number;
  delay?: number;
  start?: string;
  trigger?: 'scroll' | 'mount';
};

/**
 * Splits text into spans and animates each on scroll into view.
 * Letters rise from below with slight rotation + opacity + blur.
 */
export function SplitReveal({
  children,
  className,
  as: Tag = 'span',
  by = 'char',
  stagger = 0.025,
  delay = 0,
  start = 'top 85%',
  trigger = 'scroll',
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const targets = el.querySelectorAll<HTMLElement>('[data-split]');
    if (!targets.length) return;

    gsap.set(targets, { yPercent: 120, opacity: 0, rotate: 6, filter: 'blur(8px)' });

    const anim = {
      yPercent: 0,
      opacity: 1,
      rotate: 0,
      filter: 'blur(0px)',
      duration: 0.9,
      stagger,
      delay,
      ease: 'power3.out',
    };

    let tween: gsap.core.Tween | null = null;
    let st: ScrollTrigger | null = null;

    if (trigger === 'mount') {
      tween = gsap.to(targets, anim);
    } else {
      tween = gsap.to(targets, {
        ...anim,
        scrollTrigger: {
          trigger: el,
          start,
          once: true,
        },
      });
      st = ScrollTrigger.getAll().slice(-1)[0] ?? null;
    }

    return () => {
      tween?.kill();
      st?.kill();
    };
  }, [children, by, stagger, delay, start, trigger]);

  const parts =
    by === 'char'
      ? children.split('').map((c, i) => (
          <span
            key={i}
            data-split
            style={{ display: 'inline-block', whiteSpace: 'pre' }}
          >
            {c}
          </span>
        ))
      : children.split(/(\s+)/).map((w, i) =>
          /\s+/.test(w) ? (
            <span key={i}>{w}</span>
          ) : (
            <span
              key={i}
              data-split
              style={{ display: 'inline-block' }}
            >
              {w}
            </span>
          )
        );

  return (
    // @ts-expect-error dynamic tag
    <Tag ref={ref} className={className} style={{ overflow: 'hidden', display: 'inline-block' }}>
      {parts}
    </Tag>
  );
}
