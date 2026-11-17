"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  getAdjacentChapters,
  getChapter,
  getMangaById,
  getVolume,
} from "@/services/data";
import { recordReading } from "@/hooks/useReadingHistory";
import { toPublicUrl } from "@/lib/readerPaths";

function ReaderPage({
  id,
  chapterId,
}: {
  id: string | number;
  chapterId: string | number;
}) {
  const router = useRouter();

  useEffect(() => {
    if (!id || !chapterId) {
      router.push("/");
    }
  }, [id, chapterId, router]);

  useEffect(() => {
    if (!id || !chapterId) return;
    const numericMangaId = Number(id);
    const numericChapterId = Number(chapterId);
    if (
      !Number.isFinite(numericMangaId) ||
      !Number.isFinite(numericChapterId)
    ) {
      return;
    }
    const chapter = getChapter(numericMangaId, numericChapterId);
    if (chapter) {
      recordReading(numericMangaId, chapter.chapterId, chapter.volumeId);
    }
  }, [id, chapterId]);

  if (!id || !chapterId) return null;

  const mangaId = Number(id);
  const numericChapterId = Number(chapterId);
  const manga = Number.isFinite(mangaId) ? getMangaById(mangaId) : undefined;
  const chapter = Number.isFinite(numericChapterId)
    ? getChapter(mangaId, numericChapterId)
    : undefined;

  if (!manga || !chapter) {
    return (
      <section className="min-h-screen w-full bg-[var(--mh-bg)] px-4 pt-20 pb-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[var(--mh-text)]">
            Chapter not found
          </h1>
          <p className="text-[var(--mh-text-secondary)] mt-2">
            The chapter you are looking for does not exist.
          </p>
          <Link
            href={manga ? `/manga/${mangaId}` : "/"}
            className="mt-4 inline-block text-xs text-[var(--mh-accent)] hover:underline"
          >
            {manga ? "Back to manga" : "Back to Home"}
          </Link>
        </div>
      </section>
    );
  }

  const volume = getVolume(mangaId, chapter.volumeId);
  const { prev, next } = getAdjacentChapters(mangaId, chapter.chapterId);
  const volumeHref = `/manga/${mangaId}/volume/${chapter.volumeId}`;

  return (
    <section className="min-h-screen w-full bg-[var(--mh-bg)] px-4 pt-20 pb-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link
            href={volumeHref}
            className="text-xs text-[var(--mh-text-secondary)] underline underline-offset-4 hover:text-[var(--mh-text)] transition"
          >
            ← Back to Volume {volume?.number ?? ""}
          </Link>
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--mh-text-muted)]">
              {manga.title}
            </p>
            <h1 className="text-lg font-bold text-[var(--mh-text)]">
              Chapter {chapter.number}
            </h1>
            <p className="text-xs text-[var(--mh-text-secondary)]">
              {chapter.title}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-0 rounded-xl overflow-hidden border border-[var(--mh-border)] bg-[var(--mh-surface)]">
          {chapter.pages.map((page, index) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={page}
              src={toPublicUrl(page)}
              alt={`${manga.title} chapter ${chapter.number} page ${index + 1}`}
              loading={index < 2 ? "eager" : "lazy"}
              className="block w-full h-auto bg-[var(--mh-surface)]"
            />
          ))}
        </div>

        <div className="mt-8 flex items-center justify-between gap-3">
          {prev ? (
            <Link
              href={`/manga/${mangaId}/chapter/${prev.chapterId}`}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--mh-border)] bg-[var(--mh-surface)] px-5 py-2.5 text-sm text-[var(--mh-text-secondary)] transition hover:bg-[var(--mh-surface-strong)] hover:text-[var(--mh-text)]"
            >
              ← Chapter {prev.number}
            </Link>
          ) : (
            <span className="inline-flex items-center rounded-full border border-[var(--mh-border)] px-5 py-2.5 text-sm text-[var(--mh-text-muted)] cursor-not-allowed">
              ← Previous
            </span>
          )}
          <Link
            href={volumeHref}
            className="text-xs text-[var(--mh-text-secondary)] underline underline-offset-4 hover:text-[var(--mh-text)] transition"
          >
            Volume
          </Link>
          {next ? (
            <Link
              href={`/manga/${mangaId}/chapter/${next.chapterId}`}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--mh-border)] bg-[var(--mh-surface)] px-5 py-2.5 text-sm text-[var(--mh-text-secondary)] transition hover:bg-[var(--mh-surface-strong)] hover:text-[var(--mh-text)]"
            >
              Chapter {next.number} →
            </Link>
          ) : (
            <span className="inline-flex items-center rounded-full border border-[var(--mh-border)] px-5 py-2.5 text-sm text-[var(--mh-text-muted)] cursor-not-allowed">
              Next →
            </span>
          )}
        </div>
      </div>
    </section>
  );
}

export default ReaderPage;
