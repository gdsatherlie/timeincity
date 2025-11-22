import { DateTime } from "luxon";
import { useEffect, useMemo, useState } from "react";

import type { CityConfig } from "../../data/cities";
import { CITY_LIST } from "../../data/cities";
import { CitySeoSection } from "../../components/CitySeoSection";
import { CompareTimes } from "../../components/CompareTimes";
import { MeetingPlanner } from "../../components/MeetingPlanner";
import { EmbedConfigurator } from "../../components/EmbedConfigurator";
import { WeatherCard } from "../../components/WeatherCard";
import { formatCityDisplay } from "../../utils/formatCityDisplay";
import { buildCityCopy } from "../../lib/cityCopy";
import { useCityPois } from "../../hooks/useCityPois";
import { CityPoiSection } from "../../components/CityPoiSection";
import { toCityMeta } from "../../utils/cityMeta";
import type { CityMeta } from "../../types/cityTypes";

interface CityPageProps {
  city: CityConfig;
  onSelectCity: (slug: string) => void;
}

interface CityWeather {
  temperatureC: number;
  temperatureF: number;
  precipitation: number;
  windSpeed: number;
  sunrise: string;
  sunset: string;
  outlook: Array<{ date: string; sunrise: string; sunset: string; dayLengthMinutes: number }>;
}

const REFERENCE_CITIES = [
  { label: "New York", timezone: "America/New_York" },
  { label: "London", timezone: "Europe/London" },
  { label: "Tokyo", timezone: "Asia/Tokyo" },
  { label: "Sydney", timezone: "Australia/Sydney" },
  { label: "Los Angeles", timezone: "America/Los_Angeles" },
  { label: "Dubai", timezone: "Asia/Dubai" }
];

function formatOffset(minutes: number): string {
  const sign = minutes >= 0 ? "+" : "-";
  const absMinutes = Math.abs(minutes);
  const hours = String(Math.floor(absMinutes / 60)).padStart(2, "0");
  const mins = String(absMinutes % 60).padStart(2, "0");
  return `UTC${sign}${hours}:${mins}`;
}

const BUSINESS_HOURS_START = 9;
const BUSINESS_HOURS_END = 17;

function getCallStatus(now: { hour: number }, displayName: string) {
  const hour = now.hour;

  if (hour >= BUSINESS_HOURS_START && hour < BUSINESS_HOURS_END) {
    return {
      label: "Within normal business hours",
      tone: "good",
      message: `This is generally a good time to schedule calls or meetings in ${displayName}.`
    } as const;
  }

  if (hour >= 7 && hour < BUSINESS_HOURS_START) {
    return {
      label: "Early morning",
      tone: "caution",
      message: `People in ${displayName} may just be starting their day. Consider a later time for better availability.`
    } as const;
  }

  if (hour >= BUSINESS_HOURS_END && hour < 22) {
    return {
      label: "Evening",
      tone: "caution",
      message: `${displayName} is winding down for the day. Double-check availability before scheduling.`
    } as const;
  }

  if (hour >= 22 || hour < 7) {
    return {
      label: "Overnight",
      tone: "bad",
      message: `This is outside typical hours in ${displayName}. Consider scheduling during the local workday.`
    } as const;
  }

  return {
    label: "Check local time",
    tone: "neutral",
    message: `Confirm availability in ${displayName} before scheduling.`
  } as const;
}

function describeDayLength(sunrise?: string, sunset?: string, timezone?: string): number {
  if (!sunrise || !sunset || !timezone) return NaN;
  const start = DateTime.fromISO(sunrise).setZone(timezone);
  const end = DateTime.fromISO(sunset).setZone(timezone);
  if (!start.isValid || !end.isValid) return NaN;
  return end.diff(start, "minutes").minutes;
}

function formatMinutes(totalMinutes: number): string {
  if (!Number.isFinite(totalMinutes)) return "--";
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.round(totalMinutes % 60);
  return `${hours}h ${minutes}m`;
}

function buildJsonLd(city: CityConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "Place",
    name: formatCityDisplay(city),
    address: {
      "@type": "PostalAddress",
      addressLocality: city.name,
      addressRegion: city.region ?? undefined,
      addressCountry: city.country,
    },
    geo: city.lat && city.lon ? { "@type": "GeoCoordinates", latitude: city.lat, longitude: city.lon } : undefined
  };
}

