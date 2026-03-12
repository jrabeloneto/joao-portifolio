import { motion } from 'framer-motion'
import { Github, ExternalLink, Layers, ShoppingCart, User } from 'lucide-react'

const projects = [
  {
    id: 1,
    title: 'Portfólio Pessoal',
    subtitle: 'Este site',
    description:
      'Portfólio profissional desenvolvido em React com animações suaves via Framer Motion, design responsivo mobile-first e foco total na experiência do usuário. Apresenta projetos, competências e informações profissionais de forma clara e moderna.',
    tags: ['React', 'Framer Motion', 'Tailwind CSS', 'Vite', 'Vercel'],
    github: 'https://github.com/jrabeloneto',
    demo: 'https://joao-portifolio.vercel.app',
    icon: <User size={32} />,
    color: '#3b82f6',
    gradient: 'linear-gradient(135deg, #1e3a8a, #1e40af)',
    highlight: true,
  },
  {
    id: 2,
    title: 'Bradesco App Redesign',
    subtitle: 'UX/UI Design + Frontend',
    description:
      'Redesign completo do aplicativo mobile do Bradesco com foco em modernizar a experiência do usuário. Projeto desenvolvido com React e Tailwind CSS, aplicando princípios de UX Research, Design System e desenvolvimento mobile-first.',
    tags: ['React', 'Tailwind CSS', 'UX Research', 'Figma', 'Mobile-First'],
    github: 'https://github.com/jrabeloneto/bradesco-app-redesign',
    demo: null,
    icon: <Layers size={32} />,
    color: '#cc0000',
    gradient: 'linear-gradient(135deg, #7f1d1d, #991b1b)',
    highlight: false,
  },
  {
    id: 3,
    title: 'TechStore E-commerce',
    subtitle: 'React + TypeScript',
    description:
      'Plataforma de e-commerce completa com catálogo de produtos, carrinho de compras funcional e autenticação de usuários. Desenvolvida com React e TypeScript, arquitetura mobile-first com foco em performance e usabilidade.',
    tags: ['React', 'TypeScript', 'Vite', 'Gestão de Estado', 'Mobile-First'],
    github: 'https://github.com/jrabeloneto/techstore-ecommerce',
    demo: null,
    icon: <ShoppingCart size={32} />,
    color: '#6366f1',
    gradient: 'linear-gradient(135deg, #312e81, #3730a3)',
    highlight: false,
  },
]

export default function Projects() {
  return (
    <section
      id="projects"
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
            Portfólio
          </p>
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 800,
            color: 'var(--text-primary)',
            letterSpacing: '-1px',
            marginBottom: '16px',
          }}>
            Projetos Destacados
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '560px', margin: '0 auto' }}>
            Projetos reais que demonstram habilidades em desenvolvimento frontend, UX/UI Design e TypeScript.
          </p>
        </motion.div>

        {/* Cards de projetos */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              style={{
                background: 'var(--card-bg)',
                border: `1px solid ${project.highlight ? project.color + '50' : 'var(--border)'}`,
                borderRadius: '20px',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                boxShadow: project.highlight ? `0 0 40px ${project.color}20` : 'none',
              }}
            >
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'auto 1fr',
                gap: '0',
              }}>
                {/* Sidebar colorida */}
                <div style={{
                  width: '6px',
                  background: project.color,
                  flexShrink: 0,
                }} />

                {/* Conteúdo */}
                <div style={{ padding: '36px 36px 36px 32px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '16px',
                    marginBottom: '20px',
                  }}>
                    {/* Título e ícone */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{
                        width: '56px', height: '56px',
                        borderRadius: '14px',
                        background: project.gradient,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white',
                        flexShrink: 0,
                      }}>
                        {project.icon}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                          <h3 style={{ color: 'var(--text-primary)', fontSize: '1.3rem', fontWeight: 700 }}>
                            {project.title}
                          </h3>
                          {project.highlight && (
                            <span style={{
                              background: 'rgba(59,130,246,0.15)',
                              border: '1px solid rgba(59,130,246,0.4)',
                              color: 'var(--accent-light)',
                              fontSize: '11px',
                              fontWeight: 600,
                              padding: '3px 10px',
                              borderRadius: '50px',
                              letterSpacing: '0.5px',
                            }}>
                              DESTAQUE
                            </span>
                          )}
                        </div>
                        <p style={{ color: project.color, fontSize: '13px', fontWeight: 600, marginTop: '2px' }}>
                          {project.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* Links */}
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <motion.a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1, color: 'var(--accent)' }}
                        style={{
                          color: 'var(--text-secondary)',
                          display: 'flex', alignItems: 'center', gap: '6px',
                          textDecoration: 'none',
                          fontSize: '14px',
                          fontWeight: 500,
                          background: 'var(--navy-light)',
                          padding: '8px 16px',
                          borderRadius: '8px',
                          transition: 'all 0.2s',
                        }}
                      >
                        <Github size={16} />
                        GitHub
                      </motion.a>
                      {project.demo && (
                        <motion.a
                          href={project.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.1 }}
                          style={{
                            color: 'white',
                            display: 'flex', alignItems: 'center', gap: '6px',
                            textDecoration: 'none',
                            fontSize: '14px',
                            fontWeight: 500,
                            background: project.color,
                            padding: '8px 16px',
                            borderRadius: '8px',
                            transition: 'all 0.2s',
                          }}
                        >
                          <ExternalLink size={16} />
                          Demo
                        </motion.a>
                      )}
                    </div>
                  </div>

                  {/* Descrição */}
                  <p style={{
                    color: 'var(--text-secondary)',
                    fontSize: '15px',
                    lineHeight: 1.8,
                    marginBottom: '24px',
                  }}>
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {project.tags.map((tag, ti) => (
                      <span
                        key={ti}
                        style={{
                          background: 'var(--navy-light)',
                          color: 'var(--text-secondary)',
                          padding: '5px 14px',
                          borderRadius: '6px',
                          fontSize: '13px',
                          fontWeight: 500,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA para GitHub */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginTop: '56px' }}
        >
          <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '15px' }}>
            Mais projetos em desenvolvimento. Acompanhe no GitHub.
          </p>
          <motion.a
            href="https://github.com/jrabeloneto"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              background: 'var(--card-bg)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
              padding: '14px 32px',
              borderRadius: '10px',
              textDecoration: 'none',
              fontSize: '15px',
              fontWeight: 600,
              transition: 'all 0.2s',
            }}
          >
            <Github size={20} />
            Ver todos os repositórios
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}
