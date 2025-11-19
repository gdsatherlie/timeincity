import { DateTime } from "luxon";
import { useEffect, useMemo, useState } from "react";

import { AdSlot } from "./AdSlot";
import { ClockDisplay } from "./ClockDisplay";
import { CompareTimes } from "./CompareTimes";
import { EmbedConfigurator } from "./EmbedConfigurator";
import { MeetingPlanner } from "./MeetingPlanner";
import { PopularCities } from "./PopularCities";
import { TimezoneSelector } from "./TimezoneSelector";
import { WeatherCard } from "./WeatherCard";
import { CitySearch } from "./CitySearch";
import { usePersistentState } from "../hooks/usePersistentState";
import { slugifyCity } from "../utils/slugifyCity";
import { formatCityDisplay } from "../utils/formatCityDisplay";
import { CITY_CONFIGS, CITY_LIST, type CityConfig } from "../data/cities";
import { SHOW_AD_SLOTS } from "../config";
import { guessDefaultCityFromTimezone } from "../utils/guessDefaultCity";
import { searchCities } from "../utils/cityData";

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
  slug?: string;
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

export interface ExperienceProps {
  initialTimezone?: string;
  initialLabel?: string;
  initialCitySlug?: string;
  onSelectCity?: (slug: string) => void;
}

