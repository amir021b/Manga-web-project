import StarBackground from './StarBackground';
import Header from './Header';
import Footer from './Footer';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen flex flex-col bg-[var(--mh-bg)] text-[var(--mh-text)] transition-colors duration-300">
      <StarBackground />
      <Header />
      <main className="relative z-10 grid min-h-screen place-items-center px-4 pt-24 pb-8 flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
