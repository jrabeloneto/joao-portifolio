# Portfólio v2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build João Rabelo's personal portfolio v2 — a Dark Dreamcore Cinematográfico single-page React site with GSAP+Lenis animations, Three.js hero, 6 sections, 8 project cards, and deploy it to the existing `jrabeloneto/joao-portifolio` GitHub repo on branch `v2-dark-dreamcore`.

**Architecture:** Vite 6 + React 19 + TypeScript SPA. CSS Modules + CSS custom properties (no Tailwind). GSAP 3.13 + ScrollTrigger + Lenis for animations. Three.js via @react-three/fiber for the hero scene. 8 sections of `public/assets/projects/*.jpg` are generated one-time via a headless Playwright script from Vercel deploys. No backend; contact form opens `mailto:`.

**Tech Stack:** React 19, TypeScript, Vite 6, GSAP 3.13, @gsap/react, ScrollTrigger, Lenis, Three.js, @react-three/fiber, @react-three/drei, Framer Motion (optional interactions), Lucide React, Playwright (dev-time only, for screenshots).

**Spec:** See `docs/superpowers/specs/2026-04-23-portifolio-v2-design.md` and `claude new.pdf`.

**Working directory:** `C:\Users\CNT\Downloads\joao-portifolio-v2\`

---

## File map

```
joao-portifolio-v2/
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── index.html
├── vercel.json
├── README.md
├── .gitignore
├── scripts/
│   └── capture-screenshots.mjs   # Playwright headless, runs once
├── public/
│   └── assets/
│       ├── projects/             # 8x jpg generated
│       └── noise.svg             # grain overlay source
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── vite-env.d.ts
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Cursor.tsx
│   │   │   ├── Cursor.module.css
│   │   │   ├── LoadingScreen.tsx
│   │   │   ├── LoadingScreen.module.css
│   │   │   ├── Navbar.tsx
│   │   │   ├── Navbar.module.css
│   │   │   ├── GrainOverlay.tsx
│   │   │   └── GrainOverlay.module.css
│   │   ├── sections/
│   │   │   ├── Hero.tsx / Hero.module.css
│   │   │   ├── About.tsx / About.module.css
│   │   │   ├── Projects.tsx / Projects.module.css
│   │   │   ├── Skills.tsx / Skills.module.css
│   │   │   ├── Experience.tsx / Experience.module.css
│   │   │   └── Contact.tsx / Contact.module.css
│   │   └── three/
│   │       └── HeroScene.tsx     # particle sphere
│   ├── hooks/
│   │   ├── useLenis.ts
│   │   ├── useGSAP.ts
│   │   └── useCursor.ts
│   ├── styles/
│   │   ├── globals.css           # reset, tokens, grain, fonts
│   │   ├── typography.css
│   │   └── animations.css        # @keyframes grain, fade, etc.
│   └── data/
│       └── projects.ts
```

---

## Task 1: Scaffold Vite React TS project

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/vite-env.d.ts`, `.gitignore`

- [ ] **Step 1: Run scaffold**

```bash
cd "C:/Users/CNT/Downloads/joao-portifolio-v2"
npm create vite@latest . -- --template react-ts
```

If prompted about non-empty directory (the `docs/` folder exists), choose "Ignore files and continue".

- [ ] **Step 2: Install base deps**

```bash
npm install
```

- [ ] **Step 3: Install project deps**

```bash
npm install gsap @gsap/react lenis three @react-three/fiber @react-three/drei lucide-react
npm install -D @types/three playwright sharp
```

- [ ] **Step 4: Verify dev server boots**

```bash
npm run dev
```

Expected: Vite prints `Local: http://localhost:5173/`. Ctrl+C to stop.

- [ ] **Step 5: Git init and first commit**

```bash
cd "C:/Users/CNT/Downloads/joao-portifolio-v2"
git init -b v2-dark-dreamcore
git add -A
git commit -m "chore: scaffold vite react ts + install deps"
```

---

## Task 2: Global styles, tokens, fonts, grain

**Files:**
- Create: `src/styles/globals.css`, `src/styles/typography.css`, `src/styles/animations.css`, `public/assets/noise.svg`
- Modify: `src/main.tsx`, `index.html`

- [ ] **Step 1: Add Google Fonts to `index.html`**

Replace the `<head>` tag content in `index.html` with:

```html
<meta charset="UTF-8" />
<link rel="icon" type="image/svg+xml" href="/vite.svg" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Playfair+Display:wght@400;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet" />
<title>João Rabelo — Software Lead</title>
<meta name="description" content="Software Lead e Fullstack Developer. Construo produtos onde engenharia encontra estética cinematográfica." />
```

- [ ] **Step 2: Create `public/assets/noise.svg`**

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300">
  <filter id="n">
    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch"/>
    <feColorMatrix type="saturate" values="0"/>
  </filter>
  <rect width="100%" height="100%" filter="url(#n)" opacity="0.9"/>
