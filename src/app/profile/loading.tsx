export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 pt-28 pb-16">
      <div
        role="status"
        aria-busy="true"
        aria-label="Loading profile"
        className="animate-pulse"
      >
        <section className="rounded-2xl border border-[var(--mh-border)] bg-[var(--mh-gradient-bg)] p-6 shadow-[var(--mh-shadow-strong)] sm:p-8">
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:gap-6">
            <div className="h-24 w-24 shrink-0 rounded-full border-2 border-[var(--mh-border)] bg-[var(--mh-surface)]" />
            <div className="flex-1 space-y-2 text-center sm:text-left">
              <div className="mx-auto h-7 w-40 rounded-2xl border border-[var(--mh-border)] bg-[var(--mh-card-bg)] sm:mx-0" />
              <div className="mx-auto h-4 w-52 rounded-2xl border border-[var(--mh-border)] bg-[var(--mh-card-bg)] sm:mx-0" />
              <div className="mx-auto h-3 w-64 rounded-2xl border border-[var(--mh-border)] bg-[var(--mh-card-bg)] sm:mx-0" />
            </div>
            <div className="h-10 w-32 rounded-full border border-[var(--mh-border)] bg-[var(--mh-surface)]" />
          </div>
        </section>
        <div className="mt-8 flex gap-6 border-b border-[var(--mh-border)] pb-2">
          {[0, 1, 2].map((item) => (
            <div
              key={item}
              className="h-8 w-24 rounded-full border border-[var(--mh-border)] bg-[var(--mh-surface)]"
            />
          ))}
        </div>
        <div className="mt-8 h-[300px] rounded-2xl border border-[var(--mh-border)] bg-[var(--mh-surface)]" />
      </div>
    </div>
  );
}
