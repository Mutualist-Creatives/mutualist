"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { gsap } from "gsap";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AboutModal({ isOpen, onClose }: AboutModalProps) {
  const modalRef = React.useRef<HTMLDivElement>(null);
  const backdropRef = React.useRef<HTMLDivElement>(null);
  const [isLandscape, setIsLandscape] = React.useState(
    typeof window !== "undefined" && window.innerWidth > window.innerHeight,
  );

  // Detect orientation changes
  useEffect(() => {
    const handleResize = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";

      // Animate modal entrance (same as project modal)
      if (modalRef.current && backdropRef.current) {
        gsap.fromTo(
          backdropRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.3, ease: "power2.out" },
        );

        gsap.fromTo(
          modalRef.current,
          { scale: 0.95, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.4, ease: "power2.out" },
        );
      }
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleClose = () => {
    if (modalRef.current && backdropRef.current) {
      const timeline = gsap.timeline({
        onComplete: onClose,
      });

      timeline.to(modalRef.current, {
        scale: 0.95,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
      });

      timeline.to(
        backdropRef.current,
        {
          opacity: 0,
          duration: 0.2,
          ease: "power2.in",
        },
        "<",
      );
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  const gifs = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl md:rounded-3xl px-6"
        style={{ backgroundColor: "#121212" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 md:top-8 md:right-8 lg:top-12 lg:right-12 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center hover:opacity-50 transition-opacity"
          aria-label="Close modal"
        >
          <div className="relative w-6 h-6 md:w-8 md:h-8">
            <div className="absolute w-full h-0.5 bg-white rounded-full transform rotate-45 top-1/2 -translate-y-1/2" />
            <div className="absolute w-full h-0.5 bg-white rounded-full transform -rotate-45 top-1/2 -translate-y-1/2" />
          </div>
        </button>

        {/* Content */}
        <div className="flex flex-col items-center text-center">
          {/* Logo */}
          <div className="w-28 h-12 md:w-36 md:h-14 lg:w-40 lg:h-16 relative mt-8 md:mt-12 lg:mt-15">
            <Image
              src="/assets/logo/logo.gif"
              alt="Mutualist Logo"
              fill
              className="object-contain"
            />
          </div>

          {/* Text */}
          <p
            className="font-serif leading-relaxed max-w-3xl text-white my-8 md:my-12 lg:my-15"
            style={{
              fontSize:
                isLandscape && window.innerWidth >= 768 ? "1.5rem" : "1.25rem",
            }}
          >
            At Mutualist Creatives, we believe every piece of work tells a story
            worth remembering. Life at Mutualist exists as a place to capture
            and celebrate those stories. a gallery where imagination meets
            craft, and where our pride as a creative collective finds its voice.
            It&apos;s more than just visuals; it&apos;s the living heartbeat of
            our creative journey.
          </p>

          {/* GIFs - Responsive grid */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 w-full max-w-md md:max-w-none mb-8 md:mb-12 lg:mb-15">
            {gifs.map((num) => (
              <div
                key={num}
                className="w-6 h-6 md:w-14 md:h-14 relative flex-shrink-0"
              >
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
