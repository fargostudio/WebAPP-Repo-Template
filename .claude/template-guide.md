# 🤖 Template Guide per Claude AI

> Questo documento contiene tutte le informazioni necessarie per Claude AI per lavorare efficacemente con questo template quando viene clonato per un nuovo progetto.

## 📋 Indice

- [Overview Template](#overview-template)
- [Architettura e Struttura](#architettura-e-struttura)
- [Stack Tecnologico Dettagliato](#stack-tecnologico-dettagliato)
- [Pattern e Convenzioni](#pattern-e-convenzioni)
- [Guida Sviluppo Componenti](#guida-sviluppo-componenti)
- [Guida Backend](#guida-backend)
- [Workflow Git](#workflow-git)
- [Common Tasks](#common-tasks)
- [Troubleshooting](#troubleshooting)
- [Quick Reference](#quick-reference)

---

## Overview Template

### Filosofia del Template

Questo template è stato creato per **designer che sviluppano**, con priorità assoluta su:

1. **Design Excellence** - Qualità visiva, animazioni fluide, wow factor
2. **Modern Tech Stack** - Tecnologie bleeding-edge ma stabili
3. **Developer Experience** - Setup rapido, hot reload, type safety
4. **Production Ready** - Docker, CI/CD, security, performance
5. **Maintainability** - Codice pulito, documentato, testabile

### Principi Fondamentali

- **Design System First** - Tutti i componenti usano design tokens
- **Animation Driven** - Ogni interazione ha micro-animazioni
- **Type Safety** - TypeScript end-to-end, Zod per validation
- **Component Isolation** - Sviluppo in Storybook
- **Monorepo Structure** - Frontend e backend insieme
- **Conventional Commits** - Git workflow standardizzato

---

## Architettura e Struttura

### File System Overview

```
webapp-template/
├── .claude/                    # ← Documentazione per Claude AI
│   └── template-guide.md      # ← Questo file
│
├── .github/
│   └── workflows/             # GitHub Actions
│       ├── ci.yml            # Lint, test, build
│       ├── deploy.yml        # Deploy workflow
│       └── storybook.yml     # Storybook deploy
│
├── .husky/                    # Git hooks
│   ├── pre-commit           # Lint-staged
│   └── commit-msg           # Conventional Commits validation
│
├── apps/
│   ├── frontend/            # React app
│   │   ├── .storybook/     # Storybook config
│   │   │   ├── main.ts
│   │   │   └── preview.ts
│   │   ├── src/
│   │   │   ├── components/  # React components
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Button.stories.tsx
│   │   │   │   ├── AnimatedCard.tsx
│   │   │   │   ├── AnimatedCard.stories.tsx
│   │   │   │   ├── Hero.tsx
│   │   │   │   └── ThemeToggle.tsx
│   │   │   ├── pages/       # Route components
│   │   │   ├── hooks/       # Custom React hooks
│   │   │   ├── lib/         # Utilities
│   │   │   │   └── utils.ts # cn(), formatDate(), etc.
│   │   │   ├── styles/
│   │   │   │   └── globals.css  # Design tokens + utilities
│   │   │   ├── assets/      # Images, fonts
│   │   │   ├── App.tsx      # Main app component
│   │   │   └── main.tsx     # Entry point
│   │   ├── index.html
│   │   ├── vite.config.ts
│   │   ├── tailwind.config.js
│   │   ├── tsconfig.json
│   │   ├── package.json
│   │   ├── Dockerfile
│   │   └── nginx.conf
│   │
│   └── backend/             # Express API
│       ├── src/
│       │   ├── routes/      # Route definitions
│       │   │   ├── health.ts
│       │   │   └── api.ts
│       │   ├── controllers/ # Business logic (empty, ready to use)
│       │   ├── middleware/  # Express middleware
│       │   │   └── errorHandler.ts
│       │   ├── services/    # Service layer (empty, ready to use)
│       │   ├── utils/
│       │   │   └── logger.ts
│       │   ├── types/       # TypeScript types (empty, ready to use)
│       │   └── index.ts     # Server entry point
│       ├── .env.example
│       ├── tsconfig.json
│       ├── package.json
│       └── Dockerfile
│
├── packages/                # Shared packages (empty, ready to use)
│   └── shared/             # Code condiviso tra frontend e backend
│
├── docker-compose.yml       # Orchestrazione containers
├── package.json            # Root package.json (workspaces)
├── .gitignore
├── .dockerignore
├── .eslintrc.json
├── .prettierrc
├── .editorconfig
├── .nvmrc                  # Node version (20.11.0)
├── README.md               # User documentation
├── CONTRIBUTING.md         # Contribution guidelines
├── WORKFLOW.md             # Git workflow guide
└── LICENSE                 # MIT License
```

### Dependency Tree

```
Root (workspaces)
  ├── apps/frontend (dependencies)
  │   ├── react, react-dom
  │   ├── framer-motion
  │   ├── @react-three/fiber, @react-three/drei, three
  │   ├── @radix-ui/* (various)
  │   ├── gsap, lenis
  │   ├── clsx, tailwind-merge, class-variance-authority
  │   ├── lucide-react
  │   ├── axios, zustand
  │   └── react-router-dom
  │
  └── apps/backend (dependencies)
      ├── express, cors, helmet
      ├── dotenv, winston
      ├── zod
      ├── @prisma/client (opzionale)
      └── express-rate-limit
```

---

## Stack Tecnologico Dettagliato

### Frontend Stack

#### Vite
- **Perché**: Build ultra veloce, HMR istantaneo, migliore DX
- **Config**: `apps/frontend/vite.config.ts`
- **Alias**: `@/`, `@components/`, `@lib/`, `@hooks/`, `@assets/`, `@styles/`
- **Proxy**: `/api` → `http://localhost:5000`

#### React 18
- **Features usate**:
  - Concurrent rendering
  - Automatic batching
  - Suspense (ready for use)
- **Patterns da seguire**:
  - Functional components sempre
  - Hooks per state/effects
  - Context per state globale (o Zustand)
  - React.memo per performance

#### TypeScript
- **Config**: `apps/frontend/tsconfig.json`
- **Strict mode**: Abilitato
- **Path mapping**: Configurato per alias
- **Convenzioni**:
  - Interfaces per props: `ButtonProps`
  - Types per unions: `type Variant = 'primary' | 'secondary'`
  - Zod per runtime validation

#### Tailwind CSS
- **Config**: `apps/frontend/tailwind.config.js`
- **Design Tokens**: Definiti in `:root` CSS variables
- **Dark Mode**: Class-based (`.dark`)
- **Custom Animations**:
  - `animate-fade-in`
  - `animate-slide-in`
  - `animate-float`
  - `animate-shimmer`
  - `animate-accordion-down/up`
- **Custom Utilities**:
  - `.gradient-text` - Gradient text con background-clip
  - `.glass` - Glassmorphism effect
  - `.animated-gradient` - Background gradient animato

#### Framer Motion
- **Quando usare**:
  - Page transitions
  - Component mount/unmount animations
  - Gesture-based animations (hover, tap, drag)
  - Layout animations
  - SVG animations
- **Pattern standard**:
  ```tsx
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  />
  ```
- **Performance**: Usa `transform` e `opacity` per GPU acceleration

#### GSAP
- **Quando usare**:
  - Timeline complesse
  - Scroll-triggered animations
  - Animazioni sequenziali con timing preciso
  - Morph/tween complessi
- **Non incluso di default**: Aggiungere quando necessario

#### React Three Fiber
- **Quando usare**:
  - 3D objects/scenes
  - WebGL effects
  - Particle systems
  - Background effects
- **Performance**: Lazy load componenti 3D

#### Storybook
- **Port**: 6006
- **Config**: `apps/frontend/.storybook/`
- **Pattern stories**:
  ```tsx
  const meta = {
    title: 'Components/ComponentName',
    component: Component,
    tags: ['autodocs'],
  } satisfies Meta<typeof Component>;
  ```

### Backend Stack

#### Express
- **Port**: 5000 (configurable via PORT env)
- **Middleware order**:
  1. helmet (security)
  2. cors
  3. express.json()
  4. express.urlencoded()
  5. custom logging
  6. routes
  7. errorHandler (last)

#### TypeScript
- **Config**: `apps/backend/tsconfig.json`
- **Output**: `dist/` directory
- **Module**: ESNext with Node resolution

#### Zod
- **Uso**: Schema validation per API requests
- **Pattern**:
  ```ts
  const schema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
  });

  const validated = schema.parse(req.body);
  ```

#### Winston
- **Logs directory**: `apps/backend/logs/`
- **Files**:
  - `error.log` - Errors only
  - `combined.log` - All logs
  - Console - Colored output in dev

#### Prisma (Optional)
- **Non configurato di default**
- **Setup quando necessario**:
  ```bash
  cd apps/backend
  npx prisma init
  # Edit schema.prisma
  npx prisma migrate dev
  npx prisma generate
  ```

### DevOps Stack

#### Docker
- **Frontend Dockerfile**:
  - Multi-stage build
  - Build con Node 20
  - Serve con Nginx
  - Port 80

- **Backend Dockerfile**:
  - Multi-stage build
  - Build con Node 20
  - Run as non-root user
  - Port 5000

- **Docker Compose**:
  - Frontend service (port 3000)
  - Backend service (port 5000)
  - Postgres commented (ready to use)

#### GitHub Actions
- **CI Workflow** (`.github/workflows/ci.yml`):
  - Trigger: Push/PR to main/develop
  - Jobs: lint-and-test, build-frontend, build-backend
  - Artifacts: Upload dist/

- **Deploy Workflow** (`.github/workflows/deploy.yml`):
  - Trigger: Push to main
  - Ready for: Vercel, Netlify, Docker registry

- **Storybook Workflow** (`.github/workflows/storybook.yml`):
  - Trigger: Push to main, changes in components/
  - Ready for: GitHub Pages

#### Husky
- **Setup**: Auto-initialized with `npm run prepare`
- **Hooks**:
  - `pre-commit`: Runs lint-staged
  - `commit-msg`: Validates Conventional Commits format

---

## Pattern e Convenzioni

### Naming Conventions

#### Files
```
Components:        Button.tsx, AnimatedCard.tsx (PascalCase)
Stories:          Button.stories.tsx
Tests:            Button.test.tsx
Utilities:        utils.ts, api-client.ts (kebab-case)
Hooks:            useAuth.ts, useTheme.ts (camelCase con 'use' prefix)
Types:            types.ts, interfaces.ts
Constants:        constants.ts, config.ts
```

#### Code
```typescript
// Components: PascalCase
const Button = () => {}
const AnimatedCard = () => {}

// Functions: camelCase
function formatDate() {}
const handleClick = () => {}

// Variables: camelCase
const userName = 'John'
const isLoading = false

// Constants: UPPER_SNAKE_CASE
const API_URL = 'https://api.example.com'
const MAX_RETRIES = 3

// Interfaces: PascalCase with 'I' prefix optional
interface ButtonProps {}
interface IUser {} // Both OK

// Types: PascalCase
type Variant = 'primary' | 'secondary'
type Status = 'pending' | 'success' | 'error'

// Enums: PascalCase
enum UserRole {
  Admin = 'admin',
  User = 'user',
}
```

### Component Structure

```tsx
// 1. Imports
import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@lib/utils';

// 2. Types/Interfaces
interface ComponentProps {
  title: string;
  description?: string;
  variant?: 'default' | 'outline';
  onClick?: () => void;
}

// 3. Component
const Component = ({
  title,
  description,
  variant = 'default',
  onClick
}: ComponentProps) => {
  // 3a. Hooks
  const [isOpen, setIsOpen] = useState(false);

  // 3b. Derived state / computed values
  const computedValue = isOpen ? 'open' : 'closed';

  // 3c. Event handlers
  const handleClick = () => {
    setIsOpen(!isOpen);
    onClick?.();
  };

  // 3d. Effects (if any)
  // useEffect(() => {}, []);

  // 3e. Render
  return (
    <motion.div
      className={cn(
        'base-classes',
        variant === 'outline' && 'outline-classes'
      )}
      onClick={handleClick}
    >
      <h3>{title}</h3>
      {description && <p>{description}</p>}
    </motion.div>
  );
};

// 4. Export
export default Component;
// or named export
export { Component };
```

### CSS/Tailwind Patterns

#### Base Pattern
```tsx
// ✅ GOOD - Use design tokens
className="bg-primary text-primary-foreground"
className="border-border rounded-lg"

// ❌ BAD - Hardcoded colors
className="bg-blue-500 text-white"
className="border-gray-300 rounded-lg"
```

#### Conditional Classes
```tsx
// ✅ GOOD - Use cn() utility
import { cn } from '@lib/utils';

className={cn(
  'base-class',
  isActive && 'active-class',
  variant === 'outline' && 'outline-class'
)}

// ❌ BAD - String concatenation
className={`base-class ${isActive ? 'active-class' : ''}`}
```

#### Class Variance Authority (CVA)
```tsx
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'base-classes', // base
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground',
        outline: 'border-2 border-primary',
      },
      size: {
        sm: 'h-9 px-4',
        lg: 'h-14 px-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'sm',
    },
  }
);

// Usage
<button className={buttonVariants({ variant, size })} />
```

### Animation Patterns

#### Framer Motion - Standard Patterns

**Fade In**
```tsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.3 }}
/>
```

**Slide In**
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
/>
```

**Stagger Children**
```tsx
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

<motion.div variants={container} initial="hidden" animate="show">
  <motion.div variants={item} />
  <motion.div variants={item} />
  <motion.div variants={item} />
</motion.div>
```

**Viewport Animations**
```tsx
<motion.div
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: true, amount: 0.3 }}
/>
```

**Interactive States**
```tsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  transition={{ type: 'spring', stiffness: 400 }}
/>
```

#### Performance Guidelines

- ✅ Animate `transform` and `opacity` (GPU accelerated)
- ✅ Use `will-change` sparingly
- ✅ Lazy load heavy animations
- ❌ Avoid animating `width`, `height`, `top`, `left`
- ❌ Too many simultaneous animations

### State Management

#### Local State
```tsx
// ✅ Simple component state
const [isOpen, setIsOpen] = useState(false);
```

#### Shared State - Context
```tsx
// ✅ For theme, auth, etc.
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
```

#### Global State - Zustand
```tsx
// ✅ For complex global state
import { create } from 'zustand';

interface StoreState {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useStore = create<StoreState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

// Usage
const user = useStore((state) => state.user);
const setUser = useStore((state) => state.setUser);
```

### API Client Pattern

```typescript
// apps/frontend/src/lib/api-client.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### Error Handling

#### Frontend
```tsx
// Component level
try {
  const data = await fetchData();
} catch (error) {
  console.error('Error:', error);
  // Show toast/notification
}

// With React Query (recommended)
const { data, error, isLoading } = useQuery('key', fetchData);

if (error) return <ErrorComponent error={error} />;
```

#### Backend
```typescript
// Use ApiError class
import { ApiError } from '../middleware/errorHandler';

// In route/controller
if (!user) {
  throw new ApiError(404, 'User not found');
}

// Error handler catches it automatically
```

---

## Guida Sviluppo Componenti

### Workflow Componente Nuovo

1. **Crea file componente**
   ```bash
   apps/frontend/src/components/NewComponent.tsx
   ```

2. **Crea file story**
   ```bash
   apps/frontend/src/components/NewComponent.stories.tsx
   ```

3. **Sviluppo in Storybook**
   ```bash
   npm run storybook
   ```

4. **Crea varianti con CVA**
   ```tsx
   const componentVariants = cva('base', {
     variants: { ... }
   });
   ```

5. **Aggiungi animazioni**
   ```tsx
   <motion.div whileHover={{ scale: 1.05 }} />
   ```

6. **Test in app**
   ```bash
   npm run dev:frontend
   ```

### Template Componente Base

```tsx
import { motion, HTMLMotionProps } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@lib/utils';

const componentVariants = cva(
  'base-classes transition-all',
  {
    variants: {
      variant: {
        default: 'variant-default-classes',
        outline: 'variant-outline-classes',
      },
      size: {
        sm: 'size-sm-classes',
        md: 'size-md-classes',
        lg: 'size-lg-classes',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface ComponentProps
  extends Omit<HTMLMotionProps<'div'>, 'size'>,
    VariantProps<typeof componentVariants> {
  title: string;
  description?: string;
}

const Component = ({
  title,
  description,
  variant,
  size,
  className,
  ...props
}: ComponentProps) => {
  return (
    <motion.div
      className={cn(componentVariants({ variant, size }), className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
    </motion.div>
  );
};

export default Component;
```

### Template Story

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import Component from './Component';

const meta = {
  title: 'Components/Component',
  component: Component,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Component Title',
    description: 'Component description',
  },
};

export const Outline: Story = {
  args: {
    ...Default.args,
    variant: 'outline',
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Component title="Small" size="sm" />
      <Component title="Medium" size="md" />
      <Component title="Large" size="lg" />
    </div>
  ),
};
```

### Componenti Comuni da Creare

Quando l'utente chiede di aggiungere componenti UI, usa questi pattern:

#### Card
- Varianti: default, outlined, elevated, glass
- Animazioni: hover lift, border glow
- Props: title, description, image, actions

#### Modal/Dialog
- Usa Radix UI Dialog
- Animazioni: fade in backdrop, scale up content
- Props: open, onClose, title, children

#### Input
- Varianti: default, outlined, filled
- Stati: default, focus, error, disabled
- Props: label, error, helper text

#### Toast/Notification
- Usa Radix UI Toast
- Varianti: info, success, warning, error
- Animazioni: slide in from top/bottom

#### Tabs
- Usa Radix UI Tabs
- Animazioni: sliding indicator
- Props: items, defaultValue, onChange

---

## Guida Backend

### Struttura Route Raccomandata

```typescript
// apps/backend/src/routes/users.ts
import { Router } from 'express';
import { z } from 'zod';
import { ApiError } from '../middleware/errorHandler';

const router = Router();

// Schema validation
const createUserSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(8),
});

// GET /api/users
router.get('/', async (req, res) => {
  // Logic here
  res.json({ users: [] });
});

// GET /api/users/:id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  // Logic here
  res.json({ user: {} });
});

// POST /api/users
router.post('/', async (req, res) => {
  try {
    const validated = createUserSchema.parse(req.body);
    // Logic here
    res.status(201).json({ user: {} });
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ApiError(400, error.errors[0].message);
    }
    throw error;
  }
});

export default router;
```

### Middleware Pattern

```typescript
// apps/backend/src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import { ApiError } from './errorHandler';

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      throw new ApiError(401, 'No token provided');
    }

    // Verify token logic
    // req.user = decoded;

    next();
  } catch (error) {
    next(error);
  }
};

