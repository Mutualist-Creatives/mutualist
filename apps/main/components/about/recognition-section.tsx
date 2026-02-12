"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const recognitions = [
  {
    year: "2024",
    items: [
      "Design Buffet 2024",
      "ADGI DESIGN WEEK 2024",
      'Guest Speaker at Seminar Publik "Kota, Seni, dan Manusia"',
      'Guest Speaker at "Jakarta Doodle Fest Roadshow" Binus International',
    ],
  },
  {
    year: "2016",
    items: [
      "Project Featured at Behance Illustration, 2016",
      "Profile Featured at L'Officiel Magazine Indonesia, 2016",
    ],
  },
  {
    year: "2015",
    items: [
      "Guest Speaker at Prasetiya Mulya School for PPPC, 2015",
      "Indonesian Artist for BMW 7 Series Launching at Plaza Indonesia, 2015",
    ],
  },
  {
    year: "2014",
    items: [
      "Work Exhibited at D&AD Exhibition London, 2014",
      "Work Featured at LOGOLOUNGE on 2000 International Identities by Leading Designers, 2014",
    ],
  },
  {
    year: "2013",
    items: [
      'Guest Speaker at "Brunch With Dean" Binus International, 2013',
      'Collaborating Artist for Kampion Card Game "The Football Talent Project" Belgium, 2013',
    ],
  },
  {
    year: "2012",
    items: ["Crowbar Awards in Editorial Publication Singapore, 2012"],
  },
];

export default function RecognitionSection() {
  const containerRef = useRef(null);

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-white pt-20 pb-20 md:pb-48 overflow-hidden"
    >
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12 xl:px-16 2xl:px-24 relative z-10">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-4xl md:text-6xl font-bold text-purple-mutu">
            Recognition
          </h2>
        </div>

        <div className="space-y-16 md:space-y-20 max-w-xs md:max-w-lg lg:max-w-2xl mx-auto">
          {recognitions.map((rec, index) => (
            <div key={index} className="text-center">
              <h3 className="text-2xl md:text-3xl font-bold text-green-mutu mb-6">
                {rec.year}
              </h3>
              <ul className="space-y-2 lg:space-y-0">
                {rec.items.map((item, i) => (
                  <li
                    key={i}
                    className="text-black-mutu text-sm md:text-lg font-medium font-instrument"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Draggable Decorations */}
      {/* Gray Rectangles */}
      {/* <motion.div
        drag
        dragConstraints={containerRef}
        className="absolute top-20 left-10 w-32 h-24 bg-gray-200 z-20 cursor-grab active:cursor-grabbing"
      />
      <motion.div
        drag
        dragConstraints={containerRef}
        className="absolute top-1/4 right-20 w-40 h-32 bg-gray-200 z-20 cursor-grab active:cursor-grabbing"
      />
      <motion.div
        drag
        dragConstraints={containerRef}
        className="absolute bottom-1/3 left-20 w-36 h-36 bg-gray-200 z-20 cursor-grab active:cursor-grabbing"
      />
      <motion.div
        drag
        dragConstraints={containerRef}
        className="absolute bottom-20 right-10 w-48 h-32 bg-gray-200 z-20 cursor-grab active:cursor-grabbing"
      /> */}

      {/* Mascots */}
      <motion.div
        drag
        dragConstraints={containerRef}
        className="absolute top-1/4 left-1/8 w-24 h-24 md:w-34 md:h-34 lg:w-42 lg:h-42 z-30 cursor-grab active:cursor-grabbing"
      >
        <Image
          src="/assets/about/recognition/1.png"
          alt="1"
          width={128}
          height={128}
          className="w-full h-full object-contain pointer-events-none"
        />
      </motion.div>

      <motion.div
        drag
        dragConstraints={containerRef}
        className="absolute top-140 right-1/8 w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 z-30 cursor-grab active:cursor-grabbing"
      >
        <Image
          src="/assets/about/recognition/2.png"
          alt="2"
          width={160}
          height={160}
          className="w-full h-full object-contain pointer-events-none"
        />
      </motion.div>

      <motion.div
        drag
        dragConstraints={containerRef}
        className="absolute top-210 left-50 w-24 h-24 md:w-34 md:h-34 lg:w-40 lg:h-40 z-30 cursor-grab active:cursor-grabbing"
      >
        <Image
          src="/assets/about/recognition/3.png"
          alt="3"
          width={96}
          height={96}
          className="w-full h-full object-contain pointer-events-none"
        />
      </motion.div>

      <motion.div
        drag
        dragConstraints={containerRef}
        className="absolute top-260 right-1/4 w-24 h-24 md:w-34 md:h-34 lg:w-40 lg:h-40 z-30 cursor-grab active:cursor-grabbing"
      >
        <Image
          src="/assets/about/recognition/4.png"
          alt="4"
          width={160}
          height={160}
          className="w-full h-full object-contain pointer-events-none"
        />
      </motion.div>

      {/* <motion.div
        drag
        dragConstraints={containerRef}
        className="absolute bottom-20 right-80 w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 z-30 cursor-grab active:cursor-grabbing"
      >
        <Image
          src="/assets/about/recognition/5.png"
          alt="5"
          width={160}
          height={160}
          className="w-full h-full object-contain pointer-events-none"
        />
      </motion.div> */}
    </section>
  );
}
