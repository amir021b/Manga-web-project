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
      <section className="min-h-screen flex items-center justify-center px-4 bg-[#050505]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Manga not found</h1>
          <p className="text-white/60 mt-2">The manga you're looking for doesn't exist.</p>
        </div>
      </section>
    );
  }

  const handleSave = () => {
    addToBackpack(manga);
    addToast('Added to your backpack!');
  };

  return (
    <section className="min-h-screen w-full bg-gradient-to-b from-[#050505] via-[#0d0d0d] to-[#000000] px-4 pt-24 pb-8">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 bg-zinc-900/90">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${manga.posterUrl || '/public/Vinland_Saga_black_white_4x.png'})` }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <button
            onClick={handleSave}
            className="absolute top-4 right-4 z-10 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/10"
          >
            {saved ? 'Remove' : 'Save'}
          </button>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{manga.title}</h1>
          <p className="text-xs uppercase tracking-widest text-white/50 mb-6">{manga.genre}</p>
          <p className="text-white/70 leading-relaxed mb-6">
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
