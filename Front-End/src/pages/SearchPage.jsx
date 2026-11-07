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
    <section className="min-h-screen w-full bg-gradient-to-b from-[#050505] via-[#0d0d0d] to-[#000000] px-4 pt-24 pb-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">Search Results</h1>
        <p className="text-sm text-white/60 mb-8">
          Showing results for <span className="text-white font-medium">{debouncedQuery || 'all manga'}</span>
        </p>
        <MangaGrid className="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {results.map((item) => (
            <div key={item.id}>
              <MangaCard
                id={item.id}
                title={item.title}
                genre={item.genre}
                posterUrl={item.posterUrl}
              />
            </div>
          ))}
        </MangaGrid>
      </div>
    </section>
  );
}

export default SearchPage;
