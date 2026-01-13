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
  const [imageAspectRatio, setImageAspectRatio] = useState(1);
  const [isLandscape, setIsLandscape] = useState(
    typeof window !== "undefined" && window.innerWidth > window.innerHeight
  );
  const images = project.images;
  const currentImageRef = React.useRef<HTMLDivElement>(null);
  const nextImageRef = React.useRef<HTMLDivElement>(null);
  const modalRef = React.useRef<HTMLDivElement>(null);
  const backdropRef = React.useRef<HTMLDivElement>(null);
  const imageContainerRef = React.useRef<HTMLDivElement>(null);

  // Load image to get aspect ratio
  React.useEffect(() => {
    const img = new window.Image();
    img.src = images[currentImageIndex];
    img.onload = () => {
      const ratio = img.naturalWidth / img.naturalHeight;
      setImageAspectRatio(ratio);
    };
  }, [currentImageIndex, images]);

  // Detect orientation changes
  React.useEffect(() => {
    const handleResize = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

    // Preload image first, then start transition
    const img = new window.Image();
    img.src = images[newIndex];

    const startTransition = () => {
      if (currentImageRef.current && nextImageRef.current) {
        // Disable transition during reset
        currentImageRef.current.style.transition = "none";
        nextImageRef.current.style.transition = "none";

        // Reset opacities instantly
        currentImageRef.current.style.opacity = "1";
        nextImageRef.current.style.opacity = "0";
      }

      // Set next image index (it's now preloaded)
      setNextImageIndex(newIndex);

      // Wait for React to render, then crossfade
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (currentImageRef.current && nextImageRef.current) {
            // Re-enable transition for crossfade
            currentImageRef.current.style.transition =
              "opacity 0.35s ease-in-out";
            nextImageRef.current.style.transition = "opacity 0.35s ease-in-out";

            // Now do the crossfade
            nextImageRef.current.style.opacity = "1";
            currentImageRef.current.style.opacity = "0";
          }

          // After crossfade completes, sync indices
          setTimeout(() => {
            setCurrentImageIndex(newIndex);
            setIsTransitioning(false);
          }, 350);
        });
      });
    };

    // If already cached, start immediately; otherwise wait for load
    if (img.complete) {
      startTransition();
    } else {
      img.onload = startTransition;
    }
  };

  const handleNextImage = () => {
    if (isTransitioning || images.length <= 1) return;
    setIsTransitioning(true);

    const newIndex =
      currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1;

    // Preload image first, then start transition
    const img = new window.Image();
    img.src = images[newIndex];

    const startTransition = () => {
      if (currentImageRef.current && nextImageRef.current) {
        // Disable transition during reset
        currentImageRef.current.style.transition = "none";
        nextImageRef.current.style.transition = "none";

        // Reset opacities instantly
        currentImageRef.current.style.opacity = "1";
        nextImageRef.current.style.opacity = "0";
      }

      // Set next image index (it's now preloaded)
      setNextImageIndex(newIndex);

      // Wait for React to render, then crossfade
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (currentImageRef.current && nextImageRef.current) {
            // Re-enable transition for crossfade
            currentImageRef.current.style.transition =
              "opacity 0.35s ease-in-out";
            nextImageRef.current.style.transition = "opacity 0.35s ease-in-out";

            // Now do the crossfade
            nextImageRef.current.style.opacity = "1";
            currentImageRef.current.style.opacity = "0";
          }

          // After crossfade completes, sync indices
          setTimeout(() => {
            setCurrentImageIndex(newIndex);
            setIsTransitioning(false);
          }, 350);
        });
      });
    };

    // If already cached, start immediately; otherwise wait for load
    if (img.complete) {
      startTransition();
    } else {
      img.onload = startTransition;
    }
  };

  return (
    <div
      ref={backdropRef}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm cursor-default ${
        isLandscape && window.innerWidth >= 768 ? "p-8" : "p-0"
      }`}
      onClick={handleClose}
    >
      <div
        ref={modalRef}
        className={`w-full xl:w-[80vw] h-full overflow-hidden flex shadow-2xl ${
          isLandscape && window.innerWidth >= 768
            ? "max-w-[90vw] max-h-[90vh] rounded-2xl flex-row"
            : "flex-col"
        }`}
        style={{ backgroundColor: "#121212" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image Section - Adaptive based on aspect ratio */}
        <div
          ref={imageContainerRef}
          className="relative flex-shrink-0 overflow-hidden bg-[#121212]"
          style={{
            // Landscape mode: height = 90vh, width based on aspect ratio (max 60vw)
            // Tablet portrait (>= 562px): full width, height with max limit (70vh)
            // Mobile (< 562px): full width, height based on aspect ratio (max 60vh)
            width:
              isLandscape && window.innerWidth >= 768
                ? `min(calc(90vh * ${imageAspectRatio}), 60vw)`
                : "100vw",
            height:
              isLandscape && window.innerWidth >= 768
                ? "calc(90vh)"
                : window.innerWidth >= 562
                  ? `min(calc(100vw / ${imageAspectRatio}), 70vh)`
                  : `min(calc(100vw / ${imageAspectRatio}), 60vh)`,
          }}
          onMouseDown={(e) => e.stopPropagation()}
          onMouseMove={(e) => e.stopPropagation()}
          onWheel={(e) => e.stopPropagation()}
        >
          {/* Close Button - Portrait mode only (top right) */}
          <button
            onClick={handleClose}
            className={`${
              isLandscape && window.innerWidth >= 768 ? "hidden" : "flex"
            } absolute top-4 right-4 w-8 h-8 items-center justify-center hover:opacity-50 transition-opacity z-[20]`}
          >
            <div className="relative w-6 h-6">
              <div className="absolute w-6 h-0.5 bg-white rounded-full transform rotate-45 top-1/2 -translate-y-1/2" />
              <div className="absolute w-6 h-0.5 bg-white rounded-full transform -rotate-45 top-1/2 -translate-y-1/2" />
            </div>
          </button>

          {/* Next Media (behind current for crossfade) */}
          <div
            ref={nextImageRef}
            className="absolute inset-0 z-1 opacity-0"
            style={{ transition: "opacity 0.3s ease-in-out" }}
          >
            {images[nextImageIndex]?.match(/\.(mp4|webm|mov|ogg)$/i) ? (
              <video
                src={images[nextImageIndex]}
                className="w-full h-full object-contain"
                style={{ objectPosition: "center" }}
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              <Image
                src={images[nextImageIndex]}
                alt={project.title}
                fill
                className="object-contain"
                style={{ objectPosition: "center" }}
                sizes="(max-width: 768px) 100vw, 60vw"
                quality={90}
              />
            )}
          </div>

          {/* Current Media (on top) */}
          <div
            ref={currentImageRef}
            className="absolute inset-0 z-2"
            style={{ transition: "opacity 0.3s ease-in-out" }}
          >
            {images[currentImageIndex]?.match(/\.(mp4|webm|mov|ogg)$/i) ? (
              <video
                src={images[currentImageIndex]}
                className="w-full h-full object-contain"
                style={{ objectPosition: "center" }}
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              <Image
                src={images[currentImageIndex]}
                alt={project.title}
                fill
                className="object-contain"
                style={{ objectPosition: "center" }}
                sizes="(max-width: 768px) 100vw, 60vw"
                quality={90}
                priority={currentImageIndex === 0}
              />
            )}
          </div>

          {/* Carousel Arrows - Only show if multiple images */}
          {images.length > 1 && (
            <div
              className={`absolute left-1/2 -translate-x-1/2 flex gap-1.5 z-[10] ${
                isLandscape && window.innerWidth >= 768
                  ? "bottom-6"
                  : "bottom-4"
              }`}
            >
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

        {/* Content Section - Full width on portrait, fixed width on landscape */}
        <div
          className="flex flex-col flex-shrink-0 flex-1 overflow-hidden"
          style={{
            backgroundColor: "#121212",
            width: isLandscape && window.innerWidth >= 768 ? "528px" : "100%",
            height: isLandscape && window.innerWidth >= 768 ? "100%" : "auto",
          }}
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
            <div
              className="relative"
              style={{
                padding:
                  isLandscape && window.innerWidth >= 768
                    ? "3rem"
                    : window.innerWidth >= 768
                      ? "2rem"
                      : "1.5rem",
              }}
            >
              {/* Close Button - Landscape mode only (top right) */}
              <button
                onClick={handleClose}
                className={`${
                  isLandscape && window.innerWidth >= 768 ? "flex" : "hidden"
                } absolute w-8 h-8 items-center justify-center hover:opacity-50 transition-opacity z-10`}
                style={{
                  top: "3rem",
                  right: "3rem",
                }}
              >
                <div className="relative w-6 h-6">
                  <div className="absolute w-6 h-0.5 bg-white rounded-full transform rotate-45 top-1/2 -translate-y-1/2" />
                  <div className="absolute w-6 h-0.5 bg-white rounded-full transform -rotate-45 top-1/2 -translate-y-1/2" />
                </div>
              </button>

              {/* Project Info */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap:
                    isLandscape && window.innerWidth >= 768 ? "1.5rem" : "1rem",
                }}
              >
                <div>
                  <p className="font-sans text-xs text-neutral-400 mb-1">
                    Title
                  </p>
                  <h2
                    className="font-serif text-white"
                    style={{
                      fontSize:
                        isLandscape && window.innerWidth >= 768
                          ? "1.5rem"
                          : "1.25rem",
                    }}
                  >
                    {project.title}
                  </h2>
                </div>

                <div>
                  <p className="font-sans text-xs text-neutral-400 mb-1">
                    Created by
                  </p>
                  <p
                    className="font-serif text-white"
                    style={{
                      fontSize:
                        isLandscape && window.innerWidth >= 768
                          ? "1.5rem"
                          : "1.25rem",
                    }}
                  >
                    {project.createdBy}
                  </p>
                </div>

                <div>
                  <p className="font-sans text-xs text-neutral-400 mb-1">
                    Year
                  </p>
                  <p
                    className="font-serif text-white"
                    style={{
                      fontSize:
                        isLandscape && window.innerWidth >= 768
                          ? "1.5rem"
                          : "1.25rem",
                    }}
                  >
                    {project.year}
                  </p>
                </div>

                <div>
                  <p className="font-sans text-xs text-neutral-400 mb-1">
                    {project.categories.length > 1 ? "Categories" : "Category"}
                  </p>
                  <p
                    className="font-serif text-white"
                    style={{
                      fontSize:
                        isLandscape && window.innerWidth >= 768
                          ? "1.5rem"
                          : "1.25rem",
                    }}
                  >
                    {project.categories.join(", ")}
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Section - Description */}
            <div
              style={{
                padding:
                  isLandscape && window.innerWidth >= 768
                    ? "0 3rem 3rem 3rem"
                    : window.innerWidth >= 768
                      ? "0 2rem 2rem 2rem"
                      : "0 1.5rem 5rem 1.5rem",
              }}
            >
              <p className="font-sans text-xs text-neutral-400 mb-1">
                Description
              </p>
              <p
                className="font-serif text-white leading-relaxed"
                style={{
                  fontSize:
                    isLandscape && window.innerWidth >= 768
                      ? "1.5rem"
                      : "1.25rem",
                }}
              >
                {project.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