// Usage in routes
router.get('/protected', authenticate, (req, res) => {
  res.json({ message: 'Protected route' });
});
```

### Service Layer Pattern

```typescript
// apps/backend/src/services/userService.ts
import { ApiError } from '../middleware/errorHandler';

export class UserService {
  async findById(id: string) {
    // Database query
    const user = await db.user.findUnique({ where: { id } });

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    return user;
  }

  async create(data: CreateUserData) {
    // Validation
    // Database operation
    return user;
  }

  async update(id: string, data: UpdateUserData) {
    // Logic
    return user;
  }

  async delete(id: string) {
    // Logic
  }
}

export const userService = new UserService();
```

### Controller Pattern

```typescript
// apps/backend/src/controllers/userController.ts
import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/userService';

export class UserController {
  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await userService.findAll();
      res.json({ users });
    } catch (error) {
      next(error);
    }
  }

  async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userService.findById(req.params.id);
      res.json({ user });
    } catch (error) {
      next(error);
    }
  }

  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userService.create(req.body);
      res.status(201).json({ user });
    } catch (error) {
      next(error);
    }
  }
}

export const userController = new UserController();

// In routes file
import { userController } from '../controllers/userController';

router.get('/', userController.getUsers);
router.get('/:id', userController.getUser);
router.post('/', userController.createUser);
```

---

## Workflow Git

### Branch Naming

```bash
feature/user-authentication
feature/dashboard-redesign
fix/login-validation
fix/api-timeout
hotfix/security-patch
docs/api-documentation
refactor/state-management
test/e2e-checkout
chore/update-dependencies
```

### Commit Message Format

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code refactoring
- `perf`: Performance
- `test`: Tests
- `build`: Build system
- `ci`: CI/CD
- `chore`: Maintenance
- `revert`: Revert commit

**Examples:**
```bash
feat: add user authentication
feat(auth): implement JWT token refresh
fix: resolve memory leak in websocket
fix(ui): correct button alignment on mobile
docs: update API documentation
docs(readme): add deployment instructions
refactor: simplify error handling logic
```

### Development Workflow

1. **Update main**
   ```bash
   git checkout main
   git pull origin main
   ```

2. **Create feature branch**
   ```bash
   git checkout -b feature/my-feature
   ```

3. **Develop and commit**
   ```bash
   # Make changes
   git add .
   git commit -m "feat: add new component"
   ```

4. **Keep branch updated**
   ```bash
   git checkout main
   git pull origin main
   git checkout feature/my-feature
   git rebase main
   ```

5. **Push and create PR**
   ```bash
   git push -u origin feature/my-feature
   # Open PR on GitHub
   ```

6. **After merge**
   ```bash
   git checkout main
   git pull origin main
   git branch -d feature/my-feature
   ```

---

## Common Tasks

### Aggiungere Nuovo Componente UI

```bash
# 1. Crea componente
# apps/frontend/src/components/NewComponent.tsx

