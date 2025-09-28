// src/scripts/seedAdmin.ts
// One-time admin seeding utility. Safe to re-run.
// - Reads ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME from environment (.env)
// - Creates the user if missing, or promotes existing user to ADMIN.
// - Optionally resets password when RESET_ADMIN_PASSWORD=true.
//
// This script is meant to be executed locally with ts-node. Do NOT run on every deploy.
// Example:
//   ADMIN_EMAIL=admin@salvatt.com \
//   ADMIN_PASSWORD=StrongP@ssw0rd! \
//   ADMIN_NAME="Admin" \
//   npm run seed:admin

import 'dotenv/config';
import { prisma } from '../config/prisma';
import { Role } from '@prisma/client';
import { hashPassword } from '../utils/password';

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME?.trim() || 'Admin';
  const resetPassword = (process.env.RESET_ADMIN_PASSWORD || '').toLowerCase() === 'true';

  if (!email || !password) {
    console.error('[seed:admin] Missing required env vars ADMIN_EMAIL and/or ADMIN_PASSWORD');
    console.error(`Set them in backend/.env or inline:\nADMIN_EMAIL=admin@salvatt.com ADMIN_PASSWORD=StrongP@ssw0rd! ADMIN_NAME=Admin npm run seed:admin`);
    process.exit(1);
  }

  // Ensure a consistent role assignment flow:
  // 1) If user does not exist: create with ADMIN role and hashed password
  // 2) If user exists: promote to ADMIN; optionally reset password if requested
  const existing = await prisma.user.findUnique({ where: { email } });

  if (!existing) {
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
    console.log('[seed:admin] Created admin user:', created);
  } else {
    const updates: Record<string, unknown> = {};
    if (existing.role !== Role.ADMIN) {
      updates.role = Role.ADMIN;
    }
    if (resetPassword) {
      updates.password = await hashPassword(password);
    }

    if (Object.keys(updates).length === 0) {
      console.log('[seed:admin] User already exists and is ADMIN. No changes applied.');
    } else {
      const updated = await prisma.user.update({
        where: { email },
        data: updates,
        select: { id: true, email: true, name: true, role: true, createdAt: true },
      });
      console.log('[seed:admin] Updated user to ADMIN (and password reset if requested):', updated);
    }
  }
}

main()
  .catch((err) => {
    console.error('[seed:admin] Failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