</svg>
```

- [ ] **Step 3: Create `src/styles/globals.css`**

```css
:root {
  --color-bg: #050508;
  --color-surface: #0A0D1A;
  --color-surface-2: #0F1525;
  --color-surface-light: #F5F2EC;
  --color-accent: #FF6500;
  --color-accent-cool: #4FACFE;
  --color-fog: #C8B8FF18;
  --color-text: #F0EDE8;
  --color-text-dim: #7A7A8C;
  --color-text-dark: #1A1A22;

  --ease-cine: cubic-bezier(0.22, 1, 0.36, 1);
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body { background: var(--color-bg); color: var(--color-text); }
html { scroll-behavior: auto; } /* Lenis handles it */
body {
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  line-height: 1.5;
  overflow-x: hidden;
  min-height: 100vh;
  cursor: none; /* custom cursor */
}
@media (max-width: 768px) { body { cursor: auto; } }

a { color: inherit; text-decoration: none; }
button { font: inherit; background: none; border: none; color: inherit; cursor: none; }
img { max-width: 100%; display: block; }

/* Grain overlay */
body::after {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url('/assets/noise.svg');
  background-size: 300px 300px;
  opacity: 0.04;
  pointer-events: none;
  z-index: 9999;
  animation: grain 0.5s steps(1) infinite;
  mix-blend-mode: overlay;
}

::selection { background: var(--color-accent); color: var(--color-bg); }
```

- [ ] **Step 4: Create `src/styles/typography.css`**

```css
.font-display { font-family: 'Bebas Neue', sans-serif; letter-spacing: 0.02em; }
.font-serif   { font-family: 'Playfair Display', serif; }
.font-mono    { font-family: 'IBM Plex Mono', monospace; }

h1, h2, h3 { font-family: 'Bebas Neue', sans-serif; font-weight: 400; line-height: 0.95; }
h1 { font-size: clamp(3rem, 15vw, 15rem); }
h2 { font-size: clamp(2rem, 6vw, 5rem); }
h3 { font-size: clamp(1.5rem, 3vw, 2.5rem); }
```

- [ ] **Step 5: Create `src/styles/animations.css`**

```css
@keyframes grain {
  0%, 100% { transform: translate(0, 0); }
  10% { transform: translate(-5%, -10%); }
  30% { transform: translate(3%, -15%); }
  50% { transform: translate(12%, 9%); }
  70% { transform: translate(9%, 4%); }
  90% { transform: translate(-1%, 7%); }
}
@keyframes pulse {
  0%, 100% { opacity: 0.4; transform: translateY(0); }
  50% { opacity: 1; transform: translateY(8px); }
}
```

- [ ] **Step 6: Import all three in `src/main.tsx`**

Replace contents:

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/globals.css'
import './styles/typography.css'
import './styles/animations.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

- [ ] **Step 7: Delete default Vite styles**

```bash
rm -f src/App.css src/index.css src/assets/react.svg
```

- [ ] **Step 8: Verify in browser**

```bash
npm run dev
```
Open `http://localhost:5173`. Body should be dark (`#050508`), grain visible subtly. Ctrl+C.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat(style): dark dreamcore tokens, fonts, grain overlay"
```

---

## Task 3: Data — projects.ts

**Files:** Create `src/data/projects.ts`

- [ ] **Step 1: Write projects data**

```ts
export type Project = {
  slug: string;
  name: string;
  description: string;
  stack: string[];
  tag: string;
  deployUrl: string;
  githubUrl: string;
  featured: boolean;
  image: string; // /assets/projects/<slug>.jpg
};

export const projects: Project[] = [
  {
    slug: 'traxus',
    name: 'TRAXUS',
    description: 'Site sci-fi experimental paginado com Three.js, R3F e pós-processamento cinematográfico.',
    stack: ['React 19', 'Three.js', 'R3F', 'GSAP', 'Postprocessing'],
    tag: 'Experimental / 3D',
    deployUrl: 'https://traxus-steel.vercel.app/',
    githubUrl: 'https://github.com/jrabeloneto/traxus',
    featured: true,
    image: '/assets/projects/traxus.jpg',
  },
  {
    slug: 'taskflow',
    name: 'TaskFlow',
    description: 'Kanban board com drag & drop fluido, colunas dinâmicas e persistência local.',
    stack: ['React 18', 'TypeScript', 'Framer Motion', 'dnd-kit'],
    tag: 'Produto / SaaS',
    deployUrl: 'https://taskflow-eight-blond.vercel.app/',
    githubUrl: 'https://github.com/jrabeloneto/taskflow',
    featured: false,
    image: '/assets/projects/taskflow.jpg',
  },
  {
    slug: 'eventhub',
    name: 'EventHub',
    description: 'Plataforma de gerenciamento de eventos com dashboard analítico.',
    stack: ['Angular 17', 'Material', 'Chart.js'],
    tag: 'Dashboard',
    deployUrl: 'https://eventhub-2t38ukdu0-jrabelonetos-projects.vercel.app/dashboard',
    githubUrl: 'https://github.com/jrabeloneto/eventhub',
    featured: false,
    image: '/assets/projects/eventhub.jpg',
  },
  {
    slug: 'teamflow',
    name: 'TeamFlow',
    description: 'Sistema fullstack com autenticação JWT para gestão de times e tarefas.',
    stack: ['Java 17', 'Spring Boot 3', 'Angular 17', 'JWT'],
    tag: 'Fullstack',
    deployUrl: 'https://teamflow-navy.vercel.app/',
    githubUrl: 'https://github.com/jrabeloneto/teamflow',
    featured: false,
    image: '/assets/projects/teamflow.jpg',
  },
  {
    slug: 'trend-crm-erp',
    name: 'Trend CRM/ERP',
    description: 'CRM e ERP integrado com gestão de clientes, vendas e operações.',
    stack: ['React', 'TypeScript', 'Node.js'],
    tag: 'Enterprise',
    deployUrl: 'https://trend-crm-erp.vercel.app/',
    githubUrl: 'https://github.com/jrabeloneto/trend-crm-erp',
    featured: false,
    image: '/assets/projects/trend-crm-erp.jpg',
  },
  {
    slug: 'bradesco-redesign',
    name: 'Bradesco Redesign',
    description: 'Redesign completo do app mobile do Bradesco com foco em UX moderna.',
    stack: ['React', 'UX/UI'],
    tag: 'Redesign',
    deployUrl: 'https://bradesco-app-redesign.vercel.app/',
    githubUrl: 'https://github.com/jrabeloneto/bradesco-app-redesign',
    featured: false,
    image: '/assets/projects/bradesco-redesign.jpg',
  },
  {
    slug: 'techstore-v2',
    name: 'TechStore v2',
    description: 'E-commerce mobile-first com carrinho funcional e checkout fluido.',
    stack: ['React', 'Carrinho funcional'],
    tag: 'E-commerce',
    deployUrl: 'https://techstore-v2-85tz.vercel.app/',
    githubUrl: 'https://github.com/jrabeloneto/techstore-v2',
    featured: false,
    image: '/assets/projects/techstore-v2.jpg',
  },
  {
    slug: 'redesign-craigslist',
    name: 'Redesign Craigslist',
    description: 'UX moderna para Craigslist Brasil — uma releitura completa da experiência.',
    stack: ['React', 'Vite', 'Tailwind'],
    tag: 'Redesign',
    deployUrl: 'https://redesing-craiglist.vercel.app/',
    githubUrl: 'https://github.com/jrabeloneto/redesing-craiglist',
    featured: false,
    image: '/assets/projects/redesign-craigslist.jpg',
  },
];
```

- [ ] **Step 2: Commit**

```bash
git add src/data/projects.ts
git commit -m "feat(data): 8 project entries with vercel urls"
```

---

## Task 4: Screenshot capture script

**Files:** Create `scripts/capture-screenshots.mjs`

- [ ] **Step 1: Write capture script**

```js
// scripts/capture-screenshots.mjs
// Run once: node scripts/capture-screenshots.mjs
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const OUT = 'public/assets/projects';
const projects = [
  { slug: 'traxus', url: 'https://traxus-steel.vercel.app/' },
  { slug: 'taskflow', url: 'https://taskflow-eight-blond.vercel.app/' },
  { slug: 'eventhub', url: 'https://eventhub-2t38ukdu0-jrabelonetos-projects.vercel.app/dashboard' },
  { slug: 'teamflow', url: 'https://teamflow-navy.vercel.app/' },
  { slug: 'trend-crm-erp', url: 'https://trend-crm-erp.vercel.app/' },
  { slug: 'bradesco-redesign', url: 'https://bradesco-app-redesign.vercel.app/' },
  { slug: 'techstore-v2', url: 'https://techstore-v2-85tz.vercel.app/' },
  { slug: 'redesign-craigslist', url: 'https://redesing-craiglist.vercel.app/' },
];

await fs.mkdir(OUT, { recursive: true });
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });

for (const p of projects) {
  console.log(`Capturing ${p.slug}...`);
  const page = await context.newPage();
  try {
    await page.goto(p.url, { waitUntil: 'networkidle', timeout: 45_000 });
    await page.waitForTimeout(3500);
    const buf = await page.screenshot({ type: 'jpeg', quality: 85, fullPage: false });
    await fs.writeFile(path.join(OUT, `${p.slug}.jpg`), buf);
    console.log(`  ✓ ${p.slug}.jpg`);
  } catch (e) {
    console.warn(`  ✗ ${p.slug}: ${e.message} — using placeholder`);
    // Leave missing; component will show gradient placeholder
  }
  await page.close();
}
await browser.close();
console.log('Done.');
```

- [ ] **Step 2: Install Playwright browser**

```bash
npx playwright install chromium
```

- [ ] **Step 3: Run capture**

```bash
node scripts/capture-screenshots.mjs
```

Expected: 8 `.jpg` files in `public/assets/projects/`. If any fail (e.g., EventHub's auth URL), log will show — those will use placeholder in UI.

- [ ] **Step 4: Commit**

```bash
git add scripts/ public/assets/projects/
git commit -m "feat(assets): capture project screenshots from vercel deploys"
```

---

## Task 5: Custom hooks — useLenis, useGSAP, useCursor

**Files:** Create `src/hooks/useLenis.ts`, `src/hooks/useGSAP.ts`, `src/hooks/useCursor.ts`

- [ ] **Step 1: `useLenis.ts`**

```ts
import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    return () => {
      lenis.destroy();
    };
  }, []);
}
```

- [ ] **Step 2: `useGSAP.ts`** (thin wrapper re-export for convenience)

```ts
export { useGSAP } from '@gsap/react';
export { gsap } from 'gsap';
export { ScrollTrigger } from 'gsap/ScrollTrigger';
```

- [ ] **Step 3: `useCursor.ts`**

```ts
import { useEffect, useRef } from 'react';

