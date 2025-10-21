import { PortfolioForm } from "@/components/portfolio-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus } from "lucide-react";

export default function NewPortfolioPage() {
  return (
    <div className="flex-1 space-y-6 p-6 lg:p-8">
      <div className="flex items-center gap-2">
        <Plus className="h-6 w-6" />
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Add New Portfolio
          </h2>
          <p className="text-muted-foreground">
            Create a new portfolio item for your collection
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Portfolio Information</CardTitle>
          <CardDescription>
            Fill in the details below to create a new portfolio item
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PortfolioForm />
        </CardContent>
      </Card>
    </div>
  );
}
