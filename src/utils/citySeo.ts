import type { CityConfig } from "../data/cities";
import { formatCityDisplay } from "./formatCityDisplay";

export function getCitySeoCopy(city: CityConfig) {
  const resolvedLocation = formatCityDisplay(city) || city.name;

  return {
    title: `Current Time in ${resolvedLocation} — Live Clock & Weather | TimeInCity`,
    description: `See the current local time in ${resolvedLocation} with a live clock, weather, sunrise, sunset, day length, time difference to major cities, and a quick read on whether it is a good time to call.`,
    heading: `Current time in ${resolvedLocation}`,
    intro: `See the exact current time in ${resolvedLocation}, including the local date, time zone, weather, and sunrise and sunset times.`,
    paragraph: `Use TimeInCity to check what time it is right now in ${resolvedLocation}, plan calls across time zones, or share a simple link when you schedule meetings or travel.`,
    location: resolvedLocation
  };
}
