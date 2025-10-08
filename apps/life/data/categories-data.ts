export interface Category {
  id: string;
  number: string;
  name: string;
}

export const categories: Category[] = [
  {
    id: "all",
    number: "0010",
    name: "All",
  },
  {
    id: "graphic-design",
    number: "0020",
    name: "Graphic Design",
  },
  {
    id: "illustration",
    number: "0030",
    name: "Illustration",
  },
  {
    id: "typography",
    number: "0040",
    name: "Typography",
  },
  {
    id: "digital-imagin",
    number: "0050",
    name: "Digital Imagin",
  },
  {
    id: "motion-graphic",
    number: "0060",
    name: "Motion Graphic",
  },
  {
    id: "animation",
    number: "0070",
    name: "Animation",
  },
  {
    id: "3d-modelling",
    number: "0080",
    name: "3D Modelling",
  },
];
