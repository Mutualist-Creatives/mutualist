"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Save, X, Upload, Loader2, RefreshCw } from "lucide-react";

import { Blog } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RichTextEditor } from "./blog-form/rich-text-editor";
import { blogSchema, BlogFormValues } from "./blog-form/blog-schema";

interface BlogFormProps {
  blog?: Blog;
}

export function BlogForm({ blog }: BlogFormProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(
    blog?.image || null,
  );

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      slug: blog?.slug || "",
      title: blog?.title || "",
      category: blog?.category || "Article",
      date: blog?.date || new Date().toISOString().split("T")[0],
      image: blog?.image || "",
      rotation: blog?.rotation || Math.floor(Math.random() * 11) - 5, // Random -5 to 5
      content: blog?.content || "",
    },
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  // Auto-generate slug from title
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "title") {
        const slug = generateSlug(value.title || "");
        form.setValue("slug", slug, { shouldValidate: true });
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filenameInput, setFilenameInput] = useState("");
  const [uploading, setUploading] = useState(false);

  // File Select Handler
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size limits to 10MB");
      return;
    }

    // Set preview immediately
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);

    // Set state for renaming
    setSelectedFile(file);
    // Default name: original name without extension
    const nameWithoutExt =
      file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
    setFilenameInput(nameWithoutExt);
  };

  // Actual Upload Handler
  const handleUploadConfirm = async () => {
    if (!selectedFile) return;
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("bucket", "main");
      formData.append("folder", "blogs");
      // Append the custom filename
      if (filenameInput) {
        formData.append("filename", filenameInput);
      }

      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api";
      const res = await fetch(`${apiUrl}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to upload image");
      const data = await res.json();
      form.setValue("image", data.publicUrl);
      toast.success("Image uploaded successfully");

      // Clear selection state after success
      setSelectedFile(null);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (values: BlogFormValues) => {
    setLoading(true);
    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api";
      const url = blog
        ? `${apiUrl}/mutualist-blogs/${blog.slug}`
        : `${apiUrl}/mutualist-blogs`;

      // Should ensure rotation is set if missing (though default handles it)
      if (values.rotation === undefined) {
        values.rotation = Math.floor(Math.random() * 11) - 5;
      }

      const res = await fetch(url, {
        method: blog ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(
          errorData?.message || `Failed to save blog (${res.status})`,
        );
      }

      toast.success(blog ? "Blog updated!" : "Blog created!");
      router.push("/mutualist-blogs");
      router.refresh();
    } catch (err) {
      const error = err as Error;
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* Main Content Area */}
          <div className="space-y-6 min-w-0">
            <div className="space-y-4 border p-4 rounded-lg bg-card">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Blog Post Title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Hidden Slug Field */}
              <input type="hidden" {...form.register("slug")} />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Article">Article</SelectItem>
                        <SelectItem value="News">News</SelectItem>
                        <SelectItem value="Tutorial">Tutorial</SelectItem>
                        <SelectItem value="Thoughts">Thoughts</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <RichTextEditor
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Sidebar / Metadata */}
          <div className="space-y-6">
            <div className="space-y-4 border p-4 rounded-lg bg-card">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Image Upload */}
              <div className="space-y-2">
                <FormLabel>Cover Image</FormLabel>
                <div className="border rounded-md p-4 space-y-4">
                  {imagePreview ? (
                    <div className="relative aspect-video rounded-md overflow-hidden border bg-muted group">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="relative">
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            className="opacity-100" // Button itself visible
                            onClick={() => {
                              const input =
                                document.getElementById("image-upload");
                              if (input) input.click();
                            }}
                          >
                            Change
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="aspect-video rounded-md border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-colors"
                      onClick={() => {
                        const input = document.getElementById("image-upload");
                        if (input) input.click();
                      }}
                    >
                      <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                      <span className="text-sm text-muted-foreground">
                        Upload Cover Image
                      </span>
                    </div>
                  )}

                  {/* File Rename & Upload Action */}
                  {selectedFile && (
                    <div className="flex gap-2 items-end animate-in fade-in slide-in-from-top-1">
                      <div className="flex-1 space-y-1">
                        <FormLabel className="text-xs">File Name</FormLabel>
                        <Input
                          value={filenameInput}
                          onChange={(e) => setFilenameInput(e.target.value)}
                          placeholder="filename-without-extension"
                          className="h-8"
                        />
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleUploadConfirm}
                        disabled={uploading}
                      >
                        {uploading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Upload className="h-4 w-4" />
                        )}
                        <span className="ml-2">Upload</span>
                      </Button>
                    </div>
                  )}

                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                  {/* Keep the form field sync with the URL */}
                  <input type="hidden" {...form.register("image")} />
                </div>
              </div>

              {/* Rotation (Hidden/Auto) - but we can show refresh button if desired */}
              <FormField
                control={form.control}
                name="rotation"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Rotation (deg)</FormLabel>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => {
                          const newRotation =
                            Math.floor(Math.random() * 11) - 5;
                          field.onChange(newRotation);
                          toast.success(`Rotation set to ${newRotation}deg`);
                        }}
                        title="Generate new random rotation"
                      >
                        <RefreshCw className="h-3 w-3" />
                      </Button>
                    </div>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        readOnly
                        className="bg-muted"
                      />
                    </FormControl>
                    <FormDescription>Auto-generated (-5 to 5)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-4 border-t">
          <Button type="submit" disabled={loading} className="gap-2">
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {blog ? "Update Blog" : "Create Blog"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
