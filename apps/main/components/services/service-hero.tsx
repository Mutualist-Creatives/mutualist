"use client";

import React from "react";
import Image from "next/image";

interface ServiceHeroProps {
  title: string;
  subtitle?: string;
  imageSrc: string;
}

export function ServiceHero({ title, subtitle, imageSrc }: ServiceHeroProps) {
  return (
    <section className="w-full bg-white pt-34 pb-10 px-6 md:px-14 flex flex-col items-center text-center font-sans">
      {/* Hero Image */}
      <div className="relative w-full max-w-lg aspect-square md:aspect-[4/3] mb-6">
        <Image
          src={imageSrc}
          alt={`${title} Mascot`}
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* Title */}
      <h1 className="text-4xl md:text-6xl font-bold text-purple-mutu mb-4">
        {title}
      </h1>

      {/* Subtitle */}
      {subtitle && (
        <p className="text-lg md:text-xl font-medium text-black-mutu max-w-2xl">
          {subtitle}
        </p>
      )}
    </section>
  );
}
