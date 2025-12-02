import { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

interface AdSlotProps {
  label: string;
  sticky?: "top" | "bottom";
  client?: string;
  slot?: string;
}

const ADSENSE_SCRIPT_ID = "timeincity-adsense";
const ADSENSE_ACCOUNT_META = "google-adsense-account";

function ensureAdsenseAccountMeta(client: string): void {
  const existing = document.head.querySelector(`meta[name='${ADSENSE_ACCOUNT_META}']`) as
    | HTMLMetaElement
    | null;
  if (existing) {
    existing.content = client;
    return;
  }

  const meta = document.createElement("meta");
  meta.name = ADSENSE_ACCOUNT_META;
  meta.content = client;
  document.head.appendChild(meta);
}

function ensureAdsense(client: string): HTMLScriptElement | null {
  const existing = document.getElementById(ADSENSE_SCRIPT_ID) as HTMLScriptElement | null;
  if (existing) {
    return existing;
  }

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`;
  script.crossOrigin = "anonymous";
  script.id = ADSENSE_SCRIPT_ID;
  script.dataset.adsbygoogleClient = client;
  ensureAdsenseAccountMeta(client);
  document.head.appendChild(script);
  return script;
}

function requestAd(): void {
  try {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  } catch (error) {
    console.warn("AdSense push blocked", error);
  }
}

export function AdSlot({ label, sticky, client, slot }: AdSlotProps): JSX.Element {
  useEffect(() => {
    if (!client || !slot) {
      return;
    }

    const script = ensureAdsense(client);

    if (!script) {
      return;
    }

    if (script.dataset.loaded === "true" || script.readyState === "complete") {
      script.dataset.loaded = "true";
      requestAd();
      return;
    }

    const handleLoad = () => {
      script.dataset.loaded = "true";
      requestAd();
    };

    script.addEventListener("load", handleLoad);
    return () => {
      script.removeEventListener("load", handleLoad);
    };
  }, [client, slot]);

  const stickyClass =
    sticky === "top"
      ? "top-0 border-b"
      : sticky === "bottom"
      ? "bottom-0 border-t"
      : "border";

  const showPlaceholder = !client || !slot;

  return (
    <aside
      className={`z-30 flex w-full items-center justify-center border-indigo-200/60 bg-indigo-50/90 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-indigo-600 shadow-md shadow-indigo-500/10 backdrop-blur dark:border-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-200 ${
        sticky ? `sticky ${stickyClass}` : "rounded-2xl"
      }`}
    >
      {showPlaceholder ? (
        `${label} placeholder`
      ) : (
        <ins
          className="adsbygoogle block w-full"
          style={{ display: "block" }}
          data-ad-client={client}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      )}
    </aside>
  );
}
