interface AdSlotProps {
  label: string;
  sticky?: "top" | "bottom";
}

export function AdSlot({ label, sticky }: AdSlotProps): JSX.Element {
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
    >
      {label} placeholder
    </aside>
  );
}
