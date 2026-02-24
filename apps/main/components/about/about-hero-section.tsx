import React from "react";

export default function AboutHeroSection() {
  return (
    <section className="w-full relative overflow-hidden bg-cream-mutu">
      {/* Video Background — Portrait for mobile, Landscape for desktop */}
      <div className="w-full">
        {/* Mobile: Portrait video */}
        <video
          className="w-full opacity-50 md:hidden"
          autoPlay
          muted
          loop
          playsInline
        >
          <source
            src="/assets/about/hero/(1080x1920) Mutualist_Motion web New.mp4"
            type="video/mp4"
          />
        </video>
        {/* Desktop: Landscape video */}
        <video
          className="w-full opacity-50 hidden md:block"
          autoPlay
          muted
          loop
          playsInline
        >
          <source
            src="/assets/about/hero/(1920x1080) Mutualist_Motion.mp4"
            type="video/mp4"
          />
        </video>
        {/* Fallback/Overlay */}
        <div className="absolute inset-0 bg-cream-mutu/20" />
      </div>

      {/* Content */}
      <div className="absolute bottom-0 z-10 w-full flex items-end justify-center px-4 md:px-8 lg:px-12 xl:px-16 2xl:px-24 pb-20 text-center">
        <h1 className="max-w-xs md:max-w-xl lg:max-w-3xl text-sm md:text-xl lg:text-2xl font-medium text-purple-mutu leading-relaxed font-instrument">
          Mutualist Creatives is a design studio that blends bold ideas with
          clear strategy to help brands grow with purpose. Rooted in
          storytelling and guided by intention, we believe great design
          isn&apos;t just seen, it&apos;s felt.
        </h1>
      </div>
    </section>
  );
}
