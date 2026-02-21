"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { WhatComesWithMagic } from "@/components/services/what-comes-with-magic";
import { HowWeBringYourStoryToLife } from "@/components/services/how-we-bring-your-story-to-life";
import { FAQs } from "@/components/services/faqs";

export default function WebsiteDevelopmentPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Custom Hero Section */}
      <section className="w-full bg-white pt-34 pb-10 md:pb-16 px-6 md:px-14">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left: Label + Headline + CTA */}
          <div className="flex flex-col items-start">
            <span className="text-sm md:text-base text-black-mutu/60 font-medium mb-3 md:mb-4 font-sans">
              Website Development
            </span>
            <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold text-black-mutu leading-tight mb-6 md:mb-8 font-sans">
              &ldquo;Build websites that truly support your business &amp; win
              customers heart&rdquo;
            </h1>
            <Link
              href="/contact"
              className="inline-flex items-center px-6 py-3 rounded-full bg-green-mutu text-white font-medium text-sm md:text-base hover:bg-green-mutu/90 transition-colors"
            >
              Work with Us
            </Link>
          </div>

          {/* Right: Visual */}
          <div className="relative w-full aspect-square md:aspect-4/3 rounded-2xl overflow-hidden">
            <Image
              src="/assets/services/d.png"
              alt="Website Development"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </section>

      <WhatComesWithMagic category="website-development" />
      <HowWeBringYourStoryToLife category="website-development" />
      <FAQs category="website-development" />
    </main>
  );
}
