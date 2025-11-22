import rawCityData from "../data/cities_over_50000_clean.json";
import { buildCitySlug, candidateSlugs, normalizeSlugCandidate } from "./citySlug";
import { slugifyCity } from "./slugifyCity";

export interface NormalizedCity {
  name: string;
  slug: string;
  country: string;
  countryCode?: string;
  state?: string | null;
  timezone: string;
  lat: number;
  lon: number;
  population?: number;
}

function normalizeCountryLabel(country: string | undefined, countryCode?: string | null): string | undefined {
  if (!country) return undefined;
  const upper = countryCode?.toUpperCase();
  if (upper === "US" || country.toLowerCase() === "united states" || country.toLowerCase() === "united states of america") {
    return "USA";
  }
  return country;
}

function formatLabel(city: NormalizedCity): string {
  const seen = new Set<string>();
  const parts = [city.name, city.state ?? undefined, normalizeCountryLabel(city.country, city.countryCode)]
    .filter((part): part is string => Boolean(part && part.trim().length))
    .map((part) => part.trim());

  const normalized: string[] = [];
  for (const part of parts) {
    const key = part.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    normalized.push(part);
  }

  return normalized.join(", ");
}

const cache: NormalizedCity[] = (rawCityData as NormalizedCity[]).map((city) => ({
  name: city.name,
  slug: normalizeSlugCandidate(city.slug || buildCitySlug(city)),
  country: city.country,
  countryCode: city.countryCode,
  state: city.state,
  timezone: city.timezone,
  lat: city.lat,
  lon: city.lon,
  population: city.population,
}));

const slugMap = new Map<string, NormalizedCity>();
const nameMap = new Map<string, NormalizedCity>();

for (const city of cache) {
  for (const slug of candidateSlugs(city)) {
    if (!slugMap.has(slug)) {
      slugMap.set(slug, city);
    }
  }
  const nameSlug = slugifyCity(city.name);
  if (!nameMap.has(nameSlug)) {
    nameMap.set(nameSlug, city);
  }
}

export function loadCities(): NormalizedCity[] {
  return cache;
}

export function getCityBySlug(slug: string): NormalizedCity | undefined {
  const normalized = normalizeSlugCandidate(slug);
  if (slugMap.has(normalized)) {
    return slugMap.get(normalized);
  }
  const fallbackName = slugifyCity(normalized);
  if (slugMap.has(fallbackName)) {
    return slugMap.get(fallbackName);
  }
  if (nameMap.has(fallbackName)) {
    return nameMap.get(fallbackName);
  }
  return cache.find((city) => slugifyCity(city.name) === fallbackName);
}

export function searchCities(query: string, limit = 10): NormalizedCity[] {
  const normalizedQuery = query.trim().toLowerCase();
  const ranked = cache
    .map((city) => ({ city, label: formatLabel(city) }))
    .filter(({ city }) => {
      if (!normalizedQuery) return true;
      const haystack = [city.name, city.country, city.state, city.timezone].filter(Boolean).join(" ").toLowerCase();
      return haystack.includes(normalizedQuery);
    })
    .sort((a, b) => a.label.localeCompare(b.label))
    .slice(0, limit)
    .map(({ city }) => city);

  return ranked;
}
