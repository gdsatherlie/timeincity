import { CityConfig, getCitySeoCopy } from "../data/cities";

interface CitySeoSectionProps {
  city: CityConfig;
}

export function CitySeoSection({ city }: CitySeoSectionProps): JSX.Element {
  const copy = getCitySeoCopy(city);
  return (
    <section className="flex flex-col gap-4 rounded-3xl border border-slate-200/70 bg-white/80 p-6 text-slate-700 shadow-lg shadow-slate-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-200">
      <header>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{copy.heading}</h2>
        <p className="mt-2 text-base leading-relaxed">{copy.intro}</p>
      </header>
      <p className="text-base leading-relaxed">{copy.paragraph}</p>
      <div className="grid gap-3 text-sm sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/70">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Local details</p>
          <p className="mt-2 text-base font-semibold text-slate-900 dark:text-slate-100">
            {[city.name, city.stateOrRegion, city.country].filter(Boolean).join(", ")}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/70">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Share this page</p>
          <p className="mt-2 text-base font-semibold text-slate-900 dark:text-slate-100">Send /city/{city.slug} so teammates load the same time zone</p>
        </div>
      </div>
    </section>
  );
}
