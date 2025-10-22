import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Hero from './components/Hero';
import AnimatedCard from './components/AnimatedCard';
import ThemeToggle from './components/ThemeToggle';
import { AuthDemo } from './pages/AuthDemo';
import { ProtectedRoute } from './modules/auth/components/ProtectedRoute';

// Protected Page Example
function ProtectedPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-12 rounded-2xl text-center"
        >
          <h1 className="text-4xl font-bold gradient-text mb-4">
            🔒 Protected Page
          </h1>
          <p className="text-muted-foreground mb-8">
            This page is only accessible to authenticated users!
          </p>
          <Link
            to="/demo/auth"
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all"
          >
            Back to Auth Demo
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

// Home Page Component
function HomePage() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ThemeToggle theme={theme} onToggle={toggleTheme} />

      {/* Auth Demo Link */}
      <div className="absolute top-6 right-20 z-10">
        <Link
          to="/demo/auth"
          className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-lg hover:bg-primary/20 transition-all flex items-center gap-2"
        >
          <span>🔐</span>
          <span>Auth Demo</span>
        </Link>
      </div>

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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/demo/auth" element={<AuthDemo />} />

        {/* Protected routes */}
        <Route
          path="/protected"
          element={
            <ProtectedRoute>
              <ProtectedPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
