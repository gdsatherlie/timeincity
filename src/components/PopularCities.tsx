import { CITY_COUNT, CITY_LIST } from "../data/cities";

interface PopularCitiesProps {
  selectedLabel?: string;
  onSelect: (timezone: string, label?: string, slug?: string) => void;
}

export function PopularCities({ selectedLabel, onSelect }: PopularCitiesProps): JSX.Element {
  return (
    <section className="flex flex-col gap-4 rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-lg shadow-slate-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
      <header className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Popular cities</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Browse {CITY_COUNT.toLocaleString()} cities and tap any name to see the exact time zone and weather instantly.
        </p>
      </header>
      <div className="max-h-[32rem] overflow-y-auto pr-1">
        <div className="grid grid-cols-2 gap-y-2 gap-x-4 md:grid-cols-4">
          {CITY_LIST.map((city) => {
            const isActive = city.name === selectedLabel;
            return (
              <button
                key={city.slug}
                type="button"
                onClick={() => onSelect(city.timezone, city.name, city.slug)}
                className={`text-left text-sm font-medium transition hover:text-indigo-600 focus:text-indigo-600 focus:outline-none ${
                  isActive ? "text-indigo-600" : "text-slate-700 dark:text-slate-200"
                }`}
              >
                {city.name}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
