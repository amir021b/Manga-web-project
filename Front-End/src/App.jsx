import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { BackpackProvider } from './context/BackpackContext';
import { ToastProvider } from './context/ToastContext';
import Layout from './components/layout/Layout';
import AuthCard from './components/auth/AuthCard';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';

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
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </ToastProvider>
    </BackpackProvider>
  );
}

export default App;