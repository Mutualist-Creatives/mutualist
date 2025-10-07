// apps/life/components/portfolio-card.tsx

import { PortfolioItem } from "@/data/types";

interface PortfolioCardProps {
  item?: PortfolioItem; // Dibuat opsional agar fleksibel
  style?: React.CSSProperties; // Dibuat opsional agar fleksibel
}

export function PortfolioCard({ item, style }: PortfolioCardProps) {
  return (
    <div
      style={style}
      className="h-[320px] w-[240px] rounded-lg bg-gray-300 mb-12" // mb-12 untuk jarak vertikal
    >
      {/* Isinya kosong, hanya placeholder */}
    </div>
  );
}
