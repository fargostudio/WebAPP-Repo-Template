# 🔧 Template Maintenance Guide

Guida completa per mantenere il template aggiornato con le ultime versioni stabili delle dipendenze.

## 📋 Indice

- [Strategia di Aggiornamento](#strategia-di-aggiornamento)
- [Automazione con Dependabot](#automazione-con-dependabot)
- [Aggiornamenti Manuali](#aggiornamenti-manuali)
- [GitHub Actions Workflows](#github-actions-workflows)
- [Testing Dopo Update](#testing-dopo-update)
- [Aggiornare Progetti Derivati](#aggiornare-progetti-derivati)
- [Troubleshooting](#troubleshooting)

---

## Strategia di Aggiornamento

### Filosofia

**Il template deve essere sempre aggiornato ma stabile:**

1. ✅ **Patch updates** - Automatici (bug fixes)
2. ✅ **Minor updates** - Semi-automatici (new features, backward compatible)
3. ⚠️ **Major updates** - Manuali con testing approfondito (breaking changes)

### Frequenza

- **Dependabot**: Controlla automaticamente ogni **lunedì**
- **Manual check**: Ogni **2-4 settimane** per major updates
- **Security updates**: **Immediatamente** quando notificati

### Priorità

1. 🔴 **Critical** - Security vulnerabilities (immediate)
2. 🟡 **High** - Major libraries (React, Vite, Express)
3. 🟢 **Medium** - UI libraries, dev tools
4. ⚪ **Low** - Minor utilities

---

## Automazione con Dependabot

### Cosa Fa Dependabot

Dependabot è configurato in `.github/dependabot.yml` e:

- ✅ Controlla aggiornamenti **ogni lunedì alle 9:00**
- ✅ Crea **PR automatiche** per dependency updates
- ✅ Raggruppa updates per **tipo** (react, express, storybook, etc.)
- ✅ Separa **major** da **minor/patch** updates
- ✅ Controlla **Docker base images** e **GitHub Actions**

### Pull Request Automatiche

Dependabot crea PR con titoli come:

```
chore(deps-frontend): bump react from 18.2.0 to 18.3.0
chore(deps-backend): bump express from 4.18.3 to 4.19.0
chore(deps): bump development-dependencies group
```

### Review Process

Quando ricevi una PR di Dependabot:

1. **Controlla i cambiamenti**
   ```bash
   gh pr checkout <PR-number>
   npm install
   ```

2. **Testa localmente**
   ```bash
   npm run lint
   npm run build
   npm run test
   npm run dev
   ```

3. **Controlla breaking changes**
   - Leggi CHANGELOG del package aggiornato
   - Cerca "BREAKING CHANGE" o "Breaking:"

4. **Approva o richiedi modifiche**
   - ✅ Se tutto ok: Merge
   - ⚠️ Se problemi: Richiedi modifiche o chiudi

### Auto-Merge (Opzionale)

Per patch updates puoi abilitare auto-merge:

```bash
# Per una specifica PR
gh pr merge <PR-number> --auto --squash

# Configurare auto-merge rule in GitHub Settings > Branches
# Per PR con label "dependencies" e "automated" che passano i check
```

### Configurazione Personalizzata

Modifica `.github/dependabot.yml`:

```yaml
# Cambia frequenza
schedule:
  interval: "daily"  # o "weekly", "monthly"

# Cambia giorno/ora
schedule:
  interval: "weekly"
  day: "tuesday"
  time: "14:00"

# Più/meno PR contemporanee
open-pull-requests-limit: 10

# Target version strategy
versioning-strategy: increase  # o "widen", "increase-if-necessary"
```

---

## Aggiornamenti Manuali

### Check per Updates

Verifica aggiornamenti disponibili:

```bash
# Check tutti i workspace
npm run check-updates

# Output mostra:
# - Versione corrente
# - Versione latest
# - Tipo di update (major, minor, patch)
```

### Update Interattivo (Raccomandato)

```bash
npm run update-deps
```

Questo script:
1. Mostra tutti gli aggiornamenti disponibili
2. Ti chiede quali vuoi aggiornare
3. Raggruppa per tipo (react ecosystem, build tools, etc.)
4. Installa le nuove versioni
5. Crea backup di package-lock.json

**Esempio output:**
```
? Choose which packages to update:
❯ ◯ react  18.2.0 → 18.3.0  (minor)
  ◯ vite   5.1.0 → 5.2.0   (minor)
  ◯ express 4.18.3 → 5.0.0 (major) ⚠️
```

### Update Solo Minor/Patch

Aggiorna solo versioni compatibili:

```bash
npm run update-deps:minor
```

- ✅ Minor: 1.2.0 → 1.3.0
- ✅ Patch: 1.2.0 → 1.2.1
- ❌ Major: 1.2.0 → 2.0.0 (ignorato)

### Update a Latest (Attenzione!)

Aggiorna tutto alle ultime versioni:

```bash
npm run update-deps:latest
```

⚠️ **ATTENZIONE**: Può includere breaking changes!

Solo dopo:
- Aver letto CHANGELOG di tutti i package major
- Essere pronto a fixare breaking changes
- Avere tempo per testing approfondito

### Update Specifici

Per aggiornare singoli package:

```bash
# Root
npm update <package-name>

# Frontend
npm update <package-name> --workspace=frontend

# Backend
npm update <package-name> --workspace=backend
```

---

## GitHub Actions Workflows

### Dependency Review (Automatico)

File: `.github/workflows/dependency-review.yml`

**Trigger**: Ogni PR

**Funzionalità**:
- ✅ Analizza nuove dipendenze
- ✅ Controlla vulnerabilità di sicurezza
- ✅ Verifica licenze
- ✅ Commenta su PR con report

**Configurabile**:
```yaml
fail-on-severity: moderate  # critical, high, moderate, low
deny-licenses: GPL-3.0, AGPL-3.0  # Licenze da bloccare
```

### Update Dependencies (Manuale/Scheduled)

File: `.github/workflows/update-dependencies.yml`

**Trigger**:
- Manuale (workflow_dispatch)
- Scheduled: Ogni lunedì alle 9:00

**Funzionalità**:
1. Controlla aggiornamenti disponibili
2. Crea branch `automated-dependency-updates-YYYYMMDD`
3. Aggiorna dipendenze (mode: minor o latest)
4. Esegue lint e build
5. Crea PR se ci sono modifiche

**Esecuzione manuale**:

Via GitHub UI:
1. Vai su Actions
2. Seleziona "Update Dependencies"
3. Click "Run workflow"
4. Scegli mode: `minor` o `latest`

Via CLI:
```bash
gh workflow run update-dependencies.yml -f update_mode=minor
```

**Review della PR**:

La PR automatica include:
- Checklist di verifica
- Comandi per testing
- Link ai CHANGELOG

Segui la checklist prima di mergeare!

---

## Testing Dopo Update

### Checklist Completa

Dopo ogni aggiornamento, segui questo processo:

#### 1. Installazione

```bash
# Rimuovi node_modules per fresh install
rm -rf node_modules apps/*/node_modules
rm package-lock.json apps/*/package-lock.json

# Install
npm install
```

#### 2. Linting

```bash
npm run lint

# Se errori, fix manualmente o:
npm run format
```

#### 3. Type Checking

```bash
# Frontend
cd apps/frontend
npx tsc --noEmit

# Backend
cd apps/backend
npx tsc --noEmit
```

#### 4. Build

```bash
npm run build

# Se fallisce, controlla error logs
# Possibili breaking changes
```

#### 5. Tests

```bash
npm run test

# Se hai test configurati
```

#### 6. Dev Server

```bash
npm run dev

# Verifica:
# - Frontend si avvia (port 3000)
# - Backend si avvia (port 5000)
# - No console errors
# - API calls funzionano
```

#### 7. Storybook

```bash
npm run storybook

# Verifica:
# - Storybook si avvia (port 6006)
# - Componenti si renderizzano
# - Nessun warning/error
# - Dark mode funziona
```

#### 8. Docker

```bash
docker-compose up --build

# Verifica:
# - Build succeed
# - Containers avviano
# - App funziona in container
```

#### 9. Manual Testing

Testa funzionalità critiche:
- [ ] Navigation
- [ ] Animazioni
- [ ] Responsive design
- [ ] Dark mode toggle
- [ ] API calls
- [ ] Error handling

### Common Issues

#### Build Failures

```bash
# Clear caches
rm -rf node_modules/.cache
rm -rf apps/frontend/node_modules/.vite
rm -rf apps/frontend/dist
rm -rf apps/backend/dist

# Rebuild
npm run build
```

#### Type Errors

Controlla se ci sono **breaking changes** nelle type definitions:

```bash
# Cerca package con breaking changes
git diff package.json
```

Leggi CHANGELOG del package e aggiorna codice.

#### Runtime Errors

1. Controlla console browser/terminal
2. Cerca deprecation warnings
3. Controlla se API è cambiata
4. Consulta migration guide del package

---

## Aggiornare Progetti Derivati

Se hai già clonato questo template per progetti, puoi aggiornare le dipendenze:

### Metodo 1: Manuale (Raccomandato)

Nel tuo progetto derivato:

```bash
# 1. Check updates
npm run check-updates

# 2. Update interattivo
npm run update-deps

# 3. Test approfondito
npm run lint
npm run build
npm run test
npm run dev

# 4. Commit
git add .
git commit -m "chore(deps): update dependencies"
```

### Metodo 2: Sync dal Template

Se vuoi portare gli aggiornamenti dal template:

```bash
# Nel tuo progetto
cd my-project

# Aggiungi template come remote (una volta sola)
git remote add template <template-repo-url>

# Fetch latest
git fetch template

# Merge specifici file (package.json)
git checkout template/main -- package.json
git checkout template/main -- apps/frontend/package.json
git checkout template/main -- apps/backend/package.json

# Install
npm install

# Test
npm run dev

# Commit
git add .
git commit -m "chore(deps): sync dependencies from template"
```

### Metodo 3: Cherry-Pick Commits

Se il template ha commit specifici di update:

```bash
# Fetch dal template
git fetch template

# Trova commit di update
git log template/main --oneline | grep "chore(deps)"

# Cherry-pick specifici commit
git cherry-pick <commit-hash>

# Risolvi conflitti se presenti
# Test e commit
```

---

## Troubleshooting

### Dependabot Non Crea PR

**Causa**: Configurazione o permissions

**Fix**:
1. Verifica `.github/dependabot.yml` sintassi
2. Check Settings > Security > Dependabot > Enable
3. Verifica permissions in Settings > Actions

### Script Falliscono

**Causa**: npm-check-updates non installato

**Fix**:
```bash
npm install -g npm-check-updates
```

### Workflow Non Esegue

**Causa**: Permissions insufficienti

**Fix**:
1. Settings > Actions > General
2. Workflow permissions > Read and write permissions
3. Save

### Conflitti dopo Update

**Causa**: Breaking changes

**Fix**:
1. Leggi CHANGELOG del package
2. Cerca migration guide
3. Aggiorna codice di conseguenza
4. Considera rollback se troppo complesso:
   ```bash
   cp package-lock.json.backup package-lock.json
   npm install
   ```

### Security Vulnerabilities

**Causa**: Package con vulnerabilità

**Fix**:
```bash
# Audit
npm audit

# Fix automatico se possibile
npm audit fix

# Fix anche breaking changes (attenzione!)
npm audit fix --force

# Manualmente
# Update il package specifico a versione sicura
```

---

## Best Practices

### ✅ DO

- ✅ Testa sempre dopo update
- ✅ Leggi CHANGELOG per major updates
- ✅ Update regolarmente (ogni 2-4 settimane)
- ✅ Fai commit separati per dependency updates
- ✅ Usa Conventional Commits: `chore(deps): ...`
- ✅ Crea backup prima di update major
- ✅ Review Dependabot PR prima di merge

### ❌ DON'T

- ❌ Non ignorare security updates
- ❌ Non update tutto a latest senza testing
- ❌ Non merge PR Dependabot senza review
- ❌ Non skip testing dopo update
- ❌ Non aggiornare in produzione senza staging test
- ❌ Non ignorare deprecation warnings

---

## Comandi Quick Reference

```bash
# Check updates disponibili
npm run check-updates

# Update interattivo
npm run update-deps

# Update solo minor/patch
npm run update-deps:minor

# Update to latest (attenzione!)
npm run update-deps:latest

# Check security vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# GitHub workflow manual trigger
gh workflow run update-dependencies.yml -f update_mode=minor
```

---

## Cadenza Suggerita

### Settimanale
- ✅ Review PR Dependabot
- ✅ Merge patch updates

### Bi-settimanale
- ✅ `npm run check-updates`
- ✅ Update minor versions
- ✅ Test completo

### Mensile
- ⚠️ Review major updates
- ⚠️ Leggi CHANGELOG
- ⚠️ Update se non breaking o gestibili
- ⚠️ Test approfondito

### Immediato
- 🔴 Security vulnerabilities
- 🔴 Critical bugs in dependencies

---

**Mantenere il template aggiornato garantisce sicurezza, stabilità e accesso alle ultime features! 🚀**
