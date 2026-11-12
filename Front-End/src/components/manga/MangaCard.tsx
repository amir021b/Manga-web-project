"use client";

import { useBackpack } from '../../context/BackpackContext';
import { useToast } from '../../context/ToastContext';
import type { MangaItem } from '../../data/bigThree';

interface MangaCardProps {
  id: number | string;
  title: string;
  genre: string;
  posterUrl?: string;
  to?: string;
  hoverLift?: boolean;
  hoverLiftClass?: string;
  showSaveButton?: boolean;
  badge?: React.ReactNode;
  synopsis?: string | null;
  rating?: string | null;
}

function MangaCard({ id, title, genre, posterUrl, to, hoverLift = true, hoverLiftClass = 'hover:-translate-y-2', showSaveButton = true, badge = null }: MangaCardProps) {
  const { addToBackpack, removeFromBackpack, isInBackpack } = useBackpack();
  const { addToast } = useToast();
  const saved = isInBackpack(id);
  const destination = to || (id != null ? `/manga/${id}` : '#');
  const hasPoster = Boolean(posterUrl);

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (saved) {
      removeFromBackpack(id);
    } else {
      addToBackpack({ id, title, genre, posterUrl } as MangaItem);
      addToast('Added to your backpack!');
    }
  };

  return (
    <article
      className={[
        'group relative aspect-[3/4] min-h-[260px] w-full overflow-hidden rounded-2xl border border-[var(--mh-border)] bg-[var(--mh-card-bg)] transition-all duration-300',
        hoverLift ? hoverLiftClass : '',
        'hover:border-[var(--mh-border-soft)] hover:shadow-[0_0_40px_rgba(0,0,0,0.15)] hover:brightness-105',
      ].join(' ')}
    >
      <div
        className={[
          'absolute inset-0',
          hasPoster ? 'bg-cover bg-center' : 'bg-[var(--mh-surface)] flex items-center justify-center',
        ].join(' ')}
        style={hasPoster ? { backgroundImage: `url(${posterUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
      >
        {!hasPoster && (
          <div className="flex flex-col items-center justify-center gap-2 p-8 text-[var(--mh-text-secondary)]/80">
            <svg
              className="w-12 h-12"
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
            <span className="text-xs font-medium uppercase tracking-widest">No Poster Yet</span>
          </div>
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
      {hasPoster && (
        <div className="absolute inset-x-0 bottom-0 z-10 p-4 text-left">
          <h3 className="text-base font-bold uppercase tracking-wide text-[var(--mh-text)]">{title}</h3>
          <p className="mb-2 text-xs text-[var(--mh-text-secondary)]">{genre}</p>
          <a
            href={destination}
            className="inline-block text-xs text-[var(--mh-text-secondary)] opacity-80 transition-all duration-300 group-hover:opacity-100 hover:text-[var(--mh-text)]"
          >
            View Details →
          </a>
        </div>
      )}
      {showSaveButton && (
        <button
          type="button"
          onClick={handleSave}
          aria-label={saved ? 'Remove from backpack' : 'Add to backpack'}
          className="absolute top-3 right-3 z-20 rounded-full border border-[var(--mh-border)] bg-[var(--mh-surface)] px-3 py-2 text-xs font-semibold text-[var(--mh-text)] transition hover:bg-[var(--mh-surface-strong)] hover:text-[var(--mh-text)]"
        >
          {saved ? 'Remove' : 'Save'}
        </button>
      )}
      {badge}
    </article>
  );
}

export default MangaCard;
