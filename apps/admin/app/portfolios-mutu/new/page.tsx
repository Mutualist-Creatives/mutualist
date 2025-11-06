import { PortfolioFormMutu } from "@/components/portfolio-form-mutu";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus } from "lucide-react";

export default function NewPortfolioMutuPage() {
  return (
    <div className="flex-1 space-y-6 p-6 lg:p-8">
      <div className="flex items-center gap-2">
        <Plus className="h-6 w-6" />
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Add New Portfolio Mutu
          </h2>
          <p className="text-muted-foreground">
            Create a new portfolio mutu item for your collection
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Portfolio Information</CardTitle>
          <CardDescription>
            Fill in the details below to create a new portfolio mutu item
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PortfolioFormMutu />
        </CardContent>
      </Card>
    </div>
  );
}
