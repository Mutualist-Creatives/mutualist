import Link from "next/link";
import { portfolioMutuApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PortfolioMutuSearch } from "@/components/portfolio-mutu-search";

export default async function PortfoliosMutuPage() {
  const portfolios = await portfolioMutuApi.getAll();

  return (
    <div className="flex-1 space-y-6 p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Portfolios Mutu</h2>
          <p className="text-muted-foreground">
            Manage your Mutu portfolio collection
          </p>
        </div>
        <Link href="/portfolios-mutu/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Portfolio
          </Button>
        </Link>
      </div>

      {/* Search & Filter */}
      <PortfolioMutuSearch portfolios={portfolios} />
    </div>
  );
}
