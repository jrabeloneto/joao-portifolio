import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { HeroScene } from '../three/HeroScene';
import styles from './Hero.module.css';

const ROLES = ['React & Node', 'Three.js & 3D Web', 'Angular & Spring Boot'];

export function Hero() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [roleIdx, setRoleIdx] = useState(0);

  useEffect(() => {
    const id = window.setInterval(
      () => setRoleIdx((i) => (i + 1) % ROLES.length),
      2800
    );
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(`.${styles.titleLine}`, {
        yPercent: 110,
        opacity: 0,
        stagger: 0.12,
        duration: 1.2,
        ease: 'power4.out',
        delay: 0.3,
      });
      gsap.from(`.${styles.subtitle}`, {
        opacity: 0,
        y: 20,
        duration: 1,
        delay: 1.2,
        ease: 'power2.out',
      });
      gsap.from(`.${styles.rolesWrap}, .${styles.cta}, .${styles.scroll}`, {
        opacity: 0,
        y: 20,
        duration: 1,
        delay: 1.4,
        stagger: 0.1,
        ease: 'power2.out',
      });
      gsap.from(`.${styles.canvas}`, {
        opacity: 0,
        duration: 2,
        delay: 0.6,
        ease: 'power2.out',
      });
      gsap.from(`.${styles.kicker}, .${styles.cornerMeta}`, {
        opacity: 0,
        duration: 1,
        delay: 1.6,
        ease: 'power2.out',
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.root} ref={rootRef}>
      <div className={styles.canvas}>
        <HeroScene />
      </div>
      <div className={styles.vignette} aria-hidden />

      <span className={styles.kicker}>// portfolio · v2 · 2026</span>

      <div className={styles.content}>
        <h1 className={styles.title}>
          <span className={styles.lineWrap}>
            <span className={styles.titleLine}>JOÃO</span>
          </span>
          <span className={styles.lineWrap}>
            <span className={styles.titleLine}>RABELO</span>
          </span>
        </h1>
        <p className={styles.subtitle}>
          Software Lead · Fullstack Developer · Manaus, BR
        </p>
        <div className={styles.rolesWrap}>
          <span className={styles.rolesLabel}>// currently building with</span>
          <span key={roleIdx} className={styles.role}>
            {ROLES[roleIdx]}
          </span>
        </div>
        <a href="#projects" className={styles.cta} data-cursor>
          <span>VER PROJETOS</span>
        </a>
      </div>

      <div className={styles.cornerMeta}>
        <span>lat −3.1190</span>
        <span>lng −60.0217</span>
        <span>AM · BR</span>
      </div>

      <div className={styles.scroll}>
        <span>scroll</span>
        <div className={styles.scrollLine} />
      </div>
    </section>
  );
}
