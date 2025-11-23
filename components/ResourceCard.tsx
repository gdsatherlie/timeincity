import Link from "next/link";
import type { Resource } from "@lib/types";

export function ResourceCard({ resource }: { resource: Resource }): JSX.Element {
  return (
    <div className="card flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-brand-700">{resource.type}</p>
          <h3 className="text-lg font-semibold text-slate-900">
            <Link href={`/resources/${resource.slug}`} className="hover:text-brand-700">
              {resource.title}
            </Link>
          </h3>
          <p className="subtext mt-2">{resource.description}</p>
        </div>
        <span className="pill">{resource.skillLevel}</span>
      </div>
      <div className="flex flex-wrap gap-2 text-xs text-slate-700">
        {resource.assetClasses.map((asset) => (
          <span key={asset} className="pill">
            {asset}
          </span>
        ))}
        {resource.tags.map((tag) => (
          <span key={tag} className="pill">
            {tag}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-700">{resource.isPremium ? "Premium" : "Free"}</span>
        <Link href={`/resources/${resource.slug}`} className="btn-secondary">
          View resource
        </Link>
      </div>
    </div>
  );
}
