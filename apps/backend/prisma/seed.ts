/**
 * Prisma Seed Script
 * Seeds the database with test data
 *
 * Run with: npm run db:seed
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...\n');

  // Check if test user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: 'admin@test.com' },
  });

  if (existingUser) {
    console.log('⚠️  Test user already exists');
    console.log('   Email: admin@test.com');
    console.log('   Skipping seed...\n');
    return;
  }

  // Hash password
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create test user
  const user = await prisma.user.create({
    data: {
      email: 'admin@test.com',
      password: hashedPassword,
      name: 'Admin User',
      emailVerified: true, // Pre-verified for testing
      isActive: true,
    },
  });

  console.log('✅ Test user created successfully!');
  console.log('   Email: admin@test.com');
  console.log('   Password: password123');
  console.log(`   ID: ${user.id}`);
  console.log('   Name: Admin User');
  console.log('   Email Verified: true\n');

  console.log('🎉 Database seed completed!\n');
}

main()
  .catch((error) => {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
