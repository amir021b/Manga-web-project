export default function Loading() {
  return (
    <section className="min-h-screen w-full bg-transparent px-4 pt-16 pb-16">
      <div
        role="status"
        aria-busy="true"
        aria-label="Loading manga details"
        className="mx-auto max-w-5xl"
      >
        <div className="flex animate-pulse flex-col items-start gap-8 lg:flex-row lg:items-center">
          <div className="w-[180px] flex-shrink-0 lg:w-[220px]">
            <div className="aspect-[3/4] rounded-2xl border border-[var(--mh-border)] bg-[var(--mh-card-bg)]" />
          </div>
          <div className="flex-1 space-y-4">
            <div className="h-8 w-2/3 rounded-2xl border border-[var(--mh-border)] bg-[var(--mh-card-bg)]" />
            <div className="h-4 w-1/2 rounded-2xl border border-[var(--mh-border)] bg-[var(--mh-card-bg)]" />
            <div className="flex gap-2">
              {[0, 1, 2].map((item) => (
                <div
                  key={item}
                  className="h-6 w-16 rounded-full border border-[var(--mh-border)] bg-[var(--mh-card-bg)]"
                />
              ))}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="h-12 flex-1 rounded-[11px] bg-[var(--mh-card-bg)]" />
              <div className="h-12 flex-1 rounded-[11px] bg-[var(--mh-card-bg)]" />
            </div>
          </div>
        </div>
        <div className="mt-16 animate-pulse space-y-4">
          <div className="h-6 w-32 rounded-2xl border border-[var(--mh-border)] bg-[var(--mh-card-bg)]" />
          <div className="h-4 w-full rounded-2xl border border-[var(--mh-border)] bg-[var(--mh-card-bg)]" />
          <div className="h-4 w-5/6 rounded-2xl border border-[var(--mh-border)] bg-[var(--mh-card-bg)]" />
        </div>
        <div className="mt-8 animate-pulse space-y-4">
          <div className="h-6 w-40 rounded-2xl border border-[var(--mh-border)] bg-[var(--mh-card-bg)]" />
          <div className="space-y-1 rounded-xl border border-[var(--mh-border)] bg-[var(--mh-card-bg)] p-4">
            {[0, 1, 2].map((item) => (
              <div
                key={item}
                className="h-10 w-full rounded-lg bg-[var(--mh-surface)]"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
