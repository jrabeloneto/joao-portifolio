import { useEffect, useRef, useState } from 'react';
import { scrollState, subscribe, CH, envelope, range } from '../state/scroll';
import { projects } from '../data/projects';
import styles from './Overlays.module.css';

/** Hook: re-render whenever scroll state changes */
function useScroll() {
  const [, setTick] = useState(0);
  useEffect(() => {
    const unsub = subscribe(() => setTick((t) => t + 1));
    return () => { unsub(); };
  }, []);
  return scrollState;
}

/** Cheap helper: CSS var for envelope opacity */
function chapterStyle(op: number, extra: React.CSSProperties = {}): React.CSSProperties {
  return {
    opacity: op,
    pointerEvents: op > 0.5 ? 'auto' : 'none',
    ...extra,
  };
}

const ROLES = ['React & Node', 'Three.js & 3D Web', 'Angular & Spring Boot'];

export function Overlays() {
  const s = useScroll();
  const p = s.progress;

  // role rotator
  const [roleIdx, setRoleIdx] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setRoleIdx((i) => (i + 1) % ROLES.length), 2800);
    return () => window.clearInterval(id);
  }, []);

  /* ------------- HERO ------------- */
  const heroOp = envelope(p, CH.hero[0], CH.hero[1], 0.06);
  const heroY = -range(p, CH.hero[0], CH.hero[1]) * 60;

  /* ------------- ABOUT ------------ */
  const aboutOp = envelope(p, CH.about[0], CH.about[1], 0.05);
  const aboutLocal = range(p, CH.about[0], CH.about[1]);

  /* ------------- PROJECTS -------- */
  const projOp = envelope(p, CH.projects[0], CH.projects[1], 0.04);
  const projLocal = range(p, CH.projects[0], CH.projects[1]);
  const projIdx = Math.min(projects.length - 1, Math.round(projLocal * (projects.length - 1)));
  const activeProj = projects[projIdx];

  /* ------------- SKILLS ---------- */
  const skillsOp = envelope(p, CH.skills[0], CH.skills[1], 0.05);

  /* ------------- EXPERIENCE ------ */
  const expOp = envelope(p, CH.experience[0], CH.experience[1], 0.05);

  /* ------------- CONTACT --------- */
  const contOp = envelope(p, CH.contact[0], CH.contact[1], 0.04);

  return (
    <>
      {/* HERO */}
      <section className={styles.layer} style={chapterStyle(heroOp, { transform: `translateY(${heroY}px)` })}>
        <span className={styles.kicker}>// portfolio · v2 · 2026</span>
        <h1 className={styles.heroTitle}>
          <span>JOÃO</span>
          <span>RABELO</span>
        </h1>
        <p className={styles.heroSub}>Software Lead · Fullstack Developer · Manaus, BR</p>
        <div className={styles.roles}>
          <span className={styles.rolesLabel}>// currently building with</span>
          <span key={roleIdx} className={styles.role}>{ROLES[roleIdx]}</span>
        </div>
        <div className={styles.scrollHint}>
          <span>scroll</span>
          <div className={styles.scrollLine} />
        </div>
      </section>

      {/* ABOUT */}
      <section className={styles.layer} style={chapterStyle(aboutOp)}>
        <span className={styles.kicker}>// 01 — sobre</span>
        <h2 className={styles.h2}>
          do backend ao<br /><em>frontend 3D</em>
        </h2>
        <p className={styles.paragraph} style={{ opacity: aboutLocal > 0.2 ? 1 : 0, transition: 'opacity 0.6s' }}>
          Software Lead na <strong>AI.OTIK</strong>. De Manaus pro mundo.
          Construo produtos onde engenharia dura encontra estética cinematográfica —
          do Spring Boot ao Three.js.
        </p>
        <div className={styles.stats}>
          <div><span className={styles.statNum}>3+</span><span>anos</span></div>
          <div><span className={styles.statNum}>15+</span><span>projetos</span></div>
          <div><span className={styles.statNum}>5</span><span>stacks</span></div>
        </div>
      </section>

      {/* PROJECTS */}
      <section className={styles.layerBottom} style={chapterStyle(projOp)}>
        <span className={styles.kicker}>// 02 — projetos · {String(projIdx + 1).padStart(2, '0')} / {projects.length}</span>
        <h3 className={styles.projName} key={activeProj.slug}>{activeProj.name}</h3>
        <p className={styles.projTag}>{activeProj.tag}</p>
        <p className={styles.projDesc}>{activeProj.description}</p>
        <div className={styles.projStack}>
          {activeProj.stack.map((s) => <span key={s} className={styles.chip}>{s}</span>)}
        </div>
        <div className={styles.projLinks}>
          <a href={activeProj.deployUrl} target="_blank" rel="noreferrer">LIVE ↗</a>
          <a href={activeProj.githubUrl} target="_blank" rel="noreferrer">CODE ↗</a>
        </div>
      </section>

      {/* SKILLS */}
      <section className={styles.layer} style={chapterStyle(skillsOp)}>
        <span className={styles.kicker}>// 03 — skills</span>
        <h2 className={styles.h2}>constelação<br /><em>de ferramentas</em></h2>
        <div className={styles.skillsGrid}>
          <div>
            <h4>frontend</h4>
            <span>React · TypeScript · Angular · Next · Three.js · GSAP · CSS</span>
          </div>
          <div>
            <h4>backend</h4>
            <span>Node · Spring Boot · Java · PostgreSQL · REST · WebSockets</span>
          </div>
          <div>
            <h4>tools</h4>
            <span>Git · Docker · Vercel · Vite · Figma · Linux</span>
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section className={styles.layer} style={chapterStyle(expOp)}>
        <span className={styles.kicker}>// 04 — experiência</span>
        <h2 className={styles.h2}>trajetória<br /><em>em luz</em></h2>
        <ul className={styles.timeline}>
          <li>
            <span className={styles.when}>2024 — presente</span>
            <span className={styles.role2}>Software Lead @ AI.OTIK</span>
            <span className={styles.where}>Liderança técnica, arquitetura fullstack, IA aplicada</span>
          </li>
          <li>
            <span className={styles.when}>2023 — 2024</span>
            <span className={styles.role2}>Fullstack Developer</span>
            <span className={styles.where}>Spring Boot + Angular, CRM/ERP empresarial</span>
          </li>
          <li>
            <span className={styles.when}>2022 — 2023</span>
            <span className={styles.role2}>Frontend Developer</span>
            <span className={styles.where}>React, TypeScript, design systems</span>
          </li>
        </ul>
      </section>

      {/* CONTACT */}
      <section className={styles.layer} style={chapterStyle(contOp)}>
        <span className={styles.kicker}>// 05 — contato</span>
        <h2 className={styles.h2}>vamos<br /><em>construir algo</em></h2>
        <div className={styles.contactLinks}>
          <a href="mailto:joao.cunha.rabelo.neto@gmail.com">joao.cunha.rabelo.neto@gmail.com ↗</a>
          <a href="https://github.com/jrabeloneto" target="_blank" rel="noreferrer">github.com/jrabeloneto ↗</a>
          <a href="https://www.linkedin.com/in/joao-rabelo-neto" target="_blank" rel="noreferrer">linkedin ↗</a>
        </div>
        <div className={styles.footer}>
          <span>© 2026 — João Rabelo Neto</span>
          <span>Manaus · AM · BR</span>
        </div>
      </section>

      {/* Persistent progress indicator */}
      <div className={styles.progress}>
        <div className={styles.progressBar} style={{ transform: `scaleX(${p})` }} />
        <span>{Math.round(p * 100).toString().padStart(2, '0')}</span>
      </div>
    </>
  );
}
