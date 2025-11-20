import { useState } from "react";

interface NavItem {
  label: string;
  path: string;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

interface SiteHeaderProps {
  onNavigate: (path: string, options?: { replace?: boolean }) => void;
  currentPath: string;
}

const cityNav: NavSection = {
  label: "Cities",
  items: [
    { label: "All Cities", path: "/cities" },
    { label: "United States", path: "/cities/united-states" },
    { label: "North America", path: "/cities/north-america" },
    { label: "Europe", path: "/cities/europe" },
    { label: "Asia", path: "/cities/asia" },
    { label: "South America", path: "/cities/south-america" },
    { label: "Africa", path: "/cities/africa" },
    { label: "Oceania", path: "/cities/oceania" }
  ]
};

const toolsNav: NavSection = {
  label: "Tools",
  items: [
    { label: "World Time Converter", path: "/world-time-converter" },
    { label: "Time Zone Map", path: "/time-zone-map" },
    { label: "What Time Is It?", path: "/what-time-is-it-around-the-world" },
    { label: "Meeting Planner", path: "/world-time-converter" }
  ]
};

const infoNav: NavSection = {
  label: "Info",
  items: [
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
    { label: "Privacy Policy", path: "/privacy" },
    { label: "Terms of Service", path: "/terms" }
  ]
};

function SectionDropdown({ section, onNavigate }: { section: NavSection; onNavigate: SiteHeaderProps["onNavigate"] }) {
  return (
    <details className="group relative">
      <summary className="cursor-pointer list-none rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-white/40 dark:text-slate-100 dark:hover:bg-slate-800/80">
        {section.label}
      </summary>
      <div className="absolute left-0 mt-2 min-w-[12rem] rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-xl shadow-slate-900/10 dark:border-slate-700 dark:bg-slate-900">
        <ul className="space-y-1 text-sm">
          {section.items.map((item) => (
            <li key={item.path}>
              <button
                type="button"
                onClick={() => onNavigate(item.path)}
                className="w-full rounded-lg px-3 py-2 text-left font-medium text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-600 dark:text-slate-100 dark:hover:bg-slate-800"
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </details>
  );
}

export function SiteHeader({ onNavigate, currentPath }: SiteHeaderProps): JSX.Element {
  const [open, setOpen] = useState(false);

  const handleNavigate = (path: string) => {
    setOpen(false);
    onNavigate(path);
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/70">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => handleNavigate("/")}
          className="text-lg font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white"
        >
          TimeInCity
        </button>
        <nav className="hidden items-center gap-6 text-sm font-semibold text-slate-700 dark:text-slate-100 lg:flex">
          <SectionDropdown section={cityNav} onNavigate={handleNavigate} />
          <SectionDropdown section={toolsNav} onNavigate={handleNavigate} />
          <SectionDropdown section={infoNav} onNavigate={handleNavigate} />
        </nav>
        <button
          type="button"
          className="rounded-full border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100 lg:hidden"
          onClick={() => setOpen((prev) => !prev)}
        >
          Menu
        </button>
      </div>
      {open && (
        <div className="border-t border-slate-200/70 bg-white/90 px-4 py-4 text-sm font-medium text-slate-700 shadow-inner dark:border-slate-800 dark:bg-slate-900 lg:hidden">
          {[cityNav, toolsNav, infoNav].map((section) => (
            <div key={section.label} className="mb-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{section.label}</p>
              <div className="flex flex-col gap-2">
                {section.items.map((item) => (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => handleNavigate(item.path)}
                    className={`rounded-lg px-3 py-2 text-left ${currentPath === item.path ? "bg-indigo-50 text-indigo-600" : "hover:bg-slate-100"}`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </header>
  );
}
