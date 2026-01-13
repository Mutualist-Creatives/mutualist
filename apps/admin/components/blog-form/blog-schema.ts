import { z } from "zod";

export const blogSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  title: z.string().min(1, "Title is required"),
  category: z.string().min(1, "Category is required"),
  date: z.string().min(1, "Date is required"),
  image: z.string().optional(),
  rotation: z.number(),
  // Content can be empty initially but usually we want some text.
  // Tiptap returns HTML string.
  content: z.string().min(1, "Content is required"),
});

export type BlogFormValues = z.infer<typeof blogSchema>;
