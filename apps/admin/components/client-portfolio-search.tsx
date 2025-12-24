"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
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
import { Work } from "@/lib/api";

export function ClientPortfolioSearch({ works }: { works: Work[] }) {
  const [search, setSearch] = useState("");
  const [industryFilter, setIndustryFilter] = useState("all");

  // Get unique industries
  const industries = useMemo(() => {
    const inds = [...new Set(works.map((w) => w.industry))];
    return inds.sort();
  }, [works]);

  // Filter works
  const filteredWorks = useMemo(() => {
    return works.filter((work) => {
      const matchesSearch =
        work.title.toLowerCase().includes(search.toLowerCase()) ||
        work.serviceNames.toLowerCase().includes(search.toLowerCase());

      const matchesIndustry =
        industryFilter === "all" || work.industry === industryFilter;

      return matchesSearch && matchesIndustry;
    });
  }, [works, search, industryFilter]);

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
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
                {industries.map((ind) => (
                  <SelectItem key={ind} value={ind}>
                    {ind}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            Showing {filteredWorks.length} of {works.length} projects
          </div>
        </CardContent>
      </Card>

      {/* Grid */}
      {filteredWorks.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No projects found</h3>
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
          {filteredWorks.map((work) => (
            <Card
              key={work.slug}
              className="overflow-hidden group hover:shadow-lg transition-all"
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg line-clamp-1">
                    {work.title}
                  </CardTitle>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary">{work.industry}</Badge>
                  <span className="text-sm text-muted-foreground">
                    {work.year}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {work.serviceNames}
                </p>

                <div className="flex gap-2 pt-2">
                  <Link
                    href={`/main-portfolios/${work.slug}`}
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
                    id={work.slug}
                    title={work.title}
                    endpoint="main-portfolios"
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
