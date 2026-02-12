"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DeleteButton } from "@/components/delete-button";
import { Search, Pencil, Briefcase } from "lucide-react";
import { Portfolio } from "@/lib/api";

export function PortfolioSearch({ portfolios }: { portfolios: Portfolio[] }) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Helper function to validate URL
  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Get unique categories
  const categories = useMemo(() => {
    const cats = [...new Set(portfolios.flatMap((p) => p.categories))];
    return cats.sort();
  }, [portfolios]);

  // Filter portfolios
  const filteredPortfolios = useMemo(() => {
    return portfolios.filter((portfolio) => {
      const matchesSearch =
        portfolio.title.toLowerCase().includes(search.toLowerCase()) ||
        portfolio.description.toLowerCase().includes(search.toLowerCase()) ||
        portfolio.createdBy.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        categoryFilter === "all" ||
        portfolio.categories.includes(categoryFilter);

      return matchesSearch && matchesCategory;
    });
  }, [portfolios, search, categoryFilter]);

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search portfolios..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            Showing {filteredPortfolios.length} of {portfolios.length}{" "}
            portfolios
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Grid */}
      {filteredPortfolios.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No portfolios found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Try adjusting your search or filter
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearch("");
                setCategoryFilter("all");
              }}
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPortfolios.map((portfolio) => (
            <Card
              key={portfolio.id}
              className="overflow-hidden group hover:shadow-lg transition-all"
            >
              <div className="aspect-video relative bg-muted">
                {portfolio.images[0] && isValidUrl(portfolio.images[0]) ? (
                  <Image
                    src={portfolio.images[0]}
                    alt={portfolio.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Briefcase className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
              </div>

              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg line-clamp-1">
                    {portfolio.title}
                  </CardTitle>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {portfolio.categories.map((category) => (
                    <Badge key={category} variant="secondary">
                      {category}
                    </Badge>
                  ))}
                  <span className="text-sm text-muted-foreground">
                    {portfolio.year}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {portfolio.description}
                </p>
                <div className="text-xs text-muted-foreground">
                  By {portfolio.createdBy}
                </div>

                <div className="flex gap-2 pt-2">
                  <Link
                    href={`/life-projects/${portfolio.id}`}
                    className="flex-1"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-2"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </Button>
                  </Link>
                  <DeleteButton
                    id={portfolio.id}
                    title={portfolio.title}
                    endpoint="life-projects"
                    variant="outline"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
