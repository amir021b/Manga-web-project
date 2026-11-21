export default function Loading() {
  return (
    <section className="min-h-screen w-full bg-transparent px-4 pt-24 pb-8">
      <div
        role="status"
        aria-busy="true"
        aria-label="Loading search results"
        className="mx-auto max-w-5xl"
      >
        <div className="mb-8 animate-pulse space-y-2">
          <div className="h-9 w-64 rounded-2xl border border-[var(--mh-border)] bg-[var(--mh-card-bg)]" />
          <div className="h-4 w-80 rounded-2xl border border-[var(--mh-border)] bg-[var(--mh-card-bg)]" />
        </div>
        <div className="mb-4 h-3 w-24 animate-pulse rounded-2xl border border-[var(--mh-border)] bg-[var(--mh-card-bg)]" />
        <div className="grid animate-pulse grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((item) => (
            <div
              key={item}
              className="aspect-[3/4] min-h-[260px] w-full rounded-2xl border border-[var(--mh-border)] bg-[var(--mh-card-bg)]"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
