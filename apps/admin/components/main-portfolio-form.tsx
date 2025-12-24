"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Work, worksApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, AlertCircle, Plus, Trash2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";

interface MainPortfolioFormProps {
  work?: Work;
}

const SERVICE_ICONS = ["A", "B", "C", "S"];
const BLOCK_TYPES = ["full-width", "two-column", "three-column"];

const LAYOUT_COUNTS: Record<string, number> = {
  "full-width": 1,
  "two-column": 2,
  "three-column": 3,
};

export function MainPortfolioForm({
  work: initialWork,
}: MainPortfolioFormProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [work] = useState<Work | undefined>(initialWork); // Use any for form compatibility or define strict type
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    slug: work?.slug || "",
    title: work?.title || "",
    industry: work?.industry || "",
    year: work?.year || new Date().getFullYear().toString(),
    serviceNames: work?.serviceNames || "",
    serviceIcons: (work?.serviceIcons as string[]) || [],
    teams: work?.teams || [{ role: "Creative Director", names: [""] }],
    content: work?.content || [{ type: "full-width", images: [""] }],
  });

  const [contentFiles, setContentFiles] = useState<{
    [blockIndex: number]: { [imgIndex: number]: File };
  }>({});

  const generateSlug = (title: string) => {
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, ""); // Remove leading/trailing hyphens
    return slug;
  };

  // --- Handlers: Service Icons ---
  const toggleServiceIcon = (icon: string) => {
    const current = formData.serviceIcons;
    const newIcons = current.includes(icon)
      ? current.filter((i) => i !== icon)
      : [...current, icon];
    setFormData({ ...formData, serviceIcons: newIcons });
  };

  // --- Handlers: Teams ---
  const addTeamMember = () => {
    setFormData({
      ...formData,
      teams: [...formData.teams, { role: "", names: [""] }],
    });
  };

  const removeTeamMember = (index: number) => {
    setFormData({
      ...formData,
      teams: formData.teams.filter((_, i) => i !== index),
    });
  };

  const updateTeamRole = (index: number, role: string) => {
    const newTeams = [...formData.teams];
    newTeams[index].role = role;
    setFormData({ ...formData, teams: newTeams });
  };

  const updateTeamMemberName = (
    teamIndex: number,
    nameIndex: number,
    val: string
  ) => {
    const newTeams = [...formData.teams];
    newTeams[teamIndex].names[nameIndex] = val;
    setFormData({ ...formData, teams: newTeams });
  };

  const addTeamMemberName = (teamIndex: number) => {
    const newTeams = [...formData.teams];
    newTeams[teamIndex].names.push("");
    setFormData({ ...formData, teams: newTeams });
  };

  const removeTeamMemberName = (teamIndex: number, nameIndex: number) => {
    const newTeams = [...formData.teams];
    if (newTeams[teamIndex].names.length <= 1) {
      newTeams[teamIndex].names[0] = "";
    } else {
      newTeams[teamIndex].names = newTeams[teamIndex].names.filter(
        (_: string, i: number) => i !== nameIndex
      );
    }
    setFormData({ ...formData, teams: newTeams });
  };

  // --- Handlers: Content Blocks ---
  const addContentBlock = () => {
    setFormData({
      ...formData,
      content: [
        ...formData.content,
        {
          type: "full-width",
          images: Array(LAYOUT_COUNTS["full-width"]).fill(""),
        },
      ],
    });
  };

  const removeContentBlock = (index: number) => {
    setFormData({
      ...formData,
      content: formData.content.filter((_, i) => i !== index),
    });
    // Cleanup files for this block (optional but good)
    const newFiles = { ...contentFiles };
    delete newFiles[index];
    // Shift indices if needed? Too complex.
    // For simplicity, we won't shift file indices in this MVP,
    // which effectively clears files if midway block deleted unless mapped by ID.
    // Given the complexity, simple index mapping is risky on delete.
    // But for MVP, we'll reset files map or accept the risk.
    // Better: Allow save first.
    // For this implementation, I'll clear ALL pending uploads on block delete to stay safe.
    setContentFiles({});
    toast.info("Pending file uploads cleared due to structure change.");
  };

  const updateBlockType = (index: number, type: string) => {
    const newContent = [...formData.content];
    newContent[index].type = type;

    // Resize images array based on type
    const requiredCount = LAYOUT_COUNTS[type] || 1;
    const currentImages = newContent[index].images;

    if (currentImages.length < requiredCount) {
      // Add empty slots
      while (currentImages.length < requiredCount) {
        currentImages.push("");
      }
    } else if (currentImages.length > requiredCount) {
      // Trim
      currentImages.length = requiredCount;
    }

    newContent[index].images = currentImages;
    setFormData({ ...formData, content: newContent });

    // Note: We might have orphaned files in contentFiles if we trimmed images.
    // That's acceptable for now; they simply won't be uploaded.
  };

  // Removed addBlockImage/removeBlockImage since count is fixed

  const updateBlockImage = (
    blockIndex: number,
    imgIndex: number,
    val: string
  ) => {
    const newContent = [...formData.content];
    newContent[blockIndex].images[imgIndex] = val;
    setFormData({ ...formData, content: newContent });
  };

  const handleFileSelect = (
    blockIndex: number,
    imgIndex: number,
    file: File | null
  ) => {
    if (!file) return;

    // Preview
    const url = URL.createObjectURL(file);
    updateBlockImage(blockIndex, imgIndex, url);

    // Store for upload
    setContentFiles((prev) => ({
      ...prev,
      [blockIndex]: {
        ...(prev[blockIndex] || {}),
        [imgIndex]: file,
      },
    }));
  };

  // --- Upload Logic ---
  const uploadAllFiles = async (): Promise<
    { type: string; images: string[] }[]
  > => {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api";

    // Deep clone content to update with final URLs
    const finalContent = JSON.parse(JSON.stringify(formData.content));

    for (const blockIndexStr in contentFiles) {
      const blockIndex = parseInt(blockIndexStr);
      const blockFiles = contentFiles[blockIndex];

      // Only upload files that are still within the valid range of images for this block
      // (in case block type changed and we trimmed images)
      const validImageCount = finalContent[blockIndex]?.images?.length || 0;

      for (const imgIndexStr in blockFiles) {
        const imgIndex = parseInt(imgIndexStr);
        if (imgIndex >= validImageCount) continue; // Skip orphaned files

        const file = blockFiles[imgIndex];

        if (file) {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("bucket", "main");
          formData.append("folder", "portfolio");

          const res = await fetch(`${apiUrl}/upload`, {
            method: "POST",
            body: formData,
          });

          if (!res.ok) throw new Error(`Failed to upload ${file.name}`);

          const data = await res.json();
          // Update the content array with the public URL
          finalContent[blockIndex].images[imgIndex] = data.publicUrl;
        }
      }
    }
    return finalContent;
  };

  // --- Submit ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setUploading(true);
    setError("");

    try {
      const token = session?.accessToken;
      if (!token) throw new Error("You must be logged in to save.");

      // Upload files
      toast.info("Uploading images...");
      const finalContent = await uploadAllFiles();

      const data = {
        ...formData,
        content: finalContent,
      };

      if (work) {
        await worksApi.update(work.slug, data, token);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await worksApi.create(data as any, token);
      }

      toast.success(work ? "Project updated!" : "Project created!");
      router.push("/main-portfolios");
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="teams">Teams</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
          </TabsList>

          {/* BASIC INFO */}
          <TabsContent value="basic" className="space-y-4 mt-4">
            <div className="space-y-4 border p-4 rounded-lg bg-card">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    required
                    value={formData.title}
                    onChange={(e) => {
                      const newTitle = e.target.value;
                      // Update title
                      const newData = { ...formData, title: newTitle };

                      // Auto-update slug if creating new project (no work prop)
                      // Or if user hasn't manually set a divergent slug?
                      // User requested "slug otomatis", implying syncing is desired.
                      // We'll update it always for now, or maybe only if it was matching?
                      // Safest for user experience: Update it if existing slug matches generated version of OLD title, or if it's empty.
                      // Simple approach: strict sync.
                      if (!work) {
                        newData.slug = generateSlug(newTitle);
                      }
                      setFormData(newData);
                    }}
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
                  <Label htmlFor="industry">Industry</Label>
                  <Input
                    id="industry"
                    required
                    value={formData.industry}
                    onChange={(e) =>
                      setFormData({ ...formData, industry: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    required
                    value={formData.year}
                    onChange={(e) =>
                      setFormData({ ...formData, year: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="serviceNames">Services Description</Label>
                <Textarea
                  id="serviceNames"
                  required
                  placeholder="e.g. Advertising and Branding"
                  value={formData.serviceNames}
                  onChange={(e) =>
                    setFormData({ ...formData, serviceNames: e.target.value })
                  }
                />
              </div>
            </div>
          </TabsContent>

          {/* SERVICES */}
          <TabsContent value="services" className="space-y-4 mt-4">
            <div className="border p-4 rounded-lg bg-card space-y-4">
              <Label>Active Service Icons</Label>
              <div className="flex gap-4">
                {SERVICE_ICONS.map((icon) => (
                  <div key={icon} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`icon-${icon}`}
                      className="w-4 h-4"
                      checked={formData.serviceIcons.includes(icon)}
                      onChange={() => toggleServiceIcon(icon)}
                    />
                    <Label htmlFor={`icon-${icon}`}>{icon}</Label>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* TEAMS */}
          <TabsContent value="teams" className="space-y-4 mt-4">
            <div className="space-y-4">
              {formData.teams.map((team, index) => (
                <div
                  key={index}
                  className="border p-4 rounded-lg bg-card relative"
                >
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    onClick={() => removeTeamMember(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label>Role</Label>
                      <Input
                        value={team.role}
                        onChange={(e) => updateTeamRole(index, e.target.value)}
                        placeholder="e.g. Creative Director"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Members</Label>
                      <div className="space-y-2">
                        {team.names.map((name: string, nameIndex: number) => (
                          <div key={nameIndex} className="flex gap-2">
                            {/* Using simple key based on index is risky if reordering, strictly append only here */}
                            <Input
                              value={name}
                              onChange={(e) =>
                                updateTeamMemberName(
                                  index,
                                  nameIndex,
                                  e.target.value
                                )
                              }
                              placeholder="Name"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                removeTeamMemberName(index, nameIndex)
                              }
                            >
                              <X className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addTeamMemberName(index)}
                        className="mt-2"
                      >
                        <Plus className="h-4 w-4 mr-2" /> Add Name
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addTeamMember}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" /> Add Team Role
              </Button>
            </div>
          </TabsContent>

          {/* CONTENT BLOCKS */}
          <TabsContent value="content" className="space-y-4 mt-4">
            <div className="space-y-6">
              {formData.content.map((block, blockIndex) => (
                <div
                  key={blockIndex}
                  className="border p-4 rounded-lg bg-card relative space-y-4"
                >
                  <div className="flex justify-between items-center bg-muted/50 p-2 rounded">
                    <span className="font-semibold text-sm">
                      Block {blockIndex + 1}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700 h-6"
                      onClick={() => removeContentBlock(blockIndex)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" /> Remove Block
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label>Layout Type</Label>
                    <Select
                      value={block.type}
                      onValueChange={(val) => updateBlockType(blockIndex, val)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {BLOCK_TYPES.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>
                      Images ({block.images.length} required for {block.type})
                    </Label>
                    <div className="space-y-2">
                      {block.images.map((img: string, imgIndex: number) => (
                        <div key={imgIndex} className="flex gap-2">
                          <Input
                            placeholder={`Image URL ${imgIndex + 1}`}
                            value={img}
                            onChange={(e) =>
                              updateBlockImage(
                                blockIndex,
                                imgIndex,
                                e.target.value
                              )
                            }
                            className="flex-1"
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
                                const file = (e.target as HTMLInputElement)
                                  .files?.[0];
                                if (file)
                                  handleFileSelect(blockIndex, imgIndex, file);
                              };
                              input.click();
                            }}
                          >
                            <Upload className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addContentBlock}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" /> Add Content Block
              </Button>
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
            {uploading ? "Uploading..." : "Save Project"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={loading || uploading}
          >
            Cancel
          </Button>
        </div>
      </form>

      {/* Right Column - Info/Preview Placeholder */}
      <div className="hidden lg:block space-y-4">
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">Project Guide</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Use the tabs to fill out all project details.
            </p>
            <ul className="text-sm list-disc pl-4 space-y-1 text-muted-foreground">
              <li>
                <strong>Basic</strong>: Essential info & metadata.
              </li>
              <li>
                <strong>Services</strong>: Toggle displayed icons.
              </li>
              <li>
                <strong>Teams</strong>: Credits for the project.
              </li>
              <li>
                <strong>Content</strong>: Visual layout blocks.
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
