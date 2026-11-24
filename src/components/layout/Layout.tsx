import StarBackground from './StarBackground';
import Header from './Header';
import Footer from './Footer';
import LayoutMain from './LayoutMain';
import MobileNav from './MobileNav';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen flex flex-col bg-[var(--mh-bg)] text-[var(--mh-text)] transition-colors duration-300">
      <StarBackground />
      <Header />
      <LayoutMain>{children}</LayoutMain>
      <MobileNav />
      <Footer />
    </div>
  );
}

export default Layout;
