import useSWR from "swr";
import { Portfolio } from "@/data/types";
import { portfolioApi } from "@/lib/api";

export function usePortfolios() {
  const { data, error, mutate, isValidating } = useSWR<Portfolio[]>(
    "/api/portfolios",
    portfolioApi.getAll,
    {
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
    }
  );

  return {
    portfolios: data || [],
    isLoading: !data && !error,
    isError: error,
    isValidating,
    mutate,
  };
}
