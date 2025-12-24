"use client";

import React from "react";
import { ServiceHero } from "@/components/services/service-hero";
import { WhatComesWithMagic } from "@/components/services/what-comes-with-magic";
import { HowWeBringYourStoryToLife } from "@/components/services/how-we-bring-your-story-to-life";
import { FAQs } from "@/components/services/faqs";

export default function SocialMediaPage() {
  return (
    <main className="min-h-screen bg-white">
      <ServiceHero
        title="Social Media"
        subtitle="Connecting you with your audience through impactful content."
        imageSrc="/assets/services/s.png"
      />
      <WhatComesWithMagic category="social-media" />
      <HowWeBringYourStoryToLife />
      <FAQs category="social-media" />
    </main>
  );
}
