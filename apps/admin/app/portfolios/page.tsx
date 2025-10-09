import Link from "next/link";
import Image from "next/image";
import { portfolioApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DeleteButton } from "@/components/delete-button";
import { Plus, Pencil, Briefcase } from "lucide-react";
import { PortfolioSearch } from "@/components/portfolio-search";

export default async function PortfoliosPage() {
  const portfolios = await portfolioApi.getAll();

  return (
    <div className="flex-1 space-y-6 p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Portfolios</h2>
          <p className="text-muted-foreground">
            Manage your portfolio collection
          </p>
        </div>
        <Link href="/portfolios/new">
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
