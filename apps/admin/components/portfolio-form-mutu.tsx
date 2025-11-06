"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PortfolioMutu } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, X, AlertCircle, Plus, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

interface PortfolioFormMutuProps {
  portfolio?: PortfolioMutu;
}

const SERVICE_OPTIONS = [
  "advertisement",
  "branding",
  "character design",
  "social media",
] as const;

export function PortfolioFormMutu({ portfolio }: PortfolioFormMutuProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: portfolio?.title || "",
    subtitle: portfolio?.subtitle || "",
    year: portfolio?.year || new Date().getFullYear().toString(),
    industry: portfolio?.industry || "",
  });

  const [services, setServices] = useState<
    Record<(typeof SERVICE_OPTIONS)[number], boolean>
  >({
    advertisement: portfolio?.services?.[0]?.advertisement || false,
    branding: portfolio?.services?.[0]?.branding || false,
    "character design": portfolio?.services?.[0]?.["character design"] || false,
    "social media": portfolio?.services?.[0]?.["social media"] || false,
  });

  const [teams, setTeams] = useState<Array<{ role: string; name: string }>>(
    portfolio?.teams && portfolio.teams.length > 0
      ? portfolio.teams
      : [{ role: "", name: "" }]
  );

  const [images, setImages] = useState<string[]>(
    portfolio?.images && portfolio.images.length > 0 ? portfolio.images : [""]
  );
  const [imageFiles, setImageFiles] = useState<(File | null)[]>(
    portfolio?.images && portfolio.images.length > 0
      ? Array(portfolio.images.length).fill(null)
      : [null]
  );
  const [uploading, setUploading] = useState(false);

  const addTeamField = () => {
    setTeams([...teams, { role: "", name: "" }]);
  };

  const removeTeamField = (index: number) => {
    if (teams.length > 1) {
      setTeams(teams.filter((_, i) => i !== index));
    }
  };

  const updateTeamField = (
    index: number,
    field: "role" | "name",
    value: string
  ) => {
    const newTeams = [...teams];
    newTeams[index][field] = value;
    setTeams(newTeams);
  };

  const addImageField = () => {
    if (images.length < 12) {
      setImages([...images, ""]);
      setImageFiles([...imageFiles, null]);
    } else {
      toast.error("Maximum 12 images allowed");
    }
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

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only image files are allowed (JPEG, PNG, GIF, WebP)");
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      toast.error(
        `File "${file.name}" is ${sizeMB}MB. Each image must not exceed 5MB.`
      );
      return;
    }

    const newFiles = [...imageFiles];
    newFiles[index] = file;
    setImageFiles(newFiles);

    const previewUrl = URL.createObjectURL(file);
    const newImages = [...images];
    newImages[index] = previewUrl;
    setImages(newImages);

    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    toast.success(
      `File "${file.name}" (${sizeMB}MB) selected. Will be uploaded on save.`
    );
  };

  const uploadFiles = async (): Promise<string[]> => {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api";
    const uploadedUrls: string[] = [];

    for (let i = 0; i < images.length; i++) {
      const file = imageFiles[i];
      const imageUrl = images[i];

      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("bucket", "portfolio-images");
        formData.append("folder", "mutu");

        const res = await fetch(`${apiUrl}/upload`, {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          throw new Error(`Failed to upload ${file.name}`);
        }

        const data = await res.json();
        uploadedUrls.push(data.publicUrl);
      } else if (imageUrl && imageUrl.trim()) {
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
      // Validate teams
      const validTeams = teams.filter((t) => t.role.trim() && t.name.trim());
      if (validTeams.length === 0) {
        throw new Error("At least one team member is required");
      }

      // Validate services
      const hasService = Object.values(services).some((v) => v);
      if (!hasService) {
        throw new Error("At least one service must be selected");
      }

      toast.info("Uploading images...");
      const uploadedImageUrls = await uploadFiles();

      if (uploadedImageUrls.length === 0) {
        throw new Error("At least one image is required");
      }

      if (uploadedImageUrls.length > 12) {
        throw new Error("Maximum 12 images allowed");
      }

      const data = {
        ...formData,
        services: [services],
        teams: validTeams,
        images: uploadedImageUrls,
      };

      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api";
      const url = portfolio
        ? `${apiUrl}/portfolios-mutu/${portfolio.id}`
        : `${apiUrl}/portfolios-mutu`;

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
          ? "Portfolio Mutu updated successfully!"
          : "Portfolio Mutu created successfully!"
      );

      router.push("/portfolios-mutu");
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="services">Services & Team</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
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

          <div className="space-y-2">
            <Label htmlFor="subtitle">
              Subtitle <span className="text-red-500">*</span>
            </Label>
            <Input
              id="subtitle"
              required
              value={formData.subtitle}
              onChange={(e) =>
                setFormData({ ...formData, subtitle: e.target.value })
              }
              placeholder="Enter portfolio subtitle"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
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

            <div className="space-y-2">
              <Label htmlFor="industry">
                Industry <span className="text-red-500">*</span>
              </Label>
              <Input
                id="industry"
                required
                value={formData.industry}
                onChange={(e) =>
                  setFormData({ ...formData, industry: e.target.value })
                }
                placeholder="e.g., Technology, Fashion"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="services" className="space-y-6 mt-4">
          <div className="space-y-3">
            <Label>
              Services <span className="text-red-500">*</span>
            </Label>
            <div className="grid grid-cols-2 gap-3">
              {SERVICE_OPTIONS.map((service) => (
                <div
                  key={service}
                  className={`border rounded-lg p-3 cursor-pointer transition-all ${
                    services[service]
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => {
                    setServices({
                      ...services,
                      [service]: !services[service],
                    });
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`service-${service}`}
                      checked={services[service]}
                      onChange={(e) => {
                        setServices({
                          ...services,
                          [service]: e.target.checked,
                        });
                      }}
                      className="w-4 h-4 rounded border-gray-300"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <label
                      htmlFor={`service-${service}`}
                      className="text-sm font-medium leading-none cursor-pointer capitalize"
                    >
                      {service}
                    </label>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Select at least one service (
              {Object.values(services).filter((v) => v).length} selected)
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>
                Team Members <span className="text-red-500">*</span>
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addTeamField}
                className="gap-2"
                disabled={loading || uploading}
              >
                <Plus className="h-4 w-4" />
                Add Member
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Add team members who worked on this project ({teams.length}{" "}
              member(s))
            </p>
            <div className="space-y-3">
              {teams.map((team, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-3 bg-muted/30 space-y-2"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-muted-foreground">
                      Member #{index + 1}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTeamField(index)}
                      disabled={teams.length === 1 || loading || uploading}
                      className="h-6 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Remove
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor={`role-${index}`} className="text-xs mb-1">
                        Role
                      </Label>
                      <Input
                        id={`role-${index}`}
                        value={team.role}
                        onChange={(e) =>
                          updateTeamField(index, "role", e.target.value)
                        }
                        placeholder="e.g., Designer, Developer"
                        required
                        disabled={loading || uploading}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`name-${index}`} className="text-xs mb-1">
                        Name
                      </Label>
                      <Input
                        id={`name-${index}`}
                        value={team.name}
                        onChange={(e) =>
                          updateTeamField(index, "name", e.target.value)
                        }
                        placeholder="Full name"
                        required
                        disabled={loading || uploading}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="media" className="space-y-4 mt-4">
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
                disabled={loading || uploading || images.length >= 12}
              >
                <Plus className="h-4 w-4" />
                Add Image
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Upload images (max 5MB each, min 1, max 12). Images will be stored
              in /mutu folder.
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
                        input.accept = "image/*";
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
            <p className="text-xs text-muted-foreground">
              {images.filter((img) => img.trim()).length} / 12 images
            </p>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex gap-4 pt-4 border-t">
        <Button type="submit" disabled={loading || uploading} className="gap-2">
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
  );
}
