import { Skeleton } from "@/components/ui/skeleton";

interface PortfolioCardSkeletonProps {
  variant?: "tall" | "medium" | "short";
  width?: number;
}

// Aspect ratios based on 240px width (base)
const BASE_HEIGHT_VARIANTS = {
  tall: 360, // 3:4.5 (extra tall portrait)
  medium: 320, // 3:4 (standard portrait)
  short: 280, // 3:3.5 (shorter portrait)
};

export function PortfolioCardSkeleton({
  variant = "medium",
  width = 240,
}: PortfolioCardSkeletonProps) {
  // Scale height proportionally based on width
  const scale = width / 240;
  const height = BASE_HEIGHT_VARIANTS[variant] * scale;

  return (
    <Skeleton
      className="rounded-lg"
      style={{ width: `${width}px`, height: `${height}px` }}
    />
  );
}
