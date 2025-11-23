import Link from "next/link";

import { NavBar } from "@components/NavBar";
import { JobCard } from "@components/JobCard";
import { SectionHeader } from "@components/SectionHeader";
import { jobs } from "@lib/data";

const functions = Array.from(new Set(jobs.map((job) => job.function)));
const assetClasses = Array.from(new Set(jobs.flatMap((job) => job.assetClasses)));

export default function JobsPage(): JSX.Element {
  return (
    <div>
      <NavBar />
      <section className="section-shell space-y-8 py-12">
        <SectionHeader
          eyebrow="Search"
          title="Find CRE jobs built for operators"
          description="Filter by function, seniority, and asset class. Server components keep things fast and SEO-friendly."
        />
        <div className="grid gap-8 lg:grid-cols-[320px,1fr] lg:items-start">
          <aside className="card space-y-4">
            <div>
              <label htmlFor="keyword">Keyword</label>
              <input id="keyword" name="keyword" placeholder="Title, company, city" />
            </div>
            <div>
              <label htmlFor="function">Function</label>
              <select id="function" name="function" defaultValue="">
                <option value="">Any</option>
                {functions.map((fn) => (
                  <option key={fn} value={fn}>
                    {fn}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="asset">Asset class</label>
              <select id="asset" name="asset" defaultValue="">
                <option value="">Any</option>
                {assetClasses.map((asset) => (
                  <option key={asset} value={asset}>
                    {asset}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="minComp">Min comp</label>
                <input id="minComp" name="minComp" type="number" placeholder="$90,000" />
              </div>
              <div>
                <label htmlFor="maxComp">Max comp</label>
                <input id="maxComp" name="maxComp" type="number" placeholder="$200,000" />
              </div>
            </div>
            <div>
              <label className="mb-2 block">Location type</label>
              <div className="flex flex-wrap gap-2">
                {["On-Site", "Hybrid", "Remote"].map((mode) => (
                  <span key={mode} className="pill">
                    {mode}
                  </span>
                ))}
              </div>
            </div>
            <button className="btn-primary w-full" type="button">
              Apply filters
            </button>
          </aside>

          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-slate-700">
              <p>{jobs.length} open roles</p>
              <div className="flex items-center gap-2">
                <label htmlFor="sort" className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Sort by
                </label>
                <select id="sort" name="sort" className="w-48">
                  <option>Newest</option>
                  <option>Most relevant</option>
                  <option>Highest compensation</option>
                </select>
              </div>
            </div>
            <div className="grid gap-4">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </div>
        </div>
        <div className="card mt-6 flex items-center justify-between">
          <div>
            <p className="font-semibold text-slate-900">Employers</p>
            <p className="subtext">Post to a niche audience of CRE operators.</p>
          </div>
          <Link href="/employers" className="btn-primary">
            Post a job
          </Link>
        </div>
      </section>
    </div>
  );
}