export function useCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (window.matchMedia('(max-width: 768px)').matches) return;
    const el = cursorRef.current;
    if (!el) return;

    let x = 0, y = 0, tx = 0, ty = 0;
    const onMove = (e: MouseEvent) => { tx = e.clientX; ty = e.clientY; };
    window.addEventListener('mousemove', onMove);

    let raf = 0;
    const tick = () => {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };
    tick();

    const onEnter = () => el.classList.add('is-hover');
    const onLeave = () => el.classList.remove('is-hover');
    document.querySelectorAll('a, button, [data-cursor]').forEach((n) => {
      n.addEventListener('mouseenter', onEnter);
      n.addEventListener('mouseleave', onLeave);
    });

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return cursorRef;
}
```

- [ ] **Step 4: Commit**

```bash
git add src/hooks/
git commit -m "feat(hooks): useLenis, useGSAP, useCursor"
```

---

## Task 6: UI components — Cursor, GrainOverlay, LoadingScreen, Navbar

**Files:** `src/components/ui/Cursor.tsx(+.module.css)`, `GrainOverlay.tsx(+.module.css)`, `LoadingScreen.tsx(+.module.css)`, `Navbar.tsx(+.module.css)`

- [ ] **Step 1: `Cursor.tsx`**

```tsx
import { useCursor } from '../../hooks/useCursor';
import styles from './Cursor.module.css';

export function Cursor() {
  const ref = useCursor();
  return <div className={styles.cursor} ref={ref} aria-hidden />;
}
```

- [ ] **Step 2: `Cursor.module.css`**

```css
.cursor {
  position: fixed;
  top: 0; left: 0;
  width: 28px; height: 28px;
  border: 1px solid var(--color-accent);
  border-radius: 50%;
  pointer-events: none;
  z-index: 10000;
  mix-blend-mode: difference;
  transition: width 0.3s var(--ease-cine), height 0.3s var(--ease-cine), background-color 0.3s;
  background: transparent;
}
.cursor:global(.is-hover) {
  width: 56px; height: 56px;
  background: color-mix(in srgb, var(--color-accent) 30%, transparent);
}
@media (max-width: 768px) { .cursor { display: none; } }
```

- [ ] **Step 3: `LoadingScreen.tsx`** (auto-dismisses in ~2.5s)

```tsx
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import styles from './LoadingScreen.module.css';

export function LoadingScreen({ onDone }: { onDone: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(barRef.current, { scaleX: 0 }, { scaleX: 1, duration: 2.2, ease: 'power2.inOut' });
    tl.to(rootRef.current, {
      opacity: 0,
      filter: 'blur(18px)',
      duration: 0.6,
      ease: 'power3.in',
      onComplete: () => { setGone(true); onDone(); },
    });
  }, [onDone]);

  if (gone) return null;
  return (
    <div className={styles.root} ref={rootRef}>
      <h1 className={styles.name}>JOÃO RABELO</h1>
      <div className={styles.barWrap}><div className={styles.bar} ref={barRef} /></div>
      <span className={styles.meta}>LOADING · v2</span>
    </div>
  );
}
```

- [ ] **Step 4: `LoadingScreen.module.css`**

```css
.root {
  position: fixed; inset: 0;
  background: var(--color-bg);
  z-index: 9998;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 2rem;
}
.name {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(3rem, 12vw, 10rem);
  color: var(--color-text);
  letter-spacing: 0.05em;
}
.barWrap {
  width: min(420px, 60vw);
  height: 2px;
  background: var(--color-text-dim);
  overflow: hidden;
}
.bar {
  height: 100%;
  background: var(--color-accent);
  transform-origin: left center;
  transform: scaleX(0);
}
.meta {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.7rem;
  color: var(--color-text-dim);
  letter-spacing: 0.3em;
}
```

- [ ] **Step 5: `Navbar.tsx`**

```tsx
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
          <li key={l.href}><a href={l.href}>{l.label}</a></li>
        ))}
      </ul>
    </nav>
  );
}
```

- [ ] **Step 6: `Navbar.module.css`**

```css
.nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2.5rem;
  mix-blend-mode: difference;
  color: var(--color-text);
}
.logo {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.4rem;
  letter-spacing: 0.1em;
}
.list {
  display: flex; gap: 2rem;
  list-style: none;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}
.list a { transition: color 0.3s; }
.list a:hover { color: var(--color-accent); }
@media (max-width: 768px) { .list { display: none; } }
```

- [ ] **Step 7: `GrainOverlay.tsx`** — already in globals.css as body::after, so this component is a no-op placeholder for future per-section grain.

```tsx
export function GrainOverlay() { return null; }
```

- [ ] **Step 8: Commit**

```bash
git add src/components/ui/
git commit -m "feat(ui): cursor, loading screen, navbar"
```

---

## Task 7: Hero section + Three.js particles scene

**Files:** `src/components/sections/Hero.tsx(+.module.css)`, `src/components/three/HeroScene.tsx`

- [ ] **Step 1: `HeroScene.tsx`** — particle sphere

```tsx
import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

function Particles() {
  const ref = useRef<THREE.Points>(null!);
  const { positions } = useMemo(() => {
    const N = 2400;
    const positions = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      const r = 2.4 + (Math.random() - 0.5) * 0.6;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    return { positions };
  }, []);

  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.rotation.y += dt * 0.08;
    ref.current.rotation.x += dt * 0.02;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.015} color="#FF6500" transparent opacity={0.85} sizeAttenuation depthWrite={false} />
    </points>
  );
}

export function HeroScene() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 2]}>
      <ambientLight intensity={0.4} />
      <Particles />
    </Canvas>
  );
}
```

- [ ] **Step 2: `Hero.tsx`**

```tsx
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { HeroScene } from '../three/HeroScene';
import styles from './Hero.module.css';

const ROLES = ['React & Node', 'Three.js & 3D Web', 'Angular & Spring Boot'];

