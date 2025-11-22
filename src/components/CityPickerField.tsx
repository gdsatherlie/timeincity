import { useEffect, useMemo, useState } from "react";
import type { KeyboardEvent } from "react";

import { findCityBySlug, type CityConfig } from "../data/cities";
import { searchCities } from "../utils/cityData";
import { formatCityDisplay } from "../utils/formatCityDisplay";

interface CityPickerFieldProps {
  label: string;
  value: CityConfig;
  onSelect: (city: CityConfig) => void;
  variant?: "light" | "dark";
}

export function CityPickerField({ label, value, onSelect, variant = "dark" }: CityPickerFieldProps): JSX.Element {
  const [query, setQuery] = useState(() => formatCityDisplay(value));
  const [isFocused, setIsFocused] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const [results, setResults] = useState<CityConfig[]>([value]);

  useEffect(() => {
    setQuery(formatCityDisplay(value));
  }, [value]);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      const matches = searchCities(query, 8)
        .map((match) => findCityBySlug(match.slug))
        .filter((city): city is CityConfig => Boolean(city));
      setResults(matches.length ? matches : [value]);
      setHighlightIndex(0);
    }, 200);
    return () => window.clearTimeout(handle);
  }, [query, value]);

  const highlighted = useMemo(() => results[highlightIndex], [results, highlightIndex]);

  const handleSelect = (city: CityConfig) => {
    onSelect(city);
    setQuery(formatCityDisplay(city));
    setIsFocused(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!isFocused || results.length === 0) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightIndex((prev) => (prev + 1) % results.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (event.key === "Enter" && highlighted) {
      event.preventDefault();
      handleSelect(highlighted);
    }
  };

  const baseInputClasses =
    variant === "dark"
      ? "rounded-2xl border border-slate-700 bg-slate-800/80 px-4 py-3 text-base text-slate-100 shadow-inner shadow-slate-950 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      : "rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-300";

  const dropdownClasses =
    variant === "dark"
      ? "border-slate-700 bg-slate-900 text-slate-100"
      : "border-slate-200 bg-white text-slate-900";

  return (
    <div className="relative">
      <label className="flex flex-col gap-2 text-sm font-medium">
        <span className={variant === "dark" ? "text-slate-200" : "text-slate-700"}>{label}</span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 120)}
          onKeyDown={handleKeyDown}
          className={baseInputClasses}
          placeholder="Search city"
        />
      </label>
      {isFocused && results.length ? (
        <ul
          className={`absolute left-0 right-0 z-30 mt-2 max-h-64 overflow-y-auto rounded-2xl border ${dropdownClasses} p-2 shadow-xl shadow-slate-900/20`}
        >
          {results.map((city, index) => (
            <li key={city.slug}>
              <button
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => handleSelect(city)}
                className={`flex w-full flex-col rounded-2xl px-3 py-2 text-left text-sm transition ${
                  highlightIndex === index
                    ? "bg-indigo-500/10 text-indigo-300"
                    : variant === "dark"
                      ? "text-slate-200"
                      : "text-slate-700"
                }`}
              >
                <span className="font-semibold">{formatCityDisplay(city)}</span>
                <span className="text-xs opacity-75">{city.timezone}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
