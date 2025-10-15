// Fixed categories for portfolio
export const PORTFOLIO_CATEGORIES = [
  "Graphic Design",
  "Illustration",
  "Typography",
  "Digital Imaging",
  "Motion Graphic",
  "Animation",
  "3D Modelling",
] as const;

export type PortfolioCategory = (typeof PORTFOLIO_CATEGORIES)[number];
