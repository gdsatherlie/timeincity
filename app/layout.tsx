import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HireCRE | Commercial Real Estate Jobs & Resources",
  description:
    "HireCRE is the modern job board and resource hub for commercial real estate professionals across acquisitions, development, debt, and operations.",
  metadataBase: new URL("https://hirecre.com")
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50">
        <div className="relative isolate overflow-hidden">
          <div className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl" aria-hidden="true">
            <div
              className="relative left-1/2 aspect-[1155/678] w-[72.1875rem] -translate-x-1/2 bg-gradient-to-tr from-brand-200 to-brand-500 opacity-25"
              style={{ clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" }}
            />
          </div>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
