import useSWR from "swr";
import { Portfolio } from "@/data/types";
import { portfolioApi } from "@/lib/api";

export function usePortfolio(id: string | null) {
  const { data, error, isLoading } = useSWR<Portfolio>(
    id ? `/api/portfolios/${id}` : null,
    () => (id ? portfolioApi.getById(id) : null),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000, // 1 minute
      onError: (err) => {
        console.error(`Error fetching portfolio ${id}:`, err);
      },
    }
  );

  return {
    portfolio: data,
    isLoading,
    isError: error,
  };
}
