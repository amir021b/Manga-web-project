export default function Loading() {
  return (
    <section className="min-h-screen w-full bg-transparent px-4 pt-24 pb-8">
      <div
        role="status"
        aria-busy="true"
        aria-label="Loading explore page"
        className="mx-auto max-w-5xl"
      >
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="animate-pulse space-y-2">
            <div className="h-9 w-40 rounded-2xl border border-[var(--mh-border)] bg-[var(--mh-card-bg)]" />
            <div className="h-4 w-52 rounded-2xl border border-[var(--mh-border)] bg-[var(--mh-card-bg)]" />
          </div>
          <div className="flex animate-pulse gap-2">
            {[0, 1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-8 w-16 rounded-full border border-[var(--mh-border)] bg-[var(--mh-card-bg)]"
              />
            ))}
          </div>
        </div>
        <div className="mb-4 h-3 w-24 animate-pulse rounded-2xl border border-[var(--mh-border)] bg-[var(--mh-card-bg)]" />
        <div className="grid animate-pulse grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
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
