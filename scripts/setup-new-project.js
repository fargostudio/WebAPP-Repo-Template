#!/usr/bin/env node

/**
 * Interactive Setup Wizard for New Projects
 *
 * This script helps you personalize the template for your new app by:
 * - Collecting project details (name, description, etc.)
 * - Updating package.json files
 * - Customizing README
 * - Setting up environment variables
 * - Removing example components (optional)
 * - Initializing git
 *
 * Usage: npm run setup
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execSync } = require('child_process');

// ANSI colors for better UX
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Project configuration
const config = {
  projectName: '',
  projectDescription: '',
  authorName: '',
  authorEmail: '',
  gitRepo: '',
  projectType: '',
  removeExamples: false,
  setupGit: true,
};

// Helper functions
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

function banner() {
  console.clear();
  log('\n╔════════════════════════════════════════════════════════════╗', 'cyan');
  log('║                                                            ║', 'cyan');
  log('║          🚀 Web App Template Setup Wizard 🚀              ║', 'cyan');
  log('║                                                            ║', 'cyan');
  log('╚════════════════════════════════════════════════════════════╝', 'cyan');
  log('\n👋 Benvenuto! Ti guiderò nella configurazione del tuo progetto.\n', 'bright');
}

function validateProjectName(name) {
  const regex = /^[a-z0-9-]+$/;
  return regex.test(name);
}

function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Collection steps
async function collectProjectInfo() {
  log('\n📋 Informazioni Progetto\n', 'blue');

  // Project name
  let validName = false;
  while (!validName) {
    const name = await question('Nome progetto (es: my-awesome-app): ');
    if (validateProjectName(name)) {
      config.projectName = name;
      validName = true;
    } else {
      log('❌ Nome non valido. Usa solo lettere minuscole, numeri e trattini.', 'red');
    }
  }

  // Description
  config.projectDescription = await question('Descrizione (breve): ');

  // Author
  config.authorName = await question('Tuo nome: ');

  // Email
  let validEmail = false;
  while (!validEmail) {
    const email = await question('Tua email: ');
    if (validateEmail(email)) {
      config.authorEmail = email;
      validEmail = true;
    } else {
      log('❌ Email non valida.', 'red');
    }
  }

  // Git repo (optional)
  config.gitRepo = await question('URL repository Git (opzionale, premi Enter per saltare): ');
}

async function collectProjectType() {
  log('\n🎯 Tipo di Progetto\n', 'blue');
  log('1. Dashboard / Admin Panel', 'dim');
  log('2. Landing Page / Marketing Site', 'dim');
  log('3. E-commerce / Shop', 'dim');
  log('4. Blog / Content Site', 'dim');
  log('5. SaaS Application', 'dim');
  log('6. Portfolio', 'dim');
  log('7. Altro\n', 'dim');

  const type = await question('Scegli tipo (1-7): ');
  const types = {
    '1': 'Dashboard / Admin Panel',
    '2': 'Landing Page / Marketing Site',
    '3': 'E-commerce / Shop',
    '4': 'Blog / Content Site',
    '5': 'SaaS Application',
    '6': 'Portfolio',
    '7': 'Other',
  };

  config.projectType = types[type] || 'Other';
}

async function collectOptions() {
  log('\n⚙️  Opzioni\n', 'blue');

  const removeExamples = await question('Rimuovere componenti esempio? (y/n): ');
  config.removeExamples = removeExamples.toLowerCase() === 'y';

  const setupGit = await question('Inizializzare nuovo repository Git? (y/n): ');
  config.setupGit = setupGit.toLowerCase() === 'y';
}

// Update functions
function updatePackageJson(filePath, updates) {
  try {
    const packageJson = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    packageJson.name = updates.name;
    packageJson.version = '0.1.0';
    packageJson.description = updates.description;
    packageJson.author = updates.author;

    if (updates.repository) {
      packageJson.repository = {
        type: 'git',
        url: updates.repository,
      };
    }

    fs.writeFileSync(filePath, JSON.stringify(packageJson, null, 2) + '\n');
    log(`✅ Updated ${filePath}`, 'green');
  } catch (error) {
    log(`❌ Error updating ${filePath}: ${error.message}`, 'red');
  }
}

function updateReadme() {
  const readmePath = path.join(process.cwd(), 'README.md');

  const newReadme = `# ${config.projectName}

> ${config.projectDescription}

**Type:** ${config.projectType}

## 🚀 Quick Start

\`\`\`bash
# Install dependencies
npm install

# Setup environment
cp apps/backend/.env.example apps/backend/.env

# Start development
npm run dev
\`\`\`

Frontend: http://localhost:3000
Backend: http://localhost:5000

## 📚 Documentation

Based on [Web App Template](./TEMPLATE_ORIGINAL_README.md)

- [Quick Start Guide](./QUICKSTART.md)
- [Architecture Overview](./docs/OVERVIEW.md) - Generated project overview
- [Development Guide](./docs/DEVELOPMENT.md)

## 🛠️ Tech Stack

### Frontend
- React 18 + TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Storybook

### Backend
- Node.js + Express
- TypeScript
- Zod validation
- Winston logging

### DevOps
- Docker
- GitHub Actions
- Husky

## 👤 Author

**${config.authorName}**
${config.authorEmail ? `- Email: ${config.authorEmail}` : ''}
${config.gitRepo ? `- Repository: ${config.gitRepo}` : ''}

## 📝 License

MIT

---

🤖 Generated from [Web App Template](https://github.com/yourorg/webapp-template)
`;

  // Backup original README
  const originalReadme = fs.readFileSync(readmePath, 'utf8');
  fs.writeFileSync(
    path.join(process.cwd(), 'TEMPLATE_ORIGINAL_README.md'),
    originalReadme
  );

  fs.writeFileSync(readmePath, newReadme);
  log('✅ Updated README.md', 'green');
}

function updateEnvFiles() {
  // Frontend env
  const frontendEnvPath = path.join(process.cwd(), 'apps/frontend/.env.example');
  if (fs.existsSync(frontendEnvPath)) {
    const envContent = `# ${config.projectName} - Frontend Environment Variables

VITE_APP_NAME="${config.projectName}"
VITE_APP_DESCRIPTION="${config.projectDescription}"
VITE_API_URL=http://localhost:5000
`;
    fs.writeFileSync(frontendEnvPath, envContent);
    log('✅ Updated frontend .env.example', 'green');
  }
}

function removeExampleComponents() {
  if (!config.removeExamples) return;

  const filesToRemove = [
    'apps/frontend/src/components/Hero.tsx',
    'apps/frontend/src/components/AnimatedCard.tsx',
    'apps/frontend/src/components/AnimatedCard.stories.tsx',
  ];

  filesToRemove.forEach((file) => {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      log(`🗑️  Removed ${file}`, 'yellow');
    }
  });

  // Update App.tsx to remove example usage
  const appPath = path.join(process.cwd(), 'apps/frontend/src/App.tsx');
  const newApp = `import { useState } from 'react';
import ThemeToggle from './components/ThemeToggle';

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ThemeToggle theme={theme} onToggle={toggleTheme} />

      <div className="container mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold gradient-text">
          ${config.projectName}
        </h1>
        <p className="text-xl text-muted-foreground mt-4">
          ${config.projectDescription}
        </p>

        {/* Your app content here */}
      </div>
    </div>
  );
}

