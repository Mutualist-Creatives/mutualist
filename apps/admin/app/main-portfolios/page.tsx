import Link from "next/link";
import { worksApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ClientPortfolioSearch } from "@/components/client-portfolio-search";

export const dynamic = "force-dynamic";

export default async function ClientPortfoliosPage() {
  let works: import("@/lib/api").Work[] = [];
  try {
    works = await worksApi.getAll();
  } catch (error) {
    console.error("Failed to fetch works:", error);
  }

  return (
    <div className="flex-1 space-y-6 p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Main Portfolios</h2>
          <p className="text-muted-foreground">Manage your main projects</p>
        </div>
        <Link href="/main-portfolios/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Project
          </Button>
        </Link>
      </div>

      {/* Search & Filter */}
      <ClientPortfolioSearch works={works} />
    </div>
  );
}
