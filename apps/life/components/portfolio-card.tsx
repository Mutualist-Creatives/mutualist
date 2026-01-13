import React, { useState } from "react";
import { Portfolio } from "@/data/types";
import { Skeleton } from "@/components/ui/skeleton";

interface PortfolioCardProps {
  item?: Portfolio;
  style?: React.CSSProperties;
  onClick?: () => void;
  onHeightChange?: (height: number) => void;
  width?: number;
}

// Helper to check if URL is a video
const isVideoUrl = (url: string) => {
  const videoExtensions = [".mp4", ".webm", ".mov", ".ogg"];
  return videoExtensions.some((ext) => url.toLowerCase().endsWith(ext));
};

// Memoized to prevent unnecessary re-renders
export const PortfolioCard = React.memo(function PortfolioCard({
  item,
  style,
  onClick,
  onHeightChange,
  width = 240,
}: PortfolioCardProps) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [isMediaLoaded, setIsMediaLoaded] = useState(false);

  const mediaUrl = item?.images[0];
  const isVideo = mediaUrl ? isVideoUrl(mediaUrl) : false;

  // Report height after media loads
  React.useEffect(() => {
    if (!cardRef.current || !onHeightChange) return;

    const media = cardRef.current.querySelector(isVideo ? "video" : "img");
    if (!media) return;

    const reportHeight = () => {
      if (cardRef.current) {
        onHeightChange(cardRef.current.offsetHeight);
      }
    };

    if (isVideo) {
      const video = media as HTMLVideoElement;
      if (video.readyState >= 2) {
        reportHeight();
      } else {
        video.addEventListener("loadeddata", reportHeight);
        return () => video.removeEventListener("loadeddata", reportHeight);
      }
    } else {
      const img = media as HTMLImageElement;
      if (img.complete) {
        reportHeight();
      } else {
        img.addEventListener("load", reportHeight);
        return () => img.removeEventListener("load", reportHeight);
      }
    }
  }, [item, onHeightChange, isVideo]);

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
      {/* Skeleton overlay - fades out when media loads */}
      <div
        className={`absolute inset-0 z-10 transition-opacity duration-500 ${
          isMediaLoaded ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <Skeleton className="w-full h-full rounded-lg" themed />
      </div>

      {isVideo ? (
        <video
          src={mediaUrl}
          className={`w-full h-auto object-cover transition-all duration-500 group-hover:brightness-50 ${
            isMediaLoaded ? "opacity-100" : "opacity-0"
          }`}
          autoPlay
          muted
          loop
          playsInline
          onLoadedData={() => setIsMediaLoaded(true)}
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={mediaUrl}
          alt={item.title}
          className={`w-full h-auto object-cover transition-all duration-500 group-hover:brightness-50 ${
            isMediaLoaded ? "opacity-100" : "opacity-0"
          }`}
          loading="lazy"
          onLoad={() => setIsMediaLoaded(true)}
        />
      )}

      {/* Hover Overlay with VIEW button */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
        <div className="px-6 py-2 border border-white rounded-full">
          <span className="font-sans text-white text-xs uppercase font-medium tracking-wider">
            view
          </span>
        </div>
      </div>
    </div>
  );
});
