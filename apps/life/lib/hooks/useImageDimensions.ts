import { useEffect, useState } from "react";
import { Portfolio } from "@/data/types";
import { preloadImageDimensions } from "@/lib/image-dimensions";

export function useImageDimensions(portfolios: Portfolio[]) {
  const [loadedCount, setLoadedCount] = useState(0);

  useEffect(() => {
    if (portfolios.length === 0) return;

    let mounted = true;
    let loaded = 0;

    // Preload first image of each portfolio
    const preloadPromises = portfolios.map((portfolio) => {
      if (!portfolio.images[0]) return Promise.resolve();

      return preloadImageDimensions(portfolio.images[0])
        .then(() => {
          if (mounted) {
            loaded++;
            setLoadedCount(loaded);
          }
        })
        .catch(() => {
          // Ignore errors, will use fallback height
        });
    });

    Promise.all(preloadPromises);

    return () => {
      mounted = false;
    };
  }, [portfolios]);

  return { loadedCount, totalCount: portfolios.length };
}
