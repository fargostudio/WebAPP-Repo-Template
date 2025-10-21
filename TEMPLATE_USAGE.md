# 📋 Come Usare Questo Template

Questa guida spiega come usare questo repository come base per nuove web app.

## 🎯 Scopo di Questo Repository

Questo NON è un progetto da sviluppare direttamente. È un **template** da clonare ogni volta che vuoi iniziare una nuova web app con:

- ✨ Design moderno e animazioni
- ⚛️ React + TypeScript + Vite
- 🎨 Tailwind CSS con design system
- 🚀 Node.js backend
- 🐳 Docker ready
- 🔄 CI/CD configurato
- 📚 Storybook per componenti

## 🚀 Iniziare un Nuovo Progetto

### Metodo 1: GitHub Template (Raccomandato)

Se questo repo è configurato come template su GitHub:

1. Vai su GitHub e clicca **"Use this template"**
2. Scegli nome per il nuovo progetto
3. Clona il nuovo repository
4. Segui [QUICKSTART.md](./QUICKSTART.md)

### Metodo 2: Clone Manuale

```bash
# 1. Clona il template
git clone <questo-repo-url> my-new-app
cd my-new-app

# 2. Rimuovi il remote originale
git remote remove origin

# 3. Crea nuovo repository su GitHub/GitLab

# 4. Aggiungi nuovo remote
git remote add origin <tuo-nuovo-repo-url>

# 5. Push
git push -u origin main

# 6. Installa dipendenze
npm install

# 7. Setup
npm run prepare
cp apps/backend/.env.example apps/backend/.env

# 8. Inizia a sviluppare!
npm run dev
```

## 📝 Personalizzazione Iniziale

Dopo aver clonato il template, personalizza questi file:

### 1. Package.json (Root e Apps)

```json
{
  "name": "my-app-name",  // Cambia qui
  "version": "1.0.0",
  "description": "My awesome app description"  // Cambia qui
}
```

Aggiorna anche in:
- `apps/frontend/package.json`
- `apps/backend/package.json`

### 2. README.md

Sostituisci il contenuto del README con la descrizione del tuo progetto:

```markdown
# My Awesome App

Description of your app...

## Features
- Feature 1
- Feature 2

## Setup
See [QUICKSTART.md](./QUICKSTART.md)
```

### 3. index.html

```html
<!-- apps/frontend/index.html -->
<title>My App Name</title>
<meta name="description" content="My app description" />
```

### 4. Environment Variables

```bash
# apps/backend/.env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Aggiungi le tue variabili
DATABASE_URL=...
JWT_SECRET=...
API_KEY=...
```

### 5. Design Tokens (Opzionale)

Se vuoi un tema custom, modifica i colori:

```css
/* apps/frontend/src/styles/globals.css */

:root {
  --primary: 221.2 83.2% 53.3%;  /* Il tuo colore primario */
  --secondary: 210 40% 96.1%;    /* Il tuo colore secondario */
  /* ... */
}
```

