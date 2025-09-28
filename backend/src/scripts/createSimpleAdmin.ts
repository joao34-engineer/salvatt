// src/scripts/createSimpleAdmin.ts
// Create admin with simple password

import 'dotenv/config';
import { prisma } from '../config/prisma';
import { Role } from '@prisma/client';
import { hashPassword, comparePassword } from '../utils/password';

async function main() {
  const email = 'admin@salvatt.com';
  const password = 'admin123';
  const name = 'Admin';

  console.log('[simple:admin] Deleting existing admin@salvatt.com...');
  
  // Delete existing user
  await prisma.user.deleteMany({
    where: { email }
  });

  console.log('[simple:admin] Creating hash for password:', password);
  
  // Create hash and test it immediately
  const passwordHash = await hashPassword(password);
  console.log('[simple:admin] Hash created:', passwordHash.substring(0, 20) + '...');
  
  const testMatch = await comparePassword(password, passwordHash);
  console.log('[simple:admin] Hash test result:', testMatch);
  
  if (!testMatch) {
    throw new Error('Hash test failed!');
  }

  console.log('[simple:admin] Creating new admin user...');
  
  // Create new user
  const created = await prisma.user.create({
    data: {
      email,
      name,
      password: passwordHash,
      role: Role.ADMIN,
    },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  });
  
  console.log('[simple:admin] Created admin user:', created);
  
  // Test the password immediately after creation
  const userFromDb = await prisma.user.findUnique({
    where: { email },
    select: { password: true }
  });
  
  if (userFromDb) {
    const finalTest = await comparePassword(password, userFromDb.password);
    console.log('[simple:admin] Final password test:', finalTest);
  }
}

main()
  .catch((err) => {
    console.error('[simple:admin] Failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
