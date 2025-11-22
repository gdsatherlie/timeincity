import { DateTime } from "luxon";
import { useEffect, useMemo, useState } from "react";

const SIZE_PRESETS = {
  small: { label: "Small", width: 320, height: 180 },
  medium: { label: "Medium", width: 480, height: 270 },
  large: { label: "Large", width: 640, height: 360 }
} as const;

const PREVIEW_TYPOGRAPHY = {
  small: {
    brand: "text-[0.45rem]",
    zone: "text-[0.55rem]",
    eyebrow: "text-[0.55rem]",
    time: "text-2xl",
    date: "text-[0.7rem]",
    location: "text-sm",
    weather: "text-[0.6rem]"
  },
  medium: {
    brand: "text-[0.55rem]",
    zone: "text-[0.65rem]",
    eyebrow: "text-xs",
    time: "text-3xl",
    date: "text-sm",
    location: "text-base",
    weather: "text-xs"
  },
  large: {
    brand: "text-[0.65rem]",
    zone: "text-[0.75rem]",
    eyebrow: "text-sm",
    time: "text-4xl",
    date: "text-base",
    location: "text-lg",
    weather: "text-sm"
  }
} as const;

const THEMES = ["dark", "light"] as const;

type ThemeOption = (typeof THEMES)[number];
type SizeKey = keyof typeof SIZE_PRESETS;

const BOOLEAN_PRESETS = [
  { label: "Show", value: true },
  { label: "Hide", value: false }
] as const;

interface EmbedConfiguratorProps {
  timezone: string;
  locationLabel?: string;
  weatherSummary?: string;
}

