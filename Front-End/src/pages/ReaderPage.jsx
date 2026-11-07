import { useParams, useNavigate } from 'react-router-dom';

function ReaderPage() {
  const { id, chapterId } = useParams();
  const navigate = useNavigate();

  if (!id || !chapterId) {
    navigate('/');
    return null;
  }

  return (
    <section className="min-h-screen w-full bg-black px-4 pt-20 pb-8 flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-2xl font-bold text-white mb-2">Chapter {chapterId}</h1>
        <p className="text-sm text-white/60 mb-8">Manga #{id}</p>
        <div className="aspect-[2/3] rounded-xl border border-white/10 bg-zinc-900/90 flex items-center justify-center">
          <p className="text-white/50">Reader placeholder — chapter content would render here.</p>
        </div>
        <button
          onClick={() => navigate(`/manga/${id}`)}
          className="mt-6 inline-flex items-center gap-2 text-sm text-white/70 underline underline-offset-4 hover:text-white"
        >
          ← Back to manga
        </button>
      </div>
    </section>
  );
}

export default ReaderPage;
