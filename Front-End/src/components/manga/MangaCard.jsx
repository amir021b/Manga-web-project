function MangaCard({ id, title, genre, posterUrl, to }) {
  const destination = to || (id != null ? `/manga/${id}` : '#');
  const hasPoster = Boolean(posterUrl);

  return (
    <article className="group relative aspect-[3/4] min-h-[260px] w-full overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/90 transition-all duration-300 hover:-translate-y-2 hover:border-white/20 hover:shadow-[0_0_40px_rgba(255,255,255,0.1)]">
      <div
        className={hasPoster ? 'absolute inset-0 bg-cover bg-center' : 'absolute inset-0 bg-zinc-900'}
        style={hasPoster ? { backgroundImage: `url(${posterUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 z-10 p-4">
        <h3 className="text-base font-bold uppercase tracking-wide text-white/95">{title}</h3>
        <p className="mb-2 text-xs text-white/60">{genre}</p>
        <a
          href={destination}
          className="inline-block text-xs text-white/70 opacity-80 transition-all duration-300 group-hover:opacity-100 hover:text-white"
        >
          View Details →
        </a>
      </div>
    </article>
  );
}

export default MangaCard;
