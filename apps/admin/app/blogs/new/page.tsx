import { BlogForm } from "@/components/blog-form";

export default function NewBlogPage() {
  return (
    <div className="flex-1 space-y-6 p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">New Blog Post</h2>
      </div>
      <BlogForm />
    </div>
  );
}
