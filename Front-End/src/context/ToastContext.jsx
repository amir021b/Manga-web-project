
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../components/ui/Toast';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toastMessage, setToastMessage] = useState(null);

  const addToast = useCallback((title, message = '') => {
    setToastMessage({ title, message });
  }, []);

  const hideToast = useCallback(() => {
    setToastMessage(null);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, hideToast }}>
      {children}
      {toastMessage && (
        <Toast title={toastMessage.title} message={toastMessage.message} onClose={hideToast} />
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default ToastContext;
