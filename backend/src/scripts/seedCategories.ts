// src/scripts/seedCategories.ts
// Creates default product categories for the e-commerce store
// Run this once to populate categories before adding products

import 'dotenv/config';
import { prisma } from '../config/prisma';

const categories = [
  { name: 'Lingerie' },
  { name: 'Conjuntos' },
  { name: 'Calcinhas' },
  { name: 'Linha Noite' },
  { name: 'Plus Size' },
  { name: 'Body' },
  { name: 'Cinta Liga' },
];

async function main() {
  console.log('[seed:categories] Creating default categories...');
  
  for (const category of categories) {
    const existing = await prisma.category.findUnique({
      where: { name: category.name }
    });
    
    if (!existing) {
      const created = await prisma.category.create({
        data: category,
        select: { id: true, name: true, createdAt: true }
      });
      console.log(`[seed:categories] Created: ${created.name} (${created.id})`);
    } else {
      console.log(`[seed:categories] Already exists: ${existing.name} (${existing.id})`);
    }
  }
  
  console.log('[seed:categories] Done!');
}

main()
  .catch((err) => {
    console.error('[seed:categories] Failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
