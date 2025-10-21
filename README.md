# 🚀 Web App Template

> Template moderno per web application con design straordinario e tecnologie bleeding-edge

Un template completo e production-ready per sviluppare web application moderne con un focus particolare su **design eccezionale**, **animazioni fluide** e **user experience memorabile**.

## 📚 Documentazione

- **[⚡ QUICKSTART.md](./QUICKSTART.md)** - Inizia subito! Setup rapido e primi esempi
- **[📋 TEMPLATE_USAGE.md](./TEMPLATE_USAGE.md)** - Come usare questo repo come template per nuovi progetti
- **[🔄 WORKFLOW.md](./WORKFLOW.md)** - Git workflow e branching strategy dettagliati
- **[🤝 CONTRIBUTING.md](./CONTRIBUTING.md)** - Guidelines per contribuire
- **[🤖 .claude/template-guide.md](./.claude/template-guide.md)** - Guida completa per Claude AI

> 💡 **Nuovo progetto?** Inizia da [TEMPLATE_USAGE.md](./TEMPLATE_USAGE.md) per clonare questo template!

## ✨ Features

### 🎨 Design & UX
- **Design System Completo** con Tailwind CSS e design tokens personalizzabili
- **Animazioni Fluide** con Framer Motion e GSAP
- **Effetti 3D/WebGL** con React Three Fiber
- **Dark Mode** con transizioni smooth
- **Glassmorphism** e gradient animati
- **Micro-interazioni** su tutti i componenti
- **Responsive Design** ottimizzato per ogni dispositivo

### 🛠️ Stack Tecnologico

#### Frontend
- ⚡ **Vite** - Build ultra veloce con HMR istantaneo
- ⚛️ **React 18** - UI library moderna
- 📘 **TypeScript** - Type safety
- 🎨 **Tailwind CSS** - Utility-first CSS framework
- ✨ **Framer Motion** - Animazioni dichiarative
- 🎬 **GSAP** - Timeline-based animations
- 🌊 **React Three Fiber** - React renderer per Three.js
- 🎭 **Radix UI** - Componenti accessibili headless
- 📚 **Storybook** - Component library e design system

#### Backend
- 🚀 **Node.js + Express** - Server HTTP veloce
- 📘 **TypeScript** - Type safety end-to-end
- 🔒 **Zod** - Schema validation
- 🗃️ **Prisma** - ORM type-safe (opzionale)
- 📊 **Winston** - Logging avanzato
- 🛡️ **Helmet** - Security headers

#### DevOps & Tools
- 🐳 **Docker** - Containerizzazione
- 🔄 **GitHub Actions** - CI/CD automatico
- 🪝 **Husky** - Git hooks
- 💅 **Prettier + ESLint** - Code formatting e linting
- 📦 **NPM Workspaces** - Monorepo management

## 🚀 Quick Start

### Prerequisiti

- Node.js >= 20.0.0
- npm >= 10.0.0
- Docker (opzionale)

### Installazione

```bash
# Clona il repository
git clone <your-repo-url>
cd webapp-template

# Installa le dipendenze
npm install

# Setup Husky hooks
npm run prepare

# Copia i file di environment
cp apps/backend/.env.example apps/backend/.env
```

### Sviluppo

```bash
# Avvia frontend e backend contemporaneamente
npm run dev

# Oppure avvia separatamente:
npm run dev:frontend  # http://localhost:3000
npm run dev:backend   # http://localhost:5000

# Avvia Storybook (component library)
npm run storybook     # http://localhost:6006
```

### Build

```bash
# Build di tutto
npm run build

# Build separati
npm run build:frontend
npm run build:backend
```

### Docker

```bash
# Avvia con Docker Compose
docker-compose up

# Build e avvia in background
docker-compose up -d --build

# Stop
docker-compose down
```

## 📁 Struttura del Progetto

```
webapp-template/
├── apps/
│   ├── frontend/              # React + Vite application
│   │   ├── src/
│   │   │   ├── components/    # Componenti React
│   │   │   ├── pages/         # Pagine/Routes
│   │   │   ├── hooks/         # Custom hooks
│   │   │   ├── lib/           # Utilities
│   │   │   ├── styles/        # CSS globali
│   │   │   └── assets/        # Immagini, fonts, etc.
│   │   ├── .storybook/        # Configurazione Storybook
│   │   └── Dockerfile
│   │
│   └── backend/               # Node.js + Express API
│       ├── src/
│       │   ├── routes/        # Route definitions
│       │   ├── controllers/   # Business logic
│       │   ├── middleware/    # Express middleware
│       │   ├── services/      # Service layer
│       │   └── utils/         # Utilities
│       └── Dockerfile
│
├── packages/                  # Shared packages (opzionale)
│   └── shared/               # Codice condiviso
│
├── .github/
│   └── workflows/            # GitHub Actions
│
├── .husky/                   # Git hooks
├── docker-compose.yml
└── package.json
```

## 🎨 Design System

Il template include un design system completo basato su Tailwind CSS con:

### Design Tokens

Tutte le variabili di design sono definite in CSS variables per facile customizzazione:

```css
:root {
  --primary: 221.2 83.2% 53.3%;
  --secondary: 210 40% 96.1%;
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  /* ... */
}
```

