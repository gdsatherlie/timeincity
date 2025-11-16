export function HomeSeoSection(): JSX.Element {
  return (
    <section className="flex flex-col gap-4 rounded-3xl border border-slate-200/70 bg-white/80 p-6 text-slate-700 shadow-lg shadow-slate-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-200">
      <header>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Exact time and weather in any city</h2>
        <p className="mt-2 text-base leading-relaxed">
          TimeInCity is a lightning-fast world clock that pairs IANA time zones with precise weather, sunrise, and sunset data.
          Search the current time in any city, answer “what time is it in London?” or “what time is it in Tokyo?” and share a live
          link so everyone sees the same clock.
        </p>
      </header>
      <p className="text-base leading-relaxed">
        Every page updates in real time with browser-accurate clocks, meteorological data, and ready-to-use embed snippets. Use
        TimeInCity to compare time zones, plan remote meetings, or drop a branded widget into your own site without extra code.
      </p>
      <div className="grid gap-3 text-sm sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/70">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Check current time by city</p>
          <p className="mt-2 text-base font-semibold text-slate-900 dark:text-slate-100">500+ destinations with local offsets</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/70">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Share links with your team</p>
          <p className="mt-2 text-base font-semibold text-slate-900 dark:text-slate-100">Send /city/ URLs so everyone loads the same time zone</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/70">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Embed a live clock</p>
          <p className="mt-2 text-base font-semibold text-slate-900 dark:text-slate-100">Copy iframe code with theme, date, and weather options</p>
        </div>
      </div>
    </section>
  );
}
