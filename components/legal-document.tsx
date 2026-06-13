import Link from "next/link";

export const LEGAL = {
  siteName: "BoulderingNearMe",
  domain: "BoulderingNearMe.com",
  effectiveDate: "June 13, 2026",
  contactEmail: "legal@boulderingnearme.com",
} as const;

export function LegalDocument({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <header className="mb-10 border-b border-stone-200 pb-8">
        <p className="text-sm font-medium text-amber-700">{LEGAL.domain}</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
          {title}
        </h1>
        <p className="mt-3 text-sm text-stone-500">
          Effective date: {LEGAL.effectiveDate}
        </p>
        <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          This document is provided for general informational purposes and does not
          constitute legal advice. Have a qualified attorney review these terms for
          your specific business, jurisdiction, and risk profile.
        </p>
      </header>

      <div className="legal-prose space-y-8 text-stone-700">{children}</div>

      <footer className="mt-12 border-t border-stone-200 pt-8 text-sm text-stone-500">
        <p>
          Questions? Contact{" "}
          <a
            href={`mailto:${LEGAL.contactEmail}`}
            className="font-medium text-amber-700 hover:underline"
          >
            {LEGAL.contactEmail}
          </a>
        </p>
        <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1">
          <Link href="/terms" className="font-medium text-amber-700 hover:underline">
            Terms of Service
          </Link>
          <Link href="/privacy" className="font-medium text-amber-700 hover:underline">
            Privacy Policy
          </Link>
        </p>
      </footer>
    </article>
  );
}

export function LegalSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="text-xl font-semibold text-stone-900">{title}</h2>
      <div className="mt-3 space-y-3 text-[15px] leading-relaxed">{children}</div>
    </section>
  );
}
