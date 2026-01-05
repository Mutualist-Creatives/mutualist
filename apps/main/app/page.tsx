import HeroSection from "../components/home/hero-section";
import FolderSection from "../components/home/folder-section";
import FeaturedPortfolioSection from "../components/home/featured-portfolio-section";
import SeeMoreWorks from "../components/home/see-more-works";
import ClientSection from "../components/home/client-section";
import SlingshotSection from "../components/home/slingshot-section";
import CTASection from "../components/home/cta-section";

import { fetchWorks, Work } from "../services/api";

export default async function Home() {
  const allWorks = await fetchWorks();
  const featuredWorks = allWorks
    .filter((work: Work) => work.isFeatured)
    .slice(0, 5);

  return (
    <div className="min-h-screen font-sans relative overflow-hidden">
      <HeroSection />
      <FolderSection />
      <SlingshotSection />
      <FeaturedPortfolioSection works={featuredWorks} />
      <SeeMoreWorks />
      <ClientSection />
      <CTASection />
    </div>
  );
}
