import { Analytics } from "@vercel/analytics/react";
import { DateTime } from "luxon";
import { useEffect, useMemo, useState } from "react";

import { AdSlot } from "./components/AdSlot";
import { CitySeoSection } from "./components/CitySeoSection";
import { CitySearch } from "./components/CitySearch";
import { ClockDisplay } from "./components/ClockDisplay";
import { CompareTimes } from "./components/CompareTimes";
import { EmbedConfigurator } from "./components/EmbedConfigurator";
import { FavoriteCities } from "./components/FavoriteCities";
import { HomeSeoSection } from "./components/HomeSeoSection";
import { MeetingPlanner } from "./components/MeetingPlanner";
import { PopularCities } from "./components/PopularCities";
import { SiteHeader } from "./components/SiteHeader";
import { SiteFooter } from "./components/SiteFooter";
import { StaticPage } from "./components/StaticPage";
import { TimezoneSelector } from "./components/TimezoneSelector";
import { WeatherCard } from "./components/WeatherCard";
import { usePersistentState } from "./hooks/usePersistentState";
import { CITY_CONFIGS, CITY_CONFIG_LIST, type CityConfig } from "./data/cities";
import { STATIC_PAGE_CONTENT, STATIC_PAGE_ROUTES, type StaticPageSlug } from "./data/staticPages";
import { SHOW_AD_SLOTS } from "./config";
import { slugifyCity } from "./utils/slugifyCity";
import { guessDefaultCityFromTimezone } from "./utils/guessDefaultCity";
import { getCitySeoCopy } from "./utils/citySeo";

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

function normalizePathname(pathname: string): string {
  const trimmed = pathname.replace(/\/+$/, "");
  if (!trimmed) {
    return "/";
  }
  return trimmed.startsWith("/") ? trimmed.toLowerCase() : `/${trimmed.toLowerCase()}`;
}

function getStaticPageFromPath(pathname: string): StaticPageSlug | null {
  const normalized = normalizePathname(pathname);
  const entry = Object.entries(STATIC_PAGE_ROUTES).find(([, meta]) => meta.path === normalized);
  return entry ? (entry[0] as StaticPageSlug) : null;
}

