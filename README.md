# João Rabelo — Portfólio v2

Portfolio pessoal com estética **Dark Dreamcore Cinematográfico**. Single-page React 19 + Vite 6, animações GSAP + Lenis, cena 3D Three.js no hero.

🔗 **Live:** deploy automático no Vercel (branch `main`)

## Stack

| Camada | Tech |
|---|---|
| Build | Vite 6 + React 19 + TypeScript |
| Animações | GSAP 3.13 + ScrollTrigger + Lenis (smooth scroll) |
| 3D | Three.js + @react-three/fiber + @react-three/drei |
| Estilo | CSS Modules + CSS Custom Properties (sem Tailwind) |
| Ícones | Lucide React |
| Screenshots | Playwright (dev-only) |

## Desenvolvimento

```bash
npm install
npm run dev          # http://localhost:5173
```

## Build

```bash
npm run build
npm run preview      # http://localhost:4173
```

## Gerar screenshots dos projetos (uma vez só)

```bash
npx playwright install chromium
node scripts/capture-screenshots.mjs
```

Os arquivos vão pra `public/assets/projects/<slug>.jpg`.

## Estrutura

```
src/
├── components/
│   ├── ui/            # Cursor, LoadingScreen, Navbar, GrainOverlay
│   ├── sections/      # Hero, About, Projects, Skills, Experience, Contact
│   └── three/         # HeroScene (partículas R3F)
├── hooks/             # useLenis, useGSAP, useCursor
├── styles/            # globals, typography, animations
├── data/              # projects.ts
└── App.tsx
```

## Deploy

Vercel detecta automaticamente o push em `main` e deploya. Config em `vercel.json`.

## Seções

1. **Hero** — nome gigante + partículas 3D + roles rotativos
2. **Sobre** — editorial com countup de stats e parallax
3. **Projetos** — 8 projetos com hover reveal em camadas
4. **Stack** — skills por categoria com glow em âmbar
5. **Experiência** — timeline SVG que se desenha no scroll
6. **Contato** — CTA + form via `mailto:` + links sociais

## Licença

MIT — João Rabelo © 2026
