const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api";

export interface Portfolio {
  id: string;
  title: string;
  createdBy: string;
  year: string;
  category: string;
  description: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export const portfolioApi = {
  async getAll(): Promise<Portfolio[]> {
    try {
      const res = await fetch(`${API_URL}/portfolios`, {
        cache: "no-store",
        next: { revalidate: 0 },
      });
      if (!res.ok) {
        console.error("Failed to fetch portfolios:", res.statusText);
        return [];
      }
      return res.json();
    } catch (error) {
      console.error("Error fetching portfolios:", error);
      return [];
    }
  },

  async getById(id: string): Promise<Portfolio | null> {
    try {
      const res = await fetch(`${API_URL}/portfolios/${id}`, {
        cache: "no-store",
      });
      if (!res.ok) return null;
      return res.json();
    } catch (error) {
      console.error("Error fetching portfolio:", error);
      return null;
    }
  },

  async getCategories(): Promise<string[]> {
    try {
      const res = await fetch(`${API_URL}/portfolios/categories`, {
        cache: "no-store",
      });
      if (!res.ok) return [];
      return res.json();
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  },
};
