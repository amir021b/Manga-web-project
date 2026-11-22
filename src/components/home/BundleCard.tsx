import type { MangaItem } from '@/services/mangaApi';
import { toPublicUrl } from '@/lib/readerPaths';

interface BundleCardProps {
  posterUrl: string;
  items: MangaItem[];
  title?: string;
  ctaLabel?: string;
}

function BundleCard({
  posterUrl,
  items,
  title = 'New User Bundle',
  ctaLabel = 'Buy Bundle',
}: BundleCardProps) {
  return (
    <article className="relative mx-auto w-full max-w-3xl h-56 sm:h-64 overflow-hidden rounded-2xl border border-[var(--mh-border)] bg-[var(--mh-card-bg)]">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("${toPublicUrl(posterUrl)}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'grayscale(100%)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
      <div className="absolute bottom-0 left-0 flex max-w-[75%] flex-col items-start gap-3 p-5 sm:p-8">
        <h3 className="text-lg sm:text-xl font-bold uppercase tracking-wide text-[var(--mh-text)]">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-[var(--mh-text-secondary)]">
          {items.map((i) => i.title).join(' · ')}
        </p>
        <button
          type="button"
          className="self-start rounded-full bg-[#f2f2f2] px-5 py-2 text-sm font-bold text-black transition hover:bg-white"
        >
          {ctaLabel}
        </button>
      </div>
    </article>
  );
}

export default BundleCard;
