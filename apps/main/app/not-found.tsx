"use client";

import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-white p-4 text-center font-sans">
      <h1 className="mb-2 text-6xl font-bold text-purple-mutu md:mb-4 md:text-9xl">
        404
      </h1>
      <h2 className="mb-4 text-lg font-semibold text-purple-mutu md:mb-8 md:text-2xl">
        Page Not Found
      </h2>
      <p className="mb-6 max-w-xs text-sm text-purple-mutu/80 md:mb-8 md:max-w-md md:text-base">
        Oops! The page you are looking for does not exist. It might have been
        moved or deleted.
      </p>
      <button
        onClick={() => router.back()}
        className="group inline-flex items-center gap-2 rounded-full bg-green-mutu px-4 py-2 text-sm font-medium text-yellow-mutu transition-transform hover:scale-105 md:px-6 md:py-3 md:text-base cursor-pointer"
      >
        Back
      </button>
    </div>
  );
}
