import Link from "next/link";
import { portfolioApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PortfolioSearch } from "@/components/portfolio-search";

export const dynamic = "force-dynamic";

export default async function PortfoliosPage() {
  let portfolios: import("@/lib/api").Portfolio[] = [];
  try {
    portfolios = await portfolioApi.getAll();
  } catch (error) {
    console.error("Failed to fetch portfolios:", error);
  }

  return (
    <div className="flex-1 space-y-6 p-6 lg:p-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Portfolios</h2>
          <p className="text-muted-foreground">
            Manage your portfolio collection
          </p>
        </div>
        <Link href="/life-portfolios/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Portfolio
          </Button>
        </Link>
      </div>

      {/* Search & Filter */}
      <PortfolioSearch portfolios={portfolios} />
    </div>
  );
}
