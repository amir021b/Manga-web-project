import { useBackpack } from '@/context/BackpackContext';
import { useToast } from '@/context/ToastContext';
import { bigThree, bestSellers, latestUpdates } from '@/data';
import { mangaDetails } from '@/data/mangaDetails';
import Link from 'next/link';
import type { MangaItem } from '@/data/bigThree';

interface Chapter {
  chapterId: number;
  title: string;
  date: string;
}

function MangaDetailPage() {
  const { addToBackpack, removeFromBackpack, isInBackpack } = useBackpack();
  const { addToast } = useToast();

  const allManga: MangaItem[] = [...bigThree, ...bestSellers, ...latestUpdates];
  const manga = allManga.find((m) => String(m.id) === String(typeof window !== 'undefined' ? window.location.pathname.split('/').pop() : ''));
  const mangaId = manga ? Number(manga.id) : 0;
  const detail = mangaDetails[mangaId] || {};
  const saved = isInBackpack(mangaId);
  const isBerserk = mangaId === 1;

  if (!manga) {
    return (
      <section className="min-h-screen flex items-center justify-center px-4 bg-[var(--mh-bg)]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[var(--mh-text)]">Manga not found</h1>
          <p className="text-[var(--mh-text-secondary)] mt-2">
            The manga you're looking for doesn't exist.
          </p>
          <Link
            href="/"
            className="mt-4 inline-block text-xs text-[var(--mh-accent)] hover:underline"
          >
            Back to Home
          </Link>
        </div>
      </section>
    );
  }

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    if (saved) {
      removeFromBackpack(mangaId);
      addToast('Removed from your backpack.');
    } else {
      addToBackpack(manga);
      addToast('Added to your backpack!');
    }
  };

  const genreTags = manga.genre ? manga.genre.split(/\s*,\s*/) : [];
  const chapters: Chapter[] = detail.chapters || [];

  return (
    <section className="min-h-screen w-full bg-transparent px-4 pt-20 pb-16">
      <div className="relative w-full h-72 md:h-96 overflow-hidden rounded-xl max-w-5xl mx-auto">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: isBerserk ? `url('/Lone Warrior Beneath Storm Clouds.png')` : undefined,
            backgroundSize: isBerserk ? 'cover' : undefined,
            backgroundPosition: isBerserk ? 'center' : undefined,
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02),transparent_70%)]" />

        <div className="fade-up absolute left-8 top-1/2 -translate-y-1/2 z-40 w-[180px]" style={{ animationDelay: '80ms' }}>
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-[var(--mh-border)] bg-[var(--mh-surface)] shadow-[var(--mh-shadow-strong)]">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${manga.posterUrl || '/Vinland_Saga_black_white_4x.png'})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <button
              onClick={handleSave}
              aria-label={saved ? 'Remove from backpack' : 'Add to backpack'}
              className="absolute top-3 right-3 z-50 rounded-full border border-[var(--mh-border)] bg-[var(--mh-surface)]/90 backdrop-blur-md px-3 py-1.5 text-[10px] font-semibold text-[var(--mh-text)] transition hover:bg-[var(--mh-surface)] hover:shadow-[var(--mh-shadow)]"
            >
              {saved ? 'Removed' : 'Save'}
            </button>
          </div>
        </div>

        <div className="absolute inset-0 z-30 flex flex-col items-start px-6 md:px-8 pt-16 pb-24 pl-56 md:pl-64">
          <div className="w-full flex-1">
            <div className="fade-up" style={{ animationDelay: '160ms' }}>
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-[var(--mh-accent)] mb-1">
                Manga
              </h2>
              <h1 className="text-4xl md:text-5xl font-bold text-[var(--mh-text)] tracking-tight leading-[1.1] mb-3">
                {manga.title}
              </h1>
              <p className="text-[11px] font-medium italic text-[var(--mh-text-secondary)]/70 mb-6 md:mb-8 max-w-md">
                {detail.synopsis ? detail.synopsis.split('. ').slice(0, 2).join('. ') + '.' : 'A dark fantasy masterpiece.'}
              </p>
            </div>

            <div className="fade-up" style={{ animationDelay: '240ms' }}>
              <div className="flex flex-wrap items-center gap-3 md:gap-5 mb-6 md:mb-8">
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-[var(--mh-border)] bg-[var(--mh-surface)] text-xs font-bold text-[var(--mh-text-secondary)]"
                >
                  {detail.rating || '—'}
                </span>
                <span
                  className="px-2.5 py-0.5 rounded-full border border-[var(--mh-border)] bg-[var(--mh-surface)] text-xs text-[var(--mh-text-secondary)]"
                >
                  {detail.author || 'Unknown Author'}
                </span>
                <span
                  className="px-2.5 py-0.5 rounded-full border border-[var(--mh-border)] bg-[var(--mh-surface)] text-xs text-[var(--mh-text-secondary)]"
                >
                  {detail.status || '—'}
                </span>
                {genreTags.map((tag: string, i: number) => (
                  <span
                    key={i}
                    className="px-2.5 py-0.5 rounded-full border border-[var(--mh-border-soft)] bg-[var(--mh-surface-strong)]/50 text-xs font-medium uppercase tracking-wider text-[var(--mh-text-secondary)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="fade-up" style={{ animationDelay: '300ms' }}>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href={`/manga/${mangaId}/chapter/1`}
                  className="w-full sm:w-auto flex-1 h-12 rounded-[11px] bg-[#f2f2f2] text-black font-bold text-[15px] flex items-center justify-center shadow-[0_6px_24px_rgba(255,255,255,0.12)] transition-all duration-200 hover:bg-white hover:shadow-[0_6px_24px_rgba(255,255,255,0.25)] active:translate-y-[1px] text-center"
                >
                  Start Reading
                </Link>
                <button
                  onClick={handleSave}
                  aria-label={saved ? 'Remove from backpack' : 'Add to backpack'}
                  className="w-full sm:w-auto flex-1 h-12 rounded-[11px] border border-[var(--mh-border)] bg-[var(--mh-surface)] text-[var(--mh-text)] font-bold text-[15px] transition-all duration-200 hover:bg-[var(--mh-surface-strong)] active:translate-y-[1px] text-center"
                >
                  {saved ? 'Remove from Backpack' : 'Save to Backpack'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-16">
        {detail.synopsis && (
          <section className="fade-up mb-16" style={{ animationDelay: '390ms' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold uppercase tracking-widest text-[var(--mh-text-secondary)] border-b border-[var(--mh-border)] pb-3">
                Synopsis
              </h2>
            </div>
            <p className="text-[var(--mh-text-secondary)]/90 leading-relaxed text-sm sm:text-base max-w-3xl">
              {detail.synopsis}
            </p>
          </section>
        )}

        <section className="fade-up mb-8 w-full" style={{ animationDelay: '450ms' }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold uppercase tracking-widest text-[var(--mh-text-secondary)] border-b border-[var(--mh-border)] pb-3">
              Chapters ({chapters.length})
            </h2>
          </div>
          <div className="space-y-1 rounded-xl border border-[var(--mh-border)] bg-[var(--mh-surface)] overflow-hidden shadow-sm">
            {chapters.length > 0 ? (
              chapters.map((ch: Chapter) => (
                <Link
                  key={ch.chapterId}
                  href={`/manga/${mangaId}/chapter/${ch.chapterId}`}
                  className="block flex items-center justify-between px-5 py-4 text-sm border-b border-[var(--mh-border)] last:border-0 transition hover:bg-[var(--mh-surface-strong)] group"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 text-[10px] font-bold text-[var(--mh-text-muted)] uppercase tracking-wider">
                      Ch. {ch.chapterId}
                    </span>
                    <span className="text-[var(--mh-text)] group-hover:text-[var(--mh-accent)] transition">
                      {ch.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[var(--mh-text-secondary)]">{ch.date}</span>
                    <span className="text-[10px] font-bold text-[var(--mh-text-secondary)] group-hover:text-[var(--mh-text)] transition uppercase tracking-wider">
                      Read
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="px-5 py-8 text-center text-[var(--mh-text-secondary)]">
                No chapters available yet.
              </div>
            )}
          </div>
        </section>
      </div>
    </section>
  );
}

export default MangaDetailPage;
