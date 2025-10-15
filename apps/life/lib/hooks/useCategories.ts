import useSWR from "swr";
import { portfolioApi } from "@/lib/api";
import { portfolioItems } from "@/data/portofolio-data";

// Fallback categories from static data
const fallbackCategories = Array.from(
  new Set(portfolioItems.map((item) => item.category))
);

export function useCategories() {
  const { data, error, isLoading, mutate, isValidating } = useSWR<string[]>(
    "/api/portfolios/categories",
    portfolioApi.getCategories,
    {
      // OPTIMISTIC UI: Show static categories immediately
      fallbackData: fallbackCategories,

      // Revalidate immediately on mount to fetch fresh data
      revalidateOnMount: true,

      // Revalidate when user returns to tab
      revalidateOnFocus: true,

      // Revalidate when network reconnects
      revalidateOnReconnect: true,

      // Auto-refresh every 60 seconds (check for new categories)
      refreshInterval: 60000,

      // Keep previous data while revalidating
      keepPreviousData: true,

      // Dedupe requests within 10 seconds
      dedupingInterval: 10000,

      // Error handling - silently use fallback
      onError: () => {
        // Silently use fallback data
      },

      // Success callback
      onSuccess: () => {
        // Categories updated successfully
      },
    }
  );

  return {
    categories: data || fallbackCategories,
    isLoading: false, // Never show loading state (optimistic UI)
    isError: error,
    isValidating, // For showing subtle update indicator
    mutate, // For manual refresh
  };
}
