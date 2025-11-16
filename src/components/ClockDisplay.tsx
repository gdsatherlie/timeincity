import { DateTime } from "luxon";
import { useEffect, useMemo, useState } from "react";

import { ThemeToggle } from "./ThemeToggle";

interface ClockDisplayProps {
  timezone: string;
  use24Hour: boolean;
  onFormatToggle: () => void;
  locationLabel?: string;
  onSetDefault?: () => void;
  onClearDefault?: () => void;
  onSelectDefault?: () => void;
  isDefaultSelection?: boolean;
  hasDefault?: boolean;
  defaultLabel?: string;
  defaultDifference?: string;
}

export function ClockDisplay({
  timezone,
  use24Hour,
  onFormatToggle,
  locationLabel,
  onSetDefault,
  onClearDefault,
  onSelectDefault,
  isDefaultSelection,
  hasDefault,
  defaultLabel,
  defaultDifference
}: ClockDisplayProps): JSX.Element {
  const createNow = () => {
    const zoned = DateTime.now().setZone(timezone);
    return zoned.isValid ? zoned : DateTime.now();
  };

  const [now, setNow] = useState(createNow);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(createNow());
    }, 1000);

    return () => window.clearInterval(interval);
  }, [timezone]);

  useEffect(() => {
    setNow(createNow());
  }, [timezone]);

  const formattedTime = useMemo(
    () => now.toFormat(use24Hour ? "HH:mm:ss" : "hh:mm:ss a"),
    [now, use24Hour]
  );

  const formattedDate = useMemo(() => now.toFormat("EEEE, MMMM d, yyyy"), [now]);

  const timezoneDisplay = useMemo(() => {
    const offset = now.toFormat("ZZZZ");
    const abbreviation = now.offsetNameShort;
    const pieces = [offset, abbreviation].filter(Boolean).join(" • ");
    return pieces ? `${timezone} (${pieces})` : timezone;
  }, [now, timezone]);

  return (
    <section className="flex flex-col gap-6 rounded-3xl border border-slate-200/70 bg-white/80 p-8 shadow-xl shadow-slate-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-black/30">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-lg text-slate-500 dark:text-slate-400">Current time</p>
          {locationLabel && (
            <p className="text-2xl font-semibold text-slate-700 dark:text-slate-200">{locationLabel}</p>
          )}
          <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl md:text-7xl">{formattedTime}</h1>
          <p className="text-xl text-slate-600 dark:text-slate-300">{formattedDate}</p>
          <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
            Time zone: <span className="font-semibold text-slate-700 dark:text-slate-200">{timezoneDisplay}</span>
          </p>
        </div>
        <ThemeToggle className="self-start sm:self-start sm:ml-auto" />
      </div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onFormatToggle}
              className="rounded-full border border-indigo-200 bg-indigo-50 px-5 py-2 text-sm font-medium text-indigo-700 transition hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:border-indigo-900 dark:bg-indigo-950/80 dark:text-indigo-200 dark:hover:bg-indigo-900/70"
            >
              Switch to {use24Hour ? "12" : "24"}-hour
            </button>
            {onSetDefault && (
              <button
                type="button"
                onClick={isDefaultSelection ? undefined : onSetDefault}
                disabled={isDefaultSelection}
                className={`rounded-full border px-5 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                  isDefaultSelection
                    ? "cursor-default border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/70 dark:text-emerald-200"
                    : "border-indigo-200 bg-white/70 text-slate-800 hover:bg-white dark:border-indigo-900 dark:bg-slate-900/70 dark:text-slate-100"
                }`}
              >
                {isDefaultSelection ? "Default city" : "Set as default city"}
              </button>
            )}
            {hasDefault && !isDefaultSelection && onClearDefault && (
              <button
                type="button"
                onClick={onClearDefault}
                className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200"
              >
                Clear saved default
              </button>
            )}
          </div>
          {hasDefault && defaultLabel && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Saved default city:
              <button
                type="button"
                onClick={isDefaultSelection ? undefined : onSelectDefault}
                disabled={isDefaultSelection}
                className={`ml-2 font-semibold transition hover:text-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-400 dark:hover:text-indigo-300 ${
                  isDefaultSelection ? "cursor-default text-slate-400 dark:text-slate-500" : "text-slate-800 dark:text-slate-100"
                }`}
              >
                {defaultLabel}
              </button>
              {defaultDifference && (
                <span className="ml-2 text-slate-500 dark:text-slate-400">• {defaultDifference}</span>
              )}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
