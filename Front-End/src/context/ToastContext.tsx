
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../components/ui/Toast';

interface ToastMessage {
  title: string;
  message: string;
}

interface ToastContextValue {
  addToast: (title: string, message?: string) => void;
  hideToast: () => void;
  showToast: (title: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toastMessage, setToastMessage] = useState<ToastMessage | null>(null);

  const addToast = useCallback((title: string, message = '') => {
    setToastMessage({ title, message });
  }, []);

  const showToast = useCallback((title: string) => {
    setToastMessage({ title, message: '' });
  }, []);

  const hideToast = useCallback(() => {
    setToastMessage(null);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, hideToast, showToast }}>
      {children}
      {toastMessage && (
        <Toast title={toastMessage.title} message={toastMessage.message} onClose={hideToast} />
      )}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default ToastContext;
