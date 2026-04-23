import styles from './CloudBand.module.css';

type Props = {
  variant?: 'top' | 'bottom' | 'full';
  tint?: 'rose' | 'mist' | 'cream' | 'sky';
  height?: number;
};

/**
 * Cloud transition band — a strip of fluffy painted clouds used between sections
 * so that content APPEARS to emerge from / disappear into clouds.
 * Purely decorative, pointer-events-none.
 */
export function CloudBand({ variant = 'full', tint = 'mist', height = 240 }: Props) {
  return (
    <div
      className={`${styles.band} ${styles[`variant_${variant}`]} ${styles[`tint_${tint}`]}`}
      style={{ height }}
      aria-hidden
    >
      <span className={`${styles.puff} ${styles.p1}`} />
      <span className={`${styles.puff} ${styles.p2}`} />
      <span className={`${styles.puff} ${styles.p3}`} />
      <span className={`${styles.puff} ${styles.p4}`} />
      <span className={`${styles.puff} ${styles.p5}`} />
    </div>
  );
}
