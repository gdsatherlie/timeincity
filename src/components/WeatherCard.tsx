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
  };
  error?: string;
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

  return (
    <section className="flex flex-col gap-3 rounded-3xl border border-slate-200/70 bg-gradient-to-br from-sky-50 to-indigo-100/80 p-6 text-slate-800 shadow-lg shadow-slate-900/10 backdrop-blur dark:border-slate-800 dark:from-slate-900/80 dark:to-slate-900/30 dark:text-slate-100 dark:shadow-black/20">
      <header>
        <h2 className="text-xl font-semibold">Weather in {cityLabel}</h2>
        {data?.country && <p className="text-sm text-slate-600 dark:text-slate-400">{data.country}</p>}
      </header>
      <p className="text-base leading-relaxed">{description()}</p>
      {status === "success" && data && (
        <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          <div className="rounded-2xl bg-white/70 p-4 shadow-sm dark:bg-slate-900/70">
            <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Sunrise</dt>
            <dd className="text-lg font-semibold text-slate-800 dark:text-slate-100">{data.sunrise}</dd>
          </div>
          <div className="rounded-2xl bg-white/70 p-4 shadow-sm dark:bg-slate-900/70">
            <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Sunset</dt>
            <dd className="text-lg font-semibold text-slate-800 dark:text-slate-100">{data.sunset}</dd>
          </div>
        </dl>
      )}
    </section>
  );
}
