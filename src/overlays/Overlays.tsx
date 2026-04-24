import { useEffect, useState } from 'react';
import { scrollState, subscribe, CH, envelope, range } from '../state/scroll';
import { projects } from '../data/projects';
import { SKILLS, CATEGORY_COLOR } from '../data/skills';
import styles from './Overlays.module.css';

/** Re-render on scroll state change */
function useScroll() {
  const [, setTick] = useState(0);
  useEffect(() => {
    const unsub = subscribe(() => setTick((t) => t + 1));
    return () => { unsub(); };
  }, []);
  return scrollState;
}

function chapterStyle(op: number, extra: React.CSSProperties = {}): React.CSSProperties {
  return { opacity: op, pointerEvents: op > 0.5 ? 'auto' : 'none', ...extra };
}

const ROLES = ['React & Node', 'Three.js & 3D Web', 'Angular & Spring Boot', 'Design Systems'];

export function Overlays() {
  const s = useScroll();
  const p = s.progress;

  const [roleIdx, setRoleIdx] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setRoleIdx((i) => (i + 1) % ROLES.length), 2800);
    return () => window.clearInterval(id);
  }, []);

  const heroOp = envelope(p, CH.hero[0], CH.hero[1], 0.04);
  const aboutOp = envelope(p, CH.about[0], CH.about[1], 0.04);
  const approachOp = envelope(p, CH.approach[0], CH.approach[1], 0.04);
  const skillsOp = envelope(p, CH.skills[0], CH.skills[1], 0.04);
  const projOp = envelope(p, CH.projects[0], CH.projects[1], 0.03);
  const expOp = envelope(p, CH.experience[0], CH.experience[1], 0.04);
  const stormOp = envelope(p, CH.storm[0], CH.storm[1], 0.03);
  const fieldOp = envelope(p, CH.field[0], CH.field[1], 0.04);
  const houseOp = envelope(p, CH.house[0], CH.house[1], 0.03);

  const projLocal = range(p, CH.projects[0], CH.projects[1]);
  const projIdx = Math.min(projects.length - 1, Math.round(projLocal * (projects.length - 1)));
  const activeProj = projects[projIdx];

  const hovered = s.hoveredSkill;
  const hoveredSkill = hovered >= 0 ? SKILLS[hovered] : null;

  return (
    <>
      {/* HERO — kicker at top, title center */}
      <section className={styles.layer} style={chapterStyle(heroOp)}>
        <span className={`${styles.kicker} ${styles.kickerTopLeft}`}>// portfolio · v2 · 2026</span>
        <div className={styles.heroCenter}>
          <h1 className={styles.heroTitle}>
            <span>JOÃO</span>
            <span>RABELO</span>
          </h1>
          <p className={styles.heroSub}>Software Lead · Fullstack Engineer · Manaus, BR</p>
          <div className={styles.roles}>
            <span className={styles.rolesLabel}>// stack atual</span>
            <span key={roleIdx} className={styles.role}>{ROLES[roleIdx]}</span>
          </div>
        </div>
        <div className={styles.scrollHint}>
          <span>scroll</span>
          <div className={styles.scrollLine} />
        </div>
      </section>

      {/* ABOUT — professional, no company */}
      <section className={styles.layer} style={chapterStyle(aboutOp)}>
        <span className={styles.kicker}>// 01 — sobre</span>
        <h2 className={styles.h2}>engenheiro<br />de <em>software</em></h2>
        <p className={styles.paragraph}>
          Atuo na interseção entre <strong>engenharia sólida</strong> e
          <em> design de interação</em>. Especialista em construir produtos
          fullstack performáticos — do desenho da API ao último pixel de animação.
        </p>
        <p className={styles.paragraph} style={{ marginTop: '1.2rem', fontSize: '1.1rem' }}>
          Gosto de problemas difíceis: sistemas distribuídos, performance de render 3D,
          arquiteturas que escalam sem colapsar o time.
        </p>
        <div className={styles.stats}>
          <div><span className={styles.statNum}>3+</span><span>anos</span></div>
          <div><span className={styles.statNum}>15+</span><span>projetos entregues</span></div>
          <div><span className={styles.statNum}>12</span><span>stacks dominadas</span></div>
        </div>
      </section>

      {/* APPROACH — new section, 4 pillars */}
      <section className={styles.layer} style={chapterStyle(approachOp)}>
        <span className={styles.kicker}>// 02 — princípios</span>
        <h2 className={styles.h2}>código<br />com <em>intenção</em></h2>
        <div className={styles.pillars}>
          <div className={styles.pillar}>
            <span className={styles.pillarNum}>01</span>
            <h4>Arquitetura antes de código</h4>
            <p>Cada sistema começa com boundaries claros, contratos bem definidos, e uma razão pra cada decisão.</p>
          </div>
          <div className={styles.pillar}>
            <span className={styles.pillarNum}>02</span>
            <h4>Performance é feature</h4>
            <p>TTI, bundle size, render time. Se não é medido, não existe. Otimização vem das métricas, não do feeling.</p>
          </div>
          <div className={styles.pillar}>
            <span className={styles.pillarNum}>03</span>
            <h4>UX é engenharia</h4>
            <p>Animações, micro-interações e fluxo não são decoração — são contratos de usabilidade.</p>
          </div>
          <div className={styles.pillar}>
            <span className={styles.pillarNum}>04</span>
            <h4>Ship, measure, iterate</h4>
            <p>Código em produção é o único código que importa. Feedback loops curtos vencem planos perfeitos.</p>
          </div>
        </div>
      </section>

      {/* SKILLS — interactive constellation */}
      <section className={styles.layer} style={chapterStyle(skillsOp)}>
        <span className={styles.kicker}>// 03 — constelação de skills</span>
        <h2 className={styles.h2}>{SKILLS.length} pontos<br /><em>navegáveis</em></h2>
        <p className={styles.skillHint}>
          mova o cursor sobre os pontos na constelação →
          <br />cada ponto é uma tecnologia
        </p>
        {/* category legend */}
        <div className={styles.legend}>
          {Object.entries(CATEGORY_COLOR).map(([cat, col]) => (
            <span key={cat} className={styles.legendItem}>
              <span className={styles.legendDot} style={{ background: col }} />
              {cat}
            </span>
          ))}
        </div>
      </section>

      {/* Tooltip follows cursor when hovering a skill */}
      {hoveredSkill && (
        <div
          className={styles.skillTooltip}
          style={{
            left: s.skillHoverX,
            top: s.skillHoverY,
            borderColor: CATEGORY_COLOR[hoveredSkill.category],
          }}
        >
          <span className={styles.tooltipTag} style={{ color: CATEGORY_COLOR[hoveredSkill.category] }}>
            {hoveredSkill.category} · {hoveredSkill.level}
          </span>
          <span className={styles.tooltipName}>{hoveredSkill.name}</span>
        </div>
      )}

      {/* PROJECTS — long scroll */}
      <section className={styles.layerBottom} style={chapterStyle(projOp)}>
        <span className={styles.kicker}>
          // 04 — projetos · {String(projIdx + 1).padStart(2, '0')} / {projects.length}
        </span>
        <h3 className={styles.projName} key={activeProj.slug}>{activeProj.name}</h3>
        <p className={styles.projTag}>{activeProj.tag}</p>
        <p className={styles.projDesc}>{activeProj.description}</p>
        <div className={styles.projStack}>
          {activeProj.stack.map((st) => <span key={st} className={styles.chip}>{st}</span>)}
        </div>
        <div className={styles.projLinks}>
          <a href={activeProj.deployUrl} target="_blank" rel="noreferrer">LIVE ↗</a>
          <a href={activeProj.githubUrl} target="_blank" rel="noreferrer">CODE ↗</a>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section className={styles.layer} style={chapterStyle(expOp)}>
        <span className={styles.kicker}>// 05 — trajetória</span>
        <h2 className={styles.h2}>anos<br /><em>em luz</em></h2>
        <ul className={styles.timeline}>
          <li>
            <span className={styles.when}>2024 — presente</span>
            <span className={styles.role2}>Software Lead</span>
            <span className={styles.where}>Liderança técnica · arquitetura fullstack · IA aplicada</span>
          </li>
          <li>
            <span className={styles.when}>2023 — 2024</span>
            <span className={styles.role2}>Fullstack Developer</span>
            <span className={styles.where}>Spring Boot + Angular · CRM/ERP empresarial</span>
          </li>
          <li>
            <span className={styles.when}>2022 — 2023</span>
            <span className={styles.role2}>Frontend Developer</span>
            <span className={styles.where}>React · TypeScript · design systems</span>
          </li>
          <li>
            <span className={styles.when}>2021 — 2022</span>
            <span className={styles.role2}>Junior Developer</span>
            <span className={styles.where}>Primeiros sistemas em produção · fundamentos</span>
          </li>
        </ul>
      </section>

      {/* STORM — existential transition */}
      <section className={styles.layer} style={chapterStyle(stormOp)}>
        <span className={styles.kicker}>// 06 — tempestade</span>
        <h2 className={styles.h2}>no olho<br /><em>do caos</em></h2>
        <p className={styles.paragraph} style={{ maxWidth: '32ch' }}>
          Todo produto nasce no breu. Raios iluminam padrões que estavam ali o tempo todo —
          só esperando alguém com coragem de olhar.
        </p>
        <p className={styles.stormHint}>
          <em>a lua reage ao cursor · passe por cima dela</em>
        </p>
      </section>

      {/* FIELD — descent */}
      <section className={styles.layer} style={chapterStyle(fieldOp)}>
        <span className={styles.kicker}>// 07 — descida</span>
        <h2 className={styles.h2Light}>a casa<br /><em>na colina</em></h2>
        <p className={styles.paragraphLight} style={{ maxWidth: '36ch' }}>
          Depois da tempestade, o campo. O horizonte azul. A casa onde as ideias viram código.
        </p>
      </section>

      {/* HOUSE / CONTACT */}
      <section className={styles.layer} style={chapterStyle(houseOp)}>
        <span className={styles.kicker}>// 08 — contato</span>
        <h2 className={styles.h2}>vamos<br /><em>construir</em></h2>
        <div className={styles.contactTerminal}>
          <div className={styles.terminalHeader}>
            <span className={styles.terminalDot} style={{ background: '#ff5f56' }} />
            <span className={styles.terminalDot} style={{ background: '#ffbd2e' }} />
            <span className={styles.terminalDot} style={{ background: '#27c93f' }} />
            <span className={styles.terminalTitle}>~/joao · contact.sh</span>
          </div>
          <div className={styles.terminalBody}>
            <p><span className={styles.prompt}>$</span> whoami</p>
            <p className={styles.output}>joao_rabelo_neto</p>
            <p><span className={styles.prompt}>$</span> cat contact.txt</p>
            <p className={styles.output}>
              <a href="mailto:jrabeloneto2@gmail.com">jrabeloneto2@gmail.com</a>
            </p>
            <p><span className={styles.prompt}>$</span> ls ./links/</p>
            <p className={styles.output}>
              <a href="https://github.com/jrabeloneto" target="_blank" rel="noreferrer">github.com/jrabeloneto ↗</a><br />
              <a href="https://www.linkedin.com/in/joao-rabelo-neto" target="_blank" rel="noreferrer">linkedin/joao-rabelo-neto ↗</a>
            </p>
            <p><span className={styles.prompt}>$</span> <span className={styles.cursor}>_</span></p>
          </div>
        </div>
        <div className={styles.footer}>
          <span>© 2026 — João Rabelo Neto</span>
          <span>Manaus · AM · BR</span>
        </div>
      </section>

      <div className={styles.progress}>
        <div className={styles.progressBar} style={{ transform: `scaleX(${p})` }} />
        <span>{Math.round(p * 100).toString().padStart(2, '0')}</span>
      </div>
    </>
  );
}
