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
      title: "Be Seen, Be Clicked, Be Remembered",
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
      // Responsive animation logic
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        // Desktop
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top center",
            end: "center center",
            scrub: 1,
          },
        });
        tl.to(cards[0], { x: -350, rotation: -5, duration: 1 }, 0)
          .to(cards[1], { x: 0, rotation: 0, y: -20, duration: 1 }, 0)
          .to(cards[2], { x: 350, rotation: 5, duration: 1 }, 0);
      });

      mm.add("(min-width: 768px) and (max-width: 1023px)", () => {
        // Tablet (reduced spread)
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top center",
            end: "center center",
            scrub: 1,
          },
        });
        tl.to(cards[0], { x: -220, rotation: -5, duration: 1 }, 0)
          .to(cards[1], { x: 0, rotation: 0, y: -20, duration: 1 }, 0)
          .to(cards[2], { x: 220, rotation: 5, duration: 1 }, 0);
      });

      mm.add("(max-width: 767px)", () => {
        // Mobile: Sequential Slide-out "Deck" Animation
        gsap.set(cards, { clearProps: "all" });
        gsap.set(cards, { zIndex: (i) => 30 - i * 10 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "bottom 60%", // Animate while scrolling through the section
            scrub: 1, // Animation progress tailored to scroll
          },
        });

        // Card 1: Static from start (Already tilted)
        gsap.set(cards[0], { rotation: -6 });

        // Card 2: Slides out smoothly from behind Card 1 (No fade)
        tl.fromTo(
          cards[1],
          { y: -150, opacity: 1, rotation: 0 }, // Visibly behind Card 1
          { y: 0, opacity: 1, rotation: 0, duration: 0.6, ease: "power2.out" },
          0, // Start immediately on scroll
        );

        // Card 3: Slides out smoothly from behind Card 2 (No fade)
        tl.fromTo(
          cards[2],
          { y: -150, opacity: 1, rotation: 0 },
          { y: 0, opacity: 1, rotation: -4, duration: 0.6, ease: "power2.out" },
          "<+=0.2",
        );
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="w-full bg-purple-mutu py-20 px-6 md:px-14 overflow-hidden relative"
    >
      <div className="flex flex-col items-center">
        {/* Section Title */}
        <h2 className="text-xl md:text-3xl lg:text-5xl font-medium text-yellow-mutu mb-12 md:mb-20 text-center font-sans">
          What Comes with the Magic?
        </h2>

        {/* Cards Container */}
        {/* Initially stacked relative, so we use a container with height */}
        <div
          ref={cardsRef}
          className="relative w-full max-w-6xl h-auto md:h-[300px] lg:h-[450px] flex flex-col md:flex-row justify-center items-center md:space-y-0 gap-0"
        >
          {cards.map((card, index) => (
            <div
              key={card.id}
              className={`relative md:absolute top-0 w-full md:w-[210px] lg:w-[350px] bg-white rounded-2xl p-6 md:p-4 lg:p-6 shadow-[0_3.5px_5.5px_0_rgba(0,0,0,0.4)] flex flex-col items-center text-center h-auto md:h-full ${
                index === 1
                  ? "-mt-6 md:mt-0"
                  : index === 2
                    ? "-mt-2 md:mt-0"
                    : "mt-0"
              }`}
              style={{ zIndex: 30 - index * 10 }}
            >
              {/* Image */}
              <div className="w-full h-48 md:h-28 lg:h-48 relative mb-6 md:mb-4 lg:mb-6">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-contain"
                />
              </div>

              {/* Title */}
              <h3 className="w-[70%] text-xl md:text-base lg:text-xl font-medium text-[#8B1D4F] mb-4 md:mb-2 lg:mb-4 leading-tight font-sans">
                {card.title}
              </h3>

              {/* Description */}
              <p className="w-full text-sm md:text-[10px] lg:text-sm font-medium text-black-mutu leading-relaxed font-instrument">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
