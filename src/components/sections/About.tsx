import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './About.module.css';

const STATS = [
  { value: 3, suffix: '+', label: 'anos de experiência' },
  { value: 15, suffix: '+', label: 'projetos entregues' },
  { value: 5, suffix: '', label: 'tecnologias dominadas' },
];

function useCountUp(ref: React.RefObject<HTMLSpanElement | null>, end: number) {
  useEffect(() => {
    if (!ref.current) return;
    const obj = { v: 0 };
    const tween = gsap.to(obj, {
      v: end,
      duration: 1.8,
      ease: 'power2.out',
      onUpdate: () => {
        if (ref.current) ref.current.textContent = Math.round(obj.v).toString();
      },
      scrollTrigger: { trigger: ref.current, start: 'top 90%', once: true },
    });
    return () => { tween.kill(); };
  }, [ref, end]);
}

function StatItem({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useCountUp(ref, value);
  return (
    <div className={styles.stat}>
      <span className={styles.statValue}>
        <span ref={ref}>0</span>
        {suffix}
      </span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  );
}

export function About() {
  const rootRef = useRef<HTMLElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(`.${styles.paragraph}`, {
        opacity: 0,
        y: 24,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: { trigger: rootRef.current, start: 'top 70%' },
      });
      gsap.from(`.${styles.kicker}`, {
        opacity: 0,
        x: -20,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: { trigger: rootRef.current, start: 'top 75%' },
      });
      gsap.to(visualRef.current, {
        y: -80,
        ease: 'none',
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.root} ref={rootRef} id="about">
      <div className={styles.grid}>
        <div className={styles.left}>
          <span className={styles.kicker}>// 01 — SOBRE</span>
          <p className={styles.paragraph}>
            Software Lead na <strong>AI.OTIK</strong>, de Manaus pro mundo.
          </p>
          <p className={styles.paragraph}>
            Lidero times e construo produtos onde engenharia dura encontra estética cinematográfica —
            do backend em <em>Spring Boot</em> ao frontend 3D em <em>Three.js</em>.
          </p>
          <p className={styles.paragraph}>
            Obcecado por problemas difíceis, interfaces que respiram, e por transformar o
            <span className={styles.highlight}> impossível em possível</span>.
          </p>
        </div>
        <div className={styles.right} ref={visualRef}>
          <div className={styles.visualCard}>
            <div className={styles.visualInner}>
              <span className={styles.visualMono}>// fullstack</span>
              <span className={styles.visualBig}>JR</span>
              <span className={styles.visualFooter}>
                <span>ver. 2026</span>
                <span>AM · BR</span>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.stats}>
        {STATS.map((s) => (
          <StatItem key={s.label} {...s} />
        ))}
      </div>
    </section>
  );
}
