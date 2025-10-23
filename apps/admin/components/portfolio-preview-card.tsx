interface PortfolioPreviewCardProps {
  title: string;
  images: string[];
  onClick?: () => void;
}

// Helper function to validate URL
function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function PortfolioPreviewCard({
  title,
  images,
  onClick,
}: PortfolioPreviewCardProps) {
  const hasValidImage =
    images.length > 0 && images[0].trim() !== "" && isValidUrl(images[0]);

  return (
    <div
      onClick={onClick}
      className="h-auto w-[240px] rounded-lg overflow-hidden bg-white cursor-pointer group relative shadow-md"
    >
      {hasValidImage ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[0]}
            alt={title || "Preview"}
            className="w-full h-auto object-cover transition-all duration-300 group-hover:brightness-50"
            loading="lazy"
          />

          {/* Hover Overlay with VIEW button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="px-6 py-2 border border-white rounded-full">
              <span className="font-sans text-white text-xs uppercase font-medium tracking-wider">
                view
              </span>
            </div>
          </div>
        </>
      ) : (
        <div className="w-full h-[320px] bg-gray-200 flex items-center justify-center">
          <span className="text-gray-400 text-sm">No image</span>
        </div>
      )}
    </div>
  );
}
