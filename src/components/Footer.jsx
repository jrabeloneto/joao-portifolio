import { motion } from 'framer-motion'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer style={{
      padding: '32px 20px',
      borderTop: '1px solid rgba(255,255,255,0.04)',
      background: 'rgba(6,13,31,0.8)',
    }}>
      <div style={{
        maxWidth: '1100px', margin: '0 auto',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: '16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '28px', height: '28px',
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: '900', fontSize: '11px', color: '#080810',
          }}>JR</div>
          <span style={{ fontSize: '14px', color: '#6b7280' }}>
            © {year} João da Cunha Rabelo Neto
          </span>
        </div>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          {[
            { label: 'GitHub', href: 'https://github.com/jrabeloneto' },
            { label: 'LinkedIn', href: 'https://linkedin.com/in/jrabeloneto' },
            { label: 'E-mail', href: 'mailto:joaocunharabelo@gmail.com' },
          ].map((link) => (
            <motion.a
              key={link.label}
              href={link.href}
              target={link.href.startsWith('http') ? '_blank' : undefined}
              rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              whileHover={{ color: '#3b82f6' }}
              style={{
                fontSize: '13px', color: '#6b7280',
                textDecoration: 'none', transition: 'color 0.2s',
              }}
            >
              {link.label}
            </motion.a>
          ))}
        </div>
      </div>
    </footer>
  )
}
