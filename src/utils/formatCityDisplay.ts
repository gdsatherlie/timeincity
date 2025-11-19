import type { CityConfig } from "../data/cities";

export function formatCityDisplay(city: Pick<CityConfig, "name" | "region" | "country">): string {
  const seen = new Set<string>();
  const parts = [city.name, city.region, city.country]
    .filter((part): part is string => Boolean(part && part.trim().length))
    .map((part) => part.trim());

  const normalized: string[] = [];
  for (const part of parts) {
    const key = part.toLowerCase();
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    normalized.push(part);
  }

  return normalized.join(", ");
}
