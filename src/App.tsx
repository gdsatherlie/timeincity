import { useCallback, useEffect, useMemo, useState } from "react";

import { Experience } from "./components/Experience";
import { HomeSeoSection } from "./components/HomeSeoSection";
import { SiteHeader } from "./components/SiteHeader";
import { SiteFooter } from "./components/SiteFooter";
import { RichTextPage } from "./components/RichTextPage";
import { RegionDirectory } from "./components/RegionDirectory";
import { AdSlot } from "./components/AdSlot";
import { CITY_LIST, findCityBySlug, type CityConfig, type RegionSlug } from "./data/cities";
import { STATIC_PAGES, type StaticPageContent } from "./data/staticPages";
import { LEGAL_PAGES, type LegalPageContent } from "./data/legalPages";
import { REGION_PAGES } from "./data/regionPages";
import { getCitySeoCopy } from "./utils/citySeo";
import { slugifyCity } from "./utils/slugifyCity";
import { SHOW_AD_SLOTS } from "./config";
import { CityPage } from "./pages/city/[slug]";
import { GuidesIndex } from "./pages/GuidesIndex";
import { GuideArticlePage } from "./pages/GuideArticlePage";
import { getArticleBySlug } from "./data/articles";

const DEFAULT_TITLE = "TimeInCity — Live World Clock & Weather by City and Time Zone";
const DEFAULT_DESCRIPTION =
  "TimeInCity shows the current time, weather, sunrise, and sunset for any IANA time zone. Explore popular cities, embed live clocks, and see world time at a glance.";

const staticPageMap = new Map(STATIC_PAGES.map((page) => [page.path, page]));
const legalPageMap = new Map(LEGAL_PAGES.map((page) => [page.path, page]));

interface HomeRoute {
  kind: "home";
}

interface CityRoute {
  kind: "city";
  city: CityConfig;
}

interface CityNotFoundRoute {
  kind: "city-not-found";
  slug: string;
}

interface StaticRoute {
  kind: "static";
  page: StaticPageContent;
}

interface LegalRoute {
  kind: "legal";
  page: LegalPageContent;
}

interface RegionRoute {
  kind: "region";
  slug: RegionSlug;
}

interface GuidesIndexRoute {
  kind: "guides-index";
}

interface GuideArticleRoute {
  kind: "guide-article";
  slug: string;
  article: ReturnType<typeof getArticleBySlug>;
}

interface GuideNotFoundRoute {
  kind: "guide-not-found";
  slug: string;
}

type Route =
  | HomeRoute
  | CityRoute
  | CityNotFoundRoute
  | StaticRoute
  | LegalRoute
  | RegionRoute
  | GuidesIndexRoute
  | GuideArticleRoute
  | GuideNotFoundRoute;

function normalizePath(pathname: string): string {
  if (!pathname || pathname === "/") {
    return "/";
  }
  return pathname.endsWith("/") && pathname !== "/" ? pathname.slice(0, -1) : pathname;
}

function parseRoute(pathname: string): Route {
  const normalized = normalizePath(pathname);
  if (normalized === "/") {
    return { kind: "home" };
  }
  if (normalized.startsWith("/city/")) {
    const slug = normalized.replace("/city/", "").toLowerCase();
    const city = findCityBySlug(slug);
    if (city) {
      return { kind: "city", city };
    }
    return { kind: "city-not-found", slug };
  }
  if (normalized === "/guides") {
    return { kind: "guides-index" };
  }
  if (normalized.startsWith("/guides/")) {
    const slug = normalized.replace("/guides/", "");
    const article = getArticleBySlug(slug);
    if (article) {
      return { kind: "guide-article", slug, article };
    }
    return { kind: "guide-not-found", slug };
  }
  if (staticPageMap.has(normalized)) {
    return { kind: "static", page: staticPageMap.get(normalized)! };
  }
  if (legalPageMap.has(normalized)) {
    return { kind: "legal", page: legalPageMap.get(normalized)! };
  }
  if (normalized === "/cities") {
    return { kind: "region", slug: "all" };
  }
  if (normalized.startsWith("/cities/")) {
    const slug = normalized.replace("/cities/", "") as RegionSlug;
    if (REGION_PAGES[slug]) {
      return { kind: "region", slug };
    }
  }
  return { kind: "home" };
}

