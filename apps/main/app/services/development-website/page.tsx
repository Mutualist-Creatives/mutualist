"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import ServiceWorks from "@/components/services/service-works";
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
              Development Website
            </span>
            <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold text-black-mutu leading-tight mb-6 md:mb-8 font-sans">
              &ldquo;Build websites that truly support your business &amp; win
              customers heart&rdquo;
            </h1>
            <Link
              href="https://wa.me/6287787242397"
              className="inline-block px-5 py-2.5 lg:px-8 lg:py-3 2xl:px-10 2xl:py-4 rounded-full bg-green-mutu text-yellow-mutu font-bold text-sm md:text-base lg:text-lg 2xl:text-xl hover:bg-purple-mutu transition-all duration-300 whitespace-nowrap"
            >
              Work with Us
            </Link>
          </div>

          {/* Right: Visual */}
          <div className="relative w-full aspect-square md:aspect-4/3 rounded-2xl overflow-hidden">
            <Image
              src="/assets/services/d.png"
              alt="Development Website"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </section>

      {/* Our Works */}
      <ServiceWorks
        serviceLabel="D"
        title="Our Works"
        ctaText="See All Website Works"
        ctaHref="/works?filter=D"
        limit={3}
      />

      <WhatComesWithMagic category="development-website" />
      <HowWeBringYourStoryToLife category="development-website" />

      {/* CTA Section */}
      <section className="w-full bg-white py-16 md:py-20 px-6 md:px-14">
        <div className="max-w-4xl mx-auto rounded-2xl py-12 md:py-16 px-8 md:px-16 flex flex-col items-center text-center">
          <h2 className="text-xl md:text-3xl lg:text-4xl font-medium text-purple-mutu leading-snug mb-4 md:mb-6 font-sans">
            Start build beautiful websites that care about you and your
            customer.
          </h2>
          <p className="text-sm md:text-base text-purple-mutu/60 mb-8 md:mb-10 font-instrument">
            Book a discovery call, get quick audit, firm price &amp; timeline
            without the hidden cost.
          </p>
          <Link
            href="https://wa.me/6287787242397"
            className="inline-block px-10 py-3 md:px-14 md:py-4 rounded-full bg-green-mutu text-yellow-mutu font-bold text-base md:text-lg hover:bg-purple-mutu transition-all duration-300"
          >
            Book a Call
          </Link>
        </div>
      </section>

      <FAQs category="development-website" />
    </main>
  );
}
