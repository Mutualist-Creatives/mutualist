"use client";

import { PortfolioForm } from "./portfolio-form/portfolio-form";
import { Work } from "@/lib/api";

interface MainPortfolioFormProps {
  work?: Work;
}

export function MainPortfolioForm({ work }: MainPortfolioFormProps) {
  return <PortfolioForm initialData={work} />;
}
