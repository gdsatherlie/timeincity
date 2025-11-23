import { useMemo } from "react";
import { type Article } from "../data/articles";

interface GuideArticlePageProps {
  article: Article;
  onNavigate: (path: string) => void;
}

export function GuideArticlePage({ article, onNavigate }: GuideArticlePageProps): JSX.Element {
  const blocks = useMemo(() => {
    const lines = article.content.split(/\r?\n/);
    const elements: JSX.Element[] = [];
    let paragraph: string[] = [];
    let list: string[] | null = null;

    const flushParagraph = (key: string) => {
      if (paragraph.length) {
        elements.push(
          <p key={key} className="leading-relaxed">
            {paragraph.join(" ")}
          </p>
        );
        paragraph = [];
      }
    };

    const flushList = (key: string) => {
      if (list && list.length) {
        elements.push(
          <ul key={key} className="list-disc space-y-1 pl-5">
            {list.map((item, idx) => (
              <li key={`${key}-item-${idx}`}>{item}</li>
            ))}
          </ul>
        );
      }
      list = null;
    };

    lines.forEach((line, idx) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("### ")) {
        flushParagraph(`p-${idx}`);
        flushList(`l-${idx}`);
        elements.push(
          <h3 key={`h3-${idx}`} className="text-lg font-semibold">
            {trimmed.replace(/^###\s*/, "")}
          </h3>
        );
        return;
      }
      if (trimmed.startsWith("## ")) {
        flushParagraph(`p-${idx}`);
        flushList(`l-${idx}`);
        elements.push(
          <h2 key={`h2-${idx}`} className="text-xl font-semibold">
            {trimmed.replace(/^##\s*/, "")}
          </h2>
        );
        return;
      }
      if (trimmed.startsWith("# ")) {
        flushParagraph(`p-${idx}`);
        flushList(`l-${idx}`);
        elements.push(
          <h1 key={`h1-${idx}`} className="text-2xl font-semibold">
            {trimmed.replace(/^#\s*/, "")}
          </h1>
        );
        return;
      }
      if (trimmed === "---") {
        flushParagraph(`p-${idx}`);
        flushList(`l-${idx}`);
        elements.push(<hr key={`hr-${idx}`} className="my-4 border-slate-200 dark:border-slate-700" />);
        return;
      }
      if (trimmed.startsWith("- ")) {
        paragraph.length && flushParagraph(`p-${idx}`);
        list = list ? [...list, trimmed.replace(/^-\s*/, "")] : [trimmed.replace(/^-\s*/, "")];
        return;
      }
      if (!trimmed) {
        flushParagraph(`p-${idx}`);
        flushList(`l-${idx}`);
        return;
      }
      paragraph.push(trimmed);
    });

    flushParagraph(`p-final`);
    flushList(`l-final`);
    return elements;
  }, [article.content]);

  return (
    <article className="rounded-3xl border border-slate-200/70 bg-white/80 p-8 shadow-lg shadow-slate-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
      <button
        type="button"
        onClick={() => onNavigate("/guides")}
        className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600 transition hover:text-indigo-500 dark:text-indigo-300"
      >
        ← Back to guides
      </button>
      <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-100">{article.title}</h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{article.description}</p>
      <div className="prose prose-slate mt-6 max-w-none space-y-4 text-slate-800 dark:prose-invert dark:text-slate-100">
        {blocks}
      </div>
    </article>
  );
}
