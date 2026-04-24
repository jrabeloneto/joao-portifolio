import styles from './Navbar.module.css';
import { CH } from '../../state/scroll';

const links = [
  { at: CH.about[0], label: 'sobre' },
  { at: CH.projects[0], label: 'projetos' },
  { at: CH.skills[0], label: 'stack' },
  { at: CH.experience[0], label: 'experiência' },
  { at: CH.contact[0], label: 'contato' },
];

function scrollTo(progress: number) {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  window.scrollTo({ top: max * progress, behavior: 'smooth' });
}

export function Navbar() {
  return (
    <nav className={styles.nav}>
      <button className={styles.logo} onClick={() => scrollTo(0)} data-cursor>JR.</button>
      <ul className={styles.list}>
        {links.map((l) => (
          <li key={l.label}>
            <button onClick={() => scrollTo(l.at)} data-cursor>{l.label}</button>
          </li>
        ))}
      </ul>
      <button className={styles.cta} onClick={() => scrollTo(CH.contact[0])} data-cursor>
        <span className={styles.dot} /> disponível
      </button>
    </nav>
  );
}
