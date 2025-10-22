#!/usr/bin/env node

/**
 * Setup Wizard Server
 * Interactive web-based setup for the Web App Template
 */

const express = require('express');
const path = require('path');
const { execSync } = require('child_process');
const fs = require('fs');
const crypto = require('crypto');

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ============================================================================
// Helper Functions
// ============================================================================

function execCommand(command, options = {}) {
  try {
    const output = execSync(command, {
      encoding: 'utf8',
      stdio: options.silent ? 'pipe' : 'inherit',
      ...options,
    });
    return { success: true, output };
  } catch (error) {
    return { success: false, error: error.message, output: error.stdout };
  }
}

function checkPrerequisite(command, name) {
  const result = execCommand(command, { silent: true });
  return {
    name,
    installed: result.success,
    version: result.success ? result.output.trim() : null,
  };
}

// ============================================================================
// API Endpoints
// ============================================================================

// Check prerequisites
app.get('/api/check-prerequisites', (req, res) => {
  const checks = [
    checkPrerequisite('node --version', 'Node.js'),
    checkPrerequisite('docker --version', 'Docker'),
    checkPrerequisite('docker-compose --version', 'Docker Compose'),
  ];

  const allInstalled = checks.every((c) => c.installed);

  res.json({
    checks,
    allInstalled,
    message: allInstalled
      ? 'All prerequisites installed!'
      : 'Some prerequisites are missing',
  });
});

// Generate JWT secrets
app.post('/api/generate-secrets', (req, res) => {
  const accessSecret = crypto.randomBytes(32).toString('hex');
  const refreshSecret = crypto.randomBytes(32).toString('hex');

  res.json({
    accessSecret,
    refreshSecret,
  });
});

// Setup project
app.post('/api/setup', async (req, res) => {
  const {
    projectName,
    projectDescription,
    authorName,
    authorEmail,
    adminEmail,
    adminPassword,
    jwtAccessSecret,
    jwtRefreshSecret,
  } = req.body;

  const steps = [];
  let currentStep = 0;

  try {
    // Step 1: Create .env files
    currentStep = 1;
    steps.push({ step: 1, status: 'running', message: 'Creating .env files...' });

    const backendEnv = `# Server
PORT=5000
NODE_ENV=development

# Frontend
FRONTEND_URL=http://localhost:3000

# Database
DATABASE_URL="postgresql://webapp:webapp_password@localhost:5432/webapp_db"

# Redis
REDIS_URL="redis://localhost:6379"

# Logging
LOG_LEVEL=info

# JWT Authentication
JWT_ACCESS_SECRET=${jwtAccessSecret}
JWT_REFRESH_SECRET=${jwtRefreshSecret}
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
`;

    const frontendEnv = `# API Configuration
VITE_API_URL=http://localhost:5000
`;

    const rootPath = path.join(__dirname, '../..');
    fs.writeFileSync(path.join(rootPath, 'apps/backend/.env'), backendEnv);
    fs.writeFileSync(path.join(rootPath, 'apps/frontend/.env'), frontendEnv);

    steps[0].status = 'success';

    // Step 2: Start Docker services
    currentStep = 2;
    steps.push({ step: 2, status: 'running', message: 'Starting Docker services...' });

    const dockerResult = execCommand('docker-compose up -d postgres redis', {
      cwd: rootPath,
    });

    if (!dockerResult.success) {
      throw new Error('Failed to start Docker services');
    }

    // Wait for PostgreSQL to be ready
    console.log('Waiting for PostgreSQL to be ready...');
    await new Promise((resolve) => setTimeout(resolve, 5000));

    steps[1].status = 'success';

    // Step 3: Install dependencies
    currentStep = 3;
    steps.push({ step: 3, status: 'running', message: 'Installing dependencies...' });

    const installResult = execCommand('npm install', {
      cwd: path.join(rootPath, 'apps/backend'),
    });

    if (!installResult.success) {
      throw new Error('Failed to install dependencies');
    }

    steps[2].status = 'success';

    // Step 4: Generate Prisma Client
    currentStep = 4;
    steps.push({ step: 4, status: 'running', message: 'Generating Prisma Client...' });

    const generateResult = execCommand('npm run db:generate', {
      cwd: path.join(rootPath, 'apps/backend'),
    });

    if (!generateResult.success) {
      throw new Error('Failed to generate Prisma Client');
    }

    steps[3].status = 'success';

    // Step 5: Run migrations
    currentStep = 5;
    steps.push({ step: 5, status: 'running', message: 'Running database migrations...' });

    const migrateResult = execCommand('npm run db:push', {
      cwd: path.join(rootPath, 'apps/backend'),
    });

    if (!migrateResult.success) {
      throw new Error('Failed to run migrations');
    }

    steps[4].status = 'success';

    // Step 6: Create admin user
    currentStep = 6;
    steps.push({ step: 6, status: 'running', message: 'Creating admin user...' });

    const seedScript = `
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('${adminPassword}', 10);

  const user = await prisma.user.upsert({
    where: { email: '${adminEmail}' },
    update: {},
    create: {
      email: '${adminEmail}',
      password: hashedPassword,
      name: '${authorName}',
      emailVerified: true,
      isActive: true,
    },
  });

  console.log('Admin user created:', user.email);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
`;

    const seedPath = path.join(rootPath, 'apps/backend/prisma/seed-admin.js');
    fs.writeFileSync(seedPath, seedScript);

    const seedResult = execCommand(`node ${seedPath}`, {
      cwd: path.join(rootPath, 'apps/backend'),
    });

    // Clean up temp seed file
    fs.unlinkSync(seedPath);

    if (!seedResult.success) {
      throw new Error('Failed to create admin user');
    }

    steps[5].status = 'success';

    // Step 7: Update project files
    currentStep = 7;
    steps.push({ step: 7, status: 'running', message: 'Updating project files...' });

    // Update package.json files with project info
    const updatePackageJson = (filePath) => {
      const packageJson = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      packageJson.name = packageJson.name.replace('backend', projectName).replace('frontend', projectName);
      packageJson.description = projectDescription;
      packageJson.author = `${authorName} <${authorEmail}>`;
      fs.writeFileSync(filePath, JSON.stringify(packageJson, null, 2) + '\n');
    };

    updatePackageJson(path.join(rootPath, 'package.json'));
    updatePackageJson(path.join(rootPath, 'apps/backend/package.json'));
    updatePackageJson(path.join(rootPath, 'apps/frontend/package.json'));

    steps[6].status = 'success';

    res.json({
      success: true,
      message: 'Setup completed successfully!',
      steps,
      credentials: {
        email: adminEmail,
        password: adminPassword,
      },
    });
  } catch (error) {
    console.error('Setup error:', error);

    if (steps[currentStep - 1]) {
      steps[currentStep - 1].status = 'error';
      steps[currentStep - 1].error = error.message;
    }

    res.status(500).json({
      success: false,
      message: error.message,
      steps,
      failedAt: currentStep,
    });
  }
});

// ============================================================================
// Start Server
// ============================================================================

app.listen(PORT, () => {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║                                                            ║');
  console.log('║          🧙 Web App Template Setup Wizard 🧙              ║');
  console.log('║                                                            ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log(`\n✨ Setup Wizard is running!`);
  console.log(`\n🌐 Open your browser to: http://localhost:${PORT}`);
  console.log('\n📝 Follow the steps to configure your application\n');
});
