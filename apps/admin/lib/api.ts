import { auth } from "./auth";
import { getSession } from "next-auth/react";

const API_URL =
  process.env.INTERNAL_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8080/api";

const getAuthHeaders = async (tokenOverride?: string) => {
  if (tokenOverride) {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tokenOverride}`,
    };
  }

  if (typeof window === "undefined") {
    try {
      const session = await auth();
      const token = session?.accessToken;
      return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };
    } catch (e) {
      console.warn("Failed to get session in getAuthHeaders", e);
    }
  } else {
    // Client-side
    try {
      const session = await getSession();
      const token = session?.accessToken;
      return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };
    } catch (e) {
      console.warn("Failed to get client session in getAuthHeaders", e);
    }
  }

  return {
    "Content-Type": "application/json",
  };
};

export interface Portfolio {
  id: string;
  title: string;
  createdBy: string;
  year: string;
  categories: string[];
  description: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreatePortfolioDto {
  title: string;
  createdBy: string;
  year: string;
  categories: string[];
  description: string;
  images: string[];
}

export interface UpdatePortfolioDto {
  title?: string;
  createdBy?: string;
  year?: string;
  categories?: string[];
  description?: string;
  images?: string[];
}

export const portfolioApi = {
  async getAll(): Promise<Portfolio[]> {
    const res = await fetch(`${API_URL}/life-projects`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch portfolios");
    return res.json();
  },

  async getById(id: string): Promise<Portfolio> {
    const res = await fetch(`${API_URL}/life-projects/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch portfolio");
    return res.json();
  },

  async getCategories(): Promise<string[]> {
    const res = await fetch(`${API_URL}/life-projects/categories`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch categories");
    return res.json();
  },

  async create(data: CreatePortfolioDto): Promise<Portfolio> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/life-projects`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create portfolio");
    return res.json();
  },

  async update(id: string, data: UpdatePortfolioDto): Promise<Portfolio> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/life-projects/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update portfolio");
    return res.json();
  },

  async delete(id: string): Promise<void> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/life-projects/${id}`, {
      method: "DELETE",
      headers,
    });
    if (!res.ok) throw new Error("Failed to delete portfolio");
  },
};

export interface Work {
  id: string;
  slug: string;
  title: string;
  industry: string;
  year: string;
  serviceIcons: string[];
  serviceNames: string;
  teams: Array<{
    role: string;
    names: string[];
  }>;
  content: Array<{
    type: string;
    images: string[];
  }>;
  createdAt: string;
  updatedAt: string;
  isFeatured?: boolean;
}

export interface CreateWorkDto {
  slug: string;
  title: string;
  industry: string;
  year: string;
  serviceIcons: string[];
  serviceNames: string;
  teams: Array<{
    role: string;
    names: string[];
  }>;
  content: Array<{
    type: string;
    images: string[];
  }>;
  isFeatured?: boolean;
}

export const worksApi = {
  async getAll(): Promise<Work[]> {
    const res = await fetch(`${API_URL}/mutualist-portfolios`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch works");
    return res.json();
  },
  async getBySlug(slug: string): Promise<Work> {
    const res = await fetch(`${API_URL}/mutualist-portfolios/${slug}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch work");
    return res.json();
  },
  async create(data: CreateWorkDto, token?: string): Promise<Work> {
    const headers = await getAuthHeaders(token);
    const res = await fetch(`${API_URL}/mutualist-portfolios`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create work");
    return res.json();
  },
  async update(
    slug: string,
    data: Partial<CreateWorkDto>,
    token?: string,
  ): Promise<Work> {
    const headers = await getAuthHeaders(token);
    const res = await fetch(`${API_URL}/mutualist-portfolios/${slug}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update work");
    return res.json();
  },
  async delete(slug: string, token?: string): Promise<void> {
    const headers = await getAuthHeaders(token);
    const res = await fetch(`${API_URL}/mutualist-portfolios/${slug}`, {
      method: "DELETE",
      headers,
    });
    if (!res.ok) throw new Error("Failed to delete work");
  },
};

export interface Blog {
  id: string;
  slug: string;
  title: string;
  category: string;
  date: string;
  image: string;
  rotation: number;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBlogDto {
  slug: string;
  title: string;
  category: string;
  date: string;
  image?: string;
  rotation: number;
  content: string;
}

export const blogsApi = {
  async getAll(): Promise<Blog[]> {
    const res = await fetch(`${API_URL}/mutualist-blogs`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch blogs");
    return res.json();
  },
  async getBySlug(slug: string): Promise<Blog> {
    const res = await fetch(`${API_URL}/mutualist-blogs/${slug}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch blog");
    return res.json();
  },
  async create(data: CreateBlogDto): Promise<Blog> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/mutualist-blogs`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create blog");
    return res.json();
  },
  async update(slug: string, data: Partial<CreateBlogDto>): Promise<Blog> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/mutualist-blogs/${slug}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update blog");
    return res.json();
  },
  async delete(slug: string): Promise<void> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/mutualist-blogs/${slug}`, {
      method: "DELETE",
      headers,
    });
    if (!res.ok) throw new Error("Failed to delete blog");
  },
};
export interface CreatedUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface CreateUserDto {
  email: string;
  name: string;
  role?: string;
  password?: string;
}

export const usersApi = {
  async getAll(): Promise<CreatedUser[]> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/users`, {
      headers,
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch users");
    return res.json();
  },

  async getById(id: string): Promise<CreatedUser> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/users/${id}`, {
      headers,
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch user");
    return res.json();
  },

  async update(id: string, data: Partial<CreateUserDto>): Promise<CreatedUser> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/users/${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update user");
    return res.json();
  },

  async create(data: CreateUserDto, token?: string): Promise<CreatedUser> {
    const headers = await getAuthHeaders(token);
    const res = await fetch(`${API_URL}/users`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create user");
    return res.json();
  },

  async delete(id: string): Promise<void> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/users/${id}`, {
      method: "DELETE",
      headers,
    });
    if (!res.ok) throw new Error("Failed to delete user");
  },

  async resetPassword(id: string): Promise<void> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/users/${id}/reset-password`, {
      method: "POST",
      headers,
    });
    if (!res.ok) throw new Error("Failed to reset password");
  },
};
