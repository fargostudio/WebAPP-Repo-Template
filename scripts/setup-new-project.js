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
  fontProvider: 'google',
  iconLibrary: 'lucide',
  includeAceternity: false,
  removeExamples: false,
  setupGit: true,
};

// Font providers (all FREE)
const fontProviders = {
  '1': {
    name: 'Google Fonts',
    value: 'google',
    description: '1400+ fonts, most popular',
    url: 'https://fonts.google.com',
  },
  '2': {
    name: 'Bunny Fonts',
    value: 'bunny',
    description: 'Privacy-focused, GDPR compliant (same as Google)',
    url: 'https://fonts.bunny.net',
  },
  '3': {
    name: 'Font Share',
    value: 'fontshare',
    description: 'Curated quality fonts, free for commercial use',
    url: 'https://www.fontshare.com',
  },
  '4': {
    name: 'Fontsource',
    value: 'fontsource',
    description: 'Self-hosted via NPM, privacy-friendly',
    url: 'https://fontsource.org',
  },
};

// Icon libraries (all FLAT design, FREE)
const iconLibraries = {
  '1': {
    name: 'Lucide Icons',
    value: 'lucide',
    description: 'Beautiful flat icons, 1000+ (DEFAULT - già incluso!)',
    package: 'lucide-react',
    url: 'https://lucide.dev',
  },
  '2': {
    name: 'Heroicons',
    value: 'heroicons',
    description: 'By Tailwind team, super clean, 292 icons',
    package: '@heroicons/react',
    url: 'https://heroicons.com',
  },
  '3': {
    name: 'Phosphor Icons',
    value: 'phosphor',
    description: 'Modern, 6 weights, 1248 icons',
    package: 'phosphor-react',
    url: 'https://phosphoricons.com',
  },
  '4': {
    name: 'Iconoir',
    value: 'iconoir',
    description: 'Ultra minimalist, 1500+ icons',
    package: 'iconoir-react',
    url: 'https://iconoir.com',
  },
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

async function collectDesignPreferences() {
  log('\n🎨 Preferenze Design\n', 'blue');

  // Font provider
  log('\n📝 Font Provider (tutti FREE):\n', 'bright');
  Object.entries(fontProviders).forEach(([key, provider]) => {
    log(`${key}. ${provider.name}`, 'cyan');
    log(`   ${provider.description}`, 'dim');
  });
  log('');

  let validFont = false;
  while (!validFont) {
    const fontChoice = await question('Scegli font provider (1-4, default: 1): ') || '1';
    if (fontProviders[fontChoice]) {
      config.fontProvider = fontProviders[fontChoice].value;
      validFont = true;
      log(`✅ Scelto: ${fontProviders[fontChoice].name}`, 'green');
    } else {
      log('❌ Scelta non valida', 'red');
    }
  }

  // Icon library
  log('\n✨ Libreria Icone (tutte FLAT design, FREE):\n', 'bright');
  Object.entries(iconLibraries).forEach(([key, lib]) => {
    log(`${key}. ${lib.name}`, 'cyan');
    log(`   ${lib.description}`, 'dim');
  });
  log('');

  let validIcon = false;
  while (!validIcon) {
    const iconChoice = await question('Scegli libreria icone (1-4, default: 1): ') || '1';
    if (iconLibraries[iconChoice]) {
      config.iconLibrary = iconLibraries[iconChoice].value;
      validIcon = true;
      log(`✅ Scelto: ${iconLibraries[iconChoice].name}`, 'green');
    } else {
      log('❌ Scelta non valida', 'red');
    }
  }

  // Aceternity UI
  log('\n🌟 Aceternity UI (componenti bleeding-edge con animazioni WOW):\n', 'bright');
  log('   Aceternity UI offre componenti React ultra-moderni con:', 'dim');
  log('   • Animazioni fluide e professionali', 'dim');
  log('   • Design bleeding-edge', 'dim');
  log('   • Basato su Tailwind CSS + Framer Motion', 'dim');
  log('   • Componenti copiabili (come shadcn/ui)', 'dim');
  log('   https://ui.aceternity.com\n', 'cyan');

  const includeAceternity = await question('Preparare il template per Aceternity UI? (y/n, default: n): ') || 'n';
  config.includeAceternity = includeAceternity.toLowerCase() === 'y';

  if (config.includeAceternity) {
    log('✅ Aceternity UI verrà configurato!', 'green');
  } else {
    log('⏭️  Aceternity UI non verrà configurato (potrai sempre aggiungerlo dopo)', 'dim');
  }
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

async function setupGit() {
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

function installIconLibrary() {
  const selectedLib = Object.values(iconLibraries).find(
    (lib) => lib.value === config.iconLibrary
  );

  if (!selectedLib) return;

  // Lucide is already included by default
  if (config.iconLibrary === 'lucide') {
    log('✅ Lucide Icons already included', 'green');
    return;
  }

  // Add icon library to frontend package.json
  try {
    const frontendPackagePath = path.join(process.cwd(), 'apps/frontend/package.json');
    const packageJson = JSON.parse(fs.readFileSync(frontendPackagePath, 'utf8'));

    if (!packageJson.dependencies) {
      packageJson.dependencies = {};
    }

    // Add the icon library package
    packageJson.dependencies[selectedLib.package] = '^2.0.0';

    fs.writeFileSync(frontendPackagePath, JSON.stringify(packageJson, null, 2) + '\n');
    log(`✅ Added ${selectedLib.package} to frontend dependencies`, 'green');
  } catch (error) {
    log(`⚠️  Could not add icon library: ${error.message}`, 'yellow');
  }
}

function configureFontProvider() {
  const selectedProvider = Object.values(fontProviders).find(
    (provider) => provider.value === config.fontProvider
  );

  if (!selectedProvider) return;

  const indexPath = path.join(process.cwd(), 'apps/frontend/index.html');

  try {
    let indexHtml = fs.readFileSync(indexPath, 'utf8');

    // Font configuration based on provider
    let fontLink = '';
    let fontComment = '';

    switch (config.fontProvider) {
      case 'google':
        fontLink = '    <link rel="preconnect" href="https://fonts.googleapis.com">\n    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n    <!-- Add your Google Fonts here: https://fonts.google.com -->\n    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">';
        fontComment = 'Google Fonts';
        break;
      case 'bunny':
        fontLink = '    <link rel="preconnect" href="https://fonts.bunny.net">\n    <!-- Privacy-focused alternative to Google Fonts: https://fonts.bunny.net -->\n    <link href="https://fonts.bunny.net/css?family=inter:400,500,600,700" rel="stylesheet">';
        fontComment = 'Bunny Fonts (GDPR compliant)';
        break;
      case 'fontshare':
        fontLink = '    <!-- Font Share: https://www.fontshare.com -->\n    <link href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap" rel="stylesheet">';
        fontComment = 'Font Share';
        break;
      case 'fontsource':
        fontLink = '    <!-- Fontsource (self-hosted via NPM): https://fontsource.org -->\n    <!-- Install: npm install @fontsource/inter -->\n    <!-- Then import in main.tsx: import "@fontsource/inter"; -->';
        fontComment = 'Fontsource (NPM package)';
        break;
    }

    // Add font link before </head>
    indexHtml = indexHtml.replace(
      '</head>',
      `\n    <!-- ${fontComment} -->\n${fontLink}\n  </head>`
    );

    fs.writeFileSync(indexPath, indexHtml);
    log(`✅ Configured ${selectedProvider.name} in index.html`, 'green');
  } catch (error) {
    log(`⚠️  Could not configure fonts: ${error.message}`, 'yellow');
  }
}

function setupAceternityUI() {
  if (!config.includeAceternity) return;

  try {
    // 1. Add required dependencies
    const frontendPackagePath = path.join(process.cwd(), 'apps/frontend/package.json');
    const packageJson = JSON.parse(fs.readFileSync(frontendPackagePath, 'utf8'));

    if (!packageJson.dependencies) {
      packageJson.dependencies = {};
    }

    // Add tailwind-merge and clsx (required for cn() utility)
    packageJson.dependencies['tailwind-merge'] = '^2.5.5';
    packageJson.dependencies['clsx'] = '^2.1.1';

    fs.writeFileSync(frontendPackagePath, JSON.stringify(packageJson, null, 2) + '\n');
    log('✅ Added Aceternity UI dependencies (tailwind-merge, clsx)', 'green');

    // 2. Create lib folder and utils.ts
    const libDir = path.join(process.cwd(), 'apps/frontend/src/lib');
    if (!fs.existsSync(libDir)) {
      fs.mkdirSync(libDir, { recursive: true });
    }

    const utilsPath = path.join(libDir, 'utils.ts');
    const utilsContent = `import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes
 * Used by Aceternity UI and other components
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`;

    fs.writeFileSync(utilsPath, utilsContent);
    log('✅ Created apps/frontend/src/lib/utils.ts', 'green');

    // 3. Create aceternity components folder
    const aceternityDir = path.join(
      process.cwd(),
      'apps/frontend/src/components/ui/aceternity'
    );
    if (!fs.existsSync(aceternityDir)) {
      fs.mkdirSync(aceternityDir, { recursive: true });
    }

    log('✅ Created apps/frontend/src/components/ui/aceternity/', 'green');

    // 4. Create usage guide
    const docsDir = path.join(process.cwd(), 'docs');
    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir);
    }

    const guidePath = path.join(docsDir, 'ACETERNITY_UI.md');
    const guideContent = `# Aceternity UI - Usage Guide

> Ultra-modern React components with bleeding-edge animations

## 🌟 What is Aceternity UI?

Aceternity UI provides beautiful, animated React components built with:
- **Tailwind CSS** - For styling
- **Framer Motion** - For animations (already installed!)
- **TypeScript** - Full type safety

Perfect for creating "wow factor" UIs with professional animations.

## 🚀 How to Use

### 1. Browse Components
Visit [Aceternity UI](https://ui.aceternity.com) and browse available components.

### 2. Copy Component Code
- Click on any component you like
- Copy the component code
- Paste it in \`apps/frontend/src/components/ui/aceternity/\`

### 3. Install Component Dependencies
Some components require additional packages. Check the component page for requirements.

Example:
\`\`\`bash
npm install @tabler/icons-react
\`\`\`

### 4. Import and Use
\`\`\`tsx
import { HeroParallax } from '@/components/ui/aceternity/hero-parallax';

function MyPage() {
  return <HeroParallax products={products} />;
}
\`\`\`

## 📦 Pre-installed Dependencies

The following are already installed:
- ✅ \`framer-motion\` - Animation library
- ✅ \`tailwind-merge\` - Merge Tailwind classes
- ✅ \`clsx\` - Conditional classes
- ✅ \`cn()\` utility - Available in \`@/lib/utils\`

## 🎯 Recommended Components

### For Landing Pages
- **Hero Parallax** - Stunning hero section with parallax effect
- **3D Card Effect** - Interactive cards with 3D tilt
- **Lamp Effect** - Dramatic light effect
- **Background Beams** - Animated beam background

### For Dashboards
- **Sidebar** - Modern sidebar with animations
- **Animated Tabs** - Smooth tab transitions
- **Card Stack** - Stacked cards with hover effects

### For Effects
- **Text Reveal Card** - Text that reveals on hover
- **Glowing Stars** - Background star effect
- **Aurora Background** - Dynamic gradient background

## 💡 Tips

1. **Start Small**: Try one component first
2. **Check Dependencies**: Each component lists required packages
3. **Customize**: All components are fully customizable via Tailwind
4. **Performance**: Components use Framer Motion efficiently
5. **Dark Mode**: Most components support dark mode out of the box

## 🔗 Resources

- Official Site: https://ui.aceternity.com
- Framer Motion Docs: https://www.framer.com/motion/
- Tailwind CSS Docs: https://tailwindcss.com

## 📝 Example: Adding a Component

1. Visit https://ui.aceternity.com
2. Find "3D Card Effect"
3. Copy the component code
4. Create \`apps/frontend/src/components/ui/aceternity/card-3d.tsx\`
5. Paste the code
6. Import: \`import { CardContainer } from '@/components/ui/aceternity/card-3d'\`
7. Use it in your app!

---

🎨 Built for bleeding-edge design experiences!
`;

    fs.writeFileSync(guidePath, guideContent);
    log('✅ Created docs/ACETERNITY_UI.md', 'green');

    log('\n🌟 Aceternity UI setup complete!', 'green');
    log('   Read docs/ACETERNITY_UI.md for usage instructions', 'dim');
  } catch (error) {
    log(`⚠️  Could not setup Aceternity UI: ${error.message}`, 'yellow');
  }
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

  log('\n🎨 Design Preferences:\n', 'bright');
  const selectedFont = Object.values(fontProviders).find(p => p.value === config.fontProvider);
  const selectedIcon = Object.values(iconLibraries).find(l => l.value === config.iconLibrary);
  log(`  Font Provider: ${selectedFont ? selectedFont.name : 'Google Fonts'}`, 'cyan');
  log(`  Icon Library: ${selectedIcon ? selectedIcon.name : 'Lucide Icons'}`, 'cyan');
  log(`  Aceternity UI: ${config.includeAceternity ? '✅ Configured' : '⏭️  Not included'}`, 'cyan');

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
  if (config.includeAceternity) {
    log('  - docs/ACETERNITY_UI.md - How to use Aceternity UI components', 'dim');
  }

  log('\n💡 TIP: Using AI code editors?\n', 'yellow');
  log('  Install Context7 for up-to-date docs on bleeding-edge libraries!', 'dim');
  log('  → https://github.com/upstash/context7', 'cyan');
  log('  Just say "use context7" in Cursor, Claude Desktop, or VS Code + Cline', 'dim');

  log('\n🚀 Ready to build something amazing!\n', 'green');
}

// Main execution
async function main() {
  try {
    banner();

    await collectProjectInfo();
    await collectProjectType();
    await collectDesignPreferences();
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
    configureFontProvider();
    installIconLibrary();
    setupAceternityUI();
    removeExampleComponents();
    createProjectOverview();

    if (config.setupGit) {
      await setupGit();
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
