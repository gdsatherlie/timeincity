interface RichTextPageProps {
  heading: string;
  paragraphs: string[];
}

export function RichTextPage({ heading, paragraphs }: RichTextPageProps): JSX.Element {
  return (
    <section className="rounded-3xl border border-slate-200/70 bg-white/80 p-8 shadow-lg shadow-slate-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
      <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">{heading}</h1>
      <div className="mt-4 space-y-4 text-base text-slate-600 dark:text-slate-300">
        {paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}
