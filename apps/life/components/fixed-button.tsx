"use client";

import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { portfolioItems } from "@/data/portofolio-data";

interface ButtonData {
  id: string;
  type: "color" | "text" | "hamburger";
  label: string;
  color?: string;
  onClick?: () => void;
}

interface FixedButtonProps {
  buttons?: ButtonData[];
  onColorChange?: (color: string) => void;
  onSettingsOpenChange?: (isOpen: boolean) => void;
  onRedactedToggle?: (isRedacted: boolean) => void;
}

const colorOptions = [
  "#FFF",
  "#EEEBE2",
  "#F3DA01",
  "#009F6F",
  "#770040",
  "#000",
];

const defaultButtons: ButtonData[] = [
  {
    id: "color-changer",
    type: "color",
    label: "Change Background Color",
    color: "#EEEBE2",
  },
  {
    id: "typography",
    type: "text",
    label: "Typography",
  },
  {
    id: "menu",
    type: "hamburger",
    label: "Menu",
    onClick: () => console.log("Menu clicked"),
  },
];

export function FixedButton({
  buttons = defaultButtons,
  onColorChange,
  onSettingsOpenChange,
  onRedactedToggle,
}: FixedButtonProps) {
  const [currentBgColor, setCurrentBgColor] = useState("#EEEBE2");
  const [isColorMenuOpen, setIsColorMenuOpen] = useState(false);
  const [shouldRenderMenu, setShouldRenderMenu] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showHamburgerIcon, setShowHamburgerIcon] = useState(true);
  const [isRedacted, setIsRedacted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const colorMenuRef = useRef<HTMLDivElement>(null);
  const settingsButtonRef = useRef<HTMLButtonElement>(null);
  const settingsPanelRef = useRef<HTMLDivElement>(null);
  const otherButtonsRef = useRef<(HTMLDivElement | null)[]>([]);
  const hamburgerIconRef = useRef<HTMLDivElement>(null);
  const xIconRef = useRef<HTMLButtonElement>(null);
  const linksRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const categoriesRef = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (isColorMenuOpen) {
      setShouldRenderMenu(true);
    }
  }, [isColorMenuOpen]);

  useEffect(() => {
    // ESC key handler for settings
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isSettingsOpen && !isAnimating) {
        handleSettingsClick();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isSettingsOpen, isAnimating]);

  useEffect(() => {
    if (colorMenuRef.current) {
      const colorButtons =
        colorMenuRef.current.querySelectorAll(".color-option");

      if (isColorMenuOpen) {
        gsap.to(colorButtons, {
          opacity: 1,
          x: 0,
          duration: 0.3,
          stagger: 0.05,
          ease: "back.out(1.7)",
        });
      } else if (shouldRenderMenu) {
        gsap.to(colorButtons, {
          opacity: 0,
          x: 30,
          duration: 0.2,
          stagger: {
            each: 0.03,
            from: "end",
          },
          ease: "power2.in",
          onComplete: () => {
            setShouldRenderMenu(false);
          },
        });
      }
    }
  }, [isColorMenuOpen, shouldRenderMenu]);

  const handleColorChange = (color: string) => {
    setCurrentBgColor(color);
    setIsColorMenuOpen(false);
    if (onColorChange) {
      onColorChange(color);
    }
  };

  const handleSettingsClick = () => {
    if (isAnimating) return; // Prevent action during animation

    if (!isSettingsOpen) {
      setIsSettingsOpen(true);
      setIsAnimating(true);
      if (onSettingsOpenChange) onSettingsOpenChange(true);

      // Hide hamburger icon immediately
      setShowHamburgerIcon(false);

      // Fade out other buttons
      const otherButtons = otherButtonsRef.current.filter(Boolean);
      gsap.to(otherButtons, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.out",
      });

      if (settingsButtonRef.current) {
        const timeline = gsap.timeline();

        // Hitung tinggi dari button ke top viewport
        const buttonRect = settingsButtonRef.current.getBoundingClientRect();
        const distanceToTop = buttonRect.top;
        const targetHeight = distanceToTop + 48 - 24; // 48 = button height, 24 = padding top

        // Step 1: Morph ke kiri (memanjang horizontal lebih panjang)
        timeline.to(settingsButtonRef.current, {
          width: 528,
          duration: 0.8,
          ease: "power2.out",
        });

        // Step 2: Morph ke atas (memanjang vertikal sampai top viewport)
        timeline.to(settingsButtonRef.current, {
          height: targetHeight,
          duration: 0.8,
          ease: "power2.out",
          onComplete: () => {
            setIsAnimating(false);
            // Animate X icon and links after morph complete
            const topElements = [xIconRef.current, ...linksRef.current].filter(
              Boolean
            );
            gsap.fromTo(
              topElements,
              { opacity: 0, y: -10 },
              {
                opacity: 1,
                y: 0,
                duration: 0.4,
                stagger: 0.1,
                ease: "power2.out",
              }
            );

            // Animate categories from bottom
            const categoryElements = categoriesRef.current.filter(Boolean);
            gsap.fromTo(
              categoryElements,
              { opacity: 0, y: 10 },
              {
                opacity: 1,
                y: 0,
                duration: 0.4,
                stagger: 0.08,
                ease: "power2.out",
                delay: 0.2,
              }
            );
          },
        });
      }
    } else {
      setIsSettingsOpen(false);
      setIsAnimating(true);
      if (onSettingsOpenChange) onSettingsOpenChange(false);

      // Fade in other buttons
      const otherButtons = otherButtonsRef.current.filter(Boolean);
      gsap.to(otherButtons, {
        opacity: 1,
        duration: 0.3,
        ease: "power2.in",
      });

      if (settingsButtonRef.current) {
        const timeline = gsap.timeline();

        // Reverse: Kembali ke tinggi normal
        timeline.to(settingsButtonRef.current, {
          height: 48,
          duration: 0.6,
          ease: "power2.in",
        });

        // Kembali ke lebar normal
        timeline.to(settingsButtonRef.current, {
          width: 48,
          duration: 0.6,
          ease: "power2.in",
          onComplete: () => {
            // Show hamburger icon only after animation complete
            setShowHamburgerIcon(true);
            setIsAnimating(false);
          },
        });
      }
    }
  };

  const renderButtonContent = (button: ButtonData) => {
    switch (button.type) {
      case "color":
        return (
          <div
            className="w-3.5 h-3.5 rounded-full"
            style={{ backgroundColor: currentBgColor }}
          />
        );
      case "text":
        return (
          <span className="text-4xl font-serif text-white leading-none block -mt-1">
            a
          </span>
        );
      case "hamburger":
        return showHamburgerIcon ? (
          <div ref={hamburgerIconRef} className="flex flex-col gap-1.5">
            <div className="w-5 h-0.5 bg-white rounded-full" />
            <div className="w-5 h-0.5 bg-white rounded-full" />
            <div className="w-5 h-0.5 bg-white rounded-full" />
          </div>
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-3">
      {buttons.map((button, index) => (
        <div
          key={button.id}
          className="relative"
          ref={(el) => {
            if (button.type !== "hamburger") {
              otherButtonsRef.current[index] = el;
            }
          }}
        >
          {button.type === "color" && shouldRenderMenu && (
            <div
              ref={colorMenuRef}
              className="absolute bottom-0 right-16 flex flex-row-reverse gap-3"
            >
              {colorOptions
                .filter((color) => color !== currentBgColor)
                .map((color) => (
                  <button
                    key={color}
                    onClick={() => handleColorChange(color)}
                    className="color-option w-12 h-12 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow opacity-0"
                    style={{ backgroundColor: "#121212" }}
                    aria-label={`Change color to ${color}`}
                  >
                    <div
                      className="w-3.5 h-3.5 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                  </button>
                ))}
            </div>
          )}
          <button
            ref={button.type === "hamburger" ? settingsButtonRef : undefined}
            onClick={
              button.type === "color"
                ? () => setIsColorMenuOpen(!isColorMenuOpen)
                : button.type === "hamburger"
                  ? handleSettingsClick
                  : button.type === "text"
                    ? () => {
                        const newRedacted = !isRedacted;
                        setIsRedacted(newRedacted);
                        if (onRedactedToggle) onRedactedToggle(newRedacted);
                      }
                    : button.onClick
            }
            className={`w-12 h-12 rounded-xl shadow-lg hover:shadow-xl transition-shadow origin-bottom-right ${
              button.type === "hamburger" && isSettingsOpen
                ? "items-start justify-start pointer-events-none"
                : "flex items-center justify-center"
            }`}
            style={{ backgroundColor: "#121212" }}
            aria-label={button.label}
          >
            {renderButtonContent(button)}
          </button>
          {button.type === "hamburger" && isSettingsOpen && (
            <div
              ref={settingsPanelRef}
              className="absolute inset-0 p-12 pointer-events-auto cursor-default"
              onMouseDown={(e) => e.stopPropagation()}
              onMouseMove={(e) => e.stopPropagation()}
            >
              {/* X Close Button */}
              <button
                ref={xIconRef}
                onClick={handleSettingsClick}
                className="absolute top-12 left-12 w-8 h-8 flex items-center justify-center opacity-0 hover:opacity-50 transition-opacity cursor-pointer"
              >
                <div className="relative w-7 h-7">
                  <div
                    className="x-line absolute w-7 h-0.5 bg-white rounded-full left-0 top-1/2 -translate-y-1/2"
                    style={{ transform: "translateY(-50%) rotate(45deg)" }}
                  />
                  <div
                    className="x-line absolute w-7 h-0.5 bg-white rounded-full left-0 top-1/2 -translate-y-1/2"
                    style={{ transform: "translateY(-50%) rotate(-45deg)" }}
                  />
                </div>
              </button>

              {/* X Close Button */}
              <button
                ref={xIconRef}
                onClick={handleSettingsClick}
                className="absolute top-12 left-12 w-8 h-8 flex items-center justify-center opacity-0 hover:opacity-50 transition-opacity cursor-pointer"
              >
                <div className="relative w-7 h-7">
                  <div className="absolute w-7 h-0.5 bg-white rounded-full transform rotate-45 top-1/2 -translate-y-1/2" />
                  <div className="absolute w-7 h-0.5 bg-white rounded-full transform -rotate-45 top-1/2 -translate-y-1/2" />
                </div>
              </button>

              {/* Top right links */}
              <div className="absolute top-12 right-12 flex flex-col items-end gap-2 font-sans text-sm">
                <a
                  ref={(el) => {
                    linksRef.current[0] = el;
                  }}
                  href="https://mutualist.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-70 transition-opacity opacity-0"
                  style={{ color: "#808080" }}
                >
                  MUTUALIST.CO
                </a>
                <a
                  ref={(el) => {
                    linksRef.current[1] = el;
                  }}
                  href="https://behance.net"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-70 transition-opacity opacity-0"
                  style={{ color: "#808080" }}
                >
                  BEHANCE
                </a>
                <a
                  ref={(el) => {
                    linksRef.current[2] = el;
                  }}
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-70 transition-opacity opacity-0"
                  style={{ color: "#808080" }}
                >
                  INSTAGRAM
                </a>
              </div>

              {/* Bottom right categories */}
              <div className="absolute bottom-22 right-12 flex flex-col items-end gap-8">
                {(() => {
                  const uniqueCategories = [
                    "All",
                    ...Array.from(
                      new Set(portfolioItems.map((item) => item.category))
                    ),
                  ];
                  return uniqueCategories.map((category, index) => (
                    <button
                      key={category}
                      ref={(el) => {
                        categoriesRef.current[index] = el;
                      }}
                      className="opacity-0 flex items-start gap-2 group transition-all duration-300 cursor-pointer"
                    >
                      <span
                        className="font-sans text-xs group-hover:text-base transition-all duration-300"
                        style={{ color: "#808080" }}
                      >
                        <span className="group-hover:hidden">
                          ({String((index + 1) * 10).padStart(4, "0")})
                        </span>
                        <span
                          className="hidden group-hover:inline"
                          style={{ color: "#9FEDFF" }}
                        >
                          ({String((index + 1) * 10).padStart(4, "0")})
                        </span>
                      </span>
                      <span
                        className="font-serif text-3xl leading-none group-hover:text-4xl transition-all duration-300"
                        style={{ color: "#808080" }}
                      >
                        <span className="group-hover:hidden">{category}</span>
                        <span
                          className="hidden group-hover:inline"
                          style={{ color: "#FFF" }}
                        >
                          {category}
                        </span>
                      </span>
                    </button>
                  ));
                })()}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
