import { useEffect, useMemo, useRef, useState } from "react";

interface AdSlotProps {
  label: string;
  slotId: string;
  sticky?: "top" | "bottom";
}

export function AdSlot({ label, slotId, sticky }: AdSlotProps): JSX.Element {
  const [hasRenderedAd, setHasRenderedAd] = useState(false);
  const insRef = useRef<HTMLModElement | null>(null);

  useEffect(() => {
    setHasRenderedAd(false);
  }, [slotId]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch (error) {
      console.warn("AdSense render failed", error);
    }
  }, [slotId]);

  useEffect(() => {
    if (!insRef.current || typeof window === "undefined" || !("MutationObserver" in window)) {
      return;
    }

    const observer = new MutationObserver(() => {
      if (insRef.current && insRef.current.childNodes.length > 0) {
        setHasRenderedAd(true);
        observer.disconnect();
      }
    });

    observer.observe(insRef.current, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [slotId]);

  const stickyClass =
    sticky === "top"
      ? "top-0 border-b"
      : sticky === "bottom"
      ? "bottom-0 border-t"
      : "border";

  const containerClasses = useMemo(
    () =>
      [
        "relative z-30 flex w-full items-center justify-center bg-gradient-to-r from-indigo-50/95 via-white to-indigo-50/95",
        "px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-500 shadow-md shadow-indigo-500/10",
        "backdrop-blur dark:from-slate-950/80 dark:via-slate-900/70 dark:to-slate-950/80 dark:text-indigo-200",
        sticky ? `sticky ${stickyClass} min-h-[68px]` : "rounded-3xl border border-indigo-100 dark:border-slate-800 min-h-[96px]"
      ].join(" "),
    [sticky, stickyClass]
  );

  return (
    <aside className={containerClasses} aria-label={label}>
      {!hasRenderedAd && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="rounded-full border border-indigo-200/70 px-4 py-1 text-[0.6rem] tracking-[0.25em] text-indigo-600 dark:border-indigo-800 dark:text-indigo-200">
            {label}
          </span>
        </div>
      )}
      <ins
        ref={insRef}
        className="adsbygoogle h-full w-full"
        style={{ display: "block" }}
        data-ad-client="ca-pub-REPLACE-ME"
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </aside>
  );
}
