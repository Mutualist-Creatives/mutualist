import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Hash password
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const supabaseUrl = process.env.SUPABASE_URL;
  if (!supabaseUrl) {
    console.warn(
      '⚠️ SUPABASE_URL not found in environment. Using placeholder.',
    );
  }
  const storageBaseUrl = supabaseUrl
    ? `${supabaseUrl}/storage/v1/object/public`
    : 'https://placeholder.supabase.co/storage/v1/object/public';

  // Create admin user
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

  /*
  // Create life portfolio items
  const portfolios = [
    {
      title: 'Project Alpha',
      createdBy: 'Creative Studio',
      year: '2023',
      categories: ['Branding'],
      description: 'A complete branding overhaul for a leading tech company.',
      images: [`${storageBaseUrl}/portfolio-images/1.png`],
    },
    {
      title: 'Project Bravo',
      createdBy: 'Design Wizards',
      year: '2022',
      categories: ['Web Design'],
      description: 'Responsive and modern website design for a startup.',
      images: [`${storageBaseUrl}/portfolio-images/2.png`],
    },
    {
      title: 'Project Charlie',
      createdBy: 'Pixel Perfect Inc.',
      year: '2023',
      categories: ['Mobile App'],
      description: 'Intuitive mobile application for the finance sector.',
      images: [`${storageBaseUrl}/portfolio-images/3.png`],
    },
    {
      title: 'Project Delta',
      createdBy: 'Artisan Digital',
      year: '2021',
      categories: ['Illustration'],
      description:
        'A series of vibrant illustrations for a marketing campaign.',
      images: [`${storageBaseUrl}/portfolio-images/4.png`],
    },
    {
      title: 'Project Echo',
      createdBy: 'Creative Studio',
      year: '2024',
      categories: ['Branding'],
      description: 'Brand identity development for a new fashion label.',
      images: [`${storageBaseUrl}/portfolio-images/5.png`],
    },
    {
      title: 'Project Foxtrot',
      createdBy: 'Design Wizards',
      year: '2023',
      categories: ['UI/UX'],
      description: 'User experience design for e-commerce platform.',
      images: [`${storageBaseUrl}/portfolio-images/6.png`],
    },
    {
      title: 'Project Golf',
      createdBy: 'Pixel Perfect Inc.',
      year: '2024',
      categories: ['Photography'],
      description: 'Professional photography for lifestyle brand.',
      images: [`${storageBaseUrl}/portfolio-images/7.png`],
    },
  ];

  for (const portfolio of portfolios) {
    await prisma.lifePortfolio.create({
      data: portfolio,
    });
  }

  console.log(`✅ Created ${portfolios.length} portfolio items`);
  */

  /*
  // Create blogs
  const blogs = [
    {
      slug: 'why-professional-business-cards-still-matter',
      title: 'Why Professional Business Cards Still Matter',
      category: 'Advertising',
      date: 'August 4, 2025',
      image: `${storageBaseUrl}/blogs/client/1.png`, // Using Supabase URL
      rotation: -2,
      content: `
        <p>Effective business branding is what comes to mind when you hear words like "fast food" or "e-commerce." For fast food, you immediately think of McDonald's and its iconic golden arches, which you can easily recall. When we talk about the booming e-commerce market, a certain orange logo accompanied by a catchy Korean song might pop into your head. Why does this happen? Because these brands have successfully embedded themselves in your mind through constant exposure and a clear, consistent identity. Here is a guide on how to enhance your company's branding, so it resonates with consumers and builds lasting loyalty.</p>

        <h2>The Foundation of Business Branding: Product Quality</h2>
        <p>The quality of a product is one of the most critical factors for consumers. Reputable companies with a proven track record of quality will always be chosen over products from lesser-known businesses. Think about a major mineral water brand; its distinctive logo is so well-known that we often use the brand name as a generic term for mineral water itself. This demonstrates the power of a brand built on a foundation of trust and consistent quality. It is crucial to maintain and continually improve your product quality while also keeping an eye on the quality of your competitors' offerings.</p>

        <h3>1. Why Quality is the Cornerstone of Your Business?</h3>
        <p>If you don't have a high-quality product, you can't expect your branding efforts to be successful. No amount of clever marketing or beautiful packaging can compensate for a poor-quality product. A product's quality is the core of its value proposition. When you consistently deliver excellence, your brand's reputation grows organically. This directly impacts customer satisfaction and loyalty. By ensuring your product is superior, you are not just selling an item; you are selling trust and a positive experience, which are the most valuable assets in building a brand.</p>

        <h3>2. Measuring and Improving Quality for Your Business</h3>
        <p>To maintain a competitive edge, you must continuously measure and improve your product quality. This involves gathering customer feedback through surveys, reviews, and direct communication. Use this data to identify pain points and areas for improvement. Investing in quality control processes is not an expense—it's a direct investment in your business branding. A commitment to excellence shows your customers that you care about their satisfaction, which reinforces their loyalty and encourages positive word-of-mouth recommendations.</p>
      `,
    },
    {
      slug: 'boost-your-business-branding-win-customer-loyalty',
      title: 'Boost Your Business Branding & Win Customer Loyalty',
      category: 'Branding',
      date: 'August 3, 2025',
      image: `${storageBaseUrl}/blogs/client/2.png`,
      rotation: 1,
      content: `
        <p>Building customer loyalty is essential for long-term success. A strong brand identity helps customers connect with your business on an emotional level.</p>
        <h2>Strategies for Loyalty</h2>
        <p>Consistency is key. Ensure your messaging, visuals, and customer service are aligned across all channels. Loyalty programs and personalized experiences also go a long way in retaining customers and turning them into brand advocates.</p>
      `,
    },
    {
      slug: 'benefits-of-website-for-business',
      title: 'The Benefits of a Website for Business in the Digital Age',
      category: 'Advertising',
      date: 'August 2, 2025',
      image: `${storageBaseUrl}/blogs/client/3.png`,
      rotation: -1,
      content: `
        <p>In today's digital world, having a website is non-negotiable. It serves as your 24/7 storefront and a primary touchpoint for potential customers.</p>
        <h2>Global Reach</h2>
        <p>A website allows you to reach a global audience, breaking down geographical barriers. It also builds credibility and provides a platform to showcase your products or services, share testimonials, and engage with your audience through content marketing.</p>
      `,
    },
    {
      slug: 'future-of-digital-marketing-2025',
      title: 'The Future of Digital Marketing in 2025',
      category: 'Marketing',
      date: 'July 28, 2025',
      image: `${storageBaseUrl}/blogs/client/4.png`,
      rotation: 2,
      content: `
        <p>As we approach 2026, digital marketing continues to evolve at a rapid pace. Artificial Intelligence (AI) and Machine Learning (ML) are taking center stage.</p>
        <h2>Hyper-Personalization</h2>
        <p>Consumers now expect hyper-personalized experiences. Brands that leverage data to deliver tailored content and offers will see higher conversion rates. Voice search optimization and interactive content are also trends to watch closely.</p>
      `,
    },
    {
      slug: 'design-trends-to-watch',
      title: 'Design Trends to Watch This Year',
      category: 'Design',
      date: 'July 20, 2025',
      image: `${storageBaseUrl}/blogs/client/5.png`,
      rotation: -1.5,
      content: `
        <p>Minimalism remains strong, but we are seeing a resurgence of bold colors and experimental typography. Sustainability in design is also becoming a priority.</p>
        <h2>Sustainable Design</h2>
        <p>From eco-friendly packaging to energy-efficient digital assets, sustainable design is not just a trend but a necessity. Brands are adopting earthy tones and organic shapes to reflect their commitment to the environment.</p>
      `,
    },
    {
      slug: 'remote-work-culture-success',
      title: 'Building a Successful Remote Work Culture',
      category: 'Culture',
      date: 'July 15, 2025',
      image: `${storageBaseUrl}/blogs/client/6.png`,
      rotation: 0.5,
      content: `
        <p>Remote work is here to stay. But how do you maintain a strong company culture when your team is scattered across the globe?</p>
        <h2>Communication & trust</h2>
        <p>Clear communication channels and a culture of trust are the pillars of successful remote teams. Regular virtual check-ins, team-building activities, and respecting work-life balance are essential strategies.</p>
      `,
    },
  ];

  for (const blog of blogs) {
    await prisma.blog.upsert({
      where: { slug: blog.slug },
      update: { content: blog.content }, // FORCE UPDATE CONTENT
      create: blog,
    });
  }

  console.log(`✅ Created ${blogs.length} blog posts`);
  */
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
