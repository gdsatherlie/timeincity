import type { MouseEvent } from "react";

import { CITY_CONFIGS } from "../data/cities";
import { POPULAR_CITIES, POPULAR_CITIES_COUNT } from "../data/popularCities";
import { slugifyCity } from "../utils/slugifyCity";

interface PopularCitiesProps {
  selectedLabel?: string;
  onSelect: (timezone: string, label?: string) => void;
}

function isModifiedEvent(event: MouseEvent<HTMLAnchorElement>): boolean {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0;
}

export function PopularCities({ selectedLabel, onSelect }: PopularCitiesProps): JSX.Element {
  return (
    <section className="flex flex-col gap-4 rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-lg shadow-slate-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
      <header className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Popular cities</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Browse {POPULAR_CITIES_COUNT.toLocaleString()} major destinations. Scroll to explore and tap a city to jump straight to its time zone.
        </p>
      </header>
      <div className="max-h-[30rem] overflow-y-auto pr-1">
        <div className="flex flex-wrap gap-3">
          {POPULAR_CITIES.map((city) => {
            const slug = slugifyCity(city.label);
            const hasLandingPage = Boolean(slug && CITY_CONFIGS[slug]);
            const href = hasLandingPage ? `/city/${slug}` : "#";
            const isActive = city.label === selectedLabel;

            const baseClasses =
              "inline-flex min-w-[9rem] items-center justify-center rounded-2xl border px-5 py-3 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 sm:text-base";

            const stateClasses = isActive
              ? "border-indigo-500 bg-indigo-500 text-white shadow-lg shadow-indigo-500/30"
              : "border-slate-200 bg-white/90 text-slate-700 shadow-sm hover:border-indigo-200 hover:bg-white dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200";

            return (
              <a
                key={city.label}
                href={href}
                className={`${baseClasses} ${stateClasses}`}
                onClick={(event) => {
                  if (isModifiedEvent(event)) {
                    return;
                  }
                  event.preventDefault();
                  onSelect(city.timezone, city.label);
                }}
              >
                {city.label}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
