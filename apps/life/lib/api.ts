import { Portfolio } from "@/data/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Helper function for exponential backoff retry
async function fetchWithRetry<T>(
  url: string,
  options: RequestInit = {},
  retries = MAX_RETRIES
): Promise<T> {
  try {
    const res = await fetch(url, {
      ...options,
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    if (retries > 0) {
      // Exponential backoff: wait longer with each retry
      const delay = RETRY_DELAY * (MAX_RETRIES - retries + 1);
      console.warn(
        `Fetch failed, retrying in ${delay}ms... (${retries} retries left)`,
        error
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
      return fetchWithRetry<T>(url, options, retries - 1);
    }
    throw error;
  }
}

export const portfolioApi = {
  async getAll(): Promise<Portfolio[]> {
    try {
      return await fetchWithRetry<Portfolio[]>(`${API_URL}/life-portfolios`);
    } catch (error) {
      console.error("Error fetching portfolios:", error);
      throw error; // Throw error so SWR can handle it
    }
  },

  async getById(id: string): Promise<Portfolio> {
    try {
      return await fetchWithRetry<Portfolio>(
        `${API_URL}/life-portfolios/${id}`
      );
    } catch (error) {
      console.error("Error fetching portfolio:", error);
      throw error;
    }
  },

  async getCategories(): Promise<string[]> {
    try {
      return await fetchWithRetry<string[]>(
        `${API_URL}/life-portfolios/categories`
      );
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },
};

// SWR fetcher function
export const fetcher = (url: string) => fetch(url).then((res) => res.json());
