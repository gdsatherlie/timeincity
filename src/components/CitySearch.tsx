import { useEffect, useMemo, useState } from "react";
import type { KeyboardEvent } from "react";

import { searchCities, type NormalizedCity } from "../utils/cityData";
import { formatCityDisplay } from "../utils/formatCityDisplay";

interface CitySearchProps {
  onSelectCity: (slug: string) => void;
  placeholder?: string;
  label?: string;
}

export function CitySearch({ onSelectCity, placeholder = "Search city…", label }: CitySearchProps): JSX.Element {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const [results, setResults] = useState<NormalizedCity[]>(() => searchCities("", 10));

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setResults(searchCities(query, 10));
      setHighlightIndex(0);
    }, 200);
    return () => window.clearTimeout(handle);
  }, [query]);

  const visible = isFocused && results.length > 0;

  const highlightedCity = useMemo(() => results[highlightIndex], [highlightIndex, results]);

  const handleSelect = (city: NormalizedCity) => {
    onSelectCity(city.slug);
    setQuery(
      formatCityDisplay({
        name: city.name,
        region: city.state ?? undefined,
        country: city.country,
        countryCode: city.countryCode
      })
    );
    setIsFocused(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!visible) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightIndex((prev) => (prev + 1) % results.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (event.key === "Enter" && highlightedCity) {
      event.preventDefault();
      handleSelect(highlightedCity);
    }
  };

  return (
    <div className="relative z-10">
      {label ? (
        <p className="mb-2 text-sm font-semibold text-slate-600 dark:text-slate-200">{label}</p>
      ) : null}
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 150)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-200 bg-white/90 px-5 py-3 text-base text-slate-900 shadow-lg shadow-slate-900/5 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-100"
      />
      {visible ? (
        <ul className="absolute left-0 right-0 z-50 mt-2 max-h-80 overflow-y-auto rounded-2xl border border-slate-200 bg-white/95 p-2 shadow-2xl shadow-slate-900/20 dark:border-slate-800 dark:bg-slate-900">
          {results.map((city, index) => (
            <li key={city.slug}>
              <button
                type="button"
                className={`flex w-full flex-col rounded-2xl px-4 py-2 text-left text-sm transition hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-slate-800 ${
                  highlightIndex === index ? "bg-indigo-50 text-indigo-600 dark:bg-slate-800 dark:text-indigo-300" : "text-slate-700 dark:text-slate-200"
                }`}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => handleSelect(city)}
              >
                <span className="font-semibold">
                  {formatCityDisplay({
                    name: city.name,
                    region: city.state ?? undefined,
                    country: city.country,
                    countryCode: city.countryCode
                  })}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">{city.timezone}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
