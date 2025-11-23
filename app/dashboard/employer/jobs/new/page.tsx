import Link from "next/link";

import { NavBar } from "@components/NavBar";
import { JobForm } from "@components/JobForm";

export default function NewJobPage(): JSX.Element {
  return (
    <div>
      <NavBar />
      <section className="section-shell space-y-6 py-12">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">Employer</p>
            <h1 className="text-3xl font-semibold text-slate-900">Create a new job</h1>
            <p className="subtext">Multi-step form with Zod validation. Wire to Supabase RPC or API route.</p>
          </div>
          <Link href="/dashboard/employer" className="btn-secondary">
            Back to dashboard
          </Link>
        </div>
        <JobForm />
      </section>
    </div>
  );
}
