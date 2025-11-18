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
          Browse {POPULAR_CITIES_COUNT.toLocaleString()} major destinations in alphabetical order. Tap any city name to open its clock.
        </p>
      </header>
      <div className="max-h-[32rem] overflow-y-auto pr-1">
        <ul className="grid gap-x-4 gap-y-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300 sm:grid-cols-2 lg:grid-cols-3">
          {POPULAR_CITIES.map((city) => {
            const slug = slugifyCity(city.label);
            const hasLandingPage = Boolean(slug && CITY_CONFIGS[slug]);
            const href = hasLandingPage ? `/city/${slug}` : "#";
            const isActive = city.label === selectedLabel;

            return (
              <li key={city.label}>
                <a
                  href={href}
                  className={`inline-flex items-center text-sm ${
                    isActive
                      ? "font-semibold text-indigo-600 dark:text-indigo-300"
                      : "text-slate-700 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-300"
                  }`}
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
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
