"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bookmark } from 'lucide-react';
import type { MangaItem } from '@/services/mangaApi';
import { toPublicUrl } from '@/lib/readerPaths';
import { useBackpack } from '../../context/BackpackContext';

interface BigThreeCarouselProps {
  items: MangaItem[];
  className?: string;
}

function BigThreeCarousel({ items, className }: BigThreeCarouselProps) {
  const [active, setActive] = useState(0);
  const { addToBackpack, removeFromBackpack, isInBackpack } = useBackpack();

  useEffect(() => {
    if (items.length === 0) return;
    const timer = setInterval(() => {
      setActive((i) => (i + 1) % items.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [items.length]);

  return (
    <section className={`relative w-full overflow-hidden rounded-2xl border border-[var(--mh-border)] h-[420px] ${className ?? ''}`}>
      {items.map((item, index) => {
        const saved = isInBackpack(item.id);
        const handleSave = (e: React.MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();
          if (saved) {
            removeFromBackpack(item.id);
          } else {
            addToBackpack(item.id);
          }
        };

        return (
          <div
            key={item.id}
            className={`absolute inset-0 transition-opacity duration-700 ${index === active ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
          >
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("${toPublicUrl(item.posterUrl)}")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'grayscale(100%)',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col gap-3">
              <h3 className="text-xl font-bold uppercase tracking-wide text-[var(--mh-text)]">{item.title}</h3>
              <div className="flex items-center gap-3">
                <Link href={`/manga/${item.id}/`} className="rounded-full bg-[#f2f2f2] px-5 py-2 text-sm font-bold text-black transition hover:bg-white">
                  Start Reading
                </Link>
                <button
                  type="button"
                  aria-label="Bookmark"
                  onClick={handleSave}
                  className="grid h-9 w-9 place-items-center rounded-full border border-white/30 bg-black/60 text-white"
                >
                  <Bookmark className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
      <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
        {items.map((item, index) => (
          <button
            key={item.id}
            type="button"
            aria-label={`Show item ${index + 1}`}
            onClick={() => setActive(index)}
            className={index === active ? 'h-2 w-8 rounded-full bg-[var(--mh-text)]' : 'h-2 w-2 rounded-full bg-white/30'}
          />
        ))}
      </div>
    </section>
  );
}

export default BigThreeCarousel;
