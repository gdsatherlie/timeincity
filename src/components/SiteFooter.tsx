import type { StaticPageSlug } from "../data/staticPages";
import { STATIC_PAGE_ROUTES } from "../data/staticPages";

interface SiteFooterProps {
  onNavigate?: (slug: StaticPageSlug) => void;
  currentPage?: StaticPageSlug | null;
}

const FOOTER_SLUGS: StaticPageSlug[] = ["about", "privacy", "terms", "contact"];

export function SiteFooter({ onNavigate, currentPage }: SiteFooterProps): JSX.Element {
  return (
    <footer className="mx-auto mt-12 w-full max-w-6xl px-4 pb-12 text-sm text-slate-600 dark:text-slate-400 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center gap-4 rounded-3xl border border-slate-200/70 bg-white/70 px-6 py-4 shadow-lg shadow-slate-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
        <span className="font-semibold text-slate-900 dark:text-slate-100">TimeInCity</span>
        <nav className="flex flex-wrap gap-3 text-sm font-semibold">
          {FOOTER_SLUGS.map((slug) => {
            const meta = STATIC_PAGE_ROUTES[slug];
            const isActive = currentPage === slug;
            return (
              <a
                key={slug}
                href={meta.path}
                className={`transition hover:text-indigo-600 dark:hover:text-indigo-300 ${
                  isActive ? "text-indigo-600 dark:text-indigo-300" : "text-slate-600 dark:text-slate-300"
                }`}
                onClick={(event) => {
                  if (!onNavigate) {
                    return;
                  }
                  if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) {
                    return;
                  }
                  event.preventDefault();
                  onNavigate(slug);
                }}
              >
                {meta.label}
              </a>
            );
          })}
        </nav>
      </div>
      <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">© {new Date().getFullYear()} TimeInCity. All rights reserved.</p>
    </footer>
  );
}