export default App;
`;

  fs.writeFileSync(appPath, newApp);
  log('✅ Updated App.tsx', 'green');
}

function setupGit() {
  if (!config.setupGit) return;

  try {
    // Check if .git exists
    if (fs.existsSync(path.join(process.cwd(), '.git'))) {
      const reinit = await question('Git già inizializzato. Rimuovere e reinizializzare? (y/n): ');
      if (reinit.toLowerCase() === 'y') {
        execSync('rm -rf .git', { stdio: 'ignore' });
      } else {
        return;
      }
    }

    execSync('git init', { stdio: 'inherit' });
    log('✅ Git initialized', 'green');

    if (config.gitRepo) {
      execSync(`git remote add origin ${config.gitRepo}`, { stdio: 'inherit' });
      log('✅ Remote origin configured', 'green');
    }

    // Initial commit
    execSync('git add .', { stdio: 'inherit' });
    execSync(`git commit -m "chore: initial commit - ${config.projectName}"`, {
      stdio: 'inherit',
    });
    log('✅ Initial commit created', 'green');
  } catch (error) {
    log(`⚠️  Git setup failed: ${error.message}`, 'yellow');
  }
}

function createProjectOverview() {
  const docsDir = path.join(process.cwd(), 'docs');
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir);
  }

  const overviewPath = path.join(docsDir, 'OVERVIEW.md');
  const overview = `# ${config.projectName} - Project Overview

> Generated on ${new Date().toLocaleDateString('it-IT')}

## 📋 Project Information

**Name:** ${config.projectName}
**Type:** ${config.projectType}
**Description:** ${config.projectDescription}

**Author:** ${config.authorName}
${config.authorEmail ? `**Email:** ${config.authorEmail}` : ''}
${config.gitRepo ? `**Repository:** ${config.gitRepo}` : ''}

## 🎯 Project Goals

<!-- Fill this section after completing the project questionnaire -->

## 👥 Target Users

<!-- Who will use this application? -->

## ✨ Key Features

<!-- List main features -->

