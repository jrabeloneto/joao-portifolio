import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import { projects, type Project } from '../../data/projects';
import styles from './Projects.module.css';

function ProjectCard({ project, featured = false }: { project: Project; featured?: boolean }) {
  return (
    <a
      href={project.deployUrl}
      target="_blank"
      rel="noreferrer"
      className={`${styles.card} ${featured ? styles.featured : ''}`}
      data-cursor
    >
      <div className={styles.imageWrap}>
        <div className={styles.imagePlaceholder} aria-hidden />
        <img
          src={project.image}
          alt={project.name}
          className={styles.image}
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = 'none';
          }}
        />
        <div className={styles.overlay}>
          <div className={styles.overlayInner}>
            <span className={styles.overlayTitle}>{project.name}</span>
            <div className={styles.stack}>
              {project.stack.map((s) => (
                <span key={s} className={styles.chip}>{s}</span>
              ))}
            </div>
            <span className={styles.visit}>
              Ver projeto <ArrowUpRight size={16} />
            </span>
          </div>
        </div>
      </div>
      <div className={styles.meta}>
        <div className={styles.metaTop}>
          <span className={styles.tag}>{project.tag}</span>
          <ArrowUpRight size={18} className={styles.metaArrow} />
        </div>
        <h3 className={styles.name}>{project.name}</h3>
        <p className={styles.desc}>{project.description}</p>
      </div>
    </a>
  );
}

export function Projects() {
  const rootRef = useRef<HTMLElement>(null);
  const featured = projects.find((p) => p.featured)!;
  const rest = projects.filter((p) => !p.featured);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(`.${styles.card}`, {
        opacity: 0,
        y: 60,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: { trigger: rootRef.current, start: 'top 75%' },
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
    <section className={styles.root} ref={rootRef} id="projects">
      <header className={styles.header}>
        <span className={styles.kicker}>// 02 — PROJETOS SELECIONADOS</span>
        <h2 className={styles.heading}>
          Trabalho<br />
          <em>recente.</em>
        </h2>
        <p className={styles.headerDesc}>
          Oito projetos recentes — de sistemas fullstack com Spring Boot e Angular
          até experiências 3D com Three.js. Clique para abrir o deploy.
        </p>
      </header>
      <div className={styles.grid}>
        <ProjectCard project={featured} featured />
        <div className={styles.restColumn}>
          {rest.slice(0, 3).map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </div>
      <div className={styles.restGridFull}>
        {rest.slice(3).map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </div>
    </section>
  );
}
