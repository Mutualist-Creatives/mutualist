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
        className={`fixed left-4 md:left-6 z-50 hover:scale-110 transition-all duration-300 cursor-pointer ${
          isHidden
            ? "opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto"
            : "opacity-100"
        }`}
        style={{
          bottom: "max(1rem, env(safe-area-inset-bottom))",
        }}
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
