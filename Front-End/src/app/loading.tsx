export default function Loading() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading"
      className="flex min-h-screen w-full items-center justify-center bg-[var(--mh-bg)] px-4"
    >
      <div className="aspect-[3/4] w-full max-w-xs animate-pulse rounded-2xl border border-[var(--mh-border)] bg-[var(--mh-card-bg)]" />
    </div>
  );
}
