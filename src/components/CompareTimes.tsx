import { DateTime } from "luxon";
import { useMemo, useState } from "react";

import type { CityConfig } from "../data/cities";

interface CompareTimesProps {
  cities: CityConfig[];
  initialCitySlug?: string;
}

function formatNow(timezone: string): string {
  const now = DateTime.now().setZone(timezone);
  return now.isValid ? now.toFormat("ccc, MMM d • h:mm a") : "--";
}

function describeDifference(cityA: CityConfig, cityB: CityConfig): string {
  const base = DateTime.now();
  const offsetA = base.setZone(cityA.timezone).offset;
  const offsetB = base.setZone(cityB.timezone).offset;
  const diffMinutes = offsetA - offsetB;
  if (diffMinutes === 0) {
    return `${cityA.name} and ${cityB.name} share the same current time.`;
  }
  const ahead = diffMinutes > 0;
  const absMinutes = Math.abs(diffMinutes);
  const hours = Math.floor(absMinutes / 60);
  const minutes = absMinutes % 60;
  const parts = [] as string[];
  if (hours > 0) {
    parts.push(`${hours}h`);
  }
  if (minutes > 0) {
    parts.push(`${minutes}m`);
  }
  return `${cityA.name} is ${parts.join(" ")} ${ahead ? "ahead of" : "behind"} ${cityB.name}.`;
}

export function CompareTimes({ cities, initialCitySlug }: CompareTimesProps): JSX.Element {
  const [cityA, setCityA] = useState(() => cities.find((city) => city.slug === initialCitySlug) ?? cities[0]);
  const [cityB, setCityB] = useState(() => cities.find((city) => city.slug === "london") ?? cities[1] ?? cities[0]);

  const difference = useMemo(() => describeDifference(cityA, cityB), [cityA, cityB]);

  return (
    <section id="compare-times" className="flex flex-col gap-4 rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-lg shadow-slate-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
      <header>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Compare city times</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Pick any two cities to see the live time difference. Perfect for quick check-ins or planning across time zones.
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        {[{ value: cityA, setter: setCityA, label: "City A" }, { value: cityB, setter: setCityB, label: "City B" }].map((entry) => (
          <label key={entry.label} className="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            <span>{entry.label}</span>
            <select
              value={entry.value.slug}
              onChange={(event) => {
                const selected = cities.find((city) => city.slug === event.target.value);
                if (selected) {
                  entry.setter(selected);
                }
              }}
              className="rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-base text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100"
            >
              {cities.map((city) => (
                <option key={city.slug} value={city.slug}>
                  {city.name} {city.country ? `(${city.country})` : ""}
                </option>
              ))}
            </select>
            <span className="text-xs font-normal text-slate-500 dark:text-slate-400">{formatNow(entry.value.timezone)}</span>
          </label>
        ))}
      </div>
      <p className="text-sm font-medium text-indigo-600 dark:text-indigo-300">{difference}</p>
    </section>
  );
}
