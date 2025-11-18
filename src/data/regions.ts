import type { CityConfig } from "./cities";

export type RegionPageSlug =
  | "all-cities"
  | "united-states"
  | "europe"
  | "asia"
  | "south-america"
  | "africa"
  | "oceania";

export interface RegionPageContent {
  slug: RegionPageSlug;
  label: string;
  path: string;
  heading: string;
  paragraphs: string[];
  metaTitle: string;
  metaDescription: string;
  citySlugs: string[];
}

export const REGION_PAGE_CONTENT: Record<RegionPageSlug, RegionPageContent> = {
  "all-cities": {
    slug: "all-cities",
    label: "All Cities",
    path: "/cities",
    heading: "All Cities — Worldwide Time & Weather",
    paragraphs: [
      "Explore the current time and weather in more than 1,000 cities around the globe. From major world capitals to regional hubs, TimeInCity provides accurate local time, UTC offsets, sunrise/sunset, and weather data for every location.",
      "Browse alphabetically or filter by continent to find exactly what you need. Share a /city/ link so everyone you’re working with sees the same live clock."
    ],
    metaTitle: "Current Time in Every City — Global Directory | TimeInCity",
    metaDescription:
      "Browse 1,000+ cities to see current local time, weather, sunrise, sunset, and UTC offsets. The full TimeInCity directory of world clocks.",
    citySlugs: []
  },
  "united-states": {
    slug: "united-states",
    label: "United States",
    path: "/cities/united-states",
    heading: "Current Time in United States Cities",
    paragraphs: [
      "The United States spans multiple time zones, from Eastern Time to Hawaii Time. This page highlights major U.S. cities with accurate local times, weather updates, and sunrise/sunset information.",
      "Use it to coordinate meetings, plan travel, or explore regional time differences across the country."
    ],
    metaTitle: "Current Time in United States Cities — Major Time Zones",
    metaDescription:
      "See the current time, weather, and sunrise/sunset data across major United States cities spanning every U.S. time zone.",
    citySlugs: [
      "new-york",
      "los-angeles",
      "chicago",
      "houston",
      "phoenix",
      "philadelphia",
      "san-antonio",
      "san-diego",
      "dallas",
      "austin",
      "seattle",
      "denver",
      "miami",
      "boston"
    ]
  },
  europe: {
    slug: "europe",
    label: "Europe",
    path: "/cities/europe",
    heading: "Current Time in European Cities",
    paragraphs: [
      "Europe includes some of the world’s most visited cities and spans several time zones from UTC to Eastern European Time.",
      "See live local times, weather conditions, and daylight saving shifts across Europe’s capitals and major destinations."
    ],
    metaTitle: "Current Time in Europe — Major Cities & Time Zones",
    metaDescription:
      "Explore current local times, weather, and daylight information for major European cities across multiple time zones.",
    citySlugs: [
      "london",
      "paris",
      "berlin",
      "madrid",
      "rome",
      "lisbon",
      "dublin",
      "vienna",
      "prague",
      "warsaw",
      "stockholm",
      "amsterdam"
    ]
  },
  asia: {
    slug: "asia",
    label: "Asia",
    path: "/cities/asia",
    heading: "Current Time in Asian Cities",
    paragraphs: [
      "Asia is the world’s largest continent with diverse time zones stretching from the Middle East to Tokyo.",
      "View accurate local times, weather updates, and sunrise/sunset data for major Asian cities."
    ],
    metaTitle: "Current Time in Asia — Live Asian City Clocks",
    metaDescription:
      "Check the current time, weather, and sunrise/sunset across major Asian cities from Dubai to Tokyo.",
    citySlugs: [
      "tokyo",
      "seoul",
      "singapore",
      "hong-kong",
      "bangkok",
      "jakarta",
      "kuala-lumpur",
      "manila",
      "dubai",
      "mumbai",
      "delhi",
      "beijing"
    ]
  },
  "south-america": {
    slug: "south-america",
    label: "South America",
    path: "/cities/south-america",
    heading: "Current Time in South American Cities",
    paragraphs: [
      "South America includes tropical regions, mountain cities, and southern latitudes with varied time zones.",
      "Explore current times, weather data, and daylight information for key South American locations."
    ],
    metaTitle: "Current Time in South America — Major Cities",
    metaDescription:
      "Get live local times, weather, and sunrise/sunset across South America’s most active cities.",
    citySlugs: [
      "sao-paulo",
      "rio-de-janeiro",
      "buenos-aires",
      "lima",
      "bogota",
      "santiago",
      "quito",
      "montevideo",
      "caracas",
      "la-paz"
    ]
  },
  africa: {
    slug: "africa",
    label: "Africa",
    path: "/cities/africa",
    heading: "Current Time in African Cities",
    paragraphs: [
      "Africa spans several time zones and features dynamic climates.",
      "View accurate local times and weather conditions across its largest and fastest-growing cities."
    ],
    metaTitle: "Current Time in Africa — Time Zones & Weather",
    metaDescription:
      "Track the current time, weather, and sunrise/sunset across major African cities.",
    citySlugs: [
      "lagos",
      "cairo",
      "nairobi",
      "johannesburg",
      "casablanca",
      "addis-ababa",
      "accra",
      "cape-town",
      "dakar",
      "tunis"
    ]
  },
  oceania: {
    slug: "oceania",
    label: "Oceania",
    path: "/cities/oceania",
    heading: "Current Time in Oceania",
    paragraphs: [
      "Oceania includes cities in Australia, New Zealand, and Pacific Island nations.",
      "Explore major cities across the region with full time zone, weather, and sunrise/sunset data."
    ],
    metaTitle: "Current Time in Oceania — Australia, New Zealand & Pacific",
    metaDescription:
      "See the current time, weather, and sunrise/sunset across Oceania’s biggest cities.",
    citySlugs: [
      "sydney",
      "melbourne",
      "brisbane",
      "perth",
      "adelaide",
      "auckland",
      "wellington",
      "honolulu",
      "port-moresby",
      "suva"
    ]
  }
};

export function getRegionByPath(pathname: string): RegionPageSlug | null {
  const normalized = pathname.replace(/\/+$/, "") || "/";
  const entry = Object.values(REGION_PAGE_CONTENT).find((region) => region.path === normalized);
  return entry ? entry.slug : null;
}

export function getRegionPath(slug: RegionPageSlug): string {
  return REGION_PAGE_CONTENT[slug].path;
}

export function getRegionCities(slug: RegionPageSlug, allCities: CityConfig[]): CityConfig[] {
  if (slug === "all-cities") {
    return [...allCities].sort((a, b) => a.name.localeCompare(b.name));
  }
  const set = new Set(REGION_PAGE_CONTENT[slug].citySlugs.map((value) => value.toLowerCase()));
  return allCities
    .filter((city) => set.has(city.slug))
    .sort((a, b) => a.name.localeCompare(b.name));
}
