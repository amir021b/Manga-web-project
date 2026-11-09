import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { BackpackProvider } from './context/BackpackContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import { UserProvider, useUser } from './context/UserContext';
import Layout from './components/layout/Layout';
import AuthCard from './components/auth/AuthCard';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import SearchPage from './pages/SearchPage';
import ExplorePage from './pages/ExplorePage';
import MangaDetailPage from './pages/MangaDetailPage';
import ReaderPage from './pages/ReaderPage';
import NotFoundPage from './pages/NotFoundPage';

function AppShell() {
  const { isLoadingAuth } = useUser();

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen w-full bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-pulse">
          <svg className="w-20 h-20 text-[var(--mh-accent)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<AuthCard />} />
          <Route path="/signup" element={<AuthCard />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/manga/:id" element={<MangaDetailPage />} />
          <Route path="/manga/:id/chapter/:chapterId" element={<ReaderPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

function App() {
  return (
    <BackpackProvider>
      <ThemeProvider>
        <ToastProvider>
          <UserProvider>
            <AppShell />
          </UserProvider>
        </ToastProvider>
      </ThemeProvider>
    </BackpackProvider>
  );
}

export default App;
