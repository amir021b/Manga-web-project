import { useParams } from 'react-router-dom';
import { useBackpack } from '../context/BackpackContext';
import { useToast } from '../context/ToastContext';
import { bigThree, bestSellers, latestUpdates } from '../data';

function MangaDetailPage() {
  const { id } = useParams();
  const { addToBackpack, isInBackpack } = useBackpack();
  const { addToast } = useToast();

  const allManga = [...bigThree, ...bestSellers, ...latestUpdates];
  const manga = allManga.find((m) => String(m.id) === id);
  const saved = isInBackpack(Number(id));

  if (!manga) {
    return (
      <section className="min-h-screen flex items-center justify-center px-4 bg-[var(--mh-bg)]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[var(--mh-text)]">Manga not found</h1>
          <p className="text-[var(--mh-text-secondary)] mt-2">The manga you're looking for doesn't exist.</p>
        </div>
      </section>
    );
  }

  const handleSave = () => {
    addToBackpack(manga);
    addToast('Added to your backpack!');
  };

    return (
      <section className="min-h-screen w-full bg-[var(--mh-bg)] px-4 pt-24 pb-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-[var(--mh-border)] bg-[var(--mh-surface)]">
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${manga.posterUrl || '/public/Vinland_Saga_black_white_4x.png'})` }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <button
              onClick={handleSave}
              className="absolute top-4 right-4 z-10 rounded-full border border-[var(--mh-border)] bg-[var(--mh-surface)] px-3 py-2 text-xs font-semibold text-[var(--mh-text)] transition hover:bg-[var(--mh-surface-strong)]"
            >
              {saved ? 'Remove' : 'Save'}
            </button>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[var(--mh-text)] mb-2">{manga.title}</h1>
            <p className="text-xs uppercase tracking-widest text-[var(--mh-text-secondary)] mb-6">{manga.genre}</p>
            <p className="text-[var(--mh-text-secondary)] leading-relaxed mb-6">
              Explore the world of {manga.title}, a {manga.genre.toLowerCase()} manga series. This is a design preview page for manga details.
            </p>
            <button className="w-full h-12 rounded-[11px] bg-[#f2f2f2] text-black font-bold text-[15px] transition hover:bg-white">
              Start Reading
            </button>
          </div>
        </div>
      </section>
    );
  }

export default MangaDetailPage;
