import Link from "next/link";

import { NavBar } from "@components/NavBar";
import { JobCard } from "@components/JobCard";
import { SectionHeader } from "@components/SectionHeader";
import { jobs } from "@lib/data";

export default function EmployerDashboard(): JSX.Element {
  const activeJobs = jobs.filter((job) => job.isActive);

  return (
    <div>
      <NavBar />
      <section className="section-shell space-y-8 py-12">
        <SectionHeader
          eyebrow="Employer"
          title="Manage your postings"
          description="Track views, applications, and keep job content fresh. Future Supabase integration can power live analytics."
          cta={
            <Link href="/dashboard/employer/jobs/new" className="btn-primary">
              Post new job
            </Link>
          }
        />

        <div className="grid gap-6 sm:grid-cols-3">
          <div className="card">
            <p className="subtext">Active jobs</p>
            <p className="text-3xl font-semibold text-slate-900">{activeJobs.length}</p>
          </div>
          <div className="card">
            <p className="subtext">Total views</p>
            <p className="text-3xl font-semibold text-slate-900">8,420</p>
          </div>
          <div className="card">
            <p className="subtext">Applications</p>
            <p className="text-3xl font-semibold text-slate-900">126</p>
          </div>
        </div>

        <div className="card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">Open roles</h2>
            <Link href="/dashboard/employer/jobs/new" className="btn-secondary">
              Add role
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {activeJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
