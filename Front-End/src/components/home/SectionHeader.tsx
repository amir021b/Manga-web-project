function SectionHeader({ title, subtitle, className }: { title: string; subtitle?: string; className?: string }) {
  return (
    <div className={`flex w-full max-w-md flex-col items-center gap-3 text-center ${className || ''}`}>
      <div className="flex w-full items-center gap-4">
        <span className="h-[1px] flex-1 bg-[var(--mh-border-soft)]" />
        <p className="shrink-0 text-xs font-normal uppercase tracking-[0.4em] text-[var(--mh-text-secondary)] sm:text-sm">
          {title}
        </p>
        <span className="h-[1px] flex-1 bg-[var(--mh-border-soft)]" />
      </div>
      {subtitle && (
        <p className="text-sm italic tracking-wide text-[var(--mh-text-secondary)] sm:text-base">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default SectionHeader;
