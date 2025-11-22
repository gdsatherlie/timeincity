interface SiteFooterProps {
  onNavigate: (path: string) => void;
}

const footerLinks = [
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
  { label: "Privacy Policy", path: "/privacy" },
  { label: "Terms of Service", path: "/terms" }
];

export function SiteFooter({ onNavigate }: SiteFooterProps): JSX.Element {
  return (
    <footer className="border-t border-slate-200/70 bg-white/80 py-8 text-sm text-slate-600 backdrop-blur dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-400">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 text-center sm:flex-row sm:justify-between sm:text-left">
        <p>© {new Date().getFullYear()} TimeInCity — Global clocks & weather</p>
        <nav className="flex flex-wrap justify-center gap-4">
          {footerLinks.map((link) => (
            <button
              key={link.path}
              type="button"
              onClick={() => onNavigate(link.path)}
              className="text-sm font-medium text-slate-700 transition hover:text-indigo-600 dark:text-slate-200 dark:hover:text-indigo-300"
            >
              {link.label}
            </button>
          ))}
        </nav>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Some points-of-interest data are sourced from OpenStreetMap and other open data via OpenTripMap (ODbL).
        </p>
      </div>
    </footer>
  );
}
