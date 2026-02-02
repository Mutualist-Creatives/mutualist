import AboutHeroSection from "../../components/about/about-hero-section";
import Script from "next/script";
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
      <Script id="conversion-event-snippet" strategy="afterInteractive">
        {`
          gtag('event', 'conversion', {'send_to': 'AW-17757960833/Tt0aCPramcgbEIH105NC'});
        `}
      </Script>
    </main>
  );
}
