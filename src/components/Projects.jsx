import { motion } from 'framer-motion';
import { ExternalLink, Github, Smartphone, Code, Palette } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import bradescoMockup from '../assets/bradesco-mockup.png';
import techstoreMockup from '../assets/techstore-v2-mockup.png';

export default function Projects() {
  const projects = [
    {
      id: 1,
      title: "TechStore V2 - E-commerce",
      description: "E-commerce responsivo desenvolvido em React com design mobile-first, sistema de carrinho funcional e interface moderna com gradientes. Projeto completamente reestruturado com foco em performance e usabilidade.",
      image: techstoreMockup,
      tags: ["React", "Vite", "Tailwind CSS", "Mobile-First", "Modern UI"],
      github: "https://github.com/jrabeloneto/techstore-v2",
      demo: "https://github.com/jrabeloneto/techstore-v2",
      type: "featured",
      features: [
        "Layout mobile-first responsivo",
        "Sistema de carrinho com contador dinâmico",
        "6 produtos de tecnologia premium",
        "Design moderno com gradientes",
        "Performance otimizada"
      ],
      icon: <Code className="w-6 h-6" />
    },
    {
      id: 2,
      title: "Bradesco App Redesign",
      description: "Redesign completo do aplicativo mobile Bradesco com foco em UX/UI moderno e desenvolvimento frontend responsivo. Projeto desenvolvido em React com Tailwind CSS.",
      image: bradescoMockup,
      tags: ["React", "Tailwind CSS", "UX/UI", "Mobile-First", "JavaScript"],
      github: "https://github.com/jrabeloneto/bradesco-app-redesign",
      demo: "#",
      type: "current",
      features: [
        "Interface moderna e intuitiva",
        "Design system completo",
        "Responsivo e mobile-first",
        "Autenticação simulada",
        "Navegação fluida"
      ],
      icon: <Smartphone className="w-6 h-6" />
    },
    {
      id: 3,
      title: "Portfolio Pessoal",
      description: "Site portfolio pessoal desenvolvido em React com animações suaves e design responsivo. Showcase completo de projetos e competências.",
      image: "/api/placeholder/600/400",
      tags: ["React", "Framer Motion", "Tailwind CSS", "Responsive"],
      github: "https://github.com/jrabeloneto/joao-repositorio",
      demo: "https://joao-repositorio.vercel.app",
      type: "current",
      icon: <Palette className="w-6 h-6" />
    }
  ];

  const getProjectStatus = (type) => {
    switch (type) {
      case 'featured':
        return { label: 'Projeto Principal', color: 'bg-green-500' };
      case 'current':
        return { label: 'Projeto Atual', color: 'bg-blue-500' };
      case 'upcoming':
        return { label: 'Em Desenvolvimento', color: 'bg-orange-500' };
      default:
        return { label: 'Projeto', color: 'bg-gray-500' };
    }
  };

  return (
    <section id="projects" className="section-padding bg-muted/30">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Meus Projetos
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-8"></div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Uma seleção dos meus trabalhos mais recentes, demonstrando competências em 
            desenvolvimento frontend, UX/UI design e soluções inovadoras.
          </p>
        </motion.div>

        <div className="space-y-12">
          {projects.map((project, index) => {
            const status = getProjectStatus(project.type);
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="overflow-hidden shadow-xl border-0 card-hover">
                  <div className={`grid lg:grid-cols-2 gap-0 ${!isEven ? 'lg:grid-flow-col-dense' : ''}`}>
                    {/* Image Section */}
                    <div className={`relative bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center p-8 ${!isEven ? 'lg:col-start-2' : ''}`}>
                      {project.image && typeof project.image === 'string' && project.image !== "/api/placeholder/600/400" ? (
                        <img 
                          src={project.image} 
                          alt={project.title}
                          className="max-w-full max-h-96 object-contain rounded-lg shadow-lg"
                        />
                      ) : (
                        <>
                          <div className="text-primary/20 transform scale-150">
                            {project.icon}
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
                        </>
                      )}
                      
                      {/* Status Badge */}
                      <div className="absolute top-4 left-4">
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium text-white ${status.color}`}>
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                          {status.label}
                        </span>
                      </div>
                    </div>

                    {/* Content Section */}
                    <CardContent className="p-8 lg:p-12 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="text-primary">
                          {project.icon}
                        </div>
                        <h3 className="text-2xl lg:text-3xl font-bold text-foreground">
                          {project.title}
                        </h3>
                      </div>

                      <p className="text-muted-foreground leading-relaxed mb-6 text-lg">
                        {project.description}
                      </p>

                      {/* Features (only for featured project) */}
                      {project.features && (
                        <div className="mb-6">
                          <h4 className="font-semibold text-foreground mb-3">Principais Features:</h4>
                          <ul className="space-y-2">
                            {project.features.map((feature, idx) => (
                              <li key={idx} className="flex items-center gap-2 text-muted-foreground">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Technologies */}
                      <div className="mb-8">
                        <div className="flex flex-wrap gap-2">
                          {project.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-4">
                        {project.type !== 'upcoming' && (
                          <>
                            <Button
                              asChild
                              className="flex items-center gap-2 bg-primary hover:bg-primary/90"
                            >
                              <a
                                href={project.github}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Github size={18} />
                                Ver Código
                              </a>
                            </Button>
                            
                            {project.demo !== '#' && (
                              <Button
                                asChild
                                variant="outline"
                                className="flex items-center gap-2"
                              >
                                <a
                                  href={project.demo}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <ExternalLink size={18} />
                                  Ver Demo
                                </a>
                              </Button>
                            )}
                          </>
                        )}
                        
                        {project.type === 'upcoming' && (
                          <Button disabled className="flex items-center gap-2">
                            <Code size={18} />
                            Em Desenvolvimento
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Card className="bg-primary text-primary-foreground p-8 lg:p-12">
            <CardContent className="p-0">
              <h3 className="text-2xl lg:text-3xl font-bold mb-4">
                Interessado no meu trabalho?
              </h3>
              <p className="text-primary-foreground/90 mb-8 text-lg max-w-2xl mx-auto">
                Estou sempre aberto a novos desafios e oportunidades. 
                Vamos conversar sobre como posso contribuir para seu próximo projeto!
              </p>
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="font-semibold"
              >
                <a href="#contact">
                  Entrar em Contato
                </a>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

