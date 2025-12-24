"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Blog } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Save, X, AlertCircle, Upload } from "lucide-react";
import { toast } from "sonner";

interface BlogFormProps {
  blog?: Blog;
}

export function BlogForm({ blog }: BlogFormProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    slug: blog?.slug || "",
    title: blog?.title || "",
    category: blog?.category || "Article",
    date: blog?.date || new Date().toISOString().split("T")[0],
    image: blog?.image || "",
    content: blog?.content || "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleFileSelect = (file: File | null) => {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size limits to 5MB");
      return;
    }

    setImageFile(file);
    const previewUrl = URL.createObjectURL(file);
    setFormData({ ...formData, image: previewUrl });
    toast.success("Image selected. Will be uploaded on save.");
  };

  const uploadFile = async (): Promise<string | null> => {
    if (!imageFile) return formData.image;

    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api";
    const uploadData = new FormData();
    uploadData.append("file", imageFile);
    uploadData.append("bucket", "main");
    uploadData.append("folder", "blogs");

    const res = await fetch(`${apiUrl}/upload`, {
      method: "POST",
      body: uploadData,
    });

    if (!res.ok) throw new Error("Failed to upload image");
    const data = await res.json();
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setUploading(true);
    setError("");

    try {
      const imageUrl = await uploadFile();

      const data = {
        ...formData,
        image: imageUrl || "",
      };

      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api";
      const url = blog ? `${apiUrl}/blogs/${blog.slug}` : `${apiUrl}/blogs`;

      const res = await fetch(url, {
        method: blog ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(
          errorData?.message || `Failed to save blog (${res.status})`
        );
      }

      toast.success(blog ? "Blog updated!" : "Blog created!");
      router.push("/blogs");
      router.refresh();
    } catch (err) {
      const error = err as Error;
      console.error(error);
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setFormData({ ...formData, slug });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4 border p-4 rounded-lg bg-card">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              onBlur={() => !formData.slug && generateSlug()}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              required
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              required
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              required
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Cover Image</Label>
          <div className="flex gap-2">
            <Input
              value={formData.image}
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.value })
              }
              placeholder="Image URL"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "image/*";
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) handleFileSelect(file);
                };
                input.click();
              }}
            >
              <Upload className="h-4 w-4" />
            </Button>
          </div>
          {formData.image && (
            <Image
              src={formData.image}
              alt="Preview"
              width={320}
              height={160}
              className="mt-2 h-40 object-cover rounded border"
            />
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            required
            rows={10}
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
          />
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading || uploading} className="gap-2">
          <Save className="h-4 w-4" />
          {loading ? "Saving..." : blog ? "Update Blog" : "Create Blog"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="gap-2"
        >
          <X className="h-4 w-4" />
          Cancel
        </Button>
      </div>
    </form>
  );
}
