import { useRef, useEffect } from 'react';
import MangaGrid from '../components/manga/MangaGrid';
import MangaCard from '../components/manga/MangaCard';
import { bigThree } from '../data/bigThree';
import { bestSellers } from '../data/bestSellers';
import { latestUpdates } from '../data/latestUpdates';

function MarqueeRow({ items, className }) {
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
    const speed = 40; // pixels per second
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
              hoverLift={true}
              hoverLiftClass="hover:-translate-y-1"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionTitle({ children, className }) {
  return (
    <div className={`flex w-full items-center gap-4 ${className || ''}`}>
      <span className="h-[1px] flex-1 bg-white/30" />
      <p className="shrink-0 text-xs font-normal uppercase tracking-[0.4em] text-white/80 sm:text-sm">
        {children}
      </p>
      <span className="h-[1px] flex-1 bg-white/30" />
    </div>
  );
}

function SectionHeader({ title, subtitle, className }) {
  return (
    <div className={`flex w-full max-w-md flex-col items-center gap-3 text-center ${className || ''}`}>
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

const bundlePool = [...bigThree, ...bestSellers, ...latestUpdates];
const bundleShuffled = bundlePool.slice();
for (let i = bundleShuffled.length - 1; i > 0; i -= 1) {
  const j = Math.floor(Math.random() * (i + 1));
  [bundleShuffled[i], bundleShuffled[j]] = [bundleShuffled[j], bundleShuffled[i]];
}
const bundleItems = bundleShuffled.slice(0, 3);

function HomePage({ backgroundImage = null }) {
  const mangaItems = bigThree;

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

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_60%)]"
      />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-10 px-4 pb-16 pt-24">
        <MangaGrid>
          {mangaItems.map((item) => (
            <MangaCard
              key={item.id}
              id={item.id}
              title={item.title}
              genre={item.genre}
              posterUrl={item.posterUrl}
            />
          ))}
        </MangaGrid>

        <div className="flex w-full max-w-md flex-col items-center gap-3 text-center">
          <div className="flex w-full items-center gap-4">
            <span className="h-[1px] flex-1 bg-white/30" />
            <p className="shrink-0 text-xs font-normal uppercase tracking-[0.4em] text-white/80 sm:text-sm">
              T H E   B I G   T H R E E
            </p>
            <span className="h-[1px] flex-1 bg-white/30" />
          </div>
          <p className="text-sm italic tracking-wide text-white/60 sm:text-base">
            Three Masterpieces. One Legacy.
          </p>
        </div>

        <>
          <SectionTitle>Best Sellers</SectionTitle>
          <MarqueeRow items={bestSellers} className="pt-4" />
        </>

        <>
          <SectionTitle>Latest Updates</SectionTitle>
          <MarqueeRow items={latestUpdates} className="pt-4" />
        </>

        <>
          <SectionHeader
            title="— T H E   B I G   T H R E E —"
            subtitle="three masterpieces. one legacy."
            className="pt-6"
          />
          <MangaGrid>
            {bigThree.map((item) => (
              <MangaCard
                key={item.id}
                id={item.id}
                title={item.title}
                genre={item.genre}
                posterUrl={item.posterUrl}
              />
            ))}
          </MangaGrid>
        </>

        <>
          <SectionHeader
            title="— N E W   U S E R   S P E C I A L —"
            subtitle="exclusive bundle for new members."
            className="pt-6"
          />
          <MangaGrid>
            {bundleItems.map((item) => (
              <MangaCard
                key={item.id}
                id={item.id}
                title={item.title}
                genre={item.genre}
                posterUrl={item.posterUrl}
                showSaveButton={false}
                badge={
                  <span className="absolute top-3 right-3 z-20 rounded-full border border-red-400/40 bg-red-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wide text-red-200 backdrop-blur-md shadow-[0_0_20px_rgba(239,68,68,0.25)]">
                    50% OFF
                  </span>
                }
              />
            ))}
          </MangaGrid>
        </>
      </div>
    </section>
  );
}

export default HomePage;
