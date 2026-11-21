"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  getAdjacentChapters,
  getChapter,
  getMangaById,
} from "@/services/data";
import {
  getReadingProgress,
  recordReading,
  updateReadingProgress,
} from "@/hooks/useReadingHistory";
import {
  useReaderSettings,
  type ReaderMargin,
  type ReaderMode,
} from "@/hooks/useReaderSettings";
import { toPublicUrl } from "@/lib/readerPaths";

const MARGIN_CLASSES: Record<ReaderMargin, string> = {
  none: "w-full max-w-[300px]",
  small: "w-full max-w-[400px]",
  medium: "w-full max-w-[480px]",
  large: "w-full max-w-[560px]",
};

const MARGIN_OPTIONS: { id: ReaderMargin; label: string }[] = [
  { id: "none", label: "None" },
  { id: "small", label: "Small" },
  { id: "medium", label: "Medium" },
  { id: "large", label: "Large" },
];

const MODE_OPTIONS: { id: ReaderMode; label: string }[] = [
  { id: "scroll", label: "Scroll" },
  { id: "paged", label: "Paged" },
];

const TOGGLE_BASE =
  "rounded-[10px] border px-2.5 py-1.5 text-[11px] font-medium transition duration-200";
const TOGGLE_ACTIVE =
  "border-[var(--mh-border)] bg-[var(--mh-surface-strong)] text-[var(--mh-text)] shadow-[0_0_0_1px_var(--mh-accent)]";
const TOGGLE_IDLE =
  "border-[var(--mh-border)] text-[var(--mh-text-secondary)] hover:border-[var(--mh-border-soft)] hover:bg-[var(--mh-surface)]";

interface ChapterReaderState {
  chapterKey: number | null;
  page: number;
}

interface ChapterScrollState {
  chapterKey: number | null;
  progress: number;
}

interface ChapterZoomState {
  chapterKey: number | null;
  page: number | null;
}

function pageToProgress(page: number, total: number): number {
  if (total <= 1) return 0;
  return Math.min(1, Math.max(0, page / (total - 1)));
}

function progressToPage(progress: number, total: number): number {
  if (total <= 1) return 0;
  return Math.min(total - 1, Math.max(0, Math.round(progress * (total - 1))));
}

function scrollProgressFor(element: HTMLElement | null): number | null {
  if (!element) return null;
  const rect = element.getBoundingClientRect();
  const scrollable = rect.height - window.innerHeight;
  if (scrollable <= 1) return null;
  return Math.min(1, Math.max(0, -rect.top / scrollable));
}

