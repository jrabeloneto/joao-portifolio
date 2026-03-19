import { useEffect, useState } from 'react'
import Navigation from './components/Navigation'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  const [cursorPos, setCursorPos] = useState({ x: -400, y: -400 })
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024)
    checkDesktop()
    const handleMouseMove = (e) => setCursorPos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('resize', checkDesktop)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', checkDesktop)
    }
  }, [])

  return (
    <div style={{ position: 'relative', overflow: 'hidden', width: '100%', background: 'var(--bg-primary)' }}>
      {isDesktop && (
        <div style={{
          pointerEvents: 'none',
          position: 'fixed',
          width: '700px',
          height: '700px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 65%)',
          transform: `translate(${cursorPos.x - 350}px, ${cursorPos.y - 350}px)`,
          zIndex: 0,
          transition: 'transform 0.12s ease-out',
        }} />
      )}
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundImage: `linear-gradient(rgba(59,130,246,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.025) 1px, transparent 1px)`,
        backgroundSize: '80px 80px',
        zIndex: 0,
        pointerEvents: 'none',
      }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Navigation />
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
        <Footer />
      </div>
    </div>
  )
}
