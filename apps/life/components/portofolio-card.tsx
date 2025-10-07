import Image from "next/image";
import { PortfolioItem } from "@/data/types";

interface PortfolioCardProps {
  item?: PortfolioItem;
  style?: React.CSSProperties;
}

export function PortfolioCard({ item, style }: PortfolioCardProps) {
  if (!item) {
    return (
      <div
        style={style}
        className="h-[320px] w-[240px] rounded-lg bg-gray-300"
      />
    );
  }

  return (
    <div
      style={style}
      className="h-[320px] w-[240px] rounded-lg overflow-hidden bg-white"
    >
      <div className="relative w-full h-full">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover"
          sizes="240px"
        />
      </div>
    </div>
  );
}
