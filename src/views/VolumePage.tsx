"use client";

import Link from "next/link";
import { getMangaById, getVolume } from "@/services/data";

interface VolumePageProps {
  id: string | number;
  volumeId: string;
}

function VolumePage({ id: idProp, volumeId }: VolumePageProps) {
  const mangaId = Number(idProp);
  const manga = Number.isFinite(mangaId) ? getMangaById(mangaId) : undefined;
  const volume = manga ? getVolume(mangaId, volumeId) : undefined;

  if (!manga || !volume) {
    return (
      <section className="min-h-screen flex items-center justify-center px-4 bg-[var(--mh-bg)]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[var(--mh-text)]">
            Volume not found
          </h1>
          <p className="text-[var(--mh-text-secondary)] mt-2">
            The volume you are looking for does not exist.
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

  return (
    <section className="min-h-screen w-full bg-transparent px-4 pt-16 pb-16">
      <div className="max-w-5xl mx-auto">
        <Link
          href={`/manga/${mangaId}`}
          className="inline-flex items-center gap-2 text-xs text-[var(--mh-text-secondary)] hover:text-[var(--mh-text)] transition mb-8"
        >
          ← Back to {manga.title}
        </Link>

        <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center">
          <div className="relative aspect-[3/4] w-[160px] sm:w-[200px] shrink-0 rounded-2xl overflow-hidden border border-[var(--mh-border)] bg-[var(--mh-surface)] shadow-[var(--mh-shadow-strong)]">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url("${volume.coverImage}")` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-white/80">
                Volume {volume.number}
              </p>
              <p className="text-lg font-bold text-white leading-tight">
                {volume.title}
              </p>
            </div>
          </div>

          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--mh-text-muted)]">
              {manga.title}
            </p>
            <h1 className="mt-2 text-2xl font-bold text-[var(--mh-text)]">
              Volume {volume.number}
            </h1>
            <p className="mt-2 text-sm text-[var(--mh-text-secondary)]">
              {volume.chapters.length}{" "}
              {volume.chapters.length === 1 ? "chapter" : "chapters"}
            </p>
          </div>
        </div>

        <section className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold uppercase tracking-widest text-[var(--mh-text-secondary)] border-b border-[var(--mh-border)] pb-3">
              Chapters ({volume.chapters.length})
            </h2>
          </div>
          <div className="space-y-1 rounded-xl border border-[var(--mh-border)] bg-[var(--mh-surface)] overflow-hidden shadow-sm">
            {volume.chapters.length > 0 ? (
              volume.chapters.map((chapter) => (
                <Link
                  key={chapter.chapterId}
                  href={`/manga/${mangaId}/chapter/${chapter.chapterId}`}
                  className="block flex items-center justify-between px-5 py-4 text-sm border-b border-[var(--mh-border)] last:border-0 transition hover:bg-[var(--mh-surface-strong)] group"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 text-[10px] font-bold text-[var(--mh-text-muted)] uppercase tracking-wider">
                      Ch. {chapter.number}
                    </span>
                    <span className="text-[var(--mh-text)] group-hover:text-[var(--mh-accent)] transition">
                      {chapter.title}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-[var(--mh-text-secondary)] group-hover:text-[var(--mh-text)] transition uppercase tracking-wider">
                    Read
                  </span>
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

export default VolumePage;
