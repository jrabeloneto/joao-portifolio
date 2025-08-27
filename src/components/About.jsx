import { motion } from 'framer-motion';
import { Code, Users, Award, Target } from 'lucide-react';
import { Card, CardContent } from './ui/card';

export default function About() {
  const highlights = [
    {
      icon: <Code className="w-8 h-8" />,
      title: "Desenvolvimento Frontend",
      description: "Especializado em React, JavaScript, Tailwind CSS e metodologias ágeis como Scrum"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Liderança & Comunicação",
      description: "Ex-Mestre Conselheiro Estadual da Ordem DeMolay, com experiência falando para mais de 1000 pessoas"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "UX/UI Design",
      description: "Foco em criar interfaces modernas, intuitivas e centradas no usuário"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Objetivos Globais",
      description: "Ambição de trabalhar em projetos de impacto nacional e internacional"
    }
  ];

  return (
    <section id="about" className="section-padding bg-background">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Sobre Mim
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-8"></div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Sou um desenvolvedor apaixonado por criar soluções digitais que fazem a diferença. 
            Atualmente cursando Engenharia de Software, combino conhecimento técnico com 
            experiência em liderança e comunicação.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {highlights.map((highlight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="card-hover border-0 shadow-lg h-full">
                <CardContent className="p-6 text-center">
                  <div className="text-primary mb-4 flex justify-center">
                    {highlight.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {highlight.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {highlight.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="bg-card rounded-2xl p-8 lg:p-12 shadow-lg"
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-foreground mb-6">
                Minha Jornada
              </h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-xl font-semibold text-primary mb-2">
                    Formação Acadêmica
                  </h4>
                  <p className="text-muted-foreground">
                    Cursando Engenharia de Software (3º período), com foco em desenvolvimento 
                    web moderno e metodologias ágeis.
                  </p>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-primary mb-2">
                    Experiência em Liderança
                  </h4>
                  <p className="text-muted-foreground">
                    Como Mestre Conselheiro Estadual da Ordem DeMolay, desenvolvi habilidades 
                    de liderança, comunicação e gestão de equipes, falando para audiências de 
                    mais de 1000 pessoas.
                  </p>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-primary mb-2">
                    Desenvolvimento Técnico
                  </h4>
                  <p className="text-muted-foreground">
                    Especialização em desenvolvimento web com React, JavaScript, UX/UI Design 
                    e metodologias ágeis como Scrum, sempre buscando as melhores práticas 
                    da indústria.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-8">
              <div>
                <h4 className="text-xl font-semibold text-foreground mb-4">
                  Competências Principais
                </h4>
                <div className="flex flex-wrap gap-3">
                  {[
                    'JavaScript', 'React', 'Tailwind CSS', 'HTML5', 'CSS3',
                    'UX/UI Design', 'Scrum', 'Git', 'Responsive Design', 'Figma'
                  ].map((skill, index) => (
                    <span key={index} className="skill-badge">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-xl font-semibold text-foreground mb-4">
                  Objetivos Profissionais
                </h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Trabalhar em projetos de impacto nacional e internacional
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Especializar-me em desenvolvimento frontend avançado
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Contribuir para soluções que melhorem a vida das pessoas
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

