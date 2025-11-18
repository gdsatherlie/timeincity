import type { MouseEvent } from "react";

import type { CityConfig } from "../data/cities";
import type { RegionPageContent } from "../data/regions";

interface RegionPageProps {
  content: RegionPageContent;
  cities: CityConfig[];
  onSelectCity: (city: CityConfig) => void;
}

function isModifiedEvent(event: MouseEvent<HTMLAnchorElement>): boolean {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0;
}

export function RegionPage({ content, cities, onSelectCity }: RegionPageProps): JSX.Element {
  const countLabel = content.slug === "all-cities" ? cities.length.toLocaleString() : cities.length.toString();

  return (
    <section className="flex flex-col gap-6 rounded-3xl border border-slate-200/70 bg-white/80 p-6 text-slate-700 shadow-lg shadow-slate-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-200">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">{content.heading}</h1>
        {content.paragraphs.map((paragraph, index) => (
          <p key={index} className="text-base leading-relaxed">
            {paragraph}
          </p>
        ))}
      </header>
      <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-inner dark:border-slate-700 dark:bg-slate-900/70">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Browse cities</p>
            <p className="text-base text-slate-700 dark:text-slate-200">{countLabel} destinations</p>
          </div>
        </div>
        <div className="mt-4 max-h-[520px] overflow-y-auto pr-1">
          <ul className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm font-medium leading-relaxed text-slate-700 dark:text-slate-300 sm:grid-cols-3 lg:grid-cols-4">
            {cities.map((city) => (
              <li key={city.slug}>
                <a
                  href={`/city/${city.slug}`}
                  className="inline-flex w-full items-center py-1 text-left transition hover:text-indigo-600 dark:hover:text-indigo-300"
                  onClick={(event) => {
                    if (isModifiedEvent(event)) {
                      return;
                    }
                    event.preventDefault();
                    onSelectCity(city);
                  }}
                >
                  {city.name}
                  <span className="ml-2 text-xs font-normal text-slate-500 dark:text-slate-400">
                    {[city.stateOrRegion, city.country].filter(Boolean).join(", ") || city.timezone}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
