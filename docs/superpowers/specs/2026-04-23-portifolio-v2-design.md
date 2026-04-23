# Portfólio Pessoal João Rabelo — v2 Design Spec

**Data:** 2026-04-23
**Source of truth visual/animações:** `claude new.pdf` (fornecido pelo usuário). Este doc consolida as decisões do brainstorm e resolve ambiguidades que o PDF deixou em aberto. Onde este doc diverge do PDF, **este doc vence**.

---

## 1. Objetivo

Reconstruir o portfólio pessoal hospedado em `https://github.com/jrabeloneto/joao-portifolio` do zero, substituindo 100% do conteúdo atual por uma versão v2 com estética **Dark Dreamcore Cinematográfico**, animações GSAP + Lenis, Three.js no hero, e 8 projetos em destaque. Deploy final na Vercel.

## 2. Estratégia de entrega no repo existente

- Trabalho feito em pasta local `C:\Users\CNT\Downloads\joao-portifolio-v2\` (novo git init).
- Branch de entrega: `v2-dark-dreamcore`.
- Primeiro commit no branch nukea o conteúdo antigo (clone do remoto, `git rm -rf`, copia v2, commit).
- Push para `origin v2-dark-dreamcore`. O **usuário** faz o merge em `main` manualmente (sem `gh` CLI disponível nesta máquina).
- README novo com instruções de dev e deploy.

## 3. Identidade visual

Confirma integralmente a seção "ESTÉTICA E IDENTIDADE VISUAL" do PDF:
- Paleta (8 tokens CSS custom properties, âmbar `#FF6500` primary / azul glacial `#4FACFE` secondary)
- Tipografia: Bebas Neue (display), Playfair Display (serif), Inter (body), IBM Plex Mono (mono)
- Grain de filme via SVG noise animado (`body::after`)
- Nada de branco puro; creme `#F0EDE8` em tudo

## 4. Sistema de animações

Confirma integralmente a seção "SISTEMA DE ANIMAÇÕES" do PDF (itens 1–8). Todos obrigatórios.

## 5. Seções — decisões finalizadas

| # | Seção | Altura | Fundo | Decisão resolvida |
|---|-------|--------|-------|-------------------|
| 1 | Hero | 100vh | Dark (`#0A0D1A`) | Três.js: partículas flutuantes (esfera de pontos) — reaproveitar padrão do TRAXUS mas simplificar pra <3000 pontos |
| 2 | Sobre | min 100vh | Claro `#F5F2EC` emergindo com border-radius 32px | Texto final abaixo |
| 3 | Projetos | auto | Dark | 8 projetos (7 do PDF + `trend-crm-erp`). Grid assimétrico: TRAXUS ocupa 60%, restantes em grid 2-col 40% |
| 4 | Skills | 80vh | Dark emergindo | Categorias: Frontend, Backend, Database, Tools, 3D & Creative |
| 5 | Experiência | 80vh | Claro | Timeline SVG desenhando no scroll |
| 6 | Contato | 100vh | Dark | Formulário sem backend por ora — `mailto:` no submit (MVP) |

### 5.1 Texto da seção Sobre (final)

> Software Lead na AI.OTIK, de Manaus pro mundo. Lidero times e construo produtos onde engenharia dura encontra estética cinematográfica — do backend em Spring Boot ao frontend 3D em Three.js. Obcecado por problemas difíceis, interfaces que respiram, e por transformar o impossível em possível.

Stats contador: `3+ anos`, `15+ projetos`, `5 tecnologias`.

### 5.2 Projetos — lista final com URLs

| # | Nome | URL deploy | Destaque |
|---|------|-----------|----------|
| 1 | TRAXUS | https://traxus-steel.vercel.app/ | Principal (60%) |
| 2 | TaskFlow | https://taskflow-eight-blond.vercel.app/ | Alto |
| 3 | EventHub | https://eventhub-2t38ukdu0-jrabelonetos-projects.vercel.app/dashboard | Alto |
| 4 | TeamFlow | https://teamflow-navy.vercel.app/ | Alto |
| 5 | Trend CRM/ERP | https://trend-crm-erp.vercel.app/ | Alto (novo, não estava no PDF) |
| 6 | Bradesco Redesign | https://bradesco-app-redesign.vercel.app/ | Médio |
| 7 | TechStore v2 | https://techstore-v2-85tz.vercel.app/ | Médio |
| 8 | Redesign Craigslist | https://redesing-craiglist.vercel.app/ | Médio |

Screenshots: gerados via Playwright/puppeteer headless (1440x900, full viewport, aguardar 3s de load) salvos em `public/assets/projects/<slug>.jpg` com compressão ~85%.

## 6. Stack técnica (confirma PDF)

- **Build:** Vite 6 + React 19 + TypeScript
- **Animação:** GSAP 3.13 + ScrollTrigger, Lenis (smooth scroll), Framer Motion (interações leves)
- **3D:** Three.js + @react-three/fiber + @react-three/drei
- **Estilo:** CSS Modules + CSS Custom Properties (sem Tailwind — o PDF é explícito)
- **Ícones:** Lucide React + Devicons
- **Deploy:** Vercel (mesmo repo, auto-deploy no push)

## 7. Estrutura de pastas

Confirma integralmente a estrutura do PDF (`src/components/ui`, `src/components/sections`, `src/components/three`, `src/hooks`, `src/styles`, `src/data`).

## 8. Fora de escopo (YAGNI)

- Backend do formulário de contato (usa `mailto:`)
- CMS / WordPress headless
- i18n (site 100% PT-BR)
- Dark/light toggle (estética é fixa)
- Analytics além do default da Vercel
- Blog / seção de escritos

## 9. Checklist de qualidade

Confirma integralmente os 12 itens da página 10 do PDF. Verificação obrigatória antes do push final.

## 10. Mobile

- Abaixo de 768px: cursor custom desativa, parallax com fator reduzido (0.5x do desktop), Three.js hero vira imagem estática ou reduz pontos 5x.
- Headlines escalam com `clamp()`.

---

## Aprovações necessárias do usuário

1. **Texto "Sobre"** acima — ok?
2. **Trend CRM/ERP incluído como 5º projeto em destaque** — ok?
3. **Formulário contato via mailto (sem backend)** — ok?
4. **Merge final em `main` feito pelo usuário** (eu empurro branch `v2-dark-dreamcore`) — ok?