# 2. Crea story
# apps/frontend/src/components/NewComponent.stories.tsx

# 3. Test in Storybook
npm run storybook

# 4. Usa nel progetto
# Import in App.tsx o altre pages
```

### Aggiungere Nuova Route Backend

```bash
# 1. Crea file route
# apps/backend/src/routes/newRoute.ts

# 2. Registra in index.ts
import newRouter from './routes/newRoute.js';
app.use('/api/new', newRouter);

# 3. Test
curl http://localhost:5000/api/new
```

### Aggiungere Database (Prisma)

```bash
cd apps/backend

# 1. Init Prisma
npx prisma init

# 2. Configura DATABASE_URL in .env

# 3. Define schema in prisma/schema.prisma

# 4. Create migration
npx prisma migrate dev --name init

# 5. Generate client
npx prisma generate

# 6. Use in code
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
```

### Aggiungere Autenticazione

```bash
# 1. Install JWT
cd apps/backend
npm install jsonwebtoken bcryptjs
npm install -D @types/jsonwebtoken @types/bcryptjs

# 2. Create auth middleware
# apps/backend/src/middleware/auth.ts

# 3. Create auth routes
# apps/backend/src/routes/auth.ts

# 4. Frontend: Store token
localStorage.setItem('token', token);

# 5. Frontend: Add to API client
apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
```

### Deploy Vercel (Frontend)

```bash
cd apps/frontend

