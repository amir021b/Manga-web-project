"use client";

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useAuthForm } from '@/hooks/useAuthForm';
import { AUTH_MODES, TERMS_INTRO, TERMS_LINK, FORGOT_PASSWORD_TEXT, ERROR_MESSAGES } from '@/constants/authCopy';
import GlassCard from '@/components/ui/GlassCard';
import Logo from '@/components/ui/Logo';
import AuthTabs from '@/components/ui/AuthTabs';
import FloatingInput from '@/components/ui/FloatingInput';
import PasswordToggle from '@/components/ui/PasswordToggle';
import Button from '@/components/ui/Button';
import Checkbox from '@/components/ui/Checkbox';
import LinkButton from '@/components/ui/LinkButton';
import Collapse from '@/components/ui/Collapse';
import StarBackground from '@/components/layout/StarBackground';
import { useToast } from '@/context/ToastContext';
import TermsDialog from './TermsDialog';

function AuthCard() {
  const { addToast } = useToast();
  const {
    mode,
    values,
    showPassword,
    setShowPassword,
    showConfirm,
    setShowConfirm,
    errors,
    isSubmitting,
    isSuccess,
    isSignup,
    copy,
    handleChange,
    handleSubmit,
    openTerms,
    closeTerms,
    isTermsOpen,
    handleAcceptTerms,
    switchMode,
  } = useAuthForm();

  const contentRef = useRef<HTMLDivElement | null>(null);
  const heightRef = useRef<number | null>(null);
  const previousModeRef = useRef(mode);
  const [cardHeight, setCardHeight] = useState<number | null>(null);
  const [isAnimatingHeight, setIsAnimatingHeight] = useState(false);

  useEffect(() => {
    const node = contentRef.current;
    if (!node) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry || entry.contentRect.height <= 0) return;

      const nextHeight = entry.contentRect.height;
      const previousHeight = heightRef.current;

      if (previousHeight === null) {
        heightRef.current = nextHeight;
        setCardHeight(nextHeight);
        return;
      }

      if (Math.abs(nextHeight - previousHeight) < 0.5) return;

      heightRef.current = nextHeight;
      setCardHeight(nextHeight);
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setIsAnimatingHeight(true);
      }
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    if (previousModeRef.current === mode) return;
    previousModeRef.current = mode;

    const node = contentRef.current;
    if (!node) return;

    const nextHeight = node.getBoundingClientRect().height;
    const previousHeight = heightRef.current;

    if (previousHeight === null) {
      heightRef.current = nextHeight;
      setCardHeight(nextHeight);
      return;
    }

    if (Math.abs(nextHeight - previousHeight) < 0.5) return;

    heightRef.current = nextHeight;
    setCardHeight(nextHeight);
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsAnimatingHeight(true);
    }
  }, [mode]);

  const handleHeightTransitionEnd = (
    event: React.TransitionEvent<HTMLDivElement>,
  ) => {
    if (event.target !== event.currentTarget || event.propertyName !== 'height') return;
    setIsAnimatingHeight(false);
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm">
        <StarBackground />
        <div className="relative z-10 flex flex-col items-center justify-center px-6 text-center">
          <Logo className="mb-6 animate-pulse motion-reduce:animate-none" />
          <h2 className="text-2xl font-bold text-white mb-2">Welcome to MangaHub</h2>
          <p className="text-sm text-[#9a9a9a]">Redirecting you home...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`auth-card-in w-full max-w-[420px] transition-[height] duration-300 ease-in-out motion-reduce:transition-none motion-reduce:animate-none ${
        isAnimatingHeight ? 'overflow-hidden' : ''
      }`}
      style={cardHeight === null ? undefined : { height: cardHeight }}
      onTransitionEnd={handleHeightTransitionEnd}
    >
      <div ref={contentRef}>
        <GlassCard>
          <div className="fade-up mb-6 motion-reduce:animate-none" style={{ animationDelay: '80ms' }}>
            <Logo />
          </div>
          <div className="fade-up mb-6 motion-reduce:animate-none" style={{ animationDelay: '120ms' }}>
            <AuthTabs mode={mode} onChange={switchMode} disabled={isSubmitting} />
          </div>
          <div key={mode} className="tab-content-in motion-reduce:animate-none">
            <h1 className="text-2xl font-bold text-white mb-1.5">{copy.title}</h1>
            <p className="text-sm text-[#9a9a9a] mb-6">{copy.subtitle}</p>
            <form noValidate onSubmit={handleSubmit}>
              <Collapse open={isSignup}>
                <div className="pb-5">
                  <FloatingInput
                    id="username"
                    name="username"
                    type="text"
                    value={values.username}
                    onChange={handleChange("username") as (e: React.ChangeEvent<HTMLInputElement>) => void}
                    label="Username"
                    autoComplete="nickname"
                    disabled={isSubmitting || !isSignup}
                    variant="floating"
                    error={errors.username ? ERROR_MESSAGES[errors.username as keyof typeof ERROR_MESSAGES] : undefined}
                  />
                </div>
              </Collapse>

              <div className="pb-5">
                <FloatingInput
                  id="email"
                  name="email"
                  type="email"
                  value={values.email}
                  onChange={handleChange("email") as (e: React.ChangeEvent<HTMLInputElement>) => void}
                  label="Email address"
                  autoComplete={isSignup ? "email" : "username"}
                  disabled={isSubmitting}
                  variant="floating"
                  error={errors.email ? ERROR_MESSAGES[errors.email as keyof typeof ERROR_MESSAGES] : undefined}
                />
              </div>

              <div className={isSignup ? "pb-5" : "pb-2"}>
                <FloatingInput
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={values.password}
                  onChange={handleChange("password") as (e: React.ChangeEvent<HTMLInputElement>) => void}
                  label="Password"
                  autoComplete={isSignup ? "new-password" : "current-password"}
                  disabled={isSubmitting}
                  variant="floating"
                  endAdornment={
                    <PasswordToggle
                      visible={showPassword}
                      onToggle={() => setShowPassword((prev) => !prev)}
                      disabled={isSubmitting}
                    />
                  }
                  error={errors.password ? ERROR_MESSAGES[errors.password as keyof typeof ERROR_MESSAGES] : undefined}
                />
              </div>

              <Collapse open={isSignup}>
                <div className="pb-5">
                  <FloatingInput
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    value={values.confirmPassword}
                    onChange={handleChange("confirmPassword") as (e: React.ChangeEvent<HTMLInputElement>) => void}
                    label="Confirm password"
                    autoComplete="new-password"
                    disabled={isSubmitting || !isSignup}
                    variant="floating"
                    endAdornment={
                      <PasswordToggle
                        visible={showConfirm}
                        onToggle={() => setShowConfirm((prev) => !prev)}
                        disabled={isSubmitting}
                      />
                    }
                    error={errors.confirmPassword ? ERROR_MESSAGES[errors.confirmPassword as keyof typeof ERROR_MESSAGES] : undefined}
                  />
                </div>
              </Collapse>

              <Collapse open={isSignup}>
                <div className="pb-5">
                  <Checkbox
                    id="acceptTerms"
                    checked={values.acceptTerms}
                    onChange={() =>
                      handleChange("acceptTerms")({
                        target: {
                          type: "checkbox",
                          checked: !values.acceptTerms,
                        },
                      } as React.ChangeEvent<HTMLInputElement>)
                    }
                    label={TERMS_INTRO}
                    labelAction={
                      <>
                        <LinkButton type="button" onClick={openTerms} disabled={isSubmitting}>{TERMS_LINK}</LinkButton>
                      </>
                    }
                    disabled={isSubmitting}
                    error={errors.acceptTerms ? ERROR_MESSAGES[errors.acceptTerms as keyof typeof ERROR_MESSAGES] : undefined}
                  />
                </div>
              </Collapse>

              <Collapse open={!isSignup}>
                <div className="mt-3 mb-5">
                  <div className="flex justify-end">
                    <LinkButton
                      onClick={() =>
                        addToast(
                          "Password reset unavailable",
                          "Password reset is not available in this preview.",
                        )
                      }
                      disabled={isSubmitting}
                    >
                      {FORGOT_PASSWORD_TEXT}
                    </LinkButton>
                  </div>
                </div>
              </Collapse>

              <Button
                type="submit"
                loading={isSubmitting}
                loadingLabel={copy.loadingLabel}
                className="mt-2 rounded-full"
              >
                {copy.submitLabel} →
              </Button>

              <div className="relative my-5 flex items-center">
                <div className="flex-grow border-t border-white/10" />
                <span className="mx-4 bg-[var(--mh-gradient-bg)] px-2 text-xs uppercase tracking-wider text-zinc-400">
                  or
                </span>
                <div className="flex-grow border-t border-white/10" />
              </div>

              <div className="text-center mt-5">
                <span className="text-[#9a9a9a] text-[13.5px]">{copy.swapText}</span>{" "}
                <LinkButton
                  onClick={() => switchMode(isSignup ? AUTH_MODES.LOGIN : AUTH_MODES.SIGNUP)}
                  disabled={isSubmitting}
                >
                  {copy.swapAction}
                </LinkButton>
              </div>
            </form>
          </div>
          {isSignup ? (
            <TermsDialog
              open={isTermsOpen}
              onClose={closeTerms}
              onAccept={handleAcceptTerms}
            />
          ) : null}
        </GlassCard>
      </div>
    </div>
  );
}

export default AuthCard;
