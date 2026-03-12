import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const projects = [
  {
    id: 1,
    tag: 'Destaque',
    tagColor: '#f59e0b',
    title: 'Portfolio Pessoal',
    subtitle: 'React + Framer Motion + Tailwind',
    desc: 'Portfólio profissional desenvolvido em React com animações sofisticadas via Framer Motion, design responsivo mobile-first e foco total na experiência do usuário. Apresenta projetos, competências e informações profissionais de forma clara e moderna.',
    techs: ['React', 'Framer Motion', 'Tailwind CSS', 'Vite', 'Vercel'],
    github: 'https://github.com/jrabeloneto/joao-portifolio',
    demo: 'https://joao-portifolio-rho.vercel.app',
    color: '#f59e0b',
    number: '01',
  },
  {
    id: 2,
    tag: 'UX/UI Design',
    tagColor: '#10b981',
    title: 'Bradesco App Redesign',
    subtitle: 'React + UX Research + Figma',
    desc: 'Redesign completo do aplicativo mobile do Bradesco com foco em modernizar a experiência do usuário. Projeto desenvolvido com React e Tailwind CSS, aplicando princípios de UX Research, Design System e desenvolvimento mobile-first.',
    techs: ['React', 'Tailwind CSS', 'UX Research', 'Figma', 'Mobile-First'],
    github: 'https://github.com/jrabeloneto/bradesco-redesign',
    demo: null,
    color: '#10b981',
    number: '02',
  },
  {
    id: 3,
    tag: 'E-commerce',
    tagColor: '#f59e0b',
    title: 'TechStore E-commerce',
    subtitle: 'React + TypeScript + Gestão de Estado',
    desc: 'Plataforma de e-commerce completa com catálogo de produtos, carrinho de compras funcional e autenticação de usuários. Desenvolvida com React e TypeScript, arquitetura mobile-first com foco em performance e usabilidade.',
    techs: ['React', 'TypeScript', 'Vite', 'Gestão de Estado', 'Mobile-First'],
    github: 'https://github.com/jrabeloneto/techstore',
    demo: null,
    color: '#f59e0b',
    number: '03',
  },
]

function AnimatedSection({ children, delay = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

function ProjectCard({ project, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60, rotateX: 8 }}
      animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{ delay: index * 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{ perspective: '1000px' }}
    >
      <motion.div
        animate={hovered ? { y: -6 } : { y: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          background: 'rgba(19,19,31,0.9)',
          border: `1px solid ${hovered ? project.color + '30' : 'rgba(255,255,255,0.06)'}`,
          borderRadius: '20px',
          overflow: 'hidden',
          transition: 'border-color 0.3s ease',
          boxShadow: hovered ? `0 24px 80px rgba(0,0,0,0.5), 0 0 40px ${project.color}12` : '0 4px 20px rgba(0,0,0,0.2)',
          height: '100%',
        }}
      >
        {/* Header colorido */}
        <div style={{
          padding: '24px 28px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
          background: `linear-gradient(135deg, ${project.color}08, transparent)`,
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Número grande decorativo */}
          <div style={{
            position: 'absolute', top: '-10px', right: '20px',
            fontSize: '80px', fontWeight: '900', color: project.color,
            opacity: 0.06, lineHeight: 1, userSelect: 'none',
            letterSpacing: '-0.05em',
          }}>
            {project.number}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
            <div>
              <span style={{
                display: 'inline-block', padding: '3px 10px', borderRadius: '9999px',
                fontSize: '11px', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase',
                color: project.tagColor,
                border: `1px solid ${project.tagColor}30`,
                background: `${project.tagColor}10`,
                marginBottom: '10px',
              }}>
                {project.tag}
              </span>
              <h3 style={{
                fontSize: 'clamp(18px, 2.5vw, 22px)', fontWeight: '800',
                color: '#f9fafb', letterSpacing: '-0.02em', lineHeight: 1.2,
              }}>
                {project.title}
              </h3>
              <p style={{ fontSize: '13px', color: project.color, marginTop: '4px', fontWeight: '500' }}>
                {project.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Corpo */}
        <div style={{ padding: '20px 28px 24px' }}>
          <p style={{
            fontSize: '14px', color: '#6b7280', lineHeight: '1.7',
            marginBottom: '20px',
          }}>
            {project.desc}
          </p>

          {/* Techs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '24px' }}>
            {project.techs.map((tech) => (
              <span key={tech} style={{
                padding: '4px 10px', borderRadius: '6px',
                fontSize: '12px', fontWeight: '500',
                color: '#9ca3af',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}>
                {tech}
              </span>
            ))}
          </div>

          {/* Links */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <motion.a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '9px 18px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '13px', fontWeight: '600', color: '#f9fafb',
                transition: 'all 0.2s',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </motion.a>
            {project.demo && (
              <motion.a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03, boxShadow: `0 0 20px ${project.color}30` }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '9px 18px',
                  background: `linear-gradient(135deg, ${project.color}, ${project.color}cc)`,
                  border: 'none', borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '13px', fontWeight: '700', color: '#080810',
                  transition: 'all 0.2s',
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  <polyline points="15 3 21 3 21 9"/>
                  <line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
                Demo
              </motion.a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Projects() {
  return (
    <section id="projects" style={{ padding: 'clamp(60px, 10vw, 120px) 20px', position: 'relative' }}>
      <div style={{
        position: 'absolute', bottom: '10%', left: '-5%', width: '400px', height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%)',
        filter: 'blur(40px)', pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <AnimatedSection>
          <div style={{ marginBottom: '56px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '4px 14px', borderRadius: '9999px',
              border: '1px solid rgba(245,158,11,0.2)',
              background: 'rgba(245,158,11,0.06)',
              marginBottom: '16px',
            }}>
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#f59e0b', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Portfolio
              </span>
            </div>
            <h2 style={{
              fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: '900',
              letterSpacing: '-0.03em', color: '#f9fafb', lineHeight: 1.1,
            }}>
              Projetos <span style={{
                background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>Destacados</span>
            </h2>
            <p style={{
              marginTop: '16px', fontSize: 'clamp(14px, 2vw, 17px)',
              color: '#6b7280', maxWidth: '500px', lineHeight: '1.7',
            }}>
              Projetos reais que demonstram habilidades em desenvolvimento frontend, UX/UI Design e TypeScript.
            </p>
          </div>
        </AnimatedSection>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))',
          gap: '20px',
        }}>
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>

        <AnimatedSection delay={0.3}>
          <div style={{ marginTop: '48px', textAlign: 'center' }}>
            <motion.a
              href="https://github.com/jrabeloneto"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03, borderColor: 'rgba(245,158,11,0.4)' }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '12px 28px',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px',
                textDecoration: 'none',
                fontSize: '14px', fontWeight: '600', color: '#9ca3af',
                transition: 'all 0.2s',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
              </svg>
              Ver todos os repositorios no GitHub
            </motion.a>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
