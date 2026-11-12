import MangaGrid from '@/components/manga/MangaGrid';
import MangaCard from '@/components/manga/MangaCard';
import MarqueeRow from '@/components/home/MarqueeRow';
import SectionTitle from '@/components/home/SectionTitle';
import SectionHeader from '@/components/home/SectionHeader';
import { bigThree } from '@/data/bigThree';
import { bestSellers } from '@/data/bestSellers';
import { latestUpdates } from '@/data/latestUpdates';
import { newUserBundle } from '@/data/newUserBundle';
import type { MangaItem } from '@/data/bigThree';

function HomePage() {
  const mangaItems: MangaItem[] = bigThree;

  return (
    <section
      className="relative min-h-screen w-full overflow-hidden bg-transparent"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_60%)]"
      />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-10 px-4 pb-16 pt-24">
        <div className="relative overflow-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden rounded-2xl border border-white/10 shadow-2xl w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 will-change-transform">
          <div
            className="absolute inset-0 z-0 bg-cover bg-center transform-gpu translate-z-0 backface-hidden will-change-transform"
            style={{
              backgroundImage: `url('/Monochrome Manga Warriors in Mist.png')`,
              animation: 'smoothZoom 18s ease-in-out infinite alternate',
            }}
          />
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/40 via-black/20 to-transparent" />
          <div className="relative z-10 text-center">
            <div className="flex justify-center">
              <MangaGrid className="max-w-[768px] w-full mx-auto">
                {mangaItems.map((item: MangaItem, idx: number) => (
                  <div key={item.id} className="fade-up" style={{ animationDelay: `${idx * 100}ms` }}>
                    <MangaCard
                      key={item.id}
                      id={item.id}
                      title={item.title}
                      genre={item.genre}
                      posterUrl={item.posterUrl}
                    />
                  </div>
                ))}
              </MangaGrid>
            </div>
            <div className="mt-10">
              <div className="flex w-full items-center gap-4">
                <span className="h-[1px] flex-1 bg-[var(--mh-border-soft)]" />
                <p className="shrink-0 text-xs font-normal uppercase tracking-[0.4em] text-[var(--mh-text-secondary)] sm:text-sm">
                  T H E   B I G   T H R E E
                </p>
                <span className="h-[1px] flex-1 bg-[var(--mh-border-soft)]" />
              </div>
              <p className="mt-2 text-sm italic tracking-wide text-[var(--mh-text-secondary)] sm:text-base">
                Three Masterpieces. One Legacy.
              </p>
            </div>
          </div>
        </div>

        <>
          <SectionTitle>Most Popular</SectionTitle>
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
            {bigThree.map((item: MangaItem, idx: number) => (
              <div key={item.id} className="fade-up" style={{ animationDelay: `${idx * 100}ms` }}>
                <MangaCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  genre={item.genre}
                  posterUrl={item.posterUrl}
                />
              </div>
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
            {newUserBundle.map((item: MangaItem, idx: number) => (
              <div key={item.id} className="fade-up" style={{ animationDelay: `${idx * 100}ms` }}>
                <MangaCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  genre={item.genre}
                  posterUrl={item.posterUrl}
                  badge={
                    <span className="absolute top-3 left-3 z-20 rounded-full border border-red-400/40 bg-red-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wide text-red-200 backdrop-blur-md shadow-[0_0_20px_rgba(239,68,68,0.25)]">
                      50% OFF
                    </span>
                  }
                />
              </div>
            ))}
          </MangaGrid>
        </>
      </div>
    </section>
  );
}

export default HomePage;
