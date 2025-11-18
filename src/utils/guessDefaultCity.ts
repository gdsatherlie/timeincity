import { CITY_CONFIGS, CityConfig } from "../data/cities";

export function guessDefaultCityFromTimezone(): CityConfig | null {
  let tz: string | undefined;
  try {
    tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    tz = undefined;
  }

  if (!tz) {
    return null;
  }

  const cities = Object.values(CITY_CONFIGS);
  const match = cities.find((city) => city.timezone === tz);
  return match ?? null;
}
