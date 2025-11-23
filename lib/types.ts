export type UserRole = "candidate" | "employer" | "admin";

export type Company = {
  id: string;
  name: string;
  logoUrl?: string;
  website?: string;
  location?: string;
  description?: string;
};

export type Job = {
  id: string;
  slug: string;
  title: string;
  companyId: string;
  employmentType: "Full-Time" | "Part-Time" | "Internship" | "Contract";
  function: string;
  seniority: "Analyst" | "Associate" | "VP" | "Director" | "MD/Principal";
  assetClasses: string[];
  locationType: "On-Site" | "Hybrid" | "Remote";
  city: string;
  state: string;
  country: string;
  compensationRangeMin?: number;
  compensationRangeMax?: number;
  compensationCurrency?: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  applicationUrl?: string;
  applicationEmail?: string;
  isFeatured?: boolean;
  isActive?: boolean;
  postedAt: string;
};

export type Resource = {
  id: string;
  slug: string;
  title: string;
  type: "model" | "template" | "guide" | "tool";
  description: string;
  skillLevel: "Beginner" | "Intermediate" | "Advanced";
  assetClasses: string[];
  fileUrl?: string;
  externalLink?: string;
  tags: string[];
  isPremium?: boolean;
};

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  coverImageUrl?: string;
  tags: string[];
  author: string;
  publishedAt: string;
};
