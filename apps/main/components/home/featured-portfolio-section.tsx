"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import Image from "next/image";
import { Work } from "@/services/api";

const itemsData = [
  { rotate: 2, x: -240 },
  { rotate: 1, x: -120 },
  { rotate: -1, x: 0 },
  { rotate: -2, x: 120 },
  { rotate: 1, x: 240 },
];

interface FeaturedPortfolioSectionProps {
  works: Work[];
}

export default function FeaturedPortfolioSection({
  works,
}: FeaturedPortfolioSectionProps) {
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
        ".card",
        { scale: 0 },
        {
          scale: 1,
          stagger: 0.06,
          ease: "elastic.out(1, 0.8)",
          delay: 0.5,
        },
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
    offsetX: number,
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

  const getResponsiveTransform = (item: (typeof itemsData)[0]) => {
    return item.x === 0
      ? `rotate(${item.rotate}deg)`
      : `rotate(${item.rotate}deg) translate(${item.x * scaleFactor}px)`;
  };

  const pushSiblings = (hoveredIdx: number) => {
    const pushOffset = isSmall ? 120 : 260;

    itemsData.forEach((item, i) => {
      gsap.killTweensOf(`.card-${i}`);

      const baseTransform = getResponsiveTransform(item);

      if (i === hoveredIdx) {
        const noRotation = getNoRotationTransform(baseTransform);
        // Set z-index immediately to avoid glitch
        gsap.set(`.card-${i}`, { zIndex: 50 });
        gsap.to(`.card-${i}`, {
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
        gsap.set(`.card-${i}`, { zIndex: 10 });
        gsap.to(`.card-${i}`, {
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
    itemsData.forEach((item, i) => {
      gsap.killTweensOf(`.card-${i}`);
      const baseTransform = getResponsiveTransform(item);
      gsap.to(`.card-${i}`, {
        transform: baseTransform,
        zIndex: 10,
        scale: 1,
        duration: 0.4,
        ease: "back.out(1.4)",
        overwrite: "auto",
      });
    });
  };

  // const featuredWorks = worksData.filter((work) => work.isFeatured); no longer needed, passed as prop

  return (
    <section className="w-full bg-white relative overflow-hidden">
      <div className="max-w-screen-2xl mx-auto w-full py-[2em] md:py-[2em] lg:py-20 flex flex-col items-center justify-center relative">
        <div
          ref={containerRef}
          className="relative w-full max-w-6xl h-[200px] md:h-[300px] lg:h-[420px] flex items-center justify-center"
        >
          {itemsData.map((item, index) => {
            const work = works[index];
            if (!work) return null;

            // Use the first image from content if available, ideally full-width or just the first in array
            const bgImage =
              work?.content?.[0]?.images?.[0] || "/assets/placeholder.png";

            return (
              <Link
                key={index}
                href={work ? `/works/${work.slug}` : "#"}
                className={`
              card card-${index}
              absolute w-40 h-30 md:w-60 md:h-45 lg:w-80 lg:h-60 xl:w-96 xl:h-72 rounded-xl shadow-lg cursor-pointer
              flex items-center justify-center overflow-hidden
            `}
                style={{ transform: getResponsiveTransform(item) }}
                onMouseEnter={() => pushSiblings(index)}
                onMouseLeave={resetSiblings}
              >
                <>
                  <Image
                    src={bgImage}
                    alt={work.title || "Project"}
                    fill
                    className="object-cover transition-opacity"
                  />

                  <span className="relative z-10 text-white font-medium text-xs md:text-sm lg:text-xl opacity-0 hover:opacity-100 transition-opacity pointer-events-none drop-shadow-md">
                    {work.title}
                  </span>
                </>
              </Link>
            );
          })}
        </div>

        {/* Label */}
        <div className="flex items-center gap-2 md:gap-4 z-20 relative -mt-16 md:-mt-28 lg:-mt-30 mb-[-80px] md:mb-[-100px] lg:mb-[-160px] pointer-events-none">
          <span className="text-lg md:text-2xl lg:text-5xl font-medium text-purple-mutu">
            featured
          </span>
          <Image
            src="/assets/home/featured/featured_portfolio_mascot.png"
            alt="Mascot"
            width={375}
            height={375}
            className="w-[160px] h-[160px] md:w-[250px] md:h-[250px] lg:w-[300px] lg:h-[300px] xl:w-[375px] xl:h-[375px]"
          />
          <span className="text-lg md:text-2xl lg:text-5xl font-medium text-purple-mutu">
            portfolio
          </span>
        </div>
      </div>
    </section>
  );
}