Usa [uicolors.app](https://uicolors.app) per generare palette HSL.

### 6. Favicon e Assets

Sostituisci:
- `apps/frontend/public/vite.svg` con il tuo logo
- Aggiungi favicon
- Aggiungi altri asset in `apps/frontend/src/assets/`

## 🗑️ Cosa Rimuovere

### File di Esempio (Opzionale)

Questi componenti sono esempi e possono essere rimossi o modificati:

```bash
# Componenti esempio (puoi rimuovere o usare come riferimento)
apps/frontend/src/components/Hero.tsx
apps/frontend/src/components/AnimatedCard.tsx
apps/frontend/src/App.tsx  # Sostituisci con la tua app

# Route backend esempio
apps/backend/src/routes/api.ts  # Sostituisci con le tue route
```

### ⚠️ Cosa NON Rimuovere

**NON rimuovere**:
- `.claude/` directory - Necessaria per assistenza Claude AI
- `.husky/` directory - Git hooks
- `.github/workflows/` - CI/CD
- File di configurazione (tsconfig, vite.config, etc.)
- `apps/frontend/src/lib/utils.ts` - Utilities utili
- `apps/frontend/src/components/Button.tsx` - Componente base utile
- `apps/backend/src/middleware/errorHandler.ts` - Error handling
- `apps/backend/src/utils/logger.ts` - Logging

## 🎨 Workflow di Sviluppo

### 1. Design System First

Quando aggiungi nuove features:

1. **Definisci il design** in Storybook prima
2. **Crea componenti** isolati
3. **Testa varianti** e stati
4. **Integra nell'app**

```bash
# Sviluppa in Storybook
npm run storybook

# Test nell'app
npm run dev
```

### 2. Component-Driven Development

```
1. Design → Storybook story
2. Implement → Component
3. Test → Varianti in Storybook
4. Integrate → Use in App
5. Document → Update stories
```

### 3. API-First Backend

```
1. Define schema → Zod validation
2. Create route → Express route
3. Test → Curl/Postman
4. Integrate → Frontend API client
5. Document → API docs
```

## 🤖 Lavorare con Claude AI

### Claude ha accesso a `.claude/template-guide.md`

Quando chiedi aiuto a Claude:

```
❌ "Come è strutturato questo progetto?"
    Claude dovrà esplorare tutto

✅ "Leggi .claude/template-guide.md poi aiutami ad aggiungere [feature]"
    Claude userà la guida per essere più efficace

✅ "Voglio aggiungere autenticazione seguendo i pattern del template"
    Claude seguirà automaticamente i pattern documentati
```

### Esempi di Richieste Efficaci

```
"Aggiungi un componente Card seguendo il pattern del template"
→ Claude creerà componente + story con CVA e animazioni

"Crea una API per gestire users"
→ Claude creerà route + validation + error handling

"Setup database PostgreSQL con Prisma"
→ Claude seguirà il pattern raccomandato nel template

"Fix questo bug mantenendo le convenzioni del template"
→ Claude rispetterà naming, structure, patterns
```

## 📚 Documentazione di Riferimento

Quando sviluppi, consulta:

- **[QUICKSTART.md](./QUICKSTART.md)** - Setup e primi passi
- **[README.md](./README.md)** - Documentazione completa
- **[WORKFLOW.md](./WORKFLOW.md)** - Git workflow dettagliato
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Best practices
- **[.claude/template-guide.md](./.claude/template-guide.md)** - Guida tecnica completa

## 🔄 Aggiornare dal Template

Se il template riceve updates che vuoi nel tuo progetto:

```bash
# 1. Aggiungi template come remote
git remote add template <template-repo-url>

# 2. Fetch updates
git fetch template

# 3. Merge specific changes (attento ai conflitti!)
git cherry-pick <commit-hash>

# Oppure merge tutto (sconsigliato se hai modifiche significative)
git merge template/main
```

## ✅ Checklist Nuovo Progetto

Quando inizi un nuovo progetto da questo template:

- [ ] Clonato repository
- [ ] Cambiato nome in package.json (root + apps)
- [ ] Aggiornato README.md
- [ ] Personalizzato index.html title
- [ ] Configurato .env variabili
- [ ] Installato dependencies (`npm install`)
- [ ] Setup git hooks (`npm run prepare`)
- [ ] Testato dev environment (`npm run dev`)
- [ ] Verificato Storybook (`npm run storybook`)
- [ ] Personalizzato design tokens (opzionale)
- [ ] Sostituito favicon/logo (opzionale)
- [ ] Rimosso componenti esempio (opzionale)
- [ ] Primo commit nel nuovo repository

## 🎯 Best Practices

### Mantieni le Convenzioni

Anche nel tuo nuovo progetto, mantieni:

- ✅ Conventional Commits
- ✅ Design tokens invece di colori hardcoded
- ✅ TypeScript strict mode
- ✅ Component stories in Storybook
- ✅ Zod validation per API
- ✅ Error handling con ApiError
- ✅ Path aliases (@/, @components/, etc.)

### Evolvi il Template

Se scopri pattern migliori nel tuo progetto:

1. **Considera** se migliorerebbero il template base
2. **Documenta** in `.claude/template-guide.md`
3. **Contribuisci** al template originale (vedi CONTRIBUTING.md)

## 🆘 Problemi Comuni

### "Non so da dove iniziare"

→ Segui [QUICKSTART.md](./QUICKSTART.md) passo per passo

### "Voglio cambiare completamente il design"

→ Modifica i design tokens in `globals.css`, i componenti si adatteranno

### "Ho bisogno di feature X"

→ Chiedi a Claude leggendo prima `.claude/template-guide.md`

### "Troppi file, cosa mi serve davvero?"

→ Tutto! Ogni file ha uno scopo. Leggi commenti e documentazione.

### "Posso usare Vue/Angular invece di React?"

→ Questo template è ottimizzato per React. Per altri framework, crea un nuovo template.

## 💡 Tips Finali

1. **Non reinventare la ruota** - Usa i componenti e pattern già definiti
2. **Sviluppa in Storybook** - Isola i componenti per sviluppo più veloce
3. **Segui le convenzioni** - Consistenza = manutenibilità
4. **Documenta** - Aggiorna README man mano che l'app cresce
5. **Chiedi a Claude** - Ha accesso alla guida completa del template

---

**Buon sviluppo con il template! 🚀**

Se hai domande sul template stesso (non sul tuo progetto specifico), apri una issue nel repository del template.
