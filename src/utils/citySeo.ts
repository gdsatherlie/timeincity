import type { CityConfig } from "../data/cities";

export interface CitySeoCopy {
  title: string;
  description: string;
  heading: string;
  intro: string;
  paragraph: string;
}

export function getCitySeoCopy(city: CityConfig): CitySeoCopy {
  const location = [city.name, city.stateOrRegion, city.country].filter(Boolean).join(", ");

  return {
    title: `Current Time in ${location} — Weather, Sunrise & Sunset | TimeInCity`,
    description: `See the current local time in ${location}. Includes weather, sunrise and sunset times, UTC offset, and global time conversion tools.`,
    heading: `Current time in ${city.name}`,
    intro: `See the exact current time in ${location}, including the local date, time zone, weather, and sunrise and sunset times.`,
    paragraph: `Use TimeInCity to check what time it is right now in ${location}, plan calls across time zones, or share a simple link with friends and coworkers when you schedule meetings or travel.`
  };
}
