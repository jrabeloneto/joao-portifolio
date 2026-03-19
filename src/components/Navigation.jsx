import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const navItems = [
  { label: 'Início', href: '#inicio' },
  { label: 'Sobre', href: '#about' },
  { label: 'Habilidades', href: '#skills' },
  { label: 'Projetos', href: '#projects' },
  { label: 'Contato', href: '#contact' },
]

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [active, setActive] = useState('Início')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const sectionIds = navItems.map(item => item.href.slice(1))
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const matched = navItems.find(item => item.href === `#${entry.target.id}`)
            if (matched) setActive(matched.label)
          }
        })
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    )
    sectionIds.forEach(id => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  const handleNav = (item) => {
    setActive(item.label)
    setMobileOpen(false)
    const el = document.querySelector(item.href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          padding: '0 20px',
          background: scrolled ? 'rgba(6,13,31,0.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(59,130,246,0.08)' : 'none',
          transition: 'all 0.3s ease',
        }}
      >
        <div style={{
          maxWidth: '1100px', margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px',
        }}>
          <motion.a
            href="#home"
            onClick={(e) => { e.preventDefault(); handleNav(navItems[0]) }}
            whileHover={{ scale: 1.02 }}
            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}
          >
            <div style={{
              width: '34px', height: '34px',
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: '900', fontSize: '13px', color: '#080810', flexShrink: 0,
            }}>JR</div>
            <span style={{ fontWeight: '700', fontSize: '16px', color: '#f9fafb', letterSpacing: '-0.02em' }}>
              João Rabelo
            </span>
          </motion.a>

          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }} className="desktop-nav">
            {navItems.map((item) => (
              <motion.button
                key={item.label}
                onClick={() => handleNav(item)}
                whileHover={{ scale: 1.02 }}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: '8px 14px', borderRadius: '8px', fontSize: '14px',
                  fontWeight: active === item.label ? '600' : '400',
                  color: active === item.label ? '#3b82f6' : '#9ca3af',
                  transition: 'all 0.2s ease', position: 'relative',
                }}
              >
                {item.label}
                {active === item.label && (
                  <motion.div
                    layoutId="nav-indicator"
                    style={{
                      position: 'absolute', bottom: '4px', left: '14px', right: '14px',
                      height: '2px', background: '#3b82f6', borderRadius: '1px',
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
            <motion.a
              href="/Curriculo_Joao_Rabelo_v2.pdf"
              download
              whileHover={{ scale: 1.03, boxShadow: '0 0 20px rgba(59,130,246,0.3)' }}
              whileTap={{ scale: 0.97 }}
              style={{
                marginLeft: '8px', padding: '8px 18px',
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                color: '#080810', borderRadius: '8px', textDecoration: 'none',
                fontSize: '13px', fontWeight: '700', letterSpacing: '0.02em',
              }}
            >
              Currículo
            </motion.a>
          </div>

          <motion.button
            onClick={() => setMobileOpen(!mobileOpen)}
            whileTap={{ scale: 0.9 }}
            style={{
              background: 'none', border: '1px solid rgba(59,130,246,0.25)', borderRadius: '8px',
              padding: '8px', cursor: 'pointer', display: 'none',
              flexDirection: 'column', gap: '5px', width: '40px', height: '40px',
              alignItems: 'center', justifyContent: 'center',
            }}
            className="mobile-menu-btn"
          >
            <motion.span animate={mobileOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
              style={{ display: 'block', width: '18px', height: '2px', background: '#3b82f6', borderRadius: '1px' }} />
            <motion.span animate={mobileOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
              style={{ display: 'block', width: '18px', height: '2px', background: '#3b82f6', borderRadius: '1px' }} />
            <motion.span animate={mobileOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
              style={{ display: 'block', width: '18px', height: '2px', background: '#3b82f6', borderRadius: '1px' }} />
          </motion.button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed', top: '64px', left: 0, right: 0, zIndex: 99,
              background: 'rgba(6,13,31,0.97)', backdropFilter: 'blur(20px)',
              borderBottom: '1px solid rgba(59,130,246,0.1)',
              padding: '12px 20px 24px',
            }}
          >
            {navItems.map((item, i) => (
              <motion.button
                key={item.label}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => handleNav(item)}
                style={{
                  display: 'block', width: '100%', background: 'none', border: 'none',
                  cursor: 'pointer', padding: '14px 0', fontSize: '16px',
                  fontWeight: active === item.label ? '700' : '400',
                  color: active === item.label ? '#3b82f6' : '#9ca3af',
                  textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.04)',
                }}
              >
                {item.label}
              </motion.button>
            ))}
            <motion.a
              href="/Curriculo_Joao_Rabelo_v2.pdf"
              download
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              style={{
                display: 'block', marginTop: '16px', padding: '13px 0',
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                color: '#080810', borderRadius: '8px', textDecoration: 'none',
                fontSize: '15px', fontWeight: '700', textAlign: 'center',
              }}
            >
              Baixar Currículo
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        @media (min-width: 769px) {
          .desktop-nav { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>
    </>
  )
}