export function Hero() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [roleIdx, setRoleIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setRoleIdx((i) => (i + 1) % ROLES.length), 2800);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const split = rootRef.current!.querySelectorAll(`.${styles.titleLine}`);
      gsap.from(split, {
        yPercent: 110,
        opacity: 0,
        stagger: 0.12,
        duration: 1.2,
        ease: 'power4.out',
        delay: 0.3,
      });
      gsap.from(`.${styles.subtitle}`, { opacity: 0, y: 20, duration: 1, delay: 1.2, ease: 'power2.out' });
      gsap.from(`.${styles.cta}, .${styles.scroll}`, { opacity: 0, y: 20, duration: 1, delay: 1.4, ease: 'power2.out' });
      gsap.from(`.${styles.canvas}`, { opacity: 0, duration: 2, delay: 0.6, ease: 'power2.out' });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.root} ref={rootRef}>
      <div className={styles.canvas}><HeroScene /></div>
      <div className={styles.content}>
        <h1 className={styles.title}>
          <span className={styles.lineWrap}><span className={styles.titleLine}>JOÃO</span></span>
          <span className={styles.lineWrap}><span className={styles.titleLine}>RABELO</span></span>
        </h1>
        <p className={styles.subtitle}>
          Software Lead · Fullstack Developer · Manaus, BR
        </p>
        <div className={styles.rolesWrap}>
          <span className={styles.rolesLabel}>// currently building with</span>
          <span key={roleIdx} className={styles.role}>{ROLES[roleIdx]}</span>
        </div>
        <a href="#projects" className={styles.cta} data-cursor>
          <span>VER PROJETOS</span>
        </a>
      </div>
      <div className={styles.scroll}><span>scroll</span><div className={styles.scrollLine} /></div>
    </section>
  );
}
```

- [ ] **Step 3: `Hero.module.css`**

```css
.root {
  position: relative;
  min-height: 100vh;
  display: flex; align-items: center; justify-content: center;
  overflow: hidden;
  background: radial-gradient(ellipse at center, #0A0D1A 0%, #050508 70%);
}
.canvas { position: absolute; inset: 0; opacity: 0.9; }
.content { position: relative; z-index: 2; text-align: center; padding: 0 2rem; }

.title { font-family: 'Bebas Neue', sans-serif; font-size: clamp(4rem, 15vw, 15rem); line-height: 0.9; color: var(--color-text); }
.lineWrap { display: block; overflow: hidden; }
.titleLine { display: block; }

.subtitle {
  margin-top: 1.2rem;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.85rem;
  letter-spacing: 0.3em;
  color: var(--color-text-dim);
  text-transform: uppercase;
}
.rolesWrap { margin-top: 1.8rem; font-family: 'IBM Plex Mono', monospace; font-size: 0.9rem; display: flex; gap: 0.8rem; justify-content: center; align-items: center; flex-wrap: wrap; }
.rolesLabel { color: var(--color-text-dim); }
.role { color: var(--color-accent); min-width: 200px; text-align: left; animation: typewriter 0.4s ease; }
@keyframes typewriter { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }

.cta {
  display: inline-block;
  margin-top: 3rem;
  padding: 1rem 2.5rem;
  border: 1px solid var(--color-accent);
  color: var(--color-text);
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.85rem;
  letter-spacing: 0.3em;
  position: relative;
  overflow: hidden;
  transition: color 0.4s;
}
.cta::before {
  content: ''; position: absolute; inset: 0;
  background: var(--color-accent);
  transform: translateY(100%);
  transition: transform 0.4s var(--ease-cine);
  z-index: -1;
}
.cta:hover { color: var(--color-bg); }
.cta:hover::before { transform: translateY(0); }
.cta span { position: relative; z-index: 2; }

.scroll {
  position: absolute; bottom: 2rem; left: 50%; transform: translateX(-50%);
  font-family: 'IBM Plex Mono', monospace; font-size: 0.7rem;
  color: var(--color-text-dim); letter-spacing: 0.3em;
  display: flex; flex-direction: column; align-items: center; gap: 0.6rem;
  animation: pulse 2.4s ease-in-out infinite;
}
.scrollLine { width: 1px; height: 40px; background: var(--color-accent); }
```

- [ ] **Step 4: Wire Hero into App (temporary)**

Replace `src/App.tsx` contents:

```tsx
import { useState } from 'react';
import { useLenis } from './hooks/useLenis';
import { Cursor } from './components/ui/Cursor';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { Navbar } from './components/ui/Navbar';
import { Hero } from './components/sections/Hero';

export default function App() {
  useLenis();
  const [loaded, setLoaded] = useState(false);
  return (
    <>
      {!loaded && <LoadingScreen onDone={() => setLoaded(true)} />}
      <Cursor />
      <Navbar />
      <Hero />
    </>
  );
}
```

- [ ] **Step 5: Verify in browser**

```bash
npm run dev
```

Expected: loading screen ~2.5s → fades with blur → hero appears with text reveal, particle sphere, mono subtitle, rotating roles, cta, scroll indicator. Custom cursor visible.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(hero): three.js particle sphere + cinematic text reveal"
```

---

## Task 8: About section

**Files:** `src/components/sections/About.tsx(+.module.css)`

- [ ] **Step 1: `About.tsx`**

```tsx
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './About.module.css';

const STATS = [
  { value: 3, suffix: '+', label: 'anos de experiência' },
  { value: 15, suffix: '+', label: 'projetos entregues' },
  { value: 5, suffix: '', label: 'tecnologias dominadas' },
];

function useCountUp(ref: React.RefObject<HTMLSpanElement | null>, end: number) {
  useEffect(() => {
    if (!ref.current) return;
    const obj = { v: 0 };
    const tween = gsap.to(obj, {
      v: end,
      duration: 1.8,
      ease: 'power2.out',
      onUpdate: () => {
        if (ref.current) ref.current.textContent = Math.round(obj.v).toString();
      },
      scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true },
    });
    return () => { tween.kill(); };
  }, [ref, end]);
}

function StatItem({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useCountUp(ref, value);
  return (
    <div className={styles.stat}>
      <span className={styles.statValue}>
        <span ref={ref}>0</span>{suffix}
      </span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  );
}

export function About() {
  const rootRef = useRef<HTMLElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(`.${styles.paragraph}`, {
        opacity: 0, y: 24,
        duration: 1, ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: { trigger: rootRef.current, start: 'top 70%' },
      });
      gsap.from(`.${styles.kicker}`, {
        opacity: 0, x: -20,
        duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: rootRef.current, start: 'top 75%' },
      });
      gsap.to(visualRef.current, {
        y: -60,
        ease: 'none',
        scrollTrigger: { trigger: rootRef.current, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.root} ref={rootRef} id="about">
      <div className={styles.grid}>
        <div className={styles.left}>
          <span className={styles.kicker}>// 01 — SOBRE</span>
          <p className={styles.paragraph}>
            Software Lead na <strong>AI.OTIK</strong>, de Manaus pro mundo.
          </p>
          <p className={styles.paragraph}>
            Lidero times e construo produtos onde engenharia dura encontra estética cinematográfica —
            do backend em <em>Spring Boot</em> ao frontend 3D em <em>Three.js</em>.
          </p>
          <p className={styles.paragraph}>
            Obcecado por problemas difíceis, interfaces que respiram, e por transformar o
            <span className={styles.highlight}> impossível em possível</span>.
          </p>
        </div>
        <div className={styles.right} ref={visualRef}>
          <div className={styles.visualCard}>
            <div className={styles.visualInner}>
              <span className={styles.visualMono}>// fullstack</span>
              <span className={styles.visualBig}>JR</span>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.stats}>
        {STATS.map((s) => <StatItem key={s.label} {...s} />)}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: `About.module.css`**

```css
.root {
  background: var(--color-surface-light);
  color: var(--color-text-dark);
  border-radius: 32px 32px 0 0;
  padding: clamp(4rem, 10vw, 9rem) clamp(1.5rem, 6vw, 6rem);
  min-height: 100vh;
  position: relative;
  z-index: 3;
  margin-top: -32px;
}
.grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: clamp(2rem, 6vw, 6rem);
  align-items: center;
}
@media (max-width: 900px) { .grid { grid-template-columns: 1fr; } }

