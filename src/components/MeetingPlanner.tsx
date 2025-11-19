import { DateTime } from "luxon";
import { useMemo, useState } from "react";

import type { CityConfig } from "../data/cities";
import { formatCityDisplay } from "../utils/formatCityDisplay";

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
    return `If it is ${base.toFormat("MMM d, h:mm a")} in ${formatCityDisplay(fromCity)}, it will be ${converted.toFormat(
      "MMM d, h:mm a"
    )} in ${formatCityDisplay(toCity)}.`;
  }, [fromCity, inputValue, toCity]);

  return (
    <section
      id="meeting-planner"
      className="flex flex-col gap-5 rounded-3xl border border-slate-900/40 bg-slate-900 px-6 py-6 text-slate-100 shadow-[0_30px_80px_-40px_rgba(15,23,42,1)]"
    >
      <header className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold">Plan a meeting across time zones</h2>
        <p className="text-sm text-slate-300">
          Choose a city, pick the date and time, and instantly see what it becomes elsewhere. It’s the fastest way to schedule global calls or travel itineraries.
        </p>
      </header>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <label className="flex flex-col gap-2 text-sm font-medium">
          <span className="text-slate-200">Meeting time (City A)</span>
          <input
            type="datetime-local"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            className="rounded-2xl border border-slate-700 bg-slate-800/80 px-4 py-3 text-base text-slate-100 shadow-inner shadow-slate-950 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          {[{ label: "City A", city: fromCity, setter: setFromCity }, { label: "City B", city: toCity, setter: setToCity }].map((entry) => (
            <label key={entry.label} className="flex flex-col gap-2 text-sm font-medium">
              <span className="text-slate-200">{entry.label}</span>
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
                className="rounded-2xl border border-slate-700 bg-slate-800/80 px-4 py-3 text-base text-slate-100 shadow-inner shadow-slate-950 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                {cities.map((city) => (
                  <option key={city.slug} value={city.slug}>
                    {formatCityDisplay(city)}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
      </div>
      <div className="rounded-2xl border border-slate-800 bg-slate-800/80 px-4 py-3 text-sm text-indigo-100">{meetingSummary}</div>
    </section>
  );
}
