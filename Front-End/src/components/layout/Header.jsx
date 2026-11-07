import { useNavigate } from 'react-router-dom';
import { Search, User } from 'lucide-react';
import Logo from '../ui/Logo';

function Header() {
  const navigate = useNavigate();

  return (
    <header className="fixed top-4 left-1/2 z-50 w-[min(1200px,calc(100%-2rem))] -translate-x-1/2">
      <div className="flex items-center gap-3 sm:gap-5 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        {/* Logo */}
        <Logo variant="header" />

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-4 text-sm text-white/70">
          <button type="button" className="transition hover:text-white">Home</button>
          <button type="button" className="transition hover:text-white">Explore</button>
          <button type="button" className="transition hover:text-white">Genres</button>
        </nav>

        {/* Search */}
        <div className="relative ml-auto flex-1 max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Search manga..."
            className="w-full rounded-full border border-white/10 bg-white/5 py-1.5 pl-9 pr-4 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-white/30 focus:bg-white/10"
          />
        </div>

        {/* Profile */}
        <button
          type="button"
          onClick={() => navigate('/profile')}
          aria-label="Profile"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/10 bg-white/5 text-white/80 transition hover:bg-white/10 hover:text-white"
        >
          <User strokeWidth={0.75} className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}

export default Header;

