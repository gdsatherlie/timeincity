import { useMemo } from "react";

interface FavoriteCity {
  timezone: string;
  label?: string;
}

interface FavoriteCitiesProps {
  favorites: FavoriteCity[];
  selectedTimezone: string;
  selectedLabel?: string;
  onSelect: (timezone: string, label?: string) => void;
  onRemove: (timezone: string, label?: string) => void;
  onAddCurrent: () => void;
  canAddCurrent: boolean;
}

function formatLabel(favorite: FavoriteCity): string {
  if (favorite.label) {
    return favorite.label;
  }

  const lastSegment = favorite.timezone.split("/").pop() ?? favorite.timezone;
  return lastSegment.replace(/_/g, " ");
}

export function FavoriteCities({
  favorites,
  selectedLabel,
  selectedTimezone,
  onSelect,
  onRemove,
  onAddCurrent,
  canAddCurrent
}: FavoriteCitiesProps): JSX.Element {
  const hasFavorites = favorites.length > 0;
  const duplicateNotice = useMemo(() => {
    if (hasFavorites || canAddCurrent) {
      return null;
    }
    return "Already added";
  }, [hasFavorites, canAddCurrent]);

  return (
    <section className="flex flex-col gap-4 rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-lg shadow-slate-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Favorite cities</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">Pin go-to locations so they are always one tap away.</p>
        </div>
        <div className="flex flex-col items-end gap-1 text-right">
          <button
            type="button"
            onClick={onAddCurrent}
            disabled={!canAddCurrent}
            className="rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-600 shadow-sm transition hover:border-indigo-300 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-transparent disabled:text-slate-400 dark:border-indigo-500/50 dark:bg-indigo-500/10 dark:text-indigo-200"
          >
            Add current city
          </button>
          {duplicateNotice ? (
            <span className="text-xs text-slate-400">{duplicateNotice}</span>
          ) : null}
        </div>
      </header>
      {hasFavorites ? (
        <div className="flex flex-wrap gap-3">
          {favorites.map((favorite) => {
            const label = formatLabel(favorite);
            const isActive = favorite.timezone === selectedTimezone && label === (selectedLabel ?? label);
            return (
              <div
                key={`${favorite.timezone}-${label}`}
                className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium shadow-sm transition dark:border-slate-700 ${
                  isActive
                    ? "border-indigo-500 bg-indigo-500/10 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200"
                    : "border-slate-200 bg-white/70 text-slate-700 dark:bg-slate-900/60 dark:text-slate-200"
                }`}
              >
                <button
                  type="button"
                  onClick={() => onSelect(favorite.timezone, favorite.label)}
                  className="text-left"
                >
                  {label}
                </button>
                <button
                  type="button"
                  onClick={() => onRemove(favorite.timezone, favorite.label)}
                  className="rounded-full p-1 text-xs text-slate-400 transition hover:bg-slate-200 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:hover:bg-slate-800"
                  aria-label={`Remove ${label} from favorites`}
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          You haven&apos;t saved any favorites yet. Use “Add current city” to pin frequently checked locations.
        </p>
      )}
    </section>
  );
}
