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
import { DeleteButtonMutu } from "@/components/delete-button-mutu";
import { Search, Pencil, Briefcase } from "lucide-react";
import { PortfolioMutu } from "@/lib/api";

export function PortfolioMutuSearch({
  portfolios,
}: {
  portfolios: PortfolioMutu[];
}) {
  const [search, setSearch] = useState("");
  const [industryFilter, setIndustryFilter] = useState("all");

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const industries = useMemo(() => {
    const inds = [...new Set(portfolios.map((p) => p.industry))];
    return inds.sort();
  }, [portfolios]);

  const filteredPortfolios = useMemo(() => {
    return portfolios.filter((portfolio) => {
      const matchesSearch =
        portfolio.title.toLowerCase().includes(search.toLowerCase()) ||
        portfolio.subtitle.toLowerCase().includes(search.toLowerCase()) ||
        portfolio.industry.toLowerCase().includes(search.toLowerCase());

      const matchesIndustry =
        industryFilter === "all" || portfolio.industry === industryFilter;

      return matchesSearch && matchesIndustry;
    });
  }, [portfolios, search, industryFilter]);

  return (
    <div className="space-y-4">
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
            <Select value={industryFilter} onValueChange={setIndustryFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
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
                setIndustryFilter("all");
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
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-1">
                      {portfolio.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                      {portfolio.subtitle}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap mt-2">
                  <Badge variant="secondary">{portfolio.industry}</Badge>
                  <span className="text-sm text-muted-foreground">
                    {portfolio.year}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {/* Services */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    Services:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {portfolio.services[0] &&
                      Object.entries(portfolio.services[0])
                        .filter(([_, value]) => value)
                        .map(([key]) => (
                          <Badge
                            key={key}
                            variant="outline"
                            className="text-xs capitalize"
                          >
                            {key}
                          </Badge>
                        ))}
                  </div>
                </div>

                {/* Team Info */}
                <div className="text-xs text-muted-foreground">
                  {portfolio.teams.length} team member(s) •{" "}
                  {portfolio.images.length} image(s)
                </div>

                <div className="flex gap-2 pt-2">
                  <Link
                    href={`/portfolios-mutu/${portfolio.id}`}
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
                  <DeleteButtonMutu
                    id={portfolio.id}
                    title={portfolio.title}
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
