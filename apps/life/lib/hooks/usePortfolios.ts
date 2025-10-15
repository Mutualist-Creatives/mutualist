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
  const { data, error, isLoading, mutate } = useSWR<Portfolio[]>(
    "/api/portfolios",
    portfolioApi.getAll,
    {
      // Revalidate on focus
      revalidateOnFocus: true,
      // Revalidate on reconnect
      revalidateOnReconnect: true,
      // Refresh every 30 seconds
      refreshInterval: 30000,
      // Keep previous data while revalidating
      keepPreviousData: true,
      // Fallback to static data if API fails
      fallbackData: fallbackData,
      // Dedupe requests within 2 seconds
      dedupingInterval: 2000,
      // Error retry configuration
      errorRetryCount: 3,
      errorRetryInterval: 5000,
      // On error, use fallback data
      onError: (err) => {
        console.error("SWR Error:", err);
      },
    }
  );

  return {
    portfolios: data || fallbackData,
    isLoading,
    isError: error,
    mutate, // For manual revalidation
  };
}
