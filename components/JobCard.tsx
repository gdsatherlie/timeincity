import Link from "next/link";
import { companies } from "@lib/data";
import type { Job } from "@lib/types";

export function JobCard({ job }: { job: Job }): JSX.Element {
  const company = companies.find((c) => c.id === job.companyId);
  return (
    <div className="card flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-brand-700">{company?.name ?? "Company"}</p>
          <h3 className="text-lg font-semibold text-slate-900">
            <Link href={`/jobs/${job.slug}`} className="hover:text-brand-700">
              {job.title}
            </Link>
          </h3>
          <p className="subtext mt-1 flex flex-wrap gap-2">
            <span>{job.city}, {job.state}</span>
            <span>• {job.locationType}</span>
            <span>• {job.employmentType}</span>
          </p>
        </div>
        {job.isFeatured ? <span className="badge">Featured</span> : null}
      </div>
      <div className="flex flex-wrap gap-2 text-xs text-slate-700">
        <span className="pill">{job.function}</span>
        <span className="pill">{job.seniority}</span>
        {job.assetClasses.map((asset) => (
          <span key={asset} className="pill">
            {asset}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-between text-sm text-slate-700">
        <span>
          {job.compensationRangeMin && job.compensationRangeMax
            ? `${job.compensationCurrency ?? "USD"} ${job.compensationRangeMin.toLocaleString()} - ${job.compensationRangeMax.toLocaleString()}`
            : "Compensation confidential"}
        </span>
        <Link href={`/jobs/${job.slug}`} className="btn-secondary">
          View role
        </Link>
      </div>
    </div>
  );
}
