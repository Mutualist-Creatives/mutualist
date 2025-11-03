import { Skeleton } from "@/components/ui/skeleton";

interface PortfolioCardSkeletonProps {
  variant?: "tall" | "medium" | "short";
}

// Aspect ratios based on 240px width
const HEIGHT_VARIANTS = {
  tall: 360, // 3:4.5 (extra tall portrait)
  medium: 320, // 3:4 (standard portrait)
  short: 280, // 3:3.5 (shorter portrait)
};

export function PortfolioCardSkeleton({
  variant = "medium",
}: PortfolioCardSkeletonProps) {
  const height = HEIGHT_VARIANTS[variant];

  return (
    <Skeleton
      className="w-[240px] rounded-lg"
      style={{ height: `${height}px` }}
    />
  );
}
