import { useEffect, useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import { projects, type Project } from '../../data/projects';
import styles from './Projects.module.css';

/**
 * Dreaming Gallery — 8 projects, each inside a unique dreamcore vessel:
 * CRT TV on grass, floating window with curtains, stone arch portal, gilded frame,
 * monitor in the void, phone on patterned cloth, roadside billboard, tiny TV on table.
 *
 * Horizontally pinned scroll: each vessel drifts by at its own parallax depth,
 * with sway/glitch ambient motion, and an inner "screen" that animates on hover.
 */

type VesselKind =
  | 'crt-tv'
  | 'sky-window'
  | 'stone-portal'
  | 'gold-frame'
  | 'void-monitor'
  | 'phone-cloth'
  | 'roadside-billboard'
  | 'field-tv';

const VESSEL_MAP: Record<string, VesselKind> = {
  traxus: 'crt-tv',
  taskflow: 'sky-window',
  eventhub: 'stone-portal',
  teamflow: 'gold-frame',
  'trend-crm-erp': 'void-monitor',
  'bradesco-redesign': 'phone-cloth',
  'techstore-v2': 'roadside-billboard',
  'redesign-craigslist': 'field-tv',
};

function Vessel({ project }: { project: Project }) {
  const kind = VESSEL_MAP[project.slug] ?? 'crt-tv';
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // subtle perpetual sway unique to each vessel
    const seed = project.slug.charCodeAt(0) % 7;
    const tween = gsap.to(el, {
      y: `+=${6 + seed}`,
      rotate: `+=${seed % 2 === 0 ? 0.4 : -0.4}`,
      duration: 4 + seed * 0.3,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });
    return () => { tween.kill(); };
  }, [project.slug]);

  return (
    <a
      href={project.deployUrl}
      target="_blank"
      rel="noreferrer"
      className={`${styles.vessel} ${styles[`kind_${kind}`]}`}
      data-cursor
      ref={ref}
    >
      <div className={styles.scene}>
        {/* Ambient layer specific to vessel (ground, cloth, sky, etc) */}
        <div className={styles.ambient} aria-hidden />

        {/* Frame / shell of the vessel (TV body, window frame, arch, etc) */}
        <div className={styles.shell} aria-hidden>
          <div className={styles.shellInner} />
          {kind === 'crt-tv' && (
            <>
              <span className={`${styles.antenna} ${styles.antennaL}`} />
              <span className={`${styles.antenna} ${styles.antennaR}`} />
              <span className={styles.knob} />
              <span className={styles.knob2} />
            </>
          )}
          {kind === 'sky-window' && (
            <>
              <span className={`${styles.curtain} ${styles.curtainL}`} />
              <span className={`${styles.curtain} ${styles.curtainR}`} />
              <span className={styles.sill} />
            </>
          )}
          {kind === 'stone-portal' && (
            <>
              <span className={styles.archBlockL} />
              <span className={styles.archBlockR} />
              <span className={styles.mist} />
            </>
          )}
          {kind === 'gold-frame' && (
            <>
              <span className={styles.goldInner} />
              <span className={styles.goldOrnament} />
            </>
          )}
          {kind === 'void-monitor' && (
            <>
              <span className={styles.monitorStand} />
              <span className={styles.monitorBase} />
            </>
          )}
          {kind === 'phone-cloth' && (
            <>
              <span className={styles.phoneNotch} />
              <span className={styles.phoneSpeaker} />
            </>
          )}
          {kind === 'roadside-billboard' && (
            <>
              <span className={`${styles.billboardPole} ${styles.poleL}`} />
              <span className={`${styles.billboardPole} ${styles.poleR}`} />
              <span className={styles.billboardLight} />
            </>
          )}
          {kind === 'field-tv' && (
            <>
              <span className={styles.tableL} />
              <span className={styles.tableR} />
            </>
          )}
        </div>

        {/* The screen (the project screenshot + scanlines + glitch) */}
        <div className={styles.screen}>
          <img
            src={project.image}
            alt={project.name}
            loading="lazy"
            className={styles.screenImg}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'none';
            }}
          />
          <div className={styles.scanlines} aria-hidden />
          <div className={styles.crtGlow} aria-hidden />
          <div className={styles.noise} aria-hidden />
        </div>

        {/* Floating label card below vessel */}
        <div className={styles.label}>
          <div className={styles.labelTop}>
            <span className={styles.tag}>{project.tag}</span>
            <ArrowUpRight size={14} className={styles.labelArrow} />
          </div>
          <h3 className={styles.name}>{project.name}</h3>
          <p className={styles.desc}>{project.description}</p>
          <div className={styles.stack}>
            {project.stack.slice(0, 4).map((s) => (
              <span key={s} className={styles.chip}>{s}</span>
            ))}
          </div>
        </div>
      </div>
    </a>
  );
}

export function Projects() {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const track = trackRef.current;
      const pin = pinRef.current;
      if (!track || !pin) return;

      const isDesktop = window.matchMedia('(min-width: 900px)').matches;

      if (isDesktop) {
        const scrollAmount = () => track.scrollWidth - pin.clientWidth + 80;
        gsap.to(track, {
          x: () => -scrollAmount(),
          ease: 'none',
          scrollTrigger: {
            trigger: pin,
            pin: true,
            scrub: 1.1,
            start: 'top top',
            end: () => `+=${scrollAmount()}`,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });

        // Per-vessel parallax — each gets a different depth
        gsap.utils.toArray<HTMLElement>(`.${styles.vessel}`).forEach((el, i) => {
          const depth = (i % 3) - 1; // -1, 0, 1
          gsap.to(el, {
            y: depth * 40,
            ease: 'none',
            scrollTrigger: {
              trigger: pin,
              start: 'top top',
              end: () => `+=${track.scrollWidth - pin.clientWidth + 80}`,
              scrub: 1.4,
            },
          });
        });
      }

      gsap.from(`.${styles.kicker}, .${styles.heading}, .${styles.headerDesc}`, {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: { trigger: rootRef.current, start: 'top 80%' },
      });
    }, rootRef);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <section className={styles.root} ref={rootRef} id="projects">
      <header className={styles.header} data-speed="1.15">
        <span className={styles.kicker}>// 02 — DREAMING GALLERY</span>
        <h2 className={styles.heading}>
          Oito<br />
          <em>sonhos</em> enquadrados.
        </h2>
        <p className={styles.headerDesc}>
          Cada projeto vive num portal próprio — TV de tubo, janela suspensa, arco de pedra,
          moldura dourada. Arraste ou role para atravessar a galeria.
        </p>
      </header>

      <div className={styles.pin} ref={pinRef}>
        <div className={styles.skyBackdrop} aria-hidden />
        <div className={styles.groundBackdrop} aria-hidden />
        <div className={styles.track} ref={trackRef}>
          {projects.map((p) => (
            <Vessel key={p.slug} project={p} />
          ))}
          <div className={styles.endcap} aria-hidden>
            <span>// fim do sonho</span>
          </div>
        </div>
      </div>
    </section>
  );
}
