"use client";

import { useState } from "react";
import Image from "next/image";
import { AboutModal } from "@/components/about-modal";

interface LogoProps {
  isHidden?: boolean;
}

export function Logo({ isHidden = false }: LogoProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={`fixed left-4 md:left-6 top-4 md:top-auto md:bottom-6 z-50 hover:scale-110 cursor-pointer transition-all duration-300 ${
          isHidden
            ? "opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto delay-0"
            : "opacity-100 delay-[1200ms]"
        }`}
        aria-label="About Mutualist"
      >
        <div className="w-28 h-12 md:w-40 md:h-16 relative">
          <Image
            src="/assets/logo/logo.gif"
            alt="Mutualist Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
      </button>

      <AboutModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
