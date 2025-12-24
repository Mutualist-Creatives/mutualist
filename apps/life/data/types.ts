// apps/life/data/types.ts

export interface Portfolio {
  id: string;
  title: string;
  createdBy: string;
  year: string;
  categories: string[]; // Changed from category to categories (array)
  description: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

// Alias for backward compatibility
export type PortfolioItem = Portfolio;
