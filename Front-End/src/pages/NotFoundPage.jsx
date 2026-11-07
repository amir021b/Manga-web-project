import { useNavigate } from 'react-router-dom';

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-b from-[#050505] via-[#0d0d0d] to-[#000000]">
      <div className="text-center">
        <h1 className="text-6xl font-black text-white/10 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-white mb-2">Page not found</h2>
        <p className="text-white/60 mb-8">The manga page you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/')}
          className="h-12 rounded-[11px] bg-[#f2f2f2] text-black font-bold text-[15px] px-6 transition hover:bg-white"
        >
          Back to Home
        </button>
      </div>
    </section>
  );
}

export default NotFoundPage;
