export type ServiceType = "A" | "B" | "C" | "S";

export interface TeamMember {
  role: string;
  names: string[];
}

export type ContentBlockType =
  | "full-width"
  | "two-column"
  | "three-column"
  | "masonry";

export interface ContentBlock {
  type: ContentBlockType;
  images: string[]; // Array of image paths
}

export interface WorkItem {
  slug: string;
  title: string;
  industry: string;
  year: string;
  serviceIcons: ServiceType[]; // Which icons to highlight
  serviceNames: string; // e.g. "Advertising and Branding"
  teams: TeamMember[];
  content: ContentBlock[];
}

export const worksData: WorkItem[] = [
  {
    slug: "kokara",
    title: "Kokara",
    industry: "Digital Comics",
    year: "2025",
    serviceIcons: ["A", "B", "C", "S"], // Example: All active based on image, or maybe specific ones
    serviceNames: "Advertising and Branding",
    teams: [
      {
        role: "Creative Director",
        names: ["Andre Manggala"],
      },
      {
        role: "Graphic Designer",
        names: ["Nivelle Aruana", "Gabrielle Claudia"],
      },
      {
        role: "Illustrator",
        names: ["Nivelle Aruana", "Gabrielle Claudia"],
      },
    ],
    content: [
      {
        type: "full-width",
        images: ["/assets/works/kokara/1.png"], // Placeholder path
      },
      {
        type: "three-column",
        images: [
          "/assets/works/kokara/icon1.png",
          "/assets/works/kokara/icon2.png",
          "/assets/works/kokara/icon3.png",
        ],
      },
      {
        type: "two-column",
        images: ["/assets/works/kokara/2.png", "/assets/works/kokara/3.png"],
      },
      {
        type: "full-width",
        images: ["/assets/works/kokara/4.png"],
      },
    ],
  },
  // ... other works can be added here
];

export function getWorkBySlug(slug: string): WorkItem | undefined {
  return worksData.find((work) => work.slug === slug);
}
