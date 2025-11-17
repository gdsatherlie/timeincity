import { Analytics } from "@vercel/analytics/react";
import { DateTime } from "luxon";
import { useEffect, useMemo, useState } from "react";

import { AdSlot } from "./components/AdSlot";
import { CitySeoSection } from "./components/CitySeoSection";
import { ClockDisplay } from "./components/ClockDisplay";
import { EmbedConfigurator } from "./components/EmbedConfigurator";
import { FavoriteCities } from "./components/FavoriteCities";
import { HomeSeoSection } from "./components/HomeSeoSection";
import { PopularCities } from "./components/PopularCities";
import { TimezoneSelector } from "./components/TimezoneSelector";
import { WeatherCard } from "./components/WeatherCard";
import { usePersistentState } from "./hooks/usePersistentState";
import { CITY_CONFIGS } from "./data/cities";
import { slugifyCity } from "./utils/slugifyCity";

const FALLBACK_TIMEZONES = [
  "Pacific/Midway",
  "America/Anchorage",
  "America/Los_Angeles",
  "America/Denver",
  "America/Chicago",
  "America/New_York",
  "America/Sao_Paulo",
  "Atlantic/Azores",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Australia/Sydney"
];

type SavedLocation = {
  timezone: string;
  label?: string;
};

type WeatherSummary = {
  city: string;
  state?: string;
  country?: string;
  temperatureC: number;
  temperatureF: number;
  precipitation: number;
  windSpeed: number;
  sunrise: string;
  sunset: string;
};

function decodeTimezoneToLabel(timezone: string): string {
  const lastSegment = timezone.split("/").pop() ?? timezone;
  return lastSegment.replace(/_/g, " ");
}

async function fetchWeather(timezone: string, explicitLabel?: string): Promise<WeatherSummary> {
  const derivedLabel = explicitLabel ?? decodeTimezoneToLabel(timezone);

  const geoParams = new URLSearchParams({
    name: derivedLabel,
    count: "1",
    language: "en"
  });
  geoParams.set("timezone", timezone);

  const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${geoParams.toString()}`);
  if (!geoResponse.ok) {
    throw new Error("Unable to lookup that location.");
  }

  const geoJson = (await geoResponse.json()) as {
    results?: Array<{
      name: string;
      latitude: number;
      longitude: number;
      admin1?: string;
      country?: string;
      timezone: string;
    }>;
  };

  const location = geoJson.results?.[0];

  if (!location) {
    throw new Error("No matching location found for that time zone.");
  }

  const forecastParams = new URLSearchParams({
    latitude: location.latitude.toString(),
    longitude: location.longitude.toString(),
    current: "temperature_2m,precipitation,wind_speed_10m",
    daily: "sunrise,sunset",
    timezone,
    temperature_unit: "celsius",
    windspeed_unit: "kmh",
    precipitation_unit: "mm"
  });

  const forecastResponse = await fetch(`https://api.open-meteo.com/v1/forecast?${forecastParams.toString()}`);
  if (!forecastResponse.ok) {
    throw new Error("Unable to fetch weather data.");
  }

  const forecastJson = (await forecastResponse.json()) as {
    current?: {
      temperature_2m?: number;
      precipitation?: number;
      wind_speed_10m?: number;
    };
    daily?: {
      sunrise?: string[];
      sunset?: string[];
    };
  };

  const temperatureC = forecastJson.current?.temperature_2m ?? NaN;
  const precipitation = forecastJson.current?.precipitation ?? NaN;
  const windSpeed = forecastJson.current?.wind_speed_10m ?? NaN;

  const sunriseISO = forecastJson.daily?.sunrise?.[0];
  const sunsetISO = forecastJson.daily?.sunset?.[0];

  const formatTime = (value?: string) => {
    if (!value) return "--:--";
    const dt = DateTime.fromISO(value).setZone(timezone);
    return dt.isValid ? dt.toFormat("h:mm a") : "--:--";
  };

  const summary: WeatherSummary = {
    city: location.name ?? derivedLabel,
    state: location.admin1,
    country: location.country,
    temperatureC,
    temperatureF: temperatureC * (9 / 5) + 32,
    precipitation,
    windSpeed,
    sunrise: formatTime(sunriseISO),
    sunset: formatTime(sunsetISO)
  };

  return summary;
}

