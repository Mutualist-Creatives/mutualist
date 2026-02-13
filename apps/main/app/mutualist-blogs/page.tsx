"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { fetchBlogs, Blog } from "../../services/api";

export default function BlogsPage() {
  const [blogsData, setBlogsData] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBlogs() {
      try {
        const data = await fetchBlogs();
        setBlogsData(data);
      } catch (error) {
        console.error("Failed to load blogs", error);
      } finally {
        setLoading(false);
      }
    }
    loadBlogs();
  }, []);
  return (
    <main className="min-h-screen w-full bg-white pt-32 pb-20 px-6 md:px-14 font-sans overflow-hidden">
      {/* Header Section */}
      <div className="flex flex-col items-center text-center mb-10 md:mb-20">
        {/* Mascot */}
        <div className="w-[150px] md:w-[200px] lg:w-[250px] mb-6">
          <Image
            src="/assets/blogs/services_mascot.png"
            alt="Blogs Mascot"
            width={200}
            height={200}
            className="w-full h-auto object-contain"
          />
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-green-mutu mb-4">
          Explore Fresh <br className="block md:hidden" /> Ideas & Insights
        </h1>

        {/* Subtitle */}
        <p className="text-xs md:text-sm lg:text-xl font-medium text-black-mutu max-w-[275px] md:max-w-2xl mb-8 font-instrument">
          Discover what&apos;s next! Our blogs sparks new ways of thinking and
          inspiration.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="max-w-5xl mx-auto">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-col gap-3 animate-pulse">
                <div className="w-full aspect-16/6 bg-gray-200 rounded-2xl"></div>
                <div className="p-5 flex flex-col gap-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
                </div>
              </div>
            ))}
          </div>
        ) : blogsData.length === 0 ? (
          <div className="w-full py-20 flex flex-col items-center justify-center text-center px-4">
            <p className="text-lg md:text-xl lg:text-2xl text-purple-mutu/60 font-medium">
              No blogs found at the moment.
            </p>
            <p className="mt-2 text-xs md:text-sm lg:text-base text-purple-mutu/40 font-instrument">
              Please check back later or refresh the page.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogsData.map((item, index) => {
              // Deterministic random-like rotation between -3 and 3 degrees
              const rotation = ((index * 37) % 7) - 3;

              return (
                <Link key={index} href={`/mutualist-blogs/${item.slug}`}>
                  <motion.div
                    className="flex flex-col group cursor-pointer"
                    initial={{ rotate: rotation }}
                    whileHover={{ scale: 1.05, rotate: 0, zIndex: 40 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    {/* Card Container */}
                    <div className="bg-cream-mutu rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                      {/* Image */}
                      <div className="w-full aspect-16/6 bg-zinc-300 relative overflow-hidden">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                            No Image
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-5 flex flex-col gap-3 text-center">
                        <h3 className="text-sm font-medium text-green-mutu leading-tight">
                          {item.title}
                        </h3>
                        <p className="text-xs font-medium text-black-mutu">
                          {item.category} | {item.date}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
