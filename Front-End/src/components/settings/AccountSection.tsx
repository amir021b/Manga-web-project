"use client";

import { useState } from 'react';
import { Mail, Trash2 } from 'lucide-react';
import Button from '../ui/Button';
import FloatingInput from '../ui/FloatingInput';
import PasswordToggle from '../ui/PasswordToggle';
import usePasswordForm from '../../hooks/usePasswordForm';
import { changePassword, updateEmail } from '../../services/settingsApi';
import { useToast } from '../../context/ToastContext';
import type { UserData } from '../../context/UserContext';
import type { MangaItem } from '../../data/bigThree';

interface AccountSectionProps {
  user: UserData | null | undefined;
  setCurrentUser: (nextUser: UserData | null) => void;
  setBackpack: (backpack: MangaItem[]) => void;
  addToast: (title: string, message?: string) => void;
  router: any;
}

function AccountSection({ user, setCurrentUser, setBackpack, router }: AccountSectionProps) {
  const [newEmail, setNewEmail] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { addToast } = useToast();

  const email = user?.email || 'user@mangahub.com';

  const handlePasswordSave = async () => {
    try {
      await changePassword({
        currentPassword: passwords.current,
        newPassword: passwords.new,
      });
      addToast('Password updated');
    } catch (err: any) {
      addToast('Password update failed', err.message || 'Could not update password.');
    }
  };

  const {
    passwords,
    passwordErrors,
    passwordVisibility,
    handleSubmit,
    handleChange,
    toggleVisibility,
  } = usePasswordForm({ onSave: handlePasswordSave });

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!newEmail || !emailRegex.test(newEmail)) {
      addToast('Invalid email', 'Please enter a valid email address');
      return;
    }
    try {
      await updateEmail({ email: newEmail });
      setCurrentUser({ ...user, email: newEmail } as UserData);
      addToast('Email updated');
      setNewEmail('');
    } catch (err: any) {
      addToast('Email update failed', err.message || 'Could not update email.');
    }
  };

  const handleDeleteAccount = () => {
    localStorage.removeItem('mangahub_backpack');
    localStorage.removeItem('mangahub_notifications');
    setBackpack([]);
    setConfirmDelete(false);
    addToast('Account deleted');
    router.replace('/login');
  };

  return (
    <>
      <div className="space-y-4">
        <label className="text-xs font-semibold text-[var(--mh-text-secondary)] uppercase tracking-wider mb-4">Change password</label>
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <div className="mt-2">
            <FloatingInput
              id="settings-password-current"
              label="Current Password"
              type={passwordVisibility.current ? 'text' : 'password'}
              value={passwords.current}
              onChange={handleChange('current')}
              autoComplete="current-password"
              endAdornment={
                <PasswordToggle
                  visible={passwordVisibility.current}
                  onToggle={toggleVisibility('current')}
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
              onChange={handleChange('new')}
              autoComplete="new-password"
              endAdornment={
                <PasswordToggle
                  visible={passwordVisibility.new}
                  onToggle={toggleVisibility('new')}
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
              onChange={handleChange('confirm')}
              autoComplete="new-password"
              endAdornment={
                <PasswordToggle
                  visible={passwordVisibility.confirm}
                  onToggle={toggleVisibility('confirm')}
                />
              }
              error={passwordErrors.confirm}
            />
          </div>
          <Button type="submit" disabled={false}>Save Password</Button>
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
  );
}

export default AccountSection;
