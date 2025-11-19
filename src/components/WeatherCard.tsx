const iconClass = "h-5 w-5 text-indigo-500 dark:text-indigo-300";

const ThermometerIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={iconClass}>
    <path d="M10 5a2 2 0 1 1 4 0v7.5a4 4 0 1 1-4 0Z" />
    <path d="M12 2v3" />
  </svg>
);

const WindIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={iconClass}>
    <path d="M4 12h8a3 3 0 1 0-3-3" />
    <path d="M2 16h13a3 3 0 1 1-3 3" />
  </svg>
);

const RainIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={iconClass}>
    <path d="M7 18l1.5-3" />
    <path d="M12 18l1.5-3" />
    <path d="M17 18l1.5-3" />
    <path d="M6 10a6 6 0 0 1 11.31-3" />
    <path d="M18 10h1a3 3 0 1 1 0 6H6a4 4 0 0 1 0-8" />
  </svg>
);

const SunriseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={iconClass}>
    <path d="M12 19V9" />
    <path d="M9 12l3-3 3 3" />
    <path d="M5 21h14" />
    <path d="M4 17h16" />
    <path d="M7 5l1.5 1.5" />
    <path d="M17 6.5L18.5 5" />
    <path d="M12 3v2" />
  </svg>
);

const SunsetIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={iconClass}>
    <path d="M12 5v10" />
    <path d="M15 12l-3 3-3-3" />
    <path d="M5 21h14" />
    <path d="M4 17h16" />
    <path d="M7 7l1.5-1.5" />
    <path d="M17 5.5L18.5 7" />
    <path d="M12 19v2" />
  </svg>
);

interface WeatherCardProps {
  status: "idle" | "loading" | "error" | "success";
  cityLabel: string;
  data?: {
    temperatureC: number;
    temperatureF: number;
    precipitation: number;
    windSpeed: number;
    sunrise: string;
    sunset: string;
    country?: string;
    state?: string;
  };
  error?: string;
}

const formatMetricValue = (value: number, suffix: string) =>
  Number.isFinite(value) ? `${value.toFixed(1)}${suffix}` : `--${suffix}`;

interface MetricCardProps {
  icon: JSX.Element;
  label: string;
  value: string;
}

function MetricCard({ icon, label, value }: MetricCardProps) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-white/60 bg-white/80 p-4 text-slate-900 shadow-sm shadow-slate-900/5 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100">
      <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-300">
        {icon}
        <span>{label}</span>
      </div>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  );
}

export function WeatherCard({ status, cityLabel, data, error }: WeatherCardProps): JSX.Element {
  const description = () => {
    switch (status) {
      case "loading":
        return "Fetching the latest weather...";
      case "error":
        return error ?? "Could not load weather right now.";
      case "idle":
        return "Select a city to view live weather.";
      default:
        if (!data) {
          return "";
        }
        return `${formatMetricValue(data.temperatureC, "°C")} / ${formatMetricValue(
          data.temperatureF,
          "°F"
        )} • wind ${formatMetricValue(data.windSpeed, " km/h")} • precip ${formatMetricValue(data.precipitation, " mm")}`;
    }
  };

  const locationLine = [data?.state, data?.country].filter(Boolean).join(", ");
  const summary = description();

  return (
    <section className="flex flex-col gap-6 rounded-3xl border border-slate-200/70 bg-gradient-to-br from-slate-50 via-sky-50 to-indigo-100/60 p-6 text-slate-900 shadow-lg shadow-slate-900/5 dark:border-slate-800 dark:from-slate-900/80 dark:via-slate-900/60 dark:to-slate-900/40 dark:text-slate-100">
      <header className="flex flex-col gap-1">
        <p className="text-base font-semibold text-slate-700 dark:text-slate-200">Weather in {cityLabel}</p>
        {locationLine ? <p className="text-sm text-slate-600 dark:text-slate-400">{locationLine}</p> : null}
      </header>
      <p className="text-lg font-medium text-slate-700 dark:text-slate-200">{summary}</p>
      {status === "success" && data ? (
        <div className="flex flex-col gap-4">
          <div className="grid gap-4 md:grid-cols-3">
            <MetricCard
              icon={<ThermometerIcon />}
              label="Temperature"
              value={`${formatMetricValue(data.temperatureC, "°C")} / ${formatMetricValue(data.temperatureF, "°F")}`}
            />
            <MetricCard icon={<WindIcon />} label="Wind" value={formatMetricValue(data.windSpeed, " km/h")} />
            <MetricCard icon={<RainIcon />} label="Precipitation" value={formatMetricValue(data.precipitation, " mm")} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <MetricCard icon={<SunriseIcon />} label="Sunrise" value={data.sunrise} />
            <MetricCard icon={<SunsetIcon />} label="Sunset" value={data.sunset} />
          </div>
        </div>
      ) : null}
    </section>
  );
}
