import { Skeleton } from "@/components/ui/skeleton";

export function PortfolioCardSkeleton() {
  return (
    <div className="h-auto w-[240px] rounded-lg overflow-hidden bg-white">
      <Skeleton className="w-full h-[320px]" />
    </div>
  );
}
