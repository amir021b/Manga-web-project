import { useState, useEffect } from 'react';
import { X, User, Camera, ZoomIn } from 'lucide-react';
import FloatingInput from '../ui/FloatingInput';
import Button from '../ui/Button';
import useAvatarCrop from '../../hooks/useAvatarCrop';

function EditProfileModal({ user, onSave, onClose }) {
  const [form, setForm] = useState({ username: '', email: '', bio: '' });
  const [isExiting, setIsExiting] = useState(false);
  const {
    avatarFile,
    setAvatarFile,
    avatarPreview,
    setAvatarPreview,
    crop,
    resetCrop,
    handleAvatarChange,
    handlePanStart,
    handlePanMove,
    handlePanEnd,
    handleZoom,
    cropImage,
    transform,
  } = useAvatarCrop(user?.avatar);

  useEffect(() => {
    if (!isExiting) return;
    const timer = setTimeout(() => onClose(), 220);
    return () => clearTimeout(timer);
  }, [isExiting, onClose]);

  const handleClose = () => {
    setIsExiting(true);
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
    onSave(next);
    if (avatarPreview && avatarFile) URL.revokeObjectURL(avatarPreview);
    setAvatarFile(null);
    setAvatarPreview(null);
    resetCrop();
    handleClose();
  };

  const backdropClass = `fixed inset-0 z-60 flex items-center justify-center px-4 backdrop-blur-sm ${isExiting ? 'backdrop-fade-out' : 'backdrop-fade-in'}`;
  const modalClass = `relative w-full max-w-md overflow-hidden rounded-[22px] border border-[var(--mh-border)] bg-[var(--mh-gradient-bg)] p-6 backdrop-blur-[5px] backdrop-saturate-[130%] backdrop-brightness-[1.4] shadow-[var(--mh-shadow-strong)] sm:p-8 ${isExiting ? 'modal-fade-out' : 'modal-fade-in'}`;

  return (
    <div className={backdropClass} onClick={handleClose}>
      <div className={modalClass} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close"
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-[var(--mh-border)] bg-[var(--mh-surface)] text-[var(--mh-text-secondary)] transition hover:bg-[var(--mh-surface-strong)] hover:text-[var(--mh-text)]"
        >
          <X className="h-4 w-4" />
        </button>

        <form onSubmit={handleSave} className="mt-6 space-y-4">
          <div className="flex flex-col items-center gap-3">
            <div className="relative h-40 w-40 cursor-grab overflow-hidden rounded-full border-2 border-[var(--mh-border)] bg-[var(--mh-surface)] shadow-[0_0_24px_rgba(0,0,0,0.15)] active:cursor-grabbing"
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
                <div className="flex h-full w-full items-center justify-center text-[var(--mh-text-secondary)]/60">
                  <User strokeWidth={1.25} className="h-12 w-12" />
                </div>
              )}
              <span className="pointer-events-none absolute inset-0 rounded-full ring-2 ring-[var(--mh-border)]/30" />
            </div>

            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[var(--mh-border)] bg-[var(--mh-surface)] px-4 py-2 text-sm text-[var(--mh-text)] transition hover:bg-[var(--mh-surface-strong)] hover:text-[var(--mh-text)]">
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
                <ZoomIn className="h-4 w-4 shrink-0 text-[var(--mh-text-secondary)]/60" />
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
              onClick={handleClose}
              className="flex-1 rounded-[11px] border border-[var(--mh-border)] bg-[var(--mh-surface)] px-4 py-3 text-sm font-semibold text-[var(--mh-text)] transition hover:bg-[var(--mh-surface-strong)] hover:text-[var(--mh-text)]"
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
  );
}

export default EditProfileModal;
