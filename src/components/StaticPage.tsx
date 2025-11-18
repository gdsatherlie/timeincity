import type { StaticPageContent } from "../data/staticPages";

interface StaticPageProps {
  content: StaticPageContent;
}

export function StaticPage({ content }: StaticPageProps): JSX.Element {
  return (
    <section className="flex flex-col gap-6 rounded-3xl border border-slate-200/70 bg-white/80 p-6 text-slate-700 shadow-lg shadow-slate-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-200">
      <header>
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">{content.title}</h1>
        {content.intro ? <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{content.intro}</p> : null}
      </header>
      {content.sections.map((section, index) => (
        <article key={`${section.heading ?? "section"}-${index}`} className="flex flex-col gap-3">
          {section.heading ? (
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{section.heading}</h2>
          ) : null}
          {section.paragraphs?.map((paragraph, idx) => (
            <p key={idx} className="text-base leading-relaxed">
              {paragraph}
            </p>
          ))}
          {section.list ? (
            <ul className="list-disc space-y-2 pl-5 text-base leading-relaxed">
              {section.list.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          ) : null}
        </article>
      ))}
    </section>
  );
}
