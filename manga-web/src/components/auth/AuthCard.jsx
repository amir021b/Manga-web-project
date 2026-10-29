import { useAuthForm } from '../../hooks/useAuthForm';
import { AUTH_MODES, TERMS_INTRO, TERMS_LINK, FORGOT_PASSWORD_TEXT, ERROR_MESSAGES } from '../../constants/authCopy';
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
import TermsDialog from './TermsDialog';

function AuthCard() {
  const {
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
    successRef,
  } = useAuthForm();

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
      <AuthTabs mode={mode} onChange={switchMode} disabled={isSubmitting} />
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
              label={TERMS_INTRO}
              labelAction={
                <>
                  <LinkButton type="button" onClick={openTerms} disabled={isSubmitting}>
                    {TERMS_LINK}
                  </LinkButton>
                  .
                </>
              }
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
            onClick={() => switchMode(isSignup ? AUTH_MODES.LOGIN : AUTH_MODES.SIGNUP)}
            disabled={isSubmitting}
          >
            {copy.swapAction}
          </LinkButton>
        </div>
      </form>
      {isSignup ? (
        <TermsDialog
          open={isTermsOpen}
          onClose={closeTerms}
          onAccept={handleAcceptTerms}
        />
      ) : null}
    </GlassCard>
  );
}

export default AuthCard;
