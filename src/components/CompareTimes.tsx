import { DateTime } from "luxon";
import { useEffect, useMemo, useState } from "react";

import { CITY_CONFIG_LIST, CityConfig } from "../data/cities";

interface CompareTimesProps {
  initialPrimarySlug?: string;
  id?: string;
}

function formatNowForCity(city: CityConfig | undefined, use24Hour: boolean): string {
  if (!city) {
    return "--:--";
  }
  const now = DateTime.now().setZone(city.timezone);
  return now.isValid ? now.toFormat(use24Hour ? "HH:mm" : "h:mm a") : "--:--";
}

function describeDifference(cityA: CityConfig | undefined, cityB: CityConfig | undefined): string {
  if (!cityA || !cityB) {
    return "";
  }

  const base = DateTime.utc();
  const offsetA = base.setZone(cityA.timezone).offset;
  const offsetB = base.setZone(cityB.timezone).offset;
  const diffMinutes = offsetA - offsetB;
  if (diffMinutes === 0) {
    return `${cityA.name} and ${cityB.name} share the same time.`;
  }
  const ahead = diffMinutes > 0;
  const absMinutes = Math.abs(diffMinutes);
  const hours = Math.floor(absMinutes / 60);
  const minutes = absMinutes % 60;
  const pieces = [] as string[];
  if (hours) pieces.push(`${hours} hour${hours === 1 ? "" : "s"}`);
  if (minutes) pieces.push(`${minutes} min`);
  return `${cityA.name} is ${pieces.join(" ")} ${ahead ? "ahead of" : "behind"} ${cityB.name}.`;
}

export function CompareTimes({ initialPrimarySlug, id }: CompareTimesProps): JSX.Element {
  const sortedCities = useMemo(() => [...CITY_CONFIG_LIST].sort((a, b) => a.name.localeCompare(b.name)), []);
  const [primarySlug, setPrimarySlug] = useState(() => initialPrimarySlug ?? sortedCities[0]?.slug ?? "");
  const [secondarySlug, setSecondarySlug] = useState(() => sortedCities.find((city) => city.slug !== primarySlug)?.slug ?? "");
  const [use24Hour, setUse24Hour] = useState(false);

  useEffect(() => {
    if (initialPrimarySlug && initialPrimarySlug !== primarySlug) {
      setPrimarySlug(initialPrimarySlug);
      if (initialPrimarySlug === secondarySlug) {
        const fallback = sortedCities.find((city) => city.slug !== initialPrimarySlug);
        if (fallback) {
          setSecondarySlug(fallback.slug);
        }
      }
    }
  }, [initialPrimarySlug, primarySlug, secondarySlug, sortedCities]);

  const primaryCity = sortedCities.find((city) => city.slug === primarySlug) ?? sortedCities[0];
  const secondaryCity = sortedCities.find((city) => city.slug === secondarySlug) ?? sortedCities[1] ?? sortedCities[0];

  const primaryTime = formatNowForCity(primaryCity, use24Hour);
  const secondaryTime = formatNowForCity(secondaryCity, use24Hour);
  const difference = describeDifference(primaryCity, secondaryCity);

  return (
    <section
      id={id}
      className="flex flex-col gap-4 rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-lg shadow-slate-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70"
    >
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Compare city times</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">See the live offset between any two locations.</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Pick a pair of cities to answer “what time is it in [city]?” and share the difference with teammates before meetings.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setUse24Hour((prev) => !prev)}
          className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:border-slate-700 dark:text-slate-200"
        >
          {use24Hour ? "Use 12-hour" : "Use 24-hour"}
        </button>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        {[{ city: primaryCity, slug: primarySlug, setSlug: setPrimarySlug, label: "City A", time: primaryTime }, { city: secondaryCity, slug: secondarySlug, setSlug: setSecondarySlug, label: "City B", time: secondaryTime }].map((entry) => (
          <div key={entry.label} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/70">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {entry.label}
              <select
                value={entry.slug}
                onChange={(event) => entry.setSlug(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-base font-medium text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                {sortedCities.map((city) => (
                  <option key={city.slug} value={city.slug}>
                    {city.name}
                  </option>
                ))}
              </select>
            </label>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Current time</p>
              <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{entry.time}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{entry.city?.timezone}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{difference}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Use the dropdowns to test any combination—TimeInCity keeps offsets synced with the latest daylight saving time rules.
      </p>
    </section>
  );
}
