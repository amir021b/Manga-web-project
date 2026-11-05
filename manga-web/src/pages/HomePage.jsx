import { bigThree } from '../data/bigThree';

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

      {/* Soft glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_60%)]"
      />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-10 px-4 pb-16 pt-24">
        {/* Floating glass cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {bigThree.map((item) => (
            <article
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

        {/* Caption with decorative lines */}
        <div className="flex items-center gap-4">
          <span className="h-px w-12 bg-white/20 sm:w-20" />
          <div className="text-center">
            <p className="text-xs tracking-[0.35em] text-white/40">THE BIG THREE</p>
            <p className="mt-2 text-lg font-semibold text-white/90 sm:text-xl">
              Three Masterpieces. One Legacy.
            </p>
          </div>
          <span className="h-px w-12 bg-white/20 sm:w-20" />
        </div>
      </div>
    </section>
  );
}

export default HomePage;
