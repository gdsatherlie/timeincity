import type { CityConfig } from "../data/cities";

type DisplayableCity = Pick<CityConfig, "name" | "region" | "country"> & {
  countryCode?: string | null;
};

function normalizeCountryLabel(country: string | undefined, countryCode?: string | null): string | undefined {
  if (!country) {
    return undefined;
  }
  if (countryCode?.toUpperCase() === "US") {
    return "USA";
  }
  return country;
}

export function formatCityDisplay(city: DisplayableCity): string {
  const seen = new Set<string>();
  const parts = [city.name, city.region, normalizeCountryLabel(city.country, city.countryCode)]
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
