export function HomeSeoSection(): JSX.Element {
  return (
    <section className="flex flex-col gap-4 rounded-3xl border border-slate-200/70 bg-white/80 p-6 text-slate-700 shadow-lg shadow-slate-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-200">
      <header>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Exact time and weather in any city</h2>
        <p className="mt-2 text-base leading-relaxed">
          TimeInCity shows the exact current time, date, weather, sunrise, and sunset for every IANA time zone. Search the current
          time in London, answer “what time is it in Tokyo,” or keep an eye on a favorite city without opening another tab.
        </p>
      </header>
      <p className="text-base leading-relaxed">
        Each /city/ page doubles as a world clock with live meteorological data and quick-share links so teammates load the same
        time. Use the tools below to compare time zones, plan meetings, or embed a branded widget on your website in seconds.
      </p>
      <div className="grid gap-3 text-sm sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/70">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Check current time by city</p>
          <p className="mt-2 text-base font-semibold text-slate-900 dark:text-slate-100">Instant answers for “what time is it in [city]”</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/70">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Compare time zones</p>
          <p className="mt-2 text-base font-semibold text-slate-900 dark:text-slate-100">Line up offsets for remote teams</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/70">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Get local weather</p>
          <p className="mt-2 text-base font-semibold text-slate-900 dark:text-slate-100">Temperature, precipitation, sunrise, sunset</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/70">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Embed a live clock</p>
          <p className="mt-2 text-base font-semibold text-slate-900 dark:text-slate-100">Copy iframe code with theme + weather</p>
        </div>
      </div>
    </section>
  );
}
