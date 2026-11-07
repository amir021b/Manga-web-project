<<<<<<< HEAD
﻿import { useState, useRef, useEffect } from 'react';
import MangaGrid from '../components/manga/MangaGrid';
import MangaCard from '../components/manga/MangaCard';
=======
>>>>>>> d84187accf5af6cf5bfadfa0fdaa39fd013d0200
import { bigThree } from '../data/bigThree';
import { bestSellers } from '../data/bestSellers';
import { latestUpdates } from '../data/latestUpdates';

function MarqueeRow({ items }) {
  const containerRef = useRef(null);
  const isDraggingRef = useRef(false);
  const isHoveringRef = useRef(false);
  const startX = useRef(0);
  const scrollStart = useRef(0);
  const rafRef = useRef(null);
  const lastTimeRef = useRef(null);

  const doubled = [...items, ...items];

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const speed = 40;
    const step = (ts) => {
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

  const handleMouseDown = (e) => {
    const el = containerRef.current;
    if (!el) return;
    isDraggingRef.current = true;
    startX.current = e.pageX - el.offsetLeft;
    scrollStart.current = el.scrollLeft;
    el.style.cursor = 'grabbing';
  };

  const handleMouseMove = (e) => {
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
      className="w-full overflow-x-auto select-none pt-3 pb-4 horizontal-scrollbar"
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
              hoverLift={true}
              hoverLiftClass="hover:-translate-y-1"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div className="flex w-full items-center gap-4">
      <span className="h-[1px] flex-1 bg-white/30" />
      <p className="shrink-0 text-xs font-normal uppercase tracking-[0.4em] text-white/80 sm:text-sm">
        {children}
      </p>
      <span className="h-[1px] flex-1 bg-white/30" />
    </div>
  );
}

function SectionHeader({ title, subtitle }) {
  return (
    <div className="flex w-full max-w-md flex-col items-center gap-3 text-center">
      <div className="flex w-full items-center gap-4">
        <span className="h-[1px] flex-1 bg-white/30" />
        <p className="shrink-0 text-xs font-normal uppercase tracking-[0.4em] text-white/80 sm:text-sm">
          {title}
        </p>
        <span className="h-[1px] flex-1 bg-white/30" />
      </div>
      {subtitle && (
        <p className="text-sm italic tracking-wide text-white/60 sm:text-base">
          {subtitle}
        </p>
      )}
    </div>
  );
}

<<<<<<< HEAD
function HomePage({ backgroundImage = null }) {
  const [mangaItems] = useState(bigThree);

  const [bundleItems] = useState(() => {
    const pool = [...bigThree, ...bestSellers, ...latestUpdates];
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  });

  return (
    <section
      className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-[#050505] via-[#0d0d0d] to-[#000000]"
      style={{ '--hero-bg': backgroundImage ? `url(${backgroundImage})` : undefined }}
    >
      {backgroundImage && (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-black/80 via-black/60 to-black"
          />
        </>
      )}
=======
function HomePage() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-[#050505] via-[#0d0d0d] to-[#000000]">
      {/* Large background character placeholders */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 flex items-center justify-between px-4 opacity-[0.07] sm:px-10"
      >
        <span className="text-[16vw] font-black leading-none tracking-tighter">
          GUTS
        </span>
        <span className="text-[16vw] font-black leading-none tracking-tighter">
          THORFINN
        </span>
        <span className="text-[16vw] font-black leading-none tracking-tighter">
          MUSASHI
        </span>
      </div>
>>>>>>> d84187accf5af6cf5bfadfa0fdaa39fd013d0200

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_60%)]"
      />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-10 px-4 pb-16 pt-24">
<<<<<<< HEAD
        <MangaGrid>
          {mangaItems.map((item) => (
            <MangaCard
=======
        {/* Floating glass cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {bigThree.map((item) => (
            <article
>>>>>>> d84187accf5af6cf5bfadfa0fdaa39fd013d0200
              key={item.id}
              className="group w-[170px] rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-md transition hover:-translate-y-1 hover:bg-white/10 sm:w-[190px]"
            >
              <div className="mb-3 aspect-[3/4] rounded-xl bg-gradient-to-br from-white/10 via-white/5 to-black/40" />
              <h3 className="text-sm font-semibold text-white/90">{item.title}</h3>
              <p className="mb-2 text-xs text-white/50">{item.genre}</p>
              <button
                type="button"
                className="text-xs text-white/70 transition hover:text-white"
              >
                View Details →
              </button>
            </article>
          ))}
        </div>

<<<<<<< HEAD
        <div className="flex w-full max-w-md flex-col items-center gap-3 text-center">
          <div className="flex w-full items-center gap-4">
            <span className="h-[1px] flex-1 bg-white/30" />
            <p className="shrink-0 text-xs font-normal uppercase tracking-[0.4em] text-white/80 sm:text-sm">
              T H E   B I G   T H R E E
=======
        {/* Caption with decorative lines */}
        <div className="flex items-center gap-4">
          <span className="h-px w-12 bg-white/20 sm:w-20" />
          <div className="text-center">
            <p className="text-xs tracking-[0.35em] text-white/40">THE BIG THREE</p>
            <p className="mt-2 text-lg font-semibold text-white/90 sm:text-xl">
              Three Masterpieces. One Legacy.
>>>>>>> d84187accf5af6cf5bfadfa0fdaa39fd013d0200
            </p>
          </div>
          <span className="h-px w-12 bg-white/20 sm:w-20" />
        </div>

        <div className="flex w-full max-w-7xl flex-col items-center gap-6 pt-4">
          <SectionTitle>Best Sellers</SectionTitle>
          <MarqueeRow items={bestSellers} />
        </div>

        <div className="flex w-full max-w-7xl flex-col items-center gap-6 pt-4">
          <SectionTitle>Latest Updates</SectionTitle>
          <MarqueeRow items={latestUpdates} />
        </div>

        <div className="flex w-full max-w-7xl flex-col items-center gap-6 pt-6">
          <SectionHeader
            title="— N E W   U S E R   S P E C I A L —"
            subtitle="exclusive bundle for new members."
          />
          <MangaGrid>
            {bundleItems.map((item) => (
              <div key={item.id} className="relative">
                <MangaCard
                  id={item.id}
                  title={item.title}
                  genre={item.genre}
                  posterUrl={item.posterUrl}
                  hideSaveButton={true}
                  badge={
                    <span className="relative flex items-center justify-center rounded-full border border-red-400/40 bg-red-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wide text-red-200">
                      50% OFF
                    </span>
                  }
                />
              </div>
            ))}
          </MangaGrid>
        </div>
      </div>
    </section>
  );
}

export default HomePage;
