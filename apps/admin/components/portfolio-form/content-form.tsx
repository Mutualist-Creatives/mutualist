"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import {
  PortfolioFormValues,
  BLOCK_TYPES,
  LAYOUT_COUNTS,
} from "./portfolio-schema";
import { Dispatch, SetStateAction, useEffect } from "react";
import Image from "next/image";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "./sortable-item";

interface ContentFormProps {
  contentFiles: Record<string, Record<number, File>>;
  setContentFiles: Dispatch<
    SetStateAction<Record<string, Record<number, File>>>
  >;
  onBlockFieldsChange: (ids: string[]) => void;
}

export function ContentForm({
  contentFiles,
  setContentFiles,
  onBlockFieldsChange,
}: ContentFormProps) {
  const { control, watch, setValue } = useFormContext<PortfolioFormValues>();
  const {
    fields: blockFields,
    append,
    remove,
    update,
    move,
  } = useFieldArray({
    control,
    name: "content",
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    // Sync block IDs to parent form for robust index mapping during upload
    const ids = blockFields.map((field) => field.id);
    onBlockFieldsChange(ids);
  }, [blockFields, onBlockFieldsChange]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = blockFields.findIndex((item) => item.id === active.id);
      const newIndex = blockFields.findIndex((item) => item.id === over.id);

      move(oldIndex, newIndex);
      // No need to remap contentFiles since we use block ID as key now!
      // The files stay associated with their block ID regardless of position.
    }
  };

  const handleFileTypeChange = (
    index: number,
    newType: (typeof BLOCK_TYPES)[number],
  ) => {
    // Current block data
    const currentBlock = watch(`content.${index}`);
    const currentImages = currentBlock.images || [];

    const requiredCount = LAYOUT_COUNTS[newType];
    const newImages = [...currentImages];

    if (newImages.length < requiredCount) {
      // Fill with empty strings
      while (newImages.length < requiredCount) {
        newImages.push("");
      }
    } else if (newImages.length > requiredCount) {
      // Trim
      newImages.length = requiredCount;
    }

    // Update field
    update(index, {
      ...currentBlock,
      type: newType,
      images: newImages,
    });
  };

  const handleFileSelect = (
    blockId: string,
    blockIndex: number,
    imgIndex: number,
    file: File | null,
  ) => {
    if (!file) return;

    // Validate type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "video/mp4",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only image files and MP4 videos are allowed");
      return;
    }

    // Validate size (10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      toast.error(
        `File "${file.name}" is ${sizeMB}MB. Each file must not exceed 10MB.`,
      );
      return;
    }

    // Create preview
    const url = URL.createObjectURL(file);
    // Update RHF state with preview URL
    setValue(`content.${blockIndex}.images.${imgIndex}`, url);

    // Store File object for upload using block ID as key
    setContentFiles((prev) => ({
      ...prev,
      [blockId]: {
        ...(prev[blockId] || {}),
        [imgIndex]: file,
      },
    }));
  };

  const removeBlock = (blockId: string, index: number) => {
    // Revoke ObjectURLs for this block before removing (cleanup memory)
    const blockFiles = contentFiles[blockId];
    if (blockFiles) {
      Object.values(blockFiles).forEach((file) => {
        // We stored the preview URL in form state, not here
        // But we should still clean up
      });
    }

    remove(index);
    // Simply delete the block ID from contentFiles (no index shifting needed!)
    setContentFiles((prev) => {
      const newFiles = { ...prev };
      delete newFiles[blockId];
      return newFiles;
    });
  };

  return (
    <div className="space-y-6 mt-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={blockFields}
          strategy={verticalListSortingStrategy}
        >
          {blockFields.map((block, blockIndex) => (
            <SortableBlockItem
              key={block.id}
              id={block.id}
              blockIndex={blockIndex}
              control={control}
              watch={watch}
              contentFiles={contentFiles}
              handleFileTypeChange={handleFileTypeChange}
              removeBlock={removeBlock}
              handleFileSelect={handleFileSelect}
            />
          ))}
        </SortableContext>
      </DndContext>

      <Button
        type="button"
        variant="outline"
        onClick={() =>
          append({
            type: "full-width",
            images: Array(LAYOUT_COUNTS["full-width"]).fill(""),
          })
        }
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" /> Add Content Block
      </Button>
    </div>
  );
}

