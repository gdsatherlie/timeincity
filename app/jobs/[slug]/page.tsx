import Link from "next/link";
import { notFound } from "next/navigation";

import { NavBar } from "@components/NavBar";
import { JobCard } from "@components/JobCard";
import { companies, jobs } from "@lib/data";

function formatCurrency(value?: number, currency = "USD"): string {
  if (!value) return "";
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(value);
}

export default function JobDetailPage({ params }: { params: { slug: string } }): JSX.Element {
  const job = jobs.find((item) => item.slug === params.slug);
  if (!job) return notFound();
  const company = companies.find((c) => c.id === job.companyId);
  const related = jobs.filter((item) => item.function === job.function && item.id !== job.id).slice(0, 2);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    datePosted: job.postedAt,
    employmentType: job.employmentType,
    hiringOrganization: {
      "@type": "Organization",
      name: company?.name
    },
    jobLocationType: job.locationType,
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.city,
        addressRegion: job.state,
        addressCountry: job.country
      }
    },
    baseSalary: {
      "@type": "MonetaryAmount",
      currency: job.compensationCurrency ?? "USD",
      value: {
        "@type": "QuantitativeValue",
        minValue: job.compensationRangeMin,
        maxValue: job.compensationRangeMax,
        unitText: "YEAR"
      }
    }
  };

  return (
    <div>
      <NavBar />
      <section className="section-shell space-y-8 py-12">
        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <article className="card space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-brand-700">{company?.name}</p>
                <h1 className="text-3xl font-semibold text-slate-900">{job.title}</h1>
                <p className="subtext mt-2 flex flex-wrap gap-2">
                  <span>{job.city}, {job.state}</span>
                  <span>• {job.locationType}</span>
                  <span>• {job.employmentType}</span>
                </p>
              </div>
              <Link href={job.applicationUrl ?? `mailto:${job.applicationEmail}`} className="btn-primary">
                Apply now
              </Link>
            </div>

            <div className="flex flex-wrap gap-2 text-xs text-slate-700">
              <span className="pill">{job.function}</span>
              <span className="pill">{job.seniority}</span>
              {job.assetClasses.map((asset) => (
                <span key={asset} className="pill">{asset}</span>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-3">
              <div>
                <p className="subtext">Compensation</p>
                <p className="font-semibold text-slate-900">
                  {formatCurrency(job.compensationRangeMin, job.compensationCurrency)} – {formatCurrency(job.compensationRangeMax, job.compensationCurrency)}
                </p>
              </div>
              <div>
                <p className="subtext">Asset classes</p>
                <p className="font-semibold text-slate-900">{job.assetClasses.join(", ")}</p>
              </div>
              <div>
                <p className="subtext">Posted</p>
                <p className="font-semibold text-slate-900">{new Date(job.postedAt).toLocaleDateString()}</p>
              </div>
            </div>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-slate-900">Role overview</h2>
              <p className="text-slate-700">{job.description}</p>
            </section>
            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-slate-900">Responsibilities</h2>
              <ul className="space-y-2 text-slate-700 list-disc list-inside">
                {job.responsibilities.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-slate-900">Requirements</h2>
              <ul className="space-y-2 text-slate-700 list-disc list-inside">
                {job.requirements.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          </article>

          <aside className="space-y-4">
            <div className="card space-y-2">
              <p className="subtext">Company</p>
              <p className="font-semibold text-slate-900">{company?.name}</p>
              <p className="subtext">{company?.description}</p>
              {company?.website ? (
                <Link href={company.website} className="btn-secondary">
                  Visit website
                </Link>
              ) : null}
            </div>
            <div className="card space-y-2">
              <p className="font-semibold text-slate-900">Ready to apply?</p>
              <p className="subtext">Use the application link or email the team with your materials.</p>
              <Link href={job.applicationUrl ?? `mailto:${job.applicationEmail}`} className="btn-primary">
                Apply now
              </Link>
            </div>
          </aside>
        </div>

        {related.length ? (
          <section className="space-y-4">
            <h2 className="section-title">Related roles</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {related.map((relatedJob) => (
                <JobCard key={relatedJob.id} job={relatedJob} />
              ))}
            </div>
          </section>
        ) : null}
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
