import { useLocation } from 'react-router-dom';
import StarBackground from './StarBackground';
import Header from './Header';

function Layout({ children }) {
  const location = useLocation();
  const hideHeader = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div className="relative min-h-screen">
      <StarBackground />
      {!hideHeader && <Header />}
      <main
        className={`relative z-10 grid min-h-screen place-items-center px-4 pb-8 ${
          hideHeader ? 'pt-8' : 'pt-24'
        }`}
      >
        {children}
      </main>
    </div>
  );
}

export default Layout;
