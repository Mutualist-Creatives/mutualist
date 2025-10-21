"use client";

import React, { useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";

interface PortfolioPreviewModalProps {
  title: string;
  createdBy: string;
  year: string;
  category: string;
  description: string;
  images: string[];
  onClose: () => void;
}

// Helper function to validate URL
function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function PortfolioPreviewModal({
  title,
  createdBy,
  year,
  category,
  description,
  images,
  onClose,
}: PortfolioPreviewModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const imageRef = React.useRef<HTMLDivElement>(null);
  const modalRef = React.useRef<HTMLDivElement>(null);
  const backdropRef = React.useRef<HTMLDivElement>(null);

  const validImages = images.filter(
    (img) => img.trim() !== "" && isValidUrl(img)
  );

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
        "<"
      );
    }
  };

  React.useEffect(() => {
    // Animate modal on mount
    if (modalRef.current && backdropRef.current) {
      gsap.fromTo(
        backdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" }
      );

      gsap.fromTo(
        modalRef.current,
        { scale: 0.95, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, ease: "power2.out" }
      );
    }

    // Disable body scroll
    document.body.style.overflow = "hidden";

    // ESC key handler
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePrevImage = () => {
    if (isTransitioning || validImages.length <= 1) return;
    setIsTransitioning(true);

    if (imageRef.current) {
      gsap.to(imageRef.current, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          setCurrentImageIndex((prev) =>
            prev === 0 ? validImages.length - 1 : prev - 1
          );
          gsap.to(imageRef.current, {
            opacity: 1,
            duration: 0.3,
            onComplete: () => setIsTransitioning(false),
          });
        },
      });
    }
  };

  const handleNextImage = () => {
    if (isTransitioning || validImages.length <= 1) return;
    setIsTransitioning(true);

    if (imageRef.current) {
      gsap.to(imageRef.current, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          setCurrentImageIndex((prev) =>
            prev === validImages.length - 1 ? 0 : prev + 1
          );
          gsap.to(imageRef.current, {
            opacity: 1,
            duration: 0.3,
            onComplete: () => setIsTransitioning(false),
          });
        },
      });
    }
  };

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm cursor-default"
      onClick={handleClose}
    >
      <div
        ref={modalRef}
        className="w-[90vw] h-[85vh] bg-white rounded-2xl overflow-hidden flex shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Side - Image 60% */}
        <div className="w-[60%] relative bg-neutral-100">
          <div ref={imageRef} className="relative w-full h-full">
            {validImages.length > 0 ? (
              <Image
                src={validImages[currentImageIndex]}
                alt={title || "Preview"}
                fill
                className="object-cover"
                sizes="60vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-gray-400 text-lg">
                  No image available
                </span>
              </div>
            )}
          </div>

          {/* Carousel Arrows - Only show if multiple images */}
          {validImages.length > 1 && (
            <div className="absolute bottom-12 left-12 flex gap-4">
              <button
                onClick={handlePrevImage}
                className="w-12 h-12 rounded-xl flex items-center justify-center transition-all shadow-lg hover:scale-110 cursor-pointer"
                style={{ backgroundColor: "#121212" }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15 18L9 12L15 6"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                onClick={handleNextImage}
                className="w-12 h-12 rounded-xl flex items-center justify-center transition-all shadow-lg hover:scale-110 cursor-pointer"
                style={{ backgroundColor: "#121212" }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 18L15 12L9 6"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Right Side - Content 40% */}
        <div
          className="w-[40%] flex flex-col"
          style={{ backgroundColor: "#121212" }}
        >
          {/* Top Section */}
          <div className="p-12 flex-1 relative">
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-12 right-12 w-8 h-8 flex items-center justify-center hover:opacity-50 transition-opacity"
            >
              <div className="relative w-6 h-6">
                <div className="absolute w-6 h-0.5 bg-white rounded-full transform rotate-45 top-1/2 -translate-y-1/2" />
                <div className="absolute w-6 h-0.5 bg-white rounded-full transform -rotate-45 top-1/2 -translate-y-1/2" />
              </div>
            </button>

            {/* Project Info */}
            <div className="space-y-6">
              <div>
                <p className="font-sans text-sm text-neutral-400 mb-1">Title</p>
                <h2 className="font-serif text-3xl text-white">
                  {title || "Untitled"}
                </h2>
              </div>

              <div>
                <p className="font-sans text-sm text-neutral-400 mb-1">
                  Created by
                </p>
                <p className="font-serif text-xl text-white">
                  {createdBy || "Unknown"}
                </p>
              </div>

              <div>
                <p className="font-sans text-sm text-neutral-400 mb-1">Year</p>
                <p className="font-serif text-xl text-white">
                  {year || new Date().getFullYear()}
                </p>
              </div>

              <div>
                <p className="font-sans text-sm text-neutral-400 mb-1">
                  Category
                </p>
                <p className="font-serif text-xl text-white">
                  {category || "Uncategorized"}
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Section - Description */}
          <div className="p-12">
            <p className="font-serif text-lg text-white leading-relaxed">
              {description || "No description provided."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
