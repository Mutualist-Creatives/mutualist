import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      {/* Left Column Skeleton - Dark branding area */}
      <div className="hidden bg-zinc-900 lg:flex flex-col items-center justify-center relative overflow-hidden text-white dark:border-r">
        {/* Mimic the centered branding content */}
        <div className="relative z-20 flex flex-col items-center gap-6 text-center">
          {/* Logo Skeleton */}
          <Skeleton className="h-20 w-20 rounded-full bg-zinc-800" />
          <div className="space-y-2 flex flex-col items-center">
            {/* Title Skeleton */}
            <Skeleton className="h-10 w-48 bg-zinc-800" />
            {/* Subtitle Skeleton */}
            <Skeleton className="h-6 w-64 bg-zinc-800" />
          </div>
        </div>
      </div>

      {/* Right Column Skeleton - Form area */}
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto w-[350px] space-y-6">
          <div className="flex flex-col space-y-2 text-center items-center">
            {/* Mobile Logo Skeleton */}
            <div className="lg:hidden mb-4">
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>

            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-4 w-60" />
          </div>

          <div className="space-y-4">
            {/* Email Input */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-10" />
              <Skeleton className="h-10 w-full rounded-sm" />
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full rounded-sm" />
            </div>

            {/* Submit Button */}
            <Skeleton className="h-10 w-full rounded-sm" />
          </div>
        </div>
      </div>
    </div>
  );
}
