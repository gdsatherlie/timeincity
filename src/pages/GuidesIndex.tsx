import { getAllArticles } from "../data/articles";

interface GuidesIndexProps {
  onNavigate: (path: string) => void;
}

export function GuidesIndex({ onNavigate }: GuidesIndexProps): JSX.Element {
  const articles = getAllArticles();

  return (
    <section className="rounded-3xl border border-slate-200/70 bg-white/80 p-8 shadow-lg shadow-slate-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
      <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">Guides &amp; Articles</h1>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
        Practical guides on time zones, UTC, meeting across cities, and using TimeInCity to plan your day.
      </p>
      <ul className="mt-6 space-y-4">
        {articles.map((article) => (
          <li
            key={article.slug}
            className="rounded-2xl border border-slate-200/60 bg-white/70 p-4 transition hover:-translate-y-[1px] hover:shadow-md hover:shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900/80"
          >
            <button
              type="button"
              onClick={() => onNavigate(`/guides/${article.slug}`)}
              className="text-left"
            >
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{article.title}</h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{article.description}</p>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
