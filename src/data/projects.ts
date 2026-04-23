export type Project = {
  slug: string;
  name: string;
  description: string;
  stack: string[];
  tag: string;
  deployUrl: string;
  githubUrl: string;
  featured: boolean;
  image: string;
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
    description: 'Plataforma de gerenciamento de eventos com dashboard analítico e visualizações.',
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
    description: 'CRM e ERP integrados com gestão de clientes, vendas e operações em tempo real.',
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
    description: 'Redesign completo do app mobile do Bradesco com foco em UX moderna e hierarquia visual.',
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
    description: 'E-commerce mobile-first com carrinho funcional, filtros e checkout fluido.',
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
    description: 'UX moderna para Craigslist Brasil — releitura completa com identidade visual nova.',
    stack: ['React', 'Vite', 'Tailwind'],
    tag: 'Redesign',
    deployUrl: 'https://redesing-craiglist.vercel.app/',
    githubUrl: 'https://github.com/jrabeloneto/redesing-craiglist',
    featured: false,
    image: '/assets/projects/redesign-craigslist.jpg',
  },
];
