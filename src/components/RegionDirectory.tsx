import type { CityConfig } from "../data/cities";

interface RegionDirectoryProps {
  heading: string;
  description: string;
  cities: CityConfig[];
  onNavigate: (path: string) => void;
}

export function RegionDirectory({ heading, description, cities, onNavigate }: RegionDirectoryProps): JSX.Element {
  return (
    <section className="rounded-3xl border border-slate-200/70 bg-white/80 p-8 shadow-lg shadow-slate-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
      <header className="mb-4">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">{heading}</h1>
        <p className="mt-2 text-base text-slate-600 dark:text-slate-300">{description}</p>
      </header>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {cities.map((city) => (
          <button
            key={city.slug}
            type="button"
            onClick={() => onNavigate(`/city/${city.slug}`)}
            className="rounded-2xl border border-slate-200/70 bg-white/70 px-4 py-3 text-left font-medium text-slate-700 transition hover:border-indigo-200 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100"
          >
            {city.name}
            {city.country ? <span className="ml-2 text-sm text-slate-500 dark:text-slate-400">{city.country}</span> : null}
          </button>
        ))}
      </div>
    </section>
  );
}
