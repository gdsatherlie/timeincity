import type { CityConfig } from "../data/cities";
import { getCitySeoCopy } from "../utils/citySeo";

interface CitySeoSectionProps {
  city: CityConfig;
}

export function CitySeoSection({ city }: CitySeoSectionProps): JSX.Element {
  const copy = getCitySeoCopy(city);
  return (
    <section className="rounded-3xl border border-slate-200/70 bg-white/80 p-8 shadow-lg shadow-slate-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
      <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">{copy.heading}</h1>
      <div className="mt-4 space-y-4 text-base text-slate-600 dark:text-slate-300">
        <p>{copy.intro}</p>
        <p>{copy.paragraph}</p>
      </div>
    </section>
  );
}
