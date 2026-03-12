import { motion } from 'framer-motion'
import { GraduationCap, Users, Code2, Globe } from 'lucide-react'

const highlights = [
  {
    icon: <GraduationCap size={28} />,
    title: 'Engenharia de Software',
    desc: '4º período — CEUNI-FAMETRO, Manaus. Foco em desenvolvimento web, POO com Java e metodologias ágeis.',
  },
  {
    icon: <Users size={28} />,
    title: 'Liderança Comprovada',
    desc: 'Ex-Mestre Conselheiro Estadual da Ordem DeMolay. Liderança de mais de 1.000 jovens no Amazonas.',
  },
  {
    icon: <Code2 size={28} />,
    title: 'Desenvolvimento Full-Stack',
    desc: 'React, Angular, Java, TypeScript e UX/UI Design. Projetos reais publicados no GitHub.',
  },
  {
    icon: <Globe size={28} />,
    title: 'Inglês Avançado',
    desc: 'Leitura, escrita e conversação em inglês técnico e cotidiano. Pronto para ambientes internacionais.',
  },
]

const timeline = [
  {
    year: '2022 – 2023',
    title: 'Mestre Conselheiro Estadual',
    org: 'Ordem DeMolay — GCE-AM',
    desc: 'Liderança estratégica de mais de 1.000 jovens. Planejamento de eventos, gestão de equipes e oratória para grandes audiências.',
    color: '#3b82f6',
  },
  {
    year: '2024',
    title: 'Início em Engenharia de Software',
    org: 'CEUNI-FAMETRO',
    desc: 'Ingresso no curso com foco em desenvolvimento web moderno, algoritmos, POO e arquitetura de software.',
    color: '#6366f1',
  },
  {
    year: '2024 – 2025',
    title: 'Desenvolvimento de Projetos',
    org: 'GitHub Portfolio',
    desc: 'Criação do portfólio web, redesign do app Bradesco e e-commerce TechStore. Aprofundamento em React, Angular e Java.',
    color: '#8b5cf6',
  },
  {
    year: '2025 – Atual',
    title: '4º Período — Crescimento Técnico',
    org: 'CEUNI-FAMETRO',
    desc: 'Cursando POO (Java), Algoritmos e Estrutura de Dados, Sistemas Operacionais e Metodologia Científica.',
    color: '#a78bfa',
  },
]

export default function About() {
  return (
    <section
      id="about"
      style={{
        padding: '100px 24px',
        background: 'var(--navy)',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '72px' }}
        >
          <p style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '14px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' }}>
            Quem sou eu
          </p>
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 800,
            color: 'var(--text-primary)',
            letterSpacing: '-1px',
            marginBottom: '20px',
          }}>
            Sobre mim
          </h2>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '1.1rem',
            maxWidth: '680px',
            margin: '0 auto',
            lineHeight: 1.8,
          }}>
            Sou um desenvolvedor com perfil de gestor — combino raciocínio lógico elevado com
            habilidades naturais de liderança, comunicação e pensamento estratégico.
            Acredito que as melhores soluções nascem da interseção entre tecnologia e pessoas.
          </p>
        </motion.div>

        {/* Cards de destaque */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '24px',
          marginBottom: '80px',
        }}>
          {highlights.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(59,130,246,0.15)' }}
              style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                padding: '28px 24px',
                transition: 'all 0.3s ease',
              }}
            >
              <div style={{ color: 'var(--accent)', marginBottom: '16px' }}>{item.icon}</div>
              <h3 style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '17px', marginBottom: '10px' }}>
                {item.title}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.7 }}>
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 style={{
            textAlign: 'center',
            fontSize: '1.6rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: '48px',
            letterSpacing: '-0.5px',
          }}>
            Minha Jornada
          </h3>

          <div style={{ position: 'relative', maxWidth: '800px', margin: '0 auto' }}>
            {/* Linha vertical */}
            <div style={{
              position: 'absolute',
              left: '20px',
              top: 0,
              bottom: 0,
              width: '2px',
              background: 'linear-gradient(to bottom, var(--accent), #8b5cf6)',
              borderRadius: '2px',
            }} />

            {timeline.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                style={{
                  display: 'flex',
                  gap: '28px',
                  marginBottom: '40px',
                  paddingLeft: '8px',
                }}
              >
                {/* Dot */}
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: item.color,
                  border: '3px solid var(--navy)',
                  boxShadow: `0 0 12px ${item.color}60`,
                  flexShrink: 0,
                  marginTop: '4px',
                  zIndex: 1,
                }} />

                {/* Content */}
                <div style={{
                  background: 'var(--card-bg)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '20px 24px',
                  flex: 1,
                }}>
                  <span style={{
                    color: item.color,
                    fontSize: '13px',
                    fontWeight: 600,
                    letterSpacing: '0.5px',
                    display: 'block',
                    marginBottom: '4px',
                  }}>
                    {item.year}
                  </span>
                  <h4 style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '16px', marginBottom: '4px' }}>
                    {item.title}
                  </h4>
                  <p style={{ color: 'var(--accent-light)', fontSize: '13px', marginBottom: '10px', fontWeight: 500 }}>
                    {item.org}
                  </p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.7 }}>
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