# 1. Install Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel --prod

# 4. Configure in vercel.json if needed
```

### Deploy Railway/Render (Backend)

```bash
# 1. Push to GitHub
git push origin main

# 2. Connect repository in Railway/Render

# 3. Configure environment variables

# 4. Deploy automatically on push
```

### Run in Docker

```bash
# Development
docker-compose up

# Production build
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

---

## Troubleshooting

### Frontend non si avvia

```bash
# 1. Check Node version
node -v  # Should be 20.x

# 2. Clean install
rm -rf node_modules package-lock.json
npm install

# 3. Clear Vite cache
rm -rf apps/frontend/node_modules/.vite

# 4. Check port 3000 availability
lsof -ti:3000 | xargs kill -9
```

### Backend errori TypeScript

```bash
# 1. Check tsconfig
# apps/backend/tsconfig.json should have correct paths

# 2. Rebuild
cd apps/backend
npm run build

# 3. Check imports use .js extension
import { x } from './file.js';  # Not './file'
```

### Husky hooks non funzionano

```bash
# 1. Reinstall hooks
npm run prepare

# 2. Make hooks executable
chmod +x .husky/pre-commit
chmod +x .husky/commit-msg

# 3. Check Husky version
npm list husky
```

### Storybook build fallisce

```bash
# 1. Clear cache
rm -rf node_modules/.cache/storybook

# 2. Rebuild
npm run build-storybook --workspace=frontend

# 3. Check for TypeScript errors
```

