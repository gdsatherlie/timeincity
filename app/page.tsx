import Link from "next/link";

import { NavBar } from "@components/NavBar";
import { PostCard } from "@components/PostCard";
import { ResourceCard } from "@components/ResourceCard";
import { SectionHeader } from "@components/SectionHeader";
import { JobCard } from "@components/JobCard";
import { featuredJobs, featuredResources, latestPosts } from "@lib/data";

export default function HomePage(): JSX.Element {
  return (
    <div>
      <NavBar />
      <section className="section-shell py-16 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-2 text-xs font-semibold text-brand-700">
              <span className="h-2 w-2 rounded-full bg-brand-500" />
              CRE job board & resource hub
            </div>
            <h1 className="text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl">
              HireCRE – the commercial real estate job board and toolkit.
            </h1>
            <p className="text-lg text-slate-700 sm:max-w-xl">
              Discover curated roles in acquisitions, development, capital markets, and operations. Download underwriting models, templates, and guides built by CRE operators.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/jobs" className="btn-primary">
                Browse Jobs
              </Link>
              <Link href="/employers" className="btn-secondary">
                For Employers
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm text-slate-700 sm:max-w-md">
              <div className="rounded-2xl border border-slate-200 bg-white/60 p-4 shadow-sm">
                <p className="text-2xl font-semibold text-slate-900">3k+</p>
                <p className="text-sm text-slate-600">Monthly CRE candidates</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white/60 p-4 shadow-sm">
                <p className="text-2xl font-semibold text-slate-900">120+</p>
                <p className="text-sm text-slate-600">Models & templates</p>
              </div>
            </div>
          </div>
          <div className="card border-brand-100 bg-white/80 shadow-lg shadow-brand-100">
            <p className="text-sm font-semibold text-brand-700">Highlights</p>
            <ul className="mt-4 space-y-4 text-slate-700">
              <li className="flex gap-3">
                <span className="badge">1</span>
                <div>
                  <p className="font-semibold text-slate-900">Curated CRE roles</p>
                  <p className="subtext">Acquisitions, development, debt & capital markets, property management.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="badge">2</span>
                <div>
                  <p className="font-semibold text-slate-900">Resources library</p>
                  <p className="subtext">Underwriting models, templates, and operator-built playbooks.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="badge">3</span>
                <div>
                  <p className="font-semibold text-slate-900">Premium UX</p>
                  <p className="subtext">Minimal, modern, and responsive design tuned for busy teams.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section-shell space-y-8 pb-16">
        <SectionHeader
          eyebrow="Featured roles"
          title="Top opportunities curated for CRE operators"
          description="Roles across acquisitions, development, and capital markets with transparent compensation bands."
          cta={
            <Link href="/jobs" className="btn-secondary">
              View all jobs
            </Link>
          }
        />
        <div className="grid gap-6 md:grid-cols-2">
          {featuredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </section>

      <section className="section-shell space-y-8 pb-16">
        <SectionHeader
          eyebrow="Resources library"
          title="Underwriting models, templates, and guides"
          description="Operator-built downloads to accelerate investment memos, debt marketing, and construction reporting."
          cta={
            <Link href="/resources" className="btn-secondary">
              Explore resources
            </Link>
          }
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {featuredResources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      </section>

      <section className="section-shell space-y-8 pb-20">
        <SectionHeader
          eyebrow="Editorial"
          title="Latest from HireCRE"
          description="Career tips, comp benchmarks, and underwriting insights for CRE professionals."
          cta={
            <Link href="/blog" className="btn-secondary">
              Browse all posts
            </Link>
          }
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {latestPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </div>
  );
}
