import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AUTH_MODES, AUTH_COPY, REQUIRED_FIELDS, STATUS } from '../constants/authCopy';
import { validateForm } from '../utils/validators';
import { submitAuth } from '../services/authApi';
import { useUser } from '../context/UserContext';

const INITIAL_VALUES = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false,
};

export function useAuthForm() {
  const location = useLocation();
  const navigate = useNavigate();

  const mode = location.pathname.includes('signup')
    ? AUTH_MODES.SIGNUP
    : AUTH_MODES.LOGIN;

  const [values, setValues] = useState({ ...INITIAL_VALUES });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [status, setStatus] = useState(STATUS.IDLE);

  const isSubmitting = status === STATUS.SUBMITTING;
  const isSuccess = status === STATUS.SUCCESS;

  const isMountedRef = useRef(true);
  const submittingRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      submittingRef.current = false;
    };
  }, []);

  // Reset form whenever the mode (URL) changes.
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setValues({ ...INITIAL_VALUES });
    setErrors({});
    setShowPassword(false);
    setShowConfirm(false);
    setStatus(STATUS.IDLE);
    setIsTermsOpen(false);
    submittingRef.current = false;
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [mode]);

  // After a successful auth, wait 1.5s then navigate home.
  useEffect(() => {
    if (!isSuccess) return;
    const timer = setTimeout(() => {
      if (isMountedRef.current) {
        navigate('/');
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [isSuccess, navigate]);

  const copy = AUTH_COPY[mode];
  const isSignup = mode === AUTH_MODES.SIGNUP;

  const handleChange = (name) => (event) => {
    const { type, value, checked } = event.target;
    const newValue = type === 'checkbox' ? checked : value;
    setValues((prev) => ({ ...prev, [name]: newValue }));
    setErrors((prev) => {
      const next = { ...prev };
      if (next[name]) {
        delete next[name];
      }
      if (name === 'password' && prev.confirmPassword) {
        const confirmValue = values.confirmPassword;
        if (confirmValue === newValue) {
          delete next.confirmPassword;
        }
      }
      if (
        Object.keys(next).length === Object.keys(prev).length &&
        Object.keys(next).every((k) => next[k] === prev[k])
      ) {
        return prev;
      }
      return next;
    });
  };

  const { setCurrentUser } = useUser();

  const handleSubmit = (event) => {
    if (event && typeof event.preventDefault === 'function') event.preventDefault();
    if (isSubmitting || submittingRef.current) return;
    const nextErrors = validateForm(values, mode);
    setErrors(nextErrors);
    const fieldOrder = isSignup
      ? ['username', 'email', 'password', 'confirmPassword', 'acceptTerms']
      : ['email', 'password'];
    const firstInvalid = fieldOrder.find((name) => nextErrors[name]);
    if (firstInvalid) {
      const form = event && event.currentTarget ? event.currentTarget : null;
      const el = form ? form.elements[firstInvalid] : null;
      if (el && typeof el.focus === 'function') el.focus();
      return;
    }
    setStatus(STATUS.SUBMITTING);
    submittingRef.current = true;
    submitAuth().then(() => {
      submittingRef.current = false;
      if (isMountedRef.current) {
        setCurrentUser({
          username: values.username || (values.email ? values.email.split('@')[0] : 'Manga Fan'),
          email: values.email,
        });
        setStatus(STATUS.SUCCESS);
      }
    }).catch((error) => {
      submittingRef.current = false;
      if (isMountedRef.current) {
        if (error && error.code === 'email_exists') {
          setErrors((prev) => ({ ...prev, email: 'email_exists' }));
        } else if (error && error.code === 'invalid_credentials') {
          setErrors((prev) => ({ ...prev, email: 'invalid_credentials' }));
        }
        setStatus(STATUS.IDLE);
      }
    });
  };

  const handleReset = () => {
    setValues({ ...INITIAL_VALUES });
    setErrors({});
    setShowPassword(false);
    setShowConfirm(false);
    setStatus(STATUS.IDLE);
    setIsTermsOpen(false);
    submittingRef.current = false;
    navigate('/login');
    requestAnimationFrame(() => {
      const el = document.getElementById('email');
      if (el && typeof el.focus === 'function') el.focus();
    });
  };

  const openTerms = () => setIsTermsOpen(true);
  const closeTerms = () => setIsTermsOpen(false);

  const handleAcceptTerms = () => {
    setValues((prev) => ({ ...prev, acceptTerms: true }));
    setErrors((prev) => {
      if (!prev.acceptTerms) return prev;
      const next = { ...prev };
      delete next.acceptTerms;
      return next;
    });
    setIsTermsOpen(false);
  };

  const switchMode = (newMode) => {
    if (isSubmitting) return;
    const path = newMode === AUTH_MODES.SIGNUP ? '/signup' : '/login';
    navigate(path);
  };

  const isFilled = REQUIRED_FIELDS[mode].every((key) => {
    const v = values[key];
    return typeof v === 'boolean' ? v : String(v).trim() !== '';
  });

    return {
    mode,
    values,
    showPassword,
    setShowPassword,
    showConfirm,
    setShowConfirm,
    errors,
    isTermsOpen,
    isSubmitting,
    isSuccess,
    isSignup,
    copy,
    isFilled,
    handleChange,
    handleSubmit,
    handleReset,
    openTerms,
    closeTerms,
    handleAcceptTerms,
    switchMode,
  };
}

export default useAuthForm;
