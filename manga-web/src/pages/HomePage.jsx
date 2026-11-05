import { bigThree } from '../data/bigThree';

function HomePage() {
  return (
    <section className="w-full max-w-6xl px-4 py-12">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {bigThree.map((item) => (
          <article
            key={item.id}
            className="group rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md transition hover:-translate-y-1 hover:bg-white/10"
          >
            <div className="mb-4 aspect-[3/4] rounded-xl bg-gradient-to-br from-white/10 via-white/5 to-black/40" />
            <h3 className="text-lg font-semibold text-white/90">{item.title}</h3>
            <p className="mb-3 text-sm text-white/50">{item.genre}</p>
            <button
              type="button"
              className="text-sm text-white/70 transition hover:text-white"
            >
              View Details →
            </button>
          </article>
        ))}
      </div>

      <div className="mt-10 text-center">
        <p className="text-xs tracking-[0.3em] text-white/40">THE BIG THREE</p>
        <p className="mt-2 text-xl font-semibold text-white/90">
          Three Masterpieces. One Legacy.
        </p>
      </div>
    </section>
  );
}

export default HomePage;

