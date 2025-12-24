"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { fetchBlogs, Blog } from "../../services/api";

export default function BlogsPage() {
  const [blogsData, setBlogsData] = useState<Blog[]>([]);

  useEffect(() => {
    async function loadBlogs() {
      const data = await fetchBlogs();
      setBlogsData(data);
    }
    loadBlogs();
  }, []);
  return (
    <main className="min-h-screen w-full bg-white pt-32 pb-20 px-6 md:px-14 font-sans overflow-hidden">
      {/* Header Section */}
      <div className="flex flex-col items-center text-center mb-20">
        {/* Mascot */}
        <div className="w-[150px] md:w-[200px] mb-6">
          <Image
            src="/assets/blogs/services_mascot.png"
            alt="Blogs Mascot"
            width={200}
            height={200}
            className="w-full h-auto object-contain"
          />
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-green-mutu mb-4">
          Explore Fresh Ideas & Insights
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl font-medium text-black-mutu max-w-2xl mb-8">
          Discover what&apos;s next! Our blogs sparks new ways of thinking and
          inspiration.
        </p>

        {/* ABCS Tags (Outlined) */}
        <div className="flex gap-3">
          {["A", "B", "C", "S"].map((label) => (
            <div
              key={label}
              className="w-10 h-10 rounded-xl border-2 border-purple-mutu text-purple-mutu font-bold text-lg flex items-center justify-center"
            >
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {blogsData.map((item, index) => {
          // Deterministic random-like rotation between -3 and 3 degrees
          const rotation = ((index * 37) % 7) - 3;

          return (
            <Link key={index} href={`/blogs/${item.slug}`}>
              <motion.div
                className="flex flex-col group cursor-pointer"
                initial={{ rotate: rotation }}
                whileHover={{ scale: 1.05, rotate: 0, zIndex: 40 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {/* Card Container */}
                <div className="bg-cream-mutu rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                  {/* Image */}
                  <div className="w-full aspect-[16/6] bg-zinc-300 relative overflow-hidden">
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
    </main>
  );
}
