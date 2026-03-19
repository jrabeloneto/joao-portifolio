import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const projects = [
  {
    id: '01',
    category: 'Portfólio',
    title: 'Portfólio Pessoal',
    subtitle: 'React + Framer Motion + Tailwind',
    desc: 'Portfólio profissional desenvolvido em React com animações sofisticadas via Framer Motion, design responsivo mobile-first e foco total na experiência do usuário. Apresenta projetos, competências e informações profissionais de forma clara e moderna.',
    techs: ['React', 'Framer Motion', 'Tailwind CSS', 'Vite', 'Vercel'],
    github: 'https://github.com/jrabeloneto/joao-portifolio',
    demo: 'https://joao-portifolio-rho.vercel.app',
    accent: '#3b82f6',
    mockContent: 'portfolio',
    mockBg: 'linear-gradient(135deg, #060d1f 0%, #0b1d38 60%, #0f2444 100%)',
  },
  {
    id: '02',
    category: 'UX/UI Design',
    title: 'Bradesco App Redesign',
    subtitle: 'React + UX Research + Figma',
    desc: 'Redesign completo do aplicativo mobile do Bradesco com foco em modernizar a experiência do usuário. Projeto desenvolvido com React e Tailwind CSS, aplicando princípios de UX Research, Design System e desenvolvimento mobile-first.',
    techs: ['React', 'Tailwind CSS', 'UX Research', 'Figma', 'Mobile-First'],
    github: 'https://github.com/jrabeloneto/bradesco-app-redesign',
    demo: 'https://bradesco-app-redesign.vercel.app',
    accent: '#10b981',
    mockContent: 'bradesco',
    mockBg: 'linear-gradient(135deg, #0a1628 0%, #0d2137 60%, #0f2c4a 100%)',
  },
  {
    id: '03',
    category: 'E-commerce',
    title: 'TechStore E-commerce',
    subtitle: 'React + TypeScript + Gestão de Estado',
    desc: 'Plataforma de e-commerce completa com catálogo de produtos, carrinho de compras funcional e autenticação de usuários. Desenvolvida com React e TypeScript, arquitetura mobile-first com foco em performance e usabilidade.',
    techs: ['React', 'TypeScript', 'Vite', 'Gestão de Estado', 'Mobile-First'],
    github: 'https://github.com/jrabeloneto/techstore-v2',
    demo: 'https://techstore-v2-85tz.vercel.app',
    accent: '#3b82f6',
    mockContent: 'techstore',
    mockBg: 'linear-gradient(135deg, #060d1f 0%, #0b1d38 60%, #112240 100%)',
  },
  {
    id: '05',
    category: 'Produtividade',
    title: 'TaskFlow Kanban',
    subtitle: 'React 18 + TypeScript + Framer Motion + dnd-kit',
    desc: 'Board Kanban interativo com drag and drop fluido entre colunas, criação e edição de tarefas com modal animado, prioridades coloridas, tags customizáveis, filtros, busca, dark/light mode e persistência via localStorage. Animações sofisticadas com Framer Motion demonstrando domínio de UX/UI.',
    techs: ['React 18', 'TypeScript 5', 'Framer Motion', 'dnd-kit', 'Vite', 'Lucide React'],
    github: 'https://github.com/jrabeloneto/taskflow',
    demo: 'https://taskflow-eight-blond.vercel.app',
    accent: '#6366f1',
    mockContent: 'taskflow_kanban',
    mockBg: 'linear-gradient(135deg, #060d1f 0%, #0d0b2e 60%, #130f3d 100%)',
  },
  {
    id: '06',
    category: 'Angular',
    title: 'EventHub',
    subtitle: 'Angular 17 + Chart.js + Angular Material',
    desc: 'Plataforma de gerenciamento de eventos com dashboard interativo, gráficos de análise com Chart.js, listagem com filtros avançados por categoria e status, e visualização detalhada de cada evento. Desenvolvida com Angular 17 Standalone Components, Angular Material e design responsivo dark-mode.',
    techs: ['Angular 17', 'TypeScript', 'Chart.js', 'Angular Material', 'RxJS', 'Standalone Components'],
    github: 'https://github.com/jrabeloneto/eventhub',
    demo: 'https://eventhub-delta-flame.vercel.app',
    accent: '#f59e0b',
    mockContent: 'eventhub',
    mockBg: 'linear-gradient(135deg, #0d0a00 0%, #1a1200 60%, #221800 100%)',
  },
  {
    id: '04',
    category: 'Full-Stack',
    title: 'TeamFlow',
    subtitle: 'Java 17 + Spring Boot 3 + Angular 17 + JWT',
    desc: 'Sistema completo de gerenciamento de equipes com autenticação JWT, dashboard de métricas, CRUD de equipes e membros, controle de status e paginação. Backend em Java com Spring Boot 3 e Spring Security; frontend em Angular 17 com Standalone Components e Angular Material.',
    techs: ['Java 17', 'Spring Boot 3', 'Angular 17', 'JWT', 'Spring Security', 'JPA/Hibernate', 'TypeScript'],
    github: 'https://github.com/jrabeloneto/teamflow',
    demo: 'https://teamflow-navy.vercel.app',
    accent: '#10b981',
    mockContent: 'teamflow',
    mockBg: 'linear-gradient(135deg, #060d1f 0%, #0a1f14 60%, #0d2b1c 100%)',
  },
]

