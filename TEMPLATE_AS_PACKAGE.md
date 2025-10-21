# 📦 Using Template as Package (Advanced)

Guida per usare questo template come package riutilizzabile invece di clonarlo per ogni progetto.

> ⚠️ **Questa è una modalità avanzata.** Se non sei sicuro, usa l'approccio standard (clone completo) descritto in [TEMPLATE_USAGE.md](./TEMPLATE_USAGE.md).

## 📋 Indice

- [Quando Usare Questo Approccio](#quando-usare-questo-approccio)
- [Setup Template](#setup-template)
- [Opzione 1: NPM Private Registry](#opzione-1-npm-private-registry)
- [Opzione 2: Git Submodules](#opzione-2-git-submodules)
- [Opzione 3: Monorepo](#opzione-3-monorepo)
- [Creare Nuova App](#creare-nuova-app)
- [Update Template](#update-template)
- [Best Practices](#best-practices)

---

## Quando Usare Questo Approccio

✅ **USA QUESTO SE:**
- Sviluppi **5+ app molto simili**
- Hai un **design system condiviso** critico
- Vuoi **aggiornamenti centralizzati**
- Hai **team dedicato** al template/design system
- **SaaS multi-tenant** con varianti configurabili

❌ **NON USARE SE:**
- È il tuo primo progetto con questo template
- App sono molto diverse tra loro
- Lavori per clienti che vogliono ownership completo
- Preferisci semplicità a riutilizzo

> 💡 **Consiglio**: Inizia con clone completo per i primi 2-3 progetti. Se vedi troppa duplicazione, passa a questo approccio.

---

## Setup Template

### 1. Prepara Template per Export

Crea file export nel template:

```typescript
// apps/frontend/src/components/index.ts
export { default as Button } from './Button';
export { default as AnimatedCard } from './AnimatedCard';
export { default as Hero } from './Hero';
export { default as ThemeToggle } from './ThemeToggle';
```

```typescript
// apps/frontend/src/lib/index.ts
export * from './utils';
```

```typescript
// apps/frontend/src/index.ts
export * from './components';
export * from './lib';
export * from './hooks';
```

### 2. Configura package.json per Export

```json
{
  "name": "@yourorg/webapp-template",
  "version": "1.0.0",
  "description": "Reusable web app template",
  "private": false,
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": "./dist/index.js",
    "./components": "./dist/components/index.js",
    "./lib": "./dist/lib/index.js",
    "./styles": "./dist/styles/globals.css",
    "./package.json": "./package.json"
  },
  "files": [
    "dist",
    "README.md",
    "LICENSE"
  ],
  "scripts": {
    "build:package": "tsc && vite build --mode library",
    "prepublishOnly": "npm run build:package"
  },
  "peerDependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "framer-motion": "^11.0.0",
    "tailwindcss": "^3.4.0"
  }
}
```

### 3. Build Config per Library

```typescript
// apps/frontend/vite.config.lib.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { glob } from 'glob';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: {
        index: path.resolve(__dirname, 'src/index.ts'),
        components: path.resolve(__dirname, 'src/components/index.ts'),
        lib: path.resolve(__dirname, 'src/lib/index.ts'),
      },
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'framer-motion'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
});
```

---

## Opzione 1: NPM Private Registry

### Setup Private Registry

#### Usando GitHub Packages

```bash
# 1. Crea .npmrc nel template
echo "@yourorg:registry=https://npm.pkg.github.com" > .npmrc

# 2. Login a GitHub packages
npm login --registry=https://npm.pkg.github.com

# 3. Aggiorna package.json
# "name": "@yourorg/webapp-template"
# "repository": "https://github.com/yourorg/webapp-template"

# 4. Build e publish
npm run build:package
npm publish
```

#### Usando Verdaccio (Private Registry Self-Hosted)

```bash
# 1. Install Verdaccio
npm install -g verdaccio

# 2. Start registry
verdaccio

# 3. Set registry
npm set registry http://localhost:4873

# 4. Create user
npm adduser --registry http://localhost:4873

# 5. Publish
npm publish --registry http://localhost:4873
```

### Usare Template in Nuova App

```bash
# 1. Configure registry
echo "@yourorg:registry=https://npm.pkg.github.com" > .npmrc

# 2. Authenticate
npm login --registry=https://npm.pkg.github.com

# 3. Create new project
mkdir my-new-app && cd my-new-app
npm init -y

# 4. Install template
npm install @yourorg/webapp-template

# 5. Install peer dependencies
npm install react react-dom framer-motion tailwindcss
```

### Structure App

```
my-new-app/
├── src/
│   ├── App.tsx              # Your custom app
│   ├── pages/               # Your pages
│   ├── components/          # Your custom components
│   └── config.ts            # Your config
├── public/
├── vite.config.ts
├── tailwind.config.js       # Extend template config
├── package.json
└── .env
```

### Use Template in App

```typescript
// src/App.tsx
import { Button, AnimatedCard, Hero } from '@yourorg/webapp-template/components';
import { cn } from '@yourorg/webapp-template/lib';
import '@yourorg/webapp-template/styles';

function App() {
  return (
    <div>
      {/* Template components */}
      <Hero />
      <AnimatedCard title="From Template" />
      <Button variant="gradient">Template Button</Button>

      {/* Your custom components */}
      <MyCustomFeature />
    </div>
  );
}
```

### Update Template

```bash
# In template repo
npm version patch  # or minor, major
npm run build:package
npm publish

# In your app
npm update @yourorg/webapp-template
npm run build
npm run dev  # Test everything works
```

---

## Opzione 2: Git Submodules

Più semplice di NPM registry, ma meno elegante.

### Setup

```bash
# 1. Create your app repo
mkdir my-new-app && cd my-new-app
git init

# 2. Add template as submodule
git submodule add https://github.com/yourorg/webapp-template template

# 3. Create app structure
mkdir -p src/{pages,components}

# 4. Create package.json that links template
cat > package.json <<EOF
{
  "name": "my-new-app",
  "dependencies": {
    "webapp-template": "file:./template/apps/frontend"
  },
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  }
}
EOF

# 5. Install
npm install
```

### Update Template

```bash
# Update to latest template
git submodule update --remote

# Install updated dependencies
npm install

# Test
npm run dev
```

### Clone App with Submodule

```bash
# Clone with submodules
git clone --recurse-submodules <app-repo-url>

# Or if already cloned
git clone <app-repo-url>
cd app-repo
git submodule init
git submodule update
```

### Pros/Cons

**Pros:**
- ✅ No npm registry needed
- ✅ Free
- ✅ Simple setup
- ✅ Direct git integration

**Cons:**
- ❌ Git submodules are complex
- ❌ Team members must understand submodules
- ❌ Deployment can be tricky
- ❌ Versioning less clean than npm

---

## Opzione 3: Monorepo

Tutti i progetti in un unico repository.

### Structure

```
my-workspace/
├── packages/
│   ├── template/              # Template base
│   │   ├── components/
│   │   ├── lib/
│   │   └── package.json
│   ├── app-dashboard/         # App 1
│   │   ├── src/
│   │   └── package.json
│   ├── app-marketing/         # App 2
│   │   ├── src/
│   │   └── package.json
│   └── app-admin/             # App 3
│       ├── src/
│       └── package.json
└── package.json               # Root workspace
```

### Setup

```bash
# 1. Create workspace
mkdir my-workspace && cd my-workspace

# 2. Root package.json
cat > package.json <<EOF
{
  "name": "my-workspace",
  "private": true,
  "workspaces": [
    "packages/*"
  ]
}
EOF

# 3. Move template
cp -r /path/to/webapp-template packages/template

# 4. Create app
mkdir -p packages/app-dashboard
cd packages/app-dashboard

# 5. App package.json
cat > package.json <<EOF
{
  "name": "app-dashboard",
  "dependencies": {
    "@workspace/template": "*"
  }
}
EOF

# 6. Install all
cd ../..
npm install
```

### Use Template in Apps

```typescript
// packages/app-dashboard/src/App.tsx
import { Button } from '@workspace/template/components';

function Dashboard() {
  return (
    <div>
      <Button>Shared Button</Button>
    </div>
  );
}
```

### Development

```bash
# Dev all apps
npm run dev --workspaces

# Dev specific app
npm run dev --workspace=app-dashboard

# Build all
npm run build --workspaces
```

### Pros/Cons

**Pros:**
- ✅ Everything in one place
- ✅ Shared dependencies
- ✅ Easy cross-project changes
- ✅ Instant template updates

**Cons:**
- ❌ Single large repository
- ❌ Tightly coupled projects
- ❌ Deployment more complex
- ❌ Harder to open-source individual apps

---

## Creare Nuova App

### Usando NPM Package

```bash
# 1. Create project from template CLI (optional - create this)
npx @yourorg/create-webapp my-app

# Or manually:
mkdir my-app && cd my-app
npm init -y

# 2. Install template
npm install @yourorg/webapp-template

# 3. Setup files
# Copy vite.config, tailwind.config from examples

# 4. Create src structure
mkdir -p src/{pages,components,lib}

# 5. Create App.tsx
cat > src/App.tsx <<EOF
import { Hero, Button } from '@yourorg/webapp-template/components';

export default function App() {
  return (
    <div>
      <Hero />
      <Button>Get Started</Button>
    </div>
  );
}
EOF

# 6. Dev
npm run dev
```

### Project Structure

```
my-app/
├── src/
│   ├── App.tsx                   # Main app
│   ├── pages/                    # Your pages
│   │   ├── Home.tsx
│   │   ├── About.tsx
│   │   └── Dashboard.tsx
│   ├── components/               # Your components
│   │   ├── CustomHeader.tsx
│   │   └── CustomFooter.tsx
│   ├── lib/
│   │   └── api.ts                # Your API client
│   └── config/
│       ├── routes.ts
│       └── theme.ts              # Theme customization
├── public/
├── .env
├── vite.config.ts
├── tailwind.config.js
├── package.json
└── README.md

# Template components imported as:
import { Button } from '@yourorg/webapp-template/components';
```

---

## Update Template

### Semantic Versioning

Template segue SemVer:

```
1.2.3
│ │ └─ Patch: Bug fixes, no breaking changes
│ └─── Minor: New features, backward compatible
└───── Major: Breaking changes
```

### Update Strategy

#### Patch Updates (1.0.0 → 1.0.1)
```bash
# Safe to auto-update
npm update @yourorg/webapp-template
npm run build
npm run dev
```

#### Minor Updates (1.0.0 → 1.1.0)
```bash
# Review changelog first
npm update @yourorg/webapp-template

# Test thoroughly
npm run build
npm run test
npm run dev
```

#### Major Updates (1.0.0 → 2.0.0)
```bash
# Read migration guide
# Update in branch
git checkout -b upgrade/template-v2

npm install @yourorg/webapp-template@2.0.0

# Fix breaking changes
# Test extensively
npm run build
npm run test
npm run dev

# Review, test, then merge
```

### Lock to Specific Version

```json
// package.json
{
  "dependencies": {
    "@yourorg/webapp-template": "1.2.3"  // Exact version
  }
}
```

### Use Version Ranges

```json
{
  "dependencies": {
    "@yourorg/webapp-template": "^1.2.3"  // 1.x.x (no major changes)
    "@yourorg/webapp-template": "~1.2.3"  // 1.2.x (only patches)
  }
}
```

---

## Best Practices

### 1. Versioning

- **Template** usa SemVer strict
- **Breaking changes** = major version
- **New components** = minor version
- **Bug fixes** = patch version
- Documenta CHANGELOG per ogni release

### 2. Customization

```typescript
// ✅ GOOD - Compose with template
import { Button } from '@yourorg/webapp-template';

export function MyButton(props) {
  return <Button {...props} className="my-custom-class" />;
}

// ❌ BAD - Copy template code
// Don't copy Button.tsx into your app
```

### 3. Theming

```javascript
// tailwind.config.js in your app
import templateConfig from '@yourorg/webapp-template/tailwind.config';

export default {
  ...templateConfig,
  theme: {
    ...templateConfig.theme,
    extend: {
      ...templateConfig.theme.extend,
      colors: {
        ...templateConfig.theme.extend.colors,
        // Your custom colors
        brand: '#FF6B6B',
      },
    },
  },
};
```

### 4. Override Components (When Necessary)

```typescript
// Use template component by default
import { Button as TemplateButton } from '@yourorg/webapp-template';

// Override only when needed
export const Button = (props) => {
  // Custom logic
  if (props.special) {
    return <SpecialButton {...props} />;
  }

  // Fall back to template
  return <TemplateButton {...props} />;
};
```

### 5. Testing Updates

Checklist prima di update:

- [ ] Leggi CHANGELOG
- [ ] Update in branch separato
- [ ] `npm run build` succede
- [ ] `npm run test` passa
- [ ] `npm run dev` funziona
- [ ] Test manuale features critiche
- [ ] Controlla bundle size
- [ ] Review performance
- [ ] Deploy su staging
- [ ] QA completo
- [ ] Merge a main

### 6. Documentation

Ogni app deve documentare:
- Quale versione template usa
- Customizzazioni fatte
- Override di componenti
- Theme customization

```markdown
# My App

Based on @yourorg/webapp-template v1.2.3

## Customizations
- Custom Header component (overrides template Header)
- Brand colors in tailwind.config
- Additional animations in AnimatedCard
```

---

## Troubleshooting

### Conflitti Peer Dependencies

```bash
# Fix
npm install --legacy-peer-deps
```

### Type Errors

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@yourorg/webapp-template/*": ["node_modules/@yourorg/webapp-template/dist/*"]
    }
  }
}
```

### CSS Non Carica

```typescript
// main.tsx
import '@yourorg/webapp-template/styles';
import './index.css';  // Your styles after
```

### Build Fails

```bash
# Clear node_modules e reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## Migration from Clone to Package

Se hai già progetti con clone completo:

### Step 1: Analizza

```bash
# Identifica file modificati dal template
git diff --name-only <template-initial-commit> HEAD
```

### Step 2: Separa Custom Code

```bash
# Sposta componenti custom in src/
# Lascia componenti template non modificati
```

### Step 3: Install Template Package

```bash
npm install @yourorg/webapp-template
```

### Step 4: Replace Imports

```typescript
// Before
import Button from './components/Button';

// After
import { Button } from '@yourorg/webapp-template/components';
```

### Step 5: Test

```bash
npm run build
npm run dev
```

---

## Quando Tornare a Clone Completo

Se ti trovi in queste situazioni, considera di tornare a clone completo:

- ❌ Troppo overhead di setup/maintenance
- ❌ Progetti divergono troppo dal template
- ❌ Update template rompono troppo spesso
- ❌ Team non capisce l'approccio package
- ❌ Deployment troppo complesso

**È OK cambiare approccio!** Non c'è vergogna nel semplificare.

---

**Buona fortuna con il tuo template riutilizzabile! 📦✨**

Se hai domande o problemi, apri una issue nel repo del template.
