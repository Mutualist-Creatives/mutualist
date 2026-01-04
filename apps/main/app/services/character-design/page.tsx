"use client";

import React from "react";
import { ServiceHero } from "@/components/services/service-hero";
import { WhatComesWithMagic } from "@/components/services/what-comes-with-magic";
import { HowWeBringYourStoryToLife } from "@/components/services/how-we-bring-your-story-to-life";
import { FAQs } from "@/components/services/faqs";

export default function CharacterDesignPage() {
  return (
    <main className="min-h-screen bg-white">
      <ServiceHero
        title="Character Design"
        subtitle="Designing Faces That Tell Stories."
        imageSrc="/assets/services/c.png"
      />
      <WhatComesWithMagic category="character-design" />
      <HowWeBringYourStoryToLife />
      <FAQs category="character-design" />
    </main>
  );
}
