"use client";

import React, {
  useState,
  useRef,
  WheelEvent,
  MouseEvent,
  useEffect,
  useMemo,
} from "react";
import { PortfolioCard } from "@/components/portofolio-card";
import { FixedButton } from "@/components/fixed-button";
import { fixedButtonData } from "@/data/fixed-button-data";
import { ProjectModal } from "@/components/project-modal";
import { Portfolio } from "@/data/types";
import { usePortfolios } from "@/lib/hooks/usePortfolios";
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
  const containerRef = useRef<HTMLDivElement>(null);
  const settingsAreaRef = useRef<HTMLDivElement>(null);

  // USE SWR HOOK FOR DATA FETCHING
  const { portfolios: allPortfolios, isLoading, isError } = usePortfolios();

  // FILTER PORTFOLIOS BY CATEGORY
  const portfolios = selectedCategory
    ? allPortfolios.filter((p) => p.category === selectedCategory)
    : allPortfolios;

  // EFEK UNTUK MENENGAHKAN SAAT AWAL
  useEffect(() => {
    // Kita tengahkan di posisi (0,0) dari dunia virtual kita
    const initialX =
      window.innerWidth / 2 -
      (CANVAS_CONFIG.COLUMN_COUNT * CANVAS_CONFIG.FULL_COLUMN_WIDTH) / 2;
    const initialY = window.innerHeight / 2 - CANVAS_CONFIG.CARD_HEIGHT / 2;
    setPosition({ x: initialX, y: initialY });
  }, []);

  // --- LOGIKA UTAMA: HITUNG ITEM YANG TERLIHAT SECARA DINAMIS ---
  // Optimized with useMemo to prevent unnecessary recalculations
  const visibleItems = useMemo(() => {
    const items: Array<Portfolio & { uniqueId: string; x: number; y: number }> =
      [];
    if (!containerRef.current || portfolios.length === 0) return items;

    const viewport = containerRef.current.getBoundingClientRect();
    const buffer = CANVAS_CONFIG.VIEWPORT_BUFFER;

    // Tentukan batas-batas viewport di dalam dunia virtual kita
    const viewLeft = -position.x - buffer;
    const viewRight = -position.x + viewport.width + buffer;
    const viewTop = -position.y - buffer;
    const viewBottom = -position.y + viewport.height + buffer;

    // Tentukan kolom dan baris mana saja yang masuk ke dalam viewport
    const startCol = Math.floor(viewLeft / CANVAS_CONFIG.FULL_COLUMN_WIDTH);
    const endCol = Math.ceil(viewRight / CANVAS_CONFIG.FULL_COLUMN_WIDTH);
    const startRow = Math.floor(viewTop / CANVAS_CONFIG.FULL_CARD_HEIGHT);
    const endRow = Math.ceil(viewBottom / CANVAS_CONFIG.FULL_CARD_HEIGHT);

    // Loop hanya pada kolom dan baris yang terlihat
    for (let col = startCol; col < endCol; col++) {
      for (let row = startRow; row < endRow; row++) {
        // --- KUNCI INFINITE LOOP ---
        // Gunakan Aritmatika Modular (%) untuk membungkus indeks
        const itemIndex = Math.abs(row * CANVAS_CONFIG.COLUMN_COUNT + col);
        const baseItem = portfolios[itemIndex % portfolios.length];

        // Tentukan posisi X dan Y absolut dari kartu ini
        const x = col * CANVAS_CONFIG.FULL_COLUMN_WIDTH;
        let y = row * CANVAS_CONFIG.FULL_CARD_HEIGHT;

        // Terapkan efek stagger pada kolom ganjil
        if (Math.abs(col) % 2 === 1) {
          y += CANVAS_CONFIG.STAGGER_OFFSET;
        }

        items.push({
          ...baseItem,
          uniqueId: `${baseItem.id}-${col}-${row}`,
          x: x,
          y: y,
        });
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
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };
  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    setPosition((p) => ({ x: p.x - e.deltaX, y: p.y - e.deltaY }));
  };

  return (
    <div
      ref={containerRef}
      className={`w-full h-screen overflow-hidden cursor-grab active:cursor-grabbing transition-colors duration-500 ${
        isRedacted ? "font-redacted" : ""
      }`}
      style={{ backgroundColor: bgColor }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-gray-600 text-lg">Loading portfolios...</div>
        </div>
      )}

      {/* Error State */}
      {isError && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-gray-600 text-lg mb-2">
              Failed to load portfolios
            </div>
            <div className="text-gray-500 text-sm">
              Showing cached data. Will retry automatically.
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && portfolios.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-gray-600 text-lg">No portfolios found</div>
        </div>
      )}

      <div
        className="relative w-full h-full"
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        }}
      >
        {/* Render hanya item yang terlihat */}
        {!isLoading &&
          visibleItems.map((item) => (
            <div
              key={item.uniqueId}
              style={{
                position: "absolute",
                width: CANVAS_CONFIG.CARD_WIDTH,
                height: CANVAS_CONFIG.CARD_HEIGHT,
                transform: `translate3d(${item.x}px, ${item.y}px, 0)`,
              }}
            >
              <PortfolioCard
                item={item}
                onClick={() => setSelectedProject(item)}
              />
            </div>
          ))}
      </div>

      <div ref={settingsAreaRef}>
        <FixedButton
          buttons={fixedButtonData}
          onColorChange={setBgColor}
          onSettingsOpenChange={setIsSettingsOpen}
          onRedactedToggle={setIsRedacted}
          onCategoryChange={setSelectedCategory}
          selectedCategory={selectedCategory}
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
