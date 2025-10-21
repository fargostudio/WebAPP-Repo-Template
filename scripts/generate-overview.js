#!/usr/bin/env node

/**
 * Generate Project Overview from Questionnaire
 *
 * This script helps you create a comprehensive project overview document
 * based on answers from the PROJECT_QUESTIONNAIRE.md
 *
 * Usage: npm run generate-overview
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function generateOverview() {
  console.clear();
  log('\n╔════════════════════════════════════════════════════════════╗', 'cyan');
  log('║         📝 Generate Project Overview from Answers         ║', 'cyan');
  log('╚════════════════════════════════════════════════════════════╝', 'cyan');

  log('\n👋 Questo script ti guiderà nella creazione di un overview completo.\n', 'bright');
  log('Rispondi alle domande o premi Enter per saltare.\n', 'yellow');

  const answers = {};

  // Basic Info
  log('\n📌 INFORMAZIONI BASE\n', 'blue');
  answers.projectName = await question('Nome progetto: ');
  answers.tagline = await question('Tagline (una frase): ');
  answers.projectType = await question('Tipo (es: SaaS, Dashboard, etc.): ');

  // Goals
  log('\n🎯 OBIETTIVI\n', 'blue');
  answers.mainProblem = await question('Problema principale risolto: ');
  answers.goal1 = await question('Obiettivo 1: ');
  answers.goal2 = await question('Obiettivo 2: ');
  answers.goal3 = await question('Obiettivo 3: ');

  // Users
  log('\n👥 TARGET AUDIENCE\n', 'blue');
  answers.userProfile1 = await question('Profilo utente principale: ');
  answers.userSize = await question('Dimensione user base prevista: ');

  // Features
  log('\n✨ FEATURES PRINCIPALI (MVP)\n', 'blue');
  answers.feature1 = await question('Feature 1: ');
  answers.feature2 = await question('Feature 2: ');
  answers.feature3 = await question('Feature 3: ');

  // Design
  log('\n🎨 DESIGN & UX\n', 'blue');
  answers.visualStyle = await question('Stile visivo (es: minimal, bold, elegant): ');
  answers.primaryColor = await question('Colore primario (hex): ');
  answers.darkMode = await question('Dark mode? (yes/no): ');
  answers.animations = await question('Livello animazioni (minimal/moderate/rich): ');

  // Tech
  log('\n🏗️ ARCHITETTURA\n', 'blue');
  answers.needsAuth = await question('Richiede autenticazione? (yes/no): ');
  answers.needsDB = await question('Tipo database (PostgreSQL/MongoDB/None): ');
  answers.apiType = await question('Tipo API (REST/GraphQL/None): ');

  // Platform
  log('\n📱 PLATFORM\n', 'blue');
  answers.primaryDevice = await question('Device primario (desktop/mobile/both): ');
  answers.isPWA = await question('PWA/Installabile? (yes/no): ');

  // Timeline
  log('\n📅 TIMELINE\n', 'blue');
  answers.launchDate = await question('Data lancio target: ');
  answers.teamSize = await question('Dimensione team: ');

  // Generate document
  log('\n\n🔧 Generando overview...\n', 'yellow');

  const overview = generateDocument(answers);
  const outputPath = path.join(process.cwd(), 'docs', 'PROJECT_OVERVIEW.md');

  fs.writeFileSync(outputPath, overview);

  log(`✅ Overview generato: ${outputPath}\n`, 'green');
  log('📝 Prossimi passi:', 'bright');
  log('  1. Review e completa il documento generato', 'cyan');
  log('  2. Condividi con il team per feedback', 'cyan');
  log('  3. Usa come reference durante lo sviluppo', 'cyan');
  log('  4. Aggiorna man mano che il progetto evolve\n', 'cyan');

  rl.close();
}

function generateDocument(answers) {
  const date = new Date().toLocaleDateString('it-IT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `# ${answers.projectName} - Project Overview

> ${answers.tagline}

**Generated:** ${date}
**Type:** ${answers.projectType}
**Status:** Planning / In Development

---

## 📋 Executive Summary

${answers.projectName} is a ${answers.projectType} that ${answers.mainProblem}.

**Target Launch:** ${answers.launchDate}
**Team Size:** ${answers.teamSize}

---

## 🎯 Project Goals

1. **${answers.goal1}**
2. **${answers.goal2}**
3. **${answers.goal3}**

### Problem Statement

${answers.mainProblem}

---

## 👥 Target Users

### Primary User Profile

${answers.userProfile1}

### User Base Size

Expected: ${answers.userSize}

---

## ✨ Features

### MVP (Phase 1)

#### ${answers.feature1}
**Priority:** Must Have
**Status:** [ ] Not Started [ ] In Progress [ ] Complete

#### ${answers.feature2}
**Priority:** Must Have
**Status:** [ ] Not Started [ ] In Progress [ ] Complete

#### ${answers.feature3}
**Priority:** Must Have
**Status:** [ ] Not Started [ ] In Progress [ ] Complete

### Future Features (Post-MVP)

- Feature 4
- Feature 5
- Feature 6

---

## 🎨 Design & User Experience

### Visual Identity

**Style:** ${answers.visualStyle}
**Primary Color:** ${answers.primaryColor}
**Dark Mode:** ${answers.darkMode === 'yes' ? 'Yes' : 'No'}

### Animations & Interactions

**Level:** ${answers.animations}

${
  answers.animations === 'rich'
    ? `- Advanced scroll animations
- Page transitions
- 3D elements
- Micro-interactions`
    : answers.animations === 'moderate'
      ? `- Hover effects
- Smooth transitions
- Loading animations`
      : `- Basic transitions only`
}

### Design System

Based on the template's design system with customizations:
- Custom color palette
- Typography: [Specify fonts]
- Component library in Storybook

---

## 🏗️ Technical Architecture

### Frontend

**Stack:**
- React 18 + TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Storybook

**Features:**
- ${answers.darkMode === 'yes' ? '✅' : '❌'} Dark Mode
- ${answers.isPWA === 'yes' ? '✅' : '❌'} PWA / Installable
- Responsive design (${answers.primaryDevice} first)

### Backend

${
  answers.apiType !== 'None'
    ? `**API:** ${answers.apiType}
**Framework:** Express.js + TypeScript
**Validation:** Zod`
    : '**Type:** Static site / JAMstack'
}

### Database

${
  answers.needsDB !== 'None'
    ? `**Type:** ${answers.needsDB}
**ORM:** Prisma`
    : 'Not required for MVP'
}

### Authentication

${
  answers.needsAuth === 'yes'
    ? `**Method:** JWT tokens
**Providers:** Email/Password + Social OAuth
**Features:**
- User registration
- Login/Logout
- Password reset
- Session management`
    : 'Not required'
}

---

## 📱 Platforms & Devices

### Target Devices

**Primary:** ${answers.primaryDevice}

**Support:**
- ✅ Modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ Mobile browsers (iOS Safari, Chrome Android)
- ${answers.isPWA === 'yes' ? '✅' : '❌'} Installable (PWA)

---

## 🔄 User Flows

### Primary User Journey

1. **Entry Point:** User lands on homepage
2. **Discovery:** [Describe main flow]
3. **Engagement:** [Key interactions]
4. **Conversion:** [Desired action]

### Key Screens

#### Homepage
- Purpose: [Fill in]
- Elements: Hero, Features, CTA

#### Dashboard (if applicable)
- Purpose: [Fill in]
- Elements: [Fill in]

#### [Other key screens]
- Purpose: [Fill in]
- Elements: [Fill in]

---

## 🚀 Deployment & Infrastructure

### Hosting

**Frontend:**
- Platform: Vercel / Netlify
- Domain: [To be decided]
- CDN: Automatic via platform

**Backend:**
${
  answers.apiType !== 'None'
    ? `- Platform: Railway / Render
- Database: [Cloud provider]
- Storage: AWS S3 / Cloudinary`
    : 'Not applicable (static site)'
}

### Environments

- **Development:** http://localhost:3000
- **Staging:** [To be decided]
- **Production:** [To be decided]

---

## 📊 Success Metrics

### KPIs

- [ ] User acquisition
- [ ] Engagement rate
- [ ] Conversion rate
- [ ] Performance (Core Web Vitals)
- [ ] Error rate

### Analytics

**Tools:**
- Google Analytics
- [Other tools]

---

## 🗓️ Roadmap

### Phase 1: MVP (${answers.launchDate})

- [ ] ${answers.feature1}
- [ ] ${answers.feature2}
- [ ] ${answers.feature3}
- [ ] Core design implementation
- [ ] ${answers.needsAuth === 'yes' ? 'Authentication system' : 'Basic functionality'}
- [ ] Testing & QA
- [ ] Launch

### Phase 2: Iteration

- [ ] User feedback collection
- [ ] Performance optimization
- [ ] Feature enhancements
- [ ] Mobile optimization

### Phase 3: Growth

- [ ] Advanced features
- [ ] Integrations
- [ ] Scaling

---

## 👨‍💻 Team & Resources

### Team

**Size:** ${answers.teamSize}

**Roles:**
- Product/Design: [Name]
- Frontend Development: [Name]
- Backend Development: [Name]
- QA/Testing: [Name]

### Tools & Collaboration

- **Code:** GitHub
- **Design:** Figma
- **Project Management:** [Tool]
- **Communication:** [Tool]

---

## 📝 Notes & Decisions

### Technical Decisions

- **Why React?** [Fill in]
- **Why ${answers.needsDB}?** [Fill in]
- **Why ${answers.visualStyle} design?** [Fill in]

### Constraints

- Budget: [If applicable]
- Timeline: ${answers.launchDate}
- Resources: ${answers.teamSize}

### Risks & Mitigation

1. **Risk:** [Identify]
   **Mitigation:** [Strategy]

2. **Risk:** [Identify]
   **Mitigation:** [Strategy]

---

## 🔗 References

### Inspiration

- App 1: [URL] - [What you like]
- App 2: [URL] - [What you like]
- App 3: [URL] - [What you like]

### Documentation

- [Technical docs]
- [Design system]
- [API docs]

---

## ✅ Next Steps

1. [ ] Complete detailed design mockups
2. [ ] Finalize database schema (if applicable)
3. [ ] Set up development environment
4. [ ] Create project board with tasks
5. [ ] Begin Phase 1 development
6. [ ] Regular check-ins and iterations

---

## 📞 Contact

**Project Owner:** [Name]
**Email:** [Email]
**Repository:** [URL]

---

**Last Updated:** ${date}
**Version:** 1.0

💡 **Note:** This document is a living document. Update it as the project evolves and new decisions are made.
`;
}

// Run
generateOverview().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
