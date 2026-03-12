import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const techSkills = [
  { name: 'JavaScript', level: 85, color: '#f59e0b' },
  { name: 'TypeScript', level: 72, color: '#f59e0b' },
  { name: 'Java', level: 65, color: '#10b981' },
  { name: 'HTML5', level: 92, color: '#f59e0b' },
  { name: 'CSS3', level: 88, color: '#f59e0b' },
  { name: 'React', level: 82, color: '#10b981' },
  { name: 'Angular', level: 68, color: '#10b981' },
  { name: 'Tailwind', level: 85, color: '#f59e0b' },
  { name: 'Figma', level: 78, color: '#10b981' },
  { name: 'Git', level: 82, color: '#f59e0b' },
  { name: 'Scrum', level: 80, color: '#10b981' },
  { name: 'VS Code', level: 90, color: '#f59e0b' },
]

const softSkills = [
  { name: 'Liderança e Gestão de Equipes', icon: '◈' },
  { name: 'Pensamento Estratégico', icon: '◉' },
  { name: 'Comunicação para Grandes Audiências', icon: '◈' },
  { name: 'Resolução de Problemas', icon: '◉' },
  { name: 'Mentoria e Desenvolvimento de Pessoas', icon: '◈' },
  { name: 'Adaptabilidade', icon: '◉' },
  { name: 'Inteligência Emocional', icon: '◈' },
  { name: 'Gestão de Projetos', icon: '◉' },
]

const languages = [
  { name: 'Português', level: 'Nativo', pct: 100, color: '#f59e0b' },
  { name: 'Inglês', level: 'Avançado (B2+)', pct: 82, color: '#10b981' },
]

function CircleSkill({ skill, index, inView }) {
  const radius = 28
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (skill.level / 100) * circumference

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, y: 20 }}
      animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ delay: 0.05 * index, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.08, y: -4 }}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
        padding: '16px 8px',
        background: 'rgba(19,19,31,0.8)',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: '12px',
        cursor: 'default',
        transition: 'all 0.3s ease',
      }}
    >
      <div style={{ position: 'relative', width: '72px', height: '72px' }}>
        <svg width="72" height="72" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="36" cy="36" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
          <motion.circle
            cx="36" cy="36" r={radius}
            fill="none"
            stroke={skill.color}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={inView ? { strokeDashoffset: offset } : { strokeDashoffset: circumference }}
            transition={{ delay: 0.1 + 0.05 * index, duration: 1, ease: 'easeOut' }}
            style={{ filter: `drop-shadow(0 0 4px ${skill.color}60)` }}
          />
        </svg>
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '13px', fontWeight: '700', color: skill.color,
        }}>
          {skill.level}%
        </div>
      </div>
      <span style={{ fontSize: '12px', fontWeight: '600', color: '#9ca3af', textAlign: 'center', lineHeight: 1.3 }}>
        {skill.name}
      </span>
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

export default function Skills() {
  const skillsRef = useRef(null)
  const skillsInView = useInView(skillsRef, { once: true, margin: '-100px' })

  return (
    <section id="skills" style={{
      padding: 'clamp(60px, 10vw, 120px) 20px',
      background: 'rgba(15,15,26,0.5)',
      position: 'relative',
    }}>
      {/* Divisor topo */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.2), transparent)',
      }} />

      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Header */}
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
                Competencias
              </span>
            </div>
            <h2 style={{
              fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: '900',
              letterSpacing: '-0.03em', color: '#f9fafb', lineHeight: 1.1,
            }}>
              Habilidades <span style={{
                background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>Tecnicas</span>
            </h2>
          </div>
        </AnimatedSection>

        {/* Grid de skills com círculos */}
        <div
          ref={skillsRef}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
            gap: '12px',
            marginBottom: '72px',
          }}
        >
          {techSkills.map((skill, i) => (
            <CircleSkill key={skill.name} skill={skill} index={i} inView={skillsInView} />
          ))}
        </div>

        {/* Idiomas */}
        <AnimatedSection delay={0.1}>
          <div style={{ marginBottom: '56px' }}>
            <h3 style={{
              fontSize: '20px', fontWeight: '700', color: '#f9fafb',
              marginBottom: '24px', letterSpacing: '-0.02em',
            }}>
              Idiomas
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '500px' }}>
              {languages.map((lang, i) => (
                <div key={lang.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '15px', fontWeight: '600', color: '#f9fafb' }}>{lang.name}</span>
                    <span style={{ fontSize: '13px', fontWeight: '500', color: lang.color }}>{lang.level}</span>
                  </div>
                  <div style={{
                    height: '6px', background: 'rgba(255,255,255,0.06)',
                    borderRadius: '3px', overflow: 'hidden',
                  }}>
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${lang.pct}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + i * 0.1, duration: 1, ease: 'easeOut' }}
                      style={{
                        height: '100%', borderRadius: '3px',
                        background: `linear-gradient(90deg, ${lang.color}, ${lang.color}88)`,
                        boxShadow: `0 0 8px ${lang.color}50`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Soft Skills */}
        <AnimatedSection delay={0.15}>
          <h3 style={{
            fontSize: '20px', fontWeight: '700', color: '#f9fafb',
            marginBottom: '24px', letterSpacing: '-0.02em',
          }}>
            Competencias Interpessoais
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '12px',
          }}>
            {softSkills.map((skill, i) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ x: 4, borderColor: 'rgba(245,158,11,0.25)' }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '14px 18px',
                  background: 'rgba(19,19,31,0.8)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '10px',
                  transition: 'all 0.2s ease',
                }}
              >
                <span style={{
                  fontSize: '16px', color: i % 2 === 0 ? '#f59e0b' : '#10b981',
                  flexShrink: 0,
                }}>
                  {skill.icon}
                </span>
                <span style={{ fontSize: '13px', fontWeight: '500', color: '#9ca3af', lineHeight: 1.4 }}>
                  {skill.name}
                </span>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>
      </div>

      {/* Divisor base */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.2), transparent)',
      }} />
    </section>
  )
}