### Docker build lento

```bash
# 1. Use .dockerignore properly

# 2. Layer caching
# Copy package.json first, then npm ci, then code

# 3. Multi-stage builds already implemented
```

### Git commit rejected

```bash
# Commit message format error
# Must follow: <type>(<scope>): <description>

# Fix:
git commit -m "feat: correct message format"
```

---

## Quick Reference

### Port Assignments

```
3000  - Frontend dev server (Vite)
5000  - Backend dev server (Express)
6006  - Storybook
80    - Frontend Docker container
5432  - PostgreSQL (if using Docker)
```

### NPM Scripts

```bash
# Root
npm run dev              # Start all
npm run build            # Build all
npm run lint             # Lint all
npm run format           # Format all
npm run test             # Test all

# Frontend
npm run dev:frontend
npm run build:frontend
npm run storybook
npm run build-storybook

# Backend
npm run dev:backend
npm run build:backend
```

### Environment Variables

**Frontend** (.env in apps/frontend):
```bash
VITE_API_URL=http://localhost:5000
```

**Backend** (.env in apps/backend):
```bash
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret
```

### Import Aliases

```typescript
// Frontend
import { cn } from '@/lib/utils';
import Button from '@components/Button';
import { useAuth } from '@hooks/useAuth';
import logo from '@assets/logo.svg';
import '@styles/custom.css';
```