function getStaticPagePath(slug: StaticPageSlug): string {
  return STATIC_PAGE_ROUTES[slug].path;
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

  const [staticPage, setStaticPage] = useState<StaticPageSlug | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }
    return getStaticPageFromPath(window.location.pathname);
  });

  const activeCityConfig = routeSlug ? CITY_CONFIGS[routeSlug] : undefined;
  const isCityRoute = Boolean(routeSlug && activeCityConfig);
  const staticContent = staticPage ? STATIC_PAGE_CONTENT[staticPage] : undefined;

  const guessedCity = useMemo(() => guessDefaultCityFromTimezone(), []);
  const shouldUseGuess = !isCityRoute && !savedLocation && Boolean(guessedCity);

  const initialTimezone =
    activeCityConfig?.timezone ?? savedLocation?.timezone ?? (shouldUseGuess ? guessedCity!.timezone : defaultTimezone);
  const initialLabel =
    activeCityConfig?.name ??
    savedLocation?.label ??
    (shouldUseGuess ? guessedCity!.name : decodeTimezoneToLabel(initialTimezone));

  const [selectedTimezone, setSelectedTimezone] = useState(initialTimezone);
  const [customLabel, setCustomLabel] = useState<string | undefined>(initialLabel);
  const [autoDetectedCity, setAutoDetectedCity] = useState<CityConfig | null>(() => (shouldUseGuess ? guessedCity ?? null : null));
  const [use24Hour, setUse24Hour] = usePersistentState("timeincity-24hr", false);
  const [scrollRequest, setScrollRequest] = useState<{ id: string; timestamp: number } | null>(null);

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
    setStaticPage(null);
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
      const path = window.location.pathname;
      const slug = getCitySlugFromPath(path);
      setRouteSlug(slug);
      if (slug) {
        setStaticPage(null);
      } else {
        setStaticPage(getStaticPageFromPath(path));
      }
    };
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);

  useEffect(() => {
    if (!routeSlug && !savedLocation && guessedCity && selectedTimezone === guessedCity.timezone) {
      setAutoDetectedCity(guessedCity);
    } else {
      setAutoDetectedCity(null);
    }
  }, [routeSlug, savedLocation, guessedCity, selectedTimezone]);

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

  const handleCityConfigSelect = (city: CityConfig) => {
    setSelectedTimezone(city.timezone);
    setCustomLabel(city.name);
    updateRouteForSlug(city.slug);
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

  const derivedCityFromSelection = useMemo(() => {
    if (isCityRoute && activeCityConfig) {
      return activeCityConfig;
    }
    return CITY_CONFIG_LIST.find((city) => city.timezone === selectedTimezone) ?? null;
  }, [isCityRoute, activeCityConfig, selectedTimezone]);

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
    if (staticPage && staticContent) {
      document.title = `${staticContent.title} — TimeInCity`;
      return;
    }
    if (isCityRoute && activeCityConfig) {
      const copy = getCitySeoCopy(activeCityConfig);
      document.title = copy.title;
    } else {
      document.title = `Time in ${cityLabel} – TimeInCity`;
    }
  }, [cityLabel, isCityRoute, activeCityConfig, staticPage, staticContent]);

  useEffect(() => {
    if (!scrollRequest || typeof window === "undefined") {
      return;
    }
    const { id } = scrollRequest;
    const attemptScroll = () => {
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        setScrollRequest(null);
        return true;
      }
      return false;
    };
    if (attemptScroll()) {
      return;
    }
    const timeout = window.setTimeout(() => {
      if (!attemptScroll()) {
        setScrollRequest(null);
      }
    }, 150);
    return () => window.clearTimeout(timeout);
  }, [scrollRequest]);

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

  const handleNavigateToStaticPage = (slug: StaticPageSlug) => {
    if (typeof window !== "undefined") {
      const path = getStaticPagePath(slug);
      if (window.location.pathname !== path) {
        window.history.pushState(window.history.state, "", path);
      }
    }
    setStaticPage(slug);
    setRouteSlug(undefined);
  };

  const handleNavigateHome = () => {
    setStaticPage(null);
    updateRouteForSlug(undefined);
  };

  const handleScrollToSection = (sectionId: string) => {
    handleNavigateHome();
    setScrollRequest({ id: sectionId, timestamp: Date.now() });
  };

  const handleNavigateCityShortcut = (slug: string) => {
    const city = CITY_CONFIGS[slug];
    if (city) {
      handleCityConfigSelect(city);
    } else {
      handleNavigateHome();
    }
  };

  if (staticPage && staticContent) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-100 via-white to-slate-100 text-slate-900 transition-colors dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-slate-100">
        {SHOW_AD_SLOTS && <AdSlot label="Top banner" slotId="1234567890" sticky="top" />}
        <SiteHeader
          onNavigateHome={handleNavigateHome}
          onNavigateSection={handleScrollToSection}
          onNavigateCitySlug={handleNavigateCityShortcut}
          onNavigateStaticPage={handleNavigateToStaticPage}
        />
        <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 pb-10 pt-6 sm:px-6 lg:px-8">
          <header className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-200/70 bg-white/80 px-6 py-4 shadow-lg shadow-slate-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-500">TimeInCity</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Learn more about {staticContent.title}.</p>
            </div>
            <button
              type="button"
              onClick={() => updateRouteForSlug(undefined)}
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:border-slate-700 dark:text-slate-200"
            >
              Back to homepage
            </button>
          </header>
          <StaticPage content={staticContent} />
          {staticPage === "world-time-converter" && (
            <>
              <CompareTimes initialPrimarySlug={derivedCityFromSelection?.slug} />
              <MeetingPlanner initialCitySlug={derivedCityFromSelection?.slug} />
            </>
          )}
          {staticPage === "time-zone-map" && (
            <div className="rounded-3xl border border-dashed border-slate-300/80 bg-gradient-to-br from-slate-50 to-indigo-50/70 p-6 text-sm text-slate-600 shadow-inner dark:border-slate-700 dark:from-slate-900/80 dark:to-indigo-950/50 dark:text-slate-300">
              A fully interactive time zone map is coming soon. In the meantime, use the tools above to explore offsets and compare regions.
            </div>
          )}
        </main>
        <SiteFooter onNavigate={handleNavigateToStaticPage} currentPage={staticPage} />
        {SHOW_AD_SLOTS && <AdSlot label="Footer banner" slotId="1234567892" sticky="bottom" />}
        <Analytics />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-white to-slate-100 text-slate-900 transition-colors dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-slate-100">
      {SHOW_AD_SLOTS && <AdSlot label="Top banner" slotId="1234567890" sticky="top" />}
      <SiteHeader
        onNavigateHome={handleNavigateHome}
        onNavigateSection={handleScrollToSection}
        onNavigateCitySlug={handleNavigateCityShortcut}
        onNavigateStaticPage={handleNavigateToStaticPage}
      />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 pb-10 pt-6 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-lg shadow-slate-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-500">TimeInCity</p>
          <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
            Track the time & weather anywhere
          </h1>
          <p className="max-w-2xl text-base text-slate-600 dark:text-slate-300">
            Instantly switch between global cities, see live weather conditions, and grab an embed for your own site.
          </p>
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

        <WeatherCard status={weatherStatus} cityLabel={cityLabel} data={weatherData ?? undefined} error={weatherError} />

        {autoDetectedCity && !isCityRoute && (
          <div className="rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/60 px-4 py-3 text-sm text-indigo-700 shadow-sm dark:border-indigo-500/60 dark:bg-indigo-500/10 dark:text-indigo-200">
            Showing your local time in {autoDetectedCity.name} based on your device time zone.
          </div>
        )}

        <TimezoneSelector
          timezones={timezones}
          selectedTimezone={selectedTimezone}
          onSelect={handleTimezoneChange}
          title="Choose a city or time zone"
          description="Select any IANA time zone"
        >
          <CitySearch onSelectCity={handleCityConfigSelect} className="mt-2 w-full" />
        </TimezoneSelector>

        {SHOW_AD_SLOTS && <AdSlot label="Inline ad" slotId="1234567891" />}

        {isCityRoute && activeCityConfig ? <CitySeoSection city={activeCityConfig} /> : <HomeSeoSection />}

        <CompareTimes id="compare-times" initialPrimarySlug={derivedCityFromSelection?.slug} />

        <MeetingPlanner id="meeting-planner" initialCitySlug={derivedCityFromSelection?.slug} />

        <EmbedConfigurator timezone={selectedTimezone} locationLabel={locationLabel} weatherSummary={embedWeatherSummary} />

        <FavoriteCities
          favorites={favoriteCities}
          selectedTimezone={selectedTimezone}
          selectedLabel={selectedLabel}
          onSelect={handleTimezoneChange}
          onRemove={handleRemoveFavorite}
          onAddCurrent={handleAddFavorite}
          canAddCurrent={!hasFavorite}
        />

        <PopularCities id="popular-cities" selectedLabel={selectedLabel} onSelect={handleTimezoneChange} />
      </main>
      <SiteFooter onNavigate={handleNavigateToStaticPage} currentPage={staticPage} />
      {SHOW_AD_SLOTS && <AdSlot label="Footer banner" slotId="1234567892" sticky="bottom" />}
      <Analytics />
    </div>
  );
}
