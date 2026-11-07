import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

function Toast({ message, onClose }) {
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
        className="pointer-events-none relative overflow-hidden rounded-[16px] border border-white/[0.22] bg-[linear-gradient(145deg,rgba(255,255,255,0.07)_0%,rgba(255,255,255,0.015)_45%,rgba(255,255,255,0.04)_100%)] p-4 backdrop-blur-[8px] backdrop-saturate-[150%] shadow-[0_20px_40px_rgba(0,0,0,0.6)] transition-all duration-300 transform translate-y-0"
        onClick={(e) => e.stopPropagation()}
        role="status"
        aria-live="polite"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white">
            <span className="text-sm font-bold">+</span>
          </div>
          <div>
            <p className="text-sm font-bold text-white">Added to your backpack!</p>
            <p className="text-xs text-white/60 mt-0.5">{message}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 h-6 w-6 rounded-full bg-white/5 hover:bg-white/10 text-white/70 transition"
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
