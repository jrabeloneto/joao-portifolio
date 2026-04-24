import { Suspense, useState } from 'react';
import { useLenis } from './hooks/useLenis';
import { Cursor } from './components/ui/Cursor';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { DreamCanvas } from './scene/DreamCanvas';
import { Overlays } from './overlays/Overlays';
import { Navbar } from './components/ui/Navbar';

/**
 * activetheory-style architecture:
 * - a fullscreen fixed <canvas> renders the whole 3D world
 * - a 600vh invisible spacer provides scrollable range
 * - global scroll progress (0..1) drives the camera AND fades overlays
 * - HTML overlays live above the canvas, synced per-chapter
 */
export default function App() {
  useLenis();
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && <LoadingScreen onDone={() => setLoaded(true)} />}
      <Cursor />
      <Navbar />
      <Suspense fallback={null}>
        <DreamCanvas />
      </Suspense>
      <Overlays />
      {/* virtual scroll spacer — provides scrollable height that maps to progress 0..1 */}
      <div aria-hidden style={{ height: '600vh', width: '100%', pointerEvents: 'none' }} />
    </>
  );
}
