import { type Company, type Job, type Post, type Resource } from "./types";

export const companies: Company[] = [
  {
    id: "c1",
    name: "Summit Capital Partners",
    logoUrl: "/logos/summit.svg",
    website: "https://summitcap.com",
    location: "New York, NY",
    description: "Institutional owner-operator focused on value-add multifamily and mixed-use assets."
  },
  {
    id: "c2",
    name: "Harborview Development",
    logoUrl: "/logos/harborview.svg",
    website: "https://harborviewdev.com",
    location: "Los Angeles, CA",
    description: "West Coast developer specializing in adaptive reuse and ground-up hospitality projects."
  },
  {
    id: "c3",
    name: "Atlas Debt Advisors",
    logoUrl: "/logos/atlas.svg",
    website: "https://atlasdebt.com",
    location: "Chicago, IL",
    description: "Middle-market capital advisory with placements across bridge, construction, and perm debt."
  }
];

export const jobs: Job[] = [
  {
    id: "j1",
    slug: "acquisitions-associate-summit",
    title: "Acquisitions Associate",
    companyId: "c1",
    employmentType: "Full-Time",
    function: "Acquisitions",
    seniority: "Associate",
    assetClasses: ["Multifamily", "Mixed-Use"],
    locationType: "Hybrid",
    city: "New York",
    state: "NY",
    country: "USA",
    compensationRangeMin: 115000,
    compensationRangeMax: 145000,
    compensationCurrency: "USD",
    description:
      "Own underwriting and pipeline management for value-add acquisitions alongside partners and senior leadership.",
    responsibilities: [
      "Source and qualify marketed and off-market opportunities",
      "Lead underwriting, sensitivity analyses, and business plan creation",
      "Coordinate diligence workstreams across legal, design, and ops"
    ],
    requirements: [
      "2-4 years in acquisitions or investment banking",
      "Deep comfort with Argus and Excel modeling",
      "Clear communication with investment committee"
    ],
    applicationUrl: "https://hirecre.com/apply/summit-associate",
    isFeatured: true,
    isActive: true,
    postedAt: "2024-06-02"
  },
  {
    id: "j2",
    slug: "development-analyst-harborview",
    title: "Development Analyst",
    companyId: "c2",
    employmentType: "Full-Time",
    function: "Development",
    seniority: "Analyst",
    assetClasses: ["Hospitality", "Mixed-Use"],
    locationType: "On-Site",
    city: "Los Angeles",
    state: "CA",
    country: "USA",
    compensationRangeMin: 90000,
    compensationRangeMax: 110000,
    compensationCurrency: "USD",
    description: "Model, entitle, and track construction progress for adaptive reuse projects across LA.",
    responsibilities: [
      "Maintain predevelopment and construction budgets",
      "Support entitlement submissions and community outreach",
      "Own lender/partner reporting packets"
    ],
    requirements: [
      "1-3 years of development or GC experience",
      "Strong schedule management and communication",
      "Revit/Bluebeam familiarity a plus"
    ],
    applicationEmail: "talent@harborviewdev.com",
    isFeatured: true,
    isActive: true,
    postedAt: "2024-06-01"
  },
  {
    id: "j3",
    slug: "capital-markets-vp-atlas",
    title: "VP, Capital Markets",
    companyId: "c3",
    employmentType: "Full-Time",
    function: "Debt / Capital Markets",
    seniority: "VP",
    assetClasses: ["Industrial", "Multifamily", "Retail"],
    locationType: "Remote",
    city: "Chicago",
    state: "IL",
    country: "USA",
    compensationRangeMin: 160000,
    compensationRangeMax: 220000,
    compensationCurrency: "USD",
    description: "Lead debt/equity placements for institutional sponsors across bridge and construction mandates.",
    responsibilities: [
      "Own client relationships and mandate structuring",
      "Direct marketing processes to lender and equity networks",
      "Mentor junior talent and elevate platform best practices"
    ],
    requirements: [
      "7+ years in capital markets or debt brokerage",
      "Track record executing complex financings",
      "Network across life companies, debt funds, and banks"
    ],
    applicationUrl: "https://hirecre.com/apply/atlas-vp",
    isFeatured: false,
    isActive: true,
    postedAt: "2024-05-28"
  }
];

export const resources: Resource[] = [
  {
    id: "r1",
    slug: "multifamily-underwriting-model",
    title: "Multifamily Acquisition Model",
    type: "model",
    description: "3-statement, debt-sculpted multifamily model with lease-up, CapEx, and exit waterfall tabs.",
    skillLevel: "Intermediate",
    assetClasses: ["Multifamily"],
    fileUrl: "https://hirecre.com/files/mf-model.xlsx",
    tags: ["Model", "Waterfall", "Debt"],
    isPremium: false
  },
  {
    id: "r2",
    slug: "construction-draw-template",
    title: "Construction Draw & Closeout Tracker",
    type: "template",
    description: "Template to manage monthly draws, lien releases, and closeout punch lists.",
    skillLevel: "Beginner",
    assetClasses: ["Mixed-Use", "Industrial"],
    fileUrl: "https://hirecre.com/files/draw-template.xlsx",
    tags: ["Construction", "Reporting"],
    isPremium: false
  },
  {
    id: "r3",
    slug: "debt-marketing-guide",
    title: "Debt Marketing Guide",
    type: "guide",
    description: "Step-by-step playbook for marketing bridge, construction, and perm loans to capital providers.",
    skillLevel: "Advanced",
    assetClasses: ["All"],
    externalLink: "https://hirecre.com/guides/debt-marketing",
    tags: ["Capital Markets", "Guide"],
    isPremium: true
  }
];

export const posts: Post[] = [
  {
    id: "p1",
    slug: "cre-compensation-trends-2024",
    title: "CRE Compensation Trends for 2024",
    excerpt: "What we are seeing across acquisitions, development, and capital markets comp bands.",
    body: `## Compensation keeps normalizing\n\nBonuses are stabilizing after the run-up in 2021-2022.`,
    tags: ["Careers", "Compensation"],
    author: "HireCRE Editorial",
    publishedAt: "2024-05-20"
  },
  {
    id: "p2",
    slug: "underwriting-pitfalls",
    title: "Underwriting Pitfalls We Keep Seeing",
    excerpt: "From exit cap selection to debt sizing, here are common misses.",
    body: `## Start with downside cases\n\nInstitutional LPs are leaning into resilient base cases.`,
    tags: ["Underwriting", "Models"],
    author: "HireCRE Editorial",
    publishedAt: "2024-05-14"
  }
];

export const featuredJobs = jobs.filter((job) => job.isFeatured);
export const featuredResources = resources.slice(0, 2);
export const latestPosts = posts.slice(0, 2);
