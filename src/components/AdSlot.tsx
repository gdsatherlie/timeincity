import { useEffect } from "react";

interface AdSlotProps {
  label: string;
  slotId: string;
  sticky?: "top" | "bottom";
}

export function AdSlot({ label, slotId, sticky }: AdSlotProps): JSX.Element {
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

  const stickyClass =
    sticky === "top"
      ? "top-0 border-b"
      : sticky === "bottom"
      ? "bottom-0 border-t"
      : "border";

  return (
    <aside
      className={`z-30 flex w-full items-center justify-center border-indigo-200/60 bg-indigo-50/90 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-indigo-600 shadow-md shadow-indigo-500/10 backdrop-blur dark:border-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-200 ${
        sticky ? `sticky ${stickyClass}` : "rounded-2xl"
      }`}
      aria-label={label}
    >
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "100%" }}
        data-ad-client="ca-pub-REPLACE-ME"
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </aside>
  );
}