### Componenti UI

Componenti pre-costruiti con varianti multiple:

- **Button** - 6 varianti (default, gradient, outline, ghost, link, destructive)
- **Card** - Con animazioni hover e gradient glow
- **ThemeToggle** - Dark mode toggle animato
- E molto altro...

Tutti i componenti sono disponibili in Storybook per sviluppo isolato.

### Utility Classes

Classi custom per effetti comuni:

```css
.gradient-text      /* Testo con gradient animato */
.glass              /* Effetto glassmorphism */
.animated-gradient  /* Background gradient animato */
```

## 🔄 Git Workflow

### Branching Strategy

Utilizziamo **GitHub Flow** semplificato:

```
main (production)
  ├── feature/nome-feature
  ├── fix/nome-bug
  └── docs/aggiornamenti
```

### Branch Naming Convention

- `feature/descrizione` - Nuove funzionalità
- `fix/descrizione` - Bug fix
- `docs/descrizione` - Documentazione
- `refactor/descrizione` - Refactoring
- `test/descrizione` - Test

### Commit Message Convention

Utilizziamo **Conventional Commits** con validazione automatica:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types disponibili:**
- `feat` - Nuova funzionalità
- `fix` - Bug fix
- `docs` - Documentazione
- `style` - Formattazione
- `refactor` - Refactoring
- `test` - Test
- `chore` - Maintenance
- `perf` - Performance
- `ci` - CI/CD
- `build` - Build system

**Esempi:**
```bash
feat: aggiunge componente Hero con animazioni
fix(auth): corregge validazione email
docs: aggiorna README con esempi Docker
style(button): migliora spacing e colori
refactor(api): semplifica gestione errori
```

### Pre-commit Hooks

Husky esegue automaticamente prima di ogni commit:

1. **Lint-staged** - Linting e formatting dei file staged
2. **Commit message validation** - Verifica formato Conventional Commits

## 🚢 Deployment

### GitHub Actions CI/CD

Il template include 3 workflows:

1. **CI** (`.github/workflows/ci.yml`)
   - Lint e test
   - Build frontend e backend
   - Upload artifacts

2. **Deploy** (`.github/workflows/deploy.yml`)
   - Deploy automatico su push a `main`
   - Configurabile per Vercel, Netlify, AWS, etc.

3. **Storybook** (`.github/workflows/storybook.yml`)
   - Build e deploy Storybook
   - Configurabile per GitHub Pages

### Opzioni di Deployment

#### Vercel (Frontend)
```bash
# Installa Vercel CLI
npm i -g vercel

# Deploy
cd apps/frontend
vercel --prod
```

#### Railway/Render (Backend)
```bash
# Configura Dockerfile e push
git push railway main
```

#### Docker (Self-hosted)
```bash
# Build e push immagini
docker build -t your-registry/frontend -f apps/frontend/Dockerfile .
docker build -t your-registry/backend -f apps/backend/Dockerfile .
docker push your-registry/frontend
docker push your-registry/backend
```

## 🎯 Best Practices

### Sviluppo Componenti

1. **Atomic Design** - Organizza componenti da atoms a pages
2. **Storybook First** - Sviluppa componenti in isolamento
3. **Type Safety** - Usa TypeScript ovunque
4. **Accessibility** - Usa Radix UI per componenti accessibili

### Performance

1. **Code Splitting** - Route-based con React.lazy
2. **Image Optimization** - Usa formati moderni (WebP, AVIF)
3. **Lazy Loading** - Componenti e immagini
4. **Memoization** - React.memo, useMemo, useCallback

### Design

1. **Mobile First** - Design da mobile a desktop
2. **Design Tokens** - Usa CSS variables per consistenza
3. **Animazioni** - Max 300ms per micro-interazioni
4. **Contrast** - Minimo WCAG AA (4.5:1)

## 📚 Scripts Disponibili

### Root
```bash
npm run dev              # Avvia tutto in dev mode
npm run build            # Build di tutto
npm run lint             # Lint di tutto
npm run format           # Format con Prettier
npm run test             # Test di tutto
```

### Frontend
```bash
npm run dev:frontend           # Dev server (port 3000)
npm run build:frontend         # Production build
npm run storybook             # Storybook dev (port 6006)
npm run build-storybook       # Build Storybook
```

### Backend
```bash
npm run dev:backend      # Dev server con watch (port 5000)
npm run build:backend    # TypeScript build
npm run start            # Start production server
```

## 🎓 Risorse

### Documentazione Tecnologie

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)
- [Storybook](https://storybook.js.org/)

### Design Inspiration

- [Awwwards](https://www.awwwards.com/)
- [Dribbble](https://dribbble.com/)
- [Behance](https://www.behance.net/)

## 🤝 Contributing

Leggi [CONTRIBUTING.md](./CONTRIBUTING.md) per dettagli sul processo di contribuzione.

## 📄 License

Questo progetto è sotto licenza MIT - vedi [LICENSE](./LICENSE) per dettagli.

## 🙏 Credits

Creato con ❤️ per designer che vogliono il massimo dal codice e sviluppatori che vogliono il massimo dal design.

---

**Buon coding! 🚀**
