"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const serviceData = {
  advertising: [
    {
      id: 1,
      image: "/assets/services/advertising/1.png",
      title: "Be Seen, Be Clicked,Be Remembered",
      description:
        "Scroll-stopping digital ads, thoughtfully designed and optimized for Meta, Google, and TikTok. Built to convert impressions into clicks.",
    },
    {
      id: 2,
      image: "/assets/services/advertising/2.png",
      title: "Let Them See You Again and Again",
      description:
        "High-impact billboard/OOH designs, street banners, and printed ads that keep your business visible in daily public spaces.",
    },
    {
      id: 3,
      image: "/assets/services/advertising/3.png",
      title: "Design Experiences People Talk About",
      description:
        "We craft event visuals, from stage design and signage to kits and gimmicks, that turn your moment into something worth sharing.",
    },
  ],
  branding: [
    {
      id: 1,
      image: "/assets/services/branding/1.png",
      title: "Stand Out Without Saying a Word",
      description:
        "Distinctive logos, signature colors, and cohesive visual systems that make your brand instantly recognizable. No explanation needed.",
    },
    {
      id: 2,
      image: "/assets/services/branding/2.png",
      title: "Trust Starts with Consistency",
      description:
        "Cohesive brand collaterals and clear, consistent guidelines that build lasting reliability and trust through every brand experience.",
    },
    {
      id: 3,
      image: "/assets/services/branding/3.png",
      title: "They Think of X, They Think of You",
      description:
        "You’re the first name that comes to mind. A focused identity and clear visuals that keep your brand relevant and recognizable.",
    },
  ],
  "character-design": [
    {
      id: 1,
      image: "/assets/services/character-design/1.png",
      title: "Give Your Brand a Lovable Face",
      description:
        "We design mascots that embody your brand’s personality, making it more relatable, memorable, and emotionally engaging.",
    },
    {
      id: 2,
      image: "/assets/services/character-design/2.png",
      title: "Stories Start with Great Characters",
      description:
        "From animation to games, we craft characters with depth and appeal. Built to carry stories, spark imagination, and grow with your universe.",
    },
    {
      id: 3,
      image: "/assets/services/character-design/3.png",
      title: "Make Learning Feel Like Play",
      description:
        "Our characters turn lessons into joyful experiences. making education more interactive, friendly, and effective for young minds.",
    },
  ],
  "social-media": [
    {
      id: 1,
      image: "/assets/services/social-media/1.png",
      title: "Custom Visuals Made Just for You",
      description:
        "Tailored photos and designs that represent your brand’s unique identity. No templates, just authentic visuals crafted for you.",
    },
    {
      id: 2,
      image: "/assets/services/social-media/2.png",
      title: "Always Show Up at The Right Time",
      description:
        "Our content planning ensures your posts reach your audience at peak times, maximizing engagement, visibility, and long-term impact.",
    },
    {
      id: 3,
      image: "/assets/services/social-media/3.png",
      title: "Know What Works and Do More of It",
      description:
        "Detailed monthly performance reports analyze your social media to refine strategies and focus on what drives the best results.",
    },
  ],
};

type ServiceCategory = keyof typeof serviceData;

interface WhatComesWithMagicProps {
  category: ServiceCategory;
}

export function WhatComesWithMagic({ category }: WhatComesWithMagicProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const cards = serviceData[category];

  useGSAP(
    () => {
      if (!cardsRef.current) return;

      const cards = gsap.utils.toArray<HTMLElement>(cardsRef.current.children);

      // Initial state: Stacked in center
      gsap.set(cards, {
        x: 0,
        rotation: 0,
      });

      // Animation: Spread out
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top center",
          end: "center center",
          scrub: 1,
        },
      });

      // Card 1: Left, rotate -5deg
      tl.to(
        cards[0],
        {
          x: -350,
          rotation: -5,
          duration: 1,
        },
        0
      );

      // Card 2: Center, no rotation (or slight adjustment)
      tl.to(
        cards[1],
        {
          x: 0,
          rotation: 0,
          y: -20, // Slight visual pop
          duration: 1,
        },
        0
      );

      // Card 3: Right, rotate 5deg
      tl.to(
        cards[2],
        {
          x: 350,
          rotation: 5,
          duration: 1,
        },
        0
      );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="w-full bg-purple-mutu py-20 px-6 md:px-14 overflow-hidden relative"
    >
      <div className="flex flex-col items-center">
        {/* Section Title */}
        <h2 className="text-3xl md:text-5xl font-medium text-yellow-mutu mb-20 text-center font-sans">
          What Comes with the Magic?
        </h2>

        {/* Cards Container */}
        {/* Initially stacked relative, so we use a container with height */}
        <div
          ref={cardsRef}
          className="relative w-full max-w-6xl h-[500px] flex justify-center items-center"
        >
          {cards.map((card, index) => (
            <div
              key={card.id}
              className="absolute top-0 w-[300px] md:w-[350px] bg-white rounded-2xl p-6 shadow-xl flex flex-col items-center text-center h-auto min-h-[450px]"
              style={{ zIndex: cards.length - index }}
            >
              {/* Image */}
              <div className="w-full h-48 relative mb-6">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-contain"
                />
              </div>

              {/* Title */}
              <h3 className="w-[70%] text-xl font-medium text-[#8B1D4F] mb-4 leading-tight">
                {card.title}
              </h3>

              {/* Description */}
              <p className="w-full text-sm font-medium text-black-mutu leading-relaxed">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
