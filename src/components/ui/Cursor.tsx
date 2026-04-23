import { useCursor } from '../../hooks/useCursor';
import styles from './Cursor.module.css';

export function Cursor() {
  const { cursorRef, trailRef } = useCursor();
  return (
    <>
      <div className={styles.trail} ref={trailRef} aria-hidden />
      <div className={styles.dot} ref={cursorRef} aria-hidden />
    </>
  );
}
