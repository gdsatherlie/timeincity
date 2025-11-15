interface TimezoneSelectorProps {
  timezones: string[];
  selectedTimezone: string;
  onSelect: (timezone: string, label?: string) => void;
  onSetDefault: () => void;
  onClearDefault: () => void;
  isDefaultSelection: boolean;
  hasDefault: boolean;
  defaultLabel?: string;
}

export function TimezoneSelector({
  timezones,
  selectedTimezone,
  onSelect,
  onSetDefault,
  onClearDefault,
  isDefaultSelection,
  hasDefault,
  defaultLabel
}: TimezoneSelectorProps): JSX.Element {
  return (
    <section className="flex flex-col gap-4 rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-lg shadow-slate-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Choose a city or time zone</h2>
        </div>
      </header>
      <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
        <span>Select any IANA time zone</span>
        <select
          value={selectedTimezone}
          onChange={(event) => onSelect(event.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base font-normal text-slate-800 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        >
          {timezones.map((zone) => (
            <option key={zone} value={zone}>
              {zone}
            </option>
          ))}
        </select>
      </label>
      <div className="flex flex-col gap-2 text-sm text-slate-600 dark:text-slate-400">
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onSetDefault}
            disabled={isDefaultSelection}
            className={`rounded-full border px-4 py-2 font-medium transition focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
              isDefaultSelection
                ? "cursor-default border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/70 dark:text-emerald-200"
                : "border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:border-indigo-900 dark:bg-indigo-950/80 dark:text-indigo-200 dark:hover:bg-indigo-900/70"
            }`}
          >
            {isDefaultSelection ? "This is your default city" : "Set this city as my default"}
          </button>
          {hasDefault && !isDefaultSelection && (
            <button
              type="button"
              onClick={onClearDefault}
              className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 font-medium text-slate-700 transition hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200"
            >
              Clear saved default
            </button>
          )}
        </div>
        {hasDefault && defaultLabel && (
          <p className="text-xs">
            Saved default city: <span className="font-semibold text-slate-800 dark:text-slate-100">{defaultLabel}</span>
          </p>
        )}
      </div>
    </section>
  );
}
