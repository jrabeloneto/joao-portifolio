export type Skill = {
  name: string;
  category: 'frontend' | 'backend' | 'cloud' | '3d' | 'tool' | 'language';
  level: 'expert' | 'advanced' | 'fluent';
};

export const SKILLS: Skill[] = [
  // frontend
  { name: 'React 19', category: 'frontend', level: 'expert' },
  { name: 'TypeScript', category: 'language', level: 'expert' },
  { name: 'Next.js', category: 'frontend', level: 'advanced' },
  { name: 'Angular 17', category: 'frontend', level: 'advanced' },
  { name: 'Vite', category: 'tool', level: 'expert' },
  { name: 'CSS Modules', category: 'frontend', level: 'expert' },
  { name: 'Tailwind', category: 'frontend', level: 'advanced' },
  { name: 'Framer Motion', category: 'frontend', level: 'advanced' },
  { name: 'GSAP', category: 'frontend', level: 'expert' },
  { name: 'Lenis', category: 'frontend', level: 'fluent' },
  // 3D
  { name: 'Three.js', category: '3d', level: 'advanced' },
  { name: 'React Three Fiber', category: '3d', level: 'advanced' },
  { name: 'GLSL Shaders', category: '3d', level: 'fluent' },
  { name: 'Postprocessing', category: '3d', level: 'fluent' },
  // backend
  { name: 'Node.js', category: 'backend', level: 'expert' },
  { name: 'Express', category: 'backend', level: 'expert' },
  { name: 'NestJS', category: 'backend', level: 'advanced' },
  { name: 'Spring Boot 3', category: 'backend', level: 'advanced' },
  { name: 'Java 17', category: 'language', level: 'advanced' },
  { name: 'Python', category: 'language', level: 'fluent' },
  { name: 'REST APIs', category: 'backend', level: 'expert' },
  { name: 'WebSockets', category: 'backend', level: 'advanced' },
  { name: 'GraphQL', category: 'backend', level: 'fluent' },
  { name: 'JWT Auth', category: 'backend', level: 'expert' },
  // databases
  { name: 'PostgreSQL', category: 'backend', level: 'advanced' },
  { name: 'MySQL', category: 'backend', level: 'advanced' },
  { name: 'MongoDB', category: 'backend', level: 'advanced' },
  { name: 'Redis', category: 'backend', level: 'fluent' },
  // cloud / devops
  { name: 'Docker', category: 'cloud', level: 'advanced' },
  { name: 'Vercel', category: 'cloud', level: 'expert' },
  { name: 'AWS', category: 'cloud', level: 'fluent' },
  { name: 'CI/CD', category: 'cloud', level: 'advanced' },
  { name: 'Git', category: 'tool', level: 'expert' },
  { name: 'Linux', category: 'tool', level: 'advanced' },
  // tools
  { name: 'Figma', category: 'tool', level: 'advanced' },
  { name: 'Playwright', category: 'tool', level: 'advanced' },
  { name: 'Jest / Vitest', category: 'tool', level: 'advanced' },
  { name: 'Storybook', category: 'tool', level: 'fluent' },
];

export const CATEGORY_COLOR: Record<Skill['category'], string> = {
  frontend: '#c4dff5',
  backend: '#bfb5d9',
  cloud: '#ffe5a8',
  '3d': '#e8bcc8',
  tool: '#a8d8c0',
  language: '#ffd08a',
};
