import React from "react";
import { Portfolio } from "@/data/types";

interface PortfolioCardProps {
  item?: Portfolio;
  style?: React.CSSProperties;
  onClick?: () => void;
}

// Memoized to prevent unnecessary re-renders
export const PortfolioCard = React.memo(function PortfolioCard({
  item,
  style,
  onClick,
}: PortfolioCardProps) {
  if (!item) {
    return (
      <div
        style={style}
        className="h-[320px] w-[240px] rounded-lg bg-gray-300"
      />
    );
  }

  return (
    <div
      style={style}
      onClick={onClick}
      className="h-[320px] w-[240px] rounded-lg overflow-hidden bg-white cursor-pointer group relative"
    >
      <div className="relative w-full h-full">
        <img
          src={item.images[0]}
          alt={item.title}
          className="absolute inset-0 w-full h-full object-cover transition-all duration-300 group-hover:brightness-50"
          loading="lazy"
        />
      </div>

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
