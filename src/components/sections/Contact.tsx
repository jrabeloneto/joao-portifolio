import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Github, Linkedin, Mail } from 'lucide-react';
import styles from './Contact.module.css';

export function Contact() {
  const rootRef = useRef<HTMLElement>(null);
  const [form, setForm] = useState({ name: '', email: '', msg: '' });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`[Portfólio] contato de ${form.name}`);
    const body = encodeURIComponent(`${form.msg}\n\n— ${form.name} (${form.email})`);
    window.location.href = `mailto:jrabeloneto2@gmail.com?subject=${subject}&body=${body}`;
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(`.${styles.heading}`, {
        yPercent: 60,
        opacity: 0,
        duration: 1.4,
        ease: 'power4.out',
        scrollTrigger: { trigger: rootRef.current, start: 'top 70%' },
      });
      gsap.from(
        `.${styles.contactRow} > *, .${styles.form} > *, .${styles.kicker}`,
        {
          opacity: 0,
          y: 20,
          duration: 0.8,
          ease: 'power2.out',
          stagger: 0.08,
          scrollTrigger: { trigger: rootRef.current, start: 'top 60%' },
        }
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.root} ref={rootRef} id="contact">
      <span className={styles.kicker}>// 05 — CONTATO</span>
      <h2 className={styles.heading}>
        Vamos construir<br />
        algo <em>incrível?</em>
      </h2>

      <div className={styles.contactRow}>
        <a
          href="mailto:jrabeloneto2@gmail.com"
          className={styles.contactLink}
          data-cursor
        >
          <Mail size={18} /> jrabeloneto2@gmail.com
        </a>
        <a
          href="https://github.com/jrabeloneto"
          target="_blank"
          rel="noreferrer"
          className={styles.contactLink}
          data-cursor
        >
          <Github size={18} /> jrabeloneto
        </a>
        <a
          href="https://linkedin.com/in/jrabeloneto"
          target="_blank"
          rel="noreferrer"
          className={styles.contactLink}
          data-cursor
        >
          <Linkedin size={18} /> linkedin.com/in/jrabeloneto
        </a>
      </div>

      <form className={styles.form} onSubmit={onSubmit}>
        <label className={styles.field}>
          <span>Nome</span>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </label>
        <label className={styles.field}>
          <span>Email</span>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </label>
        <label className={`${styles.field} ${styles.fieldFull}`}>
          <span>Mensagem</span>
          <textarea
            required
            rows={5}
            value={form.msg}
            onChange={(e) => setForm({ ...form, msg: e.target.value })}
          />
        </label>
        <button type="submit" className={styles.submit} data-cursor>
          <span>ENVIAR MENSAGEM</span>
        </button>
      </form>

      <footer className={styles.footer}>
        <span>© 2026 João Rabelo</span>
        <span>Manaus — BR · Disponível pra projetos</span>
        <span>Built with React 19 · GSAP · Three.js</span>
      </footer>
    </section>
  );
}
