"use client";

import { useRouter, usePathname } from 'next/navigation';
import { useLayoutEffect, useRef, useState } from 'react';
import { Search, User, ChevronDown, ChevronUp } from 'lucide-react';
import Logo from '../ui/Logo';
import Link from 'next/link';
import Image from 'next/image';
import { useUser } from '../../context/UserContext';
import { useHeaderCollapsed } from '../../context/HeaderContext';
import { withBasePath } from '@/lib/basePath';

const COLLAPSED_PILL_WIDTH = 38;
const VIEWPORT_EDGE = 16;
const MAX_PILL_WIDTH = 1200;

function NavLink({ href, children, isActive }: { href: string; children: React.ReactNode; isActive?: boolean }) {
  const active = isActive ?? false;
  return (
    <Link
      href={href}
      className={`transition ${active ? 'text-[var(--mh-text)] font-semibold border-b-2 border-[var(--mh-accent)]' : 'text-[var(--mh-text-muted)] hover:text-[var(--mh-text)]'}`}
    >
      {children}
    </Link>
  );
}

function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUser();
  const { collapsed, toggle } = useHeaderCollapsed();
  const [query, setQuery] = useState('');
  const headerRef = useRef<HTMLElement | null>(null);
  const pillRef = useRef<HTMLDivElement | null>(null);
  const previousLeftRef = useRef<number | null>(null);
  const offsetsRef = useRef({ expandedLeft: 0, collapsedLeft: 0 });
  const previousCollapsedRef = useRef(collapsed);
  const [expandedWidth, setExpandedWidth] = useState<number | null>(null);
  const [positionShift, setPositionShift] = useState(0);
  const [instantShift, setInstantShift] = useState(false);

  useLayoutEffect(() => {
    const measure = () => {
      const width = headerRef.current?.getBoundingClientRect().width;
      if (!width) return;

      const nextExpandedWidth = Math.min(
        MAX_PILL_WIDTH,
        width - VIEWPORT_EDGE * 2,
        window.innerWidth - VIEWPORT_EDGE * 2,
      );

      setExpandedWidth(nextExpandedWidth);
      offsetsRef.current = {
        expandedLeft: (width - nextExpandedWidth) / 2,
        collapsedLeft: width - VIEWPORT_EDGE - COLLAPSED_PILL_WIDTH,
      };
    };

    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [pathname]);

  useLayoutEffect(() => {
    if (previousCollapsedRef.current === collapsed) return;
    previousCollapsedRef.current = collapsed;

    const pill = pillRef.current;
    const header = headerRef.current;
    const previousLeft = previousLeftRef.current;
    previousLeftRef.current = null;
    if (!pill || !header || previousLeft === null) return;

    const headerLeft = header.getBoundingClientRect().left;
    const renderedWidth = pill.getBoundingClientRect().width;
    const { expandedLeft, collapsedLeft } = offsetsRef.current;
    const nextLeft = collapsed
      ? headerLeft + collapsedLeft + COLLAPSED_PILL_WIDTH - renderedWidth
      : headerLeft + expandedLeft + ((expandedWidth ?? renderedWidth) - renderedWidth) / 2;
    const nextShift = previousLeft - nextLeft;
    if (Math.abs(nextShift) < 0.5) return;

    setInstantShift(true);
    setPositionShift(nextShift);
  }, [collapsed, expandedWidth]);

  useLayoutEffect(() => {
    if (!instantShift) return;

    const pill = pillRef.current;
    if (!pill) return;

    void pill.offsetWidth;
    const frame = requestAnimationFrame(() => {
      setInstantShift(false);
      setPositionShift(0);
    });

    return () => cancelAnimationFrame(frame);
  }, [instantShift]);

  const handleToggle = () => {
    const pill = pillRef.current;
    if (pill) {
      previousLeftRef.current = pill.getBoundingClientRect().left;
    }
    toggle();
  };

  // Hide header on authentication pages
  if (pathname === '/login' || pathname === '/signup') return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <header
      ref={headerRef}
      className="fixed inset-x-0 top-0 z-50 h-0"
    >
      <div
        ref={pillRef}
        style={{
          width: collapsed
            ? `${COLLAPSED_PILL_WIDTH}px`
            : expandedWidth !== null
              ? `${expandedWidth}px`
              : undefined,
          transform:
            positionShift !== 0
              ? `translateX(${positionShift}px)`
              : undefined,
          transitionProperty: instantShift ? 'width' : undefined,
        }}
        className={`absolute top-4 flex max-w-[calc(100%-2rem)] origin-right items-center gap-3 sm:gap-5 rounded-full border border-[var(--mh-border)] bg-[var(--mh-surface-strong)] backdrop-blur-md shadow-[var(--mh-shadow)] transition-[transform,width] duration-500 ease-in-out motion-reduce:transition-none ${
          collapsed
            ? 'right-4 overflow-hidden justify-end p-0'
            : 'left-1/2 -translate-x-1/2 px-4 py-2.5'
        }`}
      >
        <div
          className={`transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none ${
            collapsed
              ? 'pointer-events-none absolute -translate-y-2 opacity-0'
              : ''
          }`}
          inert={collapsed || undefined}
        >
          <Logo variant="header" />
        </div>

        <nav
          className={`hidden md:flex items-center gap-4 text-sm transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none ${
            collapsed
              ? 'pointer-events-none absolute -translate-y-2 opacity-0'
              : ''
          }`}
          inert={collapsed || undefined}
        >
          <NavLink href="/" isActive={pathname === '/'}>Home</NavLink>
          <NavLink href="/explore" isActive={pathname === '/explore'}>Explore</NavLink>
        </nav>

        <div
          className={`ml-auto flex-1 max-w-xs transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none ${
            collapsed
              ? 'pointer-events-none absolute -translate-y-2 opacity-0'
              : 'relative'
          }`}
          inert={collapsed || undefined}
        >
          <form onSubmit={handleSearch} className="flex items-center">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--mh-text-muted)]"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search manga..."
              className="w-full rounded-full border border-[var(--mh-border)] bg-[var(--mh-input-bg)] py-1.5 pl-9 pr-4 text-sm text-[var(--mh-input-text)] placeholder:text-[var(--mh-input-placeholder)] outline-none transition focus:border-[var(--mh-accent)] focus:bg-[var(--mh-input-bg)]"
            />
          </form>
        </div>

        {user ? (
          <>
            <div
              className={`hidden sm:flex items-center gap-2 text-sm text-[var(--mh-text-secondary)] transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none ${
                collapsed
                  ? 'pointer-events-none absolute -translate-y-2 opacity-0'
                  : ''
              }`}
              inert={collapsed || undefined}
            >
              <span>{user.username}</span>
            </div>
            <button
              type="button"
              onClick={handleToggle}
              aria-label={collapsed ? 'Expand header' : 'Collapse header'}
              aria-expanded={!collapsed}
              className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-[var(--mh-text-muted)] transition-[opacity,transform] duration-300 ease-out hover:bg-[var(--mh-surface)] hover:text-[var(--mh-text)] motion-reduce:transition-none ${
                collapsed
                  ? 'pointer-events-none absolute -translate-y-2 opacity-0'
                  : ''
              }`}
              inert={collapsed || undefined}
            >
              {collapsed ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronUp className="h-4 w-4" />
              )}
            </button>
            <button
              type="button"
              onClick={collapsed ? handleToggle : () => router.push('/profile')}
              aria-label={collapsed ? 'Expand header' : 'Profile'}
              title={collapsed ? 'Expand header' : undefined}
              className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full border border-[var(--mh-border)] bg-[var(--mh-surface-strong)] text-[var(--mh-text)] transition hover:bg-[var(--mh-surface)] hover:text-[var(--mh-text)]"
            >
              {user.avatar ? (
                <Image
                  src={withBasePath(user.avatar)}
                  alt="avatar"
                  width={36}
                  height={36}
                  unoptimized
                  className="h-full w-full rounded-full object-cover"
                />
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
