import { motion } from 'framer-motion';
import { ArrowDown, Github, Linkedin, Mail } from 'lucide-react';
import { Button } from './ui/button';
import joaoPhoto from '../assets/joao-photo.jpg';

export default function Hero() {
  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="min-h-screen hero-gradient flex items-center justify-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-transparent"></div>
      </div>
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20">
          
          {/* Profile Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-shrink-0"
          >
            <div className="relative">
              <img
                src={joaoPhoto}
                alt="João Rabelo"
                className="w-80 h-80 lg:w-96 lg:h-96 rounded-full object-cover profile-image"
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500/20 to-transparent"></div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center lg:text-left max-w-2xl"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-4xl lg:text-6xl font-bold text-white mb-4"
            >
              Olá, eu sou{' '}
              <span className="block text-blue-200">João Rabelo</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="text-xl lg:text-2xl text-blue-100 mb-6"
            >
              Desenvolvedor Frontend Junior
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="text-lg text-blue-200 mb-8 leading-relaxed"
            >
              Estudante de Engenharia de Software no 3º período, especializado em{' '}
              <span className="font-semibold text-white">React, JavaScript e UX/UI Design</span>.
              Ex-Mestre Conselheiro Estadual da Ordem DeMolay, com experiência em liderança 
              e comunicação para grandes audiências.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
              className="text-lg text-blue-200 mb-10"
            >
              Criando experiências digitais excepcionais com foco no usuário
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.3 }}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <Button
                onClick={scrollToProjects}
                size="lg"
                className="bg-white text-blue-900 hover:bg-blue-50 font-semibold px-8 py-3 rounded-full transition-all duration-300 hover:scale-105"
              >
                Ver Projetos
              </Button>
              <Button
                onClick={scrollToContact}
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-blue-900 font-semibold px-8 py-3 rounded-full transition-all duration-300"
              >
                Entrar em Contato
              </Button>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.5 }}
              className="flex justify-center lg:justify-start gap-6"
            >
              <a
                href="https://github.com/jrabeloneto"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-blue-200 transition-colors duration-300 hover:scale-110 transform"
              >
                <Github size={28} />
              </a>
              <a
                href="https://www.linkedin.com/in/jo%C3%A3o-rabelo-44a184330"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-blue-200 transition-colors duration-300 hover:scale-110 transform"
              >
                <Linkedin size={28} />
              </a>
              <a
                href="mailto:jrabeloneto2@gmail.com"
                className="text-white hover:text-blue-200 transition-colors duration-300 hover:scale-110 transform"
              >
                <Mail size={28} />
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-white cursor-pointer"
            onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <ArrowDown size={32} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

