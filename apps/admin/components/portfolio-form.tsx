"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Portfolio } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, X, AlertCircle, Eye, Plus, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { PortfolioPreviewCard } from "@/components/portfolio-preview-card";
import { PortfolioPreviewModal } from "@/components/portfolio-preview-modal";
import { PORTFOLIO_CATEGORIES } from "@/lib/constants";

interface PortfolioFormProps {
  portfolio?: Portfolio;
}

export function PortfolioForm({ portfolio }: PortfolioFormProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const [formData, setFormData] = useState({
    title: portfolio?.title || "",
    createdBy: portfolio?.createdBy || "",
    year: portfolio?.year || new Date().getFullYear().toString(),
    categories: portfolio?.categories || [],
    description: portfolio?.description || "",
  });

  const [images, setImages] = useState<string[]>(
    portfolio?.images && portfolio.images.length > 0 ? portfolio.images : [""],
  );
  const [imageFiles, setImageFiles] = useState<(File | null)[]>(
    portfolio?.images && portfolio.images.length > 0
      ? Array(portfolio.images.length).fill(null)
      : [null],
  );
  const [uploading, setUploading] = useState(false);

  // Helper function to validate URL
  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Parse images for preview
  const previewImages = images.filter((img) => img.trim());
  const hasValidPreview =
    formData.title.trim() !== "" &&
    previewImages.length > 0 &&
    isValidUrl(previewImages[0]);

  // Image handlers
  const addImageField = () => {
    setImages([...images, ""]);
    setImageFiles([...imageFiles, null]);
  };

  const removeImageField = (index: number) => {
    if (images.length > 1) {
      setImages(images.filter((_, i) => i !== index));
      setImageFiles(imageFiles.filter((_, i) => i !== index));
    }
  };

  const updateImageField = (index: number, value: string) => {
    const newImages = [...images];
    newImages[index] = value || "";
    setImages(newImages);
  };

  const handleFileSelect = (index: number, file: File | null) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "video/mp4",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only image files are allowed (JPEG, PNG, GIF, WebP, MP4)");
      return;
    }

    // Validate file size (max 10MB per image)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      toast.error(
        `File "${file.name}" is ${sizeMB}MB. Each image must not exceed 10MB.`,
      );
      return;
    }

    // Store file in state (not uploaded yet)
    const newFiles = [...imageFiles];
    newFiles[index] = file;
    setImageFiles(newFiles);

    // Create temporary preview URL
    const previewUrl = URL.createObjectURL(file);
    const newImages = [...images];
    newImages[index] = previewUrl;
    setImages(newImages);

    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    toast.success(
      `File "${file.name}" (${sizeMB}MB) selected. Will be uploaded on save.`,
    );
  };

  const uploadFiles = async (): Promise<string[]> => {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api";
    const uploadedUrls: string[] = [];

    for (let i = 0; i < images.length; i++) {
      const file = imageFiles[i];
      const imageUrl = images[i];

      // If it's a file, upload it
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("bucket", "life");
        formData.append("folder", "projects");

        const res = await fetch(`${apiUrl}/upload`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
          body: formData,
        });

        if (!res.ok) {
          throw new Error(`Failed to upload ${file.name}`);
        }

        const data = await res.json();
        uploadedUrls.push(data.publicUrl);
      } else if (imageUrl && imageUrl.trim()) {
        // If it's already a URL (not a blob), keep it
        if (!imageUrl.startsWith("blob:")) {
          uploadedUrls.push(imageUrl);
        }
      }
    }

    return uploadedUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setUploading(true);
    setError("");

    try {
      // Validate categories
      if (formData.categories.length === 0) {
        throw new Error("At least one category is required");
      }

      // Step 1: Upload all files first
      toast.info("Uploading images...");
      const uploadedImageUrls = await uploadFiles();

      if (uploadedImageUrls.length === 0) {
        throw new Error("At least one image is required");
      }

      // Step 2: Save portfolio with uploaded URLs
      const data = {
        ...formData,
        images: uploadedImageUrls,
      };

      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api";
      const url = portfolio
        ? `${apiUrl}/life-projects/${portfolio.id}`
        : `${apiUrl}/life-projects`;

      const res = await fetch(url, {
        method: portfolio ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify(data),
        cache: "no-store",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Failed to save portfolio (${res.status})`,
        );
      }

      toast.success(
        portfolio
          ? "Portfolio updated successfully!"
          : "Portfolio created successfully!",
      );

      router.push("/life-projects");
      router.refresh();
    } catch (err) {
      const error = err as Error;
      console.error("Form submission error:", error);
      const errorMessage =
        error.message ||
        "Network error. Please check if API server is running on port 3002.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        {/* Left Column - Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="content">Content & Media</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Enter portfolio title"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="createdBy">
                    Created By <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="createdBy"
                    required
                    value={formData.createdBy}
                    onChange={(e) =>
                      setFormData({ ...formData, createdBy: e.target.value })
                    }
                    placeholder="Creator name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year">
                    Year <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="year"
                    required
                    value={formData.year}
                    onChange={(e) =>
                      setFormData({ ...formData, year: e.target.value })
                    }
                    placeholder="2024"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>
                  Categories <span className="text-red-500">*</span>
                </Label>
                <div className="border rounded-md p-4 space-y-2">
                  {PORTFOLIO_CATEGORIES.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`category-${category}`}
                        checked={formData.categories.includes(category)}
                        onChange={(e) => {
                          const newCategories = e.target.checked
                            ? [...formData.categories, category]
                            : formData.categories.filter((c) => c !== category);
                          setFormData({
                            ...formData,
                            categories: newCategories,
                          });
                        }}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <label
                        htmlFor={`category-${category}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Select one or more categories ({formData.categories.length}{" "}
                  selected)
                </p>
                {formData.categories.length === 0 && (
                  <p className="text-xs text-red-500">
                    At least one category is required
                  </p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="content" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="description">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  required
                  rows={6}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Enter portfolio description"
                />
                <p className="text-xs text-muted-foreground">
                  Provide a detailed description of the portfolio project
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>
                    Images <span className="text-red-500">*</span>
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addImageField}
                    className="gap-2"
                    disabled={loading || uploading}
                  >
                    <Plus className="h-4 w-4" />
                    Add Image
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Upload images (max 5MB each) or paste URLs. First image will
                  be used as preview.
                </p>
                <div className="space-y-3">
                  {images.map((image, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <Input
                            value={image}
                            onChange={(e) =>
                              updateImageField(index, e.target.value)
                            }
                            placeholder={`Image URL ${index + 1} or upload file`}
                            className="font-mono text-sm"
                            required={index === 0 && !image}
                            disabled={loading || uploading}
                          />
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            const input = document.createElement("input");
                            input.type = "file";
                            input.accept = "image/*,video/mp4";
                            input.onchange = (e) => {
                              const file = (e.target as HTMLInputElement)
                                .files?.[0];
                              if (file) handleFileSelect(index, file);
                            };
                            input.click();
                          }}
                          disabled={loading || uploading}
                          className="shrink-0"
                          title="Select file to upload"
                        >
                          <Upload className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeImageField(index)}
                          disabled={images.length === 1 || loading || uploading}
                          className="shrink-0"
                          title="Remove image"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      {imageFiles[index] && (
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Upload className="h-3 w-3" />
                            <span>{imageFiles[index]?.name}</span>
                          </div>
                          <span className="text-xs">
                            {(imageFiles[index]!.size / 1024).toFixed(1)} KB
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex gap-4 pt-4 border-t">
            <Button
              type="submit"
              disabled={loading || uploading}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              {uploading
                ? "Uploading..."
                : loading
                  ? "Saving..."
                  : portfolio
                    ? "Update Portfolio"
                    : "Create Portfolio"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="gap-2"
              disabled={loading || uploading}
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
          </div>
        </form>

        {/* Right Column - Sticky Preview */}
        <div className="hidden lg:block">
          <div className="sticky top-6 space-y-4">
            <div className="border rounded-lg p-6 bg-muted/30">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">Live Preview</h3>
                  <p className="text-sm text-muted-foreground">
                    {hasValidPreview
                      ? "Click to see full preview"
                      : "Add title and image URL"}
                  </p>
                </div>
                <div className="flex justify-center">
                  <PortfolioPreviewCard
                    title={formData.title}
                    images={previewImages}
                    onClick={() => {
                      if (hasValidPreview) {
                        setShowPreviewModal(true);
                      }
                    }}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full gap-2"
                  onClick={() => setShowPreviewModal(true)}
                  disabled={!hasValidPreview}
                >
                  <Eye className="h-4 w-4" />
                  Full Preview
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreviewModal && (
        <PortfolioPreviewModal
          title={formData.title}
          createdBy={formData.createdBy}
          year={formData.year}
          category={formData.categories.join(", ")}
          description={formData.description}
          images={previewImages}
          onClose={() => setShowPreviewModal(false)}
        />
      )}
    </>
  );
}
