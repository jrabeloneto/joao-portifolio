import { motion } from 'framer-motion'
import { Github, Linkedin, Mail, ArrowDown, Download } from 'lucide-react'

const roles = ['Desenvolvedor Frontend', 'UX/UI Designer', 'Líder de Equipes']

export default function Hero() {
  const scrollTo = (id) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="hero"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: '100px 24px 60px',
      }}
    >
      {/* Gradient background orbs */}
      <div style={{
        position: 'absolute', top: '15%', left: '10%',
        width: '400px', height: '400px',
        background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '20%', right: '5%',
        width: '300px', height: '300px',
        background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '900px', width: '100%', textAlign: 'center', position: 'relative', zIndex: 1 }}>

        {/* Badge de disponibilidade */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)',
            borderRadius: '50px', padding: '8px 20px', marginBottom: '32px',
          }}
        >
          <span style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: '#22c55e',
            boxShadow: '0 0 8px #22c55e',
            animation: 'pulse 2s infinite',
          }} />
          <span style={{ color: 'var(--accent-light)', fontSize: '14px', fontWeight: 500 }}>
            Disponível para estágio
          </span>
        </motion.div>

        {/* Nome */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          style={{
            fontSize: 'clamp(2.5rem, 7vw, 5rem)',
            fontWeight: 800,
            color: 'var(--text-primary)',
            lineHeight: 1.1,
            marginBottom: '16px',
            letterSpacing: '-2px',
          }}
        >
          João da Cunha{' '}
          <span style={{
            background: 'linear-gradient(135deg, #3b82f6, #818cf8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Rabelo Neto
          </span>
        </motion.h1>

        {/* Título dinâmico */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          style={{ marginBottom: '24px' }}
        >
          <p style={{
            fontSize: 'clamp(1.1rem, 3vw, 1.5rem)',
            color: 'var(--text-secondary)',
            fontWeight: 400,
          }}>
            {roles.join(' · ')}
          </p>
        </motion.div>

        {/* Descrição */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.15rem)',
            color: 'var(--text-secondary)',
            maxWidth: '680px',
            margin: '0 auto 40px',
            lineHeight: 1.8,
          }}
        >
          Estudante de <strong style={{ color: 'var(--text-primary)' }}>Engenharia de Software (4º período)</strong> com
          especialização em React, Angular, Java e UX/UI Design. Inglês avançado.
          Ex-Mestre Conselheiro Estadual da Ordem DeMolay — liderança de mais de{' '}
          <strong style={{ color: 'var(--accent-light)' }}>1.000 pessoas</strong>.
        </motion.p>

        {/* Botões CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          style={{
            display: 'flex', gap: '16px', justifyContent: 'center',
            flexWrap: 'wrap', marginBottom: '48px',
          }}
        >
          <motion.button
            onClick={() => scrollTo('#projects')}
            whileHover={{ scale: 1.05, background: 'var(--accent-hover)' }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: 'var(--accent)', color: 'white', border: 'none',
              padding: '14px 32px', borderRadius: '10px',
              fontSize: '16px', fontWeight: 600, cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            Ver Projetos
          </motion.button>
          <motion.a
            href="/curriculo-joao-rabelo.pdf"
            download
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'transparent',
              border: '1.5px solid var(--border)',
              color: 'var(--text-primary)',
              padding: '14px 32px', borderRadius: '10px',
              fontSize: '16px', fontWeight: 600,
              textDecoration: 'none', transition: 'all 0.2s',
            }}
          >
            <Download size={18} />
            Currículo
          </motion.a>
        </motion.div>

        {/* Redes sociais */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          style={{ display: 'flex', gap: '24px', justifyContent: 'center', marginBottom: '64px' }}
        >
          {[
            { icon: <Github size={22} />, href: 'https://github.com/jrabeloneto', label: 'GitHub' },
            { icon: <Linkedin size={22} />, href: 'https://www.linkedin.com/in/joão-rabelo-44a184330', label: 'LinkedIn' },
            { icon: <Mail size={22} />, href: 'mailto:jrabeloneto2@gmail.com', label: 'Email' },
          ].map((social) => (
            <motion.a
              key={social.label}
              href={social.href}
              target={social.href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2, color: 'var(--accent)' }}
              style={{
                color: 'var(--text-secondary)',
                transition: 'color 0.2s',
                display: 'flex', alignItems: 'center',
              }}
              aria-label={social.label}
            >
              {social.icon}
            </motion.a>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          style={{ cursor: 'pointer' }}
          onClick={() => scrollTo('#about')}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ color: 'var(--text-secondary)', display: 'inline-block' }}
          >
            <ArrowDown size={24} />
          </motion.div>
        </motion.div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </section>
  )
}
