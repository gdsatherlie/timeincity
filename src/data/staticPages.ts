export interface StaticPageContent {
  slug: string;
  path: string;
  title: string;
  description: string;
  heading: string;
  body: string[];
}

export const STATIC_PAGES: StaticPageContent[] = [
  {
    slug: "world-time-converter",
    path: "/world-time-converter",
    title: "World Time Converter | Convert Time Between Cities Instantly",
    description:
      "Convert time between any two cities or time zones instantly. See hour differences, DST adjustments, and accurate global time conversions.",
    heading: "World Time Converter",
    body: [
      "Convert time instantly between any two cities or time zones. Whether you're planning a meeting, scheduling a flight, or coordinating across continents, this tool helps you see exactly what time it will be somewhere else.",
      "Simply select your starting city and destination city, and the converter will show the current time in both places, along with the difference in hours. This makes it easy to plan across time zones without confusion or calculation.",
      "This tool supports all major world cities and accounts for daylight saving time changes automatically."
    ]
  },
  {
    slug: "time-zone-map",
    path: "/time-zone-map",
    title: "World Time Zone Map & UTC Offsets | TimeInCity",
    description:
      "Explore world time zones, UTC offsets, and how regions are divided across the globe. Includes explanations and tools for understanding world time.",
    heading: "World Time Zone Map",
    body: [
      "Time zones divide the world into regions where clocks show the same time. They help keep local schedules aligned with daylight hours, especially sunrise and sunset.",
      "Explore how the world is organized by UTC offsets, why Greenwich defines zero, and how offset differences affect travel, streaming, and remote work.",
      "Understanding time zones is essential when traveling, coordinating work across countries, or connecting with friends and family around the globe."
    ]
  },
  {
    slug: "what-time-is-it-around-the-world",
    path: "/what-time-is-it-around-the-world",
    title: "What Time Is It Around the World Right Now? | Global Current Times",
    description:
      "See what time it is anywhere in the world. Explore global time differences, major cities, and current local times worldwide.",
    heading: "What Time Is It Around the World?",
    body: [
      "Curious what time it is across the globe right now? This guide explains how drastically time can vary from place to place, from early morning to late night — all at the same moment.",
      "Different parts of the world use unique time zones, often offset by whole hours, but sometimes by half-hour or even quarter-hour increments.",
      "Use TimeInCity to compare cities instantly and understand how the world stays connected."
    ]
  },
  {
    slug: "why-time-zones-exist",
    path: "/why-time-zones-exist",
    title: "Why Time Zones Exist — History & Explanation",
    description:
      "Learn why time zones were created, how they work, and how global timekeeping evolved from solar time to modern UTC.",
    heading: "Why Time Zones Exist",
    body: [
      "Before time zones, local solar time ruled — meaning noon occurred when the sun was highest in the sky for each town.",
      "Railroads, telegraphs, and global commerce required a unified time system, which led to standard offsets from UTC in the late 1800s.",
      "This page explores the history of timekeeping, the international agreements that created time zones, and why modern life depends on accurate global timing."
    ]
  },
  {
    slug: "daylight-saving-time-guide",
    path: "/daylight-saving-time",
    title: "Daylight Saving Time Explained | DST Start & End Dates",
    description:
      "Understand Daylight Saving Time, global schedules, and how clock changes affect time zones and travel.",
    heading: "Daylight Saving Time (DST) Guide",
    body: [
      "Daylight Saving Time shifts clocks forward by one hour during warmer months to extend evening daylight. Not all regions observe DST, and the start/end dates vary by country.",
      "Learn why some countries use it, when it starts and ends this year, and how DST affects world clocks.",
      "If you travel, work across time zones, or coordinate events globally, understanding DST is essential."
    ]
  },
  {
    slug: "utc-explained",
    path: "/utc-explained",
    title: "What Is UTC? Coordinated Universal Time Explained",
    description:
      "Understand UTC, the world's time standard. Learn how UTC offsets work and how modern timekeeping uses Coordinated Universal Time.",
    heading: "What Is UTC?",
    body: [
      "UTC — Coordinated Universal Time — is the global time standard used by airlines, governments, servers, satellites, and world clocks.",
      "UTC does not change for daylight saving time and acts as the baseline for every other time zone.",
      "Every city on TimeInCity ultimately maps back to UTC, ensuring accurate, synchronized clocks worldwide."
    ]
  }
];
