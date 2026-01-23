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
      {/* Header */}
      <div className="flex items-center gap-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Edit Project</h2>
          <p className="text-muted-foreground">
            Update project information for &quot;{portfolio.title}&quot;
          </p>
        </div>
      </div>

      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>Project Information</CardTitle>
          <CardDescription>
            Make changes to the project details below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PortfolioForm portfolio={portfolio} />
        </CardContent>
      </Card>
    </div>
  );
}