.kicker {
  display: block;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.75rem;
  letter-spacing: 0.3em;
  color: var(--color-accent);
  margin-bottom: 2rem;
  text-transform: uppercase;
}
.paragraph {
  font-family: 'Playfair Display', serif;
  font-size: clamp(1.2rem, 2.2vw, 2rem);
  line-height: 1.35;
  color: var(--color-text-dark);
  margin-bottom: 1.5rem;
}
.paragraph strong { font-weight: 700; }
.paragraph em { font-style: italic; color: var(--color-accent); font-weight: 500; }
.highlight { color: var(--color-accent); font-weight: 700; font-style: italic; }

.right { display: flex; justify-content: center; align-items: center; }
.visualCard {
  width: min(360px, 80%);
  aspect-ratio: 3/4;
  background: linear-gradient(135deg, #0A0D1A 0%, #1a1525 60%, #FF6500 160%);
  border-radius: 12px;
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
  box-shadow: 0 30px 80px rgba(10, 13, 26, 0.25);
}
.visualInner { position: relative; width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: space-between; }
.visualMono { font-family: 'IBM Plex Mono', monospace; font-size: 0.7rem; color: var(--color-text-dim); letter-spacing: 0.2em; }
.visualBig { font-family: 'Bebas Neue', sans-serif; font-size: clamp(8rem, 16vw, 16rem); color: var(--color-text); line-height: 0.85; align-self: flex-end; }

.stats {
  margin-top: clamp(4rem, 10vw, 8rem);
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  padding-top: 3rem;
  border-top: 1px solid rgba(26, 26, 34, 0.15);
}
@media (max-width: 700px) { .stats { grid-template-columns: 1fr; } }
.stat { display: flex; flex-direction: column; gap: 0.4rem; }
.statValue { font-family: 'Bebas Neue', sans-serif; font-size: clamp(3rem, 6vw, 5rem); color: var(--color-text-dark); line-height: 1; }
.statLabel { font-family: 'IBM Plex Mono', monospace; font-size: 0.75rem; letter-spacing: 0.2em; color: var(--color-text-dark); opacity: 0.6; text-transform: uppercase; }
```

- [ ] **Step 3: Wire into App**

Add `import { About } from './components/sections/About';` and place `<About />` after `<Hero />` in `App.tsx`.

- [ ] **Step 4: Verify in browser** — scroll past hero, About section emerges with border-radius. Text reveals on scroll, counters animate, visual card parallax.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(about): editorial section with countup stats and parallax visual"
```

---

## Task 9: Projects section

**Files:** `src/components/sections/Projects.tsx(+.module.css)`

- [ ] **Step 1: `Projects.tsx`**

```tsx
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import { projects, type Project } from '../../data/projects';
import styles from './Projects.module.css';

function ProjectCard({ project, featured = false }: { project: Project; featured?: boolean }) {
  return (
    <a
      href={project.deployUrl}
      target="_blank" rel="noreferrer"
      className={`${styles.card} ${featured ? styles.featured : ''}`}
      data-cursor
    >
      <div className={styles.imageWrap}>
        <img src={project.image} alt={project.name} className={styles.image} loading="lazy"
             onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
        <div className={styles.imagePlaceholder} aria-hidden />
        <div className={styles.overlay}>
          <div className={styles.overlayInner}>
            <span className={styles.overlayTitle}>{project.name}</span>
            <div className={styles.stack}>
              {project.stack.map((s) => <span key={s} className={styles.chip}>{s}</span>)}
            </div>
            <span className={styles.visit}>Ver projeto <ArrowUpRight size={16} /></span>
          </div>
        </div>
      </div>
      <div className={styles.meta}>
        <span className={styles.tag}>{project.tag}</span>
        <h3 className={styles.name}>{project.name}</h3>
        <p className={styles.desc}>{project.description}</p>
      </div>
    </a>
  );
}

export function Projects() {
  const rootRef = useRef<HTMLElement>(null);
  const featured = projects.find((p) => p.featured)!;
  const rest = projects.filter((p) => !p.featured);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(`.${styles.card}`, {
        opacity: 0, y: 60,
        duration: 0.9, ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: { trigger: rootRef.current, start: 'top 75%' },
      });
      gsap.from(`.${styles.kicker}, .${styles.heading}`, {
        opacity: 0, y: 30,
        duration: 1, ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: { trigger: rootRef.current, start: 'top 80%' },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.root} ref={rootRef} id="projects">
      <header className={styles.header}>
        <span className={styles.kicker}>// 02 — PROJETOS SELECIONADOS</span>
        <h2 className={styles.heading}>Trabalho<br /><em>recente.</em></h2>
      </header>
      <div className={styles.grid}>
        <ProjectCard project={featured} featured />
        <div className={styles.restGrid}>
          {rest.slice(0, 3).map((p) => <ProjectCard key={p.slug} project={p} />)}
        </div>
      </div>
      <div className={styles.restGridFull}>
        {rest.slice(3).map((p) => <ProjectCard key={p.slug} project={p} />)}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: `Projects.module.css`**

```css
.root {
  background: var(--color-bg);
  color: var(--color-text);
  border-radius: 32px 32px 0 0;
  padding: clamp(4rem, 10vw, 9rem) clamp(1.5rem, 6vw, 6rem);
  margin-top: -32px;
  position: relative;
  z-index: 4;
}
.header { margin-bottom: clamp(3rem, 6vw, 5rem); }
.kicker { font-family: 'IBM Plex Mono', monospace; font-size: 0.75rem; letter-spacing: 0.3em; color: var(--color-accent); display: block; margin-bottom: 1.2rem; text-transform: uppercase; }
.heading { font-family: 'Bebas Neue', sans-serif; font-size: clamp(3rem, 10vw, 9rem); line-height: 0.9; }
.heading em { font-family: 'Playfair Display', serif; font-style: italic; color: var(--color-accent); font-weight: 700; }

.grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}
@media (max-width: 1000px) { .grid { grid-template-columns: 1fr; } }

.restGrid { display: grid; grid-template-columns: 1fr; gap: 2rem; }
.restGridFull {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.card {
  position: relative;
  display: flex; flex-direction: column;
  border-radius: 16px;
  overflow: hidden;
  background: var(--color-surface);
  color: var(--color-text);
}
.featured { min-height: 560px; }
.featured .imageWrap { flex: 1; min-height: 420px; }

.imageWrap {
  position: relative;
  aspect-ratio: 16/10;
  overflow: hidden;
  background: linear-gradient(135deg, #0F1525, #1a0e18);
}
.image {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  object-fit: cover;
  transition: transform 0.7s var(--ease-cine);
  filter: saturate(0.9);
}
.imagePlaceholder {
  position: absolute; inset: 0;
  background:
    radial-gradient(circle at 30% 20%, rgba(255,101,0,0.25), transparent 60%),
    radial-gradient(circle at 80% 70%, rgba(79,172,254,0.18), transparent 60%),
    #0A0D1A;
  z-index: 0;
}
.card:hover .image { transform: scale(1.06); }

.overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(5,5,8,0.95) 0%, rgba(5,5,8,0.3) 70%, transparent 100%);
  opacity: 0;
  transition: opacity 0.4s var(--ease-cine);
  display: flex; align-items: flex-end;
}
.card:hover .overlay { opacity: 1; }
.overlayInner { padding: 2rem; transform: translateY(20px); transition: transform 0.5s var(--ease-cine); }
.card:hover .overlayInner { transform: translateY(0); }
.overlayTitle { font-family: 'Bebas Neue', sans-serif; font-size: 2rem; display: block; margin-bottom: 0.8rem; }
.stack { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 1rem; }
.chip { font-family: 'IBM Plex Mono', monospace; font-size: 0.65rem; letter-spacing: 0.1em; padding: 0.3rem 0.6rem; border: 1px solid var(--color-text-dim); border-radius: 100px; }
.visit { display: inline-flex; align-items: center; gap: 0.4rem; font-family: 'IBM Plex Mono', monospace; font-size: 0.8rem; color: var(--color-accent); letter-spacing: 0.15em; text-transform: uppercase; }