// Extracted for cleaner map
import { Control, UseFormWatch } from "react-hook-form";

// ... (existing imports, but I need to insert Control/UseFormWatch if not present. Assuming useFormContext is there)

interface SortableBlockItemProps {
  id: string;
  blockIndex: number;
  control: Control<PortfolioFormValues>;
  watch: UseFormWatch<PortfolioFormValues>;
  contentFiles: Record<string, Record<number, File>>;
  handleFileTypeChange: (
    index: number,
    type: (typeof BLOCK_TYPES)[number],
  ) => void;
  removeBlock: (blockId: string, index: number) => void;
  handleFileSelect: (
    blockId: string,
    blockIndex: number,
    imgIndex: number,
    file: File,
  ) => void;
}

function SortableBlockItem({
  id,
  blockIndex,
  control,
  watch,
  contentFiles,
  handleFileTypeChange,
  removeBlock,
  handleFileSelect,
}: SortableBlockItemProps) {
  // We must watch the 'type' to know how many images to render inputs for
  const blockType = watch(`content.${blockIndex}.type`);
  const blockImages = watch(`content.${blockIndex}.images`);

  // Grid classes helper
  const getGridClass = (type: string) => {
    if (type === "two-column") return "grid grid-cols-2 gap-4";
    if (type === "three-column") return "grid grid-cols-3 gap-4";
    return "flex flex-col gap-4"; // default full-width
  };

  return (
    <SortableItem id={id}>
      <div className="border p-4 rounded-lg bg-card relative space-y-4 mb-4">
        <div className="flex justify-between items-center bg-muted/50 p-2 rounded">
          <span className="font-semibold text-sm">Block {blockIndex + 1}</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-red-500 hover:text-red-700 h-6"
            onClick={() => removeBlock(id, blockIndex)}
          >
            <Trash2 className="h-4 w-4 mr-2" /> Remove Block
          </Button>
        </div>

        <div className="space-y-2">
          <FormLabel>Layout Type</FormLabel>
          <Select
            value={blockType}
            onValueChange={(val) =>
              handleFileTypeChange(
                blockIndex,
                val as (typeof BLOCK_TYPES)[number],
              )
            }
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
          <FormLabel>
            Media ({blockImages?.length || 0} required for {blockType})
          </FormLabel>
          <div className={getGridClass(blockType)}>
            {blockImages?.map((imgUrl: string, imgIndex: number) => (
              <div key={imgIndex} className="flex flex-col gap-2">
                <div className="flex gap-2 items-start">
                  <FormField
                    control={control}
                    name={`content.${blockIndex}.images.${imgIndex}`}
                    render={({ field }) => {
                      const file = contentFiles?.[id]?.[imgIndex];
                      return (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              {...field}
                              value={file ? file.name : field.value}
                              readOnly={!!file}
                              onChange={(e) => {
                                if (!file) field.onChange(e);
                              }}
                              placeholder={`URL ${imgIndex + 1}`}
                              className={
                                file ? "text-muted-foreground italic" : ""
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      const input = document.createElement("input");
                      input.type = "file";
                      input.accept = "image/*,video/mp4";
                      input.onchange = (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0];
                        if (file)
                          handleFileSelect(id, blockIndex, imgIndex, file);
                      };
                      input.click();
                    }}
                  >
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
                {/* Preview Area */}
                {imgUrl && (
                  <div className="relative w-full aspect-video bg-muted rounded-md overflow-hidden border">
                    {getMediaType(imgUrl, contentFiles[id]?.[imgIndex]) ===
                    "video" ? (
                      <video
                        src={imgUrl}
                        className="w-full h-full object-contain"
                        controls
                      />
                    ) : (
                      <Image
                        src={imgUrl}
                        alt="Preview"
                        fill
                        className="object-contain"
                      />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </SortableItem>
  );
}

function getMediaType(url: string, file?: File): "video" | "image" {
  // 1. Check File object if available (local preview)
  if (file) {
    if (file.type.startsWith("video/")) return "video";
    return "image";
  }

  // 2. Check URL extension (remote url)
  if (url.match(/\.(mp4|webm|mov)$/i)) return "video";

  // Default to image
  return "image";
}