### Design Tokens (CSS Variables)

```css
/* Colors */
var(--primary)
var(--secondary)
var(--background)
var(--foreground)
var(--muted)
var(--accent)
var(--destructive)

/* Spacing */
var(--radius)  /* Border radius */
```

### Tailwind Custom Classes

```html
<div class="gradient-text">Gradient text</div>
<div class="glass">Glassmorphism</div>
<div class="animated-gradient">Animated background</div>
```

### Framer Motion Presets

```tsx
// Fade in
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}

// Slide up
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}

// Scale
initial={{ scale: 0.9 }}
animate={{ scale: 1 }}

// Hover
whileHover={{ scale: 1.05 }}
whileTap={{ scale: 0.95 }}
```

---

## Note per Claude AI

### Quando l'utente chiede di:

**"Aggiungi un componente X"**
1. Crea il componente in `apps/frontend/src/components/`
2. Usa CVA per varianti
3. Aggiungi Framer Motion animations
4. Crea .stories.tsx file
5. Usa design tokens (non hardcoded colors)

**"Aggiungi una API per X"**
1. Crea route in `apps/backend/src/routes/`
2. Usa Zod per validation
3. Usa ApiError per errori
4. Considera service layer se logica complessa
5. Aggiungi alla lista routes in index.ts

