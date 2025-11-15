import { useMemo, useState } from "react";

const SIZE_PRESETS = {
  small: { label: "Small", width: 320, height: 180 },
  medium: { label: "Medium", width: 480, height: 270 },
  large: { label: "Large", width: 640, height: 360 }
} as const;

const THEMES = ["dark", "light"] as const;

type ThemeOption = (typeof THEMES)[number];
type SizeKey = keyof typeof SIZE_PRESETS;

interface EmbedConfiguratorProps {
  timezone: string;
}

export function EmbedConfigurator({ timezone }: EmbedConfiguratorProps): JSX.Element {
  const [theme, setTheme] = useState<ThemeOption>("dark");
  const [size, setSize] = useState<SizeKey>("medium");

  const dimensions = SIZE_PRESETS[size];

  const snippet = useMemo(
    () => `\n<iframe\n  src="https://timeincity.com/embed?tz=${encodeURIComponent(timezone)}&theme=${theme}"\n  width="${dimensions.width}"\n  height="${dimensions.height}"\n  style="border:0;border-radius:12px;overflow:hidden"\n  loading="lazy"\n></iframe>\n`.trim(),
    [dimensions.height, dimensions.width, theme, timezone]
  );

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
        </div>
        <div className="flex flex-1 flex-col gap-3">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Preview</span>
          <div
            className={`grid place-items-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 p-4 text-sm text-slate-700 shadow-inner dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200`}
            style={{ width: dimensions.width, height: dimensions.height }}
          >
            <div className={`flex h-full w-full flex-col items-center justify-center gap-2 rounded-xl border p-4 ${theme === "dark" ? "border-slate-700 bg-slate-900 text-slate-100" : "border-slate-200 bg-white text-slate-700"}`}>
              <span className="text-lg font-semibold">TimeInCity</span>
              <span className="text-sm opacity-70">{timezone}</span>
              <span className="text-xs uppercase tracking-wide">Live clock embed</span>
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
