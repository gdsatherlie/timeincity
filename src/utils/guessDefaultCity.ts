import { CITY_LIST, type CityConfig } from "../data/cities";

export function guessDefaultCityFromTimezone(): CityConfig | null {
  let timezone: string | undefined;
  try {
    timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    timezone = undefined;
  }

  if (!timezone) {
    return null;
  }

  return CITY_LIST.find((city) => city.timezone === timezone) ?? null;
}
