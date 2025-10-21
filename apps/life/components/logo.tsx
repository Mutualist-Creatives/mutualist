"use client";

import { useState } from "react";
import Image from "next/image";
import { AboutModal } from "@/components/about-modal";

export function Logo() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 left-6 z-50 hover:scale-110 transition-transform duration-300 cursor-pointer"
        aria-label="About Mutualist"
      >
        <div className="w-40 h-16 relative">
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
