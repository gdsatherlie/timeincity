export function SectionHeader({
  eyebrow,
  title,
  description,
  cta
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  cta?: React.ReactNode;
}): JSX.Element {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        {eyebrow ? <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">{eyebrow}</p> : null}
        <h2 className="section-title">{title}</h2>
        {description ? <p className="subtext mt-2 max-w-3xl">{description}</p> : null}
      </div>
      {cta ? <div className="flex-shrink-0">{cta}</div> : null}
    </div>
  );
}
