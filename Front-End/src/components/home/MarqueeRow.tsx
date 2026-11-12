"use client";

import { useRef, useEffect } from 'react';
import type { MangaItem } from '../../data/bigThree';
import MangaCard from '../manga/MangaCard';

interface MarqueeRowProps {
  items: MangaItem[];
  className?: string;
}

function MarqueeRow({ items, className }: MarqueeRowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const isHoveringRef = useRef(false);
  const startX = useRef(0);
  const scrollStart = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  const doubled = [...items, ...items];

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const speed = 40;
    const step = (ts: number) => {
      if (lastTimeRef.current == null) lastTimeRef.current = ts;
      const dt = (ts - lastTimeRef.current) / 1000;
      lastTimeRef.current = ts;
      if (!isDraggingRef.current && !isHoveringRef.current) {
        el.scrollLeft += speed * dt;
        const half = el.scrollWidth / 2;
        if (half > 0 && el.scrollLeft >= half) {
          el.scrollLeft -= half;
        }
      }
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    const el = containerRef.current;
    if (!el) return;
    isDraggingRef.current = true;
    startX.current = e.pageX - el.offsetLeft;
    scrollStart.current = el.scrollLeft;
    el.style.cursor = 'grabbing';
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = containerRef.current;
    if (!isDraggingRef.current || !el) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    el.scrollLeft = scrollStart.current - walk;
  };

  const stopDragging = () => {
    const el = containerRef.current;
    isDraggingRef.current = false;
    if (el) el.style.cursor = '';
  };

  return (
    <div
      ref={containerRef}
      className={`w-full overflow-x-auto select-none pt-3 pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${className || ''}`}
      onMouseEnter={() => { isHoveringRef.current = true; }}
      onMouseLeave={() => { isHoveringRef.current = false; stopDragging(); }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={stopDragging}
    >
      <div className="flex w-max gap-4">
        {doubled.map((item, idx) => (
          <div key={`${item.id}-${idx}`} className="w-64 shrink-0">
            <MangaCard
              id={item.id}
              title={item.title}
              genre={item.genre}
              posterUrl={item.posterUrl}
              badge={
                item.badge ? (
                  <span className="absolute top-3 left-3 z-20 rounded-full border border-yellow-400/40 bg-yellow-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wide text-yellow-200 backdrop-blur-md shadow-[0_0_20px_rgba(234,179,8,0.25)]">
                    {item.badge}
                  </span>
                ) : null
              }
              synopsis={item.synopsis || null}
              rating={item.rating || null}
              hoverLift={true}
              hoverLiftClass="hover:-translate-y-1"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default MarqueeRow;
