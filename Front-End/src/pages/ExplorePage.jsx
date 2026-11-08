import { useState, useMemo } from 'react';
import MangaGrid from '../components/manga/MangaGrid';
import MangaCard from '../components/manga/MangaCard';
import { bigThree } from '../data/bigThree';
import { bestSellers } from '../data/bestSellers';
import { latestUpdates } from '../data/latestUpdates';

const allManga = [...bigThree, ...bestSellers, ...latestUpdates];

const GENRES = [
  'All',
  'Best Sellers',
  ...Array.from(new Set(allManga.map((m) => m.genre))).sort(),
];

function ExplorePage() {
  const [selectedGenre, setSelectedGenre] = useState('All');

  const filteredManga = useMemo(() => {
    if (selectedGenre === 'All') return allManga;
    if (selectedGenre === 'Best Sellers') {
      return allManga.filter((m) => m.badge === 'Best Seller');
    }
    return allManga.filter((m) => m.genre === selectedGenre);
  }, [selectedGenre]);

  return (
    <section className="min-h-screen w-full bg-transparent px-4 pt-24 pb-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[var(--mh-text)] mb-1">Explore</h1>
            <p className="text-sm text-[var(--mh-text-secondary)]">Browse manga by genre</p>
          </div>

          <div className="flex flex-wrap gap-2 overflow-x-auto pb-1 no-scrollbar">
            {GENRES.map((genre) => {
              const isActive = selectedGenre === genre;
              return (
                <button
                  key={genre}
                  type="button"
                  onClick={() => setSelectedGenre(genre)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-[var(--mh-accent)] text-black shadow-[0_0_20px_var(--mh-accent-soft)]'
                      : 'bg-[var(--mh-surface)] border border-[var(--mh-border)] text-[var(--mh-text-secondary)] hover:bg-[var(--mh-surface-strong)] hover:text-[var(--mh-text)]'
                  }`}
                >
                  {genre}
                </button>
              );
            })}
          </div>
        </div>

        <p className="text-xs uppercase tracking-widest text-[var(--mh-text-secondary)] mb-4">
          {filteredManga.length} result{filteredManga.length !== 1 ? 's' : ''}
        </p>

        <MangaGrid className="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {filteredManga.map((item) => (
            <div key={item.id}>
              <MangaCard
                id={item.id}
                title={item.title}
                genre={item.genre}
                posterUrl={item.posterUrl}
                badge={
                  item.badge ? (
                    <span className="absolute top-3 left-3 z-20 rounded-full border border-yellow-400/40 bg-yellow-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wide text-yellow-200 backdrop-blur-md shadow-[0_0_20px_rgba(234,179,8,0.25)]">
                      {item.badge}
                    </span>
                  ) : null
                }
              />
            </div>
          ))}
        </MangaGrid>
      </div>
    </section>
  );
}

export default ExplorePage;
