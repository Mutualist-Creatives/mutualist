import { MainPortfolioForm } from "@/components/main-portfolio-form";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default async function NewWorkPage() {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="flex-1 space-y-6 p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">New Project</h2>
          <p className="text-muted-foreground">
            Create a new portfolio project.
          </p>
        </div>
      </div>
      <div className="grid gap-8">
        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
              <CardDescription>
                Add a new main portfolio project.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MainPortfolioForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
