"use client";

import CommentsSection from "@/components/comments/CommentsSection";
import { useBackpack } from "@/context/BackpackContext";
import { useMangaById } from "@/hooks/api/useManga";
import Link from "next/link";

interface MangaDetailPageProps {
  id: string | number;
}

function MangaDetailPage({ id: idProp }: MangaDetailPageProps) {
  const { addToBackpack, removeFromBackpack, isInBackpack } = useBackpack();

  const mangaId = Number(idProp);
  const { data: manga } = useMangaById(mangaId);
  const saved = manga ? isInBackpack(mangaId) : false;

  if (!manga) {
    return (
      <section className="min-h-screen flex items-center justify-center px-4 bg-[var(--mh-bg)]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[var(--mh-text)]">
            Manga not found
          </h1>
          <p className="text-[var(--mh-text-secondary)] mt-2">
            The manga you are looking for does not exist.
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
    } else {
      addToBackpack(mangaId);
    }
  };

  const genreTags = manga.genres;
  const volumes = manga.detail.volumes;
  const firstChapterId = volumes[0]?.chapters[0]?.chapterId;

  return (
    <section className="min-h-screen w-full bg-transparent px-4 pt-16 pb-16">
      <div className="max-w-5xl mx-auto">
        <div className="relative z-10 flex flex-col lg:flex-row gap-8 items-start lg:items-center">
          <div className="flex-shrink-0 w-[180px] lg:w-[220px]">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-[var(--mh-border)] bg-[var(--mh-surface)] shadow-[var(--mh-shadow-strong)]">
              {manga.posterUrl ? (
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url("${manga.posterUrl}")`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: "grayscale(100%)",
                  }}
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[var(--mh-surface)] text-[var(--mh-text-secondary)]/80">
                  <svg
                    className="w-10 h-10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  <span className="text-xs font-medium uppercase tracking-widest">
                    No Cover Yet
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <button
                onClick={handleSave}
                aria-label={saved ? "Remove from backpack" : "Add to backpack"}
                className="absolute top-3 right-3 z-50 rounded-full border border-white/30 bg-black/60 backdrop-blur-sm px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-black/80 hover:text-white"
              >
                {saved ? "Remove" : "Save"}
              </button>
            </div>
          </div>
          <div className="flex-1">
            <div className="mb-4">
              <div className="flex items-start gap-4 sm:gap-6">
                <h1 className="text-2xl font-bold text-[var(--mh-text)] leading-tight">
                  {manga.title}
                </h1>
                <span
                  className={[
                    "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-xs font-medium uppercase tracking-wider",
                    "border-[var(--mh-border-soft)] bg-[var(--mh-surface-strong)]/50 text-[var(--mh-text-secondary)]",
                  ].join(" ")}
                >
                  {manga.status}
                </span>
              </div>
              <p className="mt-2 text-sm text-[var(--mh-text-secondary)]">
                {manga.japaneseTitle}
                <span className="mx-2 text-[var(--mh-text-muted)]">·</span>
                By {manga.author}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {genreTags.map((tag: string, i: number) => (
                <span
                  key={i}
                  className="px-2.5 py-0.5 rounded-full border border-[var(--mh-border-soft)] bg-[var(--mh-surface-strong)]/50 text-xs font-medium uppercase tracking-wider text-[var(--mh-text-secondary)]"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="fade-up" style={{ animationDelay: "300ms" }}>
              <div className="flex flex-col sm:flex-row gap-3">
                {firstChapterId !== undefined ? (
                  <Link
                    href={`/manga/${mangaId}/chapter/${firstChapterId}`}
                    className="w-full sm:w-auto flex-1 h-12 rounded-[11px] bg-[#f2f2f2] text-black font-bold text-[15px] flex items-center justify-center shadow-[0_6px_24px_rgba(255,255,255,0.12)] transition-all duration-200 hover:bg-white hover:shadow-[0_6px_24px_rgba(255,255,255,0.25)] active:translate-y-[1px] text-center"
                  >
                    Start Reading
                  </Link>
                ) : (
                  <button
                    disabled
                    className="w-full sm:w-auto flex-1 h-12 rounded-[11px] border border-[var(--mh-border)] bg-[var(--mh-surface)] text-[var(--mh-text-muted)] font-bold text-[15px] cursor-not-allowed flex items-center justify-center text-center"
                  >
                    Coming Soon
                  </button>
                )}
                <button
                  onClick={handleSave}
                  aria-label={
                    saved ? "Remove from backpack" : "Add to backpack"
                  }
                  className="w-full sm:w-auto flex-1 h-12 rounded-[11px] border border-white/30 bg-black/60 backdrop-blur-sm text-white font-bold text-[15px] transition-all duration-200 hover:bg-black/80 active:translate-y-[1px] text-center"
                >
                  {saved ? "Remove from Backpack" : "Save to Backpack"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-16">
        <section className="fade-up mb-16" style={{ animationDelay: "390ms" }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold uppercase tracking-widest text-[var(--mh-text-secondary)] border-b border-[var(--mh-border)] pb-3">
              Synopsis
            </h2>
          </div>
          <p className="text-[var(--mh-text-secondary)]/90 leading-relaxed text-sm sm:text-base max-w-3xl">
            {manga.description}
          </p>
        </section>

        <section
          className="fade-up mb-8 w-full"
          style={{ animationDelay: "450ms" }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold uppercase tracking-widest text-[var(--mh-text-secondary)] border-b border-[var(--mh-border)] pb-3">
              Volumes ({volumes.length})
            </h2>
          </div>
          {volumes.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {volumes.map((volume) => (
                <Link
                  key={volume.volumeId}
                  href={`/manga/${mangaId}/volume/${volume.volumeId}`}
                  className="group relative overflow-hidden rounded-xl border border-[var(--mh-border)] bg-[var(--mh-surface)] shadow-sm transition hover:border-[var(--mh-text-secondary)]"
                >
                  <div className="relative aspect-[3/4]">
                    {volume.coverImage ? (
                      <div
                        className="absolute inset-0 bg-cover bg-center transition duration-300 group-hover:scale-[1.03]"
                        style={{
                          backgroundImage: `url("${volume.coverImage}")`,
                        }}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-xs uppercase tracking-widest text-[var(--mh-text-muted)]">
                        No Cover
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/80">
                        Vol. {volume.number}
                      </p>
                      <p className="text-sm font-bold text-white leading-tight">
                        {volume.title}
                      </p>
                      <p className="mt-1 text-[10px] uppercase tracking-wider text-white/60">
                        {volume.chapters.length}{" "}
                        {volume.chapters.length === 1 ? "chapter" : "chapters"}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-[var(--mh-border)] bg-[var(--mh-surface)] px-5 py-8 text-center text-[var(--mh-text-secondary)]">
              No volumes available yet.
            </div>
          )}
        </section>

        <div className="fade-up" style={{ animationDelay: "510ms" }}>
          <CommentsSection mangaId={mangaId} />
        </div>
      </div>
    </section>
  );
}

export default MangaDetailPage;
