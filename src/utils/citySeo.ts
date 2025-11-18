import type { CityConfig } from "../data/cities";

export function getCitySeoCopy(city: CityConfig) {
  const location = [city.name, city.region, city.country].filter(Boolean).join(", ");
  const resolvedLocation = location || city.name;

  return {
    title: `Current time in ${city.name}${city.country ? `, ${city.country}` : ""} — TimeInCity`,
    description: `See the current local time in ${resolvedLocation}, plus weather, sunrise, and sunset times. Compare time zones and share direct links with TimeInCity.`,
    heading: `Current time in ${city.name}`,
    intro: `See the exact current time in ${resolvedLocation}, including the local date, time zone, weather, and sunrise and sunset times.`,
    paragraph: `Use TimeInCity to check what time it is right now in ${resolvedLocation}, plan calls across time zones, or share a simple link with teammates when you schedule meetings or travel.`,
    location: resolvedLocation
  };
}
