export interface PopularCity {
  label: string;
  timezone: string;
}

export const POPULAR_CITIES: PopularCity[] = [
  { label: "Chicago", timezone: "America/Chicago" },
  { label: "New York", timezone: "America/New_York" },
  { label: "Los Angeles", timezone: "America/Los_Angeles" },
  { label: "London", timezone: "Europe/London" },
  { label: "Paris", timezone: "Europe/Paris" },
  { label: "Berlin", timezone: "Europe/Berlin" },
  { label: "Tokyo", timezone: "Asia/Tokyo" },
  { label: "Sydney", timezone: "Australia/Sydney" },
  { label: "Singapore", timezone: "Asia/Singapore" },
  { label: "Dubai", timezone: "Asia/Dubai" }
];
