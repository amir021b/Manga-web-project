import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Pencil, Bookmark, History, Settings as SettingsIcon } from 'lucide-react';
import { useEffect } from 'react';
import MangaCard from '../components/manga/MangaCard';
import { bigThree } from '../data/bigThree';

const TABS = [
  { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark },
  { id: 'history', label: 'History', icon: History },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
];

function ProfilePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('bookmarks');
  const [user] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('currentUser')) || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (localStorage.getItem('isLoggedIn') !== 'true') {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    navigate('/login', { replace: true });
  };

  const username = user?.username || 'Manga Fan';
  const email = user?.email || 'user@mangahub.com';

  return (
    <div className="w-full max-w-4xl mx-auto pt-28 pb-16 px-4">
      {/* User info header */}
      <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.4)] sm:p-8">
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:gap-6">
          {/* Avatar with glowing ring */}
          <div className="relative shrink-0">
            <div className="grid h-24 w-24 place-items-center rounded-full border-2 border-white/30 bg-white/5 text-white shadow-[0_0_24px_rgba(255,255,255,0.25)]">
              <User strokeWidth={1.25} className="h-12 w-12" />
            </div>
            <span className="pointer-events-none absolute inset-0 rounded-full ring-2 ring-white/20" />
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-bold text-white">{username}</h1>
            <p className="mt-1 text-sm text-white/60">{email}</p>
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            <Pencil className="h-4 w-4" />
            Edit Profile
          </button>
        </div>
      </section>

      {/* Tab navigation */}
      <nav className="mt-8 flex items-center gap-6 border-b border-white/10 pb-2 text-sm text-white/70">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-2 pb-2 transition hover:text-white ${isActive ? 'text-white' : ''}`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
              {isActive && (
                <span className="absolute left-1/2 -bottom-1 h-0.5 w-4 -translate-x-1/2 rounded-full bg-white" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Tab content */}
      <div className="mt-8">
        {activeTab === 'bookmarks' && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {bigThree.map((item) => (
              <MangaCard
                key={item.id}
                id={item.id}
                title={item.title}
                genre={item.genre}
                posterUrl={item.posterUrl}
              />
            ))}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 py-16 text-center backdrop-blur-md">
            <History className="h-8 w-8 text-white/40" />
            <p className="text-sm text-white/60">No reading history yet.</p>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 py-16 text-center backdrop-blur-md">
            <SettingsIcon className="h-8 w-8 text-white/40" />
            <p className="text-sm text-white/60">Settings coming soon.</p>
          </div>
        )}
      </div>

      {/* Logout action */}
      <div className="mt-12 flex justify-center">
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-2 rounded-full border border-red-500/20 px-6 py-2.5 text-sm text-red-400 transition hover:bg-red-500/10"
        >
          <LogOut className="h-4 w-4" />
          Log Out
        </button>
      </div>
    </div>
  );
}

export default ProfilePage;
