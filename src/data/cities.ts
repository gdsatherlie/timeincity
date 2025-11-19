import { loadCities } from "../utils/cityData";

const normalizedCities = loadCities();

export type RegionSlug =
  | "all"
  | "united-states"
  | "europe"
  | "asia"
  | "south-america"
  | "africa"
  | "oceania";

export interface CityConfig extends NormalizedCity {
  region?: string | null;
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

const configs: CityConfig[] = normalizedCities.map((city) => ({
  ...city,
  region: city.state ?? undefined,
  continent: deriveRegion(city.countryCode, city.timezone)
}));

export const CITY_CONFIGS: Record<string, CityConfig> = configs.reduce<Record<string, CityConfig>>((acc, city) => {
  acc[city.slug] = city;
  return acc;
}, {});

export const CITY_LIST = configs;
export const CITY_COUNT = configs.length;
