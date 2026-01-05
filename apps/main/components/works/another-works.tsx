"use client";

import React, { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import Link from "next/link";

import { Work } from "../../services/api";

interface AnotherWorksProps {
  works: Work[];
}

export default function AnotherWorks({ works }: AnotherWorksProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  if (!works || works.length === 0) return null;

  return (
    <section className="w-full py-20 bg-purple-mutu relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-12 md:px-14 relative">
        {/* Carousel Wrapper */}
        <div className="relative flex items-center justify-center min-h-[400px]">
          {/* Prev Button */}
          <button
            onClick={scrollPrev}
            className="absolute left-[-36px] md:left-[-40px] top-[42.5%] -translate-y-1/2 z-20 text-white hover:opacity-70 transition-opacity"
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          {/* Embla Viewport */}
          <div className="overflow-hidden w-full" ref={emblaRef}>
            <div className="flex -ml-6">
              {works.map((work, i) => {
                const firstImage = work.content?.find(
                  (c) => c.images && c.images.length > 0
                )?.images[0];
                return (
                  <div
                    key={i}
                    className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.33%] min-w-0 pl-6"
                  >
                    <Link
                      href={`/works/${work.slug}`}
                      className="block w-full group cursor-pointer"
                    >
                      {/* Image */}
                      <div className="w-full aspect-4/3 bg-zinc-300 rounded-lg overflow-hidden relative transition-transform duration-500 group-hover:scale-[1.02]">
                        {firstImage ? (
                          <Image
                            src={firstImage}
                            alt={work.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-zinc-300" />
                        )}
                      </div>

                      <div className="mt-4 flex flex-col gap-1">
                        <h3 className="text-lg md:text-xl font-bold text-white uppercase">
                          {work.title}
                        </h3>
                        <span className="text-base md:text-lg font-medium text-white">
                          {work.year}
                        </span>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Next Button */}
          <button
            onClick={scrollNext}
            className="absolute right-[-36px] md:right-[-40px] top-[42.5%] -translate-y-1/2 z-20 text-white hover:opacity-70 transition-opacity"
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
