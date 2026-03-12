import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const stats = [
  { value: '4°', label: 'Período', sub: 'Eng. Software' },
  { value: '1k+', label: 'Liderados', sub: 'Ordem DeMolay' },
  { value: '3+', label: 'Projetos', sub: 'Publicados' },
  { value: 'B2+', label: 'Inglês', sub: 'Avançado' },
]

const roles = ['Desenvolvedor Frontend', 'UX/UI Designer', 'Líder de Equipes', 'Engenheiro de Software']

export default function Hero() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    const particles = []

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    for (let i = 0; i < 35; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.5,
        dx: (Math.random() - 0.5) * 0.35,
        dy: (Math.random() - 0.5) * 0.35,
        alpha: Math.random() * 0.4 + 0.1,
        color: Math.random() > 0.5 ? '59,130,246' : '16,185,129',
      })
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${p.color},${p.alpha})`
        ctx.fill()
        p.x += p.dx
        p.y += p.dy
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1
      })
      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <section id="inicio" style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: 'clamp(90px, 12vw, 130px) 20px clamp(80px, 10vw, 100px)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <canvas ref={canvasRef} style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 0,
      }} />

      <div style={{
        position: 'absolute', top: '10%', left: '-10%',
        width: '500px', height: '500px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)',
        filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0,
      }} />
      <div style={{
        position: 'absolute', bottom: '5%', right: '-5%',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 70%)',
        filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0,
      }} />

      <div style={{
        maxWidth: '1200px', margin: '0 auto', width: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
        gap: 'clamp(40px, 6vw, 80px)',
        alignItems: 'center',
        position: 'relative', zIndex: 1,
      }}>

        {/* Coluna de texto */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '6px 16px', borderRadius: '9999px',
              border: '1px solid rgba(16,185,129,0.3)',
              background: 'rgba(16,185,129,0.08)',
              marginBottom: '28px',
            }}
          >
            <span style={{
              width: '7px', height: '7px', borderRadius: '50%',
              background: '#10b981',
              boxShadow: '0 0 8px rgba(16,185,129,0.8)',
              animation: 'heroPulse 2s infinite',
            }} />
            <span style={{ fontSize: '13px', fontWeight: '500', color: '#34d399' }}>
              Disponível para Estágio
            </span>
          </motion.div>

          {/* Nome estático — sem animação letra por letra */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 style={{
              fontSize: 'clamp(36px, 5.5vw, 68px)',
              fontWeight: '900',
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
              color: '#f0f6ff',
              marginBottom: '4px',
            }}>
              João da Cunha
            </h1>
            <h1 style={{
              fontSize: 'clamp(36px, 5.5vw, 68px)',
              fontWeight: '900',
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
              background: 'linear-gradient(135deg, #3b82f6 30%, #10b981 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '22px',
            }}>
              Rabelo Neto
            </h1>
          </motion.div>

          {/* Roles como tags estáticas — sem typewriter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            style={{
              display: 'flex', flexWrap: 'wrap', gap: '8px',
              marginBottom: '24px',
            }}
          >
            {roles.map((role, i) => (
              <span key={role} style={{
                padding: '5px 13px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '600',
                letterSpacing: '0.03em',
                background: i % 2 === 0 ? 'rgba(59,130,246,0.1)' : 'rgba(16,185,129,0.1)',
                border: `1px solid ${i % 2 === 0 ? 'rgba(59,130,246,0.25)' : 'rgba(16,185,129,0.25)'}`,
                color: i % 2 === 0 ? '#60a5fa' : '#34d399',
              }}>
                {role}
              </span>
            ))}
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            style={{
              fontSize: 'clamp(14px, 1.8vw, 16px)',
              color: '#94a3b8',
              lineHeight: '1.75',
              maxWidth: '480px',
              marginBottom: '36px',
            }}
          >
            Estudante de Engenharia de Software com perfil de gestor — combino raciocínio lógico elevado com liderança natural. Ex-Mestre Conselheiro Estadual da Ordem DeMolay, liderando mais de 1.000 pessoas.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}
          >
            <motion.button
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              whileHover={{ scale: 1.04, boxShadow: '0 0 30px rgba(59,130,246,0.4)' }}
              whileTap={{ scale: 0.96 }}
              style={{
                padding: '13px 28px',
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                color: '#fff', border: 'none', borderRadius: '10px',
                fontSize: '14px', fontWeight: '700', cursor: 'pointer',
                letterSpacing: '0.02em',
              }}
            >
              Ver Projetos
            </motion.button>
            <motion.button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              whileHover={{ scale: 1.04, borderColor: 'rgba(59,130,246,0.5)' }}
              whileTap={{ scale: 0.96 }}
              style={{
                padding: '13px 28px',
                background: 'transparent',
                color: '#94a3b8', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px',
                fontSize: '14px', fontWeight: '600', cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              Entrar em Contato
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            style={{ display: 'flex', gap: '16px', marginTop: '28px', alignItems: 'center' }}
          >
            {[
              { label: 'GitHub', href: 'https://github.com/jrabeloneto', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg> },
              { label: 'LinkedIn', href: 'https://linkedin.com/in/jrabeloneto', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg> },
              { label: 'E-mail', href: 'mailto:joaocunharabelo@gmail.com', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg> },
            ].map(link => (
              <motion.a
                key={link.label}
                href={link.href}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                whileHover={{ color: '#60a5fa', y: -2 }}
                title={link.label}
                style={{ color: '#64748b', textDecoration: 'none', display: 'flex', alignItems: 'center', transition: 'all 0.2s' }}
              >
                {link.icon}
              </motion.a>
            ))}
          </motion.div>
        </div>

        {/* Coluna da foto */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          <div style={{ position: 'relative', width: 'min(320px, 80vw)' }}>
            <div style={{
              position: 'absolute', inset: '-3px',
              borderRadius: '24px',
              background: 'linear-gradient(135deg, #3b82f6, #10b981, #3b82f6)',
              backgroundSize: '200% 200%',
              animation: 'heroGradient 4s ease infinite',
              zIndex: 0,
            }} />
            <div style={{
              position: 'relative', zIndex: 1,
              borderRadius: '22px',
              overflow: 'hidden',
              background: 'var(--bg-card)',
            }}>
              <img
                src="/assets/joao-foto.jpg"
                alt="João da Cunha Rabelo Neto"
                style={{
                  width: '100%', height: 'auto', display: 'block',
                  objectFit: 'cover', aspectRatio: '3/4', objectPosition: 'top center',
                }}
              />
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: '45%',
                background: 'linear-gradient(to top, rgba(6,13,31,0.75) 0%, transparent 100%)',
              }} />
              <div style={{
                position: 'absolute', bottom: '16px', left: '16px', right: '16px',
              }}>
                <div style={{
                  padding: '8px 12px',
                  background: 'rgba(6,13,31,0.85)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '10px',
                  border: '1px solid rgba(59,130,246,0.2)',
                }}>
                  <div style={{ fontSize: '10px', color: '#60a5fa', fontWeight: '700', letterSpacing: '0.06em' }}>CEUNI-FAMETRO</div>
                  <div style={{ fontSize: '12px', color: '#f0f6ff', fontWeight: '600' }}>Eng. de Software · 4° Período</div>
                </div>
              </div>
            </div>

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute', top: '-20px', right: '-20px',
                padding: '10px 14px',
                background: 'rgba(11,29,56,0.95)',
                backdropFilter: 'blur(12px)',
                borderRadius: '12px',
                border: '1px solid rgba(16,185,129,0.25)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
              }}
            >
              <div style={{ fontSize: '10px', color: '#34d399', fontWeight: '700', letterSpacing: '0.06em', marginBottom: '2px' }}>LIDERANÇA</div>
              <div style={{ fontSize: '18px', fontWeight: '900', color: '#f0f6ff' }}>1.000+</div>
              <div style={{ fontSize: '10px', color: '#64748b' }}>Ordem DeMolay</div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              style={{
                position: 'absolute', bottom: '70px', left: '-24px',
                padding: '10px 14px',
                background: 'rgba(11,29,56,0.95)',
                backdropFilter: 'blur(12px)',
                borderRadius: '12px',
                border: '1px solid rgba(59,130,246,0.25)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
              }}
            >
              <div style={{ fontSize: '10px', color: '#60a5fa', fontWeight: '700', letterSpacing: '0.06em', marginBottom: '4px' }}>STACK</div>
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', maxWidth: '130px' }}>
                {['React', 'Angular', 'Java', 'TS'].map(t => (
                  <span key={t} style={{
                    fontSize: '10px', padding: '2px 6px',
                    background: 'rgba(59,130,246,0.15)',
                    border: '1px solid rgba(59,130,246,0.2)',
                    borderRadius: '4px', color: '#93c5fd',
                  }}>{t}</span>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Stats bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        style={{
          maxWidth: '1200px', margin: '48px auto 0', width: '100%',
          position: 'relative', zIndex: 1,
        }}
      >
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1px',
          background: 'rgba(255,255,255,0.04)',
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.05)',
        }}>
          {stats.map((s) => (
            <div key={s.label} style={{
              padding: 'clamp(14px, 2.5vw, 22px) clamp(10px, 2vw, 20px)',
              background: 'rgba(11,29,56,0.7)',
              textAlign: 'center',
              backdropFilter: 'blur(10px)',
            }}>
              <div style={{
                fontSize: 'clamp(20px, 3.5vw, 30px)', fontWeight: '900',
                background: 'linear-gradient(135deg, #3b82f6, #10b981)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>{s.value}</div>
              <div style={{ fontSize: 'clamp(10px, 1.5vw, 12px)', color: '#f0f6ff', fontWeight: '600', marginTop: '2px' }}>{s.label}</div>
              <div style={{ fontSize: 'clamp(9px, 1.2vw, 11px)', color: '#64748b', marginTop: '1px' }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </motion.div>

      <style>{`
        @keyframes heroGradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes heroPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </section>
  )
}
