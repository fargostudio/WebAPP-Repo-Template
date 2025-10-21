import { useState } from 'react';
import { motion } from 'framer-motion';
import Hero from './components/Hero';
import AnimatedCard from './components/AnimatedCard';
import ThemeToggle from './components/ThemeToggle';

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ThemeToggle theme={theme} onToggle={toggleTheme} />

      <Hero />

      <section className="container mx-auto px-4 py-20">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-center mb-16 gradient-text"
        >
          Componenti con Design Straordinario
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatedCard
            title="Design Moderno"
            description="Interfacce pulite e moderne con attenzione ai dettagli"
            icon="✨"
            delay={0}
          />
          <AnimatedCard
            title="Animazioni Fluide"
            description="Transizioni naturali con Framer Motion e GSAP"
            icon="🎬"
            delay={0.1}
          />
          <AnimatedCard
            title="3D & WebGL"
            description="Effetti tridimensionali con React Three Fiber"
            icon="🌊"
            delay={0.2}
          />
          <AnimatedCard
            title="Responsive Design"
            description="Perfetto su ogni dispositivo e risoluzione"
            icon="📱"
            delay={0.3}
          />
          <AnimatedCard
            title="Dark Mode"
            description="Tema scuro elegante con transizioni smooth"
            icon="🌙"
            delay={0.4}
          />
          <AnimatedCard
            title="Performance"
            description="Ottimizzato per velocità e user experience"
            icon="⚡"
            delay={0.5}
          />
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass p-12 rounded-2xl text-center"
          >
            <h3 className="text-3xl font-bold mb-4">
              Pronto per iniziare?
            </h3>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Questo template include tutto ciò che serve per creare web app moderne
              con un design eccezionale e un'esperienza utente di alto livello.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold shadow-lg hover:shadow-xl transition-shadow"
            >
              Inizia Ora
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default App;
