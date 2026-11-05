import { useLocation, useNavigate } from 'react-router-dom';
import { Search, User } from 'lucide-react';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomeActive = location.pathname === '/';

  const handleProfileClick = () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    navigate(isLoggedIn ? '/profile' : '/login');
  };

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[94%] max-w-7xl z-50">
      <div className="flex items-center justify-between rounded-full border border-white/10 bg-[#0d0d0d]/80 px-4 py-2.5 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        {/* Left: Brand */}
        <button
          type="button"
          onClick={() => navigate('/')}
          className="flex items-center gap-2.5"
          aria-label="MangaHub home"
        >
          <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-black">
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M12 2.5l2.9 6.2 6.8 .8-5 4.7 1.3 6.7L12 17.5l-6 3.4 1.3-6.7-5-4.7 6.8-.8z"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth={1.4}
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="font-bold text-base tracking-wide text-white">MangaHub</span>
        </button>

        {/* Center: Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-white/70">
          <button
            type="button"
            onClick={() => navigate('/')}
            className={`relative pb-1 transition hover:text-white ${isHomeActive ? 'text-white' : ''}`}
          >
            Home
            {isHomeActive && (
              <span className="absolute left-1/2 -bottom-1 h-0.5 w-4 -translate-x-1/2 rounded-full bg-white" />
            )}
          </button>
          <button type="button" className="transition hover:text-white">Explore</button>
          <button type="button" className="transition hover:text-white">Genres</button>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Search manga..."
              className="w-40 rounded-full border border-white/10 bg-white/5 py-1.5 pl-9 pr-4 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-white/30 focus:bg-white/10 sm:w-48"
            />
          </div>
          <button
            type="button"
            onClick={handleProfileClick}
            aria-label="Profile"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/10 bg-white/5 text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            <User strokeWidth={0.75} className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
