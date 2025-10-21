# ⚡ Quick Start Guide

Guida rapida per iniziare subito a sviluppare con questo template.

## 📦 Installazione

```bash
# 1. Clona il repository
git clone <your-repo-url>
cd webapp-template

# 2. Installa le dipendenze
npm install

# 3. Setup Git hooks
npm run prepare

# 4. Copia environment variables
cp apps/backend/.env.example apps/backend/.env
```

## 🚀 Sviluppo

### Avvia tutto insieme

```bash
npm run dev
```

Questo avvierà:
- ✅ Frontend su http://localhost:3000
- ✅ Backend su http://localhost:5000

### Oppure avvia separatamente

```bash
# Terminal 1 - Frontend
npm run dev:frontend

# Terminal 2 - Backend
npm run dev:backend
```

### Storybook (Component Library)

```bash
npm run storybook
```

Apri http://localhost:6006 per vedere tutti i componenti UI.

## 📝 Primo Componente

### 1. Crea il componente

```tsx
// apps/frontend/src/components/MyComponent.tsx
import { motion } from 'framer-motion';
import { cn } from '@lib/utils';

interface MyComponentProps {
  title: string;
}

const MyComponent = ({ title }: MyComponentProps) => {
  return (
    <motion.div
      className="p-6 glass rounded-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
    >
      <h2 className="text-2xl font-bold gradient-text">{title}</h2>
    </motion.div>
  );
};

export default MyComponent;
```

### 2. Crea la Story

```tsx
// apps/frontend/src/components/MyComponent.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import MyComponent from './MyComponent';

const meta = {
  title: 'Components/MyComponent',
  component: MyComponent,
  tags: ['autodocs'],
} satisfies Meta<typeof MyComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'My Awesome Component',
  },
};
```

### 3. Usa nel progetto

```tsx
// apps/frontend/src/App.tsx
import MyComponent from './components/MyComponent';

function App() {
  return (
    <div>
      <MyComponent title="Hello World!" />
    </div>
  );
}
```

## 🔌 Prima API

### 1. Crea route

```typescript
// apps/backend/src/routes/items.ts
import { Router } from 'express';
import { z } from 'zod';

const router = Router();

const itemSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
});

router.get('/', (req, res) => {
  res.json({ items: [] });
});

router.post('/', (req, res) => {
  const validated = itemSchema.parse(req.body);
  res.status(201).json({ item: validated });
});

export default router;
```

### 2. Registra route

```typescript
// apps/backend/src/index.ts
import itemsRouter from './routes/items.js';

// ... other code ...

app.use('/api/items', itemsRouter);
```

### 3. Chiama dal frontend

```typescript
// apps/frontend/src/lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

export const getItems = () => api.get('/items');
export const createItem = (data: any) => api.post('/items', data);
```

## 🎨 Personalizzazione Design

### Cambia colori del tema

```css
/* apps/frontend/src/styles/globals.css */

:root {
  --primary: 221.2 83.2% 53.3%;  /* Cambia qui per light mode */
  --secondary: 210 40% 96.1%;
  /* ... */
}

.dark {
  --primary: 217.2 91.2% 59.8%;  /* Cambia qui per dark mode */
  --secondary: 217.2 32.6% 17.5%;
  /* ... */
}
```

### Usa i colori

```tsx
<div className="bg-primary text-primary-foreground">
  Usa i design tokens
</div>

<button className="bg-secondary hover:bg-secondary/80">
  Button
</button>
```

## 💾 Git Workflow

### Nuovo feature

```bash
# 1. Crea branch
git checkout -b feature/my-feature

# 2. Fai modifiche e commit
git add .
git commit -m "feat: add my feature"

# 3. Push
git push -u origin feature/my-feature

# 4. Apri PR su GitHub
```

### Formato commit

Usa **Conventional Commits**:

```bash
feat: add new component
fix: resolve button bug
docs: update README
style: format code
refactor: simplify logic
test: add unit tests
chore: update dependencies
```

⚠️ Il commit sarà **rifiutato** se non segue questo formato (grazie a Husky hook).

## 🐳 Docker

### Avvia con Docker

```bash
# Build e avvia
docker-compose up --build

# In background
docker-compose up -d

# Stop
docker-compose down
```

Applicazione disponibile su:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 📚 Comandi Utili

```bash
# Lint tutto
npm run lint

# Format tutto
npm run format

# Build tutto
npm run build

# Build solo frontend
npm run build:frontend

# Build solo backend
npm run build:backend

# Test (quando configurati)
npm run test
```

## 🎯 Prossimi Passi

1. ✅ Esplora Storybook: `npm run storybook`
2. ✅ Personalizza design tokens in `apps/frontend/src/styles/globals.css`
3. ✅ Leggi [README.md](./README.md) per documentazione completa
4. ✅ Leggi [WORKFLOW.md](./WORKFLOW.md) per Git workflow dettagliato
5. ✅ Leggi [CONTRIBUTING.md](./CONTRIBUTING.md) per guidelines

## 🆘 Problemi?

### Port già in uso

```bash
# Trova processo su porta 3000
lsof -ti:3000 | xargs kill -9

# Trova processo su porta 5000
lsof -ti:5000 | xargs kill -9
```

### Problemi dependencies

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Husky hooks non funzionano

```bash
npm run prepare
chmod +x .husky/pre-commit
chmod +x .husky/commit-msg
```

## 📖 Documentazione Completa

- [README.md](./README.md) - Documentazione completa
- [WORKFLOW.md](./WORKFLOW.md) - Git workflow dettagliato
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Come contribuire
- [.claude/template-guide.md](./.claude/template-guide.md) - Guida per Claude AI

## 💡 Tips

### Sviluppo Componenti

Usa sempre Storybook per sviluppare componenti in isolamento prima di usarli nell'app.

### Animazioni

Tutte le animazioni dovrebbero usare `transform` e `opacity` per performance ottimali.

### Design Tokens

Mai usare colori hardcoded. Usa sempre i design tokens:
- ✅ `bg-primary`
- ❌ `bg-blue-500`

### TypeScript

Evita `any`. Usa `unknown` se non conosci il tipo, poi fai type narrowing.

---

**Buon sviluppo! 🚀**

Se hai domande o problemi, consulta la documentazione completa o apri una issue su GitHub.
