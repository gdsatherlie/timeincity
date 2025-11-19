import { DateTime } from "luxon";
import { useMemo, useState } from "react";

import type { CityConfig } from "../data/cities";
import { formatCityDisplay } from "../utils/formatCityDisplay";
import { CityPickerField } from "./CityPickerField";

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
  const labelA = formatCityDisplay(cityA);
  const labelB = formatCityDisplay(cityB);
  if (diffMinutes === 0) {
    return `${labelA} and ${labelB} share the same current time.`;
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
  return `${labelA} is ${parts.join(" ")} ${ahead ? "ahead of" : "behind"} ${labelB}.`;
}

export function CompareTimes({ cities, initialCitySlug }: CompareTimesProps): JSX.Element {
  const fallbackCity = cities.find((city) => city.slug === initialCitySlug) ?? cities[0];
  const [cityA, setCityA] = useState<CityConfig>(fallbackCity);
  const [cityB, setCityB] = useState<CityConfig>(() => cities.find((city) => city.slug === "london") ?? cities[1] ?? fallbackCity);

  const difference = useMemo(() => describeDifference(cityA, cityB), [cityA, cityB]);
  const now = DateTime.now();
  const timeA = now.setZone(cityA.timezone);
  const timeB = now.setZone(cityB.timezone);

  const swapCities = () => {
    setCityA(cityB);
    setCityB(cityA);
  };

  return (
    <section
      id="compare-times"
      className="flex flex-col gap-5 rounded-3xl border border-slate-900/40 bg-slate-900 px-6 py-6 text-slate-100 shadow-[0_30px_80px_-40px_rgba(15,23,42,1)]"
    >
      <header className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold">Compare city times</h2>
        <p className="text-sm text-slate-300">
          Search for any two cities to see their live times side by side and understand the exact offset in hours and minutes.
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        <CityPickerField label="City A" value={cityA} onSelect={setCityA} />
        <div className="flex flex-col gap-4">
          <CityPickerField label="City B" value={cityB} onSelect={setCityB} />
          <button
            type="button"
            onClick={swapCities}
            className="inline-flex items-center justify-center rounded-2xl border border-slate-700 bg-slate-800/60 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-indigo-400 hover:bg-indigo-500/10"
          >
            Swap cities
          </button>
        </div>
      </div>
      <div className="grid gap-4 text-sm md:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-800/80 px-4 py-3">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{formatCityDisplay(cityA)}</p>
          <p className="text-2xl font-semibold text-white">{timeA.isValid ? timeA.toFormat("HH:mm") : "--:--"}</p>
          <p className="text-xs text-slate-400">{formatNow(cityA.timezone)}</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-800/80 px-4 py-3">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{formatCityDisplay(cityB)}</p>
          <p className="text-2xl font-semibold text-white">{timeB.isValid ? timeB.toFormat("HH:mm") : "--:--"}</p>
          <p className="text-xs text-slate-400">{formatNow(cityB.timezone)}</p>
        </div>
      </div>
      <div className="rounded-2xl border border-slate-800 bg-slate-800/80 px-4 py-3 text-sm text-indigo-100">{difference}</div>
    </section>
  );
}
