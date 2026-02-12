import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Testing MutualistBlog fetching...');
  try {
    const blogs = await prisma.mutualistBlog.findMany();
    console.log('Success! MutualistBlogs found:', blogs.length);
    console.log(JSON.stringify(blogs, null, 2));
  } catch (e) {
    console.error('Error fetching mutualist blogs:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
