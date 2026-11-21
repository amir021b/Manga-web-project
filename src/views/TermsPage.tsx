import Link from "next/link";
import { TERMS_SECTIONS } from "@/constants/termsContent";

function TermsPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-16 pt-28">
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--mh-accent)]">
        Legal
      </p>
      <h1 className="mt-3 text-3xl font-bold text-[var(--mh-text)]">
        Terms &amp; Privacy
      </h1>
      <p className="mt-3 text-sm text-[var(--mh-text-secondary)]">
        The rules for using MangaHub and how this preview handles your data.
      </p>

      <div className="mt-8 space-y-5">
        {TERMS_SECTIONS.map((section) => (
          <section
            key={section.title}
            id={section.title.toLowerCase().includes("privacy") ? "privacy" : undefined}
            className="rounded-2xl border border-[var(--mh-border)] bg-[var(--mh-surface)] p-6"
          >
            <h2 className="text-lg font-semibold text-[var(--mh-text)]">
              {section.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--mh-text-secondary)]">
              {section.text}
            </p>
          </section>
        ))}
      </div>

      <Link
        href="/"
        className="mt-8 inline-flex rounded-full border border-[var(--mh-border)] bg-[var(--mh-surface)] px-5 py-2.5 text-sm text-[var(--mh-text)] transition hover:bg-[var(--mh-surface-strong)]"
      >
        Back to home
      </Link>
    </div>
  );
}

export default TermsPage;
