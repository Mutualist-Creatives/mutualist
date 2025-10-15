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
      // Fallback to static data
      fallbackData: fallbackCategories,
      // Error handling
      onError: (err) => {
        console.error("Error fetching categories:", err);
      },
      // Success callback
      onSuccess: () => {
        // Categories updated successfully
      },
    }
  );

  return {
    categories: data || fallbackCategories,
    isLoading,
    isError: error,
    isValidating, // For showing update indicator
    mutate, // For manual refresh
  };
}
