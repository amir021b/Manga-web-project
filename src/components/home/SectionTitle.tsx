function SectionTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex w-full items-center gap-4 ${className || ''}`}>
      <span className="h-[1px] flex-1 bg-[var(--mh-border-soft)]" />
      <p className="shrink-0 text-xs font-normal uppercase tracking-[0.4em] text-[var(--mh-text-secondary)] sm:text-sm">
        {children}
      </p>
      <span className="h-[1px] flex-1 bg-[var(--mh-border-soft)]" />
    </div>
  );
}

export default SectionTitle;
