"use client";

import { useSearchParams } from 'next/navigation';
import { useDebounce } from '@/hooks/useDebounce';
import MangaGrid from '@/components/manga/MangaGrid';
import MangaCard from '@/components/manga/MangaCard';
import { useMangaSearch } from '@/hooks/api/useManga';

function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams?.get('q') || '';
  const debouncedQuery = useDebounce(query, 300);
  const { data: results = [] } = useMangaSearch(debouncedQuery);

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
          {results.map((item, idx) => (
            <div key={item.id} className="fade-up" style={{ animationDelay: `${idx * 50}ms` }}>
              <MangaCard
                id={item.id}
                title={item.title}
                genres={item.genres}
                posterUrl={item.posterUrl}
                badge={null}
              />
            </div>
          ))}
        </MangaGrid>
      </div>
    </section>
  );
}

export default SearchPage;
