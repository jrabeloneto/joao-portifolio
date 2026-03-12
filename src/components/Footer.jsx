import { motion } from 'framer-motion'
import { Github, Linkedin, Mail, Heart } from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer style={{
      background: 'var(--navy)',
      borderTop: '1px solid var(--border)',
      padding: '40px 24px',
    }}>
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px',
      }}>
        {/* Logo */}
        <div>
          <p style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '18px', marginBottom: '4px' }}>
            João <span style={{ color: 'var(--accent)' }}>Rabelo</span>
          </p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
            Desenvolvedor Frontend · UX/UI Designer
          </p>
        </div>

        {/* Redes sociais */}
        <div style={{ display: 'flex', gap: '16px' }}>
          {[
            { icon: <Github size={20} />, href: 'https://github.com/jrabeloneto', label: 'GitHub' },
            { icon: <Linkedin size={20} />, href: 'https://www.linkedin.com/in/joão-rabelo-44a184330', label: 'LinkedIn' },
            { icon: <Mail size={20} />, href: 'mailto:jrabeloneto2@gmail.com', label: 'Email' },
          ].map((s) => (
            <motion.a
              key={s.label}
              href={s.href}
              target={s.href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2, color: 'var(--accent)' }}
              style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }}
              aria-label={s.label}
            >
              {s.icon}
            </motion.a>
          ))}
        </div>

        {/* Copyright */}
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '13px',
          display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          © {year} João Rabelo. Feito com
          <Heart size={14} style={{ color: '#ef4444', fill: '#ef4444' }} />
          em Manaus, AM.
        </p>
      </div>
    </footer>
  )
}
