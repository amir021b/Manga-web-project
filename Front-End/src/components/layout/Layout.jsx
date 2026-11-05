import StarBackground from './StarBackground';
import Header from './Header';

function Layout({ children }) {
  return (
    <div className="relative min-h-screen">
      <StarBackground />
      <Header />
      <main className="relative z-10 grid min-h-screen place-items-center px-4 pt-24 pb-8">
        {children}
      </main>
    </div>
  );
}

export default Layout;

