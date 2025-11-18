import { DateTime } from "luxon";
import { useEffect, useMemo, useState } from "react";

import { CITY_CONFIG_LIST, CityConfig } from "../data/cities";

interface MeetingPlannerProps {
  initialCitySlug?: string;
}

function formatDateInput(city: CityConfig | undefined): string {
  const zone = city?.timezone ?? "UTC";
  const now = DateTime.now().setZone(zone);
  return now.toFormat("yyyy-LL-dd'T'HH:mm");
}

export function MeetingPlanner({ initialCitySlug }: MeetingPlannerProps): JSX.Element {
  const sortedCities = useMemo(() => [...CITY_CONFIG_LIST].sort((a, b) => a.name.localeCompare(b.name)), []);
  const [cityASlug, setCityASlug] = useState(() => initialCitySlug ?? sortedCities[0]?.slug ?? "");
  const [cityBSlug, setCityBSlug] = useState(() => sortedCities.find((city) => city.slug !== cityASlug)?.slug ?? "");
  const cityA = sortedCities.find((city) => city.slug === cityASlug) ?? sortedCities[0];
  const cityB = sortedCities.find((city) => city.slug === cityBSlug) ?? sortedCities[1] ?? sortedCities[0];

  const [localValue, setLocalValue] = useState(() => formatDateInput(cityA));

  useEffect(() => {
    if (initialCitySlug && initialCitySlug !== cityASlug) {
      setCityASlug(initialCitySlug);
      setLocalValue(formatDateInput(sortedCities.find((city) => city.slug === initialCitySlug) ?? cityA));
    }
  }, [cityA, cityASlug, initialCitySlug, sortedCities]);

  const cityATime = DateTime.fromFormat(localValue, "yyyy-LL-dd'T'HH:mm", { zone: cityA?.timezone ?? "UTC" });
  const converted = cityATime.isValid ? cityATime.setZone(cityB?.timezone ?? "UTC") : null;

  return (
    <section className="flex flex-col gap-4 rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-lg shadow-slate-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
      <header>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Plan a meeting across time zones</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">Pick a local time and instantly see what it becomes elsewhere.</p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/70">
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            City A
            <select
              value={cityASlug}
              onChange={(event) => setCityASlug(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-base font-medium text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              {sortedCities.map((city) => (
                <option key={city.slug} value={city.slug}>
                  {city.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Local date &amp; time
            <input
              type="datetime-local"
              value={localValue}
              onChange={(event) => setLocalValue(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-base text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </label>
          <p className="text-xs text-slate-500 dark:text-slate-400">Times are interpreted in {cityA?.timezone ?? "UTC"}.</p>
        </div>
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/70">
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            City B
            <select
              value={cityBSlug}
              onChange={(event) => setCityBSlug(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-base font-medium text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              {sortedCities.map((city) => (
                <option key={city.slug} value={city.slug}>
                  {city.name}
                </option>
              ))}
            </select>
          </label>
          <div className="flex flex-col gap-1">
            <p className="text-sm text-slate-500 dark:text-slate-400">Converted time</p>
            <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
              {converted ? converted.toFormat("DDD t") : "--"}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{cityB?.timezone ?? "--"}</p>
          </div>
        </div>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        {converted
          ? `If it is ${cityATime.toFormat("DDD t")} in ${cityA?.name}, it will be ${converted.toFormat("DDD t")} in ${cityB?.name}.`
          : "Enter a valid date and time above to see the conversion."}
      </p>
    </section>
  );
}
