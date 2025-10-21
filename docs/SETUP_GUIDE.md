# 🚀 Setup Guide - Interactive Project Configuration

Questa guida spiega come usare il **Setup Wizard interattivo** per configurare rapidamente un nuovo progetto basato su questo template.

## 📋 Indice

- [Quick Start](#quick-start)
- [Setup Wizard](#setup-wizard)
- [Project Questionnaire](#project-questionnaire)
- [Generate Overview](#generate-overview)
- [Workflow Completo](#workflow-completo)

---

## Quick Start

```bash
# 1. Clone il template
git clone <template-url> my-new-app
cd my-new-app

# 2. Esegui setup wizard (IMPORTANTE!)
npm run setup

# 3. Installa dipendenze
npm install

# 4. Configura backend environment
cp apps/backend/.env.example apps/backend/.env
# Edita .env con i tuoi valori

# 5. Avvia sviluppo
npm run dev
```

**Fatto!** Il tuo progetto è configurato e pronto. ✨

---

## Setup Wizard

### Cosa Fa

Il comando `npm run setup` avvia un wizard interattivo che:

1. ✅ **Raccoglie informazioni** sul progetto
2. ✅ **Personalizza automaticamente**:
   - package.json (root, frontend, backend)
   - README.md
   - .env.example files
   - App.tsx (opzionale)
3. ✅ **Rimuove componenti esempio** (opzionale)
4. ✅ **Inizializza Git** (opzionale)
5. ✅ **Crea overview document** iniziale

### Esecuzione

```bash
npm run setup
```

### Domande del Wizard

Il wizard ti chiederà:

#### Informazioni Progetto
- **Nome progetto** (es: `my-awesome-app`)
  - Solo minuscole, numeri e trattini
  - Usato in package.json e URL
- **Descrizione** (breve, 1 linea)
- **Tuo nome**
- **Email**
- **Repository Git** (opzionale)

#### Tipo Progetto
Scegli tra:
1. Dashboard / Admin Panel
2. Landing Page / Marketing Site
3. E-commerce / Shop
4. Blog / Content Site
5. SaaS Application
6. Portfolio
7. Altro

#### Opzioni
- **Rimuovere componenti esempio?**
  - `y` = Rimuove Hero, AnimatedCard e pulisce App.tsx
  - `n` = Mantiene tutto come riferimento
- **Inizializzare Git?**
  - `y` = Crea nuovo repo, commit iniziale
  - `n` = Mantiene git esistente o nessun git

### Output

Dopo l'esecuzione, il wizard:

✅ Aggiorna tutti i file necessari
✅ Crea `docs/OVERVIEW.md` iniziale
✅ Backup README originale in `TEMPLATE_ORIGINAL_README.md`
✅ Mostra summary con next steps

### Esempio Sessione

```
🚀 Web App Template Setup Wizard 🚀

👋 Benvenuto! Ti guiderò nella configurazione del tuo progetto.

📋 Informazioni Progetto

Nome progetto (es: my-awesome-app): fitness-tracker
Descrizione (breve): Track your fitness goals and workouts
Tuo nome: Mario Rossi
Tua email: mario@example.com
URL repository Git: https://github.com/mario/fitness-tracker

🎯 Tipo di Progetto

1. Dashboard / Admin Panel
2. Landing Page / Marketing Site
3. SaaS Application
...

Scegli tipo (1-7): 5

⚙️  Opzioni

Rimuovere componenti esempio? (y/n): y
Inizializzare nuovo repository Git? (y/n): y

🔧 Configuring project...

✅ Updated package.json
✅ Updated apps/frontend/package.json
✅ Updated apps/backend/package.json
✅ Updated README.md
✅ Updated apps/frontend/.env.example
✅ Updated App.tsx
✅ Created docs/OVERVIEW.md
🗑️  Removed Hero.tsx
🗑️  Removed AnimatedCard.tsx
✅ Git initialized
✅ Initial commit created

✅ Setup Complete!

🎯 Next Steps:
  1. Review and update docs/OVERVIEW.md
  2. Complete docs/PROJECT_QUESTIONNAIRE.md
  3. Install dependencies: npm install
  4. Configure apps/backend/.env
  5. Start development: npm run dev
```

---

## Project Questionnaire

### Cos'è

Un **questionario dettagliato** (44 domande) che raccoglie tutte le informazioni necessarie per definire completamente il progetto.

### Perché Usarlo

- 📋 **Documentazione completa** del progetto
- 🤖 **Claude AI** userà queste info per assisterti meglio
- 👥 **Allineamento team** su goals e features
- 🎯 **Clarità** su scope e priorità
- 📊 **Decision record** per future reference

### Come Usarlo

1. **Copia il template:**
   ```bash
   cp docs/templates/PROJECT_QUESTIONNAIRE.md docs/PROJECT_QUESTIONNAIRE.md
   ```

2. **Compila il questionario:**
   - Apri `docs/PROJECT_QUESTIONNAIRE.md`
   - Rispondi a tutte le domande
   - Sii specifico e dettagliato
   - Salta solo ciò che non è applicabile

3. **Salva e condividi:**
   - Commit nel repository
   - Condividi con team/stakeholders
   - Review e iterazione

### Sezioni del Questionario

Il questionario copre:

1. **Informazioni Base** - Nome, tipo, tagline
2. **Obiettivi e Scopo** - Problema, goals, metriche
3. **Target Audience** - User profiles, dimensione
4. **Features & Funzionalità** - MVP, future, auth
5. **Design & UX** - Stile, colori, animazioni
6. **User Flow** - Navigazione, journey
7. **Dati & Backend** - Database, API, storage
8. **Devices & Platforms** - Desktop, mobile, PWA
9. **Integrazioni** - Servizi terzi, payment
10. **Performance & Scalability** - Load time, volumi
11. **Security & Compliance** - GDPR, privacy
12. **Analytics & Tracking** - Metriche, tools
13. **Business Model** - Monetizzazione, pricing
14. **Timeline & Resources** - Lancio, team
15. **Success Criteria** - Definition of done

### Tempo Richiesto

- **Quick pass:** 15-20 minuti (risposte base)
- **Detailed:** 45-60 minuti (risposte complete)
- **Comprehensive:** 2-3 ore (con team, discussion)

---

## Generate Overview

### Cos'è

Uno script interattivo che genera un **documento overview professionale** basato sulle risposte del questionario.

### Esecuzione

```bash
npm run generate-overview
```

### Funzionamento

Lo script:
1. 📝 Chiede le info principali in modo interattivo
2. 🔧 Genera un documento strutturato
3. 💾 Salva in `docs/PROJECT_OVERVIEW.md`
4. ✅ Formatta secondo best practices

### Domande (Versione Rapida)

Lo script chiede:
- Nome progetto
- Tagline
- Tipo progetto
- Problema risolto
- 3 obiettivi principali
- User profile
- 3 features MVP
- Stile visivo
- Colore primario
- Dark mode
- Livello animazioni
- Auth necessaria
- Tipo database
- Device primario
- Data lancio
- Team size

### Output

Il documento generato include:

- Executive summary
- Project goals
- Target users
- Features (MVP + future)
- Design & UX guidelines
- Technical architecture
- Platforms & devices
- User flows
- Deployment plan
- Success metrics
- Roadmap
- Team info
- Next steps

### Quando Usarlo

**Opzione A: Dopo Setup Wizard**
```bash
npm run setup      # Setup base
npm run generate-overview  # Overview dettagliato
```

**Opzione B: Durante Planning**
```bash
# Compila questionario prima
cp docs/templates/PROJECT_QUESTIONNAIRE.md docs/
# Poi genera overview
npm run generate-overview
```

**Opzione C: Iterativo**
```bash
# Genera overview iniziale
npm run generate-overview
# Poi completa/aggiorna manualmente
```

---

## Workflow Completo

### Scenario 1: Quick Start (Veloce)

```bash
# 1. Clone
git clone <template> my-app && cd my-app

# 2. Setup automatico
npm run setup

# 3. Install & run
npm install
npm run dev

# ⏱️ Tempo: 5 minuti
```

**Quando:** Vuoi iniziare subito a codare.

### Scenario 2: Standard (Raccomandato)

```bash
# 1. Clone
git clone <template> my-app && cd my-app

# 2. Setup interattivo
npm run setup

# 3. Generate overview
npm run generate-overview

# 4. Install
npm install

# 5. Configure
cp apps/backend/.env.example apps/backend/.env
# Edit .env

# 6. Dev
npm run dev

# ⏱️ Tempo: 15 minuti
```

**Quando:** Vuoi setup completo con documentazione.

### Scenario 3: Complete (Dettagliato)

```bash
# 1. Clone
git clone <template> my-app && cd my-app

# 2. Setup wizard
npm run setup

# 3. Compila questionario
cp docs/templates/PROJECT_QUESTIONNAIRE.md docs/
# Compila tutte le risposte (45-60 min)

# 4. Generate overview
npm run generate-overview

# 5. Review docs
# - docs/PROJECT_QUESTIONNAIRE.md
# - docs/PROJECT_OVERVIEW.md

# 6. Share con team per feedback

# 7. Install & configure
npm install
cp apps/backend/.env.example apps/backend/.env

# 8. Start coding
npm run dev

# ⏱️ Tempo: 1-2 ore (ma hai documentazione completa!)
```

**Quando:** Progetto serio con team, vuoi documentazione completa da condividere.

### Scenario 4: Con Claude AI

```bash
# 1-4. Come Scenario 3

# 5. Quando chiedi aiuto a Claude:
"Leggi docs/PROJECT_OVERVIEW.md e docs/PROJECT_QUESTIONNAIRE.md,
 poi aiutami a implementare [feature X]"

# Claude avrà tutto il contesto necessario! 🤖
```

**Quando:** Vuoi massima efficacia dall'assistenza AI.

---

## Best Practices

### ✅ DO

- ✅ **Esegui `npm run setup` subito** dopo clone
- ✅ **Compila questionario** prima di iniziare sviluppo
- ✅ **Condividi docs** con team per allineamento
- ✅ **Aggiorna overview** man mano che progetto evolve
- ✅ **Usa docs come reference** durante sviluppo
- ✅ **Commit docs** nel repository

### ❌ DON'T

- ❌ Saltare setup wizard (personalizzazione importante!)
- ❌ Lasciare questionario vuoto (spreco opportunità)
- ❌ Ignorare overview generato (è la tua roadmap!)
- ❌ Setup senza review dei docs
- ❌ Dimenticare di aggiornare docs durante sviluppo

---

## Troubleshooting

### Setup script fails

**Soluzione:**
```bash
# Assicurati Node >= 20
node -v

# Dai permessi esecuzione
chmod +x scripts/setup-new-project.js

# Esegui direttamente
node scripts/setup-new-project.js
```

### Overview non generato

**Soluzione:**
```bash
# Crea directory docs se non esiste
mkdir -p docs

# Esegui script
node scripts/generate-overview.js
```

### Git init fails

**Soluzione:**
```bash
# Rimuovi .git esistente
rm -rf .git

# Ri-esegui setup
npm run setup
```

---

## File Generati

Dopo setup completo avrai:

```
my-app/
├── docs/
│   ├── OVERVIEW.md                    # Generated overview
│   ├── PROJECT_OVERVIEW.md            # Detailed from generate-overview
│   ├── PROJECT_QUESTIONNAIRE.md       # Your completed answers
│   └── templates/
│       └── PROJECT_QUESTIONNAIRE.md   # Template (don't edit)
├── TEMPLATE_ORIGINAL_README.md        # Backup del README template
├── README.md                          # Tuo README customizzato
├── package.json                       # Con tuo nome/descrizione
├── apps/frontend/package.json         # Customizzato
├── apps/backend/package.json          # Customizzato
└── .git/                              # Fresh repo (se hai scelto y)
```

---

## Next Steps Dopo Setup

1. ✅ **Review documentation**
   - Leggi docs/PROJECT_OVERVIEW.md
   - Verifica che tutto sia corretto

2. ✅ **Configure environment**
   ```bash
   cp apps/backend/.env.example apps/backend/.env
   # Edit with your values
   ```

3. ✅ **Install dependencies**
   ```bash
   npm install
   ```

4. ✅ **Start development**
   ```bash
   npm run dev
   ```

5. ✅ **Explore Storybook**
   ```bash
   npm run storybook
   ```

6. ✅ **Start building!**
   - Segui roadmap in docs/PROJECT_OVERVIEW.md
   - Usa docs come reference
   - Chiedi a Claude usando il context dei docs

---

🎉 **Il tuo progetto è configurato e pronto!**

Per domande o problemi, consulta la documentazione completa o apri una issue.
