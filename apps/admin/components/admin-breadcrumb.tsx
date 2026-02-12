"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function AdminBreadcrumb() {
  const pathname = usePathname();

  // Don't show breadcrumb on root (Dashboard) if desired,
  // but usually "Dashboard" is good context.
  // If pathname is "/" we might just want "Dashboard" or nothing.

  const paths = pathname.split("/").filter((path) => path);

  // Map commonly used slugs to readable names
  const pathNames: Record<string, string> = {
    "mutualist-portfolios": "Mutualist Portfolios",
    "life-projects": "Life Projects",
    "mutualist-blogs": "Mutualist Blogs",
    users: "Users",
    new: "New",
  };

  const getBreadcrumbName = (path: string) => {
    if (pathNames[path]) return pathNames[path];
    // Simple capitalization for others, or keep ID as is
    if (path.length > 20) return "Edit"; // Assume long IDs are "Edit" pages
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <Breadcrumb className="hidden md:flex ml-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">Dashboard</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {paths.length > 0 && <BreadcrumbSeparator />}

        {paths.map((path, index) => {
          const isLast = index === paths.length - 1;
          const href = `/${paths.slice(0, index + 1).join("/")}`;
          const name = getBreadcrumbName(path);

          return (
            <Fragment key={path}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{name}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={href}>{name}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
