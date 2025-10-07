"use client";

import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";

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
    onClick: () => console.log("Typography clicked"),
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
}: FixedButtonProps) {
  const [currentBgColor, setCurrentBgColor] = useState("#EEEBE2");
  const [isColorMenuOpen, setIsColorMenuOpen] = useState(false);
  const colorMenuRef = useRef<HTMLDivElement>(null);

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
      } else {
        gsap.to(colorButtons, {
          opacity: 0,
          x: 30,
          duration: 0.2,
          stagger: 0.03,
          ease: "power2.in",
        });
      }
    }
  }, [isColorMenuOpen]);

  const handleColorChange = (color: string) => {
    setCurrentBgColor(color);
    setIsColorMenuOpen(false);
    if (onColorChange) {
      onColorChange(color);
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
        return (
          <div className="flex flex-col gap-1.5">
            <div className="w-5 h-0.5 bg-white rounded-full" />
            <div className="w-5 h-0.5 bg-white rounded-full" />
            <div className="w-5 h-0.5 bg-white rounded-full" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-3">
      {buttons.map((button) => (
        <div key={button.id} className="relative">
          {button.type === "color" && isColorMenuOpen && (
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
            onClick={
              button.type === "color"
                ? () => setIsColorMenuOpen(!isColorMenuOpen)
                : button.onClick
            }
            className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
            style={{ backgroundColor: "#121212" }}
            aria-label={button.label}
          >
            {renderButtonContent(button)}
          </button>
        </div>
      ))}
    </div>
  );
}
