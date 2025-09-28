// src/scripts/resetAdmin.ts
// Delete and recreate admin user completely

import 'dotenv/config';
import { prisma } from '../config/prisma';
import { Role } from '@prisma/client';
import { hashPassword } from '../utils/password';

async function main() {
  const email = 'salvaterra408@gmail.com';
  const password = 'StrongP@ssw0rd!';
  const name = 'Admin';

  console.log('[reset:admin] Deleting existing user...');
  
  // Delete existing user
  await prisma.user.deleteMany({
    where: { email }
  });

  console.log('[reset:admin] Creating new admin user...');
  
  // Create new user
  const passwordHash = await hashPassword(password);
  const created = await prisma.user.create({
    data: {
      email,
      name,
      password: passwordHash,
      role: Role.ADMIN,
    },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  });
  
  console.log('[reset:admin] Created admin user:', created);
}

main()
  .catch((err) => {
    console.error('[reset:admin] Failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
