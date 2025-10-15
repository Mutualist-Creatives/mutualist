"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { gsap } from "gsap";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AboutModal({ isOpen, onClose }: AboutModalProps) {
  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";

      // Animate modal entrance
      gsap.fromTo(
        ".about-modal-content",
        { opacity: 0, scale: 0.95, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "power3.out" }
      );
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const gifs = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="about-modal-content relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl p-12 mx-4"
        style={{ backgroundColor: "#121212" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center hover:opacity-50 transition-opacity"
          aria-label="Close modal"
        >
          <div className="relative w-8 h-8">
            <div className="absolute w-8 h-0.5 bg-white rounded-full transform rotate-45 top-1/2 -translate-y-1/2" />
            <div className="absolute w-8 h-0.5 bg-white rounded-full transform -rotate-45 top-1/2 -translate-y-1/2" />
          </div>
        </button>

        {/* Content */}
        <div className="flex flex-col items-center text-center">
          {/* Logo */}
          <div className="w-40 h-16 relative mb-12">
            <Image
              src="/assets/logo/logo.gif"
              alt="Mutualist Logo"
              fill
              className="object-contain"
            />
          </div>

          {/* Text */}
          <p className="text-3xl font-serif leading-relaxed max-w-3xl text-white mb-12">
            At Mutualist Creatives, we believe every piece of work tells a story
            worth remembering. Life at Mutualist exists as a place to capture
            and celebrate those stories. a gallery where imagination meets
            craft, and where our pride as a creative collective finds its voice.
            It's more than just visuals; it's the living heartbeat of our
            creative journey.
          </p>

          {/* GIFs - Smaller size to fit in one row */}
          <div className="flex justify-center gap-3 w-full">
            {gifs.map((num) => (
              <div key={num} className="w-14 h-14 relative flex-shrink-0">
                <Image
                  src={`/assets/gif/${num}.GIF`}
                  alt={`Mutualist GIF ${num}`}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
