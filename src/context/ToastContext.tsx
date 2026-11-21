"use client";

import { createContext, useContext, useState, useCallback, useRef } from 'react';
import Toast from '../components/ui/Toast';

interface ToastMessage {
  id: number;
  title: string;
  message: string;
}

interface ToastContextValue {
  addToast: (title: string, message?: string) => void;
  hideToast: () => void;
  showToast: (title: string) => void;
}

const ToastContext = createContext<ToastContextValue>({
  addToast: () => {},
  hideToast: () => {},
  showToast: () => {},
});

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toastMessage, setToastMessage] = useState<ToastMessage | null>(null);
  const toastIdRef = useRef(0);

  const pushToast = useCallback((title: string, message: string) => {
    toastIdRef.current += 1;
    setToastMessage({ id: toastIdRef.current, title, message });
  }, []);

  const addToast = useCallback(
    (title: string, message = '') => pushToast(title, message),
    [pushToast],
  );

  const showToast = useCallback(
    (title: string) => pushToast(title, ''),
    [pushToast],
  );

  const hideToast = useCallback(() => {
    setToastMessage(null);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, hideToast, showToast }}>
      {children}
      {toastMessage && (
        <Toast
          key={toastMessage.id}
          title={toastMessage.title}
          message={toastMessage.message}
          onClose={hideToast}
        />
      )}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context && typeof window !== 'undefined') {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default ToastContext;
