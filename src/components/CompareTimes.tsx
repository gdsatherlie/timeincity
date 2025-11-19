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

function formatCityLabel(city: CityConfig): string {
  const details = [city.region, city.country].filter(Boolean).join(", ");
  return details ? `${city.name} (${details})` : city.name;
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
    <section
      id="compare-times"
      className="flex flex-col gap-5 rounded-3xl border border-slate-900/40 bg-slate-900 px-6 py-6 text-slate-100 shadow-[0_30px_80px_-40px_rgba(15,23,42,1)]"
    >
      <header className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold">Compare city times</h2>
        <p className="text-sm text-slate-300">
          Pick any two cities to see the live time difference. Perfect for quick check-ins or planning across time zones.
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        {[{ value: cityA, setter: setCityA, label: "City A" }, { value: cityB, setter: setCityB, label: "City B" }].map((entry) => (
          <label key={entry.label} className="flex flex-col gap-2 text-sm font-medium">
            <span className="text-slate-200">{entry.label}</span>
            <select
              value={entry.value.slug}
              onChange={(event) => {
                const selected = cities.find((city) => city.slug === event.target.value);
                if (selected) {
                  entry.setter(selected);
                }
              }}
              className="rounded-2xl border border-slate-700 bg-slate-800/80 px-4 py-3 text-base text-slate-100 shadow-inner shadow-slate-950 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              {cities.map((city) => (
                <option key={city.slug} value={city.slug}>
                  {formatCityLabel(city)}
                </option>
              ))}
            </select>
            <span className="text-xs font-normal text-slate-400">{formatNow(entry.value.timezone)}</span>
          </label>
        ))}
      </div>
      <div className="rounded-2xl border border-slate-800 bg-slate-800/80 px-4 py-3 text-sm text-indigo-100">
        {difference}
      </div>
    </section>
  );
}
