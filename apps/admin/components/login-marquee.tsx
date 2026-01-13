"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface MarqueeProps {
  images: string[];
}

export function LoginMarquee({ images }: MarqueeProps) {
  // Fallback if no images provided
  const finalImages =
    images.length > 0
      ? images
      : [
          "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=800&q=80",
        ];

  // Ensure we have enough images for the loop by duplicating if needed
  // Cap at 60 for 4 rows
  const marqueeImages = [
    ...finalImages,
    ...finalImages,
    ...finalImages,
    ...finalImages,
    ...finalImages,
  ].slice(0, 60);

  // Split into four rows
  const quarter = Math.ceil(marqueeImages.length / 4);
  const row1 = marqueeImages.slice(0, quarter);
  const row2 = marqueeImages.slice(quarter, quarter * 2);
  const row3 = marqueeImages.slice(quarter * 2, quarter * 3);
  const row4 = marqueeImages.slice(quarter * 3);

  const renderRow = (
    row: string[],
    direction: "left" | "right",
    keyPrefix: string
  ) => (
    <div
      className={`flex gap-4 ${
        direction === "left" ? "animate-scroll-left" : "animate-scroll-right"
      } min-w-max`}
    >
      {[...row, ...row].map((src, i) => (
        <div
          key={`${keyPrefix}-${i}`}
          className="relative h-40 w-auto rounded-sm overflow-hidden shrink-0"
        >
          <img
            src={src}
            alt=""
            className="h-full w-auto object-cover grayscale hover:grayscale-0 transition-all duration-500"
          />
        </div>
      ))}
    </div>
  );

  return (
    <div className="absolute inset-0 z-0 overflow-hidden opacity-30 select-none pointer-events-none">
      {/* Gradient Overlay to fade edges */}
      <div className="absolute inset-0 bg-linear-to-b from-zinc-900 via-transparent to-zinc-900 z-10" />
      <div className="absolute inset-0 bg-zinc-900/60 z-10" />

      <div className="flex flex-col gap-4 justify-center h-full -rotate-12 scale-125">
        {renderRow(row1, "left", "r1")}
        {renderRow(row2, "right", "r2")}
        {renderRow(row3, "left", "r3")}
        {renderRow(row4, "right", "r4")}
      </div>
    </div>
  );
}
