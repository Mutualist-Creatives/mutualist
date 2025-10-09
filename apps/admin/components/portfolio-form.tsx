"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Portfolio } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, X, AlertCircle, Eye, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PortfolioPreviewCard } from "@/components/portfolio-preview-card";
import { PortfolioPreviewModal } from "@/components/portfolio-preview-modal";

interface PortfolioFormProps {
  portfolio?: Portfolio;
}

export function PortfolioForm({ portfolio }: PortfolioFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const [formData, setFormData] = useState({
    title: portfolio?.title || "",
    createdBy: portfolio?.createdBy || "",
    year: portfolio?.year || new Date().getFullYear().toString(),
    category: portfolio?.category || "",
    description: portfolio?.description || "",
  });

  const [images, setImages] = useState<string[]>(
    portfolio?.images && portfolio.images.length > 0 ? portfolio.images : [""]
  );

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
  };

  const removeImageField = (index: number) => {
    if (images.length > 1) {
      setImages(images.filter((_, i) => i !== index));
    }
  };

  const updateImageField = (index: number, value: string) => {
    const newImages = [...images];
    newImages[index] = value;
    setImages(newImages);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = {
        ...formData,
        images: images.filter((img) => img.trim()),
      };

      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api";
      const url = portfolio
        ? `${apiUrl}/portfolios/${portfolio.id}`
        : `${apiUrl}/portfolios`;

      const res = await fetch(url, {
        method: portfolio ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        cache: "no-store",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Failed to save portfolio (${res.status})`
        );
      }

      toast.success(
        portfolio
          ? "Portfolio updated successfully!"
          : "Portfolio created successfully!"
      );

      router.push("/portfolios");
      router.refresh();
    } catch (err: any) {
      console.error("Form submission error:", err);
      const errorMessage =
        err.message ||
        "Network error. Please check if API server is running on port 3002.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
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
                <Label htmlFor="category">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="category"
                  required
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  placeholder="e.g., Branding, Web Design, Mobile App"
                />
                <p className="text-xs text-muted-foreground">
                  Choose an existing category or create a new one
                </p>
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
                  >
                    <Plus className="h-4 w-4" />
                    Add Image
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Add image URLs. First image will be used as preview.
                </p>
                <div className="space-y-2">
                  {images.map((image, index) => (
                    <div key={index} className="flex gap-2">
                      <div className="flex-1">
                        <Input
                          value={image}
                          onChange={(e) =>
                            updateImageField(index, e.target.value)
                          }
                          placeholder={`Image URL ${index + 1}`}
                          className="font-mono text-sm"
                          required={index === 0}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeImageField(index)}
                        disabled={images.length === 1}
                        className="shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex gap-4 pt-4 border-t">
            <Button type="submit" disabled={loading} className="gap-2">
              <Save className="h-4 w-4" />
              {loading
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
              disabled={loading}
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
          category={formData.category}
          description={formData.description}
          images={previewImages}
          onClose={() => setShowPreviewModal(false)}
        />
      )}
    </>
  );
}
