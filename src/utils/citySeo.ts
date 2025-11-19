import type { CityConfig } from "../data/cities";

export function getCitySeoCopy(city: CityConfig) {
  const location = [city.name, city.region, city.country].filter(Boolean).join(", ");
  const resolvedLocation = location || city.name;

  return {
    title: `Current time in ${city.name}${city.country ? `, ${city.country}` : ""} — Weather, Sunrise & Sunset | TimeInCity`,
    description: `See the exact current time in ${resolvedLocation}, plus local weather, sunrise, and sunset. TimeInCity helps you compare time zones and plan meetings in ${resolvedLocation}.`,
    heading: `Current time in ${city.name}${city.country ? `, ${city.country}` : ""}`,
    intro: `See the exact current time in ${resolvedLocation}, including today’s date, time zone, live weather, and sunrise and sunset details.`,
    paragraph: `TimeInCity helps you quickly check what time it is in ${resolvedLocation}, compare it with other cities, and share a simple link when scheduling meetings or planning travel.`,
    location: resolvedLocation
  };
}
