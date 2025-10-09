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

export interface CreatePortfolioDto {
  title: string;
  createdBy: string;
  year: string;
  category: string;
  description: string;
  images: string[];
}

export interface UpdatePortfolioDto {
  title?: string;
  createdBy?: string;
  year?: string;
  category?: string;
  description?: string;
  images?: string[];
}

export const portfolioApi = {
  async getAll(): Promise<Portfolio[]> {
    const res = await fetch(`${API_URL}/portfolios`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch portfolios");
    return res.json();
  },

  async getById(id: string): Promise<Portfolio> {
    const res = await fetch(`${API_URL}/portfolios/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch portfolio");
    return res.json();
  },

  async getCategories(): Promise<string[]> {
    const res = await fetch(`${API_URL}/portfolios/categories`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch categories");
    return res.json();
  },

  async create(data: CreatePortfolioDto): Promise<Portfolio> {
    const res = await fetch(`${API_URL}/portfolios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create portfolio");
    return res.json();
  },

  async update(id: string, data: UpdatePortfolioDto): Promise<Portfolio> {
    const res = await fetch(`${API_URL}/portfolios/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update portfolio");
    return res.json();
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/portfolios/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete portfolio");
  },
};
