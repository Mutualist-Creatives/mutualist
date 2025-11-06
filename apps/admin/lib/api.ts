const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api";

export interface Portfolio {
  id: string;
  title: string;
  createdBy: string;
  year: string;
  categories: string[]; // Changed from category to categories
  description: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreatePortfolioDto {
  title: string;
  createdBy: string;
  year: string;
  categories: string[]; // Changed from category to categories
  description: string;
  images: string[];
}

export interface UpdatePortfolioDto {
  title?: string;
  createdBy?: string;
  year?: string;
  categories?: string[]; // Changed from category to categories
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

export interface PortfolioMutu {
  id: string;
  title: string;
  subtitle: string;
  year: string;
  industry: string;
  services: Array<{
    advertisement?: boolean;
    branding?: boolean;
    "character design"?: boolean;
    "social media"?: boolean;
  }>;
  teams: Array<{
    role: string;
    name: string;
  }>;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreatePortfolioMutuDto {
  title: string;
  subtitle: string;
  year: string;
  industry: string;
  services: Array<{
    advertisement?: boolean;
    branding?: boolean;
    "character design"?: boolean;
    "social media"?: boolean;
  }>;
  teams: Array<{
    role: string;
    name: string;
  }>;
  images: string[];
}

export interface UpdatePortfolioMutuDto {
  title?: string;
  subtitle?: string;
  year?: string;
  industry?: string;
  services?: Array<{
    advertisement?: boolean;
    branding?: boolean;
    "character design"?: boolean;
    "social media"?: boolean;
  }>;
  teams?: Array<{
    role: string;
    name: string;
  }>;
  images?: string[];
}

export const portfolioMutuApi = {
  async getAll(): Promise<PortfolioMutu[]> {
    const res = await fetch(`${API_URL}/portfolios-mutu`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch portfolios mutu");
    return res.json();
  },

  async getById(id: string): Promise<PortfolioMutu> {
    const res = await fetch(`${API_URL}/portfolios-mutu/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch portfolio mutu");
    return res.json();
  },

  async create(data: CreatePortfolioMutuDto): Promise<PortfolioMutu> {
    const res = await fetch(`${API_URL}/portfolios-mutu`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create portfolio mutu");
    return res.json();
  },

  async update(
    id: string,
    data: UpdatePortfolioMutuDto
  ): Promise<PortfolioMutu> {
    const res = await fetch(`${API_URL}/portfolios-mutu/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update portfolio mutu");
    return res.json();
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/portfolios-mutu/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete portfolio mutu");
  },
};
