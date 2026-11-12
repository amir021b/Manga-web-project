function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const HIDDEN_HEADER_PATHS = ['/login', '/signup'];
  const showHeader = !HIDDEN_HEADER_PATHS.includes(pathname);

  return (
    <div className="relative min-h-screen flex flex-col bg-[var(--mh-bg)] text-[var(--mh-text)] transition-colors duration-300">
      <StarBackground />
      {showHeader && <Header />}
      <main className="relative z-10 grid min-h-screen place-items-center px-4 pt-24 pb-8 flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}

import { usePathname } from 'next/navigation';
import StarBackground from './StarBackground';
import Header from './Header';
import Footer from './Footer';

export default Layout;
