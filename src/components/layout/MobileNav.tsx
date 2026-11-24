"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { House, Compass, User } from 'lucide-react';

const activeClass = "text-[var(--mh-text)] font-semibold";
const inactiveClass = "text-[var(--mh-text-muted)] hover:text-[var(--mh-text)]";
const baseClasses = "flex flex-1 flex-col items-center justify-center gap-1 py-1 text-xs leading-none transition";

function MobileNav() {
  const pathname = usePathname();
  const normalized = pathname.replace(/\/$/, '') || '/';

  const isHome = normalized === '/';
  const isExplore = normalized.startsWith('/explore');
  const isProfile = normalized.startsWith('/profile');

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 flex items-stretch justify-around border-t border-[var(--mh-border)] bg-[var(--mh-surface-strong)] py-2 backdrop-blur-md sm:hidden">
      <Link href="/" className={`${baseClasses} ${isHome ? activeClass : inactiveClass}`}>
        <House className="h-5 w-5 shrink-0 block mx-auto" />
        <span className="text-center block">Home</span>
      </Link>
      <Link href="/explore" className={`${baseClasses} ${isExplore ? activeClass : inactiveClass}`}>
        <Compass className="h-5 w-5 shrink-0 block mx-auto" />
        <span className="text-center block">Explore</span>
      </Link>
      <Link href="/profile" className={`${baseClasses} ${isProfile ? activeClass : inactiveClass}`}>
        <User className="h-5 w-5 shrink-0 block mx-auto" />
        <span className="text-center block">Profile</span>
      </Link>
    </nav>
  );
}

export default MobileNav;
