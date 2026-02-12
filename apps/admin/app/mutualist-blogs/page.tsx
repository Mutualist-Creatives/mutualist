import Link from "next/link";
import { blogsApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { BlogSearch } from "@/components/blog-search";

export default async function BlogsPage() {
  const blogs = await blogsApi.getAll();

  return (
    <div className="flex-1 space-y-6 p-6 lg:p-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Mutualist Blogs</h2>
          <p className="text-muted-foreground">Manage your blog posts</p>
        </div>
        <Link href="/mutualist-blogs/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Blog Post
          </Button>
        </Link>
      </div>

      {/* Search & Filter */}
      <BlogSearch blogs={blogs} />
    </div>
  );
}
