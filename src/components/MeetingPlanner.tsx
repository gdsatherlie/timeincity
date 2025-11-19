import { DateTime } from "luxon";

type LuxonDateTime = ReturnType<typeof DateTime.now>;
import { useMemo, useState } from "react";

import type { CityConfig } from "../data/cities";
import { formatCityDisplay } from "../utils/formatCityDisplay";
import { CityPickerField } from "./CityPickerField";

interface MeetingPlannerProps {
  cities: CityConfig[];
  initialCitySlug?: string;
}

function formatInputValue(date: LuxonDateTime): string {
  return date.toFormat("yyyy-LL-dd'T'HH:mm");
}

export function MeetingPlanner({ cities, initialCitySlug }: MeetingPlannerProps): JSX.Element {
  const defaultCity = cities.find((city) => city.slug === initialCitySlug) ?? cities[0];
  const [fromCity, setFromCity] = useState<CityConfig>(defaultCity);
  const [toCity, setToCity] = useState<CityConfig>(() => cities.find((city) => city.slug === "tokyo") ?? cities[1] ?? cities[0]);
  const [inputValue, setInputValue] = useState(() => formatInputValue(DateTime.now().setZone(fromCity.timezone)));

  const baseTime = useMemo(() => DateTime.fromISO(inputValue, { zone: fromCity.timezone }), [fromCity.timezone, inputValue]);

  const meetingSummary = useMemo(() => {
    if (!baseTime.isValid) {
      return "Select a date and time to convert.";
    }
    const converted = baseTime.setZone(toCity.timezone);
    return `If it is ${baseTime.toFormat("MMM d, h:mm a")} in ${formatCityDisplay(fromCity)}, it will be ${converted.toFormat(
      "MMM d, h:mm a"
    )} in ${formatCityDisplay(toCity)}.`;
  }, [baseTime, fromCity, toCity]);

  const segments = useMemo(() => {
    const reference = baseTime.isValid ? baseTime.startOf("day") : DateTime.now().setZone(fromCity.timezone).startOf("day");
    return Array.from({ length: 12 }, (_, index) => {
      const slotA = reference.plus({ hours: index * 2 });
      const slotB = slotA.setZone(toCity.timezone);
      const businessA = slotA.hour >= 8 && slotA.hour < 18;
      const businessB = slotB.hour >= 8 && slotB.hour < 18;
      let status: "overlap" | "partial" | "off" = "off";
      if (businessA && businessB) {
        status = "overlap";
      } else if (businessB) {
        status = "partial";
      }
      return { slotA, slotB, status };
    });
  }, [baseTime, fromCity.timezone, toCity.timezone]);

  return (
    <section
      id="meeting-planner"
      className="flex flex-col gap-5 rounded-3xl border border-slate-900/40 bg-slate-900 px-6 py-6 text-slate-100 shadow-[0_30px_80px_-40px_rgba(15,23,42,1)]"
    >
      <header className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold">Plan a meeting across time zones</h2>
        <p className="text-sm text-slate-300">
          Choose a city, pick the date and time, and instantly see what it becomes elsewhere. The grid highlights working-hour overlap so you know when to meet.
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
          <CityPickerField label="City A" value={fromCity} onSelect={(city) => setFromCity(city)} />
          <CityPickerField label="City B" value={toCity} onSelect={setToCity} />
        </div>
      </div>
      <div className="rounded-2xl border border-slate-800 bg-slate-800/80 px-4 py-3 text-sm text-indigo-100">{meetingSummary}</div>
      <div className="space-y-3 rounded-3xl border border-slate-800 bg-slate-800/80 px-4 py-4">
        {[{ label: formatCityDisplay(fromCity), type: "slotA" }, { label: formatCityDisplay(toCity), type: "slotB" }].map((row) => (
          <div key={row.label}>
            <p className="mb-2 text-xs uppercase tracking-[0.2em] text-slate-400">{row.label}</p>
            <div className="grid grid-cols-[repeat(12,minmax(0,1fr))] gap-1">
              {segments.map((segment) => {
                const time = row.type === "slotA" ? segment.slotA : segment.slotB;
                const isBusiness = time.hour >= 8 && time.hour < 18;
                let color = "bg-slate-700";
                if (segment.status === "overlap") {
                  color = "bg-emerald-500/70";
                } else if (segment.status === "partial" && row.type === "slotB") {
                  color = "bg-amber-500/60";
                } else if (isBusiness && row.type === "slotA") {
                  color = "bg-sky-500/50";
                }
                return (
                  <span
                    key={`${row.type}-${segment.slotA.toISO()}-${segment.slotB.toISO()}`}
                    className={`rounded-xl px-1 py-3 text-center text-xs font-semibold text-white ${color}`}
                  >
                    {time.toFormat("HH")}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
