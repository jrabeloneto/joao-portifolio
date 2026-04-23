import { useState } from 'react';
import { useLenis } from './hooks/useLenis';
import { useParallaxLayers } from './hooks/useParallaxLayers';
import { Cursor } from './components/ui/Cursor';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { Navbar } from './components/ui/Navbar';
import { AmbientScene } from './components/three/AmbientScene';
import { CloudBand } from './components/ui/CloudBand';
import { Hero } from './components/sections/Hero';
import { About } from './components/sections/About';
import { Projects } from './components/sections/Projects';
import { Skills } from './components/sections/Skills';
import { Experience } from './components/sections/Experience';
import { Contact } from './components/sections/Contact';

export default function App() {
  useLenis();
  useParallaxLayers();
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && <LoadingScreen onDone={() => setLoaded(true)} />}
      <AmbientScene />
      <Cursor />
      <Navbar />
      <main>
        <Hero />
        <CloudBand variant="full" tint="rose" />
        <About />
        <CloudBand variant="full" tint="mist" />
        <Projects />
        <CloudBand variant="full" tint="cream" />
        <Skills />
        <CloudBand variant="full" tint="sky" />
        <Experience />
        <CloudBand variant="full" tint="rose" />
        <Contact />
      </main>
    </>
  );
}