1. Feature 1
2. Feature 2
3. Feature 3

## 🎨 Design & UX

### Visual Identity

<!-- Colors, typography, design style -->

### User Flow

<!-- Main user journeys -->

### Wireframes/Mockups

<!-- Link to design files -->

## 🏗️ Architecture

### Frontend
- React 18 + TypeScript
- Tailwind CSS
- Framer Motion
- Storybook

### Backend
- Node.js + Express
- TypeScript
- Zod validation

### Database
<!-- Specify if/when added -->

### Third-party Services
<!-- APIs, services used -->

## 📱 Features Breakdown

### Phase 1 (MVP)
- [ ] Feature A
- [ ] Feature B
- [ ] Feature C

### Phase 2
- [ ] Feature D
- [ ] Feature E

### Phase 3 (Future)
- [ ] Feature F

## 🚀 Deployment

**Staging:** <!-- URL -->
**Production:** <!-- URL -->

## 📝 Notes

<!-- Additional notes, decisions, constraints -->

---

💡 **Next Steps:**
1. Complete the [Project Questionnaire](./PROJECT_QUESTIONNAIRE.md)
2. Update this overview with detailed information
3. Share with team/stakeholders for feedback
`;

  fs.writeFileSync(overviewPath, overview);
  log('✅ Created docs/OVERVIEW.md', 'green');
}

// Summary
function showSummary() {
  log('\n╔════════════════════════════════════════════════════════════╗', 'green');
  log('║                    ✅ Setup Complete!                      ║', 'green');
  log('╚════════════════════════════════════════════════════════════╝', 'green');

  log('\n📊 Configuration Summary:\n', 'bright');
  log(`  Project Name: ${config.projectName}`, 'cyan');
  log(`  Description: ${config.projectDescription}`, 'cyan');
  log(`  Type: ${config.projectType}`, 'cyan');
  log(`  Author: ${config.authorName}`, 'cyan');
  if (config.authorEmail) log(`  Email: ${config.authorEmail}`, 'cyan');
  if (config.gitRepo) log(`  Repository: ${config.gitRepo}`, 'cyan');

  log('\n📁 Files Updated:\n', 'bright');
  log('  ✅ package.json (root)', 'green');
  log('  ✅ apps/frontend/package.json', 'green');
  log('  ✅ apps/backend/package.json', 'green');
  log('  ✅ README.md', 'green');
  log('  ✅ apps/frontend/.env.example', 'green');
  log('  ✅ docs/OVERVIEW.md', 'green');
  if (config.removeExamples) log('  🗑️  Example components removed', 'yellow');
  if (config.setupGit) log('  ✅ Git initialized', 'green');

  log('\n🎯 Next Steps:\n', 'bright');
  log('  1. Review and update docs/OVERVIEW.md', 'dim');
  log('  2. Complete docs/PROJECT_QUESTIONNAIRE.md', 'dim');
  log('  3. Install dependencies: npm install', 'dim');
  log('  4. Configure apps/backend/.env', 'dim');
  log('  5. Start development: npm run dev', 'dim');
  log('  6. Open Storybook: npm run storybook', 'dim');

  log('\n📚 Documentation:\n', 'bright');
  log('  - QUICKSTART.md - Quick start guide', 'dim');
  log('  - docs/OVERVIEW.md - Project overview', 'dim');
  log('  - docs/PROJECT_QUESTIONNAIRE.md - Complete for detailed specs', 'dim');

  log('\n🚀 Ready to build something amazing!\n', 'green');
}

// Main execution
async function main() {
  try {
    banner();

    await collectProjectInfo();
    await collectProjectType();
    await collectOptions();

    log('\n🔧 Configuring project...\n', 'yellow');

    // Update files
    updatePackageJson(path.join(process.cwd(), 'package.json'), {
      name: config.projectName,
      description: config.projectDescription,
      author: `${config.authorName} <${config.authorEmail}>`,
      repository: config.gitRepo,
    });

    updatePackageJson(path.join(process.cwd(), 'apps/frontend/package.json'), {
      name: `${config.projectName}-frontend`,
      description: `${config.projectDescription} - Frontend`,
      author: `${config.authorName} <${config.authorEmail}>`,
    });

    updatePackageJson(path.join(process.cwd(), 'apps/backend/package.json'), {
      name: `${config.projectName}-backend`,
      description: `${config.projectDescription} - Backend`,
      author: `${config.authorName} <${config.authorEmail}>`,
    });

    updateReadme();
    updateEnvFiles();
    removeExampleComponents();
    createProjectOverview();

    if (config.setupGit) {
      setupGit();
    }

    showSummary();
  } catch (error) {
    log(`\n❌ Error: ${error.message}`, 'red');
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Run
main();
