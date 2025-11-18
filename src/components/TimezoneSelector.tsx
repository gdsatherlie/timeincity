interface TimezoneSelectorProps {
  timezones: string[];
  selectedTimezone: string;
  onSelect: (timezone: string, label?: string) => void;
  variant?: "card" | "embedded";
  title?: string;
  description?: string;
  className?: string;
}

export function TimezoneSelector({
  timezones,
  selectedTimezone,
  onSelect,
  variant = "card",
  title = "Choose a city or time zone",
  description = "Select any IANA time zone",
  className
}: TimezoneSelectorProps): JSX.Element {
  const ContainerTag = variant === "embedded" ? "div" : "section";
  const baseContainerClasses =
    variant === "embedded"
      ? "flex flex-col gap-4 rounded-2xl border border-slate-200/70 bg-white/70 p-4 shadow-inner shadow-slate-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/60"
      : "flex flex-col gap-4 rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-lg shadow-slate-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70";

  return (
    <ContainerTag className={`${baseContainerClasses} ${className ?? ""}`.trim()}>
      {title && (
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
          </div>
        </header>
      )}
      <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
        {description ? <span>{description}</span> : null}
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
    </ContainerTag>
  );
}
