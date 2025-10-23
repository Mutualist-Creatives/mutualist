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
  const [nextImageIndex, setNextImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [imageWidth, setImageWidth] = useState<number>(700);
  const currentImageRef = React.useRef<HTMLDivElement>(null);
  const nextImageRef = React.useRef<HTMLDivElement>(null);
  const modalRef = React.useRef<HTMLDivElement>(null);
  const backdropRef = React.useRef<HTMLDivElement>(null);
  const imageContainerRef = React.useRef<HTMLDivElement>(null);

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

    const newIndex =
      currentImageIndex === 0 ? validImages.length - 1 : currentImageIndex - 1;

    // Preload next image first
    setNextImageIndex(newIndex);

    // Wait for image to load
    setTimeout(() => {
      if (currentImageRef.current && nextImageRef.current) {
        // Show next image behind current
        gsap.set(nextImageRef.current, { opacity: 1, zIndex: 1 });

        // Fade out current image to reveal next
        gsap.to(currentImageRef.current, {
          opacity: 0,
          duration: 0.4,
          ease: "power2.inOut",
          onComplete: () => {
            // Wait for fade to complete, then swap
            setTimeout(() => {
              if (currentImageRef.current && nextImageRef.current) {
                // Reset opacity instantly (no animation)
                gsap.set(currentImageRef.current, { opacity: 1, zIndex: 2 });
                gsap.set(nextImageRef.current, { opacity: 0, zIndex: 1 });

                // Update state after visual reset
                setCurrentImageIndex(newIndex);
                setIsTransitioning(false);
              }
            }, 16); // One frame delay
          },
        });
      }
    }, 100);
  };

  const handleNextImage = () => {
    if (isTransitioning || validImages.length <= 1) return;
    setIsTransitioning(true);

    const newIndex =
      currentImageIndex === validImages.length - 1 ? 0 : currentImageIndex + 1;

    // Preload next image first
    setNextImageIndex(newIndex);

    // Wait for image to load
    setTimeout(() => {
      if (currentImageRef.current && nextImageRef.current) {
        // Show next image behind current
        gsap.set(nextImageRef.current, { opacity: 1, zIndex: 1 });

        // Fade out current image to reveal next
        gsap.to(currentImageRef.current, {
          opacity: 0,
          duration: 0.4,
          ease: "power2.inOut",
          onComplete: () => {
            // Wait for fade to complete, then swap
            setTimeout(() => {
              if (currentImageRef.current && nextImageRef.current) {
                // Reset opacity instantly (no animation)
                gsap.set(currentImageRef.current, { opacity: 1, zIndex: 2 });
                gsap.set(nextImageRef.current, { opacity: 0, zIndex: 1 });

                // Update state after visual reset
                setCurrentImageIndex(newIndex);
                setIsTransitioning(false);
              }
            }, 16); // One frame delay
          },
        });
      }
    }, 100);
  };

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm cursor-default p-[72px]"
      onClick={handleClose}
    >
      <div
        ref={modalRef}
        className="w-auto h-full bg-white rounded-2xl overflow-hidden flex shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onMouseMove={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
      >
        {/* Left Side - Image maintains aspect ratio */}
        <div
          ref={imageContainerRef}
          className="relative h-full overflow-hidden"
          style={{ width: `${imageWidth}px` }}
        >
          {validImages.length > 0 ? (
            <>
              {/* Current Image */}
              <div ref={currentImageRef} className="absolute inset-0 z-[2]">
                <Image
                  src={validImages[currentImageIndex]}
                  alt={title || "Preview"}
                  fill
                  className="object-cover bg-black"
                  style={{ objectPosition: "center" }}
                  sizes="(max-width: 1200px) 60vw, 50vw"
                  quality={85}
                  priority={currentImageIndex === 0}
                  onLoadingComplete={(img) => {
                    const modalHeight = modalRef.current?.clientHeight || 0;
                    const aspectRatio = img.naturalWidth / img.naturalHeight;
                    const calculatedWidth = modalHeight * aspectRatio;

                    if (
                      imageContainerRef.current &&
                      calculatedWidth !== imageWidth
                    ) {
                      gsap.to(imageContainerRef.current, {
                        width: calculatedWidth,
                        duration: 0.5,
                        ease: "power2.out",
                        onUpdate: () => {
                          const currentWidth =
                            imageContainerRef.current?.offsetWidth ||
                            imageWidth;
                          setImageWidth(currentWidth);
                        },
                      });
                    }
                  }}
                />
              </div>

              {/* Next Image (for crossfade) */}
              <div
                ref={nextImageRef}
                className="absolute inset-0 z-[1] opacity-0"
              >
                <Image
                  src={validImages[nextImageIndex]}
                  alt={title || "Preview"}
                  fill
                  className="object-cover bg-black"
                  style={{ objectPosition: "center" }}
                  sizes="(max-width: 1200px) 60vw, 50vw"
                  quality={85}
                />
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-neutral-100">
              <span className="text-gray-400 text-lg">No image available</span>
            </div>
          )}

          {/* Carousel Arrows - Only show if multiple images */}
          {validImages.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 z-[10]">
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

        {/* Right Side - Content fixed width */}
        <div
          className="w-[528px] flex flex-col flex-shrink-0"
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
                <p className="font-sans text-xs text-neutral-400 mb-1">Title</p>
                <h2 className="font-serif text-2xl text-white">
                  {title || "Untitled"}
                </h2>
              </div>

              <div>
                <p className="font-sans text-xs text-neutral-400 mb-1">
                  Created by
                </p>
                <p className="font-serif text-2xl text-white">
                  {createdBy || "Unknown"}
                </p>
              </div>

              <div>
                <p className="font-sans text-xs text-neutral-400 mb-1">Year</p>
                <p className="font-serif text-2xl text-white">
                  {year || new Date().getFullYear()}
                </p>
              </div>

              <div>
                <p className="font-sans text-xs text-neutral-400 mb-1">
                  Category
                </p>
                <p className="font-serif text-2xl text-white">
                  {category || "Uncategorized"}
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Section - Description */}
          <div className="p-12">
            <p className="font-serif text-2xl text-white leading-relaxed">
              {description || "No description provided."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
