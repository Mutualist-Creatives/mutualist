import React from "react";

export default function AboutHeroSection() {
  return (
    <section className="w-full bg-cream-mutu">
      {/* Video Background Placeholder */}
      <div className="relative w-full h-[40vh] overflow-hidden">
        <video
          className="w-full h-full object-cover opacity-50"
          autoPlay
          muted
          loop
          playsInline
        >
          {/* <source src="/path/to/video.mp4" type="video/mp4" /> */}
          Your browser does not support the video tag.
        </video>
        {/* Fallback/Overlay if video is missing or loading */}
        <div className="absolute inset-0 bg-cream-mutu/50" />
      </div>

      {/* Content */}
      <div className="w-full py-20 md:py-32 px-6 md:px-14 flex justify-center text-center">
        <h1 className="max-w-3xl text-xl md:text-2xl lg:text-2xl font-bold text-purple-mutu leading-relaxed">
          It&apos;s mutual. We&apos;re a creative design studio that helps you
          to make sense of your world. Let&apos;s make something together.
          Rooted in storytelling and guided by intention, we believe great
          design isn&apos;t just seen, it&apos;s felt.
        </h1>
      </div>
    </section>
  );
}
