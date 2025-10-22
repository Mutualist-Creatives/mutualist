"use client";

import React, { useState, useRef, MouseEvent, useEffect, useMemo } from "react";
import { gsap } from "gsap";
import { PortfolioCard } from "@/components/portofolio-card";
import { FixedButton } from "@/components/fixed-button";
import { Logo } from "@/components/logo";
import { fixedButtonData } from "@/data/fixed-button-data";
import { ProjectModal } from "@/components/project-modal";
import { Portfolio } from "@/data/types";
import { usePortfolios } from "@/lib/hooks/usePortfolios";
import { useImageDimensions } from "@/lib/hooks/useImageDimensions";
import { getImageHeight } from "@/lib/image-dimensions";
import { CANVAS_CONFIG, DEFAULT_BG_COLOR } from "@/lib/constants";

export function InfiniteCanvas() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [bgColor, setBgColor] = useState(DEFAULT_BG_COLOR);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRedacted, setIsRedacted] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Portfolio | null>(
    null
  );
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const settingsAreaRef = useRef<HTMLDivElement>(null);
  const rafIdRef = useRef<number | null>(null);
  const cardsRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const imageHeightsRef = useRef<Map<string, number>>(new Map());

  // USE SWR HOOK FOR DATA FETCHING (Optimistic UI - instant display)
  const { portfolios: allPortfolios, isValidating } = usePortfolios();

  // FILTER PORTFOLIOS BY CATEGORY (OR logic - show if ANY category matches)
  const portfolios = selectedCategory
    ? allPortfolios.filter((p) => p.categories.includes(selectedCategory))
    : allPortfolios;

  // PRELOAD IMAGE DIMENSIONS
  useImageDimensions(portfolios);

  // EFEK UNTUK MENENGAHKAN SAAT AWAL
  useEffect(() => {
    // Kita tengahkan di posisi (0,0) dari dunia virtual kita
    const initialX =
      window.innerWidth / 2 -
      (CANVAS_CONFIG.COLUMN_COUNT * CANVAS_CONFIG.FULL_COLUMN_WIDTH) / 2;
    const initialY = window.innerHeight / 2 - CANVAS_CONFIG.CARD_HEIGHT / 2;
    setPosition({ x: initialX, y: initialY });

    // Add wheel event listener with passive: false to allow preventDefault
    const container = containerRef.current;
    const nativeWheelHandler = (e: Event) => {
      const wheelEvent = e as globalThis.WheelEvent;
      wheelEvent.preventDefault();

      // Throttle wheel events with RAF
      if (rafIdRef.current !== null) return;

      rafIdRef.current = requestAnimationFrame(() => {
        setPosition((p) => ({
          x: p.x - wheelEvent.deltaX,
          y: p.y - wheelEvent.deltaY,
        }));
        rafIdRef.current = null;
      });
    };

    if (container) {
      container.addEventListener("wheel", nativeWheelHandler, {
        passive: false,
      });
    }

    // Cleanup
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      if (container) {
        container.removeEventListener("wheel", nativeWheelHandler);
      }
    };
  }, []);

  // ANIMATE CARDS WHEN API DATA IS READY
  useEffect(() => {
    // Only animate once when data first loads from API
    if (!isValidating && !hasAnimated && cardsRef.current.size > 0) {
      setHasAnimated(true);

      // Get all card elements
      const cards = Array.from(cardsRef.current.values());

      // Stagger fade animation (no scale to prevent layout shift)
      gsap.fromTo(
        cards,
        {
          opacity: 0,
        },
        {
          opacity: 1,
          duration: 0.5,
          stagger: {
            amount: 0.8, // Total stagger duration
            from: "random", // Random order for organic feel
            ease: "power2.out",
          },
          ease: "power2.out",
        }
      );
    }
  }, [isValidating, hasAnimated]);

  // --- LOGIKA UTAMA: MASONRY LAYOUT DENGAN TINGGI ASLI ---
  const visibleItems = useMemo(() => {
    const items: Array<{
      item: Portfolio;
      uniqueId: string;
      x: number;
      y: number;
    }> = [];

    if (!containerRef.current || portfolios.length === 0) return items;

    const viewport = containerRef.current.getBoundingClientRect();
    const buffer = CANVAS_CONFIG.VIEWPORT_BUFFER;

    // Viewport boundaries
    const viewLeft = -position.x - buffer;
    const viewRight = -position.x + viewport.width + buffer;
    const viewTop = -position.y - buffer;
    const viewBottom = -position.y + viewport.height + buffer;

    // Calculate which columns are visible
    const startCol = Math.floor(viewLeft / CANVAS_CONFIG.FULL_COLUMN_WIDTH);
    const endCol = Math.ceil(viewRight / CANVAS_CONFIG.FULL_COLUMN_WIDTH);

    // For each column, stack items vertically based on actual heights
    for (let col = startCol; col < endCol; col++) {
      // Apply stagger offset for odd columns
      const staggerOffset =
        Math.abs(col) % 2 === 1 ? CANVAS_CONFIG.STAGGER_OFFSET : 0;

      // --- RENDER DOWNWARDS (positive direction) ---
      let currentY = staggerOffset;
      let itemIndexInColumn = 0;

      // Keep adding items downward until we're past the bottom of viewport
      while (currentY < viewBottom + buffer) {
        const itemIndex = Math.abs(
          itemIndexInColumn * CANVAS_CONFIG.COLUMN_COUNT + col
        );
        const baseItem = portfolios[itemIndex % portfolios.length];
        const uniqueId = `${baseItem.id}-${col}-${itemIndexInColumn}`;

        // Get height: 1) rendered, 2) preloaded, 3) estimated
        const renderedHeight = imageHeightsRef.current.get(uniqueId);
        const preloadedHeight = baseItem.images[0]
          ? getImageHeight(baseItem.images[0], CANVAS_CONFIG.CARD_WIDTH)
          : null;
        const cardHeight =
          renderedHeight || preloadedHeight || CANVAS_CONFIG.CARD_HEIGHT;

        // Only add if this item intersects with viewport
        if (currentY + cardHeight >= viewTop - buffer) {
          const x = col * CANVAS_CONFIG.FULL_COLUMN_WIDTH;

          items.push({
            item: baseItem,
            uniqueId,
            x,
            y: currentY,
          });
        }

        // Move to next position in column
        currentY += cardHeight + CANVAS_CONFIG.GAP;
        itemIndexInColumn++;

        // Safety break to prevent infinite loop
        if (itemIndexInColumn > 1000) break;
      }

      // --- RENDER UPWARDS (negative direction) ---
      currentY = staggerOffset - CANVAS_CONFIG.GAP;
      itemIndexInColumn = -1;

      // Keep adding items upward until we're past the top of viewport
      while (currentY > viewTop - buffer) {
        const itemIndex = Math.abs(
          itemIndexInColumn * CANVAS_CONFIG.COLUMN_COUNT + col
        );
        const baseItem = portfolios[itemIndex % portfolios.length];
        const uniqueId = `${baseItem.id}-${col}-${itemIndexInColumn}`;

        // Get height: 1) rendered, 2) preloaded, 3) estimated
        const renderedHeight = imageHeightsRef.current.get(uniqueId);
        const preloadedHeight = baseItem.images[0]
          ? getImageHeight(baseItem.images[0], CANVAS_CONFIG.CARD_WIDTH)
          : null;
        const cardHeight =
          renderedHeight || preloadedHeight || CANVAS_CONFIG.CARD_HEIGHT;

        // Position card above current Y
        const cardY = currentY - cardHeight;

        // Only add if this item intersects with viewport
        if (cardY <= viewBottom + buffer) {
          const x = col * CANVAS_CONFIG.FULL_COLUMN_WIDTH;

          items.push({
            item: baseItem,
            uniqueId,
            x,
            y: cardY,
          });
        }

        // Move to next position upward
        currentY = cardY - CANVAS_CONFIG.GAP;
        itemIndexInColumn--;

        // Safety break to prevent infinite loop
        if (itemIndexInColumn < -1000) break;
      }
    }

    return items;
  }, [position.x, position.y, portfolios]);

  // --- FUNGSI-FUNGSI UNTUK GESER (PANNING) ---
  const handleMouseDown = (e: MouseEvent) => {
    if (e.button !== 0) return;

    // Check if click is inside settings area
    if (isSettingsOpen && settingsAreaRef.current) {
      const rect = settingsAreaRef.current.getBoundingClientRect();
      const isInsideSettings =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      if (isInsideSettings) return; // Don't start dragging if inside settings
    }

    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };
  const handleMouseUp = () => {
    setIsDragging(false);
    // Cancel any pending RAF
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    // Throttle with requestAnimationFrame for smooth 60fps
    if (rafIdRef.current !== null) return;

    rafIdRef.current = requestAnimationFrame(() => {
      setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
      rafIdRef.current = null;
    });
  };

  return (
    <div
      ref={containerRef}
      className={`w-full h-screen overflow-hidden cursor-grab active:cursor-grabbing transition-colors duration-500 ${
        isRedacted ? "font-redacted" : ""
      }`}
      style={{
        backgroundColor: bgColor,
        contain: "layout style paint",
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Subtle Update Indicator - Only show when revalidating in background */}
      {/* {isValidating && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm flex items-center gap-2 shadow-lg">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
            <span>Syncing...</span>
          </div>
        </div>
      )} */}

      {/* Empty State - Only if truly no data */}
      {portfolios.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-gray-600 text-lg">No portfolios found</div>
        </div>
      )}

      <div
        className="relative w-full h-full"
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
          willChange: isDragging ? "transform" : "auto",
        }}
      >
        {/* Render hanya item yang terlihat - Always render (optimistic UI) */}
        {visibleItems.map((item) => (
          <div
            key={item.uniqueId}
            ref={(el) => {
              if (el) {
                cardsRef.current.set(item.uniqueId, el);
              } else {
                cardsRef.current.delete(item.uniqueId);
              }
            }}
            style={{
              position: "absolute",
              width: CANVAS_CONFIG.CARD_WIDTH,
              height: "auto",
              transform: `translate3d(${item.x}px, ${item.y}px, 0)`,
              willChange: "transform",
            }}
          >
            <PortfolioCard
              item={item.item}
              onClick={() => setSelectedProject(item.item)}
              onHeightChange={(height) => {
                imageHeightsRef.current.set(item.uniqueId, height);
              }}
            />
          </div>
        ))}
      </div>

      {/* Logo - Bottom Left */}
      <Logo />

      {/* Fixed Buttons - Bottom Right */}
      <div ref={settingsAreaRef}>
        <FixedButton
          buttons={fixedButtonData}
          onColorChange={setBgColor}
          onSettingsOpenChange={setIsSettingsOpen}
          onRedactedToggle={setIsRedacted}
          onCategoryChange={setSelectedCategory}
          selectedCategory={selectedCategory}
          portfolios={allPortfolios}
        />
      </div>

      {/* Project Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
}
