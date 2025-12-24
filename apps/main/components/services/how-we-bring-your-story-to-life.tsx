"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    id: 1,
    image: "/assets/services/how-we-bring-your-story-to-life/1.png",
    description: "Tell Your Dreams with Discovery Call",
  },
  {
    id: 2,
    image: "/assets/services/how-we-bring-your-story-to-life/2.png",
    description: "We'll Customize The Solution for You",
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

export function HowWeBringYourStoryToLife() {
  const sectionRef = useRef<HTMLDivElement>(null);
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

      // Animation: Text pops in (starts after first ball finishes, synchronized via stagger)
      // duration of ball is 1.5. Text should start appearing for first ball at 1.5
      tl.to(
        texts,
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          stagger: 0.2,
          ease: "back.out(1.7)", // Pop effect
        },
        1.5 // Absolute start time to match ball completion
      );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="w-full bg-cream-mutu py-20 px-6 md:px-14 overflow-hidden"
    >
      <div className="flex flex-col items-center max-w-7xl mx-auto">
        {/* Title */}
        <h2 className="text-3xl md:text-5xl font-medium text-purple-mutu mb-20 text-center font-sans">
          How We Bring Your Story to Life
        </h2>

        {/* Steps Container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 w-full">
          {steps.map((step) => (
            <div
              key={step.id}
              className="flex flex-col items-center text-center"
            >
              {/* Image (Ball) */}
              <div className="roll-in-ball relative w-40 h-40 mb-8 rounded-full bg-white flex items-center justify-center p-4 z-10">
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
              <p className="pop-in-text text-lg font-medium text-[#8B1D4F] max-w-[200px] leading-tight">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
