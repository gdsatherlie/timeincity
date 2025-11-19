import rawCityData from "../data/cities_over_50000.json";
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

const cache: NormalizedCity[] = (rawCityData as NormalizedCity[]).map((city) => ({
  name: city.name,
  slug: city.slug || slugifyCity(city.name),
  country: city.country,
  countryCode: city.countryCode,
  state: city.state,
  timezone: city.timezone,
  lat: city.lat,
  lon: city.lon,
  population: city.population,
}));

const slugMap = new Map<string, NormalizedCity>(cache.map((city) => [city.slug, city]));

export function loadCities(): NormalizedCity[] {
  return cache;
}

export function getCityBySlug(slug: string): NormalizedCity | undefined {
  return slugMap.get(slug.toLowerCase());
}

export function searchCities(query: string, limit = 10): NormalizedCity[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return cache.slice(0, limit);
  }
  return cache
    .filter((city) => {
      const haystack = [city.name, city.country, city.state, city.timezone].filter(Boolean).join(" ").toLowerCase();
      return haystack.includes(normalizedQuery);
    })
    .slice(0, limit);
}
