import { DateTime } from "luxon";

import type { CityConfig } from "../data/cities";
import type { CityMeta } from "../types/cityTypes";

function formatUtcOffset(minutes: number): string {
  const sign = minutes >= 0 ? "+" : "-";
  const abs = Math.abs(minutes);
  const hours = Math.floor(abs / 60)
    .toString()
    .padStart(2, "0");
  const mins = (abs % 60).toString().padStart(2, "0");
  return `UTC${sign}${hours}:${mins}`;
}

function buildOffsetLabel(timezone: string): { label: string; observesDst: boolean } {
  const january = DateTime.fromObject({ month: 1, day: 1 }, { zone: timezone });
  const july = DateTime.fromObject({ month: 7, day: 1 }, { zone: timezone });
  const janOffset = january.isValid ? january.offset : 0;
  const julOffset = july.isValid ? july.offset : janOffset;
  const observesDst = janOffset !== julOffset;

  if (observesDst) {
    const winter = janOffset < julOffset ? janOffset : julOffset;
    const summer = janOffset < julOffset ? julOffset : janOffset;
    return {
      label: `${formatUtcOffset(winter)} in winter / ${formatUtcOffset(summer)} in summer`,
      observesDst
    };
  }

  return { label: formatUtcOffset(janOffset), observesDst };
}

export function toCityMeta(city: CityConfig): CityMeta {
  const { label, observesDst } = buildOffsetLabel(city.timezone);
  return {
    slug: city.slug,
    name: city.name,
    region: city.region ?? "",
    country: city.country,
    lat: city.lat,
    lon: city.lon,
    timezoneLabel: city.timezone,
    utcOffsetLabel: label,
    observesDst
  };
}
