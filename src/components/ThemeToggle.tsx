import { useEffect } from "react";

import { usePersistentState } from "../hooks/usePersistentState";

const STORAGE_KEY = "timeincity-theme";

type Theme = "light" | "dark";

function SunIcon(): JSX.Element {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2m10-10h-2M4 12H2m17.66 7.66-1.42-1.42M6.76 6.76 5.34 5.34m12.02 0 1.42 1.42M6.76 17.24l-1.42 1.42" />
    </svg>
  );
}

function MoonIcon(): JSX.Element {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12.79A9 9 0 0 1 11.21 3 7 7 0 1 0 21 12.79Z" />
    </svg>
  );
}

const icons: Record<Theme, JSX.Element> = {
  light: <SunIcon />,
  dark: <MoonIcon />
};

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className = "" }: ThemeToggleProps): JSX.Element {
  const [theme, setTheme] = usePersistentState<Theme>(STORAGE_KEY, "dark");

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.dataset.theme = "dark";
      document.body.classList.add("dark");
    } else {
      root.classList.remove("dark");
      root.dataset.theme = "light";
      document.body.classList.remove("dark");
    }
  }, [theme]);

  const label = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      type="button"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={`inline-flex items-center gap-2 rounded-full border border-slate-300/50 bg-white/70 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm backdrop-blur transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:bg-slate-800 ${className}`}
      aria-label={label}
    >
      {icons[theme]}
      <span>{theme === "dark" ? "Dark" : "Light"} mode</span>
    </button>
  );
}
