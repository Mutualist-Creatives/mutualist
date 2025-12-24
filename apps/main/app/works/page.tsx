"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchWorks, Work } from "../../services/api";
import Link from "next/link"; // Added Link for navigation
import Image from "next/image";

export default function WorksPage() {
  const [works, setWorks] = useState<Work[]>([]);

  useEffect(() => {
    async function loadWorks() {
      const data = await fetchWorks();
      setWorks(data);
    }
    loadWorks();
  }, []);
  return (
    <main className="min-h-screen w-full font-sans bg-white pt-32 pb-20 max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
      {/* <div className="w-full mb-16 text-center">
        <h1 className="text-5xl md:text-6xl font-medium text-purple-mutu">
          Works
        </h1>
      </div> */}

      {works.length === 0 ? (
        <div className="w-full py-20 flex flex-col items-center justify-center text-center">
          <p className="text-xl md:text-2xl text-purple-mutu/60 font-medium">
            No works found at the moment.
          </p>
          <p className="mt-2 text-purple-mutu/40">
            Please check back later or refresh the page.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-x-8 md:gap-y-12">
          {works.map((work, index) => {
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

                  <div className="flex flex-col gap-1 md:flex-row md:justify-between md:items-end">
                    <div className="flex flex-col w-full md:w-auto overflow-hidden">
                      <h3 className="text-xs lg:text-lg font-bold text-purple-mutu uppercase line-clamp-1 mb-1">
                        {work.title}
                      </h3>

                      {/* Desktop: Year + Industry */}
                      <div className="hidden md:block text-xs lg:text-lg font-bold text-purple-mutu">
                        {work.year}{" "}
                        <span className="italic font-normal">
                          {work.industry}
                        </span>
                      </div>

                      {/* Mobile: ABCS + Industry */}
                      <div className="flex md:hidden items-center gap-3">
                        {/* Tags (ABCS) */}
                        <div className="flex gap-1">
                          {["A", "B", "C", "S"].map((label) => {
                            const isActive = work.serviceIcons?.includes(label);
                            return (
                              <div
                                key={label}
                                className={`w-6 h-6 rounded-md font-extrabold text-[10px] flex items-center justify-center border-2 border-purple-mutu transition-colors ${
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
                        <span className="text-xs italic font-normal text-purple-mutu line-clamp-1 flex-1">
                          {work.industry}
                        </span>
                      </div>
                    </div>

                    {/* Desktop: Tags (ABCS) - Right Side */}
                    <div className="hidden md:flex gap-2 shrink-0">
                      {["A", "B", "C", "S"].map((label) => {
                        const isActive = work.serviceIcons?.includes(label);
                        return (
                          <div
                            key={label}
                            className={`w-8 h-8 rounded-lg font-extrabold text-sm flex items-center justify-center border-2 border-purple-mutu transition-colors ${
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
                </motion.div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
