"use client";

import { PortfolioForm } from "./portfolio-form/portfolio-form";
import { Work } from "@/lib/api";

interface MutualistPortfolioFormProps {
  work?: Work;
}

export function MutualistPortfolioForm({ work }: MutualistPortfolioFormProps) {
  return <PortfolioForm initialData={work} />;
}
