import { useSearchParams } from 'react-router-dom';
import { useDebounce } from '../hooks/useDebounce';
import MangaGrid from '../components/manga/MangaGrid';
import MangaCard from '../components/manga/MangaCard';
import { bigThree, bestSellers, latestUpdates } from '../data';

function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const debouncedQuery = useDebounce(query, 300);

  const allManga = [...bigThree, ...bestSellers, ...latestUpdates];
  const results = debouncedQuery
    ? allManga.filter((m) => m.title.toLowerCase().includes(debouncedQuery.toLowerCase()))
    : allManga;

  return (
    <section className="min-h-screen w-full bg-transparent px-4 pt-24 pb-8">
      <div className="max-w-5xl mx-auto bg-transparent">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[var(--mh-text)] mb-1">Search Results</h1>
            <p className="text-sm text-[var(--mh-text-secondary)]">
              Showing results for <span className="text-[var(--mh-text)] font-medium">{debouncedQuery || 'all manga'}</span>
            </p>
          </div>
        </div>

        <p className="text-xs uppercase tracking-widest text-[var(--mh-text-secondary)] mb-4">
          {results.length} result{results.length !== 1 ? 's' : ''}
        </p>

        <MangaGrid className="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {results.map((item) => (
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

export default SearchPage;
