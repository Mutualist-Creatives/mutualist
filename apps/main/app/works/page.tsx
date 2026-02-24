"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { fetchWorks, Work } from "../../services/api";
import Link from "next/link";
import Image from "next/image";

export default function WorksPage() {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<string[]>(() => {
    const filterParam = searchParams.get("filter");
    return filterParam ? filterParam.split(",") : [];
  });

  useEffect(() => {
    async function loadWorks() {
      try {
        const data = await fetchWorks();
        const sortedData = [...data].sort((a, b) => {
          return parseInt(b.year) - parseInt(a.year);
        });
        setWorks(sortedData);
      } catch (error) {
        console.error("Failed to load works", error);
      } finally {
        setLoading(false);
      }
    }
    loadWorks();
  }, []);
  return (
    <main className="min-h-screen w-full font-sans bg-white pt-32 pb-20 max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
      <div className="w-full mb-10 md:mb-16 text-center space-y-2">
        <h1 className="text-5xl md:text-6xl font-medium text-purple-mutu">
          Our Works
        </h1>

        {/* Filters */}
        <div className="flex gap-2 justify-center">
          {["A", "B", "C", "D", "S"].map((label) => {
            const isActive = filters.includes(label);
            return (
              <button
                key={label}
                onClick={() =>
                  setFilters((prev) =>
                    isActive
                      ? prev.filter((f) => f !== label)
                      : [...prev, label],
                  )
                }
                className={`w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-lg md:rounded-xl cursor-pointer border-2 border-purple-mutu font-bold text-lg md:text-xl flex items-center justify-center transition-colors ${
                  isActive
                    ? "bg-purple-mutu text-white"
                    : "text-purple-mutu hover:bg-purple-mutu/10"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-x-8 md:gap-y-12">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col gap-4 animate-pulse">
              <div className="w-full aspect-4/3 bg-gray-200 rounded-lg"></div>
              <div className="flex flex-col gap-2">
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : works.length === 0 ? (
        <div className="w-full py-20 flex flex-col items-center justify-center text-center px-4">
          <p className="text-lg md:text-xl lg:text-2xl text-purple-mutu/60 font-medium">
            No works found at the moment.
          </p>
          <p className="mt-2 text-xs md:text-sm lg:text-base text-purple-mutu/40 font-(family-name:--font-instrument-sans)">
            Please check back later or refresh the page.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-x-8 md:gap-y-12">
          {works
            .filter(
              (work) =>
                filters.length === 0 ||
                filters.every((filter) => work.serviceIcons?.includes(filter)),
            )
            .map((work, index) => {
              // Simple deterministic random-like tilt based on index
              const tilt = index % 2 === 0 ? 2 : -2;

              return (
                <Link key={index} href={`/works/${work.slug}`}>
                  <motion.div
                    className="flex flex-col gap-2 md:gap-4 group cursor-pointer"
                    whileHover={{ rotate: tilt, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    {/* Image Placeholder */}
                    <div className="w-full aspect-4/3 bg-gray-200 rounded-lg overflow-hidden relative">
                      {work.content?.[0]?.images?.[0] ? (
                        <Image
                          src={work.content[0].images[0]}
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

                    <div className="flex lg:block w-full h-auto mb-0 md:-mb-3 lg:-mb-2  gap-2">
                      <div className="w-auto h-auto text-xs md:text-base lg:text-2xl font-semibold md:font-bold text-purple-mutu uppercase">
                        {work.title}
                      </div>
                      <div className="block lg:hidden w-auto h-auto text-xs md:text-base font-semibold md:font-bold text-purple-mutu">
                        {work.year}
                      </div>
                    </div>

                    <div className="w-full h-auto flex flex-row-reverse md:flex-row justify-between items-center">
                      <div className="w-full h-auto flex justify-start items-center text-purple-mutu">
                        <div className="hidden lg:block w-auto h-auto text-base lg:text-lg font-bold ">
                          {work.year}
                        </div>
                        <div className="w-full h-auto italic font-normal text-[10px] md:text-xs lg:text-sm ml-2 md:ml-0 lg:ml-2 line-clamp-1">
                          {work.industry}
                        </div>
                      </div>
                      <div className="w-auto h-auto">
                        <div className="flex gap-0.5 md:gap-1.5 lg:gap-1.5 xl:gap-2 shrink-0 justify-end">
                          {["A", "B", "C", "D", "S"].map((label) => {
                            const isActive = work.serviceIcons?.includes(label);
                            return (
                              <div
                                key={label}
                                className={`flex w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 rounded md:rounded-lg font-extrabold text-xs lg:text-sm items-center justify-center border-2 border-purple-mutu transition-colors ${
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
                      </div>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
        </div>
      )}
    </main>
  );
}