export function EmbedConfigurator({ timezone, locationLabel, weatherSummary }: EmbedConfiguratorProps): JSX.Element {
  const [theme, setTheme] = useState<ThemeOption>("dark");
  const [size, setSize] = useState<SizeKey>("medium");
  const [includeDate, setIncludeDate] = useState(true);
  const [includeWeather, setIncludeWeather] = useState(true);

  const createNow = () => {
    const zoned = DateTime.now().setZone(timezone);
    return zoned.isValid ? zoned : DateTime.now();
  };

  const [previewNow, setPreviewNow] = useState(() => createNow());

  useEffect(() => {
    const update = () => setPreviewNow(createNow());
    update();
    const interval = window.setInterval(update, 1000);
    return () => window.clearInterval(interval);
  }, [timezone]);

  const previewTime = previewNow.toFormat("hh:mm:ss a");
  const previewDate = previewNow.toFormat("EEEE, MMM d");
  const previewZone = previewNow.offsetNameShort || previewNow.toFormat("ZZZZ");
  const previewLocation = locationLabel ?? timezone.split("/").pop()?.replace(/_/g, " ") ?? timezone;

  const dimensions = SIZE_PRESETS[size];
  const previewTypography = PREVIEW_TYPOGRAPHY[size];

  const snippet = useMemo(() => {
    const params = new URLSearchParams({
      tz: timezone,
      theme,
      showDate: includeDate ? "1" : "0",
      showWeather: includeWeather ? "1" : "0"
    });

    if (locationLabel) {
      params.set("city", locationLabel);
    }

    return `\n<iframe\n  src="https://timeincity.com/embed?${params.toString()}"\n  width="${dimensions.width}"\n  height="${dimensions.height}"\n  style="border:0;border-radius:12px;overflow:hidden"\n  loading="lazy"\n></iframe>\n`.trim();
  }, [dimensions.height, dimensions.width, includeDate, includeWeather, locationLabel, theme, timezone]);

  return (
    <section className="flex flex-col gap-6 rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-lg shadow-slate-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
      <header>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Embed this clock</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">Customize the snippet to fit your site.</p>
      </header>
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex flex-1 flex-col gap-4">
          <fieldset className="flex flex-col gap-2">
            <legend className="text-sm font-semibold text-slate-700 dark:text-slate-300">Theme</legend>
            <div className="flex gap-2">
              {THEMES.map((option) => {
                const isActive = option === theme;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setTheme(option)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                      isActive
                        ? "border-indigo-500 bg-indigo-500 text-white shadow-lg shadow-indigo-500/30"
                        : "border-slate-200 bg-white/80 text-slate-700 hover:border-indigo-200 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200"
                    }`}
                  >
                    {option === "dark" ? "Dark" : "Light"}
                  </button>
                );
              })}
            </div>
          </fieldset>
          <fieldset className="flex flex-col gap-2">
            <legend className="text-sm font-semibold text-slate-700 dark:text-slate-300">Size</legend>
            <div className="flex gap-2">
              {(Object.keys(SIZE_PRESETS) as SizeKey[]).map((key) => {
                const preset = SIZE_PRESETS[key];
                const isActive = key === size;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSize(key)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                      isActive
                        ? "border-indigo-500 bg-indigo-500 text-white shadow-lg shadow-indigo-500/30"
                        : "border-slate-200 bg-white/80 text-slate-700 hover:border-indigo-200 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200"
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </fieldset>
          <fieldset className="flex flex-col gap-2">
            <legend className="text-sm font-semibold text-slate-700 dark:text-slate-300">Date</legend>
            <div className="flex gap-2">
              {BOOLEAN_PRESETS.map((option) => {
                const isActive = option.value === includeDate;
                return (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => setIncludeDate(option.value)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                      isActive
                        ? "border-indigo-500 bg-indigo-500 text-white shadow-lg shadow-indigo-500/30"
                        : "border-slate-200 bg-white/80 text-slate-700 hover:border-indigo-200 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </fieldset>
          <fieldset className="flex flex-col gap-2">
            <legend className="text-sm font-semibold text-slate-700 dark:text-slate-300">Weather</legend>
            <div className="flex gap-2">
              {BOOLEAN_PRESETS.map((option) => {
                const isActive = option.value === includeWeather;
                return (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => setIncludeWeather(option.value)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                      isActive
                        ? "border-indigo-500 bg-indigo-500 text-white shadow-lg shadow-indigo-500/30"
                        : "border-slate-200 bg-white/80 text-slate-700 hover:border-indigo-200 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </fieldset>
        </div>
        <div className="flex flex-1 flex-col gap-3">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Preview</span>
          <div
            className={`grid place-items-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 p-4 text-sm text-slate-700 shadow-inner dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200`}
            style={{ width: dimensions.width, height: dimensions.height }}
          >
            <div
              className={`flex h-full w-full flex-col justify-between rounded-2xl border p-4 ${
                theme === "dark"
                  ? "border-slate-700 bg-slate-950 text-slate-100"
                  : "border-slate-200 bg-white text-slate-800"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`${previewTypography.brand} font-semibold uppercase tracking-[0.4em] text-indigo-400`}>
                  TimeInCity
                </span>
                <span className={`${previewTypography.zone} font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400`}>
                  {previewZone}
                </span>
              </div>
              <div className="flex flex-1 flex-col items-center justify-center gap-1 text-center">
                <p className={`${previewTypography.eyebrow} font-semibold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500`}>
                  Current time
                </p>
                <p className={`${previewTypography.time} font-semibold`}>{previewTime}</p>
                {includeDate && (
                  <p className={`${previewTypography.date} text-slate-500 dark:text-slate-400`}>{previewDate}</p>
                )}
                <p className={`mt-2 font-medium ${previewTypography.location}`}>{previewLocation}</p>
                {includeWeather && (
                  <p className={`${previewTypography.weather} text-slate-500 dark:text-slate-400`}>
                    {weatherSummary ?? "Weather loads automatically"}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Copy &amp; paste snippet</span>
        <textarea
          readOnly
          value={snippet}
          className="h-40 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-4 font-mono text-xs text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
        />
      </div>
    </section>
  );
}
