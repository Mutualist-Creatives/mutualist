import { portfolioApi } from "@/lib/api";
import { PortfolioForm } from "@/components/portfolio-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function EditPortfolioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const portfolio = await portfolioApi.getById(id);

  return (
    <div className="flex-1 space-y-6 p-6 lg:p-8">
      {/* Back Button */}
      <Link href="/life-portfolios">
        <Button variant="ghost" className="gap-2 -ml-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Portfolios
        </Button>
      </Link>

      {/* Header */}
      <div className="flex items-center gap-2">
        <Pencil className="h-6 w-6" />
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Edit Portfolio</h2>
          <p className="text-muted-foreground">
            Update portfolio information for &quot;{portfolio.title}&quot;
          </p>
        </div>
      </div>

      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Information</CardTitle>
          <CardDescription>
            Make changes to the portfolio details below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PortfolioForm portfolio={portfolio} />
        </CardContent>
      </Card>
    </div>
  );
}
