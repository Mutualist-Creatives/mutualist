import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  const hashedPassword = await bcrypt.hash('admin123', 10);

  const user = await prisma.user.upsert({
    where: { email: 'admin@mutualist.co' },
    update: {
      password: hashedPassword,
      role: Role.ADMIN,
    },
    create: {
      email: 'admin@mutualist.co',
      password: hashedPassword,
      name: 'Admin',
      role: Role.ADMIN,
    },
  });

  console.log('✅ Created user:', user.email);
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
