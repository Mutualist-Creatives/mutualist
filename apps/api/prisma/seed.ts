import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const user = await prisma.user.upsert({
    where: { email: 'admin@mutualist.co' },
    update: {},
    create: {
      email: 'admin@mutualist.co',
      password: '$2b$10$YourHashedPasswordHere', // Change this!
      name: 'Admin',
    },
  });

  console.log('✅ Created user:', user.email);

  // Create portfolio items
  const portfolios = [
    {
      title: 'Project Alpha',
      createdBy: 'Creative Studio',
      year: '2023',
      category: 'Branding',
      description: 'A complete branding overhaul for a leading tech company.',
      images: ['/assets/portofolios/1.png'],
    },
    {
      title: 'Project Bravo',
      createdBy: 'Design Wizards',
      year: '2022',
      category: 'Web Design',
      description: 'Responsive and modern website design for a startup.',
      images: ['/assets/portofolios/2.png'],
    },
    {
      title: 'Project Charlie',
      createdBy: 'Pixel Perfect Inc.',
      year: '2023',
      category: 'Mobile App',
      description: 'Intuitive mobile application for the finance sector.',
      images: ['/assets/portofolios/3.png'],
    },
    {
      title: 'Project Delta',
      createdBy: 'Artisan Digital',
      year: '2021',
      category: 'Illustration',
      description:
        'A series of vibrant illustrations for a marketing campaign.',
      images: ['/assets/portofolios/4.png'],
    },
    {
      title: 'Project Echo',
      createdBy: 'Creative Studio',
      year: '2024',
      category: 'Branding',
      description: 'Brand identity development for a new fashion label.',
      images: ['/assets/portofolios/5.png'],
    },
    {
      title: 'Project Foxtrot',
      createdBy: 'Design Wizards',
      year: '2023',
      category: 'UI/UX',
      description: 'User experience design for e-commerce platform.',
      images: ['/assets/portofolios/6.png'],
    },
    {
      title: 'Project Golf',
      createdBy: 'Pixel Perfect Inc.',
      year: '2024',
      category: 'Photography',
      description: 'Professional photography for lifestyle brand.',
      images: ['/assets/portofolios/7.png'],
    },
  ];

  for (const portfolio of portfolios) {
    await prisma.portfolio.create({
      data: portfolio,
    });
  }

  console.log(`✅ Created ${portfolios.length} portfolio items`);
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