**"Setup database"**
1. Chiedi quale DB (PostgreSQL raccomandata)
2. Setup Prisma
3. Create schema
4. Migrate
5. Update .env.example

**"Deploy l'applicazione"**
1. Chiedi dove (Vercel, Railway, Docker, etc.)
2. Fornisci istruzioni specifiche
3. Environment variables checklist
4. Build verification

**"Fix bug X"**
1. Identifica il file/componente
2. Spiega il problema
3. Proponi fix
4. Test verification steps

### Best Practices da Seguire Sempre

- ✅ Use TypeScript types, no `any`
- ✅ Use design tokens, no hardcoded colors
- ✅ Add animations to new components
- ✅ Create Storybook stories for UI components
- ✅ Validate API inputs with Zod
- ✅ Handle errors properly
- ✅ Follow naming conventions
- ✅ Use path aliases (@/, @components/, etc.)
- ✅ Suggest Conventional Commits format
- ✅ Responsive design (mobile-first)

### Riferimenti Rapidi

- **Design inspiration**: Awwwards, Dribbble
- **Components**: Radix UI docs
- **Animations**: Framer Motion docs
- **3D**: React Three Fiber docs
- **API**: Express.js docs
- **Validation**: Zod docs

---

**End of Template Guide**

Questa guida è completa e sarà aggiornata man mano che il template evolve.
