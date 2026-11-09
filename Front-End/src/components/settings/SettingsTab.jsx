import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBackpack } from '../../context/BackpackContext';
import { useToast } from '../../context/ToastContext';
import { useTheme } from '../../context/ThemeContext';
import { useUser } from '../../context/UserContext';
import Button from '../ui/Button';
import FloatingInput from '../ui/FloatingInput';
import Checkbox from '../ui/Checkbox';
import Collapse from '../ui/Collapse';
import PasswordToggle from '../ui/PasswordToggle';
import {
  Settings, Palette, Shield, Bell, Mail, Trash2,
  ChevronDown
} from 'lucide-react';

const SECTIONS = [
  { id: 'appearance', label: 'Appearance', icon: Palette, hint: 'Theme accent color and UI density' },
  { id: 'account', label: 'Account & Security', icon: Shield, hint: 'Password, email, and danger zone' },
  { id: 'notifications', label: 'Notifications', icon: Bell, hint: 'Alerts, newsletters, and announcements' },
];

const SECTION_ICONS = {
  appearance: Palette,
  account: Shield,
  notifications: Bell,
};

export default function SettingsTab() {
  const navigate = useNavigate();
  const { setBackpack } = useBackpack();
  const { addToast } = useToast();
  const { accent, setAccent, density, setDensity, ACCENT_OPTIONS, DENSITY_OPTIONS } = useTheme();

  const { user, setCurrentUser } = useUser();
  const [openSections, setOpenSections] = useState({ appearance: true });
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('mangahub_notifications');
      return saved ? JSON.parse(saved) : { newChapter: true, weeklyNewsletter: false, systemUpdates: true };
    } catch {
      return { newChapter: true, weeklyNewsletter: false, systemUpdates: true };
    }
  });
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordVisibility, setPasswordVisibility] = useState({ current: false, new: false, confirm: false });

  const [newEmail, setNewEmail] = useState('');

  const email = user?.email || 'user@mangahub.com';

  useEffect(() => {
    localStorage.setItem('mangahub_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const toggleSection = (id) =>
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));

  const isOpen = (id) => !!openSections[id];

  /* ---------- Appearance ---------- */
  const handleAccent = (id) => setAccent(id);
  const handleDensity = (id) => setDensity(id);

  const accentBtn = (option) => {
    const active = accent === option.id;
    return (
      <button
        key={option.id}
        type="button"
        onClick={() => handleAccent(option.id)}
        aria-pressed={active}
        className={[
          'flex flex-col items-center justify-center gap-1.5 rounded-[10px] border px-3 py-2.5 text-xs font-medium transition duration-200',
          active
            ? 'border-[var(--mh-border)] bg-[var(--mh-surface-strong)] text-[var(--mh-text)] shadow-[0_0_0_1px_var(--mh-accent)]'
            : 'border-[var(--mh-border)] text-[var(--mh-text-secondary)] hover:border-[var(--mh-border-soft)] hover:bg-[var(--mh-surface)]',
        ].join(' ')}
      >
        <span
          className={[
            'h-3 w-3 rounded-full',
            active ? 'bg-[var(--mh-accent)] shadow-[0_0_8px_var(--mh-accent-soft)]' : 'bg-[var(--mh-surface)] border border-[var(--mh-border)]',
          ].join(' ')}
        />
        <span>{option.label}</span>
      </button>
    );
  };

  const densityBtn = (option) => {
    const active = density === option.id;
    return (
      <button
        key={option.id}
        type="button"
        onClick={() => handleDensity(option.id)}
        aria-pressed={active}
        className={[
          'rounded-[10px] border px-4 py-2.5 text-xs font-medium transition duration-200',
          active
            ? 'border-[var(--mh-border)] bg-[var(--mh-surface-strong)] text-[var(--mh-text)] shadow-[0_0_0_1px_var(--mh-accent)]'
            : 'border-[var(--mh-border)] text-[var(--mh-text-secondary)] hover:border-[var(--mh-border-soft)] hover:bg-[var(--mh-surface)]',
        ].join(' ')}
      >
        {option.label}
      </button>
    );
  };

  /* ---------- Password ---------- */
  const validatePasswords = useCallback(() => {
    const errs = {};
    if (!passwords.current) errs.current = 'Current password is required';
    if (!passwords.new) errs.new = 'New password is required';
    else if (passwords.new.length < 6) errs.new = 'New password must be at least 6 characters';
    if (!passwords.confirm) errs.confirm = 'Please confirm your new password';
    else if (passwords.confirm !== passwords.new) errs.confirm = 'Passwords do not match';
    setPasswordErrors(errs);
    return Object.keys(errs).length === 0;
  }, [passwords]);

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!validatePasswords()) return;
    addToast('Password updated');
    setPasswords({ current: '', new: '', confirm: '' });
    setPasswordVisibility({ current: false, new: false, confirm: false });
  };

  /* ---------- Email ---------- */
  const handleUpdateEmail = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!newEmail || !emailRegex.test(newEmail)) {
      addToast('Invalid email', 'Please enter a valid email address');
      return;
    }
    const nextUser = { ...user, email: newEmail };
    setCurrentUser(nextUser);
    addToast('Email updated');
    setNewEmail('');
  };

  /* ---------- Delete account ---------- */
  const handleDeleteAccount = () => {
    localStorage.removeItem('mangahub_backpack');
    localStorage.removeItem('mangahub_notifications');
    setBackpack([]);
    setConfirmDelete(false);
    addToast('Account deleted');
    navigate('/login', { replace: true });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="h-5 w-5 text-[var(--mh-accent)]" />
        <h2 className="text-xl font-bold text-[var(--mh-text)]">Settings</h2>
      </div>
      <p className="text-sm text-[var(--mh-text-secondary)]">Customize your MangaHub experience.</p>

      {SECTIONS.map((section) => {
        const Icon = SECTION_ICONS[section.id];
        const open = isOpen(section.id);
        return (
          <article
            key={section.id}
            className="overflow-hidden rounded-2xl border border-[var(--mh-border)] bg-[var(--mh-surface)] backdrop-blur-md"
          >
            <button
              type="button"
              onClick={() => toggleSection(section.id)}
              className="flex w-full items-center justify-between px-6 py-4 text-left transition"
            >
              <div className="flex items-center gap-3">
                <div
                  className="h-9 w-9 rounded-xl flex items-center justify-center bg-[var(--mh-surface)] text-[var(--mh-text-secondary)]"
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--mh-text)]">{section.label}</h3>
                  <p className="text-xs text-[var(--mh-text-secondary)]">{section.hint}</p>
                </div>
              </div>
              <ChevronDown
                className={[
                  'h-4 w-4 text-[var(--mh-text-secondary)] transition-transform duration-200',
                  open ? 'rotate-180' : '',
                ].join(' ')}
              />
            </button>
            <Collapse open={open}>
              <div className="px-6 pb-6 space-y-5">
                {section.id === 'appearance' && (
                  <>
                    <div className="space-y-3 pt-3 border-t border-[var(--mh-border)]">
                      <label className="text-xs font-semibold text-[var(--mh-text-secondary)] uppercase tracking-wider">Theme accent color</label>
                      <div className="grid grid-cols-3 gap-2 sm:grid-cols-3">
                        {ACCENT_OPTIONS.map(accentBtn)}
                      </div>
                      <p className="text-xs text-[var(--mh-text-muted)]">Subtle UI highlights throughout the app.</p>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-[var(--mh-border)]">
                      <label className="text-xs font-semibold text-[var(--mh-text-secondary)] uppercase tracking-wider">UI density / card style</label>
                      <div className="flex gap-2">
                        {DENSITY_OPTIONS.map(densityBtn)}
                      </div>
                      <p className="text-xs text-[var(--mh-text-muted)]">Adjusts card padding and spacing across pages.</p>
                    </div>
                  </>
                )}

                {section.id === 'account' && (
                  <>
                    <div className="space-y-4">
                      <label className="text-xs font-semibold text-[var(--mh-text-secondary)] uppercase tracking-wider mb-4">Change password</label>
                      <form onSubmit={handleChangePassword} className="space-y-4 pt-1">
                        <div className="mt-2">
                          <FloatingInput
                          id="settings-password-current"
                          label="Current Password"
                          type={passwordVisibility.current ? 'text' : 'password'}
                          value={passwords.current}
                          onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
                          autoComplete="current-password"
                          endAdornment={
                            <PasswordToggle
                              visible={passwordVisibility.current}
                              onToggle={() => setPasswordVisibility((v) => ({ ...v, current: !v.current }))}
                            />
                          }
                          error={passwordErrors.current}
                        />
                        </div>
                        <div className="mt-3">
                          <FloatingInput
                            id="settings-password-new"
                          label="New Password"
                          type={passwordVisibility.new ? 'text' : 'password'}
                          value={passwords.new}
                          onChange={(e) => setPasswords((p) => ({ ...p, new: e.target.value }))}
                          autoComplete="new-password"
                          endAdornment={
                            <PasswordToggle
                              visible={passwordVisibility.new}
                              onToggle={() => setPasswordVisibility((v) => ({ ...v, new: !v.new }))}
                            />
                          }
                          error={passwordErrors.new}
                        />
                        </div>
                        <div className="mt-3">
                          <FloatingInput
                            id="settings-password-confirm"
                          label="Confirm Password"
                          type={passwordVisibility.confirm ? 'text' : 'password'}
                          value={passwords.confirm}
                          onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
                          autoComplete="new-password"
                          endAdornment={
                            <PasswordToggle
                              visible={passwordVisibility.confirm}
                              onToggle={() => setPasswordVisibility((v) => ({ ...v, confirm: !v.confirm }))}
                            />
                          }
                          error={passwordErrors.confirm}
                        />
                        </div>
                        <Button type="submit" className="mt-2">Save Password</Button>
                      </form>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-[var(--mh-border)]">
                      <label className="text-xs font-semibold text-[var(--mh-text-secondary)] uppercase tracking-wider mb-2">Email management</label>
                      <div className="flex items-center gap-3 text-sm">
                        <Mail className="h-4 w-4 text-[var(--mh-text-secondary)]" />
                        <span className="text-[var(--mh-text-secondary)]">Registered email:</span>
                        <span className="text-[var(--mh-text)] font-medium">{email}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
                        <FloatingInput
                          id="settings-email-new"
                          label="New email address"
                          type="email"
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                          autoComplete="email"
                          placeholder="you@example.com"
                          className="flex-1 max-w-sm"
                        />
                        <button
                          type="button"
                          onClick={handleUpdateEmail}
                          className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-sm font-medium bg-white text-black hover:bg-gray-200 transition shrink-0"
                        >
                          Update Email
                        </button>
                      </div>
                      <p className="text-xs text-[var(--mh-text-secondary)] mt-1">Updates the email address on your account.</p>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-[var(--mh-border)]">
                      <label className="text-xs font-semibold text-[var(--mh-text-secondary)] uppercase tracking-wider mb-2">Danger zone</label>
                      {confirmDelete ? (
                        <div className="space-y-3 p-3 rounded-xl border border-[var(--mh-border)] bg-[var(--mh-surface)]">
                          <p className="text-sm text-[var(--mh-text)]">Permanently delete your account?</p>
                          <p className="text-xs text-[var(--mh-text-secondary)]">
                            This will remove your saved manga, history, and settings. This action cannot be undone.
                          </p>
                          <div className="flex flex-col sm:flex-row items-center gap-3">
                            <button
                              type="button"
                              onClick={() => setConfirmDelete(false)}
                              className="flex-1 shrink-0 rounded-[10px] border border-[var(--mh-border)] bg-[var(--mh-surface)] px-5 py-2.5 text-sm font-medium text-[var(--mh-text-secondary)] transition hover:bg-[var(--mh-surface-strong)]"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={handleDeleteAccount}
                              className="flex-1 shrink-0 rounded-[10px] border border-red-500/30 bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-700"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col sm:flex-row items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setConfirmDelete(true)}
                            className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-sm font-medium bg-red-600 text-white border border-red-600 hover:bg-red-700 hover:border-red-700 transition shrink-0"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {section.id === 'notifications' && (
                  <div className="space-y-4">
                    <Checkbox
                      id="notif-new-chapter"
                      checked={notifications.newChapter}
                      onChange={() =>
                        setNotifications((n) => ({ ...n, newChapter: !n.newChapter }))
                      }
                      label="New chapter alerts"
                      labelAction="for saved manga"
                    />
                    <Checkbox
                      id="notif-newsletter"
                      checked={notifications.weeklyNewsletter}
                      onChange={() =>
                        setNotifications((n) => ({ ...n, weeklyNewsletter: !n.weeklyNewsletter }))
                      }
                      label="Weekly recommendations"
                      labelAction="newsletter"
                    />
                    <Checkbox
                      id="notif-system"
                      checked={notifications.systemUpdates}
                      onChange={() =>
                        setNotifications((n) => ({ ...n, systemUpdates: !n.systemUpdates }))
                      }
                      label="System updates"
                      labelAction="platform announcements"
                    />
                  </div>
                )}
              </div>
            </Collapse>
          </article>
        );
      })}
    </div>
  );
}
