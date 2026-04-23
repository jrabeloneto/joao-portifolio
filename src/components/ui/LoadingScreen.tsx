import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import styles from './LoadingScreen.module.css';

export function LoadingScreen({ onDone }: { onDone: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const sunRef = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(
      sunRef.current,
      { y: 160, opacity: 0 },
      { y: -20, opacity: 1, duration: 2.4, ease: 'power3.out' }
    );
    tl.to(
      rootRef.current,
      {
        opacity: 0,
        filter: 'blur(24px) brightness(1.4)',
        duration: 0.8,
        ease: 'power4.in',
        onComplete: () => {
          setGone(true);
          onDone();
        },
      },
      '+=0.1'
    );
    return () => {
      tl.kill();
    };
  }, [onDone]);

  if (gone) return null;

  return (
    <div className={styles.root} ref={rootRef}>
      <div className={styles.sky} />
      <div className={styles.horizon} />
      <div className={styles.sun} ref={sunRef} />
      <div className={styles.meta}>
        <span className={styles.metaTop}>DREAM CYCLE · 001</span>
        <span className={styles.name}>JOÃO RABELO</span>
        <span className={styles.metaBottom}>initializing...</span>
      </div>
    </div>
  );
}
