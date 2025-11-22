import type { CityPoi, CityPoisResponse } from "../types/cityTypes";

function PoiList({ title, items }: { title: string; items: CityPoi[] }) {
  if (!items.length) return null;

  return (
    <section className="mt-4">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      <ul className="mt-2 space-y-2 text-sm text-slate-700 dark:text-slate-200">
        {items.map((poi) => (
          <li key={poi.xid} className="rounded-2xl border border-slate-200/70 bg-white/70 p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-900 dark:text-slate-50">{poi.name}</span>
              {typeof poi.rating === "number" ? (
                <span className="text-xs font-semibold text-amber-600 dark:text-amber-300">{poi.rating.toFixed(1)}</span>
              ) : null}
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {poi.kinds.slice(0, 3).join(" · ")}
              {typeof poi.distanceMeters === "number"
                ? ` · ${(poi.distanceMeters / 1000).toFixed(1)} km from center`
                : ""}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function CityPoiSection({ pois }: { pois: CityPoisResponse }) {
  return (
    <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-lg shadow-slate-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
      <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Local highlights in {pois.city.name}</h2>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
        Explore attractions and places to eat around {pois.city.name}, powered by open travel data.
      </p>

      <PoiList title="Popular attractions" items={pois.attractions} />
      <PoiList title="Places to eat & drink" items={pois.restaurants} />

      <p className="mt-4 text-[11px] text-slate-500 dark:text-slate-400">{pois.sourceAttribution}</p>
    </div>
  );
}
