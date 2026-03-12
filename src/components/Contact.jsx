import { motion } from 'framer-motion'
import { Mail, Linkedin, Github, MapPin, MessageSquare } from 'lucide-react'

const contactLinks = [
  {
    icon: <Mail size={22} />,
    label: 'E-mail',
    value: 'jrabeloneto2@gmail.com',
    href: 'mailto:jrabeloneto2@gmail.com',
    color: '#3b82f6',
  },
  {
    icon: <Linkedin size={22} />,
    label: 'LinkedIn',
    value: 'João Rabelo',
    href: 'https://www.linkedin.com/in/joão-rabelo-44a184330',
    color: '#0077b5',
  },
  {
    icon: <Github size={22} />,
    label: 'GitHub',
    value: 'jrabeloneto',
    href: 'https://github.com/jrabeloneto',
    color: '#6366f1',
  },
  {
    icon: <MapPin size={22} />,
    label: 'Localização',
    value: 'Manaus, AM — Brasil',
    href: null,
    color: '#22c55e',
  },
]

export default function Contact() {
  return (
    <section
      id="contact"
      style={{
        padding: '100px 24px',
        background: 'var(--navy-mid)',
      }}
    >
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '64px' }}
        >
          <p style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '14px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' }}>
            Vamos conversar
          </p>
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 800,
            color: 'var(--text-primary)',
            letterSpacing: '-1px',
            marginBottom: '20px',
          }}>
            Entre em Contato
          </h2>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '1.05rem',
            maxWidth: '560px',
            margin: '0 auto',
            lineHeight: 1.8,
          }}>
            Estou disponível para estágios, projetos freelance e colaborações.
            Se você tem uma oportunidade interessante, adoraria conversar.
          </p>
        </motion.div>

        {/* Card principal */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--border)',
            borderRadius: '24px',
            padding: '48px',
            textAlign: 'center',
            marginBottom: '40px',
          }}
        >
          <div style={{
            width: '72px', height: '72px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px',
            color: 'white',
          }}>
            <MessageSquare size={32} />
          </div>

          <h3 style={{
            color: 'var(--text-primary)',
            fontSize: '1.5rem',
            fontWeight: 700,
            marginBottom: '12px',
          }}>
            Disponível para Estágio
          </h3>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '15px',
            lineHeight: 1.8,
            marginBottom: '32px',
            maxWidth: '500px',
            margin: '0 auto 32px',
          }}>
            Busco oportunidade de estágio em Desenvolvimento Frontend, UX/UI ou Gestão de Projetos de Software.
            Trabalho remoto ou híbrido em Manaus, AM.
          </p>

          <motion.a
            href="mailto:jrabeloneto2@gmail.com"
            whileHover={{ scale: 1.05, background: 'var(--accent-hover)' }}
            whileTap={{ scale: 0.95 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              background: 'var(--accent)',
              color: 'white',
              padding: '16px 40px',
              borderRadius: '12px',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: 600,
              transition: 'all 0.2s',
            }}
          >
            <Mail size={20} />
            Enviar E-mail
          </motion.a>
        </motion.div>

        {/* Links de contato */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
        }}>
          {contactLinks.map((link, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              {link.href ? (
                <motion.a
                  href={link.href}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  whileHover={{ y: -4, borderColor: link.color }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '14px',
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    padding: '20px',
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ color: link.color }}>{link.icon}</div>
                  <div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 500, marginBottom: '2px' }}>
                      {link.label}
                    </p>
                    <p style={{ color: 'var(--text-primary)', fontSize: '14px', fontWeight: 600 }}>
                      {link.value}
                    </p>
                  </div>
                </motion.a>
              ) : (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '14px',
                  background: 'var(--card-bg)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '20px',
                }}>
                  <div style={{ color: link.color }}>{link.icon}</div>
                  <div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 500, marginBottom: '2px' }}>
                      {link.label}
                    </p>
                    <p style={{ color: 'var(--text-primary)', fontSize: '14px', fontWeight: 600 }}>
                      {link.value}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
