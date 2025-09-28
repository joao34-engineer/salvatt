// src/scripts/testLogin.ts
// Test script to verify admin login credentials work
// Run with: npm run test:login

import 'dotenv/config';
import { prisma } from '../config/prisma';
import { comparePassword } from '../utils/password';

async function main() {
  const email = process.env.ADMIN_EMAIL || 'salvaterra408@gmail.com';
  const password = process.env.ADMIN_PASSWORD || 'StrongP@ssw0rd!';

  console.log('[test:login] Testing login for:', email);

  // Find user in database
  const user = await prisma.user.findUnique({ 
    where: { email },
    select: { id: true, email: true, name: true, role: true, password: true }
  });

  if (!user) {
    console.error('[test:login] ❌ User not found in database');
    return;
  }

  console.log('[test:login] ✅ User found:', {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    passwordHash: user.password.substring(0, 20) + '...'
  });

  // Test password comparison
  const passwordMatch = await comparePassword(password, user.password);
  
  if (passwordMatch) {
    console.log('[test:login] ✅ Password matches!');
  } else {
    console.error('[test:login] ❌ Password does NOT match');
  }

  // Test if user is admin
  if (user.role === 'ADMIN') {
    console.log('[test:login] ✅ User has ADMIN role');
  } else {
    console.error('[test:login] ❌ User role is:', user.role);
  }
}

main()
  .catch((err) => {
    console.error('[test:login] Failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
