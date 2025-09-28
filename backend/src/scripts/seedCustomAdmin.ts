// src/scripts/seedCustomAdmin.ts
// Create admin with your specific credentials

import 'dotenv/config';
import { prisma } from '../config/prisma';
import { Role } from '@prisma/client';
import { hashPassword, comparePassword } from '../utils/password';

async function main() {
  const email = 'salvaterra408@gmail.com';
  const password = '241536@';
  const name = 'Admin';

  console.log('[custom:admin] Setting up admin with email:', email);
  
  // Delete existing user with this email
  await prisma.user.deleteMany({
    where: { email }
  });

  console.log('[custom:admin] Creating password hash...');
  
  // Create hash and test it immediately
  const passwordHash = await hashPassword(password);
  console.log('[custom:admin] Hash created successfully');
  
  // Test the hash immediately
  const testMatch = await comparePassword(password, passwordHash);
  console.log('[custom:admin] Hash verification:', testMatch ? '✅ PASS' : '❌ FAIL');
  
  if (!testMatch) {
    throw new Error('Password hash verification failed!');
  }

  console.log('[custom:admin] Creating admin user...');
  
  // Create new admin user
  const created = await prisma.user.create({
    data: {
      email,
      name,
      password: passwordHash,
      role: Role.ADMIN,
    },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  });
  
  console.log('[custom:admin] ✅ Admin user created:', created);
  
  // Final verification - fetch from database and test password
  console.log('[custom:admin] Performing final verification...');
  const userFromDb = await prisma.user.findUnique({
    where: { email },
    select: { password: true }
  });
  
  if (userFromDb) {
    const finalTest = await comparePassword(password, userFromDb.password);
    console.log('[custom:admin] Final password test:', finalTest ? '✅ PASS' : '❌ FAIL');
    
    if (finalTest) {
      console.log('[custom:admin] 🎉 SUCCESS! Admin user is ready to use.');
      console.log('[custom:admin] Login credentials:');
      console.log('[custom:admin]   Email: salvaterra408@gmail.com');
      console.log('[custom:admin]   Password: 241536@');
    } else {
      throw new Error('Final password verification failed!');
    }
  }
}

main()
  .catch((err) => {
    console.error('[custom:admin] ❌ Failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
