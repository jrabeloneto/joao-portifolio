import { useCursor } from '../../hooks/useCursor';
import styles from './Cursor.module.css';

export function Cursor() {
  const ref = useCursor();
  return <div className={styles.cursor} ref={ref} aria-hidden />;
}
