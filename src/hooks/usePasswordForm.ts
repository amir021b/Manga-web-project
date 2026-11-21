"use client";

import { useState, useCallback } from 'react';

interface Passwords {
  current: string;
  new: string;
  confirm: string;
}

interface PasswordErrors {
  current?: string;
  new?: string;
  confirm?: string;
}

interface PasswordVisibility {
  current: boolean;
  new: boolean;
  confirm: boolean;
}

function usePasswordForm({ onSave }: { onSave: () => void }) {
  const [passwords, setPasswords] = useState<Passwords>({ current: '', new: '', confirm: '' });
  const [passwordErrors, setPasswordErrors] = useState<PasswordErrors>({});
  const [passwordVisibility, setPasswordVisibility] = useState<PasswordVisibility>({ current: false, new: false, confirm: false });

  const validatePasswords = useCallback(() => {
    const errs: PasswordErrors = {};
    if (!passwords.current) errs.current = 'Current password is required';
    if (!passwords.new) errs.new = 'New password is required';
    else if (passwords.new.length < 6) errs.new = 'New password must be at least 6 characters';
    if (!passwords.confirm) errs.confirm = 'Please confirm your new password';
    else if (passwords.confirm !== passwords.new) errs.confirm = 'Passwords do not match';
    setPasswordErrors(errs);
    return Object.keys(errs).length === 0;
  }, [passwords]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePasswords()) return;
    onSave();
    setPasswords({ current: '', new: '', confirm: '' });
    setPasswordVisibility({ current: false, new: false, confirm: false });
  }, [validatePasswords, onSave]);

  const handleChange = useCallback((field: keyof Passwords) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords((p) => ({ ...p, [field]: e.target.value }));
  }, []);

  const toggleVisibility = useCallback((field: keyof PasswordVisibility) => () => {
    setPasswordVisibility((v) => ({ ...v, [field]: !v[field] }));
  }, []);

  return {
    passwords,
    passwordErrors,
    passwordVisibility,
    handleSubmit,
    handleChange,
    toggleVisibility,
  };
}

export default usePasswordForm;
