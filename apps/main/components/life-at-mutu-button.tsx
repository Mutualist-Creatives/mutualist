"use client";

import Image from "next/image";
import Link from "next/link";

export function LifeAtMutuButton() {
  return (
    <div className="fixed bottom-4 left-4 md:bottom-6 md:left-6 lg:bottom-8 lg:left-8 xl:bottom-10 xl:left-10 2xl:bottom-12 2xl:left-12 z-50">
      <Link
        href="https://lifeatmutualist.com/"
        className="block relative w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 2xl:w-32 2xl:h-32 hover:scale-105 transition-transform duration-300"
      >
        {/* Adjust width/height based on aspect ratio of the gif or desired button size. 
             Assuming a button shape, maybe w-32 h-12 is a placeholder, strictly adhering to the gif content.
             If it's just the gif acting as a button:
         */}
        <div className="relative w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 2xl:w-32 2xl:h-32">
          <Image
            src="/assets/lifeatmutu_button_gif.gif"
            alt="Life at Mutu"
            fill
            className="object-contain" // or object-cover based on design
            unoptimized // Required for GIFs in Next.js usually to animate
          />
        </div>
      </Link>
    </div>
  );
}
