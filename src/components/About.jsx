import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const timelineItems = [
  {
    period: '2022 — 2023',
    title: 'Mestre Conselheiro Estadual',
    org: 'Ordem DeMolay — GCE-AM',
    desc: 'Liderança estratégica de mais de 1.000 jovens no Amazonas. Planejamento de eventos de grande porte, gestão de equipes multidisciplinares e oratória para grandes audiências.',
    color: '#f59e0b',
  },
  {
    period: '2024',
    title: 'Ingresso em Engenharia de Software',
    org: 'CEUNI-FAMETRO — Manaus, AM',
    desc: 'Início da graduação com foco em desenvolvimento web moderno, algoritmos, POO e arquitetura de software.',
    color: '#10b981',
  },
  {
    period: '2024 — 2025',
    title: 'Desenvolvimento de Projetos',
    org: 'GitHub Portfolio',
    desc: 'Criação do portfólio web pessoal, redesign do app Bradesco e plataforma e-commerce TechStore. Aprofundamento em React, Angular, Java e TypeScript.',
    color: '#f59e0b',
  },
  {
    period: '2025 — Atual',
    title: '4° Período — Crescimento Técnico',
    org: 'CEUNI-FAMETRO',
    desc: 'Cursando POO com Java, Algoritmos e Estrutura de Dados, Sistemas Operacionais e Metodologia Científica.',
    color: '#10b981',
  },
]

const pillars = [
  {
    icon: '◈',
    title: 'Perfil de Gestor',
    desc: 'Liderança natural com foco em pessoas, estratégia e resultados. Experiência comprovada gerenciando equipes de grande escala.',
    color: '#f59e0b',
  },
  {
    icon: '◉',
    title: 'Raciocínio Lógico',
    desc: 'Capacidade analítica elevada aplicada à resolução de problemas complexos em desenvolvimento e gestão de projetos.',
    color: '#10b981',
  },
  {
    icon: '◈',
    title: 'Inglês Avançado',
    desc: 'Leitura, escrita e conversação em inglês técnico e cotidiano. Preparado para ambientes internacionais e documentação global.',
    color: '#f59e0b',
  },
  {
    icon: '◉',
    title: 'Full-Stack em Formação',
    desc: 'React, Angular, Java, TypeScript e UX/UI Design. Projetos reais publicados e em produção no GitHub.',
    color: '#10b981',
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

export default function About() {
  const sectionRef = useRef(null)
  const inView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section id="about" style={{ padding: 'clamp(60px, 10vw, 120px) 20px', position: 'relative' }}>
      {/* Orb decorativo */}
      <div style={{
        position: 'absolute', top: '20%', right: '-5%', width: '350px', height: '350px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245,158,11,0.05) 0%, transparent 70%)',
        filter: 'blur(40px)', pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Header da seção */}
        <AnimatedSection>
          <div style={{ marginBottom: '64px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '4px 14px', borderRadius: '9999px',
              border: '1px solid rgba(245,158,11,0.2)',
              background: 'rgba(245,158,11,0.06)',
              marginBottom: '16px',
            }}>
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#f59e0b', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Quem sou eu
              </span>
            </div>
            <h2 style={{
              fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: '900',
              letterSpacing: '-0.03em', color: '#f9fafb', lineHeight: 1.1,
            }}>
              Sobre <span style={{
                background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>mim</span>
            </h2>
            <p style={{
              marginTop: '16px', fontSize: 'clamp(15px, 2vw, 18px)',
              color: '#6b7280', maxWidth: '600px', lineHeight: '1.7',
            }}>
              Sou um desenvolvedor com perfil de gestor — combino raciocínio lógico elevado com habilidades naturais de liderança, comunicação e pensamento estratégico.
            </p>
          </div>
        </AnimatedSection>

        {/* Pilares */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
          marginBottom: '80px',
        }}>
          {pillars.map((p, i) => (
            <AnimatedSection key={p.title} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -4, boxShadow: `0 20px 60px rgba(0,0,0,0.4), 0 0 30px ${p.color}18` }}
                style={{
                  padding: '28px 24px',
                  background: 'rgba(19,19,31,0.8)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '16px',
                  transition: 'all 0.3s ease',
                  height: '100%',
                }}
              >
                <div style={{
                  fontSize: '24px', marginBottom: '12px',
                  color: p.color, fontWeight: '900',
                }}>
                  {p.icon}
                </div>
                <h3 style={{
                  fontSize: '16px', fontWeight: '700', color: '#f9fafb',
                  marginBottom: '8px', letterSpacing: '-0.01em',
                }}>
                  {p.title}
                </h3>
                <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.6' }}>
                  {p.desc}
                </p>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>

        {/* Timeline */}
        <AnimatedSection>
          <div style={{ marginBottom: '24px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '4px 14px', borderRadius: '9999px',
              border: '1px solid rgba(245,158,11,0.2)',
              background: 'rgba(245,158,11,0.06)',
              marginBottom: '16px',
            }}>
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#f59e0b', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Minha Jornada
              </span>
            </div>
          </div>
        </AnimatedSection>

        <div style={{ position: 'relative', paddingLeft: 'clamp(24px, 5vw, 48px)' }}>
          {/* Linha vertical */}
          <div style={{
            position: 'absolute', left: '0', top: '8px', bottom: '8px',
            width: '2px',
            background: 'linear-gradient(to bottom, #f59e0b, #10b981, #f59e0b, #10b981)',
            borderRadius: '1px', opacity: 0.3,
          }} />

          {timelineItems.map((item, i) => (
            <AnimatedSection key={item.title} delay={i * 0.12}>
              <div style={{ position: 'relative', marginBottom: '40px' }}>
                {/* Dot */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1, type: 'spring', stiffness: 300 }}
                  style={{
                    position: 'absolute',
                    left: `clamp(-31px, -4.5vw, -55px)`,
                    top: '6px',
                    width: '12px', height: '12px',
                    borderRadius: '50%',
                    background: item.color,
                    boxShadow: `0 0 12px ${item.color}80`,
                    border: '2px solid var(--bg-primary)',
                  }}
                />
                <motion.div
                  whileHover={{ x: 4, borderColor: `${item.color}30` }}
                  style={{
                    padding: '20px 24px',
                    background: 'rgba(19,19,31,0.6)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '12px',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span style={{
                    fontSize: '12px', fontWeight: '600', color: item.color,
                    letterSpacing: '0.05em', textTransform: 'uppercase',
                  }}>
                    {item.period}
                  </span>
                  <h4 style={{
                    fontSize: 'clamp(15px, 2vw, 18px)', fontWeight: '700',
                    color: '#f9fafb', margin: '6px 0 4px',
                    letterSpacing: '-0.01em',
                  }}>
                    {item.title}
                  </h4>
                  <span style={{ fontSize: '13px', color: '#6b7280', display: 'block', marginBottom: '10px' }}>
                    {item.org}
                  </span>
                  <p style={{ fontSize: '14px', color: '#9ca3af', lineHeight: '1.6' }}>
                    {item.desc}
                  </p>
                </motion.div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
