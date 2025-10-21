# 🔄 Git Workflow Guide

Guida completa al workflow Git per questo progetto.

## 📋 Indice

- [Overview](#overview)
- [Branching Strategy](#branching-strategy)
- [Workflow Sviluppo](#workflow-sviluppo)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Code Review](#code-review)
- [Release Process](#release-process)

## Overview

Questo progetto utilizza **GitHub Flow**, una strategia di branching semplice ed efficace che promuove:

- Deploy frequenti
- Integrazioni continue
- Code review obbligatorie
- Main branch sempre deployable

## Branching Strategy

### Main Branch

```
main (production-ready)
```

- **Sempre deployable** in produzione
- Protetto da push diretti
- Richiede Pull Request approvate
- CI/CD automatico su merge

### Feature Branches

Tutti i lavori di sviluppo avvengono su branch dedicati:

```
main
  ├── feature/user-authentication
  ├── feature/dashboard-redesign
  ├── fix/login-validation
  ├── docs/api-documentation
  └── refactor/state-management
```

### Naming Convention

| Tipo | Pattern | Esempio |
|------|---------|---------|
| Feature | `feature/descrizione-breve` | `feature/dark-mode` |
| Bug Fix | `fix/descrizione-breve` | `fix/header-overflow` |
| Hotfix | `hotfix/descrizione-breve` | `hotfix/security-patch` |
| Docs | `docs/descrizione-breve` | `docs/setup-guide` |
| Refactor | `refactor/descrizione-breve` | `refactor/api-client` |
| Test | `test/descrizione-breve` | `test/e2e-checkout` |
| Chore | `chore/descrizione-breve` | `chore/update-deps` |

## Workflow Sviluppo

### 1. Sincronizza con Main

```bash
# Assicurati di avere l'ultima versione di main
git checkout main
git pull origin main
```

### 2. Crea Feature Branch

```bash
# Crea e passa al nuovo branch
git checkout -b feature/nome-feature

# Oppure
git switch -c feature/nome-feature
```

### 3. Sviluppa la Feature

```bash
# Fai modifiche al codice
# ...

# Verifica le modifiche
git status
git diff

# Aggiungi file allo stage
git add .

# Oppure aggiungi file specifici
git add path/to/file
```

### 4. Commit le Modifiche

```bash
# Commit con messaggio conventional
git commit -m "feat: descrizione della feature"

# Se il messaggio è lungo, usa l'editor
git commit
```

Il pre-commit hook eseguirà automaticamente:
- Linting del codice
- Formatting con Prettier
- Validazione messaggio commit

### 5. Push al Remote

```bash
# Prima push del branch
git push -u origin feature/nome-feature

# Push successivi
git push
```

### 6. Mantieni Aggiornato il Branch

```bash
# Opzione 1: Merge (preserva history)
git checkout feature/nome-feature
git merge main

# Opzione 2: Rebase (linear history - PREFERITO)
git checkout feature/nome-feature
git rebase main
```

**Quando usare rebase:**
- Branch personale non ancora in PR
- Vuoi mantenere history lineare
- Non ci sono conflitti complessi

**Quando usare merge:**
- Branch già in PR con review
- Collaborazione multipla sullo stesso branch
- Conflitti complessi

### 7. Apri Pull Request

Vai su GitHub e apri una Pull Request con:

**Titolo formato Conventional Commits:**
```
feat: aggiunge dark mode toggle
fix: corregge overflow su mobile
docs: aggiorna guida deployment
```

**Template PR:**
```markdown
## 📝 Descrizione

Breve descrizione delle modifiche e motivazione.

## 🎯 Tipo di Modifica

- [ ] Bug fix (non-breaking change)
- [ ] Nuova feature (non-breaking change)
- [ ] Breaking change (fix o feature che causa modifiche esistenti)
- [ ] Documentazione

## ✅ Checklist

- [ ] Il codice segue le guidelines del progetto
- [ ] Ho fatto self-review del codice
- [ ] Ho commentato codice complesso
- [ ] Ho aggiornato la documentazione
- [ ] Le modifiche non generano warning
- [ ] Ho aggiunto test che provano il fix/feature
- [ ] Test nuovi ed esistenti passano
- [ ] Ho testato su diversi browser (se UI)

## 📸 Screenshots/Video

<!-- Se applicabile, aggiungi screenshot o GIF -->

## 🔗 Issue/Task

Closes #123
Related to #456
```

## Commit Guidelines

### Conventional Commits Format

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

| Type | Descrizione | Esempio |
|------|-------------|---------|
| `feat` | Nuova funzionalità | `feat: add user profile page` |
| `fix` | Bug fix | `fix: resolve login redirect issue` |
| `docs` | Solo documentazione | `docs: update API documentation` |
| `style` | Formattazione, no logic | `style: format code with prettier` |
| `refactor` | Refactoring senza feature/fix | `refactor: simplify auth logic` |
| `perf` | Miglioramento performance | `perf: optimize image loading` |
| `test` | Aggiunta/modifica test | `test: add unit tests for auth` |
| `build` | Build system/deps | `build: update dependencies` |
| `ci` | CI/CD configuration | `ci: add deploy workflow` |
| `chore` | Altre modifiche | `chore: update .gitignore` |
| `revert` | Revert commit precedente | `revert: revert feat: add feature` |

### Scope (Opzionale)

Specifica l'area del progetto:

```bash
feat(auth): add password reset
fix(ui): correct button alignment
docs(api): update endpoints list
```

Common scopes:
- `frontend` / `backend`
- `ui` / `api`
- `auth` / `db` / `config`
- Nome componente specifico

### Description

- Usa imperativo presente ("add" non "added")
- Minuscolo, senza punto finale
- Max 100 caratteri
- Descrizione chiara e concisa

### Body (Opzionale)

```bash
feat: add email notifications

Implement email notification system with templates
for password reset, welcome email, and newsletters.
Uses nodemailer with SMTP configuration.
```

### Footer (Opzionale)

```bash
fix: resolve memory leak in websocket

BREAKING CHANGE: WebSocket API now requires authentication token

Closes #123
Refs #456
```

**Breaking Changes:**
```bash
feat: redesign API response format

BREAKING CHANGE: API responses now use camelCase instead of snake_case
```

### Esempi Completi

```bash
# Semplice feature
feat: add dark mode toggle

# Con scope
fix(button): correct hover animation timing

# Con body
refactor(api): simplify error handling

Consolidate error handling logic into middleware.
Remove duplicate try-catch blocks.
Improve error messages for debugging.

# Con breaking change
feat: update authentication flow

BREAKING CHANGE: JWT tokens now expire after 1 hour instead of 24 hours

Closes #234
```

## Pull Request Process

### 1. Pre-PR Checklist

Prima di aprire la PR, verifica:

```bash
# Lint
npm run lint

# Tests
npm run test

# Build
npm run build

# Format
npm run format
```

### 2. Apri la PR

- Usa il template PR
- Assegna reviewer appropriati
- Aggiungi labels pertinenti
- Linka issue correlate

### 3. CI/CD Checks

GitHub Actions eseguirà automaticamente:

```yaml
✓ Lint check
✓ Type check
✓ Unit tests
✓ Build verification
✓ Bundle size analysis
```

La PR può essere merged solo se tutti i check passano.

### 4. Code Review

- Richiedi review da almeno 1 persona
- Rispondi ai commenti costruttivamente
- Fai modifiche richieste
- Push le modifiche (non force push se in review)

### 5. Merge

Opzioni di merge:

**Squash and Merge** (PREFERITO)
- Combina tutti i commit in uno
- Mantiene history di main pulita
- Messaggio finale deve seguire Conventional Commits

**Rebase and Merge**
- Mantiene commit individuali
- Linear history
- Usa se i commit sono già ben organizzati

**Merge Commit**
- Preserva tutta la history
- Crea merge commit
- Usa raramente

### 6. Post-Merge

```bash
# Elimina branch locale
git branch -d feature/nome-feature

# Elimina branch remoto (se non auto-delete)
git push origin --delete feature/nome-feature

# Update main
git checkout main
git pull origin main
```

## Code Review

### Come Reviewer

**Do's:**
- ✅ Rivedi il codice entro 24h
- ✅ Fornisci feedback costruttivo
- ✅ Suggerisci alternative con esempi
- ✅ Approva quando gli standard sono rispettati
- ✅ Usa emoji per tono friendly (👍 💯 🎉)

**Don'ts:**
- ❌ Criticare la persona (solo il codice)
- ❌ Essere vago nei commenti
- ❌ Approvare senza leggere
- ❌ Bloccare su preferenze personali

**Commenti Utili:**

```markdown
<!-- Richiesta di modifica -->
🔴 **Must change**: Questo può causare memory leak
[suggerimento specifico con codice]

<!-- Suggerimento -->
💡 **Suggestion**: Potresti semplificare usando reduce
[esempio opzionale]

<!-- Domanda -->
❓ **Question**: Questo gestisce il caso edge X?

<!-- Apprezzamento -->
🎉 **Nice**: Ottima gestione degli errori!
```

### Come Autore

- Rispondi a tutti i commenti
- Non prendere critiche sul personale
- Chiedi chiarimenti se necessario
- Ringrazia per il feedback
- Marca conversazioni come risolte quando appropriate

## Release Process

### 1. Preparazione

```bash
# Create release branch
git checkout main
git pull origin main
git checkout -b release/v1.2.0
```

### 2. Version Bump

```bash
# Update version in package.json
npm version minor  # o major/patch

# Update CHANGELOG.md
# [documentare tutte le modifiche]
```

### 3. Testing

```bash
# Full test suite
npm run test

# Build verification
npm run build

# Manual testing
npm run dev
```

### 4. Create PR

```markdown
Title: Release v1.2.0

## Changes
- Feature 1
- Feature 2
- Bug fix 1

## Checklist
- [ ] Version bumped
- [ ] CHANGELOG updated
- [ ] All tests passing
- [ ] Documentation updated
```

### 5. Merge e Tag

```bash
# Dopo merge della PR
git checkout main
git pull origin main

# Create tag
git tag -a v1.2.0 -m "Release version 1.2.0"
git push origin v1.2.0
```

### 6. GitHub Release

Crea release su GitHub con:
- Tag version
- Release notes da CHANGELOG
- Built artifacts se necessario

## Hotfix Process

Per fix urgenti in produzione:

```bash
# Create hotfix branch da main
git checkout main
git pull origin main
git checkout -b hotfix/critical-bug

# Fix e test
# ...

# Fast-track PR
# Review veloce ma accurata
# Merge appena possibile

# Tag hotfix release
git tag -a v1.2.1 -m "Hotfix: critical bug"
```

## Best Practices

### Commit Frequency

- Commit piccoli e atomici
- Un commit = un cambiamento logico
- Commit frequentemente (salva il lavoro)
- Squash prima del merge se necessario

### Branch Lifetime

- Feature branch: max 1-2 settimane
- Branch longevi = più conflitti
- Merge o chiudi branch stale
- Delete branch dopo merge

### Sync Strategy

```bash
# Daily sync con main
git checkout main
git pull origin main
git checkout feature/my-feature
git rebase main

# Risolvi conflitti subito
# Non accumulare divergenze
```

### Gestione Conflitti

```bash
# Durante rebase
git rebase main

# Se ci sono conflitti:
# 1. Risolvi nei file
# 2. Stage i file risolti
git add .

# 3. Continua rebase
git rebase --continue

# Se troppo complicato:
git rebase --abort
# Usa merge invece
```

## Tips & Tricks

### Alias Utili

```bash
# Aggiungi a ~/.gitconfig
[alias]
  co = checkout
  br = branch
  ci = commit
  st = status
  unstage = reset HEAD --
  last = log -1 HEAD
  visual = log --graph --oneline --all
  amend = commit --amend --no-edit
```

### Template Commit

```bash
# .gitmessage
<type>(<scope>): <subject>
# |    |           |
# |    |           +-> Presente imperativo, max 100 char
# |    +-------------> Scope opzionale
# +-------------------> Type: feat|fix|docs|style|refactor|test|chore

# Body (opzionale)
# Spiega cosa e perché, non come

# Footer (opzionale)
# Closes #123
# BREAKING CHANGE: descrizione
```

Attiva con:
```bash
git config commit.template .gitmessage
```

### Stash Workflow

```bash
# Salva lavoro temporaneo
git stash

# Con messaggio
git stash save "WIP: feature X"

# Lista stash
git stash list

# Applica ultimo stash
git stash pop

# Applica stash specifico
git stash apply stash@{1}
```

---

**Happy coding! 🚀**

Per domande o suggerimenti sul workflow, apri una Discussion su GitHub.
