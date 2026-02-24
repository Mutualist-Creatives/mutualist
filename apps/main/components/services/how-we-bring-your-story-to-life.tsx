"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const defaultSteps = [
  {
    id: 1,
    image: "/assets/services/how-we-bring-your-story-to-life/1.png",
    description: "Tell Your Dreams with Discovery Call",
  },
  {
    id: 2,
    image: "/assets/services/how-we-bring-your-story-to-life/2.png",
    description: "We\u2019ll Customize The Solution for You",
  },
  {
    id: 3,
    image: "/assets/services/how-we-bring-your-story-to-life/3.png",
    description: "Developing the Research and Design",
  },
  {
    id: 4,
    image: "/assets/services/how-we-bring-your-story-to-life/4.png",
    description: "Get Real Impact from New Design",
  },
];

const websiteSteps = [
  {
    id: 1,
    image: "/assets/services/the-right-process-the-right-outcome/1.png",
    description:
      "We\u2019ll start by understanding your business, brand, product & customer",
  },
  {
    id: 2,
    image: "/assets/services/the-right-process-the-right-outcome/2.png",
    description:
      "We tailor the user experience & journey specific to your case",
  },
  {
    id: 3,
    image: "/assets/services/the-right-process-the-right-outcome/3.png",
    description: "We craft visuals with brand & scalability in mind",
  },
  {
    id: 4,
    image: "/assets/services/the-right-process-the-right-outcome/4.png",
    description:
      "Then we\u2019ll start building your site with the right technology.",
  },
  {
    id: 5,
    image: "/assets/services/the-right-process-the-right-outcome/5.png",
    description: "Finally, we\u2019ll launch your website!",
  },
];

interface HowWeBringYourStoryToLifeProps {
  category?: string;
}

export function HowWeBringYourStoryToLife({
  category,
}: HowWeBringYourStoryToLifeProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isWebsite = category === "development-website";
  const activeSteps = isWebsite ? websiteSteps : defaultSteps;
  const title = isWebsite
    ? "\u201CThe right process = the right outcome\u201D"
    : "How We Bring Your Story to Life";

  useGSAP(
    () => {
      const balls = gsap.utils.toArray<HTMLElement>(".roll-in-ball");
      const texts = gsap.utils.toArray<HTMLElement>(".pop-in-text");

      // Initial state
      gsap.set(balls, {
        x: -1000,
        rotation: -360,
        opacity: 0,
      });

      gsap.set(texts, {
        opacity: 0,
        scale: 0.5,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "center center",
          toggleActions: "play none none reverse",
        },
      });

      // Animation: Balls roll in
      tl.to(balls, {
        x: 0,
        rotation: 0,
        opacity: 1,
        duration: 1.5,
        stagger: 0.2,
        ease: "power2.out",
      });

      // Animation: Text pops in
      tl.to(
        texts,
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          stagger: 0.2,
          ease: "back.out(1.7)",
        },
        1.5,
      );
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="w-full bg-cream-mutu py-20 px-6 md:px-14 overflow-hidden"
    >
      <div className="flex flex-col items-center max-w-7xl mx-auto">
        {/* Title */}
        <h2 className="text-xl md:text-3xl lg:text-5xl font-medium text-purple-mutu mb-12 md:mb-20 text-center font-sans">
          {title}
        </h2>

        {/* Steps Container */}
        <div
          className={`grid gap-y-16 md:gap-3 lg:gap-10 w-full place-items-center ${
            isWebsite
              ? "grid-cols-2 md:grid-cols-5"
              : "grid-cols-2 md:grid-cols-4"
          }`}
        >
          {activeSteps.map((step) => (
            <div
              key={step.id}
              className="flex flex-col items-center text-center w-full"
            >
              {/* Image (Ball) */}
              <div className="roll-in-ball relative w-28 h-28 md:w-22 md:h-22 lg:w-30 lg:h-30 mb-4 md:mb-4 lg:mb-8 rounded-full bg-white flex items-center justify-center p-4 z-10">
                <div className="relative w-full h-full">
                  <Image
                    src={step.image}
                    alt={`Step ${step.id}`}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Description */}
              <p className="pop-in-text text-sm md:text-xs lg:text-lg font-medium text-[#8B1D4F] w-full max-w-[150px] md:max-w-[110px] lg:max-w-[200px] leading-tight">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
