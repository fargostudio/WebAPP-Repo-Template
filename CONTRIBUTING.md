# Contributing Guide

Grazie per il tuo interesse nel contribuire a questo progetto! 🎉

## 📋 Come Contribuire

### 1. Fork e Clone

```bash
# Fork il repository su GitHub, poi clona
git clone https://github.com/YOUR_USERNAME/webapp-template.git
cd webapp-template

# Aggiungi upstream remote
git remote add upstream https://github.com/ORIGINAL_OWNER/webapp-template.git
```

### 2. Setup Ambiente

```bash
# Installa dipendenze
npm install

# Setup git hooks
npm run prepare

# Crea file .env per backend
cp apps/backend/.env.example apps/backend/.env
```

### 3. Crea un Branch

```bash
# Crea branch dalla main aggiornata
git checkout main
git pull upstream main
git checkout -b feature/nome-feature
```

### 4. Fai le Modifiche

- Scrivi codice pulito e ben documentato
- Segui le convenzioni di stile del progetto
- Aggiungi test se applicabile
- Testa le modifiche localmente

```bash
# Verifica che tutto funzioni
npm run dev
npm run lint
npm run test
```

### 5. Commit

Usa **Conventional Commits**:

```bash
git add .
git commit -m "feat: descrizione della feature"
```

Il commit hook verificherà automaticamente:
- Formato del messaggio
- Linting del codice
- Formatting

### 6. Push e Pull Request

```bash
# Push al tuo fork
git push origin feature/nome-feature
```

Apri una Pull Request su GitHub con:
- **Titolo chiaro** che descrive la modifica
- **Descrizione dettagliata** del problema e della soluzione
- **Screenshot/GIF** se applicabile (specialmente per UI)
- **Link a issue** se presente

## 🎨 Guidelines Design

### Componenti UI

Quando aggiungi nuovi componenti:

1. **Crea Story Storybook**
   ```tsx
   // Component.stories.tsx
   import type { Meta, StoryObj } from '@storybook/react';
   import { Component } from './Component';

   const meta = {
     title: 'Components/Component',
     component: Component,
     tags: ['autodocs'],
   } satisfies Meta<typeof Component>;

   export default meta;
   ```

2. **Usa Design Tokens**
   ```tsx
   // ✅ Buono
   className="bg-primary text-primary-foreground"

   // ❌ Evita
   className="bg-blue-500 text-white"
   ```

3. **Animazioni con Framer Motion**
   ```tsx
   <motion.div
     initial={{ opacity: 0, y: 20 }}
     animate={{ opacity: 1, y: 0 }}
     transition={{ duration: 0.3 }}
   >
   ```

4. **Accessibilità**
   - Usa componenti Radix UI quando possibile
   - Aggiungi aria-labels appropriati
   - Testa con keyboard navigation

### Performance

- Usa `React.memo` per componenti costosi
- Ottimizza immagini (WebP/AVIF)
- Code splitting per route
- Lazy loading per componenti pesanti

## 💻 Guidelines Codice

### TypeScript

```typescript
// ✅ Buono - Type espliciti
interface ButtonProps {
  variant: 'primary' | 'secondary';
  children: React.ReactNode;
  onClick?: () => void;
}

// ❌ Evita - any
const handleClick = (data: any) => { }
```

### Naming Conventions

- **Componenti**: PascalCase (`ButtonPrimary`)
- **Utilities**: camelCase (`formatDate`)
- **Costanti**: UPPER_SNAKE_CASE (`API_URL`)
- **Files**: kebab-case per utils, PascalCase per componenti

### File Structure

```
components/
  Button/
    Button.tsx
    Button.stories.tsx
    Button.test.tsx
    index.ts
```

## 🧪 Testing

### Frontend

```bash
# Run tests
npm run test --workspace=frontend

# Watch mode
npm run test:watch --workspace=frontend
```

### Backend

```bash
# Run tests
npm run test --workspace=backend
```

## 📝 Documentazione

Quando aggiungi feature significative:

1. Aggiorna README.md
2. Aggiungi JSDoc ai componenti/funzioni
3. Crea esempi in Storybook
4. Aggiungi screenshot se UI

## 🐛 Bug Reports

Quando segnali bug, includi:

1. **Descrizione** del problema
2. **Steps to reproduce**
3. **Comportamento atteso** vs **comportamento effettivo**
4. **Screenshots/video** se applicabile
5. **Ambiente** (OS, browser, Node version)

## ✨ Feature Requests

Per richiedere nuove feature:

1. Verifica che non esista già una issue simile
2. Descrivi il problema che la feature risolve
3. Proponi una soluzione
4. Considera alternative

## 🔍 Code Review

Durante la review:

- Sii costruttivo e rispettoso
- Focalizzati sul codice, non sulla persona
- Suggerisci miglioramenti con esempi
- Approva quando il codice soddisfa gli standard

## 📜 Commit Message Guidelines

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat` - Nuova feature
- `fix` - Bug fix
- `docs` - Documentazione
- `style` - Formattazione
- `refactor` - Refactoring
- `test` - Test
- `chore` - Manutenzione

### Esempi

```bash
feat(button): add gradient variant

Add new gradient variant with animated background.
Includes hover effects and accessibility improvements.

Closes #123
```

```bash
fix(api): handle network errors correctly

Add proper error handling for network failures.
Includes retry logic with exponential backoff.
```

## 🎯 Priority Labels

- `priority: critical` - Fix immediato richiesto
- `priority: high` - Da fare presto
- `priority: medium` - Importante ma non urgente
- `priority: low` - Nice to have

## 💬 Comunicazione

- Usa GitHub Issues per bug e feature requests
- Usa Discussions per domande generali
- Sii rispettoso e professionale
- Chiedi aiuto quando serve!

## 🚀 Release Process

1. Update version in package.json
2. Update CHANGELOG.md
3. Create release branch
4. Test thoroughly
5. Merge to main
6. Create GitHub release with tag

---

Grazie per contribuire! 🙏
