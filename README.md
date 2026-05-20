# João Rabelo — Portfolio

Portfolio pessoal cinematográfico de **João Rabelo Neto** — Co-founder & Gerente de Desenvolvimento na AIKO, Software Lead Fullstack com foco em arquitetura web, experiências WebGL/3D e motion design.

[![Live](https://img.shields.io/badge/Live-joao--portifolio.vercel.app-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://joao-portifolio-rho.vercel.app)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/jrabeloneto/)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/jrabeloneto)

---

## Sobre

Aplicação React moderna, scroll-driven, construída como vitrine de UI engineering, motion design e arquitetura full-stack. Cada seção foi pensada como uma cena: hero, about, selected works, philosophy, contact e footer.

### Destaques

- **Scroll Stack 3D** customizado para os projetos selecionados, com perspectiva dinâmica
- **Smooth scroll** via Lenis com física dedicada para touch e desktop
- **Splash cursor** WebGL e vector bridge interativo
- **Marquee cinético** e textos em arco animados por scroll
- **Parallax footer** com reveal por scroll-progress
- **Layout 100% responsivo** com tipografia massiva mobile-first
- **Download de CV** direto pelo menu de navegação

---

## Stack

| Camada       | Tecnologias |
| :----------- | :---------- |
| Frontend     | React 18, TypeScript, Vite |
| Estilos      | Tailwind CSS, shadcn/ui, Radix UI |
| Animação     | Framer Motion, GSAP, Lenis |
| 3D / Visual  | WebGL (SplashCursor, VectorBridge) |
| Formulários  | React Hook Form + Zod |
| Ícones       | Lucide React |
| Deploy       | Vercel |

---

## Rodando localmente

```bash
git clone https://github.com/jrabeloneto/joao-portifolio.git
cd joao-portifolio
npm install
npm run dev
```

A aplicação sobe em `http://localhost:5176` por padrão (configurável em `vite.config.ts`).

### Scripts úteis

| Comando             | O que faz |
| :------------------ | :-------- |
| `npm run dev`       | Servidor de desenvolvimento (Vite) |
| `npm run build`     | Build de produção |
| `npm run preview`   | Preview do build |
| `npm run lint`      | Linter |
| `npm run test`      | Testes (Vitest) |

---

## Estrutura

```
src/
├── components/      # Navigation, StarBorder, SplashCursor, ui/
├── pages/           # Index, About, SelectedWorks, Contact, Footer, ...
├── hooks/           # Hooks customizados
└── lib/             # Helpers e utilitários
public/
├── p1–p4.png        # Previews dos projetos
├── favicon.svg      # Favicon "J"
└── CV_Joao_Rabelo_2026.pdf
```

---

## Contato

- **E-mail**: [jrabeloneto2@gmail.com](mailto:jrabeloneto2@gmail.com)
- **LinkedIn**: [linkedin.com/in/jrabeloneto](https://www.linkedin.com/in/jrabeloneto/)
- **GitHub**: [github.com/jrabeloneto](https://github.com/jrabeloneto)
- **Local**: Manaus, AM — Brasil

---

<p align="center">
  © 2026 João Rabelo Neto · Built with React + Vite · Deployed on Vercel
</p>
