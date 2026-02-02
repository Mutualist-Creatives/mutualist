export interface Work {
  slug: string;
  title: string;
  industry: string;
  year: string;
  serviceIcons: string[];
  serviceNames: string;
  teams: { role: string; names: string[] }[];
  content: { type: string; images: string[] }[];
  isFeatured?: boolean;
}

export interface Blog {
  slug: string;
  title: string;
  category: string;
  date: string;
  image?: string;
  content: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export async function fetchWorks() {
  try {
    const res = await fetch(`${API_URL}/main-portfolios`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      console.error(`Status: ${res.status} ${res.statusText}`);
      throw new Error("Failed to fetch works");
    }
    const text = await res.text();
    return text ? JSON.parse(text) : [];
  } catch (error) {
    console.error("Error fetching works:", error);
    return [];
  }
}

export async function fetchWorkBySlug(slug: string) {
  try {
    const res = await fetch(`${API_URL}/main-portfolios/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return undefined;
    const text = await res.text();
    return text ? JSON.parse(text) : undefined;
  } catch (error) {
    console.error(`Error fetching work ${slug}:`, error);
    return undefined;
  }
}

export async function fetchBlogs() {
  try {
    const res = await fetch(`${API_URL}/blogs`, { cache: "no-store" });
    if (!res.ok) return [];
    const text = await res.text();
    return text ? JSON.parse(text) : [];
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
}

export async function fetchBlogBySlug(slug: string) {
  try {
    const res = await fetch(`${API_URL}/blogs/${slug}`, { cache: "no-store" });
    if (!res.ok) return undefined;
    const text = await res.text();
    return text ? JSON.parse(text) : undefined;
  } catch (error) {
    console.error(`Error fetching blog ${slug}:`, error);
    return undefined;
  }
}
