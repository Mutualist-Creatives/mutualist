"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Image from "next/image";

// Combine the images from Gallery with the layout properties from Featured Portfolio
const items = [
  {
    image: "/assets/about/gallery/1.jpeg",
    color: "bg-purple-mutu",
    rotate: 2,
    x: -240,
  },
  {
    image: "/assets/about/gallery/2.jpeg",
    color: "bg-green-mutu",
    rotate: 1,
    x: -120,
  },
  {
    image: "/assets/about/gallery/3.jpeg",
    color: "bg-yellow-mutu",
    rotate: -1,
    x: 0,
  },
  {
    image: "/assets/about/gallery/4.jpeg",
    color: "bg-black-mutu",
    rotate: -2,
    x: 120,
  },
  {
    image: "/assets/about/gallery/5.jpeg",
    color: "bg-purple-mutu",
    rotate: 1,
    x: 240,
  },
];

export default function GallerySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scaleFactor, setScaleFactor] = useState(1);
  const [isSmall, setIsSmall] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setScaleFactor(0.35); // Mobile: Very dense
        setIsSmall(true);
      } else if (width < 1024) {
        setScaleFactor(0.65); // Tablet: Moderate density
        setIsSmall(true);
      } else {
        setScaleFactor(1); // Desktop: Full spread
        setIsSmall(false);
      }
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const getResponsiveTransform = (item: (typeof items)[0]) => {
    return item.x === 0
      ? `rotate(${item.rotate}deg)`
      : `rotate(${item.rotate}deg) translate(${item.x * scaleFactor}px)`;
  };

  const pushSiblings = (hoveredIdx: number) => {
    const pushOffset = isSmall ? 120 : 260;

    items.forEach((item, i) => {
      gsap.killTweensOf(`.gallery-card-${i}`);

      const baseTransform = getResponsiveTransform(item);

      if (i === hoveredIdx) {
        const noRotation = getNoRotationTransform(baseTransform);
        // Set z-index immediately to avoid glitch
        gsap.set(`.gallery-card-${i}`, { zIndex: 50 });
        gsap.to(`.gallery-card-${i}`, {
          transform: noRotation,
          scale: 1.1,
          duration: 0.4,
          ease: "back.out(1.4)",
          overwrite: "auto",
        });
      } else {
        const offsetX = i < hoveredIdx ? -pushOffset : pushOffset;
        const pushedTransform = getPushedTransform(baseTransform, offsetX);

        const distance = Math.abs(hoveredIdx - i);
        const delay = distance * 0.05;

        // Lower z-index for siblings
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
      const baseTransform = getResponsiveTransform(item);
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
    <section className="w-full py-20 bg-cream-mutu relative overflow-hidden">
      <div className="max-w-screen-2xl mx-auto w-full px-4 md:px-8 lg:px-12 xl:px-16 2xl:px-24 flex flex-col items-center justify-center relative">
        {/* Title */}
        <div className="w-full z-20 relative">
          <h2 className="text-3xl md:text-5xl font-bold text-purple-mutu text-left">
            Gallery
          </h2>
        </div>

        {/* Gallery Cards */}
        <div
          ref={containerRef}
          className="relative w-full max-w-6xl h-[180px] md:h-[280px] lg:h-[350px] flex items-center justify-center z-10"
        >
          {items.map((item, index) => (
            <div
              key={index}
              className={`
                gallery-card gallery-card-${index}
                absolute w-40 h-28 md:w-60 md:h-40 lg:w-80 lg:h-56 xl:w-96 xl:h-64 rounded-xl shadow-lg cursor-pointer
                ${item.color} overflow-hidden
                flex items-center justify-center
              `}
              style={{ transform: getResponsiveTransform(item) }}
              onMouseEnter={() => pushSiblings(index)}
              onMouseLeave={resetSiblings}
            >
              {item.image && (
                <Image
                  src={item.image}
                  alt={`Gallery Image ${index + 1}`}
                  width={384}
                  height={256}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Mascot */}
      <div className="absolute bottom-[-10%] right-[5%] w-[150px] md:w-[200px] lg:w-[2t0px] z-30 pointer-events-none">
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
