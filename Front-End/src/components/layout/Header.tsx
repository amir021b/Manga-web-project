"use client";

import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Search, User } from 'lucide-react';
import Logo from '../ui/Logo';
import Link from 'next/link';
import { useUser } from '../../context/UserContext';

function NavLink({ href, children, isActive }: { href: string; children: React.ReactNode; isActive?: boolean }) {
  const active = isActive ?? false;
  return (
<Link href={href} className={`transition ${active ? '...' : '...'}`}>
  {children}
</Link>
  );
}

function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUser();
  const [query, setQuery] = useState('');

  // Hide header on authentication pages
  if (pathname === '/login' || pathname === '/signup') return null;

  useEffect(() => {
    setQuery(typeof window !== 'undefined' ? (new URLSearchParams(window.location.search).get('q') || '') : '');
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <header className="fixed top-4 left-1/2 z-50 w-[min(1200px,calc(100%-2rem))] -translate-x-1/2">
      <div
        className="flex items-center gap-3 sm:gap-5 rounded-full border border-[var(--mh-border)] bg-[var(--mh-surface-strong)] px-4 py-2.5 backdrop-blur-md shadow-[var(--mh-shadow)]"
      >
        <Logo variant="header" />

        <nav className="hidden md:flex items-center gap-4 text-sm">
          <NavLink href="/" isActive={pathname === '/'} >Home</NavLink>
          <NavLink href="/explore" isActive={pathname === '/explore'} >Explore</NavLink>
        </nav>

        <div className="relative ml-auto flex-1 max-w-xs">
          <form onSubmit={handleSearch} className="flex items-center">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--mh-text-muted)]"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search manga..."
              className="w-full rounded-full border border-[var(--mh-border)] bg-[var(--mh-input-bg)] py-1.5 pl-9 pr-4 text-sm text-[var(--mh-input-text)] placeholder:[var(--mh-input-placeholder)] outline-none transition focus:border-[var(--mh-accent)] focus:bg-[var(--mh-input-bg)]"
            />
          </form>
        </div>

        {user ? (
          <>
            <div className="hidden sm:flex items-center gap-2 text-sm text-[var(--mh-text-secondary)]">
              <span>{user.username}</span>
            </div>
            <button
              type="button"
              onClick={() => router.push('/profile')}
              aria-label="Profile"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[var(--mh-border)] bg-[var(--mh-surface-strong)] text-[var(--mh-text)] transition hover:bg-[var(--mh-surface)] hover:text-[var(--mh-text)]"
            >
              {user.avatar ? (
                <img src={user.avatar} alt="avatar" className="w-full h-full rounded-full object-cover" />
              ) : (
                <User strokeWidth={0.75} className="h-5 w-5" />
              )}
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => router.push('/login')}
            aria-label="Login"
            className="inline-flex items-center gap-1.5 rounded-full border border-[var(--mh-border)] bg-[var(--mh-surface-strong)] px-3 py-1.5 text-xs text-[var(--mh-text)] transition hover:bg-[var(--mh-surface)] hover:text-[var(--mh-text)]"
          >
            <User strokeWidth={0.75} className="h-3.5 w-3.5" />
            Login
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
