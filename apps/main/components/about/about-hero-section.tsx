import React from "react";

export default function AboutHeroSection() {
  return (
    <section className="w-full h-[70vh] relative overflow-hidden bg-cream-mutu">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        <video
          className="w-full h-full object-cover opacity-50"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/assets/about/hero/video_1.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Fallback/Overlay */}
        <div className="absolute inset-0 bg-cream-mutu/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full h-full flex items-end justify-center px-4 md:px-8 lg:px-12 xl:px-16 2xl:px-24 pb-20 text-center">
        <h1 className="max-w-xs md:max-w-xl lg:max-w-3xl text-sm md:text-xl lg:text-2xl font-medium text-purple-mutu leading-relaxed">
          Mutualist Creatives is a design studio that blends bold ideas with
          clear strategy to help brands grow with purpose. Rooted in
          storytelling and guided by intention, we believe great design
          isn&apos;t just seen, it&apos;s felt.
        </h1>
      </div>
    </section>
  );
}
