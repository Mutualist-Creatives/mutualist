import * as React from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Use themed color based on background instead of default gray */
  themed?: boolean;
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, themed, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="skeleton"
        className={cn(
          "relative overflow-hidden rounded-md",
          themed ? "bg-white/10" : "bg-gray-200/80",
          className
        )}
        {...props}
      >
        {/* Shimmer overlay */}
        <div
          className="absolute inset-0 -translate-x-full animate-shimmer"
          style={{
            background: themed
              ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)"
              : "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
          }}
        />
      </div>
    );
  }
);
Skeleton.displayName = "Skeleton";

export { Skeleton };
