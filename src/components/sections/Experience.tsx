import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Experience.module.css';

const ENTRIES = [
  {
    when: 'Atual',
    where: 'AI.OTIK — Manaus, BR',
    title: 'Software Lead & Fullstack Developer',
    body:
      'Liderança técnica de equipe de desenvolvimento. Arquitetura de produtos digitais do backend ao frontend 3D. Stack principal: React, Node.js, TypeScript, Python.',
  },
  {
    when: '2024 — 2029 (previsto)',
    where: 'Centro Universitário Fametro',
    title: 'Bacharelado em Engenharia de Software',
    body:
      'Formação acadêmica em engenharia de software com foco em arquitetura de sistemas, algoritmos e desenvolvimento web.',
  },
  {
    when: 'Mandato Estadual',
    where: 'Ordem DeMolay',
    title: 'Mestre Conselheiro Estadual',
    body:
      'Liderança, gestão de pessoas e organização de eventos em escala estadual. Formação em oratória, tomada de decisão e desenvolvimento de times.',
  },
];

export function Experience() {
  const rootRef = useRef<HTMLElement>(null);
  const lineRef = useRef<SVGLineElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (lineRef.current) {
        const length = 1000;
        gsap.set(lineRef.current, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(lineRef.current, {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top 70%',
            end: 'bottom 80%',
            scrub: true,
          },
        });
      }
      gsap.from(`.${styles.entry}`, {
        opacity: 0,
        x: 60,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.2,
        scrollTrigger: { trigger: rootRef.current, start: 'top 70%' },
      });
      gsap.from(`.${styles.kicker}, .${styles.heading}`, {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: { trigger: rootRef.current, start: 'top 80%' },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.root} ref={rootRef} id="experience">
      <header className={styles.header} data-speed="1.15">
        <span className={styles.kicker}>// 04 — EXPERIÊNCIA</span>
        <h2 className={styles.heading}>
          O caminho<br />
          <em>até aqui.</em>
        </h2>
      </header>
      <div className={styles.timeline}>
        <svg className={styles.svg} viewBox="0 0 20 1000" preserveAspectRatio="none" aria-hidden>
          <line ref={lineRef} x1="10" y1="0" x2="10" y2="1000" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        <ol className={styles.list}>
          {ENTRIES.map((e, i) => (
            <li key={i} className={styles.entry} data-speed={1 + (i - 1) * 0.08}>
              <span className={styles.dot} />
              <span className={styles.when}>{e.when}</span>
              <h3 className={styles.title}>{e.title}</h3>
              <span className={styles.where}>{e.where}</span>
              <p className={styles.body}>{e.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
