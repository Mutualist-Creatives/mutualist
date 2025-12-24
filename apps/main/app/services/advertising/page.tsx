"use client";

import React from "react";
import { ServiceHero } from "@/components/services/service-hero";
import { WhatComesWithMagic } from "@/components/services/what-comes-with-magic";
import { HowWeBringYourStoryToLife } from "@/components/services/how-we-bring-your-story-to-life";
import { FAQs } from "@/components/services/faqs";

export default function AdvertisingPage() {
  return (
    <main className="min-h-screen bg-white">
      <ServiceHero
        title="Advertising"
        subtitle="Not Just Likes. Build Real Engagement That Matters and Lasts."
        imageSrc="/assets/services/a.png"
      />
      <WhatComesWithMagic category="advertising" />
      <HowWeBringYourStoryToLife />
      <FAQs category="advertising" />
    </main>
  );
}
