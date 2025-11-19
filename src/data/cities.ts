import { POPULAR_CITIES, POPULAR_CITIES_COUNT } from "./popularCities";
import { TIMEZONE_COUNTRIES } from "./timezoneCountries";
import { slugifyCity } from "../utils/slugifyCity";

export type RegionSlug =
  | "all"
  | "united-states"
  | "europe"
  | "asia"
  | "south-america"
  | "africa"
  | "oceania";

export interface CityConfig {
  slug: string;
  name: string;
  timezone: string;
  country?: string;
  countryCode?: string;
  region?: string;
  continent?: RegionSlug;
}

const SOUTH_AMERICA_CODES = new Set([
  "AR",
  "BO",
  "BR",
  "CL",
  "CO",
  "EC",
  "FK",
  "GF",
  "GY",
  "PE",
  "PY",
  "SR",
  "UY",
  "VE"
]);

const OCEANIA_CODES = new Set([
  "AU",
  "NZ",
  "PG",
  "PF",
  "WS",
  "TO",
  "FJ",
  "FM",
  "MH",
  "SB",
  "TV",
  "VU"
]);

const REGION_BY_PREFIX: Record<string, RegionSlug> = {
  Europe: "europe",
  Asia: "asia",
  Africa: "africa",
  Australia: "oceania",
  Pacific: "oceania"
};

const overrides: Record<string, Partial<CityConfig>> = {
  "america/new_york": { region: "New York" },
  "america/chicago": { region: "Illinois" },
  "america/los_angeles": { region: "California" },
  "america/denver": { region: "Colorado" },
  "america/phoenix": { region: "Arizona" },
  "america/seattle": { region: "Washington" },
  "america/detroit": { region: "Michigan" },
  "america/dallas": { region: "Texas" },
  "america/houston": { region: "Texas" },
  "america/miami": { region: "Florida" },
  "america/boston": { region: "Massachusetts" },
  "america/anchorage": { region: "Alaska" }
};

function deriveRegion(countryCode?: string, timezone?: string): RegionSlug | undefined {
  if (!countryCode && timezone) {
    const prefix = timezone.split("/")[0];
    return REGION_BY_PREFIX[prefix];
  }
  if (countryCode === "US") {
    return "united-states";
  }
  if (countryCode && SOUTH_AMERICA_CODES.has(countryCode)) {
    return "south-america";
  }
  if (countryCode && OCEANIA_CODES.has(countryCode)) {
    return "oceania";
  }
  if (countryCode && countryCode.startsWith("E")) {
    return "europe";
  }
  return undefined;
}

const configs: CityConfig[] = POPULAR_CITIES.map((city) => {
  const slug = slugifyCity(city.label);
  const timezoneKey = city.timezone;
  const overrideKey = timezoneKey.toLowerCase();
  const countryMeta = TIMEZONE_COUNTRIES[timezoneKey];
  const baseCountry = countryMeta?.countryName;
  const baseCountryCode = countryMeta?.countryCode;
  const continent = deriveRegion(baseCountryCode, timezoneKey);

  return {
    slug,
    name: city.label,
    timezone: timezoneKey,
    country: baseCountry,
    countryCode: baseCountryCode,
    continent,
    ...overrides[overrideKey]
  } satisfies CityConfig;
});

export const CITY_CONFIGS: Record<string, CityConfig> = configs.reduce<Record<string, CityConfig>>((acc, city) => {
  acc[city.slug] = city;
  return acc;
}, {});

export const CITY_LIST = configs;
export const CITY_COUNT = POPULAR_CITIES_COUNT;
