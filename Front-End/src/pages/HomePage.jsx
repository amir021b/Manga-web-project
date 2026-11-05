import { useState } from 'react';
import MangaGrid from '../components/manga/MangaGrid';
import MangaCard from '../components/manga/MangaCard';
import { bigThree } from '../data/bigThree';

function HomePage({ backgroundImage = null }) {
  // Dynamic state: ready to be populated from the Node.js backend later.
  // e.g. useEffect(() => { fetchManga('/manga/featured').then(setMangaItems); }, []);
  // eslint-disable-next-line no-unused-vars
  const [mangaItems, setMangaItems] = useState(bigThree);

  return (
    <section
      className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-[#050505] via-[#0d0d0d] to-[#000000]"
      style={{ '--hero-bg': backgroundImage ? `url(${backgroundImage})` : undefined }}
    >
      {/* Dynamic background image layer (optional) */}
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

      {/* Soft glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_60%)]"
      />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-10 px-4 pb-16 pt-24">
        {/* Featured manga cards */}
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

        {/* Sub-heading section */}
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
      </div>
    </section>
  );
}

export default HomePage;
