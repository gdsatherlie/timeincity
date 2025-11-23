import Link from "next/link";

import { NavBar } from "@components/NavBar";
import { JobCard } from "@components/JobCard";
import { SectionHeader } from "@components/SectionHeader";
import { jobs, resources } from "@lib/data";

export default function CandidateDashboard(): JSX.Element {
  const savedJobs = jobs.slice(0, 2);
  const recommended = jobs.filter((job) => job.function === "Acquisitions").slice(0, 2);

  return (
    <div>
      <NavBar />
      <section className="section-shell space-y-8 py-12">
        <SectionHeader
          eyebrow="Candidate"
          title="Your HireCRE dashboard"
          description="Track saved jobs, monitor applications, and pick up underwriting tools quickly."
          cta={
            <Link href="/jobs" className="btn-primary">
              Browse jobs
            </Link>
          }
        />

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="card">
            <p className="subtext">Saved jobs</p>
            <p className="text-3xl font-semibold text-slate-900">{savedJobs.length}</p>
          </div>
          <div className="card">
            <p className="subtext">Applications in progress</p>
            <p className="text-3xl font-semibold text-slate-900">3</p>
          </div>
        </div>

        <div className="card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">Recommended for you</h2>
            <Link href="/jobs" className="btn-secondary">
              Refresh
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {recommended.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>

        <div className="card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">Saved resources</h2>
            <Link href="/resources" className="btn-secondary">
              Browse library
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {resources.slice(0, 2).map((resource) => (
              <div key={resource.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">{resource.title}</p>
                <p className="subtext">{resource.type} • {resource.skillLevel}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
