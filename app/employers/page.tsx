import Link from "next/link";

import { NavBar } from "@components/NavBar";
import { SectionHeader } from "@components/SectionHeader";
import { jobs } from "@lib/data";

export default function EmployersPage(): JSX.Element {
  const activeJobs = jobs.filter((job) => job.isActive);

  return (
    <div>
      <NavBar />
      <section className="section-shell space-y-8 py-12">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <p className="badge w-fit">For employers</p>
            <h1 className="text-4xl font-semibold text-slate-900">Post your next CRE hire with confidence.</h1>
            <p className="text-lg text-slate-700">
              Targeted distribution to CRE operators across acquisitions, development, capital markets, and property management. Feature your roles and track views/clicks.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/dashboard/employer" className="btn-primary">
                Post a job
              </Link>
              <Link href="/contact" className="btn-secondary">
                Talk to us
              </Link>
            </div>
            <ul className="space-y-3 text-slate-700">
              <li className="flex items-center gap-2">
                <span className="badge">1</span>
                Promote to thousands of qualified candidates.
              </li>
              <li className="flex items-center gap-2">
                <span className="badge">2</span>
                Feature roles across the HireCRE homepage and newsletter.
              </li>
              <li className="flex items-center gap-2">
                <span className="badge">3</span>
                Manage postings, deactivate or duplicate templates in your dashboard.
              </li>
            </ul>
          </div>
          <div className="card space-y-4">
            <SectionHeader
              eyebrow="Platform stats"
              title="Active visibility"
              description="Snapshot of current activity from the mock data set."
            />
            <div className="grid grid-cols-2 gap-4 text-sm text-slate-700">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-3xl font-semibold text-slate-900">{activeJobs.length}</p>
                <p>Active jobs live</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-3xl font-semibold text-slate-900">2.4k</p>
                <p>Avg. monthly views</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-3xl font-semibold text-slate-900">35%</p>
                <p>Featured CTR lift</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-3xl font-semibold text-slate-900">48hrs</p>
                <p>Average approval</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
