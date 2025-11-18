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
    title: `Current time in ${city.name} — TimeInCity`,
    description: `See the exact current time in ${location}, plus local date, weather, sunrise, and sunset. TimeInCity helps you quickly check what time it is in ${location} and compare time zones.`,
    heading: `Current time in ${city.name}`,
    intro: `See the exact current time in ${location}, including the local date, time zone, weather, and sunrise and sunset times.`,
    paragraph: `Use TimeInCity to check what time it is right now in ${location}, plan calls across time zones, or share a simple link with friends and coworkers when you schedule meetings or travel.`
  };
}
