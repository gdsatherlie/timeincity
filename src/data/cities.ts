import { POPULAR_CITIES } from "./popularCities";
import { slugifyCity } from "../utils/slugifyCity";

export type CityConfig = {
  slug: string;
  name: string;
  timezone: string;
  country?: string;
  stateOrRegion?: string;
};

const CITY_OVERRIDES: Record<string, Partial<Omit<CityConfig, "slug" | "timezone">>> = {
  chicago: { country: "United States", stateOrRegion: "Illinois" },
  "new-york": { name: "New York City", country: "United States", stateOrRegion: "New York" },
  "los-angeles": { country: "United States", stateOrRegion: "California" },
  london: { country: "United Kingdom" },
  paris: { country: "France" },
  tokyo: { country: "Japan" },
  sydney: { country: "Australia" },
  "san-francisco": { country: "United States", stateOrRegion: "California" },
  "san-diego": { country: "United States", stateOrRegion: "California" },
  "san-jose": { country: "United States", stateOrRegion: "California" },
  austin: { country: "United States", stateOrRegion: "Texas" },
  houston: { country: "United States", stateOrRegion: "Texas" },
  dallas: { country: "United States", stateOrRegion: "Texas" },
  miami: { country: "United States", stateOrRegion: "Florida" },
  seattle: { country: "United States", stateOrRegion: "Washington" }
};

export const CITY_CONFIGS: Record<string, CityConfig> = {};

for (const city of POPULAR_CITIES) {
  const slug = slugifyCity(city.label);
  if (!slug || CITY_CONFIGS[slug]) {
    continue;
  }

  const overrides = CITY_OVERRIDES[slug];

  CITY_CONFIGS[slug] = {
    slug,
    name: overrides?.name ?? city.label,
    timezone: city.timezone,
    country: overrides?.country,
    stateOrRegion: overrides?.stateOrRegion
  };
}

export const CITY_CONFIG_LIST = Object.values(CITY_CONFIGS);

export const FEATURED_CITY_SLUGS = [
  "chicago",
  "new-york",
  "los-angeles",
  "london",
  "paris",
  "tokyo",
  "sydney",
  "san-francisco"
].filter((slug) => Boolean(CITY_CONFIGS[slug]));

export function resolveCityConfig(slug?: string): CityConfig | undefined {
  if (!slug) {
    return undefined;
  }

  return CITY_CONFIGS[slug.toLowerCase()];
}
