import Link from "next/link";
import Image from "next/image";
import { portfolioApi, blogsApi, worksApi } from "@/lib/api";
import { auth } from "@/lib/auth";
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
  Layers,
  Calendar,
  ArrowRight,
  Plus,
  FileText,
  Clock,
  LayoutGrid,
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
  const session = await auth();
  const userName = session?.user?.name || "Admin"; // Fallback name

  // Parallel data fetching
  const [portfolios, works, categories, blogs] = await Promise.all([
    portfolioApi.getAll(),
    worksApi.getAll(),
    portfolioApi.getCategories(),
    blogsApi.getAll(),
  ]);

  // Calculate stats
  const recentPortfoliosCount = portfolios.filter(
    (p) => new Date(p.createdAt).getFullYear() === new Date().getFullYear()
  ).length;
  const recentWorksCount = works.filter(
    (w) => new Date(w.createdAt).getFullYear() === new Date().getFullYear()
  ).length;

  // Unified Activity Stream
  const activityLimit = 9;
  const combinedActivity = [
    ...works.map((w) => ({
      type: "Main",
      id: w.slug,
      slug: w.slug,
      title: w.title,
      date: w.updatedAt || w.createdAt,
      image: w.content[0]?.images[0], // Access first image of first block
      meta: w.year,
      desc: `${w.industry} — ${w.serviceNames}`,
      link: `/main-portfolios/${w.slug}`,
    })),
    ...portfolios.map((p) => ({
      type: "Life",
      id: p.id,
      slug: p.id,
      title: p.title,
      date: p.createdAt,
      image: p.images[0],
      meta: p.year,
      desc: p.description,
      link: `/life-portfolios/${p.id}`,
    })),
    ...blogs.map((b) => ({
      type: "Blog",
      id: b.id,
      slug: b.slug,
      title: b.title,
      date: b.date,
      image: b.image,
      meta: b.category,
      desc: b.content.replace(/<[^>]*>?/gm, "").substring(0, 100) + "...",
      link: `/blogs/${b.slug}`, // Assuming slug routing for editing
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, activityLimit);

  // Time-based greeting
  const hour = new Date().getHours();
  let greeting = "Good Evening";
  if (hour < 12) greeting = "Good Morning";
  else if (hour < 18) greeting = "Good Afternoon";

  return (
    <div className="flex-1 space-y-8 p-6 lg:p-10 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-bold tracking-tight text-primary">
            {greeting}, {userName.split(" ")[0]}
          </h2>
          <p className="text-muted-foreground mt-2 text-lg">
            Here&apos;s what&apos;s happening in your digital space today.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Link href="/blogs/new">
            <Button variant="outline" className="gap-2 cursor-pointer">
              <FileText className="h-4 w-4" />
              Write Blog
            </Button>
          </Link>
          <Link href="/life-portfolios/new">
            <Button variant="outline" className="gap-2 cursor-pointer">
              <Plus className="h-4 w-4" />
              Add Life
            </Button>
          </Link>
          <Link href="/main-portfolios/new">
            <Button className="gap-2 cursor-pointer">
              <Plus className="h-4 w-4" />
              Add Main
            </Button>
          </Link>
        </div>
      </div>

      {/* Modern Stats Strip */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Main Projects
            </CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{works.length}</div>
            <p className="text-sm text-muted-foreground mt-1">
              +{recentWorksCount} this year
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Life Portfolios
            </CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{portfolios.length}</div>
            <p className="text-sm text-muted-foreground mt-1">
              +{recentPortfoliosCount} this year
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Published Blogs
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{blogs.length}</div>
            <p className="text-sm text-muted-foreground mt-1">
              across {new Set(blogs.map((b) => b.category)).size} categories
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Unique Categories
            </CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{categories.length}</div>
            <p className="text-sm text-muted-foreground mt-1">
              Defined in portfolios
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Unified Activity Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LayoutGrid className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-semibold">Start Editing</h3>
          </div>
          <p className="text-sm text-muted-foreground hidden md:block">
            Most recently updated content
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {combinedActivity.map((item) => (
            <Link
              key={`${item.type}-${item.id}`}
              href={item.link}
              className="group"
            >
              <Card className="overflow-hidden h-full border transition-all duration-300 hover:shadow-lg group-hover:-translate-y-1">
                <div className="aspect-video relative bg-muted overflow-hidden">
                  {item.image && isValidUrl(item.image) ? (
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-muted/50">
                      {item.type === "Main" || item.type === "Life" ? (
                        <Briefcase className="h-10 w-10 text-muted-foreground/50" />
                      ) : (
                        <FileText className="h-10 w-10 text-muted-foreground/50" />
                      )}
                    </div>
                  )}
                  {/* Floating Badge */}
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-black text-white hover:bg-black/90 rounded-sm shadow-none">
                      {item.type}
                    </Badge>
                  </div>
                </div>

                <CardHeader className="space-y-1 pb-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {new Date(item.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <span>{item.meta}</span>
                  </div>
                  <CardTitle className="text-lg line-clamp-1 group-hover:text-primary transition-colors">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {item.desc}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
