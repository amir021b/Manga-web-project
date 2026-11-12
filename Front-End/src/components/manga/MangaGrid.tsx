function MangaGrid({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`grid gap-4 sm:grid-cols-3 ${className}`}>
      {children}
    </div>
  );
}

export default MangaGrid;
