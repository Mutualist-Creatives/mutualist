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
    <main className="min-h-screen w-full font-sans bg-white pt-32 pb-20 px-6 md:px-20">
      <div className="w-full mb-16 text-center">
        <h1 className="text-5xl md:text-6xl font-medium text-purple-mutu">
          Works
        </h1>
      </div>

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-12">
          {works.map((work, index) => {
            // Simple deterministic random-like tilt based on index
            const tilt = index % 2 === 0 ? 2 : -2;

            return (
              <Link key={index} href={`/works/${work.slug}`}>
                <motion.div
                  className="flex flex-col gap-4 group cursor-pointer"
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

                  <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <h3 className="text-lg font-bold text-purple-mutu uppercase">
                        {work.title}
                      </h3>
                      <span className="text-lg font-medium text-purple-mutu">
                        {work.year}
                      </span>
                    </div>

                    {/* Tags (ABCS) */}
                    <div className="flex gap-2">
                      {["A", "B", "C", "S"].map((label) => {
                        const isActive = work.serviceIcons?.includes(label);
                        return (
                          <div
                            key={label}
                            className={`w-8 h-8 rounded-xl font-bold text-sm flex items-center justify-center border border-purple-mutu transition-colors ${
                              isActive
                                ? "bg-purple-mutu text-cream-mutu"
                                : "bg-transparent text-purple-mutu opacity-50"
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
