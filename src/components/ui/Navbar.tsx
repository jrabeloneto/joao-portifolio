import styles from './Navbar.module.css';

const links = [
  { href: '#about', label: 'Sobre' },
  { href: '#projects', label: 'Projetos' },
  { href: '#skills', label: 'Stack' },
  { href: '#experience', label: 'Experiência' },
  { href: '#contact', label: 'Contato' },
];

export function Navbar() {
  return (
    <nav className={styles.nav}>
      <a href="#" className={styles.logo}>JR.</a>
      <ul className={styles.list}>
        {links.map((l) => (
          <li key={l.href}>
            <a href={l.href}>{l.label}</a>
          </li>
        ))}
      </ul>
      <a href="#contact" className={styles.cta} data-cursor>
        <span className={styles.dot} /> disponível
      </a>
    </nav>
  );
}