function ProjectMock({ content, bg, accent }) {
  if (content === 'portfolio') {
    return (
      <div style={{ width: '100%', height: '100%', background: bg, padding: '18px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', gap: '5px', marginBottom: '14px', marginTop: '28px' }}>
          {['#ff5f57', '#febc2e', '#28c840'].map(c => (
            <div key={c} style={{ width: '9px', height: '9px', borderRadius: '50%', background: c }} />
          ))}
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: `linear-gradient(135deg, ${accent}, #10b981)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', fontWeight: '900', color: '#fff', boxShadow: `0 0 20px ${accent}40` }}>JR</div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#f0f6ff', textAlign: 'center', marginBottom: '3px' }}>João Rabelo</div>
            <div style={{ fontSize: '9px', color: '#64748b', textAlign: 'center', marginBottom: '10px' }}>Desenvolvedor Frontend · UX/UI</div>
          </div>
          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {['React', 'Angular', 'Java', 'TS'].map(t => (
              <span key={t} style={{ fontSize: '8px', padding: '2px 6px', background: `${accent}20`, border: `1px solid ${accent}30`, borderRadius: '4px', color: accent }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    )
  }
  if (content === 'bradesco') {
    return (
      <div style={{ width: '100%', height: '100%', background: bg, padding: '18px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', gap: '5px', marginBottom: '14px', marginTop: '28px' }}>
          {['#ff5f57', '#febc2e', '#28c840'].map(c => (
            <div key={c} style={{ width: '9px', height: '9px', borderRadius: '50%', background: c }} />
          ))}
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ width: '100px', background: 'rgba(255,255,255,0.04)', borderRadius: '16px', padding: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `linear-gradient(135deg, ${accent}, #059669)`, margin: '0 auto 10px', boxShadow: `0 0 16px ${accent}40` }} />
            <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', marginBottom: '5px' }} />
            <div style={{ height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', width: '65%', margin: '0 auto 10px' }} />
            {[1, 2, 3].map(i => (
              <div key={i} style={{ height: '22px', background: 'rgba(255,255,255,0.04)', borderRadius: '6px', marginBottom: '5px', border: '1px solid rgba(255,255,255,0.04)' }} />
            ))}
          </div>
        </div>
      </div>
    )
  }
  if (content === 'techstore') {
    return (
      <div style={{ width: '100%', height: '100%', background: bg, padding: '18px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', gap: '5px', marginBottom: '14px', marginTop: '28px' }}>
          {['#ff5f57', '#febc2e', '#28c840'].map(c => (
            <div key={c} style={{ width: '9px', height: '9px', borderRadius: '50%', background: c }} />
          ))}
        </div>
        <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: '7px', alignContent: 'center', justifyContent: 'center' }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={{ width: '56px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px', padding: '7px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ height: '34px', background: `${accent}15`, borderRadius: '4px', marginBottom: '5px' }} />
              <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', marginBottom: '3px' }} />
              <div style={{ height: '3px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', width: '60%' }} />
              <div style={{ marginTop: '5px', height: '13px', background: `${accent}25`, borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '7px', color: accent, fontWeight: '700' }}>COMPRAR</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
  if (content === 'taskflow_kanban') {
    const cols = [
      { label: 'A Fazer', color: '#6366f1', count: 3 },
      { label: 'Em Progresso', color: '#3b82f6', count: 2 },
      { label: 'Concluído', color: '#10b981', count: 4 },
    ]
    return (
      <div style={{ width: '100%', height: '100%', background: bg, padding: '14px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', gap: '5px', marginBottom: '10px', marginTop: '28px' }}>
          {['#ff5f57', '#febc2e', '#28c840'].map(c => (
            <div key={c} style={{ width: '9px', height: '9px', borderRadius: '50%', background: c }} />
          ))}
        </div>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div style={{ fontSize: '10px', fontWeight: '800', color: '#6366f1', letterSpacing: '0.08em' }}>TASKFLOW</div>
          <div style={{ display: 'flex', gap: '4px' }}>
            {['Urgente', 'Alta'].map(p => (
              <span key={p} style={{ fontSize: '6px', padding: '1px 4px', background: p === 'Urgente' ? '#ef444420' : '#f59e0b20', color: p === 'Urgente' ? '#ef4444' : '#f59e0b', borderRadius: '3px' }}>{p}</span>
            ))}
          </div>
        </div>
        {/* Kanban columns */}
        <div style={{ flex: 1, display: 'flex', gap: '7px', overflow: 'hidden' }}>
          {cols.map(col => (
            <div key={col.label} style={{ flex: 1, background: `${col.color}08`, border: `1px solid ${col.color}20`, borderRadius: '8px', padding: '7px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '7px', fontWeight: '700', color: col.color }}>{col.label}</span>
                <span style={{ fontSize: '7px', background: `${col.color}25`, color: col.color, borderRadius: '50%', width: '14px', height: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>{col.count}</span>
              </div>
              {Array.from({ length: Math.min(col.count, 2) }).map((_, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '5px', padding: '5px', border: `1px solid ${col.color}15` }}>
                  <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', marginBottom: '3px', width: `${60 + i * 20}%` }} />
                  <div style={{ height: '3px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', width: '50%' }} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    )
  }
  if (content === 'eventhub') {
    return (
      <div style={{ width: '100%', height: '100%', background: bg, padding: '14px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', gap: '5px', marginBottom: '10px', marginTop: '28px' }}>
          {['#ff5f57', '#febc2e', '#28c840'].map(c => (
            <div key={c} style={{ width: '9px', height: '9px', borderRadius: '50%', background: c }} />
          ))}
        </div>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div style={{ fontSize: '10px', fontWeight: '800', color: accent, letterSpacing: '0.08em' }}>EVENTHUB</div>
          <span style={{ fontSize: '7px', padding: '2px 6px', background: `${accent}20`, color: accent, borderRadius: '4px' }}>Dashboard</span>
        </div>
        {/* Stats */}
        <div style={{ display: 'flex', gap: '5px', marginBottom: '8px' }}>
          {[['8', 'Eventos'], ['1739', 'Inscritos'], ['25%', 'Concluído']].map(([n, l]) => (
            <div key={l} style={{ flex: 1, background: `${accent}10`, border: `1px solid ${accent}20`, borderRadius: '6px', padding: '4px', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', fontWeight: '800', color: accent }}>{n}</div>
              <div style={{ fontSize: '6px', color: '#64748b' }}>{l}</div>
            </div>
          ))}
        </div>
        {/* Chart mock */}
        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '8px', marginBottom: '8px', border: `1px solid ${accent}15` }}>
          <div style={{ fontSize: '7px', color: '#64748b', marginBottom: '6px' }}>Eventos por Mês</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '32px' }}>
            {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
              <div key={i} style={{ flex: 1, height: `${h}%`, background: i === 5 ? accent : `${accent}40`, borderRadius: '2px 2px 0 0' }} />
            ))}
          </div>
        </div>
        {/* Events list */}
        {[['Angular Summit 2026', 'Tech'], ['React Conf Brasil', 'Dev'], ['UX Design Week', 'Design']].map(([name, cat]) => (
          <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '4px 6px', background: 'rgba(255,255,255,0.03)', borderRadius: '5px', marginBottom: '3px', border: '1px solid rgba(255,255,255,0.04)' }}>
            <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: accent, flexShrink: 0 }} />
            <div style={{ flex: 1, fontSize: '7px', color: '#94a3b8', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</div>
            <span style={{ fontSize: '6px', padding: '1px 4px', background: `${accent}20`, color: accent, borderRadius: '3px' }}>{cat}</span>
          </div>
        ))}
      </div>
    )
  }
  if (content === 'teamflow') {
    return (
      <div style={{ width: '100%', height: '100%', background: bg, padding: '18px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', gap: '5px', marginBottom: '14px', marginTop: '28px' }}>
          {['#ff5f57', '#febc2e', '#28c840'].map(c => (
            <div key={c} style={{ width: '9px', height: '9px', borderRadius: '50%', background: c }} />
          ))}
        </div>
        {/* Header mock */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ fontSize: '11px', fontWeight: '800', color: accent, letterSpacing: '0.08em' }}>TEAMFLOW</div>
          <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: `${accent}30`, border: `1px solid ${accent}50`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '8px', color: accent, fontWeight: '700' }}>JR</span>
          </div>
        </div>
        {/* Stats row */}
        <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
          {[['4', 'Equipes'], ['12', 'Membros'], ['3', 'Ativos']].map(([n, l]) => (
            <div key={l} style={{ flex: 1, background: `${accent}10`, border: `1px solid ${accent}20`, borderRadius: '6px', padding: '5px', textAlign: 'center' }}>
              <div style={{ fontSize: '13px', fontWeight: '800', color: accent }}>{n}</div>
              <div style={{ fontSize: '7px', color: '#64748b' }}>{l}</div>
            </div>
          ))}
        </div>
        {/* Team list mock */}
        {[['Backend Team', 'Java', '#10b981'], ['Frontend Squad', 'Angular', '#3b82f6'], ['DevOps', 'Docker', '#10b981']].map(([name, tech, clr]) => (
          <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 7px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', marginBottom: '4px', border: '1px solid rgba(255,255,255,0.04)' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: clr, flexShrink: 0 }} />
            <div style={{ flex: 1, fontSize: '8px', color: '#94a3b8', fontWeight: '600' }}>{name}</div>
            <span style={{ fontSize: '7px', padding: '1px 5px', background: `${clr}20`, color: clr, borderRadius: '3px' }}>{tech}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

function ProjectCard({ project, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [hovered, setHovered] = useState(false)
  const isEven = index % 2 === 0

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{ width: '100%', maxWidth: '100%' }}
    >
      <motion.div
        animate={hovered ? { y: -5 } : { y: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
          background: 'rgba(11,29,56,0.7)',
          border: `1px solid ${hovered ? project.accent + '35' : 'rgba(255,255,255,0.05)'}`,
          borderRadius: '20px',
          overflow: 'hidden',
          transition: 'border-color 0.3s, box-shadow 0.3s',
          boxShadow: hovered ? `0 20px 60px rgba(0,0,0,0.4), 0 0 30px ${project.accent}12` : '0 4px 20px rgba(0,0,0,0.2)',
          width: '100%',
          maxWidth: '100%',
        }}
      >
        {/* Preview visual */}
        <div style={{
          order: isEven ? 0 : 1,
          minHeight: '200px',
          position: 'relative',
          overflow: 'hidden',
          borderRight: isEven ? '1px solid rgba(255,255,255,0.04)' : 'none',
          borderLeft: !isEven ? '1px solid rgba(255,255,255,0.04)' : 'none',
        }}>
          <ProjectMock content={project.mockContent} bg={project.mockBg} accent={project.accent} />
          {/* Número decorativo */}
          <div style={{
            position: 'absolute', bottom: '10px', right: '14px',
            fontSize: '52px', fontWeight: '900',
            color: 'rgba(255,255,255,0.04)',
            lineHeight: 1, userSelect: 'none',
            letterSpacing: '-0.05em',
          }}>
            {project.id}
          </div>
          {/* Badge categoria */}
          <div style={{
            position: 'absolute', top: '14px', left: '14px',
            padding: '4px 10px',
            background: `${project.accent}15`,
            border: `1px solid ${project.accent}30`,
            borderRadius: '6px',
            fontSize: '10px', fontWeight: '700',
            color: project.accent,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            zIndex: 10,
            backdropFilter: 'blur(8px)',
          }}>
            {project.category}
          </div>
        </div>

        {/* Conteúdo */}
        <div style={{
          order: isEven ? 1 : 0,
          padding: 'clamp(22px, 3.5vw, 36px)',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
        }}>
          <h3 style={{
            fontSize: 'clamp(18px, 2.5vw, 24px)', fontWeight: '800',
            color: '#f0f6ff', letterSpacing: '-0.02em', marginBottom: '5px',
          }}>
            {project.title}
          </h3>
          <p style={{ fontSize: '12px', color: project.accent, fontWeight: '600', marginBottom: '12px' }}>
            {project.subtitle}
          </p>
          <p style={{
            fontSize: 'clamp(12px, 1.6vw, 14px)', color: '#64748b',
            lineHeight: '1.7', marginBottom: '18px',
          }}>
            {project.desc}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '20px' }}>
            {project.techs.map(tech => (
              <span key={tech} style={{
                padding: '3px 9px',
                background: `${project.accent}15`,
                border: `1px solid ${project.accent}30`,
                borderRadius: '5px',
                fontSize: '11px', fontWeight: '600',
                color: project.accent,
              }}>
                {tech}
              </span>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {project.github && (
              <motion.a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  padding: '8px 16px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: '#94a3b8', textDecoration: 'none',
                  fontSize: '12px', fontWeight: '600',
                  transition: 'all 0.2s',
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </motion.a>
            )}
            {project.demo && (
              <motion.a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.04, boxShadow: `0 0 20px ${project.accent}35` }}
                whileTap={{ scale: 0.96 }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  padding: '8px 16px',
                  background: `linear-gradient(135deg, ${project.accent}, ${project.accent === '#3b82f6' ? '#2563eb' : '#059669'})`,
                  borderRadius: '8px',
                  color: '#fff', textDecoration: 'none',
                  fontSize: '12px', fontWeight: '700',
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  <polyline points="15 3 21 3 21 9"/>
                  <line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
                Demo ao Vivo
              </motion.a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function AnimatedSection({ children, delay = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

export default function Projects() {
  return (
    <section id="projects" style={{ padding: 'clamp(60px, 10vw, 120px) 20px', position: 'relative' }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.2), transparent)',
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', right: '-5%', width: '400px', height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%)',
        filter: 'blur(40px)', pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <AnimatedSection>
          <div style={{ marginBottom: '52px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '4px 14px', borderRadius: '9999px',
              border: '1px solid rgba(59,130,246,0.2)',
              background: 'rgba(59,130,246,0.06)',
              marginBottom: '16px',
            }}>
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#3b82f6', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Portfolio
              </span>
            </div>
            <h2 style={{
              fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: '900',
              letterSpacing: '-0.03em', color: '#f0f6ff', lineHeight: 1.1,
            }}>
              Projetos <span style={{
                background: 'linear-gradient(135deg, #3b82f6, #10b981)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>Destacados</span>
            </h2>
            <p style={{
              marginTop: '16px', fontSize: 'clamp(14px, 2vw, 17px)',
              color: '#64748b', maxWidth: '500px', lineHeight: '1.7',
            }}>
              Projetos reais que demonstram habilidades em desenvolvimento frontend, UX/UI Design e TypeScript.
            </p>
          </div>
        </AnimatedSection>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', overflow: 'hidden' }}>
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>

        <AnimatedSection delay={0.3}>
          <div style={{ marginTop: '44px', textAlign: 'center' }}>
            <motion.a
              href="https://github.com/jrabeloneto"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.04, borderColor: 'rgba(59,130,246,0.4)' }}
              whileTap={{ scale: 0.96 }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '12px 28px',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px',
                textDecoration: 'none',
                fontSize: '14px', fontWeight: '600', color: '#94a3b8',
                transition: 'all 0.2s',
              }}
            >
              Ver todos os repositórios no GitHub
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </motion.a>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
