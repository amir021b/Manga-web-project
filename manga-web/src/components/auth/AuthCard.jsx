import { useState, useRef, useEffect } from 'react';
import { AUTH_MODES, AUTH_COPY, TERMS_TEXT, FORGOT_PASSWORD_TEXT, REQUIRED_FIELDS, ERROR_MESSAGES, STATUS } from '../../constants/authCopy';
import { validateForm } from '../../utils/validators';
import { submitAuth } from '../../services/authApi';
import GlassCard from '../ui/GlassCard';
import Logo from '../ui/Logo';
import AuthTabs from '../ui/AuthTabs';
import FloatingInput from '../ui/FloatingInput';
import PasswordToggle from '../ui/PasswordToggle';
import Button from '../ui/Button';
import Checkbox from '../ui/Checkbox';
import LinkButton from '../ui/LinkButton';
import Collapse from '../ui/Collapse';
import SuccessMessage from './SuccessMessage';

function AuthCard() {
  const [mode, setMode] = useState(AUTH_MODES.LOGIN);
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(STATUS.IDLE);
  const isSubmitting = status === STATUS.SUBMITTING;
  const isSuccess = status === STATUS.SUCCESS;

  const isMountedRef = useRef(true);
  const successRef = useRef(null);
  const submittingRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      submittingRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (isSuccess && successRef.current) {
      successRef.current.focus();
    }
  }, [isSuccess]);

  const copy = AUTH_COPY[mode];
  const isSignup = mode === AUTH_MODES.SIGNUP;

  const handleChange = (name) => (event) => {
    const { type, value, checked } = event.target;
    const newValue = type === "checkbox" ? checked : value;
    setValues((prev) => ({ ...prev, [name]: newValue }));
    setErrors((prev) => {
      const next = { ...prev };
      // Remove this field's error if present.
      if (next[name]) {
        delete next[name];
      }
      // When password changes and confirm already has an error, re-check mismatch.
      if (name === "password" && prev.confirmPassword) {
        const confirmValue = values.confirmPassword;
        if (confirmValue === newValue) {
          delete next.confirmPassword;
        }
      }
      // Only return a new object if something changed.
      if (Object.keys(next).length === Object.keys(prev).length && Object.keys(next).every((k) => next[k] === prev[k])) {
        return prev;
      }
      return next;
    });
  };

  const handleSubmit = (event) => {
    if (event && typeof event.preventDefault === "function") event.preventDefault();
    if (isSubmitting || submittingRef.current) return;
    const nextErrors = validateForm(values, mode);
    setErrors(nextErrors);
    const fieldOrder = isSignup
      ? ["username", "email", "password", "confirmPassword", "acceptTerms"]
      : ["email", "password"];
    const firstInvalid = fieldOrder.find((name) => nextErrors[name]);
    if (firstInvalid) {
      const form = event && event.currentTarget ? event.currentTarget : null;
      const el = form ? form.elements[firstInvalid] : null;
      if (el && typeof el.focus === "function") el.focus();
      return;
    }
    setStatus(STATUS.SUBMITTING);
    submittingRef.current = true;
    submitAuth(mode, values).then(() => {
      submittingRef.current = false;
      if (isMountedRef.current) {
        setStatus(STATUS.SUCCESS);
      }
    });
  };

  const handleReset = () => {
    setValues({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    });
    setErrors({});
    setShowPassword(false);
    setShowConfirm(false);
    setStatus(STATUS.IDLE);
    setMode(AUTH_MODES.LOGIN);
    submittingRef.current = false;
    requestAnimationFrame(() => {
      const el = document.getElementById("email");
      if (el && typeof el.focus === "function") el.focus();
    });
  };

  const isFilled = REQUIRED_FIELDS[mode].every((key) => {
    const v = values[key];
    return typeof v === "boolean" ? v : String(v).trim() !== "";
  });

  if (isSuccess) {
    return (
      <GlassCard>
        <div className="mb-6">
          <Logo isFilled={true} />
        </div>
        <div ref={successRef} tabIndex={-1} className="outline-none">
          <SuccessMessage
            title={copy.successTitle}
            message={copy.successMessage}
            actionLabel={copy.successAction}
            onAction={handleReset}
          />
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard>
      <div className="mb-6">
        <Logo isFilled={isFilled} />
      </div>
      <AuthTabs mode={mode} onChange={(m) => { if (isSubmitting) return; setMode(m); setErrors({}); }} disabled={isSubmitting} />
      <div>
        <h1 className="text-2xl font-bold mb-1.5">{copy.title}</h1>
        <p className="text-sm text-[#9a9a9a] mb-6">{copy.subtitle}</p>
      </div>
      <form noValidate onSubmit={handleSubmit}>
        <Collapse open={isSignup}>
          <div className="pb-5">
            <FloatingInput
              id="username"
              name="username"
              label="Username"
              type="text"
              value={values.username}
              onChange={handleChange("username")}
              placeholder="yourname"
              autoComplete="nickname"
              disabled={isSubmitting || !isSignup}
              error={errors.username ? ERROR_MESSAGES[errors.username] : undefined}
            />
          </div>
        </Collapse>

        <div className="pb-5">
          <FloatingInput
            id="email"
            name="email"
            label="Email"
            type="email"
            value={values.email}
            onChange={handleChange("email")}
            placeholder="you@example.com"
            autoComplete={isSignup ? "email" : "username"}
            disabled={isSubmitting}
            error={errors.email ? ERROR_MESSAGES[errors.email] : undefined}
          />
        </div>

        <div className={isSignup ? "pb-5" : "pb-2"}>
          <FloatingInput
            id="password"
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            value={values.password}
            onChange={handleChange("password")}
            placeholder="At least 8 characters"
            autoComplete={isSignup ? "new-password" : "current-password"}
            disabled={isSubmitting}
            endAdornment={
              <PasswordToggle
                visible={showPassword}
                onToggle={() => setShowPassword((prev) => !prev)}
                disabled={isSubmitting}
              />
            }
            error={errors.password ? ERROR_MESSAGES[errors.password] : undefined}
          />
        </div>

        <Collapse open={isSignup}>
          <div className="pb-5">
            <FloatingInput
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm password"
              type={showConfirm ? "text" : "password"}
              value={values.confirmPassword}
              onChange={handleChange("confirmPassword")}
              placeholder="At least 8 characters"
              autoComplete="new-password"
              disabled={isSubmitting || !isSignup}
              endAdornment={
                <PasswordToggle
                  visible={showConfirm}
                  onToggle={() => setShowConfirm((prev) => !prev)}
                  disabled={isSubmitting}
                />
              }
              error={errors.confirmPassword ? ERROR_MESSAGES[errors.confirmPassword] : undefined}
            />
          </div>
        </Collapse>

        <Collapse open={isSignup}>
          <div className="pb-5">
            <Checkbox
              id="acceptTerms"
              checked={values.acceptTerms}
              onChange={handleChange("acceptTerms")}
              label={TERMS_TEXT}
              disabled={isSubmitting}
              error={errors.acceptTerms ? ERROR_MESSAGES[errors.acceptTerms] : undefined}
            />
          </div>
        </Collapse>

        <Collapse open={!isSignup}>
          <div className="pb-5">
            <div className="text-right">
              <LinkButton onClick={() => {}} disabled={isSubmitting}>
                {FORGOT_PASSWORD_TEXT}
              </LinkButton>
            </div>
          </div>
        </Collapse>

        <Button
          type="submit"
          loading={isSubmitting}
          loadingLabel={copy.loadingLabel}
        >
          {copy.submitLabel}
        </Button>

        <div className="text-center mt-5">
          <span className="text-[#9a9a9a] text-[13.5px]">{copy.swapText}</span>{" "}
          <LinkButton
            onClick={() => { if (isSubmitting) return; setMode(isSignup ? AUTH_MODES.LOGIN : AUTH_MODES.SIGNUP); setErrors({}); }}
            disabled={isSubmitting}
          >
            {copy.swapAction}
          </LinkButton>
        </div>
      </form>
    </GlassCard>
  );
}

export default AuthCard;
