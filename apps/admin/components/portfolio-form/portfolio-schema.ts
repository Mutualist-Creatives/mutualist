import { z } from "zod";

export const SERVICE_ICONS = ["A", "B", "C", "S"];
export const BLOCK_TYPES = [
  "full-width",
  "two-column",
  "three-column",
] as const;

export const LAYOUT_COUNTS: Record<string, number> = {
  "full-width": 1,
  "two-column": 2,
  "three-column": 3,
};

// Zod Schema
export const portfolioSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  title: z.string().min(1, "Title is required"),
  industry: z.string().min(1, "Industry is required"),
  year: z.string().min(1, "Year is required"),
  serviceNames: z.string().min(1, "Service description is required"),
  serviceIcons: z.array(z.string()),
  isFeatured: z.boolean().default(false),
  teams: z.array(
    z.object({
      role: z.string().min(1, "Role is required"),
      names: z.array(z.string().min(1, "Name is required")),
    })
  ),
  content: z.array(
    z.object({
      type: z.enum(BLOCK_TYPES),
      images: z.array(z.string()), // URL strings
      // We will handle file uploads separately/imperatively in the form,
      // or effectively "dirty" file states that aren't yet URLs.
      // But for the final submission, it must be strings (URLs).
    })
  ),
});

export type PortfolioFormValues = z.infer<typeof portfolioSchema>;
