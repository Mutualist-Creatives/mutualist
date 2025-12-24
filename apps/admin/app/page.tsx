import Link from "next/link";
import Image from "next/image";
import { portfolioApi } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Briefcase,
  FolderKanban,
  Calendar,
  ArrowRight,
  Plus,
  TrendingUp,
} from "lucide-react";

// Helper function to validate URL
function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export default async function Home() {
  const portfolios = await portfolioApi.getAll();
  const categories = await portfolioApi.getCategories();

  // Calculate stats
  const thisYear = new Date().getFullYear().toString();
  const thisYearCount = portfolios.filter((p) => p.year === thisYear).length;

  return (
    <div className="flex-1 space-y-6 p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back! Here&apos;s your portfolio overview.
          </p>
        </div>
        <Link href="/portfolios/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Portfolio
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Portfolios
            </CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{portfolios.length}</div>
            <p className="text-xs text-muted-foreground">All portfolio items</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground">Unique categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Year</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{thisYearCount}</div>
            <p className="text-xs text-muted-foreground">
              Created in {thisYear}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Latest Update</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {portfolios[0]
                ? new Date(portfolios[0].updatedAt).toLocaleDateString(
                    "en-US",
                    { month: "short", day: "numeric" }
                  )
                : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">Most recent change</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Portfolios */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Portfolios</CardTitle>
              <CardDescription>
                Your latest portfolio items with preview
              </CardDescription>
            </div>
            <Link href="/portfolios">
              <Button variant="outline" size="sm" className="gap-2">
                View All
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {portfolios.slice(0, 6).map((portfolio) => (
              <Link
                key={portfolio.id}
                href={`/portfolios/${portfolio.id}`}
                className="group"
              >
                <Card className="overflow-hidden transition-all hover:shadow-lg">
                  <div className="aspect-video relative bg-muted">
                    {portfolio.images[0] && isValidUrl(portfolio.images[0]) ? (
                      <Image
                        src={portfolio.images[0]}
                        alt={portfolio.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Briefcase className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <CardHeader className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base line-clamp-1 group-hover:text-primary transition-colors">
                        {portfolio.title}
                      </CardTitle>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {portfolio.categories.map((category) => (
                        <Badge
                          key={category}
                          variant="secondary"
                          className="text-xs"
                        >
                          {category}
                        </Badge>
                      ))}
                      <span className="text-xs text-muted-foreground">
                        {portfolio.year}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {portfolio.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Categories Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
          <CardDescription>Portfolio distribution by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const count = portfolios.filter((p) =>
                p.categories.includes(category)
              ).length;
              return (
                <Badge key={category} variant="outline" className="text-sm">
                  {category} ({count})
                </Badge>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
