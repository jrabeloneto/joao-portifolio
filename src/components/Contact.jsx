import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const contactLinks = [
  {
    label: 'E-mail',
    value: 'joaocunharabelo@gmail.com',
    href: 'mailto:joaocunharabelo@gmail.com',
    color: '#f59e0b',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="4" width="20" height="16" rx="2"/>
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    value: 'linkedin.com/in/jrabeloneto',
    href: 'https://linkedin.com/in/jrabeloneto',
    color: '#10b981',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
        <rect x="2" y="9" width="4" height="12"/>
        <circle cx="4" cy="4" r="2"/>
      </svg>
    ),
  },
  {
    label: 'GitHub',
    value: 'github.com/jrabeloneto',
    href: 'https://github.com/jrabeloneto',
    color: '#f59e0b',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
      </svg>
    ),
  },
  {
    label: 'Localização',
    value: 'Manaus, AM — Brasil',
    href: null,
    color: '#10b981',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    ),
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

export default function Contact() {
  return (
    <section id="contact" style={{
      padding: 'clamp(60px, 10vw, 120px) 20px',
      background: 'rgba(10,22,40,0.5)',
      position: 'relative',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.2), transparent)',
      }} />
      <div style={{
        position: 'absolute', top: '30%', right: '-5%', width: '350px', height: '350px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245,158,11,0.05) 0%, transparent 70%)',
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
                Contato
              </span>
            </div>
            <h2 style={{
              fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: '900',
              letterSpacing: '-0.03em', color: '#f9fafb', lineHeight: 1.1,
            }}>
              Vamos <span style={{
                background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>conversar</span>
            </h2>
            <p style={{
              marginTop: '16px', fontSize: 'clamp(14px, 2vw, 17px)',
              color: '#6b7280', maxWidth: '520px', lineHeight: '1.7',
            }}>
              Estou disponível para estágios, projetos freelance e colaborações. Fique à vontade para entrar em contato!
            </p>
          </div>
        </AnimatedSection>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 260px), 1fr))',
          gap: '16px',
          marginBottom: '48px',
        }}>
          {contactLinks.map((link, i) => (
            <AnimatedSection key={link.label} delay={i * 0.1}>
              {link.href ? (
                <motion.a
                  href={link.href}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  whileHover={{ y: -4, borderColor: `${link.color}30`, boxShadow: `0 16px 40px rgba(0,0,0,0.3), 0 0 20px ${link.color}12` }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '16px',
                    padding: '20px 24px',
                    background: 'rgba(13,30,53,0.8)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '14px',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '10px',
                    background: `${link.color}12`,
                    border: `1px solid ${link.color}25`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: link.color, flexShrink: 0,
                  }}>
                    {link.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: link.color, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '3px' }}>
                      {link.label}
                    </div>
                    <div style={{ fontSize: '14px', color: '#9ca3af', fontWeight: '500' }}>
                      {link.value}
                    </div>
                  </div>
                </motion.a>
              ) : (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '16px',
                  padding: '20px 24px',
                  background: 'rgba(13,30,53,0.8)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '14px',
                }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '10px',
                    background: `${link.color}12`,
                    border: `1px solid ${link.color}25`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: link.color, flexShrink: 0,
                  }}>
                    {link.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: link.color, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '3px' }}>
                      {link.label}
                    </div>
                    <div style={{ fontSize: '14px', color: '#9ca3af', fontWeight: '500' }}>
                      {link.value}
                    </div>
                  </div>
                </div>
              )}
            </AnimatedSection>
          ))}
        </div>

        {/* CTA principal */}
        <AnimatedSection delay={0.4}>
          <div style={{
            textAlign: 'center',
            padding: 'clamp(32px, 5vw, 56px) clamp(20px, 5vw, 48px)',
            background: 'rgba(13,30,53,0.6)',
            border: '1px solid rgba(245,158,11,0.1)',
            borderRadius: '20px',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', inset: 0,
              background: 'radial-gradient(ellipse at center, rgba(245,158,11,0.04) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '6px 16px', borderRadius: '9999px',
              border: '1px solid rgba(16,185,129,0.3)',
              background: 'rgba(16,185,129,0.08)',
              marginBottom: '20px',
            }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px rgba(16,185,129,0.8)' }} />
              <span style={{ fontSize: '13px', fontWeight: '500', color: '#34d399' }}>Disponivel para Estagio</span>
            </div>
            <h3 style={{
              fontSize: 'clamp(22px, 4vw, 36px)', fontWeight: '800',
              color: '#f9fafb', letterSpacing: '-0.02em', marginBottom: '12px',
            }}>
              Pronto para fazer parte do seu time
            </h3>
            <p style={{ fontSize: '15px', color: '#6b7280', marginBottom: '28px', maxWidth: '440px', margin: '0 auto 28px', lineHeight: '1.6' }}>
              Combino visão estratégica de gestor com habilidades técnicas em desenvolvimento. Vamos construir algo incrível juntos.
            </p>
            <motion.a
              href="mailto:joaocunharabelo@gmail.com"
              whileHover={{ scale: 1.04, boxShadow: '0 0 40px rgba(245,158,11,0.35)' }}
              whileTap={{ scale: 0.96 }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '14px 36px',
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: '#080810', borderRadius: '10px',
                textDecoration: 'none', fontSize: '15px', fontWeight: '700',
                letterSpacing: '0.02em',
              }}
            >
              Enviar E-mail
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </motion.a>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
