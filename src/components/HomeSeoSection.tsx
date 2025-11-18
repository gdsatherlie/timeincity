export function HomeSeoSection(): JSX.Element {
  return (
    <section className="rounded-3xl border border-slate-200/70 bg-white/80 p-8 shadow-lg shadow-slate-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
      <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Exact time and weather in any city</h2>
      <div className="mt-4 space-y-4 text-base text-slate-600 dark:text-slate-300">
        <p>
          TimeInCity shows the exact current time, date, weather, sunrise, and sunset for any city in the world. Search hundreds of
          popular destinations, see “what time is it in” answers instantly, and switch between world clock views and time zones in seconds.
        </p>
        <p>
          Share direct links like <strong>timeincity.com/city/london</strong>, embed a live clock on your site, or compare cities side by side when planning meetings.
          Every page updates in real time and is optimized for light and dark themes.
        </p>
        <ul className="list-disc space-y-1 pl-6">
          <li>Check the current time by city or time zone</li>
          <li>See weather, sunrise, and sunset with every clock</li>
          <li>Compare time zones and share reliable meeting links</li>
          <li>Embed a live TimeInCity widget on your website</li>
        </ul>
      </div>
    </section>
  );
}
