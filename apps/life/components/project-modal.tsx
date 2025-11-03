"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Portfolio } from "@/data/types";
import { gsap } from "gsap";

interface ProjectModalProps {
  project: Portfolio;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [nextImageIndex, setNextImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [imageWidth, setImageWidth] = useState<number>(700); // Placeholder width
  const [imageHeight, setImageHeight] = useState<number>(0); // Dynamic height for mobile
  const [isMounted, setIsMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false); // Track if current image is portrait
  const images = project.images;
  const currentImageRef = React.useRef<HTMLDivElement>(null);
  const nextImageRef = React.useRef<HTMLDivElement>(null);
  const modalRef = React.useRef<HTMLDivElement>(null);
  const backdropRef = React.useRef<HTMLDivElement>(null);
  const imageContainerRef = React.useRef<HTMLDivElement>(null);

  // Handle client-side mounting and responsive detection
  React.useEffect(() => {
    setIsMounted(true);
    setIsDesktop(window.innerWidth >= 768);

    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Calculate image dimensions on mount and when current image changes
  React.useEffect(() => {
    if (!isMounted) return;

    // Load image to get dimensions
    const img = new window.Image();
    img.src = images[currentImageIndex];

    img.onload = () => {
      // Determine if image is portrait or landscape
      const imageIsPortrait = img.naturalHeight > img.naturalWidth;
      setIsPortrait(imageIsPortrait);

      if (isDesktop) {
        // Desktop: calculate width based on modal height
        // Wait a bit for modal to render
        setTimeout(() => {
          const modalHeight = modalRef.current?.clientHeight || 0;
          if (modalHeight > 0 && imageContainerRef.current) {
            const aspectRatio = img.naturalWidth / img.naturalHeight;
            const calculatedWidth = modalHeight * aspectRatio;

            // Animate width change smoothly
            if (calculatedWidth !== imageWidth) {
              gsap.to(imageContainerRef.current, {
                width: calculatedWidth,
                duration: 0.5,
                ease: "power2.out",
                onUpdate: () => {
                  const currentWidth =
                    imageContainerRef.current?.offsetWidth || imageWidth;
                  setImageWidth(currentWidth);
                },
              });
            }
          }
        }, 100);
      } else {
        // Mobile: calculate height based on screen width
        const containerWidth =
          imageContainerRef.current?.clientWidth || window.innerWidth;
        const aspectRatio = img.naturalWidth / img.naturalHeight;
        const calculatedHeight = containerWidth / aspectRatio;
        const maxHeight = window.innerHeight * 0.6; // 60vh

        const finalHeight = Math.min(calculatedHeight, maxHeight);

        // Animate height change smoothly
        if (imageContainerRef.current && finalHeight !== imageHeight) {
          gsap.to(imageContainerRef.current, {
            height: finalHeight,
            duration: 0.5,
            ease: "power2.out",
            onUpdate: () => {
              const currentHeight =
                imageContainerRef.current?.offsetHeight || imageHeight;
              setImageHeight(currentHeight);
            },
          });
        }
      }
    };
  }, [
    isMounted,
    isDesktop,
    currentImageIndex,
    images,
    imageWidth,
    imageHeight,
  ]);

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

    return () => {
      // Re-enable body scroll on unmount
      document.body.style.overflow = "";
    };
  }, []);

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
    // ESC key handler
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePrevImage = () => {
    if (isTransitioning || images.length <= 1) return;
    setIsTransitioning(true);

    const newIndex =
      currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1;

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
    if (isTransitioning || images.length <= 1) return;
    setIsTransitioning(true);

    const newIndex =
      currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1;

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm cursor-default p-0 md:p-8"
      onClick={handleClose}
    >
      <div
        ref={modalRef}
        className="w-full h-full md:max-w-[90vw] md:max-h-[90vh] md:rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-2xl"
        style={{ backgroundColor: "#121212" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image Section - Adaptive to image aspect ratio */}
        <div
          ref={imageContainerRef}
          className="relative flex-shrink-0 overflow-hidden"
          style={{
            width: isMounted && isDesktop ? `${imageWidth}px` : "100%",
            height:
              isMounted && isDesktop
                ? "100%"
                : imageHeight > 0
                  ? `${imageHeight}px`
                  : "auto",
            minHeight:
              isMounted && !isDesktop && imageHeight === 0 ? "40vh" : undefined,
            maxHeight: isMounted && !isDesktop ? "60vh" : "100%",
            backgroundColor: "#121212",
          }}
          onMouseDown={(e) => e.stopPropagation()}
          onMouseMove={(e) => e.stopPropagation()}
          onWheel={(e) => e.stopPropagation()}
        >
          {/* Close Button - Mobile only (top right) */}
          <button
            onClick={handleClose}
            className="md:hidden absolute top-4 right-4 w-8 h-8 flex items-center justify-center hover:opacity-50 transition-opacity z-[20]"
          >
            <div className="relative w-6 h-6">
              <div className="absolute w-6 h-0.5 bg-white rounded-full transform rotate-45 top-1/2 -translate-y-1/2" />
              <div className="absolute w-6 h-0.5 bg-white rounded-full transform -rotate-45 top-1/2 -translate-y-1/2" />
            </div>
          </button>
          {/* Current Image */}
          <div ref={currentImageRef} className="absolute inset-0 z-[2]">
            <Image
              src={images[currentImageIndex]}
              alt={project.title}
              fill
              className={isPortrait ? "object-cover" : "object-contain"}
              style={{ objectPosition: "center" }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 50vw"
              quality={85}
              priority={currentImageIndex === 0}
              onLoadingComplete={() => {
                // Dimensions are calculated in useEffect
              }}
            />
          </div>

          {/* Next Image (for crossfade) */}
          <div ref={nextImageRef} className="absolute inset-0 z-[1] opacity-0">
            <Image
              src={images[nextImageIndex]}
              alt={project.title}
              fill
              className={isPortrait ? "object-cover" : "object-contain"}
              style={{ objectPosition: "center" }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 50vw"
              quality={85}
            />
          </div>

          {/* Carousel Arrows - Only show if multiple images */}
          {images.length > 1 && (
            <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 z-[10]">
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

        {/* Content Section - Full width on mobile, fixed width on desktop */}
        <div
          className="w-full md:w-[400px] lg:w-[528px] flex flex-col flex-shrink-0 flex-1 md:h-full overflow-hidden"
          style={{ backgroundColor: "#121212" }}
        >
          {/* Content Wrapper - Scrollable */}
          <div
            className="flex-1 overflow-y-auto overflow-x-hidden"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#4B5563 transparent",
            }}
          >
            {/* Top Section */}
            <div className="p-6 md:p-8 lg:p-12 relative">
              {/* Close Button - Desktop only (top right) */}
              <button
                onClick={handleClose}
                className="hidden md:flex absolute top-6 right-6 md:top-8 md:right-8 lg:top-12 lg:right-12 w-8 h-8 items-center justify-center hover:opacity-50 transition-opacity z-10"
              >
                <div className="relative w-6 h-6">
                  <div className="absolute w-6 h-0.5 bg-white rounded-full transform rotate-45 top-1/2 -translate-y-1/2" />
                  <div className="absolute w-6 h-0.5 bg-white rounded-full transform -rotate-45 top-1/2 -translate-y-1/2" />
                </div>
              </button>

              {/* Project Info */}
              <div className="space-y-4 md:space-y-6">
                <div>
                  <p className="font-sans text-xs text-neutral-400 mb-1">
                    Title
                  </p>
                  <h2 className="font-serif text-xl md:text-2xl text-white">
                    {project.title}
                  </h2>
                </div>

                <div>
                  <p className="font-sans text-xs text-neutral-400 mb-1">
                    Created by
                  </p>
                  <p className="font-serif text-xl md:text-2xl text-white">
                    {project.createdBy}
                  </p>
                </div>

                <div>
                  <p className="font-sans text-xs text-neutral-400 mb-1">
                    Year
                  </p>
                  <p className="font-serif text-xl md:text-2xl text-white">
                    {project.year}
                  </p>
                </div>

                <div>
                  <p className="font-sans text-xs text-neutral-400 mb-1">
                    {project.categories.length > 1 ? "Categories" : "Category"}
                  </p>
                  <p className="font-serif text-xl md:text-2xl text-white">
                    {project.categories.join(", ")}
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Section - Description */}
            <div className="p-6 md:p-8 lg:p-12 pt-0">
              <p className="font-serif text-xl lg:text-2xl text-white leading-relaxed">
                {project.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
