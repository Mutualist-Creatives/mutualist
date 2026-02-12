"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Save, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";

import { worksApi, Work } from "@/lib/api"; // Check import path
import { portfolioSchema, PortfolioFormValues } from "./portfolio-schema";
import { BasicInfoForm } from "./basic-info-form";
import { ServicesForm } from "./services-form";
import { TeamsForm } from "./teams-form";
import { ContentForm } from "./content-form";

interface PortfolioFormProps {
  initialData?: Work;
}

export function PortfolioForm({ initialData }: PortfolioFormProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  // Local state for files: Map<blockId, Map<imgIndex, File>>
  // Using block ID (from useFieldArray) instead of numeric index for drag-and-drop stability
  const [contentFiles, setContentFiles] = useState<
    Record<string, Record<number, File>>
  >({});

  // Track block field IDs in their current order (synced from ContentForm)
  const [blockFieldIds, setBlockFieldIds] = useState<string[]>([]);

  const form = useForm<PortfolioFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(portfolioSchema) as any,
    defaultValues: {
      slug: initialData?.slug || "",
      title: initialData?.title || "",
      industry: initialData?.industry || "",
      year: initialData?.year || new Date().getFullYear().toString(),
      serviceNames: initialData?.serviceNames || "",
      serviceIcons: (initialData?.serviceIcons as string[]) || [],
      teams: initialData?.teams || [{ role: "Creative Director", names: [""] }],
      // Map existing content or default
      content: initialData?.content?.map((c) => ({
        type: c.type as "full-width" | "two-column" | "three-column",
        images: c.images,
      })) || [{ type: "full-width", images: [""] }],
      isFeatured: initialData?.isFeatured || false,
    },
  });

  const uploadAllFiles = async (
    currentContent: PortfolioFormValues["content"],
    projectTitle: string,
    blockIdToIndex: Map<string, number>,
  ): Promise<PortfolioFormValues["content"]> => {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

    // Deep clone to avoid mutating state directly
    const finalContent = JSON.parse(JSON.stringify(currentContent));

    const uploadPromises: Promise<void>[] = [];

    // Sanitize title for filename
    const sanitizedTitle = projectTitle
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Iterate over files state (keyed by block ID)
    for (const [blockId, blockFiles] of Object.entries(contentFiles)) {
      // Get the current index from the mapping
      const blockIndex = blockIdToIndex.get(blockId);
      if (blockIndex === undefined) {
        console.warn(
          `Block ID ${blockId} not found in current form state, skipping`,
        );
        continue;
      }

      for (const [imgIdxStr, file] of Object.entries(blockFiles)) {
        const imgIndex = parseInt(imgIdxStr);

        // Ensure this slot still exists in the content structure
        if (
          !finalContent[blockIndex]?.images ||
          finalContent[blockIndex].images[imgIndex] === undefined
        ) {
          continue;
        }

        // Push to array to run in parallel
        const p = (async () => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("bucket", "main");
          formData.append("folder", "portfolio");

          // Custom filename: title-blockX-imgY
          const customName = `${sanitizedTitle}-block${blockIndex}-img${imgIndex}`;
          formData.append("filename", customName);

          const res = await fetch(`${apiUrl}/upload`, {
            method: "POST",
            body: formData,
          });

          if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Failed to upload ${file.name}: ${errorText}`);
          }

          const data = await res.json();
          // Replace the temporary preview URL with the real public URL
          if (finalContent[blockIndex] && finalContent[blockIndex].images) {
            finalContent[blockIndex].images[imgIndex] = data.publicUrl;
          }
        })();
        uploadPromises.push(p);
      }
    }

    await Promise.all(uploadPromises);
    return finalContent;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (values: any) => {
    setLoading(true);
    setUploading(true);
    setError("");

    try {
      const token = session?.accessToken;
      if (!token) throw new Error("You must be logged in to save.");

      // 1. Upload Files
      if (Object.keys(contentFiles).length > 0) {
        toast.info("Uploading media...");
        // Build blockId to index mapping using the tracked block field IDs
        const blockIdToIndex = new Map<string, number>();
        blockFieldIds.forEach((id, index) => {
          if (contentFiles[id]) {
            blockIdToIndex.set(id, index);
          }
        });

        const updatedContent = await uploadAllFiles(
          values.content,
          values.title,
          blockIdToIndex,
        );
        values.content = updatedContent;
      }

      // 2. Submit Data
      if (initialData) {
        await worksApi.update(initialData.slug, values, token);
        toast.success("Project updated!");
      } else {
        await worksApi.create(values, token);
        toast.success("Project created!");
      }

      // Clear files state after success to prevent re-upload on subsequent saves
      setContentFiles({});

      router.push("/mutualist-portfolios");
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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

            <TabsContent value="basic">
              <BasicInfoForm />
            </TabsContent>

            <TabsContent value="services">
              <ServicesForm />
            </TabsContent>

            <TabsContent value="teams">
              <TeamsForm />
            </TabsContent>

            <TabsContent value="content">
              <ContentForm
                contentFiles={contentFiles}
                setContentFiles={setContentFiles}
                onBlockFieldsChange={setBlockFieldIds}
              />
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
                : error
                  ? "Try Again"
                  : "Save Project"}
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
      </Form>

      {/* Guide / Sidebar */}
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
                <br />
                <span className="text-xs text-orange-500">
                  Max 10MB per file. MP4 supported.
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
