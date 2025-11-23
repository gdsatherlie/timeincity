import Link from "next/link";

const navLinks = [
  { href: "/jobs", label: "Jobs" },
  { href: "/resources", label: "Resources" },
  { href: "/blog", label: "Blog" },
  { href: "/employers", label: "For Employers" }
];

export function NavBar(): JSX.Element {
  return (
    <header className="sticky top-0 z-30 backdrop-blur bg-white/85 border-b border-slate-200">
      <div className="section-shell flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-slate-900">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-brand-600 text-white">HC</span>
          <span>HireCRE</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-700 sm:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-brand-700">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3 text-sm">
          <Link href="/login" className="btn-secondary">
            Sign in
          </Link>
          <Link href="/signup" className="btn-primary">
            Create account
          </Link>
        </div>
      </div>
    </header>
  );
}
