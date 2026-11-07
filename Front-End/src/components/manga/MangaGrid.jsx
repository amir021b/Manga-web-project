function MangaGrid({ children, className = '' }) {
  return (
    <div className={`grid gap-4 sm:grid-cols-3 ${className}`}>
      {children}
    </div>
  );
}

export default MangaGrid;
