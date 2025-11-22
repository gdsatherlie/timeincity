import { slugifyCity } from "./slugifyCity";

export interface SlugSource {
  name: string;
  state?: string | null;
  country: string;
  slug?: string;
}

export function normalizeSlugCandidate(slug: string): string {
  return slugifyCity(slug);
}

export function buildCitySlug(city: Pick<SlugSource, "name" | "state" | "country">): string {
  const parts = [city.name, city.state ?? undefined, city.country].filter(Boolean) as string[];
  return slugifyCity(parts.join("-"));
}

export function candidateSlugs(city: SlugSource): string[] {
  const primary = city.slug ? normalizeSlugCandidate(city.slug) : buildCitySlug(city);
  const nameOnly = slugifyCity(city.name);
  const expanded = buildCitySlug(city);
  const set = new Set([primary, nameOnly, expanded]);
  return Array.from(set);
}
