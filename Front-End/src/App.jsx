import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { BackpackProvider } from './context/BackpackContext';
import { ToastProvider } from './context/ToastContext';
import Layout from './components/layout/Layout';
import AuthCard from './components/auth/AuthCard';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import SearchPage from './pages/SearchPage';
import ExplorePage from './pages/ExplorePage';
import GenresPage from './pages/GenresPage';
import MangaDetailPage from './pages/MangaDetailPage';
import ReaderPage from './pages/ReaderPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <BackpackProvider>
      <ToastProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<AuthCard />} />
              <Route path="/signup" element={<AuthCard />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/genres" element={<GenresPage />} />
              <Route path="/manga/:id" element={<MangaDetailPage />} />
              <Route path="/manga/:id/chapter/:chapterId" element={<ReaderPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </ToastProvider>
    </BackpackProvider>
  );
}

export default App;