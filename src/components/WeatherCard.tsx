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
    state?: string;
    country?: string;
  };
  error?: string;
}

function SunriseIcon(): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M3 18h18" strokeLinecap="round" />
      <path d="M7 14a5 5 0 0 1 10 0" strokeLinecap="round" />
      <path d="M12 6V3" strokeLinecap="round" />
      <path d="m5 10 2 2" strokeLinecap="round" />
      <path d="m19 10-2 2" strokeLinecap="round" />
    </svg>
  );
}

function SunsetIcon(): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M3 18h18" strokeLinecap="round" />
      <path d="M7 14a5 5 0 0 1 10 0" strokeLinecap="round" />
      <path d="M12 6v3" strokeLinecap="round" />
      <path d="m5 8 2 2" strokeLinecap="round" />
      <path d="m19 8-2 2" strokeLinecap="round" />
    </svg>
  );
}

function ThermometerIcon(): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M14 14.76V5a2 2 0 0 0-4 0v9.76a4 4 0 1 0 4 0Z" />
      <path d="M8 9h8" strokeLinecap="round" />
    </svg>
  );
}

function WindIcon(): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M3 12h12a3 3 0 1 0-3-3" strokeLinecap="round" />
      <path d="M4 18h9a2 2 0 1 0-2-2" strokeLinecap="round" />
    </svg>
  );
}

function RainIcon(): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M7 3v4" strokeLinecap="round" />
      <path d="M17 3v4" strokeLinecap="round" />
      <path d="M5 14h14a4 4 0 1 0-1.09-7.86" strokeLinecap="round" />
      <path d="M8 19l-1 2" strokeLinecap="round" />
      <path d="M12 19l-1 2" strokeLinecap="round" />
      <path d="M16 19l-1 2" strokeLinecap="round" />
    </svg>
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

        const formatNumber = (value: number, unit: string) =>
          Number.isFinite(value) ? `${value.toFixed(1)}${unit}` : `--${unit}`;

        return `${formatNumber(data.temperatureC, "°C")} / ${formatNumber(data.temperatureF, "°F")} • wind ${formatNumber(data.windSpeed, " km/h")} • precip ${formatNumber(data.precipitation, " mm")}`;
    }
  };

  const metrics = data
    ? [
        {
          label: "Temperature",
          value: `${Number.isFinite(data.temperatureC) ? `${data.temperatureC.toFixed(1)}°C` : "--°C"} / ${
            Number.isFinite(data.temperatureF) ? `${data.temperatureF.toFixed(1)}°F` : "--°F"
          }`,
          icon: <ThermometerIcon />
        },
        {
          label: "Wind",
          value: Number.isFinite(data.windSpeed) ? `${data.windSpeed.toFixed(1)} km/h` : "-- km/h",
          icon: <WindIcon />
        },
        {
          label: "Precipitation",
          value: Number.isFinite(data.precipitation) ? `${data.precipitation.toFixed(1)} mm` : "-- mm",
          icon: <RainIcon />
        }
      ]
    : [];

  return (
    <section className="flex flex-col gap-4 rounded-3xl border border-slate-200/70 bg-gradient-to-br from-sky-50 to-indigo-100/80 p-6 text-slate-800 shadow-lg shadow-slate-900/10 backdrop-blur dark:border-slate-800 dark:from-slate-900/80 dark:to-slate-900/30 dark:text-slate-100 dark:shadow-black/20">
      <header>
        <h2 className="text-xl font-semibold">Weather in {cityLabel}</h2>
        {(data?.state || data?.country) && (
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {[data?.state, data?.country].filter(Boolean).join(", ")}
          </p>
        )}
      </header>
      <p className="text-base leading-relaxed">{description()}</p>
      {status === "success" && data && (
        <>
          <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="flex items-center gap-3 rounded-2xl bg-white/80 p-4 shadow-sm dark:bg-slate-900/70"
              >
                <span className="text-indigo-500 dark:text-indigo-300">{metric.icon}</span>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{metric.label}</p>
                  <p className="text-base font-semibold text-slate-800 dark:text-slate-100">{metric.value}</p>
                </div>
              </div>
            ))}
          </div>
          <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-2xl bg-white/80 p-4 shadow-sm dark:bg-slate-900/70">
              <span className="text-amber-500 dark:text-amber-300">
                <SunriseIcon />
              </span>
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Sunrise</dt>
                <dd className="text-lg font-semibold text-slate-800 dark:text-slate-100">{data.sunrise}</dd>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-white/80 p-4 shadow-sm dark:bg-slate-900/70">
              <span className="text-rose-500 dark:text-rose-300">
                <SunsetIcon />
              </span>
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Sunset</dt>
                <dd className="text-lg font-semibold text-slate-800 dark:text-slate-100">{data.sunset}</dd>
              </div>
            </div>
          </dl>
        </>
      )}
    </section>
  );
}
