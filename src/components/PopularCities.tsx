import type { MouseEvent } from "react";

import { CITY_CONFIGS } from "../data/cities";
import { POPULAR_CITIES, POPULAR_CITIES_COUNT } from "../data/popularCities";
import { slugifyCity } from "../utils/slugifyCity";

interface PopularCitiesProps {
  selectedLabel?: string;
  onSelect: (timezone: string, label?: string) => void;
  id?: string;
}

function isModifiedEvent(event: MouseEvent<HTMLAnchorElement>): boolean {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0;
}

export function PopularCities({ selectedLabel, onSelect, id }: PopularCitiesProps): JSX.Element {
  return (
    <section
      id={id}
      className="flex flex-col gap-4 rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-lg shadow-slate-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70"
    >
      <header className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Popular cities</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Browse {POPULAR_CITIES_COUNT.toLocaleString()} cities in alphabetical order. Tap any name to open its clock.
        </p>
      </header>
      <div className="max-h-[480px] overflow-y-auto pb-1">
        <ul className="grid gap-x-6 gap-y-2 text-xs font-medium leading-relaxed text-slate-700 dark:text-slate-300 sm:text-sm sm:grid-cols-3 lg:grid-cols-4">
          {POPULAR_CITIES.map((city) => {
            const slug = slugifyCity(city.label);
            const hasLandingPage = Boolean(slug && CITY_CONFIGS[slug]);
            const href = hasLandingPage ? `/city/${slug}` : "#";
            const isActive = city.label === selectedLabel;

            return (
              <li key={city.label}>
                <a
                  href={href}
                  className={`inline-flex w-full items-center rounded-md px-1 py-1 transition ${
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