function ReaderPage({
  id,
  chapterId,
}: {
  id: string | number;
  chapterId: string | number;
}) {
  const router = useRouter();
  const { settings, updateSettings, isHydrated } = useReaderSettings();

  const [pagedState, setPagedState] = useState<ChapterReaderState>({
    chapterKey: null,
    page: 0,
  });
  const [scrollState, setScrollState] = useState<ChapterScrollState>({
    chapterKey: null,
    progress: 0,
  });
  const [zoomState, setZoomState] = useState<ChapterZoomState>({
    chapterKey: null,
    page: null,
  });

  const columnRef = useRef<HTMLDivElement | null>(null);
  const pageRefs = useRef<Array<HTMLImageElement | null>>([]);
  const initialProgressRef = useRef(0);
  const restoredRef = useRef(false);
  const attemptRestoreRef = useRef<() => void>(() => {});
  const lastProgressWriteRef = useRef(0);
  const scrollRafRef = useRef<number | null>(null);

  const mangaId = Number(id);
  const numericChapterId = Number(chapterId);
  const manga = Number.isFinite(mangaId) ? getMangaById(mangaId) : undefined;
  const chapter =
    manga && Number.isFinite(numericChapterId)
      ? getChapter(mangaId, numericChapterId)
      : undefined;
  const { prev, next } =
    manga && chapter
      ? getAdjacentChapters(mangaId, chapter.chapterId)
      : { prev: null, next: null };

  const totalPages = chapter?.pages.length ?? 0;
  const maxPage = Math.max(totalPages - 1, 0);
  const volumeHref = chapter
    ? `/manga/${mangaId}/volume/${chapter.volumeId}`
    : "/";
  const prevHref = prev ? `/manga/${mangaId}/chapter/${prev.chapterId}` : null;
  const nextHref = next ? `/manga/${mangaId}/chapter/${next.chapterId}` : null;

  const mangaKey = manga?.id ?? null;
  const chapterKey = chapter?.chapterId ?? null;
  const chapterVolumeId = chapter?.volumeId ?? null;

  const currentPage =
    pagedState.chapterKey === chapterKey ? pagedState.page : 0;
  const scrollProgress =
    scrollState.chapterKey === chapterKey ? scrollState.progress : 0;
  const zoomPage = zoomState.chapterKey === chapterKey ? zoomState.page : null;

  useEffect(() => {
    if (!id || !chapterId) {
      router.push("/");
    }
  }, [id, chapterId, router]);

  useEffect(() => {
    if (mangaKey === null || chapterKey === null || !chapterVolumeId) return;
    initialProgressRef.current = getReadingProgress(mangaKey, chapterKey);
    restoredRef.current = false;
    lastProgressWriteRef.current = 0;
    recordReading(mangaKey, chapterKey, chapterVolumeId);
  }, [mangaKey, chapterKey, chapterVolumeId]);

  useEffect(() => {
    if (!isHydrated || chapterKey === null) return;
    if (restoredRef.current) return;

    const target = initialProgressRef.current;

    if (settings.mode === "paged") {
      const page = progressToPage(target, totalPages);
      const frame = requestAnimationFrame(() => {
        if (restoredRef.current) return;
        setPagedState({ chapterKey, page });
        restoredRef.current = true;
      });
      return () => cancelAnimationFrame(frame);
    }

    if (target <= 0) {
      restoredRef.current = true;
      return;
    }

    const attemptRestore = () => {
      if (restoredRef.current) return;
      const element = columnRef.current;
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      if (scrollable <= 1) return;

      window.scrollTo({
        top: window.scrollY + rect.top + target * scrollable,
        behavior: "auto",
      });

      const nextProgress = scrollProgressFor(element);
      if (nextProgress !== null && Math.abs(nextProgress - target) < 0.02) {
        restoredRef.current = true;
        setScrollState({ chapterKey, progress: target });
      }
    };

    attemptRestoreRef.current = attemptRestore;
    const frame = requestAnimationFrame(attemptRestore);

    return () => {
      cancelAnimationFrame(frame);
      attemptRestoreRef.current = () => {};
    };
  }, [isHydrated, settings.mode, chapterKey, totalPages]);

  useEffect(() => {
    if (chapterKey === null || mangaKey === null) return;

    const handleScroll = () => {
      if (scrollRafRef.current !== null) return;
      scrollRafRef.current = requestAnimationFrame(() => {
        scrollRafRef.current = null;
        if (settings.mode !== "scroll") return;

        const progress = scrollProgressFor(columnRef.current);
        if (progress === null) return;
        setScrollState({ chapterKey, progress });

        if (!restoredRef.current) return;
        const now = Date.now();
        if (now - lastProgressWriteRef.current >= 1000) {
          lastProgressWriteRef.current = now;
          updateReadingProgress(mangaKey, chapterKey, progress);
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollRafRef.current !== null) {
        cancelAnimationFrame(scrollRafRef.current);
        scrollRafRef.current = null;
      }
    };
  }, [mangaKey, chapterKey, settings.mode]);

  const goToPage = (page: number) => {
    if (chapterKey === null || mangaKey === null || totalPages === 0) return;
    const clamped = Math.min(Math.max(page, 0), maxPage);
    const nextProgress = pageToProgress(clamped, totalPages);
    setPagedState({ chapterKey, page: clamped });
    setScrollState({ chapterKey, progress: nextProgress });
    updateReadingProgress(mangaKey, chapterKey, nextProgress);
  };

  const goToNextPage = () => {
    if (currentPage < maxPage) {
      goToPage(currentPage + 1);
    } else if (nextHref) {
      router.push(nextHref);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 0) {
      goToPage(currentPage - 1);
    } else if (prevHref) {
      router.push(prevHref);
    }
  };

  useEffect(() => {
    if (chapterKey === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target;
      if (target instanceof HTMLElement) {
        const tag = target.tagName;
        if (
          tag === "INPUT" ||
          tag === "TEXTAREA" ||
          tag === "SELECT" ||
          target.isContentEditable
        ) {
          return;
        }
      }
      if (event.ctrlKey || event.metaKey || event.altKey) return;

      if (zoomPage !== null) {
        if (event.key === "Escape") {
          setZoomState({ chapterKey, page: null });
        }
        return;
      }

      if (event.key === "Escape") {
        router.push(volumeHref);
        return;
      }

      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();

      const forward = event.key === "ArrowRight";

      if (settings.mode === "paged") {
        if (mangaKey === null) return;
        if (forward) {
          if (currentPage < maxPage) {
            const page = currentPage + 1;
            const nextProgress = pageToProgress(page, totalPages);
            setPagedState({ chapterKey, page });
            setScrollState({ chapterKey, progress: nextProgress });
            updateReadingProgress(mangaKey, chapterKey, nextProgress);
          } else if (nextHref) {
            router.push(nextHref);
          }
        } else if (currentPage > 0) {
          const page = currentPage - 1;
          const nextProgress = pageToProgress(page, totalPages);
          setPagedState({ chapterKey, page });
          setScrollState({ chapterKey, progress: nextProgress });
          updateReadingProgress(mangaKey, chapterKey, nextProgress);
        } else if (prevHref) {
          router.push(prevHref);
        }
        return;
      }

      if (forward) {
        if (nextHref) router.push(nextHref);
      } else if (prevHref) {
        router.push(prevHref);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    chapterKey,
    mangaKey,
    zoomPage,
    settings.mode,
    currentPage,
    maxPage,
    totalPages,
    nextHref,
    prevHref,
    volumeHref,
    router,
  ]);

  const handleImageLoad = () => {
    if (settings.mode === "scroll") {
      attemptRestoreRef.current();
    }
  };

  const handleImageClick = (
    event: React.MouseEvent<HTMLImageElement>,
    pageIndex: number,
  ) => {
    if (chapterKey === null) return;
    if (settings.mode === "paged") {
      const rect = event.currentTarget.getBoundingClientRect();
      const clickedLeft = event.clientX - rect.left < rect.width / 2;
      if (clickedLeft) {
        goToPrevPage();
      } else {
        goToNextPage();
      }
      return;
    }
    setZoomState({ chapterKey, page: pageIndex });
  };

  const handleChangeMode = (mode: ReaderMode) => {
    if (mode === settings.mode || chapterKey === null) return;
    if (mode === "paged") {
      setPagedState({
        chapterKey,
        page: progressToPage(scrollProgress, totalPages),
      });
    } else {
      setScrollState({
        chapterKey,
        progress: pageToProgress(currentPage, totalPages),
      });
    }
    updateSettings({ mode });
  };

  const activePage =
    settings.mode === "paged"
      ? Math.min(currentPage, maxPage)
      : Math.min(maxPage, Math.round(scrollProgress * maxPage));

  const progressRatio =
    settings.mode === "paged"
      ? pageToProgress(Math.min(currentPage, maxPage), totalPages)
      : scrollProgress;

  const handleJumpToPage = (page: number) => {
    if (settings.mode === "paged") {
      goToPage(page);
      return;
    }
    if (chapterKey === null || totalPages === 0) return;
    const clamped = Math.min(Math.max(page, 0), maxPage);
    setScrollState({
      chapterKey,
      progress: pageToProgress(clamped, totalPages),
    });
    pageRefs.current[clamped]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  if (!id || !chapterId) return null;

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

  const visiblePages =
    settings.mode === "paged"
      ? [Math.min(currentPage, Math.max(totalPages - 1, 0))]
      : chapter.pages.map((_, index) => index);
  const marginClass = MARGIN_CLASSES[settings.margin];

  return (
    <section className="min-h-screen w-full bg-transparent px-4 pt-20 pb-8">
      <div
        role="progressbar"
        aria-label="Reading progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progressRatio * 100)}
        className="fixed inset-x-0 top-0 z-40 h-0.5 overflow-hidden bg-transparent"
      >
        <div
          className="h-full bg-[var(--mh-accent)] transition-[width] duration-150"
          style={{ width: `${progressRatio * 100}%` }}
        />
      </div>

      <div className="w-full mx-auto">
        <div className="mb-6 flex flex-wrap items-center justify-center gap-4">
          <div className="max-w-fit rounded-xl border border-[var(--mh-border)] bg-[var(--mh-surface)] px-4 py-3 backdrop-blur-md">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--mh-text-muted)]">
                Margin
              </span>
              <div className="flex flex-wrap gap-1">
                {MARGIN_OPTIONS.map((option) => {
                  const active = settings.margin === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => updateSettings({ margin: option.id })}
                      aria-pressed={active}
                      className={`${TOGGLE_BASE} ${
                        active ? TOGGLE_ACTIVE : TOGGLE_IDLE
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--mh-text-muted)]">
                Dark pages
              </span>
              <button
                type="button"
                onClick={() =>
                  updateSettings({ darkPages: !settings.darkPages })
                }
                aria-pressed={settings.darkPages}
                className={`${TOGGLE_BASE} ${
                  settings.darkPages ? TOGGLE_ACTIVE : TOGGLE_IDLE
                }`}
              >
                {settings.darkPages ? "On" : "Off"}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--mh-text-muted)]">
                Mode
              </span>
              <div className="flex gap-1">
                {MODE_OPTIONS.map((option) => {
                  const active = settings.mode === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleChangeMode(option.id)}
                      aria-pressed={active}
                      className={`${TOGGLE_BASE} ${
                        active ? TOGGLE_ACTIVE : TOGGLE_IDLE
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label
                htmlFor="reader-page-jump"
                className="text-[10px] font-bold uppercase tracking-widest text-[var(--mh-text-muted)]"
              >
                Jump
              </label>
              <select
                id="reader-page-jump"
                value={activePage}
                onChange={(event) =>
                  handleJumpToPage(Number(event.target.value))
                }
                className="rounded-full border border-[var(--mh-border)] bg-[var(--mh-input-bg)] px-3 py-1.5 text-xs text-[var(--mh-input-text)] outline-none transition focus:border-[var(--mh-accent)]"
              >
                {Array.from(
                  { length: Math.max(totalPages, 1) },
                  (_, index) => (
                    <option key={index} value={index}>
                      Page {index + 1}
                    </option>
                  ),
                )}
              </select>
            </div>
          </div>
          <p className="mt-2 text-[10px] text-[var(--mh-text-muted)]">
            ← → chapters · Esc volume
          </p>
          </div>
        </div>

        <div
          ref={columnRef}
          className={`relative mx-auto max-w-2xl flex flex-col items-center gap-0 overflow-hidden rounded-xl border border-[var(--mh-border)] bg-[var(--mh-bg)]/70 ${marginClass}`}
        >
          <div className="mb-4 text-center">
            <h1 className="text-lg font-bold text-[var(--mh-text)]">
              Chapter {chapter.number}
            </h1>
            <p className="text-xs text-[var(--mh-text-secondary)]">
              {chapter.title}
            </p>
          </div>
          {visiblePages.map((pageIndex) => {
            const page = chapter.pages[pageIndex];
            if (!page) return null;
            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={page}
                ref={(element) => {
                  pageRefs.current[pageIndex] = element;
                }}
                src={toPublicUrl(page)}
                alt={`${manga.title} chapter ${chapter.number} page ${pageIndex + 1}`}
                loading="lazy"
                onClick={(event) => handleImageClick(event, pageIndex)}
                onLoad={handleImageLoad}
                className={`block h-auto w-full scroll-mt-40 bg-[var(--mh-surface)] ${
                  settings.mode === "scroll"
                    ? "cursor-zoom-in"
                    : "cursor-pointer"
                } ${settings.darkPages ? "brightness-75 contrast-100" : ""}`}
              />
            );
          })}
          {settings.mode === "paged" && (
            <p className="w-full border-t border-[var(--mh-border)] py-3 text-center text-xs text-[var(--mh-text-secondary)]">
              Page {Math.min(currentPage, maxPage) + 1} / {totalPages}
            </p>
          )}
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

      {zoomPage !== null && chapter.pages[zoomPage] && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Page ${zoomPage + 1} preview`}
          onClick={() => {
            if (chapterKey !== null) {
              setZoomState({ chapterKey, page: null });
            }
          }}
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/85 px-4 py-8 backdrop-blur-sm backdrop-fade-in"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={toPublicUrl(chapter.pages[zoomPage])}
            alt={`${manga.title} chapter ${chapter.number} page ${zoomPage + 1}`}
            loading="lazy"
            onClick={(event) => event.stopPropagation()}
            className={`modal-fade-in max-h-full max-w-full object-contain ${
              settings.darkPages ? "brightness-75 contrast-100" : ""
            }`}
          />
        </div>
      )}
    </section>
  );
}

export default ReaderPage;
