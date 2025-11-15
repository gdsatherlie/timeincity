import React, { useEffect, useState } from "react";

// Simple, working MVP
// - Live clock
// - Time zone selector
// - 12h / 24h toggle
// - Weather + sunrise + sunset
// - Popular cities selector
// - Top banner ad + sticky footer ad
// - Site dark/light theme
// - Embed theme + size + live preview

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------
const getDefaultZone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
};

const formatTime = (date: Date, timeZone: string, use12h: boolean) =>
  new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: use12h,
    timeZone,
  }).format(date);

const formatDate = (date: Date, timeZone: string) =>
  new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "2-digit",
    timeZone,
  }).format(date);

function tzToQuery(tz: string): string | null {
  if (!tz) return null;
  if (tz.includes("/")) {
    return tz.split("/")[1].replace(/_/g, " ");
  }
  return tz.replace(/_/g, " ");
}

// -----------------------------------------------------------------------------
// Weather API (Open-Meteo)
// -----------------------------------------------------------------------------
async function geocodePlace(name: string) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    name
  )}&count=1&language=en&format=json`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return null;
  const json = await res.json();
  const r = json?.results?.[0];
  if (!r) return null;
  return {
    name: `${r.name}${r.admin1 ? ", " + r.admin1 : ""}${
      r.country ? ", " + r.country : ""
    }`,
    lat: r.latitude as number,
    lon: r.longitude as number,
    tz: r.timezone as string,
  };
}

async function fetchWeather(lat: number, lon: number, tz: string) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,precipitation,wind_speed_10m&daily=sunrise,sunset&timezone=${encodeURIComponent(
    tz
  )}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

const summarizeWeather = (current: any) => {
  if (!current) return "—";
  const c = Math.round(current.temperature_2m);
  const f = Math.round(c * 1.8 + 32);
  const w = Math.round(current.wind_speed_10m);
  const p = current.precipitation;
  return `${c}°C / ${f}°F • wind ${w} • precip ${p}`;
};

// -----------------------------------------------------------------------------
// Popular Cities
// -----------------------------------------------------------------------------
const TOP_CITIES: { name: string; slug: string; timezone: string }[] = [
  // Africa
  { name: "Abidjan", slug: "abidjan", timezone: "Africa/Abidjan" },
  { name: "Accra", slug: "accra", timezone: "Africa/Accra" },
  { name: "Addis Ababa", slug: "addis-ababa", timezone: "Africa/Addis_Ababa" },
  { name: "Algiers", slug: "algiers", timezone: "Africa/Algiers" },
  { name: "Cairo", slug: "cairo", timezone: "Africa/Cairo" },
  { name: "Cape Town", slug: "cape-town", timezone: "Africa/Johannesburg" },
  { name: "Casablanca", slug: "casablanca", timezone: "Africa/Casablanca" },
  { name: "Dakar", slug: "dakar", timezone: "Africa/Dakar" },
  { name: "Dar es Salaam", slug: "dar-es-salaam", timezone: "Africa/Dar_es_Salaam" },
  { name: "Douala", slug: "douala", timezone: "Africa/Douala" },
  { name: "Harare", slug: "harare", timezone: "Africa/Harare" },
  { name: "Johannesburg", slug: "johannesburg", timezone: "Africa/Johannesburg" },
  { name: "Kampala", slug: "kampala", timezone: "Africa/Kampala" },
  { name: "Kigali", slug: "kigali", timezone: "Africa/Kigali" },
  { name: "Kinshasa", slug: "kinshasa", timezone: "Africa/Kinshasa" },
  { name: "Lagos", slug: "lagos", timezone: "Africa/Lagos" },
  { name: "Luanda", slug: "luanda", timezone: "Africa/Luanda" },
  { name: "Nairobi", slug: "nairobi", timezone: "Africa/Nairobi" },
  { name: "Tunis", slug: "tunis", timezone: "Africa/Tunis" },

  // Asia & Middle East
  { name: "Abu Dhabi", slug: "abu-dhabi", timezone: "Asia/Dubai" },
  { name: "Ahmedabad", slug: "ahmedabad", timezone: "Asia/Kolkata" },
  { name: "Amman", slug: "amman", timezone: "Asia/Amman" },
  { name: "Ankara", slug: "ankara", timezone: "Europe/Istanbul" },
  { name: "Baghdad", slug: "baghdad", timezone: "Asia/Baghdad" },
  { name: "Baku", slug: "baku", timezone: "Asia/Baku" },
  { name: "Bangkok", slug: "bangkok", timezone: "Asia/Bangkok" },
  { name: "Beijing", slug: "beijing", timezone: "Asia/Shanghai" },
  { name: "Bengaluru", slug: "bengaluru", timezone: "Asia/Kolkata" },
  { name: "Busan", slug: "busan", timezone: "Asia/Seoul" },
  { name: "Chengdu", slug: "chengdu", timezone: "Asia/Shanghai" },
  { name: "Chennai", slug: "chennai", timezone: "Asia/Kolkata" },
  { name: "Chiang Mai", slug: "chiang-mai", timezone: "Asia/Bangkok" },
  { name: "Colombo", slug: "colombo", timezone: "Asia/Colombo" },
  { name: "Da Nang", slug: "da-nang", timezone: "Asia/Ho_Chi_Minh" },
  { name: "Damascus", slug: "damascus", timezone: "Asia/Damascus" },
  { name: "Delhi", slug: "delhi", timezone: "Asia/Kolkata" },
  { name: "Dhaka", slug: "dhaka", timezone: "Asia/Dhaka" },
  { name: "Doha", slug: "doha", timezone: "Asia/Qatar" },
  { name: "Dubai", slug: "dubai", timezone: "Asia/Dubai" },
  { name: "Guangzhou", slug: "guangzhou", timezone: "Asia/Shanghai" },
  { name: "Hanoi", slug: "hanoi", timezone: "Asia/Ho_Chi_Minh" },
  { name: "Ho Chi Minh City", slug: "ho-chi-minh-city", timezone: "Asia/Ho_Chi_Minh" },
  { name: "Hong Kong", slug: "hong-kong", timezone: "Asia/Hong_Kong" },
  { name: "Hyderabad", slug: "hyderabad", timezone: "Asia/Kolkata" },
  { name: "Islamabad", slug: "islamabad", timezone: "Asia/Karachi" },
  { name: "Istanbul", slug: "istanbul", timezone: "Europe/Istanbul" },
  { name: "Jakarta", slug: "jakarta", timezone: "Asia/Jakarta" },
  { name: "Jeddah", slug: "jeddah", timezone: "Asia/Riyadh" },
  { name: "Karachi", slug: "karachi", timezone: "Asia/Karachi" },
  { name: "Kolkata", slug: "kolkata", timezone: "Asia/Kolkata" },
  { name: "Kuala Lumpur", slug: "kuala-lumpur", timezone: "Asia/Kuala_Lumpur" },
  { name: "Kuwait City", slug: "kuwait-city", timezone: "Asia/Kuwait" },
  { name: "Lahore", slug: "lahore", timezone: "Asia/Karachi" },
  { name: "Manila", slug: "manila", timezone: "Asia/Manila" },
  { name: "Mumbai", slug: "mumbai", timezone: "Asia/Kolkata" },
  { name: "Nagoya", slug: "nagoya", timezone: "Asia/Tokyo" },
  { name: "New Delhi", slug: "new-delhi", timezone: "Asia/Kolkata" },
  { name: "Osaka", slug: "osaka", timezone: "Asia/Tokyo" },
  { name: "Riyadh", slug: "riyadh", timezone: "Asia/Riyadh" },
  { name: "Seoul", slug: "seoul", timezone: "Asia/Seoul" },
  { name: "Shanghai", slug: "shanghai", timezone: "Asia/Shanghai" },
  { name: "Shenzhen", slug: "shenzhen", timezone: "Asia/Shanghai" },
  { name: "Singapore", slug: "singapore", timezone: "Asia/Singapore" },
  { name: "Taipei", slug: "taipei", timezone: "Asia/Taipei" },
  { name: "Tehran", slug: "tehran", timezone: "Asia/Tehran" },
  { name: "Tel Aviv", slug: "tel-aviv", timezone: "Asia/Jerusalem" },
  { name: "Tokyo", slug: "tokyo", timezone: "Asia/Tokyo" },
  { name: "Ulaanbaatar", slug: "ulaanbaatar", timezone: "Asia/Ulaanbaatar" },
  { name: "Yangon", slug: "yangon", timezone: "Asia/Yangon" },

  // Europe
  { name: "Amsterdam", slug: "amsterdam", timezone: "Europe/Amsterdam" },
  { name: "Athens", slug: "athens", timezone: "Europe/Athens" },
  { name: "Barcelona", slug: "barcelona", timezone: "Europe/Madrid" },
  { name: "Belgrade", slug: "belgrade", timezone: "Europe/Belgrade" },
  { name: "Berlin", slug: "berlin", timezone: "Europe/Berlin" },
  { name: "Birmingham", slug: "birmingham", timezone: "Europe/London" },
  { name: "Bratislava", slug: "bratislava", timezone: "Europe/Bratislava" },
  { name: "Brussels", slug: "brussels", timezone: "Europe/Brussels" },
  { name: "Bucharest", slug: "bucharest", timezone: "Europe/Bucharest" },
  { name: "Budapest", slug: "budapest", timezone: "Europe/Budapest" },
  { name: "Cologne", slug: "cologne", timezone: "Europe/Berlin" },
  { name: "Copenhagen", slug: "copenhagen", timezone: "Europe/Copenhagen" },
  { name: "Dublin", slug: "dublin", timezone: "Europe/Dublin" },
  { name: "Edinburgh", slug: "edinburgh", timezone: "Europe/London" },
  { name: "Frankfurt", slug: "frankfurt", timezone: "Europe/Berlin" },
  { name: "Geneva", slug: "geneva", timezone: "Europe/Zurich" },
  { name: "Glasgow", slug: "glasgow", timezone: "Europe/London" },
  { name: "Hamburg", slug: "hamburg", timezone: "Europe/Berlin" },
  { name: "Helsinki", slug: "helsinki", timezone: "Europe/Helsinki" },
  { name: "Kyiv", slug: "kyiv", timezone: "Europe/Kyiv" },
  { name: "Lisbon", slug: "lisbon", timezone: "Europe/Lisbon" },
  { name: "London", slug: "london", timezone: "Europe/London" },
  { name: "Lyon", slug: "lyon", timezone: "Europe/Paris" },
  { name: "Madrid", slug: "madrid", timezone: "Europe/Madrid" },
  { name: "Manchester", slug: "manchester", timezone: "Europe/London" },
  { name: "Marseille", slug: "marseille", timezone: "Europe/Paris" },
  { name: "Milan", slug: "milan", timezone: "Europe/Rome" },
  { name: "Munich", slug: "munich", timezone: "Europe/Berlin" },
  { name: "Naples", slug: "naples", timezone: "Europe/Rome" },
  { name: "Oslo", slug: "oslo", timezone: "Europe/Oslo" },
  { name: "Paris", slug: "paris", timezone: "Europe/Paris" },
  { name: "Prague", slug: "prague", timezone: "Europe/Prague" },
  { name: "Reykjavik", slug: "reykjavik", timezone: "Atlantic/Reykjavik" },
  { name: "Riga", slug: "riga", timezone: "Europe/Riga" },
  { name: "Rome", slug: "rome", timezone: "Europe/Rome" },
  { name: "Sofia", slug: "sofia", timezone: "Europe/Sofia" },
  { name: "Stockholm", slug: "stockholm", timezone: "Europe/Stockholm" },
  { name: "Tallinn", slug: "tallinn", timezone: "Europe/Tallinn" },
  { name: "Vienna", slug: "vienna", timezone: "Europe/Vienna" },
  { name: "Vilnius", slug: "vilnius", timezone: "Europe/Vilnius" },
  { name: "Warsaw", slug: "warsaw", timezone: "Europe/Warsaw" },
  { name: "Zurich", slug: "zurich", timezone: "Europe/Zurich" },

  // North America
  { name: "Atlanta", slug: "atlanta", timezone: "America/New_York" },
  { name: "Austin", slug: "austin", timezone: "America/Chicago" },
  { name: "Baltimore", slug: "baltimore", timezone: "America/New_York" },
  { name: "Boston", slug: "boston", timezone: "America/New_York" },
  { name: "Calgary", slug: "calgary", timezone: "America/Edmonton" },
  { name: "Charlotte", slug: "charlotte", timezone: "America/New_York" },
  { name: "Chicago", slug: "chicago", timezone: "America/Chicago" },
  { name: "Cincinnati", slug: "cincinnati", timezone: "America/New_York" },
  { name: "Cleveland", slug: "cleveland", timezone: "America/New_York" },
  { name: "Columbus", slug: "columbus", timezone: "America/New_York" },
  { name: "Dallas", slug: "dallas", timezone: "America/Chicago" },
  { name: "Denver", slug: "denver", timezone: "America/Denver" },
  { name: "Detroit", slug: "detroit", timezone: "America/Detroit" },
  { name: "Edmonton", slug: "edmonton", timezone: "America/Edmonton" },
  { name: "Guadalajara", slug: "guadalajara", timezone: "America/Mexico_City" },
  { name: "Houston", slug: "houston", timezone: "America/Chicago" },
  { name: "Indianapolis", slug: "indianapolis", timezone: "America/Indiana/Indianapolis" },
  { name: "Jacksonville", slug: "jacksonville", timezone: "America/New_York" },
  { name: "Kansas City", slug: "kansas-city", timezone: "America/Chicago" },
  { name: "Las Vegas", slug: "las-vegas", timezone: "America/Los_Angeles" },
  { name: "Los Angeles", slug: "los-angeles", timezone: "America/Los_Angeles" },
  { name: "Memphis", slug: "memphis", timezone: "America/Chicago" },
  { name: "Mexico City", slug: "mexico-city", timezone: "America/Mexico_City" },
  { name: "Miami", slug: "miami", timezone: "America/New_York" },
  { name: "Milwaukee", slug: "milwaukee", timezone: "America/Chicago" },
  { name: "Minneapolis", slug: "minneapolis", timezone: "America/Chicago" },
  { name: "Monterrey", slug: "monterrey", timezone: "America/Monterrey" },
  { name: "Montreal", slug: "montreal", timezone: "America/Toronto" },
  { name: "Nashville", slug: "nashville", timezone: "America/Chicago" },
  { name: "New Orleans", slug: "new-orleans", timezone: "America/Chicago" },
  { name: "New York", slug: "new-york", timezone: "America/New_York" },
  { name: "Oklahoma City", slug: "oklahoma-city", timezone: "America/Chicago" },
  { name: "Orlando", slug: "orlando", timezone: "America/New_York" },
  { name: "Ottawa", slug: "ottawa", timezone: "America/Toronto" },
  { name: "Philadelphia", slug: "philadelphia", timezone: "America/New_York" },
  { name: "Phoenix", slug: "phoenix", timezone: "America/Phoenix" },
  { name: "Pittsburgh", slug: "pittsburgh", timezone: "America/New_York" },
  { name: "Portland", slug: "portland", timezone: "America/Los_Angeles" },
  { name: "Quebec City", slug: "quebec-city", timezone: "America/Toronto" },
  { name: "Raleigh", slug: "raleigh", timezone: "America/New_York" },
  { name: "Salt Lake City", slug: "salt-lake-city", timezone: "America/Denver" },
  { name: "San Antonio", slug: "san-antonio", timezone: "America/Chicago" },
  { name: "San Diego", slug: "san-diego", timezone: "America/Los_Angeles" },
  { name: "San Francisco", slug: "san-francisco", timezone: "America/Los_Angeles" },
  { name: "San Jose", slug: "san-jose", timezone: "America/Los_Angeles" },
  { name: "Santa Fe", slug: "santa-fe", timezone: "America/Denver" },
  { name: "Seattle", slug: "seattle", timezone: "America/Los_Angeles" },
  { name: "St. Louis", slug: "st-louis", timezone: "America/Chicago" },
  { name: "Tijuana", slug: "tijuana", timezone: "America/Tijuana" },
  { name: "Toronto", slug: "toronto", timezone: "America/Toronto" },
  { name: "Vancouver", slug: "vancouver", timezone: "America/Vancouver" },
  { name: "Washington, D.C.", slug: "washington-dc", timezone: "America/New_York" },

  // South America
  { name: "Bogota", slug: "bogota", timezone: "America/Bogota" },
  { name: "Brasilia", slug: "brasilia", timezone: "America/Sao_Paulo" },
  { name: "Buenos Aires", slug: "buenos-aires", timezone: "America/Argentina/Buenos_Aires" },
  { name: "Caracas", slug: "caracas", timezone: "America/Caracas" },
  { name: "Lima", slug: "lima", timezone: "America/Lima" },
  { name: "Montevideo", slug: "montevideo", timezone: "America/Montevideo" },
  { name: "Quito", slug: "quito", timezone: "America/Guayaquil" },
  { name: "Rio de Janeiro", slug: "rio-de-janeiro", timezone: "America/Sao_Paulo" },
  { name: "Salvador", slug: "salvador", timezone: "America/Bahia" },
  { name: "Santiago", slug: "santiago", timezone: "America/Santiago" },
  { name: "Sao Paulo", slug: "sao-paulo", timezone: "America/Sao_Paulo" },

  // Oceania
  { name: "Adelaide", slug: "adelaide", timezone: "Australia/Adelaide" },
  { name: "Auckland", slug: "auckland", timezone: "Pacific/Auckland" },
  { name: "Brisbane", slug: "brisbane", timezone: "Australia/Brisbane" },
  { name: "Canberra", slug: "canberra", timezone: "Australia/Sydney" },
  { name: "Christchurch", slug: "christchurch", timezone: "Pacific/Auckland" },
  { name: "Gold Coast", slug: "gold-coast", timezone: "Australia/Brisbane" },
  { name: "Melbourne", slug: "melbourne", timezone: "Australia/Melbourne" },
  { name: "Perth", slug: "perth", timezone: "Australia/Perth" },
  { name: "Sydney", slug: "sydney", timezone: "Australia/Sydney" },
  { name: "Wellington", slug: "wellington", timezone: "Pacific/Auckland" },
];
// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

type TimeInCityProps = {
  initialTz?: string;
  initialLabel?: string;
};

type EmbedSizeId = "sm" | "md" | "lg";

type EmbedSize = {
  id: EmbedSizeId;
  label: string;
  width: number;
  height: number;
};

const EMBED_SIZES: EmbedSize[] = [
  { id: "sm", label: "Small", width: 320, height: 180 },
  { id: "md", label: "Medium", width: 480, height: 270 },
  { id: "lg", label: "Large", width: 640, height: 360 }
];

const fallbackZones = [
  "UTC",
  "America/Chicago",
  "America/New_York",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Asia/Tokyo"
];

export default function TimeInCity({ initialTz, initialLabel }: TimeInCityProps) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [embedTheme, setEmbedTheme] = useState<"dark" | "light">("dark");
  const [embedSizeId, setEmbedSizeId] = useState<EmbedSizeId>("md");

  const [tz, setTz] = useState<string>(initialTz || getDefaultZone());
  const [now, setNow] = useState<Date>(new Date());
  const [use12h, setUse12h] = useState(false);

  const [locationName, setLocationName] = useState(initialLabel || "");
  const [weather, setWeather] = useState<any>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  const activeEmbedSize =
    EMBED_SIZES.find((s) => s.id === embedSizeId) || EMBED_SIZES[1];

  const previewHeight = Math.round(activeEmbedSize.height * 0.6);

  // Clock tick
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  // Weather fetch whenever tz changes
  useEffect(() => {
    const query = tzToQuery(tz);
    if (!query) return;

    (async () => {
      setWeatherLoading(true);
      const geo = await geocodePlace(query);
      if (!geo) {
        setWeather(null);
        setLocationName(query);
        setWeatherLoading(false);
        return;
      }
      setLocationName(geo.name);
      const w = await fetchWeather(geo.lat, geo.lon, geo.tz);
      setWeather(w);
      setWeatherLoading(false);
    })();
  }, [tz]);

  const zones: string[] =
    (Intl as any)?.supportedValuesOf?.("timeZone") || fallbackZones;

  const displayName = locationName || tz.replace(/_/g, " ");

  const containerClass = `min-h-screen flex flex-col items-center px-4 ${
    theme === "dark"
      ? "bg-neutral-950 text-neutral-50"
      : "bg-white text-neutral-900"
  }`;
// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

type TimeInCityProps = {
  initialTz?: string;
  initialLabel?: string;
};

type EmbedSizeId = "sm" | "md" | "lg";

type EmbedSize = {
  id: EmbedSizeId;
  label: string;
  width: number;
  height: number;
};

const EMBED_SIZES: EmbedSize[] = [
  { id: "sm", label: "Small", width: 320, height: 180 },
  { id: "md", label: "Medium", width: 480, height: 270 },
  { id: "lg", label: "Large", width: 640, height: 360 }
];

const fallbackZones = [
  "UTC",
  "America/Chicago",
  "America/New_York",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Asia/Tokyo"
];

export default function TimeInCity({ initialTz, initialLabel }: TimeInCityProps) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [embedTheme, setEmbedTheme] = useState<"dark" | "light">("dark");
  const [embedSizeId, setEmbedSizeId] = useState<EmbedSizeId>("md");

  const [tz, setTz] = useState<string>(initialTz || getDefaultZone());
  const [now, setNow] = useState<Date>(new Date());
  const [use12h, setUse12h] = useState(false);

  const [locationName, setLocationName] = useState(initialLabel || "");
  const [weather, setWeather] = useState<any>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  const activeEmbedSize =
    EMBED_SIZES.find((s) => s.id === embedSizeId) || EMBED_SIZES[1];

  const previewHeight = Math.round(activeEmbedSize.height * 0.6);

  // Clock tick
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  // Weather fetch whenever tz changes
  useEffect(() => {
    const query = tzToQuery(tz);
    if (!query) return;

    (async () => {
      setWeatherLoading(true);
      const geo = await geocodePlace(query);
      if (!geo) {
        setWeather(null);
        setLocationName(query);
        setWeatherLoading(false);
        return;
      }
      setLocationName(geo.name);
      const w = await fetchWeather(geo.lat, geo.lon, geo.tz);
      setWeather(w);
      setWeatherLoading(false);
    })();
  }, [tz]);

  const zones: string[] =
    (Intl as any)?.supportedValuesOf?.("timeZone") || fallbackZones;

  const displayName = locationName || tz.replace(/_/g, " ");

  const containerClass = `min-h-screen flex flex-col items-center px-4 ${
    theme === "dark"
      ? "bg-neutral-950 text-neutral-50"
      : "bg-white text-neutral-900"
  }`;
  return (
    <div className={containerClass}>
      {/* Top Banner Ad */}
      <div
        className={`w-full text-center py-2 text-xs sticky top-0 z-50 ring-1 ${
          theme === "dark"
            ? "bg-neutral-900/80 text-neutral-200 ring-neutral-800"
            : "bg-white text-neutral-900 ring-neutral-200"
        }`}
      >
        Top Banner Ad (728×90)
      </div>

      <header className="w-full max-w-5xl py-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">TimeInCity</h1>
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="text-xs px-3 py-1 rounded-full border border-neutral-700 bg-neutral-900/60 hover:bg-neutral-800"
        >
          {theme === "dark" ? "Switch to light" : "Switch to dark"}
        </button>
      </header>

      <main className="w-full max-w-5xl pb-16">
        {/* Clock Section */}
        <section
          className={`rounded-3xl p-6 shadow-xl ring-1 ${
            theme === "dark"
              ? "bg-neutral-900/60 ring-neutral-800"
              : "bg-white ring-neutral-200"
          }`}
        >
          <p className="text-neutral-400 text-sm">Current time in</p>
          <h2 className="text-3xl sm:text-4xl font-semibold mt-1">
            {displayName}
          </h2>

          <div className="mt-6">
            <div className="text-[13vw] leading-none sm:text-[8rem] font-bold tabular-nums select-none">
              {formatTime(now, tz, use12h)}
            </div>
            <div className="text-neutral-300 text-lg mt-2">
              {formatDate(now, tz)}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <select
              className="bg-neutral-800 text-neutral-50 rounded-xl px-4 py-3 ring-1 ring-neutral-700"
              value={tz}
              onChange={(e) => setTz(e.target.value)}
            >
              {zones.map((z) => (
                <option key={z} value={z}>
                  {z}
                </option>
              ))}
            </select>

            <button
              onClick={() => setUse12h((v) => !v)}
              className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-100 text-sm ring-1 ring-neutral-700 hover:bg-neutral-700"
            >
              {use12h ? "Switch to 24-hour" : "Switch to 12-hour"}
            </button>
          </div>

          <div className="mt-6 rounded-2xl bg-neutral-800/70 ring-1 ring-neutral-700 p-4 text-center text-neutral-400 text-sm">
            Ad slot (970×250 / responsive)
          </div>
        </section>

        {/* Weather + sunrise/sunset */}
        <section className="mt-6 grid sm:grid-cols-3 gap-4">
          <div
            className={`rounded-2xl ring-1 p-5 ${
              theme === "dark"
                ? "bg-neutral-900/60 ring-neutral-800"
                : "bg-white ring-neutral-200"
            }`}
          >
            <div className="text-lg font-semibold">Weather in {displayName}</div>
            <div className="text-neutral-400 mt-1 text-sm">
              {locationName
                ? locationName
                : "Select any time zone to see weather."}
            </div>
            <div className="mt-2 text-sm">
              {weatherLoading ? (
                <div className="text-neutral-400">Loading…</div>
              ) : weather?.current ? (
                <div
                  className={
                    theme === "dark" ? "text-neutral-200" : "text-neutral-700"
                  }
                >
                  {summarizeWeather(weather.current)}
                </div>
              ) : (
                <div className="text-neutral-500">No data yet.</div>
              )}
            </div>
          </div>

          <div
            className={`rounded-2xl ring-1 p-5 ${
              theme === "dark"
                ? "bg-neutral-900/60 ring-neutral-800"
                : "bg-white ring-neutral-200"
            }`}
          >
            <div className="text-lg font-semibold">Sunrise</div>
            <div className="mt-2 text-neutral-300 text-sm">
              {weather?.daily?.sunrise?.[0]
                ? new Date(weather.daily.sunrise[0]).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                  })
                : "—"}
            </div>
          </div>

          <div
            className={`rounded-2xl ring-1 p-5 ${
              theme === "dark"
                ? "bg-neutral-900/60 ring-neutral-800"
                : "bg-white ring-neutral-200"
            }`}
          >
            <div className="text-lg font-semibold">Sunset</div>
            <div className="mt-2 text-neutral-300 text-sm">
              {weather?.daily?.sunset?.[0]
                ? new Date(weather.daily.sunset[0]).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                  })
                : "—"}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section
          id="faq"
          className={`mt-12 rounded-3xl ring-1 p-6 ${
            theme === "dark"
              ? "bg-neutral-900/60 ring-neutral-800"
              : "bg-white ring-neutral-200"
          }`}
        >
          <h3 className="text-2xl font-semibold">FAQ</h3>
          <div className="mt-4 space-y-4 text-sm text-neutral-400">
            <details>
              <summary className="cursor-pointer text-neutral-200 font-medium">
                Where does the time come from?
              </summary>
              <div className="mt-2 leading-6">
                The clock runs in your browser using the Intl API and your
                selected IANA time zone.
              </div>
            </details>
            <details>
              <summary className="cursor-pointer text-neutral-200 font-medium">
                How do I see weather?
              </summary>
              <div className="mt-2 leading-6">
                Just pick any time zone (like America/Chicago or Europe/London)
                from the dropdown. Weather, sunrise, and sunset will update
                automatically.
              </div>
            </details>
          </div>
        </section>

        {/* Popular cities */}
        <section
          aria-label="Popular cities"
          className={`mt-10 rounded-3xl ring-1 p-6 ${
            theme === "dark"
              ? "bg-neutral-900/60 ring-neutral-800"
              : "bg-white ring-neutral-200"
          }`}
        >
          <h3 className="text-sm font-semibold tracking-[0.25em] uppercase text-neutral-400 mb-4">
            Popular cities
          </h3>

          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-neutral-100">
            {[...TOP_CITIES]
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((city) => (
                <button
                  key={city.slug}
                  type="button"
                  onClick={() => {
                    setTz(city.timezone);
                    setLocationName(city.name);
                  }}
                  className="hover:text-white hover:underline cursor-pointer text-left"
                >
                  {city.name}
                </button>
              ))}
          </div>
        </section>

        {/* Embed snippet */}
        <section
          className={`mt-12 rounded-3xl ring-1 p-6 ${
            theme === "dark"
              ? "bg-neutral-900/60 ring-neutral-800"
              : "bg-white ring-neutral-200"
          }`}
        >
          <h3 className="text-xl font-semibold mb-3">Embed this clock</h3>

          <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-neutral-400">Embed theme:</span>
              <button
                type="button"
                onClick={() => setEmbedTheme("dark")}
                className={`px-3 py-1 rounded-full border text-xs ${
                  embedTheme === "dark"
                    ? "bg-neutral-100 text-neutral-900 border-neutral-300"
                    : "bg-neutral-800 text-neutral-100 border-neutral-600"
                }`}
              >
                Dark
              </button>
              <button
                type="button"
                onClick={() => setEmbedTheme("light")}
                className={`px-3 py-1 rounded-full border text-xs ${
                  embedTheme === "light"
                    ? "bg-neutral-100 text-neutral-900 border-neutral-300"
                    : "bg-neutral-800 text-neutral-100 border-neutral-600"
                }`}
              >
                Light
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-neutral-400">Size:</span>
              {EMBED_SIZES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setEmbedSizeId(s.id)}
                  className={`px-3 py-1 rounded-full border text-xs ${
                    embedSizeId === s.id
                      ? "bg-neutral-100 text-neutral-900 border-neutral-300"
                      : "bg-neutral-800 text-neutral-100 border-neutral-600"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <p className="text-neutral-400 text-sm mb-3">
            Copy &amp; paste this iframe into any website:
          </p>
          <pre className="bg-neutral-800 text-neutral-100 p-4 rounded-xl text-xs overflow-x-auto select-all">
{`<iframe
  src="https://timeincity.com/embed?tz=${encodeURIComponent(tz)}&theme=${embedTheme}"
  width="${activeEmbedSize.width}"
  height="${activeEmbedSize.height}"
  style="border:0;border-radius:12px;overflow:hidden"
></iframe>`}
          </pre>

          <p className="text-neutral-400 text-xs mt-4 mb-2">Live preview</p>
          <div
            className={`rounded-2xl flex items-center justify-center text-sm tabular-nums border ${
              embedTheme === "dark"
                ? "bg-neutral-900 text-neutral-50 border-neutral-700"
                : "bg-white text-neutral-900 border-neutral-200"
            }`}
            style={{
              width: activeEmbedSize.width,
              height: previewHeight
            }}
          >
            {formatTime(now, tz, true)} • {tz}
          </div>
        </section>

        <footer className="py-10 text-center text-neutral-500 text-sm">
          © {new Date().getFullYear()} TimeInCity • Current time & weather in any
          city.
        </footer>
      </main>

      {/* Sticky footer ad */}
      <div
        className={`fixed bottom-0 left-0 right-0 text-center py-3 text-sm ring-1 z-50 ${
          theme === "dark"
            ? "bg-neutral-900/90 text-neutral-300 ring-neutral-800"
            : "bg-white text-neutral-900 ring-neutral-200"
        }`}
      >
        Sticky Footer Ad (970×90)
      </div>
    </div>
  );
}

