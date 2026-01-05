"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Work, fetchWorks } from "../../services/api";

export default function SeeMoreWorks() {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWorks() {
      try {
        const data = await fetchWorks();
        setWorks(data);
      } catch (error) {
        console.error("Failed to load works", error);
      } finally {
        setLoading(false);
      }
    }
    loadWorks();
  }, []);

  // Take only the first 6 items if there are more
  const displayWorks = works.slice(0, 6);

  return (
    <section className="w-full bg-cream-mutu relative z-30">
      <div className="max-w-screen-2xl mx-auto w-full py-20 px-4 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
        <div className="w-full relative flex justify-center items-end mb-8 md:mb-12 lg:mb-16">
          <h2 className="text-3xl md:text-6xl font-medium text-purple-mutu text-center">
            See More Works
          </h2>
          <Link
            href="/works"
            className="absolute right-0 bottom-2 hidden md:block text-xs md:text-lg font-medium text-purple-mutu hover:opacity-70"
          >
            See All
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-x-8 md:gap-y-12">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex flex-col gap-4 animate-pulse">
                <div className="w-full aspect-4/3 bg-gray-200 rounded-lg"></div>
                <div className="flex flex-col gap-2">
                  <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : displayWorks.length === 0 ? (
          <div className="w-full py-20 flex flex-col items-center justify-center text-center px-4">
            <p className="text-lg md:text-xl lg:text-2xl text-purple-mutu/60 font-medium">
              No works found at the moment.
            </p>
            <p className="mt-2 text-xs md:text-sm lg:text-base text-purple-mutu/40">
              Please check back later or refresh the page.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-x-8 md:gap-y-12">
            {displayWorks.map((work, index) => {
              // Simple deterministic random-like tilt based on index
              const tilt = index % 2 === 0 ? 2 : -2;

              // Get first image from content if available
              const firstImage = work.content?.[0]?.images?.[0] || "";

              return (
                <Link key={work.slug} href={`/works/${work.slug}`}>
                  <motion.div
                    className="flex flex-col gap-2 md:gap-4 group cursor-pointer"
                    whileHover={{ rotate: tilt, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    {/* Image */}
                    <div className="w-full aspect-4/3 bg-gray-200 rounded-lg overflow-hidden relative">
                      {firstImage ? (
                        <Image
                          src={firstImage}
                          alt={work.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          No Image
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-1 md:flex-row md:justify-between md:items-end mt-2 md:mt-3">
                      <div className="flex flex-col w-full md:flex-1 min-w-0 md:mr-4">
                        {/* Mobile: Title + Year */}
                        <div className="flex md:hidden items-center gap-1.5 mb-1">
                          <h3 className="text-xs font-bold text-purple-mutu uppercase truncate">
                            {work.title}
                          </h3>
                          <span className="text-xs font-bold text-purple-mutu shrink-0">
                            {work.year}
                          </span>
                        </div>

                        {/* Desktop: Title */}
                        <h3 className="hidden md:block md:text-xl lg:text-2xl font-bold text-purple-mutu uppercase line-clamp-1 mb-1">
                          {work.title}
                        </h3>

                        {/* Desktop: Year + Industry */}
                        <div className="hidden md:block md:text-base lg:text-lg font-bold text-purple-mutu">
                          {work.year}{" "}
                          <span className="italic font-normal hidden lg:inline-block lg:text-base ml-1">
                            {work.industry}
                          </span>
                        </div>

                        {/* Mobile: ABCS + Industry */}
                        <div className="flex md:hidden items-center gap-2">
                          {/* Tags (ABCS) */}
                          <div className="flex gap-0.5">
                            {["A", "B", "C", "S"].map((label) => {
                              const isActive =
                                work.serviceIcons?.includes(label);
                              return (
                                <div
                                  key={label}
                                  className={`w-5 h-5 rounded hover:scale-110 font-extrabold text-[8px] flex items-center justify-center border-2 border-purple-mutu transition-all ${
                                    isActive
                                      ? "bg-purple-mutu text-cream-mutu"
                                      : "bg-transparent text-purple-mutu"
                                  }`}
                                >
                                  {label}
                                </div>
                              );
                            })}
                          </div>
                          <span className="text-[10px] italic font-normal text-purple-mutu line-clamp-1 flex-1">
                            {work.industry}
                          </span>
                        </div>
                      </div>

                      {/* Desktop: Tags (ABCS) - Right Side */}
                      <div className="hidden md:flex md:gap-1.5 lg:gap-2 shrink-0">
                        {["A", "B", "C", "S"].map((label) => {
                          const isActive = work.serviceIcons?.includes(label);
                          return (
                            <div
                              key={label}
                              className={`md:w-6 md:h-6 lg:w-8 lg:h-8 rounded-lg font-extrabold md:text-[8px] lg:text-sm flex items-center justify-center border-2 border-purple-mutu transition-colors ${
                                isActive
                                  ? "bg-purple-mutu text-cream-mutu"
                                  : "bg-transparent text-purple-mutu"
                              }`}
                              onMouseEnter={(e) => e.stopPropagation()}
                            >
                              {label}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
