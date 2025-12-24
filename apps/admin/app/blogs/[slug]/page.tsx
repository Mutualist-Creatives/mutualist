import { BlogForm } from "@/components/blog-form";
import { blogsApi } from "@/lib/api";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function EditBlogPage({ params }: PageProps) {
  let blog;

  try {
    const { slug } = await params;
    blog = await blogsApi.getBySlug(slug);
  } catch {
    notFound();
  }

  return (
    <div className="flex-1 space-y-6 p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Edit Blog Post</h2>
      </div>
      <BlogForm blog={blog} />
    </div>
  );
}
