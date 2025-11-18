import { useEffect, useRef, useState } from "react";

import type { StaticPageSlug } from "../data/staticPages";
import { STATIC_PAGE_ROUTES } from "../data/staticPages";
import { POPULAR_CITIES_COUNT } from "../data/popularCities";

interface SiteHeaderProps {
  onNavigateHome: () => void;
  onNavigateSection: (sectionId: string) => void;
  onNavigateCitySlug: (slug: string) => void;
  onNavigateStaticPage: (slug: StaticPageSlug) => void;
}

type MenuItem =
  | { type: "section"; label: string; target: string }
  | { type: "city"; label: string; slug: string }
  | { type: "static"; label: string; slug: StaticPageSlug };

const CITY_MENU: MenuItem[] = [
  { type: "section", label: `All Cities (${POPULAR_CITIES_COUNT.toLocaleString()})`, target: "popular-cities" },
  { type: "city", label: "United States", slug: "new-york" },
  { type: "city", label: "Europe", slug: "london" },
  { type: "city", label: "Asia", slug: "tokyo" },
  { type: "city", label: "South America", slug: "sao-paulo" },
  { type: "city", label: "Africa", slug: "johannesburg" },
  { type: "city", label: "Oceania", slug: "sydney" }
];

const TOOLS_MENU: MenuItem[] = [
  { type: "section", label: "Compare Times", target: "compare-times" },
  { type: "static", label: "World Time Converter", slug: "world-time-converter" },
  { type: "section", label: "Meeting Planner", target: "meeting-planner" },
  { type: "static", label: "Time Zone Map", slug: "time-zone-map" }
];

const INFO_MENU: MenuItem[] = [
  { type: "static", label: STATIC_PAGE_ROUTES["about"].label, slug: "about" },
  { type: "static", label: STATIC_PAGE_ROUTES["contact"].label, slug: "contact" },
  { type: "static", label: STATIC_PAGE_ROUTES["privacy"].label, slug: "privacy" },
  { type: "static", label: STATIC_PAGE_ROUTES["terms"].label, slug: "terms" }
];

function ChevronIcon(): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MenuIcon(): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon(): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m6 6 12 12M6 18 18 6" strokeLinecap="round" />
    </svg>
  );
}

export function SiteHeader({
  onNavigateHome,
  onNavigateSection,
  onNavigateCitySlug,
  onNavigateStaticPage
}: SiteHeaderProps): JSX.Element {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (navWrapperRef.current && !navWrapperRef.current.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleMenuItem = (item: MenuItem) => {
    switch (item.type) {
      case "section":
        onNavigateSection(item.target);
        break;
      case "city":
        onNavigateCitySlug(item.slug);
        break;
      case "static":
        onNavigateStaticPage(item.slug);
        break;
    }
    setOpenMenu(null);
    setMobileOpen(false);
  };

  const renderMenuList = (items: MenuItem[]) => (
    <ul className="flex flex-col gap-2 text-sm">
      {items.map((item) => {
        const key = item.type === "section" ? item.target : item.slug;
        return (
          <li key={`${item.type}-${key}`}>
            <button
              type="button"
              onClick={() => handleMenuItem(item)}
              className="w-full rounded-xl px-3 py-2 text-left font-semibold text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {item.label}
            </button>
          </li>
        );
      })}
    </ul>
  );

  const renderDropdown = (label: string, menuKey: string, items: MenuItem[]) => (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpenMenu((prev) => (prev === menuKey ? null : menuKey))}
        className={`flex items-center gap-1 rounded-full px-3 py-2 text-sm font-semibold transition ${
          openMenu === menuKey
            ? "bg-indigo-100 text-indigo-700 dark:bg-slate-800 dark:text-indigo-200"
            : "text-slate-700 hover:text-indigo-600 dark:text-slate-200"
        }`}
      >
        {label}
        <ChevronIcon />
      </button>
      {openMenu === menuKey && (
        <div className="absolute left-0 top-full z-30 mt-2 min-w-[220px] rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
          {renderMenuList(items)}
        </div>
      )}
    </div>
  );

  return (
    <header className="sticky top-4 z-30 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between rounded-3xl border border-slate-200/70 bg-white/80 px-5 py-3 shadow-lg shadow-slate-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
        <button
          type="button"
          onClick={() => {
            onNavigateHome();
            setOpenMenu(null);
            setMobileOpen(false);
          }}
          className="flex flex-col text-left"
        >
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-500">TimeInCity</span>
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">World clock & weather</span>
        </button>
        <nav ref={navWrapperRef} className="hidden items-center gap-3 md:flex">
          <button
            type="button"
            onClick={() => {
              onNavigateHome();
              setOpenMenu(null);
            }}
            className="rounded-full px-3 py-2 text-sm font-semibold text-slate-700 transition hover:text-indigo-600 dark:text-slate-200"
          >
            Home
          </button>
          {renderDropdown("Cities", "cities", CITY_MENU)}
          {renderDropdown("Tools", "tools", TOOLS_MENU)}
          {renderDropdown("Info", "info", INFO_MENU)}
        </nav>
        <button
          type="button"
          className="rounded-full border border-slate-200 p-2 text-slate-700 transition hover:border-indigo-200 hover:text-indigo-600 dark:border-slate-700 dark:text-slate-200 md:hidden"
          aria-label="Open menu"
          onClick={() => setMobileOpen(true)}
        >
          <MenuIcon />
        </button>
      </div>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm md:hidden">
          <div className="absolute right-0 top-0 h-full w-80 max-w-full bg-white p-6 text-slate-900 shadow-2xl dark:bg-slate-900 dark:text-slate-100">
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold">Menu</p>
              <button
                type="button"
                aria-label="Close menu"
                className="rounded-full border border-slate-200 p-2 text-slate-700 transition hover:border-indigo-200 hover:text-indigo-600 dark:border-slate-700 dark:text-slate-200"
                onClick={() => setMobileOpen(false)}
              >
                <CloseIcon />
              </button>
            </div>
            <div className="mt-6 space-y-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Cities</p>
                <div className="mt-3">{renderMenuList(CITY_MENU)}</div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Tools</p>
                <div className="mt-3">{renderMenuList(TOOLS_MENU)}</div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Info</p>
                <div className="mt-3">{renderMenuList(INFO_MENU)}</div>
              </div>
              <button
                type="button"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:text-indigo-600 dark:border-slate-700 dark:text-slate-200"
                onClick={() => {
                  onNavigateHome();
                  setMobileOpen(false);
                }}
              >
                Back to homepage
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
