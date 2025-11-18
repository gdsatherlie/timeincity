import { useMemo, useState } from "react";

import { CITY_CONFIG_LIST, CityConfig } from "../data/cities";

interface CitySearchProps {
  onSelectCity: (city: CityConfig) => void;
  className?: string;
}

function formatLocation(city: CityConfig): string {
  return [city.stateOrRegion, city.country].filter(Boolean).join(", ");
}

export function CitySearch({ onSelectCity, className }: CitySearchProps): JSX.Element {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const sortedCities = useMemo(() => [...CITY_CONFIG_LIST].sort((a, b) => a.name.localeCompare(b.name)), []);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return sortedCities.slice(0, 8);
    }

    return sortedCities
      .filter((city) => {
        const haystacks = [city.name, city.country, city.stateOrRegion]
          .filter(Boolean)
          .map((value) => value!.toLowerCase());
        return haystacks.some((value) => value.includes(normalized));
      })
      .slice(0, 8);
  }, [query, sortedCities]);

  const handleSelect = (city: CityConfig) => {
    onSelectCity(city);
    setQuery("");
    setIsFocused(false);
  };

  return (
    <div className={`relative ${className ?? ""}`}>
      <label className="sr-only" htmlFor="city-search">
        Search city
      </label>
      <input
        id="city-search"
        type="text"
        placeholder="Search city..."
        value={query}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 150)}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && filtered[0]) {
            event.preventDefault();
            handleSelect(filtered[0]);
          }
        }}
        className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-base text-slate-800 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
      />
      {isFocused && filtered.length > 0 && (
        <ul className="absolute left-0 right-0 top-full z-10 mt-2 max-h-64 overflow-y-auto rounded-2xl border border-slate-200 bg-white text-sm shadow-2xl dark:border-slate-700 dark:bg-slate-800">
          {filtered.map((city) => (
            <li key={city.slug}>
              <button
                type="button"
                onClick={() => handleSelect(city)}
                className="flex w-full flex-col gap-0.5 px-4 py-3 text-left text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-700 focus:outline-none focus-visible:bg-indigo-50 focus-visible:text-indigo-700 dark:text-slate-200 dark:hover:bg-slate-700/60"
              >
                <span className="font-semibold">{city.name}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {formatLocation(city) || city.timezone}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
