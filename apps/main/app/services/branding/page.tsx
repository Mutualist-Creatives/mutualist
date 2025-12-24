"use client";

import React from "react";
import { ServiceHero } from "@/components/services/service-hero";
import { WhatComesWithMagic } from "@/components/services/what-comes-with-magic";
import { HowWeBringYourStoryToLife } from "@/components/services/how-we-bring-your-story-to-life";
import { FAQs } from "@/components/services/faqs";

export default function BrandingPage() {
  return (
    <main className="min-h-screen bg-white">
      <ServiceHero
        title="Branding"
        subtitle="Crafting unique identities that resonate with your audience."
        imageSrc="/assets/services/b.png"
      />
      <WhatComesWithMagic category="branding" />
      <HowWeBringYourStoryToLife />
      <FAQs category="branding" />
    </main>
  );
}
