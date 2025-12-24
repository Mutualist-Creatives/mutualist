// Utility to preload and cache image dimensions

const dimensionsCache = new Map<string, { width: number; height: number }>();

export function preloadImageDimensions(
  src: string
): Promise<{ width: number; height: number }> {
  // Check cache first
  if (dimensionsCache.has(src)) {
    return Promise.resolve(dimensionsCache.get(src)!);
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const dimensions = { width: img.width, height: img.height };
      dimensionsCache.set(src, dimensions);
      resolve(dimensions);
    };
    img.onerror = reject;
    img.src = src;
  });
}

export function getImageHeight(
  src: string,
  targetWidth: number
): number | null {
  const dimensions = dimensionsCache.get(src);
  if (!dimensions) return null;

  // Calculate height based on aspect ratio
  return Math.round((dimensions.height / dimensions.width) * targetWidth);
}

export function clearDimensionsCache() {
  dimensionsCache.clear();
}
