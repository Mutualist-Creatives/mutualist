import useSWR from "swr";
import { Portfolio } from "@/data/types";
import { portfolioApi } from "@/lib/api";
import { portfolioItems } from "@/data/portofolio-data";

// Convert static data to Portfolio format for fallback
const fallbackData: Portfolio[] = portfolioItems.map((item) => ({
  ...item,
  createdAt: item.createdAt || new Date().toISOString(),
  updatedAt: item.updatedAt || new Date().toISOString(),
}));

export function usePortfolios() {
  const { data, error, isLoading, mutate, isValidating } = useSWR<Portfolio[]>(
    "/api/portfolios",
    portfolioApi.getAll,
    {
      // OPTIMISTIC UI: Show static data immediately on first load
      fallbackData: fallbackData,

      // Revalidate immediately on mount to fetch fresh data
      revalidateOnMount: true,

      // Revalidate on focus
      revalidateOnFocus: true,

      // Revalidate on reconnect
      revalidateOnReconnect: true,

      // Refresh every 30 seconds (auto-update)
      refreshInterval: 30000,

      // Keep previous data while revalidating (smooth transitions)
      keepPreviousData: true,

      // Dedupe requests within 2 seconds
      dedupingInterval: 2000,

      // Error retry configuration
      errorRetryCount: 3,
      errorRetryInterval: 5000,

      // On error, silently fallback to static data
      onError: () => {
        // Silently use fallback data
      },

      // Success callback
      onSuccess: () => {
        // Portfolios updated successfully
      },
    }
  );

  return {
    portfolios: data || fallbackData,
    isLoading: false, // Never show loading state (optimistic UI)
    isError: error,
    isValidating, // For showing subtle update indicator
    mutate, // For manual revalidation
  };
}