async function fetchCityWeather(city: CityConfig): Promise<CityWeather> {
  const params = new URLSearchParams({
    latitude: city.lat.toString(),
    longitude: city.lon.toString(),
    timezone: city.timezone,
    current: "temperature_2m,precipitation,wind_speed_10m",
    daily: "sunrise,sunset",
    forecast_days: "5"
  });

  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Unable to load weather for this city.");
  }

  const json = (await response.json()) as {
    current?: { temperature_2m?: number; precipitation?: number; wind_speed_10m?: number };
    daily?: { time?: string[]; sunrise?: string[]; sunset?: string[] };
  };

  const temperatureC = json.current?.temperature_2m ?? NaN;
  const precipitation = json.current?.precipitation ?? NaN;
  const windSpeed = json.current?.wind_speed_10m ?? NaN;

  const sunriseToday = json.daily?.sunrise?.[0];
  const sunsetToday = json.daily?.sunset?.[0];

  const outlook: CityWeather["outlook"] = (json.daily?.time ?? []).map((date, index) => {
    const sunrise = json.daily?.sunrise?.[index];
    const sunset = json.daily?.sunset?.[index];
    return {
      date,
      sunrise: sunrise ? DateTime.fromISO(sunrise).setZone(city.timezone).toFormat("h:mm a") : "--",
      sunset: sunset ? DateTime.fromISO(sunset).setZone(city.timezone).toFormat("h:mm a") : "--",
      dayLengthMinutes: describeDayLength(sunrise, sunset, city.timezone)
    };
  });

  return {
    temperatureC,
    temperatureF: Number.isFinite(temperatureC) ? temperatureC * (9 / 5) + 32 : NaN,
    precipitation,
    windSpeed,
    sunrise: sunriseToday ? DateTime.fromISO(sunriseToday).setZone(city.timezone).toFormat("h:mm a") : "--:--",
    sunset: sunsetToday ? DateTime.fromISO(sunsetToday).setZone(city.timezone).toFormat("h:mm a") : "--:--",
    outlook
  };
}

