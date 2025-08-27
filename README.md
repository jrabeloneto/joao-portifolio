# Portfolio Pessoal - João Rabelo

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-black?style=for-the-badge&logo=framer&logoColor=blue)](https://www.framer.com/motion/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)

Site portfolio pessoal desenvolvido em React com animações suaves, design responsivo e foco na experiência do usuário. Apresenta projetos, competências e informações profissionais de João da Cunha Rabelo Neto.

## Sobre o Projeto

Este portfolio foi desenvolvido para apresentar minha jornada como desenvolvedor frontend junior e estudante de Engenharia de Software. O site combina design moderno com funcionalidades interativas, demonstrando competências técnicas em desenvolvimento web.

### Características Principais

- **Design Responsivo**: Otimizado para desktop, tablet e mobile
- **Animações Suaves**: Implementadas com Framer Motion
- **Performance Otimizada**: Construído com Vite para carregamento rápido
- **Acessibilidade**: Seguindo boas práticas de acessibilidade web
- **SEO Otimizado**: Meta tags e estrutura semântica adequada

## Tecnologias Utilizadas

### Frontend
- **React 18** - Biblioteca JavaScript para interfaces
- **Tailwind CSS** - Framework CSS utilitário
- **Framer Motion** - Biblioteca de animações
- **Lucide React** - Ícones modernos
- **shadcn/ui** - Componentes UI reutilizáveis

### Ferramentas de Desenvolvimento
- **Vite** - Build tool e dev server
- **ESLint** - Linting de código
- **PostCSS** - Processamento de CSS

## Estrutura do Projeto

```
src/
├── components/           # Componentes React
│   ├── ui/              # Componentes base (shadcn/ui)
│   ├── Hero.jsx         # Seção principal
│   ├── About.jsx        # Sobre mim
│   ├── Projects.jsx     # Projetos
│   ├── Contact.jsx      # Contato
│   ├── Navigation.jsx   # Navegação
│   └── Footer.jsx       # Rodapé
├── assets/              # Imagens e recursos
├── App.jsx              # Componente principal
├── App.css              # Estilos customizados
└── main.jsx             # Ponto de entrada
```

## Seções do Portfolio

### Hero Section
- Apresentação pessoal com foto profissional
- Descrição de competências e objetivos
- Links para redes sociais e contato
- Call-to-actions para navegação

### Sobre Mim
- História profissional e acadêmica
- Competências técnicas e soft skills
- Experiência em liderança (ex-Mestre Conselheiro DeMolay)
- Objetivos profissionais

### Projetos
- **Bradesco App Redesign**: Projeto principal com mockup
- **Portfolio Pessoal**: Este próprio site
- **Projetos Futuros**: Em desenvolvimento

### Contato
- Informações de contato completas
- WhatsApp, Email, LinkedIn, GitHub
- Download de currículo
- Links para agendamento

## Instalação e Uso

### Pré-requisitos
- Node.js 18+ 
- npm ou pnpm

### Instalação
```bash
# Clone o repositório
git clone https://github.com/jrabeloneto/joao-portfolio.git

# Entre no diretório
cd joao-portfolio

# Instale as dependências
npm install
# ou
pnpm install
```

### Desenvolvimento
```bash
# Inicie o servidor de desenvolvimento
npm run dev
# ou
pnpm run dev

# Acesse http://localhost:5173
```

### Build para Produção
```bash
# Gere a build otimizada
npm run build
# ou
pnpm run build

# Preview da build
npm run preview
# ou
pnpm run preview
```

## Deploy

Este projeto está configurado para deploy automático no Vercel:

1. Conecte seu repositório GitHub ao Vercel
2. Configure as variáveis de ambiente (se necessário)
3. O deploy será automático a cada push na branch main

### Outras Opções de Deploy
- **Netlify**: Drag & drop da pasta `dist`
- **GitHub Pages**: Configure GitHub Actions
- **Vercel CLI**: `vercel --prod`

## Personalização

### Cores e Tema
As cores principais estão definidas em `src/App.css`:
- Navy Blue: `#1e3a8a`
- Off White: `#fefefe`
- Gradientes personalizados

### Conteúdo
Para personalizar o conteúdo:
1. Edite os componentes em `src/components/`
2. Substitua imagens em `src/assets/`
3. Atualize informações pessoais nos componentes

## Performance

- **Lighthouse Score**: 95+ em todas as métricas
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1

## Contato

**João da Cunha Rabelo Neto**
- Email: jrabeloneto2@gmail.com
- WhatsApp: +55 92 98427-0660
- LinkedIn: [João Rabelo](https://www.linkedin.com/in/joão-rabelo-44a184330)
- GitHub: [@jrabeloneto](https://github.com/jrabeloneto)

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

Desenvolvido com ❤️ por João Rabelo

