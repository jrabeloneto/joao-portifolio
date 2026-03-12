import { useEffect, useState, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

const roles = ['Desenvolvedor Frontend', 'UX/UI Designer', 'Lider de Equipes', 'Engenheiro de Software']

function TypewriterText({ texts }) {
  const [textIndex, setTextIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = texts[textIndex]
    let timeout
    if (!deleting && displayed.length < current.length) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 60)
    } else if (!deleting && displayed.length === current.length) {
      timeout = setTimeout(() => setDeleting(true), 2200)
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 35)
    } else if (deleting && displayed.length === 0) {
      setDeleting(false)
      setTextIndex((i) => (i + 1) % texts.length)
    }
    return () => clearTimeout(timeout)
  }, [displayed, deleting, textIndex, texts])

  return (
    <span style={{ color: '#f59e0b' }}>
      {displayed}
      <span style={{
        display: 'inline-block', width: '3px', height: '1.1em',
        background: '#f59e0b', marginLeft: '3px', verticalAlign: 'middle',
        animation: 'blink 1s step-end infinite',
      }} />
    </span>
  )
}

const statItems = [
  { value: '4°', label: 'Período', sub: 'Eng. Software' },
  { value: '1k+', label: 'Liderados', sub: 'Ordem DeMolay' },
  { value: '3+', label: 'Projetos', sub: 'Publicados' },
  { value: 'B2+', label: 'Inglês', sub: 'Avançado' },
]

export default function Hero() {
  const containerRef = useRef(null)

  const letterVariants = {
    hidden: { opacity: 0, y: 40, rotateX: -30 },
    visible: (i) => ({
      opacity: 1, y: 0, rotateX: 0,
      transition: { delay: 0.3 + i * 0.04, duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    }),
  }

  const firstName = 'João da Cunha'
  const lastName = 'Rabelo Neto'

  return (
    <section id="home" ref={containerRef} style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '80px 20px 40px',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Orbs de fundo */}
      <div style={{
        position: 'absolute', top: '15%', left: '-10%', width: '500px', height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)',
        filter: 'blur(40px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', right: '-5%', width: '400px', height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)',
        filter: 'blur(40px)', pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '900px', width: '100%', textAlign: 'center' }}>
        {/* Badge disponível */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px', borderRadius: '9999px',
            border: '1px solid rgba(16,185,129,0.3)',
            background: 'rgba(16,185,129,0.08)',
            marginBottom: '32px',
          }}
        >
          <span style={{
            width: '8px', height: '8px', borderRadius: '50%', background: '#10b981',
            boxShadow: '0 0 10px rgba(16,185,129,0.8)',
            animation: 'pulse 2s ease-in-out infinite',
          }} />
          <span style={{ fontSize: '13px', fontWeight: '500', color: '#34d399', letterSpacing: '0.05em' }}>
            Disponivel para Estagio
          </span>
        </motion.div>

        {/* Nome com animação letra por letra */}
        <div style={{ marginBottom: '8px', lineHeight: 1.1 }}>
          <div style={{
            fontSize: 'clamp(38px, 8vw, 80px)', fontWeight: '900',
            letterSpacing: '-0.03em', color: '#f9fafb',
            display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 12px',
            perspective: '800px',
          }}>
            {firstName.split('').map((char, i) => (
              <motion.span
                key={`f-${i}`}
                custom={i}
                variants={letterVariants}
                initial="hidden"
                animate="visible"
                style={{ display: 'inline-block', whiteSpace: char === ' ' ? 'pre' : 'normal' }}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </div>
          <div style={{
            fontSize: 'clamp(38px, 8vw, 80px)', fontWeight: '900',
            letterSpacing: '-0.03em',
            background: 'linear-gradient(135deg, #f59e0b, #fbbf24, #10b981)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 12px',
            perspective: '800px',
          }}>
            {lastName.split('').map((char, i) => (
              <motion.span
                key={`l-${i}`}
                custom={firstName.length + i}
                variants={letterVariants}
                initial="hidden"
                animate="visible"
                style={{ display: 'inline-block', whiteSpace: char === ' ' ? 'pre' : 'normal' }}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Typewriter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          style={{
            fontSize: 'clamp(18px, 3.5vw, 26px)', fontWeight: '300',
            color: '#9ca3af', marginBottom: '32px', minHeight: '40px',
            letterSpacing: '-0.01em',
          }}
        >
          <TypewriterText texts={roles} />
        </motion.div>

        {/* Descricao */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.5 }}
          style={{
            fontSize: 'clamp(14px, 2vw, 17px)', color: '#6b7280',
            maxWidth: '600px', margin: '0 auto 40px',
            lineHeight: '1.7', fontWeight: '400',
          }}
        >
          Estudante de Engenharia de Software com perfil de gestor — combino raciocínio lógico elevado com liderança natural. Ex-Mestre Conselheiro Estadual da Ordem DeMolay, liderando mais de 1.000 pessoas.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.5 }}
          style={{
            display: 'flex', gap: '12px', justifyContent: 'center',
            flexWrap: 'wrap', marginBottom: '64px',
          }}
        >
          <motion.button
            onClick={() => document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })}
            whileHover={{ scale: 1.04, boxShadow: '0 0 30px rgba(245,158,11,0.35)' }}
            whileTap={{ scale: 0.96 }}
            style={{
              padding: '14px 32px',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: '#080810', border: 'none', borderRadius: '10px',
              fontSize: '15px', fontWeight: '700', cursor: 'pointer',
              letterSpacing: '0.02em',
            }}
          >
            Ver Projetos
          </motion.button>
          <motion.button
            onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
            whileHover={{ scale: 1.04, borderColor: 'rgba(245,158,11,0.5)' }}
            whileTap={{ scale: 0.96 }}
            style={{
              padding: '14px 32px',
              background: 'transparent',
              color: '#f9fafb', border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '10px', fontSize: '15px', fontWeight: '500',
              cursor: 'pointer', transition: 'border-color 0.2s',
            }}
          >
            Entrar em Contato
          </motion.button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.6 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1px',
            background: 'rgba(255,255,255,0.06)',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.06)',
            maxWidth: '700px',
            margin: '0 auto',
          }}
          className="stats-grid"
        >
          {statItems.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.9 + i * 0.08 }}
              whileHover={{ background: 'rgba(245,158,11,0.06)' }}
              style={{
                padding: '20px 12px', textAlign: 'center',
                background: 'rgba(8,8,16,0.8)',
                transition: 'background 0.2s',
              }}
            >
              <div style={{
                fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: '900',
                background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                letterSpacing: '-0.02em',
              }}>{stat.value}</div>
              <div style={{ fontSize: '12px', fontWeight: '600', color: '#f9fafb', marginTop: '2px' }}>{stat.label}</div>
              <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>{stat.sub}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.4 }}
          style={{ marginTop: '48px', display: 'flex', justifyContent: 'center' }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              width: '24px', height: '40px', border: '2px solid rgba(245,158,11,0.3)',
              borderRadius: '12px', display: 'flex', justifyContent: 'center', padding: '6px 0',
            }}
          >
            <motion.div
              animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              style={{ width: '4px', height: '8px', background: '#f59e0b', borderRadius: '2px' }}
            />
          </motion.div>
        </motion.div>
      </div>

      <style>{`
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.3); opacity: 0.7; } }
        @media (max-width: 480px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  )
}