export function CityPage({ city, onSelectCity }: CityPageProps): JSX.Element {
  const displayName = formatCityDisplay(city);
  const cityMeta = useMemo<CityMeta>(() => toCityMeta(city), [city]);
  const [now, setNow] = useState(() => DateTime.now().setZone(city.timezone));
  const [weather, setWeather] = useState<CityWeather | null>(null);
  const [weatherStatus, setWeatherStatus] = useState<"idle" | "loading" | "error" | "success">("loading");
  const [weatherError, setWeatherError] = useState<string | undefined>();
  const copy = useMemo(() => buildCityCopy(cityMeta), [cityMeta]);
  const { data: poiData, loading: poiLoading, error: poiError } = useCityPois(city.slug);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(DateTime.now().setZone(city.timezone));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [city.timezone]);

  useEffect(() => {
    setWeatherStatus("loading");
    fetchCityWeather(city)
      .then((data) => {
        setWeather(data);
        setWeatherStatus("success");
        setWeatherError(undefined);
      })
      .catch((error) => {
        setWeather(null);
        setWeatherStatus("error");
        setWeatherError(error instanceof Error ? error.message : "Could not load weather.");
      });
  }, [city]);

  useEffect(() => {
    const scriptId = `city-schema-${city.slug}`;
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(buildJsonLd(city));
    return () => {
      script?.remove();
    };
  }, [city]);

  const utcOffset = useMemo(() => formatOffset(now.offset), [now.offset]);
  const isDst = useMemo(() => now.isInDST, [now]);
  const callStatus = useMemo(() => getCallStatus(now, displayName), [now, displayName]);

  const referenceDifferences = useMemo(() => {
    return REFERENCE_CITIES.map((reference) => {
      const refTime = now.setZone(reference.timezone);
      const diffMinutes = refTime.offset - now.offset;
      const sign = diffMinutes === 0 ? "same time as" : diffMinutes > 0 ? "ahead of" : "behind";
      const absMinutes = Math.abs(diffMinutes);
      const hours = Math.floor(absMinutes / 60);
      const minutes = absMinutes % 60;
      const timeText = hours || minutes ? `${hours}h${minutes ? ` ${minutes}m` : ""}` : "0h";
      const diffLabel = diffMinutes === 0 ? "Same time" : `${timeText} ${sign}`;
      return {
        label: reference.label,
        localTime: refTime.isValid ? refTime.toFormat("h:mm a") : "--:--",
        diffLabel,
        diffMinutes,
        summary: `${displayName} is ${hours || minutes ? `${hours}h${minutes ? ` ${minutes}m` : ""}` : "0h"} ${sign} ${reference.label}.`
      };
    });
  }, [displayName, now]);

  const newYorkDiff = referenceDifferences.find((entry) => entry.label === "New York");
  const londonDiff = referenceDifferences.find((entry) => entry.label === "London");
  const highlightSummary = useMemo(() => {
    if (newYorkDiff && londonDiff) {
      return `${displayName} is ${newYorkDiff.diffLabel.toLowerCase()} New York and ${londonDiff.diffLabel.toLowerCase()} London right now.`;
    }
    return londonDiff?.summary ?? referenceDifferences[0]?.summary;
  }, [displayName, londonDiff, newYorkDiff, referenceDifferences]);

  const nearbyCities = useMemo(() => {
    const sameRegion = CITY_LIST.filter(
      (candidate) => candidate.countryCode === city.countryCode && candidate.region && candidate.region === city.region && candidate.slug !== city.slug
    );
    const sameCountry = CITY_LIST.filter(
      (candidate) => candidate.countryCode === city.countryCode && candidate.slug !== city.slug && (!candidate.region || candidate.region !== city.region)
    );
    const ordered = [...sameRegion, ...sameCountry];
    return ordered
      .sort((a, b) => (b.population ?? 0) - (a.population ?? 0) || a.name.localeCompare(b.name))
      .slice(0, 6);
  }, [city.countryCode, city.region, city.slug]);

  const embedWeatherSummary = useMemo(() => {
    if (!weather) return undefined;
    const formatValue = (value: number, suffix: string) => (Number.isFinite(value) ? `${value.toFixed(1)}${suffix}` : `--${suffix}`);
    return `${formatValue(weather.temperatureC, "°C")} / ${formatValue(weather.temperatureF, "°F")} • wind ${formatValue(weather.windSpeed, " km/h")} • precip ${formatValue(weather.precipitation, " mm")}`;
  }, [weather]);

  const outlookRows = weather?.outlook.slice(0, 4) ?? [];
  const todayDayLength = weather?.outlook[0]?.dayLengthMinutes;

  const introParagraph = useMemo(() => {
    const parts = [`${displayName} is in the ${city.timezone} time zone.`];
    if (newYorkDiff && londonDiff) {
      parts.push(
        `When it is ${now.toFormat("h:mm a")} in ${displayName}, it is ${newYorkDiff.localTime} in New York and ${londonDiff.localTime} in London.`
      );
    }
    parts.push("Use this page to check the live clock, decide if it's a good time to call, and review sunrise, sunset, and local weather updates.");
    return parts.join(" ");
  }, [city.timezone, displayName, londonDiff, newYorkDiff, now]);

  return (
    <div className="flex flex-col gap-8">
      <section className="rounded-3xl border border-slate-200/70 bg-white/80 p-8 shadow-lg shadow-slate-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-500">Current time</p>
        <h1 className="mt-2 text-4xl font-bold text-slate-900 dark:text-slate-100">Time in {displayName}</h1>
        <p className="mt-2 text-5xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-6xl">{now.toFormat("HH:mm:ss")}</p>
        <p className="text-lg text-slate-600 dark:text-slate-300">{now.toFormat("cccc, MMMM d, yyyy")}</p>
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Local time in {displayName} right now.</p>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{introParagraph}</p>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-lg shadow-slate-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Quick facts</h2>
          <ul className="mt-4 space-y-2 text-sm text-slate-700 dark:text-slate-200">
            <li><strong className="font-semibold">Timezone:</strong> {city.timezone}</li>
            <li><strong className="font-semibold">UTC offset:</strong> {utcOffset}</li>
            <li><strong className="font-semibold">Daylight Saving:</strong> {isDst ? "Currently in DST" : "Not in DST"}</li>
            <li>
              <strong className="font-semibold">Location:</strong> {displayName}
            </li>
            {city.population ? (
              <li>
                <strong className="font-semibold">Population:</strong> {city.population.toLocaleString()}
              </li>
            ) : null}
          </ul>
        </section>

        <section className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-lg shadow-slate-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Is it a good time to call?</h2>
          <p
            className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.1em] ${
              callStatus.tone === "good"
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-100"
                : callStatus.tone === "bad"
                  ? "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-100"
                  : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-100"
            }`}
          >
            {callStatus.label}
          </p>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{callStatus.message}</p>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Local hour: {now.toFormat("h:mm a")} ({city.timezone})
          </p>
        </section>

        <section className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-lg shadow-slate-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 lg:col-span-3">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Time difference from major cities</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Right now in {displayName}, the offsets below show how other hubs compare.
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {referenceDifferences.map((reference) => (
              <div key={reference.label} className="flex items-center justify-between rounded-2xl border border-slate-200/70 bg-white/70 px-4 py-3 text-sm shadow-sm dark:border-slate-700 dark:bg-slate-900/70">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{reference.label}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{reference.diffLabel}</p>
                </div>
                <p className="text-lg font-semibold text-indigo-600 dark:text-indigo-300">{reference.localTime}</p>
              </div>
            ))}
          </div>
          {highlightSummary ? (
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{highlightSummary}</p>
          ) : null}
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <WeatherCard
          status={weatherStatus}
          cityLabel={displayName}
          data={
            weather
              ? {
                  ...weather,
                  country: city.country,
                  state: city.region ?? undefined
                }
              : undefined
          }
          error={weatherError}
        />
        <section className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-lg shadow-slate-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Sunrise, sunset &amp; day length</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Sunrise today in {displayName} is at {weather?.sunrise ?? "--"}; sunset is at {weather?.sunset ?? "--"}.
            {todayDayLength ? ` Day length is ${formatMinutes(todayDayLength)}.` : ""}
          </p>
          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200/70 dark:border-slate-700">
            <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-700">
              <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-[0.15em] text-slate-500 dark:bg-slate-800/70 dark:text-slate-300">
                <tr>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Sunrise</th>
                  <th className="px-4 py-2">Sunset</th>
                  <th className="px-4 py-2">Day length</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {outlookRows.map((row) => (
                  <tr key={row.date} className="bg-white/80 text-slate-800 dark:bg-slate-900/70 dark:text-slate-100">
                    <td className="px-4 py-2 font-medium">{DateTime.fromISO(row.date).setZone(city.timezone).toFormat("ccc, MMM d")}</td>
                    <td className="px-4 py-2">{row.sunrise}</td>
                    <td className="px-4 py-2">{row.sunset}</td>
                    <td className="px-4 py-2">{formatMinutes(row.dayLengthMinutes)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <section className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-lg shadow-slate-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">About time in {displayName}</h2>
        <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
          <p>{copy.intro}</p>
          <p>{copy.timezone}</p>
          <p>{copy.usage}</p>
          <p>{copy.compare}</p>
        </div>
      </section>

      <section className="space-y-3">
        {poiLoading ? (
          <p className="text-sm text-slate-600 dark:text-slate-300">Loading local highlights for {displayName}…</p>
        ) : null}
        {poiError ? (
          <p className="text-sm text-rose-600 dark:text-rose-300">We couldn&apos;t load local highlights right now.</p>
        ) : null}
        {poiData ? <CityPoiSection pois={poiData} /> : null}
      </section>

      <section className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-lg shadow-slate-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Nearby cities</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Explore other destinations in the same country.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {nearbyCities.map((nearby) => (
            <button
              key={nearby.slug}
              type="button"
              onClick={() => onSelectCity(nearby.slug)}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 transition hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              {formatCityDisplay(nearby)}
            </button>
          ))}
        </div>
      </section>

      <CitySeoSection city={city} />

      <section className="flex flex-col gap-4 rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-lg shadow-slate-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Embed this city clock</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Copy the snippet below to show the live {displayName} time on your site. The timezone parameter is pre-filled for this city.
        </p>
        <EmbedConfigurator timezone={city.timezone} locationLabel={displayName} weatherSummary={embedWeatherSummary} />
      </section>

      <CompareTimes cities={CITY_LIST} initialCitySlug={city.slug} />
      <MeetingPlanner cities={CITY_LIST} initialCitySlug={city.slug} />
    </div>
  );
}