export function Experience({ initialTimezone, initialLabel, initialCitySlug, onSelectCity }: ExperienceProps): JSX.Element {
  const [savedLocation, setSavedLocation] = usePersistentState<SavedLocation | null>("timeincity-default-location", null);

  const localTimezone = useMemo(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch (error) {
      console.warn("Could not read local timezone", error);
      return "UTC";
    }
  }, []);

  const autoDetectedCity = useMemo(() => guessDefaultCityFromTimezone(), []);
  const autoDetectedCityLabel = useMemo(
    () => (autoDetectedCity ? formatCityDisplay(autoDetectedCity) : undefined),
    [autoDetectedCity]
  );

  const timezones = useMemo(() => {
    try {
      return Intl.supportedValuesOf ? Intl.supportedValuesOf("timeZone") : FALLBACK_TIMEZONES;
    } catch (error) {
      console.warn("Intl.supportedValuesOf unavailable", error);
      return FALLBACK_TIMEZONES;
    }
  }, []);

  const fallbackTimezone = savedLocation?.timezone ?? initialTimezone ?? autoDetectedCity?.timezone ?? localTimezone;
  const fallbackLabel =
    savedLocation?.label ?? initialLabel ?? autoDetectedCity?.name ?? decodeTimezoneToLabel(fallbackTimezone);

  const [selectedTimezone, setSelectedTimezone] = useState(fallbackTimezone);
  const [customLabel, setCustomLabel] = useState<string | undefined>(fallbackLabel);
  const [currentSlug, setCurrentSlug] = useState<string | undefined>(
    savedLocation?.slug ?? initialCitySlug ?? autoDetectedCity?.slug
  );
  const [use24Hour, setUse24Hour] = usePersistentState("timeincity-24hr", false);

  const [weatherStatus, setWeatherStatus] = useState<"idle" | "loading" | "error" | "success">("loading");
  const [weatherData, setWeatherData] = useState<WeatherSummary | null>(null);
  const [weatherError, setWeatherError] = useState<string | undefined>();
  const [geoStatus, setGeoStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [geoMessage, setGeoMessage] = useState<string | null>(null);

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

  const handleTimezoneChange = (
    timezone: string,
    label?: string,
    slug?: string,
    options?: { navigate?: boolean }
  ) => {
    setSelectedTimezone(timezone);
    const resolvedLabel = label ?? decodeTimezoneToLabel(timezone);
    setCustomLabel(resolvedLabel);

    const normalizedLabel = label?.toLowerCase();
    const derivedSlug =
      slug ??
      CITY_LIST.find(
        (city) =>
          city.timezone === timezone &&
          (!normalizedLabel ||
            city.name.toLowerCase() === normalizedLabel ||
            formatCityDisplay(city).toLowerCase() === normalizedLabel)
      )?.slug;
    setCurrentSlug(derivedSlug);

    if (options?.navigate === false) {
      return;
    }

    if (onSelectCity) {
      const destinationSlug = derivedSlug ?? (label ? slugifyCity(label) : undefined);
      if (destinationSlug) {
        onSelectCity(destinationSlug);
      }
    }
  };

  const selectedLabel = customLabel ?? decodeTimezoneToLabel(selectedTimezone);
  const defaultLabel = savedLocation?.label ?? (savedLocation?.timezone ? decodeTimezoneToLabel(savedLocation.timezone) : undefined);
  const isDefaultSelection =
    savedLocation?.timezone === selectedTimezone && savedLocation?.label === selectedLabel && savedLocation?.slug === currentSlug;

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
    setSavedLocation({ timezone: selectedTimezone, label: selectedLabel, slug: currentSlug });
  };

  const handleClearDefaultLocation = () => {
    setSavedLocation(null);
  };

  const handleSelectDefaultLocation = () => {
    if (!savedLocation) {
      return;
    }
    handleTimezoneChange(savedLocation.timezone, savedLocation.label, savedLocation.slug);
  };

  const selectedCityConfig = useMemo(() => {
    if (currentSlug) {
      return CITY_LIST.find((city) => city.slug === currentSlug);
    }
    return CITY_LIST.find((city) => city.timezone === selectedTimezone && city.name === selectedLabel);
  }, [currentSlug, selectedLabel, selectedTimezone]);

  const showAutoNotice = Boolean(!savedLocation && !initialTimezone && autoDetectedCity && selectedTimezone === autoDetectedCity.timezone);

  const handleCitySearchSelect = (citySlug: string) => {
    const city = CITY_CONFIGS[citySlug];
    if (!city) return;
    handleTimezoneChange(city.timezone, formatCityDisplay(city), city.slug);
  };

  const findNearestCity = (latitude: number, longitude: number): CityConfig | undefined => {
    let best: { city: CityConfig; distance: number } | null = null;
    for (const city of CITY_LIST) {
      const lat = city.lat;
      const lon = city.lon;
      if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
        continue;
      }
      const dLat = ((lat - latitude) * Math.PI) / 180;
      const dLon = ((lon - longitude) * Math.PI) / 180;
      const originLat = (latitude * Math.PI) / 180;
      const targetLat = (lat * Math.PI) / 180;
      const a = Math.sin(dLat / 2) ** 2 + Math.cos(originLat) * Math.cos(targetLat) * Math.sin(dLon / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const earthRadiusKm = 6371;
      const distance = earthRadiusKm * c;
      if (!best || distance < best.distance) {
        best = { city, distance };
      }
    }
    return best?.city;
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setGeoStatus("error");
      setGeoMessage("Geolocation isn’t supported in this browser.");
      return;
    }
    setGeoStatus("loading");
    setGeoMessage("Looking up your city…");
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const params = new URLSearchParams({
            latitude: latitude.toString(),
            longitude: longitude.toString(),
            count: "1",
            language: "en",
            format: "json"
          });
          const response = await fetch(`https://geocoding-api.open-meteo.com/v1/reverse?${params.toString()}`);
          if (!response.ok) {
            throw new Error("Could not reverse geocode your location.");
          }
          const json = (await response.json()) as {
            results?: Array<{
              name: string;
              timezone: string;
              country?: string;
            }>;
          };
          const result = json.results?.[0];
          const fallbackCity = findNearestCity(latitude, longitude);
          const matchedSlug = result ? searchCities(result.name, 1)[0]?.slug : undefined;
          const matchedCity = (matchedSlug && CITY_CONFIGS[matchedSlug]) || fallbackCity;
          if (matchedCity) {
            handleTimezoneChange(matchedCity.timezone, formatCityDisplay(matchedCity), matchedCity.slug);
            setGeoStatus("success");
            setGeoMessage(`Showing ${formatCityDisplay(matchedCity)} based on your location.`);
          } else {
            throw new Error("Unable to find a nearby city.");
          }
        } catch (error) {
          setGeoStatus("error");
          setGeoMessage(error instanceof Error ? error.message : "Could not use your location.");
        }
      },
      (error) => {
        setGeoStatus("error");
        setGeoMessage(error.message || "Location request was denied.");
      }
    );
  };

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-4 rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-lg shadow-slate-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-500">TimeInCity</p>
        <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
          Track the time &amp; weather anywhere
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-300">
          Instantly switch between global cities, check sunrise and weather, compare time zones, and grab a live embed for your own site.
        </p>
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="flex-1">
            <CitySearch label="Search any city" onSelectCity={handleCitySearchSelect} placeholder="Search 500+ cities…" />
          </div>
          <button
            type="button"
            onClick={handleUseMyLocation}
            className="inline-flex items-center justify-center rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-700 transition hover:border-indigo-300 hover:bg-indigo-100 dark:border-indigo-500/40 dark:bg-indigo-500/10 dark:text-indigo-200"
          >
            Use my location
          </button>
        </div>
        {geoMessage ? (
          <p
            className={`text-sm ${
              geoStatus === "error"
                ? "text-rose-500"
                : geoStatus === "success"
                  ? "text-emerald-600"
                  : "text-slate-500"
            }`}
          >
            {geoMessage}
          </p>
        ) : null}
        {showAutoNotice ? (
          <div className="rounded-2xl border border-indigo-200/80 bg-indigo-50/80 px-4 py-3 text-sm font-medium text-indigo-700 dark:border-indigo-500/40 dark:bg-indigo-500/10 dark:text-indigo-200">
            Showing your local time in {autoDetectedCityLabel ?? autoDetectedCity?.name} based on your browser time zone.
          </div>
        ) : null}
      </section>

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

      <TimezoneSelector timezones={timezones} selectedTimezone={selectedTimezone} onSelect={handleTimezoneChange}>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Select any IANA time zone to update the live clock instantly.
        </p>
      </TimezoneSelector>

      {SHOW_AD_SLOTS ? <AdSlot label="Inline ad" /> : null}

      <EmbedConfigurator timezone={selectedTimezone} locationLabel={locationLabel} weatherSummary={embedWeatherSummary} />

      <CompareTimes cities={CITY_LIST} initialCitySlug={selectedCityConfig?.slug ?? currentSlug} />

      <MeetingPlanner cities={CITY_LIST} initialCitySlug={selectedCityConfig?.slug ?? currentSlug} />

      <PopularCities selectedSlug={currentSlug} selectedLabel={selectedLabel} onSelect={handleTimezoneChange} />
    </div>
  );
}
