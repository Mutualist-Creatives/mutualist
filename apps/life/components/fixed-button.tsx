"use client";

import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useCategories } from "@/lib/hooks/useCategories";
import {
  COLOR_OPTIONS,
  DEFAULT_BG_COLOR,
  BUTTON_BG_COLOR,
} from "@/lib/constants";
import { PORTFOLIO_CATEGORIES } from "@/lib/categories";
import { Portfolio } from "@/data/types";

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
  onCategoryChange?: (category: string | null) => void;
  selectedCategory?: string | null;
  portfolios?: Portfolio[]; // For counting items per category
}

const defaultButtons: ButtonData[] = [
  {
    id: "color-changer",
    type: "color",
    label: "Change Background Color",
    color: DEFAULT_BG_COLOR,
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
    onClick: () => {}, // TODO: Implement menu functionality
  },
];

export function FixedButton({
  buttons = defaultButtons,
  onColorChange,
  onSettingsOpenChange,
  onRedactedToggle,
  onCategoryChange,
  selectedCategory = null,
  portfolios = [],
}: FixedButtonProps) {
  const [currentBgColor, setCurrentBgColor] = useState(DEFAULT_BG_COLOR);
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

  // Use fixed categories (always show all, even if empty)
  useCategories();
  const categories = PORTFOLIO_CATEGORIES;

  useEffect(() => {
    if (isColorMenuOpen) {
      setShouldRenderMenu(true);
    }
  }, [isColorMenuOpen]);

  useEffect(() => {
    if (colorMenuRef.current) {
      const colorButtons =
        colorMenuRef.current.querySelectorAll(".color-option");
      const isMobile = window.innerWidth < 768;

      if (isColorMenuOpen) {
        gsap.to(colorButtons, {
          opacity: 1,
          x: isMobile ? 0 : 0,
          y: isMobile ? 0 : 0,
          duration: 0.3,
          stagger: 0.05,
          ease: "back.out(1.7)",
        });
      } else if (shouldRenderMenu) {
        gsap.to(colorButtons, {
          opacity: 0,
          x: isMobile ? 0 : 30,
          y: isMobile ? -30 : 0,
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

        const isMobile = window.innerWidth < 768;

        // Hitung tinggi target
        const buttonRect = settingsButtonRef.current.getBoundingClientRect();
        const buttonHeight = 48;

        let targetHeight;
        if (isMobile) {
          // Mobile: morph ke bawah sampai bottom viewport dengan padding
          const distanceToBottom =
            window.innerHeight - buttonRect.bottom + buttonHeight;
          const paddingBottom = 16;
          targetHeight = distanceToBottom - paddingBottom;
        } else {
          // Desktop: morph ke atas sampai top viewport dengan padding
          const distanceToTop = buttonRect.top;
          const paddingTop = 24;
          targetHeight = distanceToTop + buttonHeight - paddingTop;
        }

        // Step 1: Morph ke kiri (memanjang horizontal lebih panjang)
        const targetWidth = isMobile
          ? Math.min(window.innerWidth - 32, 400)
          : 528;

        timeline.to(settingsButtonRef.current, {
          width: targetWidth,
          duration: 0.8,
          ease: "power2.out",
        });

        // Step 2: Morph ke atas (memanjang vertikal)
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

      // Fade in other buttons with delay
      const otherButtons = otherButtonsRef.current.filter(Boolean);
      gsap.to(otherButtons, {
        opacity: 1,
        duration: 0.3,
        delay: 0.8, // Delay after settings panel starts closing
        ease: "power2.out",
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSettingsOpen, isAnimating]);

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
    <div className="fixed right-4 md:right-6 top-4 md:top-auto md:bottom-6 flex flex-row md:flex-col gap-2 md:gap-3">
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
              className="absolute top-16 right-0 md:top-auto md:bottom-0 md:right-16 flex flex-col md:flex-row-reverse gap-3"
            >
              {COLOR_OPTIONS.filter((color) => color !== currentBgColor).map(
                (color) => (
                  <button
                    key={color}
                    onClick={() => handleColorChange(color)}
                    className="color-option w-12 h-12 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow opacity-0"
                    style={{ backgroundColor: BUTTON_BG_COLOR }}
                    aria-label={`Change color to ${color}`}
                  >
                    <div
                      className="w-3.5 h-3.5 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                  </button>
                )
              )}
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
                ? "flex items-start justify-start pointer-events-none"
                : "flex items-center justify-center"
            }`}
            style={{ backgroundColor: BUTTON_BG_COLOR }}
            aria-label={button.label}
          >
            {renderButtonContent(button)}
          </button>
          {button.type === "hamburger" && isSettingsOpen && (
            <div
              ref={settingsPanelRef}
              className="absolute inset-0 p-6 md:p-12 pointer-events-auto cursor-default"
              onMouseDown={(e) => e.stopPropagation()}
              onMouseMove={(e) => e.stopPropagation()}
            >
              {/* X Close Button */}
              <button
                ref={xIconRef}
                onClick={handleSettingsClick}
                className="absolute top-6 left-6 md:top-12 md:left-12 w-8 h-8 flex items-center justify-center opacity-0 hover:opacity-50 transition-opacity cursor-pointer"
              >
                <div className="relative w-7 h-7">
                  <div className="absolute w-7 h-0.5 bg-white rounded-full transform rotate-45 top-1/2 -translate-y-1/2" />
                  <div className="absolute w-7 h-0.5 bg-white rounded-full transform -rotate-45 top-1/2 -translate-y-1/2" />
                </div>
              </button>

              {/* Top right links */}
              <div className="absolute top-6 right-6 md:top-12 md:right-12 flex flex-col items-end gap-4 md:gap-6 font-sans text-xs md:text-sm hover:text-white">
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
              <div className="absolute bottom-16 right-6 md:bottom-22 md:right-12 flex flex-col items-end gap-6 md:gap-9">
                {/* Update Indicator */}
                {/* {isValidating && (
                  <div className="flex items-center gap-2 mb-2 opacity-70">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                    <span className="text-xs text-gray-400">
                      Checking for updates...
                    </span>
                  </div>
                )} */}

                {["All", ...categories].map((category, index) => {
                  const isSelected =
                    (category === "All" && selectedCategory === null) ||
                    category === selectedCategory;

                  // Count portfolios in this category (OR logic - count if ANY category matches)
                  const count =
                    category === "All"
                      ? portfolios.length
                      : portfolios.filter((p) =>
                          p.categories.includes(category)
                        ).length;

                  // Disable if no content (except "All")
                  const isEmpty = count === 0;
                  const isDisabled = isEmpty && category !== "All";

                  return (
                    <button
                      key={category}
                      ref={(el) => {
                        categoriesRef.current[index] = el;
                      }}
                      onClick={() => {
                        if (!isDisabled && onCategoryChange) {
                          onCategoryChange(
                            category === "All" ? null : category
                          );
                        }
                      }}
                      disabled={isDisabled}
                      className={`opacity-0 flex items-start gap-2 transition-all duration-300 ${
                        isDisabled
                          ? "cursor-not-allowed"
                          : "group cursor-pointer"
                      }`}
                    >
                      <span
                        className={`font-sans text-xs transition-all duration-300 ${
                          isDisabled ? "" : "group-hover:text-base"
                        }`}
                        style={{
                          color: isSelected
                            ? "#9FEDFF"
                            : isDisabled
                              ? "#404040"
                              : "#808080",
                        }}
                      >
                        <span
                          className={
                            isSelected
                              ? "hidden"
                              : isDisabled
                                ? ""
                                : "group-hover:hidden"
                          }
                        >
                          ({String(count).padStart(3, "0")})
                        </span>
                        {!isDisabled && (
                          <span
                            className={
                              isSelected
                                ? "inline"
                                : "hidden group-hover:inline"
                            }
                            style={{ color: "#9FEDFF" }}
                          >
                            ({String(count).padStart(3, "0")})
                          </span>
                        )}
                      </span>
                      <span
                        className={`font-serif text-xl md:text-2xl leading-none transition-all duration-300 ${
                          isDisabled
                            ? ""
                            : "group-hover:text-2xl md:group-hover:text-3xl"
                        }`}
                        style={{
                          color: isSelected
                            ? "#FFF"
                            : isDisabled
                              ? "#404040"
                              : "#808080",
                        }}
                      >
                        <span
                          className={
                            isSelected
                              ? "hidden"
                              : isDisabled
                                ? ""
                                : "group-hover:hidden"
                          }
                        >
                          {category}
                        </span>
                        {!isDisabled && (
                          <span
                            className={
                              isSelected
                                ? "inline"
                                : "hidden group-hover:inline"
                            }
                            style={{ color: "#FFF" }}
                          >
                            {category}
                          </span>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