function updateMetaTags(title: string, description: string, path: string) {
  document.title = title;
  const descTag = document.querySelector('meta[name="description"]');
  if (descTag) {
    descTag.setAttribute("content", description);
  }
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) {
    canonical.setAttribute("href", `https://www.timeincity.com${path}`);
  }
  const ogTitle = document.querySelector('meta[property="og:title"]');
  ogTitle?.setAttribute("content", title);
  const ogDesc = document.querySelector('meta[property="og:description"]');
  ogDesc?.setAttribute("content", description);
  const ogUrl = document.querySelector('meta[property="og:url"]');
  ogUrl?.setAttribute("content", `https://www.timeincity.com${path}`);
  const twitterTitle = document.querySelector('meta[name="twitter:title"]');
  twitterTitle?.setAttribute("content", title);
  const twitterDesc = document.querySelector('meta[name="twitter:description"]');
  twitterDesc?.setAttribute("content", description);
}

export default function App(): JSX.Element {
  const [route, setRoute] = useState<Route>(() => parseRoute(window.location.pathname));
  const [currentPath, setCurrentPath] = useState(() => normalizePath(window.location.pathname));

  const navigate = useCallback(
    (path: string, options?: { replace?: boolean; skipScroll?: boolean }) => {
      const target = path.startsWith("/") ? normalizePath(path) : normalizePath(`/${path}`);
      if (options?.replace) {
        window.history.replaceState({}, "", target);
      } else if (target !== currentPath) {
        window.history.pushState({}, "", target);
      }
      setRoute(parseRoute(target));
      setCurrentPath(target);
      if (!options?.skipScroll) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [currentPath]
  );

  const handleCityNavigate = useCallback((slug: string) => {
    navigate(`/city/${slug}`);
  }, [navigate]);

  useEffect(() => {
    const onPopState = () => {
      const newPath = normalizePath(window.location.pathname);
      setRoute(parseRoute(newPath));
      setCurrentPath(newPath);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const slugParam = params.get("city");
    if (slugParam) {
      const normalizedSlug = slugifyCity(slugParam);
      if (findCityBySlug(normalizedSlug)) {
        navigate(`/city/${normalizedSlug}`, { replace: true });
      }
      params.delete("city");
      const pathOnly = window.location.pathname;
      const queryless = pathOnly + (params.toString() ? `?${params}` : "");
      window.history.replaceState({}, "", queryless);
    }
  }, [navigate]);

  useEffect(() => {
    if (route.kind === "city") {
      const copy = getCitySeoCopy(route.city);
      updateMetaTags(copy.title, copy.description, `/city/${route.city.slug}`);
      return;
    }
    if (route.kind === "static") {
      updateMetaTags(route.page.title, route.page.description, route.page.path);
      return;
    }
    if (route.kind === "legal") {
      updateMetaTags(route.page.title, route.page.description, route.page.path);
      return;
    }
    if (route.kind === "guides-index") {
      updateMetaTags(
        "Guides & Articles | TimeInCity",
        "Long-form guides on time zones, world clocks, and meeting across cities with TimeInCity.",
        "/guides"
      );
      return;
    }
    if (route.kind === "guide-article" && route.article) {
      updateMetaTags(
        `${route.article.title} | TimeInCity Guides`,
        route.article.description,
        `/guides/${route.article.slug}`
      );
      return;
    }
    if (route.kind === "region") {
      const regionPage = REGION_PAGES[route.slug];
      if (regionPage) {
        updateMetaTags(regionPage.title, regionPage.description, route.slug === "all" ? "/cities" : `/cities/${route.slug}`);
        return;
      }
    }
    updateMetaTags(DEFAULT_TITLE, DEFAULT_DESCRIPTION, "/");
  }, [route]);

  const regionCities = useMemo(() => {
    if (route.kind !== "region") {
      return [];
    }
    if (route.slug === "all") {
      return CITY_LIST;
    }
    if (route.slug === "united-states") {
      return CITY_LIST.filter((city) => city.countryCode === "US");
    }
    if (route.slug === "north-america") {
      return CITY_LIST.filter((city) => city.continent === "north-america");
    }
    if (route.slug === "south-america") {
      return CITY_LIST.filter((city) => city.continent === "south-america");
    }
    if (route.slug === "oceania") {
      return CITY_LIST.filter((city) => city.continent === "oceania");
    }
    if (route.slug === "africa") {
      return CITY_LIST.filter((city) => city.continent === "africa");
    }
    if (route.slug === "asia") {
      return CITY_LIST.filter((city) => city.continent === "asia");
    }
    if (route.slug === "europe") {
      return CITY_LIST.filter((city) => city.continent === "europe");
    }
    return CITY_LIST;
  }, [route]);

  const mainContent = useMemo(() => {
    switch (route.kind) {
      case "home":
        return (
          <div className="flex flex-col gap-10">
            <Experience onSelectCity={handleCityNavigate} />
            <HomeSeoSection />
          </div>
        );
      case "city":
        return <CityPage city={route.city} onSelectCity={handleCityNavigate} />;
      case "city-not-found":
        return (
          <section className="rounded-3xl border border-slate-200/70 bg-white/80 p-10 text-center shadow-lg shadow-slate-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
            <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">City not found</h1>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
              We couldn&apos;t find that city. Please try another search or return to the homepage.
            </p>
            <button
              type="button"
              onClick={() => navigate("/", { replace: true })}
              className="mt-6 inline-flex items-center justify-center rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500"
            >
              Back to homepage
            </button>
          </section>
        );
      case "guides-index":
        return <GuidesIndex onNavigate={navigate} />;
      case "guide-article":
        if (!route.article) {
          return (
            <section className="rounded-3xl border border-slate-200/70 bg-white/80 p-10 text-center shadow-lg shadow-slate-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
              <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">Article not found</h1>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Please return to the guides directory.</p>
              <button
                type="button"
                onClick={() => navigate("/guides", { replace: true })}
                className="mt-6 inline-flex items-center justify-center rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500"
              >
                Back to guides
              </button>
            </section>
          );
        }
        return <GuideArticlePage article={route.article} onNavigate={navigate} />;
      case "guide-not-found":
        return (
          <section className="rounded-3xl border border-slate-200/70 bg-white/80 p-10 text-center shadow-lg shadow-slate-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
            <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">Article not found</h1>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">We couldn&apos;t find that guide. Please return to the guides list.</p>
            <button
              type="button"
              onClick={() => navigate("/guides", { replace: true })}
              className="mt-6 inline-flex items-center justify-center rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500"
            >
              Back to guides
            </button>
          </section>
        );
      case "static":
        return <RichTextPage heading={route.page.heading} paragraphs={route.page.body} />;
      case "legal":
        return <RichTextPage heading={route.page.heading} paragraphs={route.page.body} />;
      case "region": {
        const region = REGION_PAGES[route.slug];
        if (!region) {
          return <HomeSeoSection />;
        }
        return (
          <RegionDirectory heading={region.heading} description={region.description} cities={regionCities} onNavigate={navigate} />
        );
      }
      default:
        return <HomeSeoSection />;
    }
  }, [route, handleCityNavigate, regionCities, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-white to-slate-100 text-slate-900 transition-colors dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-slate-100">
      {SHOW_AD_SLOTS ? <AdSlot label="Top banner ad" sticky="top" /> : null}
      <SiteHeader onNavigate={navigate} currentPath={currentPath} />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8">{mainContent}</main>
      <SiteFooter onNavigate={navigate} />
      {SHOW_AD_SLOTS ? <AdSlot label="Bottom banner ad" sticky="bottom" /> : null}
    </div>
  );
}
