import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import MangaCard from '../components/manga/MangaCard';
import MangaGrid from '../components/manga/MangaGrid';
import Button from '../components/ui/Button';
import FloatingInput from '../components/ui/FloatingInput';
import { useBackpack } from '../context/BackpackContext';
import { 
  User, Pencil, Bookmark, History, Settings as SettingsIcon, 
  LogOut, X, Camera, ZoomIn 
} from 'lucide-react';

const TABS = [
  { id: 'backpack', label: 'Backpack', icon: Bookmark },
  { id: 'history', label: 'History', icon: History },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
];

function ProfilePage() {
  const navigate = useNavigate();
  const { backpack } = useBackpack();
  const [activeTab, setActiveTab] = useState('backpack');
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('currentUser')) || null;
    } catch {
      return null;
    }
  });
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [form, setForm] = useState({ username: '', email: '', bio: '' });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [crop, setCrop] = useState({ zoom: 1, x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef({ x: 0, y: 0, cropX: 0, cropY: 0 });

  useEffect(() => {
    const checkAuth = () => {
      if (localStorage.getItem('isLoggedIn') !== 'true') {
        navigate('/login', { replace: true });
      }
    };
    checkAuth();
    const handleStorage = () => checkAuth();
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [navigate]);

  useEffect(() => {
    return () => {
      if (avatarPreview && avatarFile) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview, avatarFile]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    navigate('/login', { replace: true });
  };

  const username = user?.username || 'Manga Fan';
  const email = user?.email || 'user@mangahub.com';
  const bio = user?.bio || 'Avid manga reader and collector.';

  const resetCrop = () => setCrop({ zoom: 1, x: 0, y: 0 });

  const openEdit = () => {
    setForm({ username, email, bio });
    setAvatarFile(null);
    setAvatarPreview(user?.avatar || null);
    setIsEditOpen(true);
  };

  const closeEdit = () => {
    if (avatarPreview && avatarFile) URL.revokeObjectURL(avatarPreview);
    setAvatarFile(null);
    setAvatarPreview(null);
    setIsEditOpen(false);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (avatarPreview && avatarFile) URL.revokeObjectURL(avatarPreview);
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    resetCrop();
  };

  const handlePanStart = (e) => {
    if (!avatarPreview) return;
    setIsPanning(true);
    panStart.current = { x: e.clientX, y: e.clientY, cropX: crop.x, cropY: crop.y };
  };

  const handlePanMove = (e) => {
    if (!isPanning) return;
    const dx = e.clientX - panStart.current.x;
    const dy = e.clientY - panStart.current.y;
    setCrop((c) => ({ ...c, x: panStart.current.cropX + dx, y: panStart.current.cropY + dy }));
  };

  const handlePanEnd = () => setIsPanning(false);

  const handleZoom = (e) => {
    const zoom = parseFloat(e.target.value);
    setCrop((c) => ({ ...c, zoom }));
  };

  const cropImage = () => {
    const VIEWPORT = 160;
    return new Promise((resolve) => {
      if (!avatarPreview) return resolve(null);
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = VIEWPORT;
        canvas.height = VIEWPORT;
        const ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.arc(VIEWPORT / 2, VIEWPORT / 2, VIEWPORT / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        const scale = crop.zoom;
        const dispW = img.naturalWidth * scale;
        const dispH = img.naturalHeight * scale;
        const left = VIEWPORT / 2 - dispW / 2 + crop.x;
        const top = VIEWPORT / 2 - dispH / 2 + crop.y;
        const sx = (0 - left) / scale;
        const sy = (0 - top) / scale;
        const sSize = VIEWPORT / scale;
        ctx.drawImage(img, sx, sy, sSize, sSize, 0, 0, VIEWPORT, VIEWPORT);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = () => resolve(null);
      img.src = avatarPreview;
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    let avatar = user?.avatar || null;
    if (avatarFile) {
      const cropped = await cropImage();
      avatar = cropped || avatarPreview;
    } else if (avatarPreview && avatarPreview !== user?.avatar) {
      const cropped = await cropImage();
      if (cropped) avatar = cropped;
    }
    const next = { ...(user || {}), username: form.username, email: form.email, bio: form.bio, avatar };
    setUser(next);
    localStorage.setItem('currentUser', JSON.stringify(next));
    if (avatarPreview && avatarFile) URL.revokeObjectURL(avatarPreview);
    setAvatarFile(null);
    setAvatarPreview(null);
    resetCrop();
    setIsEditOpen(false);
  };

  const transform = `translate(-50%, -50%) translate(${crop.x}px, ${crop.y}px) scale(${crop.zoom})`;

  return (
    <div className="w-full max-w-4xl mx-auto pt-28 pb-16 px-4">
      <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.4)] sm:p-8">
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:gap-6">
          <div className="relative shrink-0">
            <div className="grid h-24 w-24 place-items-center overflow-hidden rounded-full border-2 border-white/30 bg-white/5 text-white shadow-[0_0_24px_rgba(255,255,255,0.25)]">
              {user?.avatar ? (
                <img src={user.avatar} alt="avatar" className="h-full w-full object-cover" />
              ) : (
                <User strokeWidth={1.25} className="h-12 w-12" />
              )}
            </div>
            <span className="pointer-events-none absolute inset-0 rounded-full ring-2 ring-white/20" />
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-bold text-white">{username}</h1>
            <p className="mt-1 text-sm text-white/60">{email}</p>
            <p className="mt-2 text-xs text-white/40">{bio}</p>
          </div>

          <button
            type="button"
            onClick={openEdit}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            <Pencil className="h-4 w-4" />
            Edit Profile
          </button>
        </div>
      </section>

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

      <div className="mt-8">
        {activeTab === 'backpack' && (
          <div className="flex flex-col items-center justify-center min-h-[300px] gap-3 rounded-2xl border border-white/10 bg-white/5 text-center backdrop-blur-md">
              {backpack.length === 0 ? (
                <>
                  <Bookmark className="h-8 w-8 text-white/40" />
                  <p className="mt-2 text-sm text-white/60">Your Backpack is empty.</p>
                </>
              ) : (
              <MangaGrid className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {backpack.map((item) => (
                  <MangaCard
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    genre={item.genre}
                    posterUrl={item.posterUrl}
                    hoverLift={false}
                  />
                ))}
              </MangaGrid>
            )}
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

      {isEditOpen && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm"
          onClick={closeEdit}
        >
          <div
            className="relative w-full max-w-md overflow-hidden rounded-[22px] border border-white/[0.22] bg-[linear-gradient(145deg,rgba(255,255,255,0.07)_0%,rgba(255,255,255,0.015)_45%,rgba(255,255,255,0.04)_100%)] p-6 backdrop-blur-[5px] backdrop-saturate-[130%] backdrop-brightness-[1.4] shadow-[0_30px_80px_rgba(0,0,0,0.75),0_0_80px_rgba(255,255,255,0.07),inset_0_1px_0_rgba(255,255,255,0.35)] sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeEdit}
              aria-label="Close"
              className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <h2 className="text-xl font-bold text-white">Edit Profile</h2>
            <p className="mt-1 text-sm text-white/60">Update your account details.</p>

            <form onSubmit={handleSave} className="mt-6 space-y-4">
              <div className="flex flex-col items-center gap-3">
                <div className="relative h-40 w-40 cursor-grab overflow-hidden rounded-full border-2 border-white/30 bg-white/5 shadow-[0_0_24px_rgba(255,255,255,0.15)] active:cursor-grabbing"
                  onMouseDown={handlePanStart}
                  onMouseMove={handlePanMove}
                  onMouseUp={handlePanEnd}
                  onMouseLeave={handlePanEnd}
                >
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="avatar preview"
                      draggable={false}
                      className="absolute left-1/2 top-1/2 max-w-none select-none"
                      style={{ transform }}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-white/60">
                      <User strokeWidth={1.25} className="h-12 w-12" />
                    </div>
                  )}
                  <span className="pointer-events-none absolute inset-0 rounded-full ring-2 ring-white/30" />
                </div>

                <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10 hover:text-white">
                  <Camera className="h-4 w-4" />
                  Choose photo
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </label>

                {avatarPreview && (
                  <div className="flex w-full items-center gap-3">
                    <ZoomIn className="h-4 w-4 shrink-0 text-white/60" />
                    <input
                      type="range"
                      min="1"
                      max="3"
                      step="0.01"
                      value={crop.zoom}
                      onChange={handleZoom}
                      className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-white"
                    />
                  </div>
                )}
              </div>

              <FloatingInput
                id="edit-username"
                name="username"
                label="Username"
                type="text"
                value={form.username}
                onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                placeholder="yourname"
              />
              <FloatingInput
                id="edit-email"
                name="email"
                label="Email"
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="you@example.com"
              />
              <FloatingInput
                id="edit-bio"
                name="bio"
                label="Bio"
                type="text"
                value={form.bio}
                onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                placeholder="Tell us about yourself"
              />

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeEdit}
                  className="flex-1 rounded-[11px] border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
                >
                  Cancel
                </button>
                <div className="flex-1">
                  <Button type="submit">Save Changes</Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;

