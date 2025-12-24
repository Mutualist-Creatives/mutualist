import React from "react";
import { Portfolio } from "@/data/types";

interface PortfolioCardProps {
  item?: Portfolio;
  style?: React.CSSProperties;
  onClick?: () => void;
  onHeightChange?: (height: number) => void;
  width?: number;
}

// Memoized to prevent unnecessary re-renders
export const PortfolioCard = React.memo(function PortfolioCard({
  item,
  style,
  onClick,
  onHeightChange,
  width = 240,
}: PortfolioCardProps) {
  const cardRef = React.useRef<HTMLDivElement>(null);

  // Report height after image loads
  React.useEffect(() => {
    if (!cardRef.current || !onHeightChange) return;

    const img = cardRef.current.querySelector("img");
    if (!img) return;

    const reportHeight = () => {
      if (cardRef.current) {
        onHeightChange(cardRef.current.offsetHeight);
      }
    };

    if (img.complete) {
      reportHeight();
    } else {
      img.addEventListener("load", reportHeight);
      return () => img.removeEventListener("load", reportHeight);
    }
  }, [item, onHeightChange]);

  if (!item) {
    return (
      <div
        style={{ ...style, width: `${width}px` }}
        className="h-auto rounded-lg bg-gray-300"
      />
    );
  }

  return (
    <div
      ref={cardRef}
      style={{ ...style, width: `${width}px` }}
      onClick={onClick}
      className="h-auto rounded-lg overflow-hidden bg-white cursor-pointer group relative"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.images[0]}
        alt={item.title}
        className="w-full h-auto object-cover transition-all duration-300 group-hover:brightness-50"
        loading="lazy"
      />

      {/* Hover Overlay with VIEW button */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="px-6 py-2 border border-white rounded-full">
          <span className="font-sans text-white text-xs uppercase font-medium tracking-wider">
            view
          </span>
        </div>
      </div>
    </div>
  );
});
