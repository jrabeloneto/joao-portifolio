import { motion } from 'framer-motion'

const skillCategories = [
  {
    title: 'Linguagens',
    color: '#3b82f6',
    skills: [
      { name: 'JavaScript (ES6+)', level: 85 },
      { name: 'TypeScript', level: 70 },
      { name: 'Java', level: 65 },
      { name: 'HTML5', level: 92 },
      { name: 'CSS3', level: 88 },
    ],
  },
  {
    title: 'Frameworks & Bibliotecas',
    color: '#6366f1',
    skills: [
      { name: 'React', level: 82 },
      { name: 'Angular', level: 65 },
      { name: 'Tailwind CSS', level: 85 },
      { name: 'Framer Motion', level: 72 },
      { name: 'Next.js', level: 50 },
    ],
  },
  {
    title: 'UX/UI & Design',
    color: '#8b5cf6',
    skills: [
      { name: 'Figma', level: 78 },
      { name: 'Pesquisa de Usuário', level: 80 },
      { name: 'Wireframing', level: 82 },
      { name: 'Design Responsivo', level: 88 },
      { name: 'Design System', level: 72 },
    ],
  },
  {
    title: 'Ferramentas & Metodologias',
    color: '#a78bfa',
    skills: [
      { name: 'Git & GitHub', level: 82 },
      { name: 'Scrum / Agile', level: 80 },
      { name: 'Vite', level: 78 },
      { name: 'Vercel / Deploy', level: 72 },
      { name: 'VS Code', level: 90 },
    ],
  },
]

const softSkills = [
  'Liderança e Gestão de Equipes',
  'Pensamento Estratégico',
  'Comunicação para Grandes Audiências',
  'Resolução de Problemas',
  'Mentoria e Desenvolvimento de Pessoas',
  'Adaptabilidade',
  'Inteligência Emocional',
  'Gestão de Projetos',
]

const languages = [
  { lang: 'Português', level: 'Nativo', pct: 100, color: '#22c55e' },
  { lang: 'Inglês', level: 'Avançado', pct: 85, color: '#3b82f6' },
]

export default function Skills() {
  return (
    <section
      id="skills"
      style={{
        padding: '100px 24px',
        background: 'var(--navy-mid)',
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
            Competências
          </p>
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 800,
            color: 'var(--text-primary)',
            letterSpacing: '-1px',
          }}>
            Habilidades Técnicas
          </h2>
        </motion.div>

        {/* Skill bars por categoria */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))',
          gap: '32px',
          marginBottom: '64px',
        }}>
          {skillCategories.map((cat, ci) => (
            <motion.div
              key={ci}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: ci * 0.1 }}
              style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                padding: '28px',
              }}
            >
              <h3 style={{
                color: cat.color,
                fontSize: '13px',
                fontWeight: 700,
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                marginBottom: '24px',
              }}>
                {cat.title}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {cat.skills.map((skill, si) => (
                  <div key={si}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ color: 'var(--text-primary)', fontSize: '14px', fontWeight: 500 }}>
                        {skill.name}
                      </span>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                        {skill.level}%
                      </span>
                    </div>
                    <div style={{
                      height: '6px',
                      background: 'var(--navy-light)',
                      borderRadius: '3px',
                      overflow: 'hidden',
                    }}>
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: si * 0.1, ease: 'easeOut' }}
                        style={{
                          height: '100%',
                          background: `linear-gradient(90deg, ${cat.color}, ${cat.color}aa)`,
                          borderRadius: '3px',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Soft Skills */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '36px',
            marginBottom: '40px',
          }}
        >
          <h3 style={{
            color: 'var(--text-primary)',
            fontSize: '1.2rem',
            fontWeight: 700,
            marginBottom: '24px',
            textAlign: 'center',
          }}>
            Competências Interpessoais
          </h3>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            justifyContent: 'center',
          }}>
            {softSkills.map((skill, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.05, borderColor: 'var(--accent)' }}
                style={{
                  background: 'rgba(59,130,246,0.08)',
                  border: '1px solid rgba(59,130,246,0.25)',
                  color: 'var(--accent-light)',
                  padding: '8px 18px',
                  borderRadius: '50px',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'default',
                  transition: 'all 0.2s',
                }}
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Idiomas */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '36px',
          }}
        >
          <h3 style={{
            color: 'var(--text-primary)',
            fontSize: '1.2rem',
            fontWeight: 700,
            marginBottom: '28px',
            textAlign: 'center',
          }}>
            Idiomas
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
          }}>
            {languages.map((lang, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '16px' }}>
                    {lang.lang}
                  </span>
                  <span style={{
                    color: lang.color,
                    fontSize: '14px',
                    fontWeight: 600,
                    background: `${lang.color}15`,
                    padding: '2px 12px',
                    borderRadius: '50px',
                  }}>
                    {lang.level}
                  </span>
                </div>
                <div style={{ height: '8px', background: 'var(--navy-light)', borderRadius: '4px', overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${lang.pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    style={{
                      height: '100%',
                      background: `linear-gradient(90deg, ${lang.color}, ${lang.color}bb)`,
                      borderRadius: '4px',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
