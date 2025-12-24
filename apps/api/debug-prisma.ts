import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Testing Blog fetching...');
  try {
    const blogs = await prisma.blog.findMany();
    console.log('Success! Blogs found:', blogs.length);
    console.log(JSON.stringify(blogs, null, 2));
  } catch (e) {
    console.error('Error fetching blogs:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
