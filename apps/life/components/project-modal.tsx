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
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [imageWidth, setImageWidth] = useState<number | null>(null);
  const images = project.images;
  const imageRef = React.useRef<HTMLDivElement>(null);
  const modalRef = React.useRef<HTMLDivElement>(null);
  const backdropRef = React.useRef<HTMLDivElement>(null);

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
      // Re-enable body scroll on unmount
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
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

  const handlePrevImage = () => {
    if (isTransitioning || images.length <= 1) return;
    setIsTransitioning(true);

    if (imageRef.current) {
      gsap.to(imageRef.current, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          setCurrentImageIndex((prev) =>
            prev === 0 ? images.length - 1 : prev - 1
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
    if (isTransitioning || images.length <= 1) return;
    setIsTransitioning(true);

    if (imageRef.current) {
      gsap.to(imageRef.current, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          setCurrentImageIndex((prev) =>
            prev === images.length - 1 ? 0 : prev + 1
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
          className="relative h-full overflow-hidden"
          style={{ width: imageWidth ? `${imageWidth}px` : "auto" }}
        >
          <div ref={imageRef} className="relative w-full h-full">
            <Image
              src={images[currentImageIndex]}
              alt={project.title}
              fill
              className="object-cover"
              style={{ objectPosition: "center" }}
              sizes="(max-width: 1200px) 60vw, 50vw"
              quality={85}
              priority={currentImageIndex === 0}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              onLoadingComplete={(img) => {
                // Calculate width based on image aspect ratio and modal height
                const modalHeight = modalRef.current?.clientHeight || 0;
                const aspectRatio = img.naturalWidth / img.naturalHeight;
                const calculatedWidth = modalHeight * aspectRatio;
                setImageWidth(calculatedWidth);
              }}
            />
          </div>

          {/* Carousel Arrows - Only show if multiple images */}
          {images.length > 1 && (
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
                  {project.title}
                </h2>
              </div>

              <div>
                <p className="font-sans text-xs text-neutral-400 mb-1">
                  Created by
                </p>
                <p className="font-serif text-2xl text-white">
                  {project.createdBy}
                </p>
              </div>

              <div>
                <p className="font-sans text-xs text-neutral-400 mb-1">Year</p>
                <p className="font-serif text-2xl text-white">{project.year}</p>
              </div>

              <div>
                <p className="font-sans text-xs text-neutral-400 mb-1">
                  {project.categories.length > 1 ? "Categories" : "Category"}
                </p>
                <p className="font-serif text-2xl text-white">
                  {project.categories.join(", ")}
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Section - Description */}
          <div className="p-12">
            <p className="font-serif text-2xl text-white leading-relaxed">
              {project.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
