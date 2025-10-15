import useSWR from "swr";
import { portfolioApi } from "@/lib/api";
import { portfolioItems } from "@/data/portofolio-data";

// Fallback categories from static data
const fallbackCategories = Array.from(
  new Set(portfolioItems.map((item) => item.category))
);

export function useCategories() {
  const { data, error, isLoading } = useSWR<string[]>(
    "/api/portfolios/categories",
    portfolioApi.getCategories,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      // Categories don't change often, cache for 5 minutes
      dedupingInterval: 300000,
      fallbackData: fallbackCategories,
      onError: (err) => {
        console.error("Error fetching categories:", err);
      },
    }
  );

  return {
    categories: data || fallbackCategories,
    isLoading,
    isError: error,
  };
}