function getCitySlugFromPath(pathname: string): string | undefined {
  const match = pathname.match(/^\/city\/([^/?#]+)/i);
  return match ? match[1].toLowerCase() : undefined;
}

export default function App(): JSX.Element {
  const defaultTimezone = useMemo(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch (error) {
      console.warn("Could not read local timezone", error);
      return "UTC";
    }
  }, []);

  const [savedLocation, setSavedLocation] = usePersistentState<SavedLocation | null>("timeincity-default-location", null);
  const [favoriteCities, setFavoriteCities] = usePersistentState<SavedLocation[]>("timeincity-favorite-cities", []);

  const [routeSlug, setRouteSlug] = useState<string | undefined>(() => {
    if (typeof window === "undefined") {
      return undefined;
    }
    return getCitySlugFromPath(window.location.pathname);
  });

  const activeCityConfig = routeSlug ? CITY_CONFIGS[routeSlug] : undefined;
  const isCityRoute = Boolean(routeSlug && activeCityConfig);

  const initialTimezone = activeCityConfig?.timezone ?? savedLocation?.timezone ?? defaultTimezone;
  const initialLabel = activeCityConfig?.name ?? savedLocation?.label ?? decodeTimezoneToLabel(initialTimezone);

  const [selectedTimezone, setSelectedTimezone] = useState(initialTimezone);
  const [customLabel, setCustomLabel] = useState<string | undefined>(initialLabel);
  const [use24Hour, setUse24Hour] = usePersistentState("timeincity-24hr", false);

  const timezones = useMemo(() => {
    try {
      return Intl.supportedValuesOf ? Intl.supportedValuesOf("timeZone") : FALLBACK_TIMEZONES;
    } catch (error) {
      console.warn("Intl.supportedValuesOf unavailable", error);
      return FALLBACK_TIMEZONES;
    }
  }, []);

  const [weatherStatus, setWeatherStatus] = useState<"idle" | "loading" | "error" | "success">("loading");
  const [weatherData, setWeatherData] = useState<WeatherSummary | null>(null);
  const [weatherError, setWeatherError] = useState<string | undefined>();

  const updateRouteForSlug = (slug?: string, options: { replace?: boolean } = {}) => {
    const { replace = false } = options;

    if (typeof window !== "undefined") {
      const nextPath = slug ? `/city/${slug}` : "/";
      const currentPath = window.location.pathname;
      const hasSearch = Boolean(window.location.search);
      const needsUpdate = currentPath !== nextPath || hasSearch;

      if (needsUpdate) {
        if (replace) {
          window.history.replaceState(window.history.state, "", nextPath);
        } else {
          window.history.pushState(window.history.state, "", nextPath);
        }
      }
    }

    setRouteSlug(slug);
  };

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("city");
    if (slug) {
      const entry = CITY_CONFIGS[slug.toLowerCase()];
      if (entry) {
        updateRouteForSlug(entry.slug, { replace: true });
      } else {
        window.history.replaceState(window.history.state, "", window.location.pathname.split("?")[0]);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const handler = () => {
      setRouteSlug(getCitySlugFromPath(window.location.pathname));
    };
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);

  const handleTimezoneChange = (timezone: string, label?: string) => {
    setSelectedTimezone(timezone);
    const computedLabel = label ?? decodeTimezoneToLabel(timezone);
    setCustomLabel(computedLabel);
    const slug = slugifyCity(computedLabel);
    if (slug && CITY_CONFIGS[slug]) {
      updateRouteForSlug(slug);
    } else {
      updateRouteForSlug(undefined);
    }
  };

  useEffect(() => {
    if (!selectedTimezone) {
      return;
    }

    let cancelled = false;

    const load = async () => {
      setWeatherStatus("loading");
      setWeatherError(undefined);
      try {
        const summary = await fetchWeather(selectedTimezone, customLabel);
        if (!cancelled) {
          setWeatherData(summary);
          setWeatherStatus("success");
        }
      } catch (err) {
        if (!cancelled) {
          setWeatherStatus("error");
          setWeatherData(null);
          setWeatherError(err instanceof Error ? err.message : "Could not load weather right now.");
        }
      }
    };

    load();

    const refreshInterval = window.setInterval(load, 10 * 60 * 1000);

    return () => {
      cancelled = true;
      window.clearInterval(refreshInterval);
    };
  }, [selectedTimezone, customLabel]);

  useEffect(() => {
    if (!activeCityConfig) {
      return;
    }
    setSelectedTimezone(activeCityConfig.timezone);
    setCustomLabel(activeCityConfig.name);
  }, [activeCityConfig?.timezone, activeCityConfig?.name]);

  useEffect(() => {
    if (routeSlug && !activeCityConfig) {
      updateRouteForSlug(undefined, { replace: true });
    }
  }, [routeSlug, activeCityConfig]);

  const fallbackCityLabel = useMemo(
    () => customLabel ?? decodeTimezoneToLabel(selectedTimezone),
    [customLabel, selectedTimezone]
  );
  const cityLabel = weatherData?.city ?? fallbackCityLabel;

  const locationLabel = useMemo(() => {
    const parts = [weatherData?.city ?? fallbackCityLabel, weatherData?.state, weatherData?.country];
    const seen = new Set<string>();
    return parts
      .filter((part): part is string => {
        if (!part) {
          return false;
        }
        const normalized = part.trim();
        if (!normalized || seen.has(normalized)) {
          return false;
        }
        seen.add(normalized);
        return true;
      })
      .join(", ");
  }, [weatherData, fallbackCityLabel]);

  const embedWeatherSummary = useMemo(() => {
    if (!weatherData) {
      return undefined;
    }

    const format = (value: number, suffix: string) => (Number.isFinite(value) ? `${value.toFixed(1)}${suffix}` : `--${suffix}`);

    return `${format(weatherData.temperatureC, "°C")} / ${format(weatherData.temperatureF, "°F")} • wind ${format(
      weatherData.windSpeed,
      " km/h"
    )} • precip ${format(weatherData.precipitation, " mm")}`;
  }, [weatherData]);

  useEffect(() => {
    const primaryLabel = isCityRoute ? activeCityConfig?.name ?? cityLabel : cityLabel;
    const nextTitle = isCityRoute
      ? `Current time in ${primaryLabel} — TimeInCity`
      : `Time in ${primaryLabel} – TimeInCity`;
    document.title = nextTitle;
  }, [cityLabel, isCityRoute, activeCityConfig?.name]);

  const selectedLabel = customLabel ?? decodeTimezoneToLabel(selectedTimezone);
  const defaultLabel = savedLocation?.label ?? (savedLocation?.timezone ? decodeTimezoneToLabel(savedLocation.timezone) : undefined);
  const isDefaultSelection = savedLocation?.timezone === selectedTimezone && savedLocation?.label === selectedLabel;

  const defaultDifference = useMemo(() => {
    if (!savedLocation?.timezone) {
      return undefined;
    }

    try {
      const base = DateTime.utc();
      const defaultOffset = base.setZone(savedLocation.timezone).offset;
      const selectedOffset = base.setZone(selectedTimezone).offset;
      const diffMinutes = defaultOffset - selectedOffset;

      if (diffMinutes === 0) {
        return "Same time as selected";
      }

      const absMinutes = Math.abs(diffMinutes);
      const hours = Math.floor(absMinutes / 60);
      const minutes = absMinutes % 60;
      const parts: string[] = [];
      if (hours > 0) {
        parts.push(`${hours}h`);
      }
      if (minutes > 0) {
        parts.push(`${minutes}m`);
      }

      const relation = diffMinutes > 0 ? "ahead of selected" : "behind selected";
      return `${parts.join(" ")} ${relation}`;
    } catch (error) {
      console.warn("Unable to compute timezone difference", error);
      return undefined;
    }
  }, [savedLocation?.timezone, selectedTimezone]);

  const handleSetDefaultLocation = () => {
    setSavedLocation({ timezone: selectedTimezone, label: selectedLabel });
  };

  const handleClearDefaultLocation = () => {
    setSavedLocation(null);
  };

  const handleSelectDefaultLocation = () => {
    if (!savedLocation) {
      return;
    }
    handleTimezoneChange(savedLocation.timezone, savedLocation.label);
  };

  const hasFavorite = favoriteCities.some(
    (favorite) => favorite.timezone === selectedTimezone && favorite.label === selectedLabel
  );

  const handleAddFavorite = () => {
    setFavoriteCities((previous) => {
      if (previous.some((favorite) => favorite.timezone === selectedTimezone && favorite.label === selectedLabel)) {
        return previous;
      }
      const next = [...previous, { timezone: selectedTimezone, label: selectedLabel }];
      return next.slice(-24);
    });
  };

  const handleRemoveFavorite = (timezone: string, label?: string) => {
    setFavoriteCities((previous) =>
      previous.filter((favorite) => !(favorite.timezone === timezone && favorite.label === label))
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-white to-slate-100 text-slate-900 transition-colors dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-slate-100">
      <AdSlot label="Top banner ad" slotId="1234567890" sticky="top" />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 pb-10 pt-6 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-6 rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-lg shadow-slate-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
          <div className="flex flex-col items-start gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-500">TimeInCity</p>
              <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
                Track the time & weather anywhere
              </h1>
              <p className="mt-3 max-w-2xl text-base text-slate-600 dark:text-slate-300">
                Instantly switch between global cities, see live weather conditions, and grab an embed for your own site.
              </p>
            </div>
          </div>
        </header>

        <ClockDisplay
          timezone={selectedTimezone}
          use24Hour={use24Hour}
          onFormatToggle={() => setUse24Hour((prev) => !prev)}
          locationLabel={locationLabel}
          onSetDefault={handleSetDefaultLocation}
          onClearDefault={handleClearDefaultLocation}
          onSelectDefault={handleSelectDefaultLocation}
          isDefaultSelection={Boolean(isDefaultSelection)}
          hasDefault={Boolean(savedLocation)}
          defaultLabel={defaultLabel}
          defaultDifference={defaultDifference}
        />

        {isCityRoute && activeCityConfig ? <CitySeoSection city={activeCityConfig} /> : <HomeSeoSection />}

        <FavoriteCities
          favorites={favoriteCities}
          selectedTimezone={selectedTimezone}
          selectedLabel={selectedLabel}
          onSelect={handleTimezoneChange}
          onRemove={handleRemoveFavorite}
          onAddCurrent={handleAddFavorite}
          canAddCurrent={!hasFavorite}
        />

        <TimezoneSelector
          timezones={timezones}
          selectedTimezone={selectedTimezone}
          onSelect={handleTimezoneChange}
        />

        <AdSlot label="Inline ad" slotId="1234567891" />

        <WeatherCard status={weatherStatus} cityLabel={cityLabel} data={weatherData ?? undefined} error={weatherError} />

        <EmbedConfigurator timezone={selectedTimezone} locationLabel={locationLabel} weatherSummary={embedWeatherSummary} />

        <PopularCities selectedLabel={selectedLabel} onSelect={handleTimezoneChange} />
      </main>
      <AdSlot label="Bottom banner ad" slotId="1234567892" sticky="bottom" />
      <Analytics />
    </div>
  );
}