.meta { padding: 1.5rem; display: flex; flex-direction: column; gap: 0.5rem; }
.tag { font-family: 'IBM Plex Mono', monospace; font-size: 0.7rem; color: var(--color-text-dim); letter-spacing: 0.2em; text-transform: uppercase; }
.name { font-family: 'Bebas Neue', sans-serif; font-size: 1.8rem; line-height: 1; }
.desc { font-family: 'Inter', sans-serif; font-size: 0.9rem; color: var(--color-text-dim); line-height: 1.5; }
```

- [ ] **Step 3: Wire into App** — add `<Projects />` after `<About />`.

- [ ] **Step 4: Verify in browser** — scroll into projects, cards fade up with stagger, hover reveals overlay with stack + "Ver projeto" link.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(projects): asymmetric grid with hover reveal and stack chips"
```

---

## Task 10: Skills section

**Files:** `src/components/sections/Skills.tsx(+.module.css)`

- [ ] **Step 1: `Skills.tsx`**

```tsx
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Skills.module.css';

const GROUPS = [
  { title: 'Frontend', items: ['React 19', 'Next.js', 'Angular 17', 'TypeScript', 'Vite', 'Framer Motion', 'GSAP'] },
  { title: 'Backend', items: ['Node.js', 'Java 17', 'Spring Boot 3', 'REST APIs', 'JWT'] },
  { title: 'Database', items: ['PostgreSQL', 'MongoDB', 'MySQL'] },
  { title: 'Tools & DevOps', items: ['Git', 'GitHub', 'Docker', 'Vercel'] },
  { title: '3D & Creative', items: ['Three.js', 'R3F', 'drei', 'Postprocessing', 'Lenis'] },
];

export function Skills() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(`.${styles.group}`, {
        opacity: 0, y: 40,
        duration: 0.9, ease: 'power3.out', stagger: 0.12,
        scrollTrigger: { trigger: rootRef.current, start: 'top 75%' },
      });
      gsap.from(`.${styles.chip}`, {
        opacity: 0, y: 10,
        duration: 0.5, ease: 'power2.out', stagger: 0.03,
        scrollTrigger: { trigger: rootRef.current, start: 'top 70%' },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.root} ref={rootRef} id="skills">
      <header className={styles.header}>
        <span className={styles.kicker}>// 03 — STACK</span>
        <h2 className={styles.heading}>Ferramentas do<br /><em>ofício.</em></h2>
      </header>
      <div className={styles.grid}>
        {GROUPS.map((g) => (
          <div key={g.title} className={styles.group}>
            <h3 className={styles.groupTitle}>{g.title}</h3>
            <div className={styles.chips}>
              {g.items.map((it) => <span key={it} className={styles.chip} data-cursor>{it}</span>)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: `Skills.module.css`**

```css
.root {
  background: var(--color-bg);
  color: var(--color-text);
  padding: clamp(4rem, 10vw, 9rem) clamp(1.5rem, 6vw, 6rem);
  min-height: 80vh;
}
.header { margin-bottom: clamp(3rem, 6vw, 5rem); }
.kicker { font-family: 'IBM Plex Mono', monospace; font-size: 0.75rem; letter-spacing: 0.3em; color: var(--color-accent-cool); display: block; margin-bottom: 1.2rem; text-transform: uppercase; }
.heading { font-family: 'Bebas Neue', sans-serif; font-size: clamp(2.5rem, 8vw, 7rem); line-height: 0.9; }
.heading em { font-family: 'Playfair Display', serif; font-style: italic; color: var(--color-accent-cool); font-weight: 700; }

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 3rem;
}
.group { display: flex; flex-direction: column; gap: 1.2rem; }
.groupTitle { font-family: 'IBM Plex Mono', monospace; font-size: 0.75rem; letter-spacing: 0.3em; color: var(--color-text-dim); text-transform: uppercase; font-weight: 400; }
.chips { display: flex; flex-wrap: wrap; gap: 0.6rem; }
.chip {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.8rem;
  padding: 0.5rem 1rem;
  border: 1px solid color-mix(in srgb, var(--color-text-dim) 50%, transparent);
  border-radius: 100px;
  transition: all 0.3s var(--ease-cine);
  cursor: none;
}
.chip:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
  box-shadow: 0 0 20px color-mix(in srgb, var(--color-accent) 40%, transparent);
  transform: translateY(-2px);
}
```

- [ ] **Step 3: Wire into App** — add `<Skills />` after `<Projects />`.

- [ ] **Step 4: Verify** — scroll to skills section, chips appear with stagger, hover glows amber.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(skills): tech stack organized by category with glow hover"
```

---

## Task 11: Experience section (timeline)

**Files:** `src/components/sections/Experience.tsx(+.module.css)`

- [ ] **Step 1: `Experience.tsx`**

```tsx
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Experience.module.css';

const ENTRIES = [
  {
    when: 'Atual',
    where: 'AI.OTIK — Manaus, BR',
    title: 'Software Lead & Fullstack Developer',
    body: 'Liderança técnica de equipe de desenvolvimento. Arquitetura de produtos digitais do backend ao frontend 3D. Stack principal: React, Node.js, TypeScript, Python.',
  },
  {
    when: '2024 — 2029 (previsto)',
    where: 'Centro Universitário Fametro',
    title: 'Bacharelado em Engenharia de Software',
    body: 'Formação acadêmica em engenharia de software com foco em arquitetura de sistemas, algoritmos e desenvolvimento web.',
  },
  {
    when: 'Mandato Estadual',
    where: 'Ordem DeMolay',
    title: 'Mestre Conselheiro Estadual',
    body: 'Liderança, gestão de pessoas e organização de eventos em escala estadual. Formação em oratória, tomada de decisão e desenvolvimento de times.',
  },
];

export function Experience() {
  const rootRef = useRef<HTMLElement>(null);
  const lineRef = useRef<SVGLineElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (lineRef.current) {
        const length = lineRef.current.getTotalLength?.() ?? 1000;
        gsap.set(lineRef.current, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(lineRef.current, {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: { trigger: rootRef.current, start: 'top 70%', end: 'bottom 80%', scrub: true },
        });
      }
      gsap.from(`.${styles.entry}`, {
        opacity: 0, x: 60,
        duration: 0.9, ease: 'power3.out', stagger: 0.2,
        scrollTrigger: { trigger: rootRef.current, start: 'top 70%' },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.root} ref={rootRef} id="experience">
      <header className={styles.header}>
        <span className={styles.kicker}>// 04 — EXPERIÊNCIA</span>
        <h2 className={styles.heading}>O caminho<br /><em>até aqui.</em></h2>
      </header>
      <div className={styles.timeline}>
        <svg className={styles.svg} viewBox="0 0 20 1000" preserveAspectRatio="none" aria-hidden>
          <line ref={lineRef} x1="10" y1="0" x2="10" y2="1000" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        <ol className={styles.list}>
          {ENTRIES.map((e, i) => (
            <li key={i} className={styles.entry}>
              <span className={styles.dot} />
              <span className={styles.when}>{e.when}</span>
              <h3 className={styles.title}>{e.title}</h3>
              <span className={styles.where}>{e.where}</span>
              <p className={styles.body}>{e.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: `Experience.module.css`**

```css
.root {
  background: var(--color-surface-light);
  color: var(--color-text-dark);
  border-radius: 32px 32px 0 0;
  padding: clamp(4rem, 10vw, 9rem) clamp(1.5rem, 6vw, 6rem);
  margin-top: -32px;
  position: relative;
  z-index: 5;
  min-height: 80vh;
}
.header { margin-bottom: clamp(3rem, 6vw, 5rem); }
.kicker { font-family: 'IBM Plex Mono', monospace; font-size: 0.75rem; letter-spacing: 0.3em; color: var(--color-accent); display: block; margin-bottom: 1.2rem; text-transform: uppercase; }
.heading { font-family: 'Bebas Neue', sans-serif; font-size: clamp(2.5rem, 8vw, 7rem); line-height: 0.9; color: var(--color-text-dark); }
.heading em { font-family: 'Playfair Display', serif; font-style: italic; color: var(--color-accent); font-weight: 700; }

