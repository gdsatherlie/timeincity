import { POPULAR_CITIES, POPULAR_CITIES_COUNT } from "../data/popularCities";

interface PopularCitiesProps {
  selectedLabel?: string;
  onSelect: (timezone: string, label?: string) => void;
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
            const isActive = city.label === selectedLabel;
            return (
              <button
                key={city.label}
                type="button"
                onClick={() => onSelect(city.timezone, city.label)}
                className={`rounded-2xl border px-5 py-2.5 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-indigo-400 sm:text-base ${
                  isActive
                    ? "border-indigo-500 bg-indigo-500 text-white shadow-lg shadow-indigo-500/30"
                    : "border-slate-200 bg-white/90 text-slate-700 shadow-sm hover:border-indigo-200 hover:bg-white focus-visible:ring-indigo-400 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200"
                }`}
              >
                {city.label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
