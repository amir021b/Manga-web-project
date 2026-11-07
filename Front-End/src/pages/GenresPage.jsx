function GenresPage() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-b from-[#050505] via-[#0d0d0d] to-[#000000]">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-black text-white/10 mb-4">Genres</h1>
        <h2 className="text-2xl font-bold text-white mb-2">Coming Soon</h2>
        <p className="text-white/60 mb-8">
          Browse manga by genre — Action, Romance, Fantasy, Sci-Fi, and more.
          Genre filtering is coming in the next update.
        </p>
        <button
          onClick={() => {}}
          className="h-12 rounded-[11px] bg-[#f2f2f2] text-black font-bold text-[15px] px-8 transition hover:bg-white"
        >
          Explore Home
        </button>
      </div>
    </section>
  );
}

export default GenresPage;
