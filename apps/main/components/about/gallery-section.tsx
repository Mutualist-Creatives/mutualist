"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Image from "next/image";

// Using placeholder images for the gallery
const items = [
  {
    image: "/assets/home/folder/advertising/1.png",
    transform: "rotate(2deg) translate(-240px)",
  },
  {
    image: "/assets/home/folder/branding/1.png",
    transform: "rotate(1deg) translate(-120px)",
  },
  {
    image: "/assets/home/folder/character/1.png",
    transform: "rotate(-1deg)",
  },
  {
    image: "/assets/home/folder/social media/1.png",
    transform: "rotate(-2deg) translate(120px)",
  },
  {
    image: "/assets/home/folder/advertising/2.png",
    transform: "rotate(1deg) translate(240px)",
  },
];

export default function GallerySection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".gallery-card",
        { scale: 0 },
        {
          scale: 1,
          stagger: 0.06,
          ease: "elastic.out(1, 0.8)",
          delay: 0.5,
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const getNoRotationTransform = (transformStr: string): string => {
    const hasRotate = /rotate\([\s\S]*?\)/.test(transformStr);
    if (hasRotate) {
      return transformStr.replace(/rotate\([\s\S]*?\)/, "rotate(0deg)");
    } else if (transformStr === "none") {
      return "rotate(0deg)";
    } else {
      return `${transformStr} rotate(0deg)`;
    }
  };

  const getPushedTransform = (
    baseTransform: string,
    offsetX: number
  ): string => {
    const translateRegex = /translate\(([-0-9.]+)px\)/;
    const match = baseTransform.match(translateRegex);
    if (match) {
      const currentX = parseFloat(match[1]);
      const newX = currentX + offsetX;
      return baseTransform.replace(translateRegex, `translate(${newX}px)`);
    } else {
      return baseTransform === "none"
        ? `translate(${offsetX}px)`
        : `${baseTransform} translate(${offsetX}px)`;
    }
  };

  const pushSiblings = (hoveredIdx: number) => {
    items.forEach((item, i) => {
      gsap.killTweensOf(`.gallery-card-${i}`);

      const baseTransform = item.transform || "none";

      if (i === hoveredIdx) {
        const noRotation = getNoRotationTransform(baseTransform);
        gsap.set(`.gallery-card-${i}`, { zIndex: 50 });
        gsap.to(`.gallery-card-${i}`, {
          transform: noRotation,
          scale: 1.1,
          duration: 0.4,
          ease: "back.out(1.4)",
          overwrite: "auto",
        });
      } else {
        const offsetX = i < hoveredIdx ? -260 : 260;
        const pushedTransform = getPushedTransform(baseTransform, offsetX);

        const distance = Math.abs(hoveredIdx - i);
        const delay = distance * 0.05;

        gsap.set(`.gallery-card-${i}`, { zIndex: 10 });
        gsap.to(`.gallery-card-${i}`, {
          transform: pushedTransform,
          scale: 0.9,
          duration: 0.4,
          ease: "back.out(1.4)",
          delay,
          overwrite: "auto",
        });
      }
    });
  };

  const resetSiblings = () => {
    items.forEach((item, i) => {
      gsap.killTweensOf(`.gallery-card-${i}`);
      const baseTransform = item.transform || "none";
      gsap.to(`.gallery-card-${i}`, {
        transform: baseTransform,
        zIndex: 10,
        scale: 1,
        duration: 0.4,
        ease: "back.out(1.4)",
        overwrite: "auto",
      });
    });
  };

  return (
    <section className="w-full py-20 bg-cream-mutu flex flex-col items-center justify-center relative overflow-hidden">
      {/* Title */}
      {/* Title */}
      <div className="w-full max-w-6xl px-6 md:px-14 mb-12 z-20 relative">
        <h2 className="text-4xl md:text-6xl font-bold text-purple-mutu text-left">
          Gallery
        </h2>
      </div>

      {/* Gallery Cards */}
      <div
        ref={containerRef}
        className="relative w-full max-w-6xl h-[400px] flex items-center justify-center z-10"
      >
        {items.map((item, index) => (
          <div
            key={index}
            className={`
              gallery-card gallery-card-${index}
              absolute w-96 h-64 rounded-xl shadow-lg cursor-pointer
              bg-white overflow-hidden
              flex items-center justify-center
            `}
            style={{ transform: item.transform }}
            onMouseEnter={() => pushSiblings(index)}
            onMouseLeave={resetSiblings}
          >
            <Image
              src={item.image}
              alt={`Gallery Image ${index + 1}`}
              width={384}
              height={256}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Mascot */}
      <div className="absolute bottom-[-10%] right-[5%] w-[200px] md:w-[275px] z-30 pointer-events-none">
        <Image
          src="/assets/about/gallery/gallery_mascot.png"
          alt="Gallery Mascot"
          width={400}
          height={400}
          className="w-full h-auto object-contain"
        />
      </div>
    </section>
  );
}
