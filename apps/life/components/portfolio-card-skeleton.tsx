import { Skeleton } from "@/components/ui/skeleton";

interface PortfolioCardSkeletonProps {
  variant?: "tall" | "medium" | "short";
  width?: number;
  /** Use themed colors that blend with dark backgrounds */
  themed?: boolean;
}

// Aspect ratios - maintaining 3:4 base ratio with variations
const ASPECT_RATIOS = {
  tall: 1.5, // 3:4.5 (extra tall portrait)
  medium: 1.333, // 3:4 (standard portrait)
  short: 1.167, // 3:3.5 (shorter portrait)
};

export function PortfolioCardSkeleton({
  variant = "medium",
  width = 240,
  themed = false,
}: PortfolioCardSkeletonProps) {
  // Calculate height based on width and aspect ratio
  const height = width * ASPECT_RATIOS[variant];

  return (
    <Skeleton
      className="rounded-lg"
      themed={themed}
      style={{ width: `${width}px`, height: `${height}px` }}
    />
  );
}
