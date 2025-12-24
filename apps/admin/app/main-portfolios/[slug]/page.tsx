import { MainPortfolioForm } from "@/components/main-portfolio-form";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { worksApi } from "@/lib/api";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function EditWorkPage({ params }: PageProps) {
  const session = await auth();
  if (!session) redirect("/login");

  const { slug } = await params;
  const work = await worksApi.getBySlug(slug);

  return (
    <div className="flex-1 space-y-6 p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">Edit Project</h2>
          <p className="text-muted-foreground">
            Manage your portfolio project.
          </p>
        </div>
      </div>
      <div className="grid gap-8">
        <div className="grid gap-4">
          <MainPortfolioForm work={work} />
        </div>
      </div>
    </div>
  );
}
