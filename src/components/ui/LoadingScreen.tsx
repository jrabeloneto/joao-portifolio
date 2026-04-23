import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import styles from './LoadingScreen.module.css';

export function LoadingScreen({ onDone }: { onDone: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(
      barRef.current,
      { scaleX: 0 },
      { scaleX: 1, duration: 2.2, ease: 'power2.inOut' }
    );
    tl.to(rootRef.current, {
      opacity: 0,
      filter: 'blur(18px)',
      duration: 0.6,
      ease: 'power3.in',
      onComplete: () => {
        setGone(true);
        onDone();
      },
    });
    return () => {
      tl.kill();
    };
  }, [onDone]);

  if (gone) return null;

  return (
    <div className={styles.root} ref={rootRef}>
      <h1 className={styles.name}>JOÃO RABELO</h1>
      <div className={styles.barWrap}>
        <div className={styles.bar} ref={barRef} />
      </div>
      <span className={styles.meta}>LOADING · v2</span>
    </div>
  );
}