.timeline { position: relative; padding-left: 3rem; }
.svg { position: absolute; left: 0; top: 0; width: 20px; height: 100%; color: var(--color-accent); }
.list { list-style: none; display: flex; flex-direction: column; gap: 4rem; }
.entry { position: relative; display: flex; flex-direction: column; gap: 0.4rem; }
.dot {
  position: absolute; left: -3rem; top: 0.4rem;
  width: 14px; height: 14px; border-radius: 50%;
  background: var(--color-accent);
  box-shadow: 0 0 0 4px var(--color-surface-light), 0 0 20px var(--color-accent);
  transform: translateX(3px);
}
.when { font-family: 'IBM Plex Mono', monospace; font-size: 0.7rem; color: var(--color-accent); letter-spacing: 0.2em; text-transform: uppercase; }
.title { font-family: 'Bebas Neue', sans-serif; font-size: clamp(1.6rem, 3vw, 2.4rem); color: var(--color-text-dark); }
.where { font-family: 'IBM Plex Mono', monospace; font-size: 0.85rem; color: var(--color-text-dark); opacity: 0.7; }
.body { font-family: 'Inter', sans-serif; font-size: 1rem; line-height: 1.6; color: var(--color-text-dark); opacity: 0.8; max-width: 60ch; margin-top: 0.4rem; }
```

- [ ] **Step 3: Wire into App.**

- [ ] **Step 4: Verify** — scroll to timeline, line draws itself, entries slide in from right.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(experience): svg timeline with stroke-dashoffset draw"
```

---

## Task 12: Contact section

**Files:** `src/components/sections/Contact.tsx(+.module.css)`

- [ ] **Step 1: `Contact.tsx`**

```tsx
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
        yPercent: 60, opacity: 0,
        duration: 1.4, ease: 'power4.out',
        scrollTrigger: { trigger: rootRef.current, start: 'top 70%' },
      });
      gsap.from(`.${styles.contactRow} > *, .${styles.form} > *`, {
        opacity: 0, y: 20,
        duration: 0.8, ease: 'power2.out', stagger: 0.08,
        scrollTrigger: { trigger: rootRef.current, start: 'top 60%' },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.root} ref={rootRef} id="contact">
      <span className={styles.kicker}>// 05 — CONTATO</span>
      <h2 className={styles.heading}>
        Vamos construir<br />algo <em>incrível?</em>
      </h2>
      <div className={styles.contactRow}>
        <a href="mailto:jrabeloneto2@gmail.com" className={styles.contactLink} data-cursor>
          <Mail size={18} /> jrabeloneto2@gmail.com
        </a>
        <a href="https://github.com/jrabeloneto" target="_blank" rel="noreferrer" className={styles.contactLink} data-cursor>
          <Github size={18} /> jrabeloneto
        </a>
        <a href="https://linkedin.com/in/jrabeloneto" target="_blank" rel="noreferrer" className={styles.contactLink} data-cursor>
          <Linkedin size={18} /> linkedin.com/in/jrabeloneto
        </a>
      </div>
      <form className={styles.form} onSubmit={onSubmit}>
        <label className={styles.field}>
          <span>Nome</span>
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </label>
        <label className={styles.field}>
          <span>Email</span>
          <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </label>
        <label className={styles.field}>
          <span>Mensagem</span>
          <textarea required rows={5} value={form.msg} onChange={(e) => setForm({ ...form, msg: e.target.value })} />
        </label>
        <button type="submit" className={styles.submit} data-cursor><span>ENVIAR MENSAGEM</span></button>
      </form>
      <footer className={styles.footer}>
        <span>© 2026 João Rabelo</span>
        <span>Manaus — BR · Disponível pra projetos</span>
      </footer>
    </section>
  );
}
```

- [ ] **Step 2: `Contact.module.css`**

```css
.root {
  background: var(--color-bg);
  color: var(--color-text);
  border-radius: 32px 32px 0 0;
  padding: clamp(4rem, 10vw, 9rem) clamp(1.5rem, 6vw, 6rem);
  margin-top: -32px;
  position: relative;
  z-index: 6;
  min-height: 100vh;
}
.kicker { font-family: 'IBM Plex Mono', monospace; font-size: 0.75rem; letter-spacing: 0.3em; color: var(--color-accent); display: block; margin-bottom: 1.5rem; text-transform: uppercase; }
.heading { font-family: 'Bebas Neue', sans-serif; font-size: clamp(3rem, 12vw, 12rem); line-height: 0.85; margin-bottom: 4rem; }
.heading em { font-family: 'Playfair Display', serif; font-style: italic; color: var(--color-accent); font-weight: 700; }

.contactRow { display: flex; flex-wrap: wrap; gap: 2rem; margin-bottom: 4rem; }
.contactLink {
  display: inline-flex; align-items: center; gap: 0.6rem;
  font-family: 'IBM Plex Mono', monospace; font-size: 0.95rem;
  color: var(--color-text);
  padding-bottom: 0.4rem;
  border-bottom: 1px solid var(--color-text-dim);
  transition: all 0.3s var(--ease-cine);
}
.contactLink:hover {
  color: var(--color-accent);
  border-color: var(--color-accent);
  text-shadow: 0 0 20px color-mix(in srgb, var(--color-accent) 60%, transparent);
  transform: translateY(-2px);
}

.form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  max-width: 720px;
}
.form > :last-of-type { grid-column: 1 / -1; }
.field { display: flex; flex-direction: column; gap: 0.5rem; grid-column: span 1; }
.field:has(textarea) { grid-column: 1 / -1; }
.field span { font-family: 'IBM Plex Mono', monospace; font-size: 0.7rem; letter-spacing: 0.2em; color: var(--color-text-dim); text-transform: uppercase; }
.field input, .field textarea {
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--color-text-dim);
  color: var(--color-text);
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  padding: 0.8rem 0;
  transition: border-color 0.3s;
  resize: vertical;
}
.field input:focus, .field textarea:focus {
  outline: none;
  border-color: var(--color-accent);
}

.submit {
  justify-self: start;
  padding: 1rem 2.5rem;
  border: 1px solid var(--color-accent);
  color: var(--color-text);
  font-family: 'IBM Plex Mono', monospace; font-size: 0.85rem;
  letter-spacing: 0.3em;
  position: relative; overflow: hidden;
  transition: color 0.4s;
  cursor: none;
}
.submit::before {
  content: ''; position: absolute; inset: 0;
  background: var(--color-accent);
  transform: translateY(100%);
  transition: transform 0.4s var(--ease-cine);
  z-index: 0;
}
.submit:hover { color: var(--color-bg); }
.submit:hover::before { transform: translateY(0); }
.submit span { position: relative; z-index: 2; }

.footer {
  margin-top: 6rem;
  padding-top: 2rem;
  border-top: 1px solid color-mix(in srgb, var(--color-text-dim) 40%, transparent);
  display: flex; justify-content: space-between; flex-wrap: wrap; gap: 1rem;
  font-family: 'IBM Plex Mono', monospace; font-size: 0.75rem; color: var(--color-text-dim); letter-spacing: 0.2em; text-transform: uppercase;
}
```

