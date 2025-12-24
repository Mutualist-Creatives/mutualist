import AboutHeroSection from "../../components/about/about-hero-section";
import RecognitionSection from "../../components/about/recognition-section";
import ReachUsSection from "../../components/about/reach-us-section";
import GallerySection from "../../components/about/gallery-section";

export default function AboutPage() {
  return (
    <main className="min-h-screen font-sans relative overflow-hidden">
      <AboutHeroSection />
      <RecognitionSection />
      <ReachUsSection />
      <GallerySection />
    </main>
  );
}
