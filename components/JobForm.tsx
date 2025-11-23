"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const jobSchema = z.object({
  title: z.string().min(3),
  company: z.string().min(2),
  city: z.string().min(2),
  state: z.string().min(2),
  locationType: z.enum(["On-Site", "Hybrid", "Remote"]),
  employmentType: z.enum(["Full-Time", "Part-Time", "Internship", "Contract"]),
  function: z.string().min(2),
  seniority: z.enum(["Analyst", "Associate", "VP", "Director", "MD/Principal"]),
  assetClasses: z.string().min(2),
  compensationMin: z.number().optional(),
  compensationMax: z.number().optional(),
  applicationUrl: z.string().url().optional(),
  applicationEmail: z.string().email().optional(),
  description: z.string().min(10),
  responsibilities: z.string().min(10),
  requirements: z.string().min(10)
});

export type JobFormValues = z.infer<typeof jobSchema>;

export function JobForm({
  defaultValues,
  onSubmit
}: {
  defaultValues?: Partial<JobFormValues>;
  onSubmit?: (values: JobFormValues) => void;
}): JSX.Element {
  const [step, setStep] = useState(1);
  const isLastStep = step === 3;

  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: "",
      company: "",
      city: "",
      state: "",
      locationType: "Hybrid",
      employmentType: "Full-Time",
      function: "Acquisitions",
      seniority: "Associate",
      assetClasses: "Multifamily",
      description: "",
      responsibilities: "",
      requirements: "",
      ...defaultValues
    }
  });

  const handleSubmit = form.handleSubmit((values) => {
    onSubmit?.(values);
    alert("Mock submit: ready to connect to Supabase");
  });

  const renderStep = useMemo(() => {
    switch (step) {
      case 1:
        return (
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label>Title</label>
              <input {...form.register("title")} />
              <FieldError message={form.formState.errors.title?.message} />
            </div>
            <div>
              <label>Company</label>
              <input {...form.register("company")} />
              <FieldError message={form.formState.errors.company?.message} />
            </div>
            <div>
              <label>City</label>
              <input {...form.register("city")} />
              <FieldError message={form.formState.errors.city?.message} />
            </div>
            <div>
              <label>State</label>
              <input {...form.register("state")} />
              <FieldError message={form.formState.errors.state?.message} />
            </div>
            <div>
              <label>Function</label>
              <input {...form.register("function")} />
              <FieldError message={form.formState.errors.function?.message} />
            </div>
            <div>
              <label>Seniority</label>
              <select {...form.register("seniority")}>
                <option>Analyst</option>
                <option>Associate</option>
                <option>VP</option>
                <option>Director</option>
                <option>MD/Principal</option>
              </select>
            </div>
            <div>
              <label>Asset classes</label>
              <input {...form.register("assetClasses")} />
              <FieldError message={form.formState.errors.assetClasses?.message} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label>Employment type</label>
                <select {...form.register("employmentType")}>
                  <option>Full-Time</option>
                  <option>Part-Time</option>
                  <option>Internship</option>
                  <option>Contract</option>
                </select>
              </div>
              <div>
                <label>Location type</label>
                <select {...form.register("locationType")}>
                  <option>On-Site</option>
                  <option>Hybrid</option>
                  <option>Remote</option>
                </select>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label>Min compensation</label>
              <input type="number" {...form.register("compensationMin", { valueAsNumber: true })} />
              <FieldError message={form.formState.errors.compensationMin?.message} />
            </div>
            <div>
              <label>Max compensation</label>
              <input type="number" {...form.register("compensationMax", { valueAsNumber: true })} />
              <FieldError message={form.formState.errors.compensationMax?.message} />
            </div>
            <div>
              <label>Application URL</label>
              <input {...form.register("applicationUrl")} />
              <FieldError message={form.formState.errors.applicationUrl?.message} />
            </div>
            <div>
              <label>Application email</label>
              <input {...form.register("applicationEmail")} />
              <FieldError message={form.formState.errors.applicationEmail?.message} />
            </div>
          </div>
        );
      case 3:
      default:
        return (
          <div className="space-y-4">
            <div>
              <label>Description</label>
              <textarea rows={3} {...form.register("description")} />
              <FieldError message={form.formState.errors.description?.message} />
            </div>
            <div>
              <label>Responsibilities</label>
              <textarea rows={3} {...form.register("responsibilities")} />
              <FieldError message={form.formState.errors.responsibilities?.message} />
            </div>
            <div>
              <label>Requirements</label>
              <textarea rows={3} {...form.register("requirements")} />
              <FieldError message={form.formState.errors.requirements?.message} />
            </div>
          </div>
        );
    }
  }, [form, step]);

  return (
    <form onSubmit={handleSubmit} className="card space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="subtext">Step {step} of 3</p>
          <h2 className="text-xl font-semibold text-slate-900">Job details</h2>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <span className={step === 1 ? "text-brand-700" : ""}>Basics</span>
          <span>•</span>
          <span className={step === 2 ? "text-brand-700" : ""}>Compensation</span>
          <span>•</span>
          <span className={step === 3 ? "text-brand-700" : ""}>Narrative</span>
        </div>
      </div>

      {renderStep}

      <div className="flex items-center justify-between">
        <button
          type="button"
          className="btn-secondary"
          disabled={step === 1}
          onClick={() => setStep((prev) => Math.max(prev - 1, 1))}
        >
          Back
        </button>
        {isLastStep ? (
          <button type="submit" className="btn-primary">
            Publish job
          </button>
        ) : (
          <button type="button" className="btn-primary" onClick={() => setStep((prev) => prev + 1)}>
            Continue
          </button>
        )}
      </div>
    </form>
  );
}

function FieldError({ message }: { message?: string }): JSX.Element | null {
  if (!message) return null;
  return <p className="text-xs text-red-600">{message}</p>;
}
