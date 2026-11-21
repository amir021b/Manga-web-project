"use client";

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface ToastProps {
  title: string;
  message: string;
  onClose: () => void;
}

function Toast({ title, message, onClose }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed top-6 right-6 z-[100] pointer-events-auto"
      onClick={onClose}
    >
      <div
        className="pointer-events-none relative overflow-hidden rounded-[16px] border border-[var(--mh-border)] bg-[var(--mh-gradient-bg)] p-4 backdrop-blur-[8px] backdrop-saturate-[150%] shadow-[var(--mh-shadow-strong)] transition-all duration-300 transform translate-y-0"
        onClick={(e) => e.stopPropagation()}
        role="status"
        aria-live="polite"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--mh-accent)]/10 text-[var(--mh-accent)]">
            <span className="text-sm font-bold">+</span>
          </div>
          <div>
            {title && (
              <p className="text-sm font-bold text-[var(--mh-text)]">{title}</p>
            )}
            {message && (
              <p className="text-xs text-[var(--mh-text-secondary)] mt-0.5">{message}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 h-6 w-6 rounded-full bg-[var(--mh-surface)] hover:bg-[var(--mh-surface-strong)] text-[var(--mh-text)] transition"
            aria-label="Dismiss"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Toast;
