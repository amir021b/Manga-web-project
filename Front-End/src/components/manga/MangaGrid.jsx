function MangaGrid({ children, className = '' }) {
  return (
    <div className={`grid grid-cols-1 gap-4 sm:grid-cols-3 ${className}`.trim()}>
      {children}
    </div>
  );
}

export default MangaGrid;
