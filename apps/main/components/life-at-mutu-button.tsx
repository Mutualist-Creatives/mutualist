"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export function LifeAtMutuButton() {
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFooterVisible(entry.isIntersecting);
      },
      {
        threshold: 0,
        rootMargin: "0px",
      },
    );

    observer.observe(footer);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      className={`fixed bottom-4 left-4 md:bottom-6 md:left-6 lg:bottom-8 lg:left-8 xl:bottom-10 xl:left-10 2xl:bottom-12 2xl:left-12 z-50 transition-opacity duration-300 ${
        isFooterVisible ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <Link
        href="https://lifeatmutualist.com/"
        className="block relative w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 2xl:w-32 2xl:h-32 hover:scale-105 transition-transform duration-300"
      >
        <div className="relative w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 2xl:w-32 2xl:h-32">
          <Image
            src="/assets/lifeatmutu_button_gif.gif"
            alt="Life at Mutu"
            fill
            className="object-contain"
            unoptimized
          />
        </div>
      </Link>
    </div>
  );
}
