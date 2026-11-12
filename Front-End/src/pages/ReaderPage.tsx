import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { MangaItem } from '@/data/bigThree';

function ReaderPage() {
  const router = useRouter();
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const parts = pathname.split('/');
  const id = parts[parts.indexOf('manga') + 1];
  const chapterId = parts[parts.indexOf('chapter') + 1];

  if (!id || !chapterId) {
    router.push('/');
    return null;
  }

  return (
    <section className="min-h-screen w-full bg-[var(--mh-bg)] px-4 pt-20 pb-8 flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-2xl font-bold text-[var(--mh-text)] mb-2">Chapter {chapterId}</h1>
        <p className="text-sm text-[var(--mh-text-secondary)] mb-8">Manga #{id}</p>
        <div className="aspect-[2/3] rounded-xl border border-[var(--mh-border)] bg-[var(--mh-surface)] flex items-center justify-center">
          <p className="text-[var(--mh-text-secondary)]">Reader placeholder — chapter content would render here.</p>
        </div>
        <button
          onClick={() => router.push(`/manga/${id}`)}
          className="mt-6 inline-flex items-center gap-2 text-sm text-[var(--mh-text-secondary)] underline underline-offset-4 hover:text-[var(--mh-text)]"
        >
          ← Back to manga
        </button>
      </div>
    </section>
  );
}

export default ReaderPage;
