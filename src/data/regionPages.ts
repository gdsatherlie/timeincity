import type { RegionSlug } from "./cities";

export interface RegionPageContent {
  slug: RegionSlug;
  title: string;
  heading: string;
  description: string;
}

export const REGION_PAGES: Record<RegionSlug, RegionPageContent> = {
  "all": {
    slug: "all",
    title: "All Cities — Worldwide Time & Weather",
    heading: "All Cities — Worldwide Time & Weather",
    description:
      "Explore the current time and weather in more than 500 cities around the globe. From major world capitals to regional hubs, TimeInCity provides accurate local time, UTC offsets, sunrise/sunset, and weather data for every location. Browse alphabetically or filter by continent to find exactly what you need."
  },
  "united-states": {
    slug: "united-states",
    title: "United States Time Zones — TimeInCity",
    heading: "United States — Local time across every region",
    description:
      "The United States spans multiple time zones, from Eastern Time to Hawaii Time. This page highlights major U.S. cities with accurate local times, weather updates, and sunrise/sunset information. Use it to coordinate meetings, plan travel, or explore regional time differences across the country."
  },
  "europe": {
    slug: "europe",
    title: "Current Time in Europe — TimeInCity",
    heading: "Europe — Current time across major cities",
    description:
      "Europe includes some of the world’s most visited cities and spans several time zones from UTC to Eastern European Time. See live local times, weather conditions, and DST shifts across Europe’s capitals and major destinations."
  },
  "asia": {
    slug: "asia",
    title: "Current Time in Asia — TimeInCity",
    heading: "Asia — From the Middle East to Tokyo",
    description:
      "Asia is the world’s largest continent with diverse time zones stretching from the Middle East to Tokyo. View accurate local times, weather updates, and sunrise/sunset data for major Asian cities."
  },
  "south-america": {
    slug: "south-america",
    title: "Current Time in South America — TimeInCity",
    heading: "South America — Tropical mornings to Andean nights",
    description:
      "South America includes tropical regions, mountain cities, and southern latitudes with varied time zones. Explore current times, weather data, and daylight information for key South American locations."
  },
  "africa": {
    slug: "africa",
    title: "Current Time in Africa — TimeInCity",
    heading: "Africa — Time across a rapidly growing continent",
    description:
      "Africa spans several time zones and features dynamic climates. View accurate local times and weather conditions across its largest and fastest-growing cities."
  },
  "oceania": {
    slug: "oceania",
    title: "Current Time in Oceania — TimeInCity",
    heading: "Oceania — Australia, New Zealand, and Pacific hubs",
    description:
      "Oceania includes cities in Australia, New Zealand, and Pacific Island nations. Explore major cities across the region with full time zone, weather, and sunrise/sunset data."
  }
};
