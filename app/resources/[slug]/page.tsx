import Link from "next/link";
import { notFound } from "next/navigation";

import { NavBar } from "@components/NavBar";
import { ResourceCard } from "@components/ResourceCard";
import { resources } from "@lib/data";

export default function ResourceDetailPage({ params }: { params: { slug: string } }): JSX.Element {
  const resource = resources.find((item) => item.slug === params.slug);
  if (!resource) return notFound();

  const related = resources.filter((item) => item.type === resource.type && item.id !== resource.id).slice(0, 2);

  return (
    <div>
      <NavBar />
      <section className="section-shell space-y-8 py-12">
        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <article className="card space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-brand-700">{resource.type}</p>
                <h1 className="text-3xl font-semibold text-slate-900">{resource.title}</h1>
                <p className="subtext mt-2">{resource.description}</p>
              </div>
              <span className="pill">{resource.skillLevel}</span>
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-slate-700">
              {resource.assetClasses.map((asset) => (
                <span key={asset} className="pill">{asset}</span>
              ))}
              {resource.tags.map((tag) => (
                <span key={tag} className="pill">{tag}</span>
              ))}
            </div>
            <div className="card bg-slate-50">
              <p className="subtext">Access</p>
              <p className="font-semibold text-slate-900">{resource.isPremium ? "Premium" : "Free to download"}</p>
              <Link href={resource.fileUrl ?? resource.externalLink ?? "#"} className="btn-primary mt-3 inline-flex">
                {resource.fileUrl ? "Download" : "Open resource"}
              </Link>
            </div>
          </article>

          <aside className="space-y-4">
            <div className="card space-y-2">
              <p className="font-semibold text-slate-900">Usage tips</p>
              <ul className="list-disc list-inside space-y-2 text-slate-700">
                <li>Duplicate the workbook to your own drive.</li>
                <li>Use the tags to organize your library and saved searches.</li>
                <li>Flag isPremium resources for future monetization flows.</li>
              </ul>
            </div>
          </aside>
        </div>

        {related.length ? (
          <section className="space-y-4">
            <h2 className="section-title">Related resources</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {related.map((item) => (
                <ResourceCard key={item.id} resource={item} />
              ))}
            </div>
          </section>
        ) : null}
      </section>
    </div>
  );
}
