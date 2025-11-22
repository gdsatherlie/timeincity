import { loadCities, type NormalizedCity } from "../utils/cityData";
import { candidateSlugs, normalizeSlugCandidate } from "../utils/citySlug";

const normalizedCities = loadCities();

export type RegionSlug =
  | "all"
  | "united-states"
  | "north-america"
  | "europe"
  | "asia"
  | "south-america"
  | "africa"
  | "oceania";

export interface CityConfig extends NormalizedCity {
  region?: string | null;
  continent?: RegionSlug;
}

const NORTH_AMERICA_CODES = new Set([
  "CA",
  "MX",
  "AG",
  "AI",
  "AW",
  "BB",
  "BM",
  "BQ",
  "BS",
  "BZ",
  "CR",
  "CU",
  "CW",
  "DM",
  "DO",
  "GD",
  "GL",
  "GP",
  "GT",
  "HN",
  "HT",
  "JM",
  "KY",
  "NI",
  "PA",
  "PR",
  "SV",
  "TC",
  "TT"
]);

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
  "VU",
  "CC",
  "CX",
  "CK",
  "AS"
]);

const AFRICA_CODES = new Set([
  "AO",
  "BF",
  "BI",
  "BJ",
  "BW",
  "CD",
  "CF",
  "CG",
  "CI",
  "CM",
  "CV",
  "DJ",
  "DZ",
  "EG",
  "EH",
  "ER",
  "ET",
  "GA",
  "GH",
  "GM",
  "GN",
  "GQ",
  "KE",
  "LR",
  "LS",
  "LY",
  "MA",
  "MG",
  "ML",
  "MR",
  "MZ",
  "NA",
  "NE",
  "NG",
  "RW",
  "SD",
  "SL",
  "SN",
  "SO",
  "SS",
  "ST",
  "SZ",
  "TD",
  "TG",
  "TN",
  "TZ",
  "UG",
  "ZA",
  "ZM",
  "ZW"
]);

const EUROPE_CODES = new Set([
  "AD",
  "AL",
  "AT",
  "AX",
  "BA",
  "BE",
  "BG",
  "BY",
  "CH",
  "CY",
  "CZ",
  "DE",
  "DK",
  "EE",
  "ES",
  "FI",
  "FR",
  "GB",
  "GR",
  "HR",
  "HU",
  "IE",
  "IS",
  "IT",
  "LT",
  "LU",
  "LV",
  "MK",
  "MT",
  "NL",
  "NO",
  "PL",
  "PT",
  "RO",
  "RS",
  "RU",
  "SE",
  "SI",
  "SK",
  "UA"
]);

const ASIA_CODES = new Set([
  "AE",
  "AF",
  "AM",
  "AZ",
  "BD",
  "BH",
  "BN",
  "BT",
  "CN",
  "GE",
  "HK",
  "ID",
  "IL",
  "IN",
  "IQ",
  "IR",
  "JO",
  "JP",
  "KH",
  "KR",
  "KW",
  "LA",
  "LK",
  "MM",
  "MN",
  "MY",
  "NP",
  "OM",
  "PH",
  "PK",
  "QA",
  "SA",
  "SG",
  "SY",
  "TH",
  "TL",
  "TR",
  "TW",
  "UZ",
  "VN",
  "YE"
]);

function inferByTimezonePrefix(timezone?: string): RegionSlug | undefined {
  if (!timezone) return undefined;
  const prefix = timezone.split("/")[0];
  if (prefix === "America") return "north-america";
  if (prefix === "Europe") return "europe";
  if (prefix === "Africa") return "africa";
  if (prefix === "Asia") return "asia";
  if (prefix === "Australia" || prefix === "Pacific") return "oceania";
  if (prefix === "Indian") return "asia";
  if (prefix === "Antarctica") return "oceania";
  return undefined;
}

function deriveRegion(countryCode?: string, timezone?: string): RegionSlug | undefined {
  const code = countryCode?.toUpperCase();
  if (code === "US") return "united-states";
  if (code && NORTH_AMERICA_CODES.has(code)) return "north-america";
  if (code && SOUTH_AMERICA_CODES.has(code)) return "south-america";
  if (code && AFRICA_CODES.has(code)) return "africa";
  if (code && EUROPE_CODES.has(code)) return "europe";
  if (code && ASIA_CODES.has(code)) return "asia";
  if (code && OCEANIA_CODES.has(code)) return "oceania";
  return inferByTimezonePrefix(timezone) ?? "asia";
}

const configs: CityConfig[] = normalizedCities.map((city) => ({
  ...city,
  region: city.state ?? undefined,
  continent: deriveRegion(city.countryCode, city.timezone)
}));

const slugLookup = new Map<string, CityConfig>();

for (const city of configs) {
  for (const slug of candidateSlugs(city)) {
    const key = normalizeSlugCandidate(slug);
    if (!slugLookup.has(key)) {
      slugLookup.set(key, city);
    }
  }
}

export const CITY_CONFIGS: Record<string, CityConfig> = configs.reduce<Record<string, CityConfig>>((acc, city) => {
  acc[normalizeSlugCandidate(city.slug)] = city;
  return acc;
}, {});

export function findCityBySlug(slug: string): CityConfig | undefined {
  const normalized = normalizeSlugCandidate(slug);
  if (slugLookup.has(normalized)) {
    return slugLookup.get(normalized);
  }
  return undefined;
}

export const CITY_LIST = configs;
export const CITY_COUNT = configs.length;