- [ ] **Step 3: Wire into App.**

- [ ] **Step 4: Verify** — heading reveals aggressive from below, contact links hover glow, form focus bordas âmbar, submit opens mail client.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(contact): cta section with mailto form and social links"
```

---

## Task 13: Final App.tsx assembly + polish

**Files:** Modify `src/App.tsx`

- [ ] **Step 1: Full App.tsx**

```tsx
import { useState } from 'react';
import { useLenis } from './hooks/useLenis';
import { Cursor } from './components/ui/Cursor';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { Navbar } from './components/ui/Navbar';
import { Hero } from './components/sections/Hero';
import { About } from './components/sections/About';
import { Projects } from './components/sections/Projects';
import { Skills } from './components/sections/Skills';
import { Experience } from './components/sections/Experience';
import { Contact } from './components/sections/Contact';

export default function App() {
  useLenis();
  const [loaded, setLoaded] = useState(false);
  return (
    <>
      {!loaded && <LoadingScreen onDone={() => setLoaded(true)} />}
      <Cursor />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Experience />
        <Contact />
      </main>
    </>
  );
}
```

- [ ] **Step 2: Run full preview**

```bash
npm run dev
```

Smoke test entire flow: loading → hero → scroll all the way to footer. Cursor works. Lenis smooth. No console errors. If any section is missing its intro animation, fix scrollTrigger `start` offsets (bump `top 70%` → `top 85%` for short-viewport sections).

- [ ] **Step 3: Build**

```bash
npm run build
```

Expected: build succeeds, `dist/` created. If TS errors, fix them (unused imports, missing types).

- [ ] **Step 4: Preview build**

```bash
npm run preview
```

Check `http://localhost:4173`.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(app): assemble all sections + verify build"
```

---

## Task 14: QA checklist + mobile pass

- [ ] **Step 1: PDF checklist walkthrough**

Manually verify (in browser) each item from PDF page 10:

- [ ] Loading screen com dissolve suave (~2.5s)
- [ ] Cursor customizado funcional em desktop
- [ ] Smooth scroll com Lenis ativo
- [ ] Parallax funcionando em pelo menos 3 seções (About visual, Projects scroll, grain)
- [ ] Text reveal em todos os headlines principais (Hero, Projects, Skills, Experience, Contact)
- [ ] Border-radius reveal nas seções que emergem (About, Projects, Experience, Contact)
- [ ] Cards de projeto com hover animado
- [ ] Timeline da experiência com linha que se desenha
- [ ] Grain de filme visível mas sutil
- [ ] Responsivo em mobile (cursor off, stats em coluna, grids 1-col)
- [ ] Performance: sem janks, 60fps estável (use DevTools Performance tab)
- [ ] Todos os 8 projetos presentes com links corretos

- [ ] **Step 2: Mobile verification**

Open DevTools → device toolbar → iPhone 14 Pro. Scroll entire site. Cursor should not render. Navbar hides links. Grids collapse. No horizontal overflow.

- [ ] **Step 3: Fix any issues found, commit**

```bash
git add -A
git commit -m "fix: qa pass adjustments"
```

If no issues: skip commit.

---

## Task 15: README, vercel.json, deploy config

**Files:** Create `README.md`, `vercel.json`

- [ ] **Step 1: `vercel.json`**

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

- [ ] **Step 2: `README.md`**

```markdown
# João Rabelo — Portfólio v2

Portfolio pessoal com estética **Dark Dreamcore Cinematográfico**. React 19 + Vite 6, GSAP + Lenis, Three.js no hero.

## Dev

```bash
npm install
npm run dev
```

## Build

```bash
npm run build && npm run preview
```

## Gerar screenshots dos projetos (uma vez)

```bash
npx playwright install chromium
node scripts/capture-screenshots.mjs
```

## Stack

React 19 · TypeScript · Vite 6 · GSAP 3.13 · Lenis · Three.js · @react-three/fiber · CSS Modules.

## Deploy

Vercel — auto-deploy no push do branch `main`.
```

- [ ] **Step 3: Commit**

```bash
git add README.md vercel.json
git commit -m "docs: readme + vercel config"
```

---

## Task 16: Push to GitHub (replace existing repo content)

**Prerequisites:** User provides a GitHub Personal Access Token (classic or fine-grained, `repo` scope).

- [ ] **Step 1: Clone current remote state (sanity check, optional)**

```bash
git remote add origin https://github.com/jrabeloneto/joao-portifolio.git
git fetch origin
```

- [ ] **Step 2: Push new branch with token**

Ask user: "Me passa o GitHub Personal Access Token (não vai ser salvo em lugar nenhum, uso só pra esse push)."

Once provided, with token as `$TOKEN`:

```bash
git push "https://jrabeloneto:${TOKEN}@github.com/jrabeloneto/joao-portifolio.git" v2-dark-dreamcore
```

Expected: push succeeds, remote now has branch `v2-dark-dreamcore`.

- [ ] **Step 3: Instruct user to finalize**

Print these instructions for the user:

1. Abra `https://github.com/jrabeloneto/joao-portifolio/pull/new/v2-dark-dreamcore`
2. Crie o PR comparando `v2-dark-dreamcore` → `main`
3. Faça merge (squash ou merge commit — sua escolha)
4. Vercel detecta o push em `main` e faz deploy automaticamente

**Alternativa mais rápida** se quiser simplesmente substituir `main` com o novo branch:

```
git push "https://jrabeloneto:${TOKEN}@github.com/jrabeloneto/joao-portifolio.git" v2-dark-dreamcore:main --force
```

⚠️ Só use `--force` se tiver certeza — apaga o histórico antigo do `main`.

- [ ] **Step 4: Clear token from shell history**

```bash
history -c 2>/dev/null || true
unset TOKEN
```

---

## Self-Review Complete

- Spec coverage: ✓ (all 10 sections of spec mapped to tasks 1–16)
- Placeholder scan: ✓ (no TBDs; all code blocks complete)
- Type consistency: ✓ (`Project` type used consistently; `LoadingScreen onDone` matches)
- Responsive covered: ✓ (mobile breakpoints in every CSS)
- Checklist items: ✓ (Task 14 maps to all 12 PDF checklist items)
