import { motion } from 'framer-motion';
import { Mail, Linkedin, Github, MapPin, Phone, Send } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';

export default function Contact() {
  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      label: "Email",
      value: "jrabeloneto2@gmail.com",
      href: "mailto:jrabeloneto2@gmail.com",
      description: "Melhor forma de me contatar"
    },
    {
      icon: <Phone className="w-6 h-6" />,
      label: "WhatsApp",
      value: "+55 92 98427-0660",
      href: "https://wa.me/5592984270660",
      description: "Conversa rápida e direta"
    },
    {
      icon: <Linkedin className="w-6 h-6" />,
      label: "LinkedIn",
      value: "João Rabelo",
      href: "https://www.linkedin.com/in/jo%C3%A3o-rabelo-44a184330",
      description: "Vamos nos conectar profissionalmente"
    },
    {
      icon: <Github className="w-6 h-6" />,
      label: "GitHub",
      value: "@jrabeloneto",
      href: "https://github.com/jrabeloneto",
      description: "Confira meus projetos e código"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      label: "Localização",
      value: "Manaus, AM - Brasil",
      href: "#",
      description: "Disponível para trabalho remoto"
    }
  ];

  const quickLinks = [
    {
      title: "Currículo",
      description: "Download do meu CV atualizado",
      action: "Download CV",
      href: "/curriculo-joao-rabelo.pdf"
    },
    {
      title: "Calendário",
      description: "Agende uma conversa comigo",
      action: "Agendar",
      href: "https://wa.me/5592984270660?text=Olá João! Gostaria de agendar uma conversa sobre oportunidades."
    },
    {
      title: "WhatsApp",
      description: "Conversa rápida e direta",
      action: "Chamar",
      href: "https://wa.me/5592984270660"
    }
  ];

  return (
    <section id="contact" className="section-padding bg-background">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Vamos Conversar?
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-8"></div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Estou sempre aberto a novas oportunidades, projetos interessantes e conversas 
            sobre tecnologia. Entre em contato e vamos criar algo incrível juntos!
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-foreground mb-8">
              Informações de Contato
            </h3>
            <div className="space-y-6">
              {contactInfo.map((contact, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="card-hover border-0 shadow-md">
                    <CardContent className="p-6">
                      <a
                        href={contact.href}
                        target={contact.href.startsWith('http') ? '_blank' : undefined}
                        rel={contact.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="flex items-start gap-4 group"
                      >
                        <div className="text-primary group-hover:scale-110 transition-transform duration-300">
                          {contact.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                            {contact.label}
                          </h4>
                          <p className="text-primary font-medium mb-1">
                            {contact.value}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {contact.description}
                          </p>
                        </div>
                      </a>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-foreground mb-8">
              Ações Rápidas
            </h3>
            <div className="space-y-6">
              {quickLinks.map((link, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
                  viewport={{ once: true }}
                >
                  <Card className="card-hover border-0 shadow-md">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-foreground mb-1">
                            {link.title}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {link.description}
                          </p>
                        </div>
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="ml-4"
                        >
                          <a href={link.href}>
                            {link.action}
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Call to Action Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              viewport={{ once: true }}
              className="mt-8"
            >
              <Card className="bg-primary text-primary-foreground">
                <CardContent className="p-8 text-center">
                  <Send className="w-12 h-12 mx-auto mb-4 opacity-90" />
                  <h4 className="text-xl font-bold mb-3">
                    Pronto para começar?
                  </h4>
                  <p className="text-primary-foreground/90 mb-6">
                    Tenho disponibilidade imediata para novos projetos e oportunidades. 
                    Vamos conversar sobre como posso ajudar!
                  </p>
                  <Button
                    asChild
                    variant="secondary"
                    size="lg"
                    className="font-semibold"
                  >
                    <a href="mailto:jrabeloneto2@gmail.com">
                      <Mail className="w-5 h-5 mr-2" />
                      Enviar Email
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Card className="bg-muted/50 border-0">
            <CardContent className="p-8 lg:p-12">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Vamos criar algo incrível juntos!
              </h3>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Seja para discutir uma oportunidade de trabalho, colaborar em um projeto 
                ou apenas trocar ideias sobre tecnologia, estou sempre disponível para 
                uma boa conversa.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="font-semibold"
                >
                  <a href="mailto:jrabeloneto2@gmail.com">
                    <Mail className="w-5 h-5 mr-2" />
                    Enviar Email
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="font-semibold"
                >
                  <a
                    href="https://www.linkedin.com/in/jo%C3%A3o-rabelo-44a184330"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Linkedin className="w-5 h-5 mr-2" />
                    Conectar no LinkedIn
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

