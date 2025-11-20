import { CITY_COUNT, CITY_LIST, type CityConfig } from "../data/cities";
import type { RegionSlug } from "../data/cities";
import { formatCityDisplay } from "../utils/formatCityDisplay";

type CityGroup = { region: string; label: string; cities: CityConfig[] };

const REGION_LABELS: Record<Exclude<RegionSlug, "all">, string> = {
  "united-states": "United States",
  "north-america": "North America",
  europe: "Europe",
  asia: "Asia",
  "south-america": "South America",
  africa: "Africa",
  oceania: "Oceania"
};

const REGION_ORDER: Array<Exclude<RegionSlug, "all">> = [
  "united-states",
  "north-america",
  "europe",
  "asia",
  "south-america",
  "africa",
  "oceania"
];

function sortCities(cities: CityConfig[]): CityConfig[] {
  return [...cities].sort((a, b) => formatCityDisplay(a).localeCompare(formatCityDisplay(b)));
}

interface PopularCitiesProps {
  selectedSlug?: string;
  selectedLabel?: string;
  onSelect: (timezone: string, label?: string, slug?: string) => void;
}

export function PopularCities({ selectedSlug, selectedLabel, onSelect }: PopularCitiesProps): JSX.Element {
  const grouped: CityGroup[] = REGION_ORDER
    .map((region) => {
      const cities = sortCities(
        CITY_LIST.filter((city) => {
          if (region === "united-states") return city.countryCode === "US";
          if (region === "north-america") return city.continent === "north-america";
          return city.continent === region;
        })
      );
      return { region, label: REGION_LABELS[region], cities };
    })
    .filter((group) => group.cities.length > 0);

  return (
    <section className="flex flex-col gap-4 rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-lg shadow-slate-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
      <header className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Popular cities</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Tap any city to see the exact time zone and weather instantly.
        </p>
      </header>
      <div className="max-h-[32rem] overflow-y-auto pr-1">
        {grouped.map((group) => (
          <div key={group.region} className="mb-4 last:mb-0">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{group.label}</p>
            <div className="grid grid-cols-2 gap-y-2 gap-x-4 md:grid-cols-4">
              {group.cities.map((city) => {
                const isActive = selectedSlug ? city.slug === selectedSlug : city.name === selectedLabel;
                return (
                  <button
                    key={city.slug}
                    type="button"
                    onClick={() => onSelect(city.timezone, formatCityDisplay(city), city.slug)}
                    className={`text-left text-sm font-medium transition hover:text-indigo-600 focus:text-indigo-600 focus:outline-none ${
                      isActive ? "text-indigo-600" : "text-slate-700 dark:text-slate-200"
                    }`}
                  >
                    {formatCityDisplay(city)}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400">Featuring {CITY_COUNT.toLocaleString()} global cities.</p>
    </section>
  );
}
