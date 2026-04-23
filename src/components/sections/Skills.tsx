import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Skills.module.css';

const GROUPS = [
  {
    title: 'Frontend',
    items: ['React 19', 'Next.js', 'Angular 17', 'TypeScript', 'Vite', 'Framer Motion', 'GSAP'],
  },
  {
    title: 'Backend',
    items: ['Node.js', 'Java 17', 'Spring Boot 3', 'REST APIs', 'JWT'],
  },
  {
    title: 'Database',
    items: ['PostgreSQL', 'MongoDB', 'MySQL'],
  },
  {
    title: 'Tools & DevOps',
    items: ['Git', 'GitHub', 'Docker', 'Vercel'],
  },
  {
    title: '3D & Creative',
    items: ['Three.js', 'R3F', 'drei', 'Postprocessing', 'Lenis'],
  },
];

export function Skills() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(`.${styles.group}`, {
        opacity: 0,
        y: 40,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: { trigger: rootRef.current, start: 'top 75%' },
      });
      gsap.from(`.${styles.chip}`, {
        opacity: 0,
        y: 10,
        duration: 0.5,
        ease: 'power2.out',
        stagger: 0.025,
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
    <section className={styles.root} ref={rootRef} id="skills">
      <header className={styles.header} data-speed="1.2">
        <span className={styles.kicker}>// 03 — STACK</span>
        <h2 className={styles.heading}>
          Ferramentas do<br />
          <em>ofício.</em>
        </h2>
      </header>
      <div className={styles.grid}>
        {GROUPS.map((g, i) => (
          <div key={g.title} className={styles.group} data-speed={0.85 + (i % 3) * 0.1}>
            <h3 className={styles.groupTitle}>{g.title}</h3>
            <div className={styles.chips}>
              {g.items.map((it) => (
                <span key={it} className={styles.chip} data-cursor>
                  {it}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
