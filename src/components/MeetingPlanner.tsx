import { DateTime } from "luxon";
import { useMemo, useState } from "react";

import type { CityConfig } from "../data/cities";

interface MeetingPlannerProps {
  cities: CityConfig[];
  initialCitySlug?: string;
}

function formatInputValue(date: DateTime): string {
  return date.toFormat("yyyy-LL-dd'T'HH:mm");
}

export function MeetingPlanner({ cities, initialCitySlug }: MeetingPlannerProps): JSX.Element {
  const defaultCity = cities.find((city) => city.slug === initialCitySlug) ?? cities[0];
  const [fromCity, setFromCity] = useState(defaultCity);
  const [toCity, setToCity] = useState(() => cities.find((city) => city.slug === "tokyo") ?? cities[1] ?? cities[0]);
  const [inputValue, setInputValue] = useState(() => formatInputValue(DateTime.now().setZone(fromCity.timezone)));

  const meetingSummary = useMemo(() => {
    const base = DateTime.fromISO(inputValue, { zone: fromCity.timezone });
    if (!base.isValid) {
      return "Select a date and time to convert.";
    }
    const converted = base.setZone(toCity.timezone);
    return `If it is ${base.toFormat("MMM d, h:mm a")} in ${fromCity.name}, it will be ${converted.toFormat("MMM d, h:mm a")} in ${toCity.name}.`;
  }, [fromCity, inputValue, toCity]);

  return (
    <section id="meeting-planner" className="flex flex-col gap-4 rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-lg shadow-slate-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
      <header>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Plan a meeting across time zones</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Pick a city and date/time to instantly convert it to another location. Handy for scheduling global calls or travel itineraries.
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
          <span>Meeting time (City A)</span>
          <input
            type="datetime-local"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            className="rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-base text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100"
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          {[{ label: "City A", city: fromCity, setter: setFromCity }, { label: "City B", city: toCity, setter: setToCity }].map((entry) => (
            <label key={entry.label} className="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
              <span>{entry.label}</span>
              <select
                value={entry.city.slug}
                onChange={(event) => {
                  const selected = cities.find((city) => city.slug === event.target.value);
                  if (selected) {
                    entry.setter(selected);
                    if (entry.label === "City A") {
                      setInputValue(formatInputValue(DateTime.now().setZone(selected.timezone)));
                    }
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
            </label>
          ))}
        </div>
      </div>
      <p className="text-sm font-medium text-indigo-600 dark:text-indigo-300">{meetingSummary}</p>
    </section>
  );
}
