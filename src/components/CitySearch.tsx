import { useMemo, useState } from "react";

import type { CityConfig } from "../data/cities";

interface CitySearchProps {
  cities: CityConfig[];
  onSelectCity: (city: CityConfig) => void;
}

export function CitySearch({ cities, onSelectCity }: CitySearchProps): JSX.Element {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const searchable = useMemo(
    () =>
      cities.map((city) => ({
        city,
        haystack: [city.name, city.region, city.country]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
      })),
    [cities]
  );

  const matches = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      return searchable.slice(0, 8).map((entry) => entry.city);
    }
    return searchable
      .filter((entry) => entry.haystack.includes(trimmed))
      .slice(0, 8)
      .map((entry) => entry.city);
  }, [query, searchable]);

  const handleSelect = (city: CityConfig) => {
    onSelectCity(city);
    setQuery(city.name);
    setIsFocused(false);
  };

  const showDropdown = isFocused && matches.length > 0;

  return (
    <div className="mt-6">
      <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Search a city</label>
      <div className="relative mt-2">
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 150)}
          placeholder="Start typing to jump to a city"
          className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-base text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100"
        />
        {showDropdown ? (
          <ul className="absolute z-20 mt-2 w-full rounded-2xl border border-slate-200 bg-white/95 p-2 shadow-xl shadow-slate-900/10 dark:border-slate-700 dark:bg-slate-900">
            {matches.map((city) => (
              <li key={city.slug}>
                <button
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => handleSelect(city)}
                  className="flex w-full flex-col rounded-xl px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-600 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <span className="font-semibold">{city.name}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {[city.region, city.country].filter(Boolean).join(", ") || city.timezone}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
