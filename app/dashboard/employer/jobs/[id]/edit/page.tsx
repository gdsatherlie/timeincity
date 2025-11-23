import Link from "next/link";
import { notFound } from "next/navigation";

import { NavBar } from "@components/NavBar";
import { JobForm } from "@components/JobForm";
import { jobs } from "@lib/data";

export default function EditJobPage({ params }: { params: { id: string } }): JSX.Element {
  const job = jobs.find((item) => item.id === params.id);
  if (!job) return notFound();

  return (
    <div>
      <NavBar />
      <section className="section-shell space-y-6 py-12">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">Employer</p>
            <h1 className="text-3xl font-semibold text-slate-900">Edit job</h1>
            <p className="subtext">Update details and republish. This screen is ready to connect to Supabase mutations.</p>
          </div>
          <Link href="/dashboard/employer" className="btn-secondary">
            Back to dashboard
          </Link>
        </div>
        <JobForm
          defaultValues={{
            title: job.title,
            company: job.companyId,
            city: job.city,
            state: job.state,
            locationType: job.locationType,
            employmentType: job.employmentType,
            function: job.function,
            seniority: job.seniority,
            assetClasses: job.assetClasses.join(", "),
            compensationMin: job.compensationRangeMin,
            compensationMax: job.compensationRangeMax,
            applicationUrl: job.applicationUrl,
            applicationEmail: job.applicationEmail,
            description: job.description,
            responsibilities: job.responsibilities.join("\n"),
            requirements: job.requirements.join("\n")
          }}
        />
      </section>
    </div>
  );
}
