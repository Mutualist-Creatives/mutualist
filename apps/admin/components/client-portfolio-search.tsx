"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
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
import { Search, Pencil, Briefcase, Star } from "lucide-react";
import { Work } from "@/lib/api";

const isVideo = (url: string) => /\.(mp4|webm|mov)$/i.test(url);

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

  const getThumbnail = (work: Work) => {
    for (const block of work.content) {
      if (block.images && block.images.length > 0) {
        return block.images[0];
      }
    }
    return null;
  };

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
          {filteredWorks.map((work) => {
            const thumbnail = getThumbnail(work);
            return (
              <Card
                key={work.slug}
                className="overflow-hidden group hover:shadow-lg transition-all"
              >
                {/* Thumbnail */}
                <div className="aspect-video relative bg-muted">
                  {thumbnail ? (
                    isVideo(thumbnail) ? (
                      <video
                        src={thumbnail}
                        className="w-full h-full object-cover"
                        muted
                        loop
                        playsInline
                        autoPlay // Optional: hover play or auto
                      />
                    ) : (
                      <Image
                        src={thumbnail}
                        alt={work.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    )
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Briefcase className="h-12 w-12 text-muted-foreground/20" />
                    </div>
                  )}
                </div>

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
                    <div
                      className="ml-auto cursor-pointer"
                      onClick={async (e) => {
                        e.preventDefault();
                        // Optimistic toggle
                        // Note: In a real app we'd use SWR/TanStack Query mutation or a server action to revalidate
                        // For now, we'll just fire the update and rely on eventual reload if needed,
                        // or we could force a router refresh.
                        try {
                          const worksApi = (await import("@/lib/api")).worksApi;
                          // Toggle logic
                          await worksApi.update(work.slug, {
                            isFeatured: !work.isFeatured,
                          });
                          // Refresh to show updated state if we are server-rendering or rely on router
                          // Using window.location.reload() is heavy, router.refresh() is better for server components
                          // Since this is a client component, we might want to lift state or use context.
                          // For simplicity in this task, let's just use router.refresh()
                          window.location.reload();
                        } catch (err) {
                          console.error("Failed to toggle feature", err);
                        }
                      }}
                    >
                      {/* Star Icon - Filled if featured, Outline if not */}
                      <div
                        className={
                          work.isFeatured
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-muted-foreground"
                        }
                      >
                        <Star
                          className={
                            work.isFeatured
                              ? "h-5 w-5 fill-yellow-500 text-yellow-500"
                              : "h-5 w-5"
                          }
                        />
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {work.serviceNames}
                  </p>

                  <div className="flex gap-2 pt-2">
                    <Link
                      href={`/mutualist-portfolios/${work.slug}`}
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
                      endpoint="mutualist-portfolios"
                      variant="outline"
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
